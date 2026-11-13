# Padrão do curso

Padrão aprovado por Gabriel em 12/11/2026, após a revisão das quatro primeiras aulas. Deve orientar as próximas aulas e as alterações das existentes.

## Conteúdo e organização

Preservar a profundidade e o formalismo do livro. Cada resultado apresenta hipóteses, quantificadores, enunciado, demonstração completa e uma interação que ajuda a acompanhar o argumento. Exemplos e verificações numéricas não substituem a demonstração geral.

Manter a apresentação compacta e sóbria: fundo branco, poucos acentos de cor, texto legível ao lado da bancada quando houver espaço e demonstrações em passos. Legendas devem ficar fora das curvas; rótulos não podem se sobrepor. Referências aos resultados abrem o enunciado em nova aba, preservando o ponto de leitura.

## Matemática

Escrever matemática diretamente em LaTeX, inclusive variáveis na prosa, hipóteses, caixas, provas, legendas e resultados dinâmicos. Usar o renderizador e as fontes locais.

Quocientes usam barra horizontal. Em texto e demonstrações, preferir `\dfrac{p}{n}` quando a fração precisar manter numerador e denominador legíveis. Em destaque, `\frac{p}{n}` já assume o tamanho adequado. Funções como `f\left(\dfrac{p}{n}\right)` devem ter parênteses proporcionais à fração. Não usar a barra inclinada em fórmulas renderizadas.

O campo de entrada do explorador continua aceitando `/`; sua prévia e suas respostas usam a barra horizontal. Separadores entre campos, como “injetora / sobrejetora”, não representam uma divisão e podem permanecer como prosa.

## Tipografia e componentes

- Texto principal: 19 px no computador e 18 px no celular; títulos mantêm a escala existente.
- Leituras auxiliares e hipóteses: 16 px; legendas de figuras e valores de controles: pelo menos 15 px; referências: 14 px.
- Valores das bancadas: 17 px no computador e 16 px no celular. Rótulos dentro dos gráficos mantêm pelo menos 13 px na escala efetiva da tela, sem reduzir a fonte para resolver colisões.
- Numeração discreta e metadados podem usar a escala compacta existente; não aplicar esse tamanho às fórmulas principais.
- Contadores da navegação usam texto simples em `.route-step`. Não estilizar indiscriminadamente os `span` internos do KaTeX.
- Hipóteses curtas são uma frase em linha, separada da fórmula principal. Pontuação e palavras de ligação não devem gerar linhas isoladas.

## Verificação

Conferir a compilação TeX, a preservação dos numeradores e denominadores, os links e a apresentação em computador e celular. Nos componentes, verificar recorte e sobreposição, além da rolagem horizontal da página. Registrar o que foi efetivamente testado.
