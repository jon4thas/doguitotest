const { loadApp, $, preencherProduto } = require('../helpers/loadApp');

describe('Outros Testes', () => {
  let app;
  beforeEach(() => {
    jest.useFakeTimers();
    app = loadApp();
  });
  afterEach(() => { jest.useRealTimers(); });

  function cadastrarEAdicionar(nome, preco) {
    preencherProduto({ nome, preco });
    app.criarProduto();
    $('produtoSelect').value = String(app.produtos.length - 1);
    app.adicionarCarrinho();
  }

  test('21. Carrinho vazio deve retornar total igual a 0', () => {
    expect(Number(app.calcularTotal())).toBe(0);
    expect($('total').textContent).toBe('0.00');
  });

  test('22. Ao finalizar compra o carrinho deve ser limpo', () => {
    cadastrarEAdicionar('Ração', 50);
    cadastrarEAdicionar('Coleira', 30);
    expect(app.carrinho).toHaveLength(2);

    app.finalizarCompra();

    expect(window.alert).toHaveBeenCalledWith('Compra finalizada: 80.00');
    expect(app.carrinho).toHaveLength(0);
    expect($('listaCarrinho').children).toHaveLength(0);
    expect($('total').textContent).toBe('0.00');
  });

  test('23. O carrossel deve trocar automaticamente as imagens', () => {
    const slides = document.querySelector('.slides');
    expect(app.slideIndex).toBe(0);

    jest.advanceTimersByTime(4000);
    expect(app.slideIndex).toBe(1);
    expect(slides.style.transform).toBe('translateX(-100%)');

    jest.advanceTimersByTime(4000);
    expect(app.slideIndex).toBe(2);
    expect(slides.style.transform).toBe('translateX(-200%)');

    // volta ao primeiro slide após o último
    jest.advanceTimersByTime(4000);
    expect(app.slideIndex).toBe(0);
  });

  test('23b. Botões do carrossel (próximo/anterior) trocam a imagem', () => {
    document.querySelector('.next').click();
    expect(app.slideIndex).toBe(1);
    document.querySelector('.prev').click();
    expect(app.slideIndex).toBe(0);
    document.querySelector('.prev').click(); // do primeiro vai para o último
    expect(app.slideIndex).toBe(2);
  });

  test('24. Botões Adicionar / Remover / Finalizar devem funcionar corretamente', () => {
    preencherProduto({ nome: 'Ração', preco: 50 });
    app.criarProduto();

    const botoes = Array.from(document.querySelectorAll('.card button'));
    const btn = (texto) => botoes.find((b) => b.textContent.trim() === texto);

    btn('Adicionar').click();
    btn('Adicionar').click();
    expect(app.carrinho).toHaveLength(2);
    expect($('total').textContent).toBe('100.00');

    btn('Remover').click();
    expect(app.carrinho).toHaveLength(1);
    expect($('total').textContent).toBe('50.00');

    btn('Finalizar').click();
    expect(window.alert).toHaveBeenCalledWith('Compra finalizada: 50.00');
    expect(app.carrinho).toHaveLength(0);
  });
});
