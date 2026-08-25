/**
 * main.js
 * Ponto de entrada JavaScript do projeto.
 * Importa e inicializa todos os módulos de comportamento.
 *
 * Carregado no index.html como ES module após os scripts CDN:
 *   <script type="module" src="js/main.js"></script>
 *
 * Ordem de execução:
 *   1. lucide-init  — inicializa ícones (depende do global `lucide` do CDN)
 *   2. gsap-reveal  — registra ScrollTrigger e dispara animações (depende de `gsap`)
 *   3. pricing-toggle — stub inoperante, sem efeito
 *   4. mobile-menu    — stub inoperante, sem efeito
 *   5. newsletter     — stub inoperante, sem efeito
 *
 * Os scripts CDN (Lucide e GSAP) devem estar carregados antes deste módulo.
 * Como <script type="module"> é sempre deferido, e os CDNs são scripts regulares
 * sem defer posicionados antes deste tag no HTML, a ordem é garantida.
 */

import { initLucide }        from './lucide-init.js';
import { initGsapReveal }    from './gsap-reveal.js';
import { initPricingToggle } from './pricing-toggle.js';
import { initMobileMenu }    from './mobile-menu.js';
import { initNewsletter }    from './newsletter.js';

// Lucide não precisa aguardar DOMContentLoaded pois o módulo já é deferido
initLucide();

// GSAP e ScrollTrigger também já estão disponíveis quando o módulo executa
document.addEventListener('DOMContentLoaded', () => {
  initGsapReveal();
  initPricingToggle();
  initMobileMenu();
  initNewsletter();
});
