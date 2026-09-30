const { loadApp, $ } = require('../helpers/loadApp');

// Cadastra produtos diretamente no estado e renderiza o select
function seedProdutos(app, lista) {
  lista.forEach((p) => app.produtos.push(p));
  app.renderProdutos();
}

function adicionar(app, indice) {
  $('produtoSelect').value = String(indice);
  app.adicionarCarrinho();
}

describe('Testes de Carrinho', () => {
  let app;
  beforeEach(() => {
    app = loadApp();
    seedProdutos(app, [
      { nome: 'Ração', preco: 40 },
      { nome: 'Coleira', preco: 30 },
    ]);
  });

  test('14. Deve permitir adicionar produto ao carrinho', () => {
    adicionar(app, 0);

    expect(app.carrinho).toHaveLength(1);
    expect(app.carrinho[0].nome).toBe('Ração');
  });

  test('15. Deve permitir remover produto do carrinho', () => {
    adicionar(app, 0);
    adicionar(app, 1);
    app.removerCarrinho();

    expect(app.carrinho).toHaveLength(1);
    expect($('listaCarrinho').children).toHaveLength(1);
  });

  test('15b. Remover com carrinho vazio não deve gerar erro', () => {
    expect(() => app.removerCarrinho()).not.toThrow();
    expect(app.carrinho).toHaveLength(0);
  });

  test('16. Carrinho deve listar todos os produtos adicionados', () => {
    adicionar(app, 0);
    adicionar(app, 1);
    adicionar(app, 0);

    const itens = Array.from($('listaCarrinho').children).map((li) => li.textContent);
    expect(itens).toEqual(['Ração - 40', 'Coleira - 30', 'Ração - 40']);
  });

  test('17. Carrinho deve calcular o valor total da compra', () => {
    adicionar(app, 0); // 40
    adicionar(app, 1); // 30

    expect(app.calcularTotal()).toBe('70.00');
    expect($('total').textContent).toBe('70.00');
  });
});
