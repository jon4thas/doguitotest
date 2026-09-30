const {
  loadApp, $, preencherCliente, preencherPet, preencherProduto,
} = require('../helpers/loadApp');

describe('Integração – fluxo completo do PetShop', () => {
  let app;
  beforeEach(() => { app = loadApp(); });

  const clicar = (texto) =>
    Array.from(document.querySelectorAll('button'))
      .find((b) => b.textContent.trim() === texto)
      .click();

  test('cadastra cliente, pet e produtos, monta o carrinho e finaliza a compra', () => {
    // Cliente
    preencherCliente({ nome: 'Maria', email: 'maria@email.com', vip: false });
    clicar('Cadastrar');
    expect($('listaClientes').textContent).toBe('Maria - maria@email.com');

    // Pet
    preencherPet({ nome: 'Rex', tipo: 'cachorro', idade: 4 });
    clicar('Cadastrar Pet');
    expect($('listaPets').textContent).toBe('Rex (cachorro)');

    // Produtos
    preencherProduto({ nome: 'Ração', preco: 80 });
    clicar('Criar Produto');
    preencherProduto({ nome: 'Brinquedo', preco: 40 });
    clicar('Criar Produto');
    expect($('listaProdutos').children).toHaveLength(2);
    expect($('produtoSelect').options).toHaveLength(2);

    // Carrinho: 80 + 40 = 120 -> desconto de 10% = 108.00
    $('produtoSelect').value = '0';
    clicar('Adicionar');
    $('produtoSelect').value = '1';
    clicar('Adicionar');
    expect($('listaCarrinho').children).toHaveLength(2);
    expect($('total').textContent).toBe('108.00');

    // Finalizar
    clicar('Finalizar');
    expect(window.alert).toHaveBeenLastCalledWith('Compra finalizada: 108.00');
    expect($('listaCarrinho').children).toHaveLength(0);
    expect($('total').textContent).toBe('0.00');
  });

  test('dados inválidos não chegam às listas da tela', () => {
    preencherCliente({ nome: '', email: 'x@y.com' });
    clicar('Cadastrar');
    preencherProduto({ nome: 'Osso', preco: -5 });
    clicar('Criar Produto');

    expect($('listaClientes').children).toHaveLength(0);
    expect($('listaProdutos').children).toHaveLength(0);
    expect($('produtoSelect').options).toHaveLength(0);
  });

  test('produto cadastrado é refletido no select e no carrinho com o preço correto', () => {
    preencherProduto({ nome: 'Shampoo', preco: 25.9 });
    clicar('Criar Produto');
    clicar('Adicionar');

    expect($('listaCarrinho').textContent).toBe('Shampoo - 25.9');
    expect($('total').textContent).toBe('25.90');
  });
});
