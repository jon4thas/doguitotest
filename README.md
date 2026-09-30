# Doguito PetShop – Testes com Jest

Testes unitários e de integração (JavaScript + Jest/jsdom) para o sistema Doguito PetShop, cobrindo os 24 casos do documento *Testes_unitários.pdf*.

## Como rodar

```bash
npm install
npm test                 # todos
npm run test:unit        # só unitários
npm run test:integration # só integração
```

## Estrutura

```
app.js / index.html / style.css      sistema original (app.js não foi alterado)
tests/helpers/loadApp.js             carrega index.html + app.js no jsdom, com estado limpo a cada teste
tests/unit/cliente.test.js           casos 1–5
tests/unit/pet.test.js               casos 6–9
tests/unit/produto.test.js           casos 10–13
tests/unit/carrinho.test.js          casos 14–17
tests/unit/regras.test.js            casos 18–20
tests/integration/outros.test.js     casos 21–24 (total zerado, finalizar compra, carrossel, botões)
tests/integration/fluxo-completo.test.js  cliente → pet → produtos → carrinho → finalizar
```

## Resultado atual: 28 passam, 6 falham (bugs reais do sistema)

Os testes seguem o que o PDF especifica. Os que falham revelam defeitos no `app.js`:

| Teste | Requisito | Problema encontrado |
|---|---|---|
| 8 | Pet deve possuir tipo | `cadastrarPet()` não valida tipo vazio |
| 9 | Pet deve possuir idade válida | idade não numérica vira `NaN` e é cadastrada |
| 10b | Produto com nome | `criarProduto()` aceita nome vazio |
| 11 | Preço maior que zero | preço `0` (e `NaN`) é aceito; só `< 0` é barrado |
| 19 | VIP recebe 15% | desconto VIP não existe em `calcularTotal()` |
| 20 | Carrinho rejeita preço zero | `adicionarCarrinho()` não valida o preço |

Observação: `calcularTotal()` retorna string (`"0.00"`), por isso o teste 21 compara com `Number(total) === 0`.
