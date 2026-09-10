# Fluxo de lentes Santi

Implementação baseada em `Mensagem - Lentes. (1).docx`, com preços e variantes consultados na Nuvemshop em 09/09/2026. Lente sem grau confirmada pelo usuário em R$120, mantendo o cadastro da loja.

## Fluxo

Ordem e CSS reutilizados do fluxo atual da Cacife (`nuvemshopcacife/lentes-cacife-piloto.js`), com marca e catálogo da Santi.

1. WhatsApp (usar número fictício na prévia).
2. Visão simples ou sem grau com filtro azul.
3. Tratamento: antirreflexo, BLUE UV ou Transitions BLUE UV.
4. Receita: enviar uma foto ou PDF para leitura automática, digitar ou testar o caminho sem receita.
5. Conferir os dados dos dois olhos e visualizar a lente indicada.
6. Carrinho de demonstração.

As faixas vêm do documento. A indicação confere ESF e CIL dos dois olhos, incluindo limites positivos e negativos assimétricos. Não há Transitions para grau alto nem opção multifocal no catálogo informado. Casos fora das faixas retornam uma orientação de atendimento. A foto ou o PDF da receita é enviado ao leitor automático da Provou Levou, que preenche os campos para conferência antes da indicação.

| Faixa | Antirreflexo | BLUE UV | Transitions BLUE UV |
| --- | ---: | ---: | ---: |
| Leve · Orgânicas | R$256 | R$299 | R$649 |
| Moderado · Policarbonato | R$379 | R$399 | R$1.449 |
| Alto · 1.67 | R$879 | R$989 | — |

Sem grau com filtro azul: R$120. Valores adicionais ao preço da armação.

## Arquivos

- `lentes-santi.js`: interface local com o mesmo design da Cacife; execução protegida pela opção `SANTI_LENTES_PREVIEW`.
- `preview-lentes.html`: demonstração local, sem chamadas de compra.
- `catalogo-lentes-auditoria.json`: retrato dos produtos de lentes; sem credenciais.
- `verificar-cacife-design.cjs`: testes de ordem, oito preços, limites dos dois olhos, sem grau, navegação, carrinho local e ausência de requisições POST.

## Estado da publicação

Prévia pública para homologação da Santi. O fluxo não foi instalado na loja e não altera o provador atual. Existe Lente Ideal Pro na loja; a convivência ou substituição será definida antes da instalação em produção.

O carrinho é inteiramente demonstrativo. O telefone não é enviado e não há eventos de acompanhamento, mensagens ou compras. Somente o arquivo escolhido para leitura da receita é enviado ao leitor automático. A integração real com o carrinho será preparada apenas quando solicitada a publicação.

