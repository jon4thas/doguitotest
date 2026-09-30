const { loadApp, $ } = require('../helpers/loadApp');

function comProdutosNoCarrinho(app, precos) {
  precos.forEach((preco, i) => app.carrinho.push({ nome: `P${i}`, preco }));
  return app.calcularTotal();
}

describe('Testes de Regras de Negócio', () => {
  let app;
  beforeEach(() => { app = loadApp(); });

  test('18. Compra acima de R$100 deve aplicar desconto de 10%', () => {
    expect(comProdutosNoCarrinho(app, [100, 50])).toBe('135.00'); // 150 - 10%
  });

  test('18b. Compra de exatamente R$100 não recebe desconto', () => {
    expect(comProdutosNoCarrinho(app, [100])).toBe('100.00');
  });

  test('18c. Compra abaixo de R$100 não recebe desconto', () => {
    expect(comProdutosNoCarrinho(app, [40, 30])).toBe('70.00');
  });

  test('19. Cliente VIP deve receber desconto de 15%', () => {
    app.clientes.push({ nome: 'Ana', email: 'ana@email.com', vip: true });
    app.carrinho.push({ nome: 'Ração', preco: 200 });

    // Esperado: 200 - 15% = 170.00
    expect(app.calcularTotal()).toBe('170.00');
  });

  test('20. Carrinho não deve aceitar produto com preço igual a zero', () => {
    app.produtos.push({ nome: 'Brinde', preco: 0 });
    app.renderProdutos();
    $('produtoSelect').value = '0';
    app.adicionarCarrinho();

    expect(app.carrinho).toHaveLength(0);
  });
});
