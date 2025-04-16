// js/utils/formatters.js
'use strict';

/**
 * Normaliza uma string de placa: remove espaços/hífen e converte para maiúsculas.
 * Retorna string vazia se a entrada for inválida.
 * @param {string | null | undefined} placaInput - A placa vinda do usuário.
 * @returns {string} A placa normalizada (ex: 'ABC1D23') ou ''.
 */
export const normalizarPlaca = (placaInput) => {
    if (!placaInput || typeof placaInput !== 'string') return '';
    return placaInput.trim().toUpperCase().replace(/[-\s]/g, '');
};

/**
 * Formata uma placa normalizada para exibição amigável.
 * Adiciona hífen para placas no padrão antigo (AAA-1234).
 * Mantém o formato Mercosul como está (AAA1B23).
 * Retorna string vazia se a entrada for inválida.
 * @param {string | null | undefined} placaNormalizada - Placa normalizada (ex: 'ABC1234' ou 'ABC1D23').
 * @returns {string} Placa formatada (ex: 'ABC-1234' ou 'ABC1D23') ou ''.
 */
export const formatarPlacaDisplay = (placaNormalizada) => {
    if (!placaNormalizada || typeof placaNormalizada !== 'string') return '';

    if (/^[A-Z]{3}[0-9]{4}$/.test(placaNormalizada)) {
         // Padrão antigo: adiciona hífen
         return `${placaNormalizada.substring(0, 3)}-${placaNormalizada.substring(3)}`;
    } else if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(placaNormalizada)) {
        // Padrão Mercosul: retorna como está
        return placaNormalizada;
    }
    // Se não corresponder a nenhum padrão conhecido, retorna a entrada original (pode ser útil para debug)
    // Ou poderia retornar '' se preferir estritamente formatar padrões conhecidos.
    console.warn(`Tentando formatar placa com padrão desconhecido: ${placaNormalizada}`);
    return placaNormalizada;
};

/**
 * Formata um valor numérico como moeda brasileira (R$).
 * Retorna uma string vazia se o valor for inválido, nulo ou indefinido.
 * @param {number | string | null | undefined} value - O valor a ser formatado.
 * @returns {string} O valor formatado (ex: 'R$ 150,50') ou ''.
 */
export const formatarCusto = (value) => {
    if (value === null || value === undefined || value === '') return '';

    // Tenta converter string para número (removendo pontos e trocando vírgula por ponto)
    let numValue = typeof value === 'string'
        ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
        : Number(value);

    if (isNaN(numValue)) {
        return ''; // Retorna vazio se não for um número válido
    }

    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Formata uma string de data (esperada como 'YYYY-MM-DD') para o formato 'DD/MM/YYYY'.
 * Retorna 'Data inválida' se a entrada não for uma data válida ou estiver no formato incorreto.
 * @param {string | null | undefined} dateString - Data no formato 'YYYY-MM-DD'.
 * @returns {string} Data formatada (ex: '25/12/2024') ou 'Data inválida'.
 */
export const formatarData = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return 'Data inválida';
    }
    try {
        // Adicionar T00:00:00Z força UTC e evita problemas de fuso que podem mudar o dia
        const date = new Date(dateString + 'T00:00:00Z');
        if (isNaN(date.getTime())) {
             return 'Data inválida';
        }
        // getUTCDate, getUTCMonth, getUTCFullYear garantem que pegamos a data correta independente do fuso do browser
        const dia = String(date.getUTCDate()).padStart(2, '0');
        const mes = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês é base 0
        const ano = date.getUTCFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch (e) {
        console.error("Erro ao formatar data:", dateString, e);
        return 'Data inválida';
    }
};