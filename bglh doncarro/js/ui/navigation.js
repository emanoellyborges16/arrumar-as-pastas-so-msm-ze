// js/ui/navigation.js
'use strict';

/**
 * Gerencia a troca de seções visíveis e o estado ativo dos links de navegação.
 *
 * @param {string} targetId - O ID da seção de conteúdo a ser ativada.
 * @param {NodeListOf<Element>} contentSections - Uma NodeList de todos os elementos de seção de conteúdo.
 * @param {NodeListOf<Element>} navLinks - Uma NodeList de todos os links de navegação (`<a>`).
 */
export const setActiveSection = (targetId, contentSections, navLinks) => {
    let sectionFound = false;
    contentSections.forEach(section => {
        const isActive = section.id === targetId;
        section.classList.toggle('active-section', isActive);
        if (isActive) sectionFound = true;
    });

    if (!sectionFound) {
        console.warn(`Nenhuma seção encontrada com o ID: ${targetId}. Mostrando a primeira seção.`);
        // Fallback: mostra a primeira seção se a targetId for inválida
         if (contentSections.length > 0) {
            contentSections[0].classList.add('active-section');
            targetId = contentSections[0].id; // Atualiza targetId para o fallback
         }
    }

    navLinks.forEach(link => {
        // Compara o data-target do link com o ID da seção que está *realmente* ativa
        link.classList.toggle('active-link', link.dataset.target === targetId);
    });
};