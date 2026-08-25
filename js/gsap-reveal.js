/**
 * gsap-reveal.js
 * Animações de scroll reveal para headings (h1, h2) e elementos gerais.
 *
 * Comportamento extraído do bloco <script> inline do index.html (linhas 2422–2502).
 * Nenhuma lógica foi alterada — refactor puro.
 *
 * Depende das variáveis globais `gsap` e `ScrollTrigger` expostas pelos CDNs:
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
 *
 * Como funciona:
 *   1. wrapWords() percorre recursivamente os nós de texto de um elemento
 *      e envolve cada palavra em <span class="gsap-reveal-word">, que é
 *      o alvo da animação. A guarda classList.contains('gsap-reveal-word')
 *      impede reprocessamento duplo.
 *   2. Todos os h1 e h2 recebem a animação word-by-word (stagger).
 *   3. Parágrafos, artigos, imagens, h3/h4 e details recebem fade-in simples,
 *      exceto os que estão dentro de header ou nav.
 */
export function initGsapReveal() {
  function revealAllFallback() {
    document.querySelectorAll('.gsap-reveal-word').forEach(el => {
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.gsap-reveal-outer').forEach(el => {
      el.style.overflow = 'visible';
    });
    document.querySelectorAll('*').forEach(el => {
      const style = el.getAttribute('style');
      if (style && (style.includes('opacity: 0') || style.includes('opacity:0') || style.includes('blur('))) {
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      }
    });
  }

  // Fallback de segurança de 2 segundos
  setTimeout(revealAllFallback, 2000);

  // Disparador de segurança ao scrollar próximo ao rodapé
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 120)) {
      revealAllFallback();
    }
  }, { passive: true });

  try {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      revealAllFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    function wrapWords(node) {
      if (
        node.nodeName === 'SCRIPT' ||
        node.nodeName === 'STYLE' ||
        node.classList?.contains('gsap-reveal-word')
      ) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;

        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(word => {
          if (word.trim()) {
            const outer = document.createElement('span');
            outer.className           = 'gsap-reveal-outer';
            outer.style.display       = 'inline-block';
            outer.style.overflow      = 'hidden';
            outer.style.verticalAlign = 'bottom';
            outer.style.paddingTop    = '0.22em';
            outer.style.paddingBottom = '0.22em';
            outer.style.paddingRight  = '0.12em';
            outer.style.marginTop     = '-0.22em';
            outer.style.marginBottom  = '-0.22em';
            outer.style.marginRight   = '-0.12em';

            const inner = document.createElement('span');
            inner.style.display    = 'inline-block';
            inner.className        = 'gsap-reveal-word';
            inner.textContent      = word;
            inner.style.willChange = 'transform, opacity, filter';

            outer.appendChild(inner);
            fragment.appendChild(outer);
          } else {
            fragment.appendChild(document.createTextNode(word));
          }
        });

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(wrapWords);
      }
    }

    // ── Heading reveal (word-by-word stagger) ──────────────────────────────
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
      if (heading.closest('#cookie-consent-banner')) return;
      wrapWords(heading);
      const words = heading.querySelectorAll('.gsap-reveal-word');
      if (words.length === 0) return;

      gsap.fromTo(
        words,
        { y: '120%', opacity: 0, filter: 'blur(10px)' },
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Fade-in de elementos gerais ────────────────────────────────────────
    const fadeElements = document.querySelectorAll(
      'main p:not(.hidden):not([id^="err-"]), article, section .group:not(a), h3, h4, details'
    );
    fadeElements.forEach(el => {
      if (el.closest('header') || el.closest('nav') || el.closest('footer') || el.closest('#cookie-consent-banner') || el.classList.contains('hidden')) return;

      gsap.fromTo(
        el,
        { y: 35, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Fade-in suave do footer e proposta ─────────────────────────────────
    const bottomSections = document.querySelectorAll('#proposta, footer');
    bottomSections.forEach(section => {
      gsap.fromTo(section,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 96%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    ScrollTrigger.refresh();
  } catch (err) {
    console.error('Erro na inicialização do GSAP:', err);
    revealAllFallback();
  }
}
