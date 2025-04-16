
'use strict';
// Nota: Idealmente, a comunicação de erro deveria ser feita lançando exceções
// e o chamador (main.js) decidiria como mostrar na UI.
// Mas para simplificar, chamamos showStatusMessage diretamente aqui,
// assumindo que estará disponível quando necessário.
import { showStatusMessage } from './domUtils.js';

/**
 * Obtém dados do LocalStorage de forma segura.
 * @param {string} key - A chave do LocalStorage.
 * @returns {Array} Os dados desserializados ou um array vazio em caso de erro ou ausência.
 * @throws {Error} Lança erro se a chave não for uma string válida (opcional, mas boa prática).
 */
export const getData = (key) => {
    if (typeof key !== 'string' || key.trim() === '') {
        console.error("Chave inválida fornecida para getData:", key);
        // throw new Error("Chave inválida para getData"); // Alternativa mais estrita
        return [];
    }
    try {
        const data = localStorage.getItem(key);
        // Retorna array vazio se não houver dados ou se os dados forem 'null' ou 'undefined' string
        return data && data !== 'null' && data !== 'undefined' ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Erro ao ler ou parsear dados do LocalStorage (chave: ${key}):`, error);
        // Tenta notificar o usuário
        try {
            showStatusMessage(`Erro ao carregar dados (${key}). Verifique o console.`, 'error', 5000);
        } catch (uiError) {
            console.error("Erro ao tentar mostrar mensagem de erro do storage:", uiError);
        }
        // Retorna um array vazio para permitir que a aplicação continue em um estado seguro
        return [];
    }
};

/**
 * Salva dados no LocalStorage de forma segura.
 * @param {string} key - A chave do LocalStorage.
 * @param {any} data - Os dados a serem salvos (geralmente um array ou objeto).
 * @returns {boolean} True se salvou com sucesso, False caso contrário.
 * @throws {Error} Lança erro se a chave não for válida ou se os dados não puderem ser serializados (opcional).
 */
export const saveData = (key, data) => {
     if (typeof key !== 'string' || key.trim() === '') {
        console.error("Chave inválida fornecida para saveData:", key);
        // throw new Error("Chave inválida para saveData");
        return false;
    }
    try {
        // Trata 'undefined' explicitamente, pois JSON.stringify o remove de arrays/objetos
        const dataToSave = data === undefined ? null : data;
        localStorage.setItem(key, JSON.stringify(dataToSave));
        return true;
    } catch (error) {
        console.error(`Erro ao salvar dados no LocalStorage (chave: ${key}):`, error);
        // Tenta notificar o usuário
         try {
            // Verifica se é um erro de quota excedida
            if (error.name === 'QuotaExceededError') {
                 showStatusMessage(`Erro: Não há espaço suficiente para salvar os dados. (${key})`, 'error', 5000);
            } else {
                showStatusMessage(`Erro ao salvar dados (${key}). Verifique o console.`, 'error', 5000);
            }
        } catch (uiError) {
             console.error("Erro ao tentar mostrar mensagem de erro do storage:", uiError);
        }
        return false;
    }
};