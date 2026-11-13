# Aulas 03 e 04 — critérios de verificação

Critérios definidos antes de concluir as interações. Conteúdo: fotos das pp. 24–32 do capítulo recebido. Provas gerais e valores da interface serão examinados separadamente.

- Conferir funções finitas por fibras exatas e verificar as duas identidades da inversa.
- Testar imagens e pré-imagens do quadrado em intervalos negativos, positivos, contendo zero e degenerados.
- Testar os pontos excluídos dos domínios de operações e composições, antes de avaliar raízes ou divisões.
- Testar os coeficientes positivos, negativos e zero da família afim.
- Conferir a parte inteira em números negativos e as classificações de período por expressões exatas. Não classificar números como racionais ou irracionais a partir de valores decimais.
- Na prova de linearidade, comparar a fração construída com os extremos da forma r ± √2 por sinais e quadrados de inteiros BigInt. Rejeitar também frações plantadas fora do intervalo.
- Revisar os quantificadores da proposição 1.2.28 e as hipóteses do corolário 1.2.29. A identidade assumida é f(nx)=nf(x), para n inteiro; não é uma hipótese de aditividade.
- Conferir em contexto separado a matemática e a ligação entre os passos das provas e as figuras.
- No navegador, percorrer os passos das novas provas, modificar controles, conferir teclado, domínios inválidos e telas de computador e celular. Preservar a prévia local solicitada pelo usuário.

## Execução

Verificação em 12/11/2026. Aulas 03–04 implementadas com 18 bancadas, 13 provas acompanhadas e 31 transições entre seus passos. O curso passa a ter quatro aulas, 36 bancadas e 27 resultados declarados com provas ligadas às figuras; o explorador aberto é uma ferramenta adicional.

- 27 testes automatizados passaram, incluindo os 13 anteriores. As novas verificações cobrem fibras de aplicações finitas, intervalos do quadrado, domínios excluídos, inversas e comparações algébricas exatas das testemunhas de linearidade. As comparações com √2 usam BigInt; as coordenadas SVG são aproximações.
- Revisão matemática independente em `referee_sim_03_04.md`: hipóteses de composição e reflexão explicitadas, convenção para domínios vazios declarada e resultado de reescalonamento periódico incluído. As provas da proposição e do corolário mantêm a homogeneidade por inteiros da fonte.
- No navegador, foram percorridas as 31 novas transições; todas alteraram o SVG e mantiveram coordenadas finitas. Foram realizados 62 deslocamentos de controles para os extremos pelo teclado, além das opções de famílias. Não foram encontrados erros no console nessas verificações.
- Telas verificadas: 1280×900 e 390×844. Um rótulo de eixo que ultrapassava o SVG foi corrigido aumentando a margem. A folha do explorador foi separada e os recursos receberam versão na URL para atualizar cópias em cache.

## Explorador solicitado durante a produção

Entrada de expressão por parser próprio, sem executar JavaScript digitado. Suporta operações aritméticas, potências, seno, cosseno, tangente, exponencial, logaritmo natural, raízes, módulo e piso; admite aliases em português. Há limites de tamanho, profundidade e coeficientes. Expoente constante zero é recusado para evitar a ambiguidade de 0^0; a função constante pode ser digitada como `1`.

As classificações vêm de regras simbólicas conservadoras para polinômios e famílias elementares com mudanças afins, além do recíproco afim. Não se usa amostragem para provar propriedades globais. Quando uma regra não se aplica, o resultado é “não determinado”. Esse retorno não afirma inexistência. As justificativas e a dependência do domínio aparecem ao lado dos resultados. A inversa é considerada sobre a imagem do domínio escolhido.

Verificados na interface: os sete exemplos, x² em ℝ e na semirreta, seno global e restrito, exp(x), 1/x e sin(x²); rejeição de entrada fora da linguagem; os cinco modos visuais. Os testes incluem as identidades numéricas das fórmulas inversas e valores fora da imagem. Essas verificações numéricas não substituem os argumentos algébricos das regras.

A revisão adicional encontrou dois erros de decisão por arredondamento: frequência muito próxima de 1 e produto de coeficientes positivos que sofria subfluxo. As decisões foram trocadas por comparações de frações e sinais exatos; os dois contraexemplos viraram testes. Fronteiras racionais muito próximas de extremos envolvendo π recebem retorno conservador. Mensagens de valores não exibíveis distinguem limite numérico de afirmação sobre o domínio.

O gráfico é amostrado e pode omitir detalhes ou interromper trechos muito íngremes; isso é indicado na própria ferramenta. A prévia continua em `http://127.0.0.1:8765/`, conforme solicitado.
