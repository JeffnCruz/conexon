/**
 * lucide-init.js
 * Inicializa a biblioteca Lucide Icons com os atributos globais do projeto.
 *
 * Depende da variável global `lucide` exposta pelo CDN:
 *   <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
 *
 * stroke-width 1.5 é o valor padrão visual do template original.
 * No index.html de origem havia uma segunda chamada sem parâmetros (linha 2505)
 * que foi removida — ver TODO.md item #6.
 */
export function initLucide() {
  lucide.createIcons({
    attrs: {
      'stroke-width': 1.5,
    },
  });
}
