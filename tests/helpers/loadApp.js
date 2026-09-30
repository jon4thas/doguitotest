/**
 * Carrega o index.html + app.js do Doguito PetShop dentro do jsdom do Jest.
 *
 * O app.js original NÃO é modificado: ele é executado dentro de uma função
 * (new Function) para que cada teste comece com estado limpo (clientes, pets,
 * produtos e carrinho vazios) e para que possamos ler as variáveis internas.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const FUNCOES = [
  'criarCliente', 'renderClientes',
  'cadastrarPet', 'renderPets',
  'criarProduto', 'renderProdutos',
  'adicionarCarrinho', 'removerCarrinho', 'renderCarrinho',
  'calcularTotal', 'finalizarCompra',
  'nextSlide', 'prevSlide', 'updateSlide',
];

// O jsdom não implementa `innerText` (o app.js usa). Aqui ele passa a se
// comportar como no navegador, mapeando para textContent.
if (!Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText')) {
  Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
    configurable: true,
    get() { return this.textContent; },
    set(valor) { this.textContent = valor; },
  });
}

function montarDom() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const body = html
    .match(/<body[^>]*>([\s\S]*)<\/body>/i)[1]
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  document.body.innerHTML = body;

  // Reproduz o comportamento do navegador em que todo elemento com id vira
  // uma variável global (ex.: clienteNome, listaCarrinho...), usado pelo app.js.
  document.querySelectorAll('[id]').forEach((el) => {
    Object.defineProperty(window, el.id, {
      configurable: true,
      get: () => document.getElementById(el.id),
    });
  });
}

function loadApp() {
  montarDom();
  window.alert = jest.fn();

  const code = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const exportar = FUNCOES.map((f) => `${f}`).join(', ');
  const factory = new Function(`
    ${code}
    ;return {
      ${exportar},
      get clientes() { return clientes },
      get pets() { return pets },
      get produtos() { return produtos },
      get carrinho() { return carrinho },
      get slideIndex() { return slideIndex },
    };
  `);
  const app = factory();

  // Expõe as funções globalmente, como no navegador (usadas pelos onclick="...").
  FUNCOES.forEach((f) => { window[f] = app[f]; });

  return app;
}

/* ---------- helpers de preenchimento de formulário ---------- */
const $ = (id) => document.getElementById(id);

function preencherCliente({ nome = '', email = '', vip = false } = {}) {
  $('clienteNome').value = nome;
  $('clienteEmail').value = email;
  $('clienteVip').checked = vip;
}

function preencherPet({ nome = '', tipo = '', idade = '' } = {}) {
  $('petNome').value = nome;
  $('petTipo').value = tipo;
  $('petIdade').value = String(idade);
}

function preencherProduto({ nome = '', preco = '' } = {}) {
  $('produtoNome').value = nome;
  $('produtoPreco').value = String(preco);
}

module.exports = { loadApp, $, preencherCliente, preencherPet, preencherProduto };
