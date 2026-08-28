/**
 * main.js
 * Ponto de entrada JavaScript do projeto.
 * Importa e inicializa todos os módulos de comportamento.
 *
 * Carregado no index.html como ES module após os scripts CDN:
 *   <script type="module" src="js/main.js"></script>
 */

import { initLucide }        from './lucide-init.js';
import { initGsapReveal }    from './gsap-reveal.js';
import { initPricingToggle } from './pricing-toggle.js';
import { initMobileMenu }    from './mobile-menu.js';
import { initNewsletter }    from './newsletter.js';

initLucide();

function runInits() {
  initGsapReveal();
  initPricingToggle();
  initMobileMenu();
  initNewsletter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInits);
} else {
  runInits();
}
