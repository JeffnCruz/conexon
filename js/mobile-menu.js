/**
 * mobile-menu.js
 * Gerenciamento completo do menu mobile (abertura, fechamento, acessibilidade e rolagem).
 */

export function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  const menuIconOpen = toggleBtn.querySelector('.menu-icon-open');
  const menuIconClose = toggleBtn.querySelector('.menu-icon-close');
  const menuLinks = mobileMenu.querySelectorAll('a');

  let isOpen = false;

  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    // Exibe o painel
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');

    // Atualiza estado e acessibilidade do botão
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Fechar menu de navegação');

    // Alterna ícones (Hamburguer -> X)
    if (menuIconOpen && menuIconClose) {
      menuIconOpen.classList.add('hidden');
      menuIconClose.classList.remove('hidden');
    }

    // Bloqueia rolagem da página
    document.body.style.overflow = 'hidden';

    // Animação GSAP com fallback gracioso para CSS/exibição direta
    if (window.gsap) {
      window.gsap.fromTo(
        mobileMenu,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    } else {
      mobileMenu.style.opacity = '1';
      mobileMenu.style.transform = 'translateY(0)';
    }

    // Move o foco para o primeiro item de navegação
    const firstLink = menuLinks[0];
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 60);
    }
  }

  function closeMenu(returnFocusToToggle = false) {
    if (!isOpen) return;
    isOpen = false;

    // Atualiza estado e acessibilidade do botão
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');

    // Alterna ícones (X -> Hamburguer)
    if (menuIconOpen && menuIconClose) {
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    }

    // Desbloqueia rolagem da página
    document.body.style.overflow = '';

    const finalizeClose = () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
      if (returnFocusToToggle) {
        toggleBtn.focus();
      }
    };

    if (window.gsap) {
      window.gsap.to(mobileMenu, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: finalizeClose
      });
    } else {
      finalizeClose();
    }
  }

  // Abertura/fechamento ao clicar no botão hamburguer
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  // Fechar ao clicar em qualquer item do menu e rolar suavemente até a âncora
  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      closeMenu(false);

      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }
    });
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu(false);
    }
  });

  // Fechar ao pressionar a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      closeMenu(true);
    }
  });

  // Trap de foco simples para acessibilidade (tecla Tab)
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusables = Array.from(menuLinks);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Fechar automaticamente se a janela for redimensionada para telas desktop (>= 1280px / xl)
  window.addEventListener('resize', () => {
    if (isOpen && window.innerWidth >= 1280) {
      closeMenu(false);
    }
  });
}

if (typeof window !== 'undefined') {
  window.initMobileMenu = initMobileMenu;
}
