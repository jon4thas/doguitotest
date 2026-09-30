const { loadApp, $, preencherProduto } = require('../helpers/loadApp');

describe('Testes de Produto', () => {
  let app;
  beforeEach(() => { app = loadApp(); });

  test('10. Deve permitir criar produto com nome', () => {
    preencherProduto({ nome: 'Ração', preco: 50 });
    app.criarProduto();

    expect(app.produtos).toHaveLength(1);
    expect(app.produtos[0].nome).toBe('Ração');
  });

  test('10b. Não deve permitir criar produto sem nome', () => {
    preencherProduto({ nome: '', preco: 50 });
    app.criarProduto();

    expect(app.produtos).toHaveLength(0);
  });

  test('11. Produto deve possuir preço maior que zero', () => {
    preencherProduto({ nome: 'Ração', preco: 25.5 });
    app.criarProduto();
    expect(app.produtos[0].preco).toBe(25.5);
    expect(app.produtos[0].preco).toBeGreaterThan(0);

    // preço zero não deve ser aceito
    preencherProduto({ nome: 'Brinde', preco: 0 });
    app.criarProduto();
    expect(app.produtos).toHaveLength(1);
  });

  test('12. Produto não pode possuir preço negativo', () => {
    preencherProduto({ nome: 'Osso', preco: -10 });
    app.criarProduto();

    expect(app.produtos).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith('Preço inválido');
  });

  test('13. Produto deve aparecer na lista de produtos cadastrados', () => {
    preencherProduto({ nome: 'Ração', preco: 50 });
    app.criarProduto();
    preencherProduto({ nome: 'Coleira', preco: 30 });
    app.criarProduto();

    const itens = $('listaProdutos').children;
    expect(itens).toHaveLength(2);
    expect(itens[0].textContent).toBe('Ração - R$ 50');
    expect(itens[1].textContent).toBe('Coleira - R$ 30');
    // também deve aparecer no <select> do carrinho
    expect($('produtoSelect').options).toHaveLength(2);
  });
});
