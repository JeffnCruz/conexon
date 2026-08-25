# TODO — Fluxa: Problemas para Fases Posteriores

Itens identificados na auditoria do `HTML site.txt` e intencionalmente **não corrigidos** nesta fase de
reestruturação. O código foi movido como estava. Cada item tem a localização no HTML original como referência.

---

## 🔴 Funcionalidades inoperantes (JavaScript ausente)

### 1. Toggle de faturamento mensal/anual — `js/pricing-toggle.js`
- **Localização original:** linha 1329 do `index.html`
- **Problema:** O botão `<button type="button" aria-pressed="true">` existe no HTML com aparência
  de "ativo no modo anual", mas **nenhum JavaScript alterna os preços**. Os valores `$99`, `$299`,
  `$custom` são hardcoded e não mudam ao clicar.
- **O que precisa:** Handler que lê `aria-pressed`, alterna os preços exibidos (mensais vs. anuais,
  considerando desconto de 20% conforme o badge "Save 20%"), e atualiza o estado visual do toggle.

### 2. Menu mobile (hamburguer) — `js/mobile-menu.js`
- **Localização original:** linha 136 do `index.html`
- **Problema:** O botão `<button aria-label="Open menu">` abre zero coisa. Não há overlay, drawer
  ou lista de links mobile. O nav principal (`xl:flex`) simplesmente some em telas menores.
- **O que precisa:** Lógica de abrir/fechar um menu mobile (drawer, overlay ou dropdown), com
  gestão de `aria-expanded`, `aria-controls` e trap de foco para acessibilidade.

### 3. Newsletter / Subscribe — `js/newsletter.js`
- **Localização original:** linhas 2127–2137 do `index.html`
- **Problema:** O `<input type="email">` e o `<button>Subscribe</button>` não têm nenhum handler.
  Submeter o formulário não faz nada.
- **O que precisa:** Validação de e-mail + integração com serviço de e-mail marketing (Mailchimp,
  Resend, Loops etc.) ou endpoint de API próprio.

---

## 🟡 Erros semânticos / estruturais (não corrigidos nesta fase)

### 4. `<main>` fecha antes de metade do conteúdo
- **Localização:** linha 465 do `index.html`
- **Problema:** A tag `</main>` fecha logo após a seção de logos/marquee. As seções Features,
  How it Works, Testimonials, Pricing, FAQ e Footer ficam **fora do `<main>`**, em `<section>`
  soltas no `<body>`.
- **Impacto:** Semântica incorreta, leitores de tela não identificam o conteúdo principal.
- **Correção futura:** Mover `</main>` para antes do `<footer>`.

### 5. `<footer>` aninhado dentro de `<footer>`
- **Localização:** linha 2095 do `index.html`
- **Problema:** O rodapé bento (newsletter + links + legal) é um segundo `<footer>` dentro do
  `<footer>` externo — HTML inválido.
- **Correção futura:** Trocar o `<footer>` interno por `<div>`.

---

## 🟡 Código morto / redundante

### 6. `lucide.createIcons()` chamado duas vezes
- **Localização:** linhas 2413 e 2505 do `index.html`
- **Problema:** A linha 2413 chama `lucide.createIcons({ attrs: { "stroke-width": 1.5 } })`.
  A linha 2505 chama `lucide.createIcons()` novamente, sem parâmetros — foi adicionada
  manualmente durante a extração do template e duplica a inicialização.
- **Correção futura:** Remover a segunda chamada (linha 2505) e manter apenas a parametrizada.
  Isso já está corrigido nos arquivos JS modulares (`js/lucide-init.js`).

---

## 🟢 Decisões de design abertas

### 7. `lang="pt-BR"` vs `lang="en"`
- **Situação:** O conteúdo do site é integralmente em inglês, mas o atributo `lang="pt-BR"` foi
  aplicado conforme solicitado.
- **Ação necessária:** Confirmar se o site será traduzido para português ou se `lang="en"` é o
  correto. Leitores de tela e mecanismos de busca usam esse atributo para pronúncia e indexação.

### 8. Imagens de avatar de testemunhos — URLs externas
- **Localização:** linhas 1191, 1214, 1235, 1260 do `index.html`
- **Problema:** Fotos de Maya Chen, Arjun Patel, Elena Rodriguez e David Park apontam para
  domínios externos (Supabase Storage e Unsplash). Se esses domínios ficarem indisponíveis,
  as imagens somem.
- **Correção futura:** Baixar as imagens, salvar em `assets/images/avatars/` e atualizar os `src`.

---

_Última atualização: 2026-08-13 — Fase de reestruturação inicial_
