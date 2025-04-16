// js/utils/validators.js
'use strict';

/**
 * Valida se uma string de placa normalizada corresponde ao padrão antigo ou Mercosul.
 * @param {string} placaNormalizada - Placa em maiúsculas, sem espaços/hífen (ex: 'ABC1D23').
 * @returns {boolean} True se o formato for válido, False caso contrário.
 */
export const validarFormatoPlaca = (placaNormalizada) => {
    if (!placaNormalizada || typeof placaNormalizada !== 'string') return false;
    const placaAntigaPattern = /^[A-Z]{3}[0-9]{4}$/;
    const placaMercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return placaAntigaPattern.test(placaNormalizada) || placaMercosulPattern.test(placaNormalizada);
};

/**
 * Verifica se uma string está no formato 'YYYY-MM-DD' e representa uma data válida.
 * @param {string | null | undefined} dateString - A string da data.
 * @returns {boolean} True se a data for válida e no formato correto.
 */
export const isValidDateString = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false; // Formato básico incorreto
    }
    try {
        // Cria a data em UTC para evitar problemas de fuso
        const date = new Date(dateString + 'T00:00:00Z');
        // Verifica se o objeto Date é válido E se o ano/mês/dia correspondem à string original
        // Isso pega casos como '2023-02-30' que o Date pode 'corrigir' para Março
        return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
    } catch (e) {
        return false; // Erro no construtor Date
    }
};

/**
 * Verifica se uma data (no formato 'YYYY-MM-DD') é igual ou posterior à data atual (sem considerar hora).
 * @param {string} dateString - A string da data.
 * @returns {boolean} True se a data for hoje ou futura, False caso contrário ou se a data for inválida.
 */
export const isTodayOrFuture = (dateString) => {
    if (!isValidDateString(dateString)) return false;

    try {
        // Obtém a data de hoje em UTC, zerando as horas
        const hoje = new Date();
        hoje.setUTCHours(0, 0, 0, 0);

        // Obtém a data selecionada em UTC
        const dataSelecionada = new Date(dateString + 'T00:00:00Z');

        return dataSelecionada >= hoje;
    } catch(e) {
        console.error("Erro ao comparar datas:", dateString, e);
        return false;
    }
};

/**
 * Valida se um valor representa um ano de veículo razoável.
 * @param {number | string | null | undefined} year - O ano a ser validado.
 * @param {number} [minYear=1900] - Ano mínimo aceitável.
 * @param {number} [maxYearOffset=1] - Quantos anos no futuro são aceitáveis (ex: 1 para permitir ano atual + 1).
 * @returns {boolean} True se o ano for válido, False caso contrário.
 */
export const isValidVehicleYear = (year, minYear = 1900, maxYearOffset = 1) => {
    if (year === null || year === undefined || year === '') return false;
    const numYear = Number(year);
    if (isNaN(numYear) || !Number.isInteger(numYear)) return false;

    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + maxYearOffset;

    return numYear >= minYear && numYear <= maxYear;
}