const { loadApp, $, preencherCliente } = require('../helpers/loadApp');

describe('Testes de Cliente', () => {
  let app;
  beforeEach(() => { app = loadApp(); });

  test('1. Deve permitir criar cliente com nome válido', () => {
    preencherCliente({ nome: 'Maria', email: 'maria@email.com' });
    app.criarCliente();

    expect(app.clientes).toHaveLength(1);
    expect(app.clientes[0].nome).toBe('Maria');
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('2. Não deve permitir cliente com nome vazio', () => {
    preencherCliente({ nome: '', email: 'maria@email.com' });
    app.criarCliente();

    expect(app.clientes).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith('Nome inválido');
  });

  test('3. Deve permitir cadastrar cliente com email válido', () => {
    preencherCliente({ nome: 'João', email: 'joao@email.com' });
    app.criarCliente();

    expect(app.clientes).toHaveLength(1);
    expect(app.clientes[0].email).toBe('joao@email.com');
    expect($('listaClientes').children).toHaveLength(1);
    expect($('listaClientes').textContent).toBe('João - joao@email.com');
  });

  test('4. Não deve permitir email inválido', () => {
    preencherCliente({ nome: 'João', email: 'joao.email.com' });
    app.criarCliente();

    expect(app.clientes).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith('Email inválido');
  });

  test('5. Deve permitir marcar cliente como VIP', () => {
    preencherCliente({ nome: 'Ana', email: 'ana@email.com', vip: true });
    app.criarCliente();

    expect(app.clientes[0].vip).toBe(true);
  });

  test('5b. Cliente não marcado como VIP deve ficar com vip = false', () => {
    preencherCliente({ nome: 'Ana', email: 'ana@email.com', vip: false });
    app.criarCliente();

    expect(app.clientes[0].vip).toBe(false);
  });
});
