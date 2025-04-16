// js/utils/domUtils.js
'use strict';

let statusTimeout;

/**
 * Exibe uma mensagem de status temporária na interface.
 * Busca o elemento #status-message a cada chamada para garantir que ele exista.
 *
 * @param {string} message - A mensagem a ser exibida.
 * @param {'info' | 'success' | 'error'} [type='info'] - O tipo da mensagem para estilização CSS.
 * @param {number} [duration=3500] - Duração da exibição em milissegundos.
 */
export const showStatusMessage = (message, type = 'info', duration = 3500) => {
    const statusElement = document.getElementById('status-message');
    if (!statusElement) {
        console.error("Elemento #status-message não encontrado no DOM!");
        return;
    }

    clearTimeout(statusTimeout);
    statusElement.textContent = message;
    // Garante que apenas as classes 'show' e o tipo atual estejam presentes
    statusElement.className = `show ${type}`;

    statusTimeout = setTimeout(() => {
        statusElement.classList.remove('show');
        // Espera a animação de fade-out terminar antes de limpar o texto (opcional)
        // setTimeout(() => {
        //     if (!statusElement.classList.contains('show')) { // Verifica se outra msg não apareceu
        //         statusElement.textContent = '';
        //         statusElement.className = '';
        //     }
        // }, 500); // Tempo da transição de opacidade no CSS
    }, duration);
};

/**
 * Adiciona uma classe de erro a um input e foca nele.
 * @param {HTMLInputElement | HTMLSelectElement} inputElement - O elemento do input.
 * @param {string} [errorClass='is-invalid'] - A classe CSS para indicar erro.
 */
export const markInputError = (inputElement, errorClass = 'is-invalid') => {
    if (inputElement) {
        inputElement.classList.add(errorClass);
        inputElement.focus();
        // Remove a classe de erro quando o usuário interagir novamente
        inputElement.addEventListener('input', () => {
            inputElement.classList.remove(errorClass);
        }, { once: true }); // Listener é removido após a primeira interação
    }
};

/**
 * Remove a classe de erro de um input.
 * @param {HTMLInputElement | HTMLSelectElement} inputElement - O elemento do input.
 * @param {string} [errorClass='is-invalid'] - A classe CSS de erro.
 */
export const clearInputError = (inputElement, errorClass = 'is-invalid') => {
     if (inputElement) {
        inputElement.classList.remove(errorClass);
     }
};

/**
 * Limpa as classes de erro de todos os inputs dentro de um formulário.
 * @param {HTMLFormElement} formElement - O elemento do formulário.
 * @param {string} [errorClass='is-invalid'] - A classe CSS de erro.
 */
export const clearFormErrors = (formElement, errorClass = 'is-invalid') => {
    if(formElement) {
        formElement.querySelectorAll(`.${errorClass}`).forEach(el => el.classList.remove(errorClass));
    }
}