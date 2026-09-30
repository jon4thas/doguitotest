const { loadApp, $, preencherPet } = require('../helpers/loadApp');

describe('Testes de Pet', () => {
  let app;
  beforeEach(() => { app = loadApp(); });

  test('6. Deve permitir cadastrar um pet', () => {
    preencherPet({ nome: 'Rex', tipo: 'cachorro', idade: 3 });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(1);
    expect(app.pets[0]).toEqual({ nome: 'Rex', tipo: 'cachorro', idade: 3 });
    expect($('listaPets').textContent).toBe('Rex (cachorro)');
  });

  test('7. Pet deve possuir nome obrigatório', () => {
    preencherPet({ nome: '', tipo: 'cachorro', idade: 3 });
    app.cadastrarPet();

    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalledWith('Pet precisa de nome');
  });

  test('8. Pet deve possuir tipo (cachorro, gato, etc)', () => {
    preencherPet({ nome: 'Rex', tipo: '', idade: 3 });
    app.cadastrarPet();

    // Esperado: pet sem tipo não deve ser cadastrado
    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalled();
  });

  test('9. Pet deve possuir idade válida (número)', () => {
    preencherPet({ nome: 'Rex', tipo: 'cachorro', idade: 'abc' });
    app.cadastrarPet();

    // Esperado: idade não numérica não deve ser aceita
    expect(app.pets).toHaveLength(0);
    expect(window.alert).toHaveBeenCalled();
  });

  test('9b. Idade numérica deve ser convertida para número', () => {
    preencherPet({ nome: 'Mia', tipo: 'gato', idade: '5' });
    app.cadastrarPet();

    expect(typeof app.pets[0].idade).toBe('number');
    expect(app.pets[0].idade).toBe(5);
  });
});
