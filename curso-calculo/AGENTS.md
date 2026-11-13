# Curso de cálculo

- Produzir localmente; a integração com o repositório atual do Renato permanece separada.
- Exigência de Gabriel: mesma profundidade e formalismo do livro; cada teorema deve ter uma explicação visual interativa que também ajude a acompanhar a demonstração.
- Cada resultado deve apresentar hipóteses, quantificadores, enunciado, demonstração completa e interação correspondente. A verificação de exemplos não substitui a demonstração.
- Distinguir axiomas, definições, resultados demonstrados e aproximações numéricas. Não apresentar o axioma da completude como uma conclusão de uma simulação.
- Referência recebida: 29 fotos, capítulo 1, “Fatos Básicos”, pp. 15–43, cabeçalho “Cálculo em uma Variável Real”. Autor e edição ainda não foram informados. Não os inferir.
- Fotos e OCR ficam fora do material distribuível. Escrever explicações, figuras e exercícios próprios e registrar a correspondência com a referência em docs/.
- Preservar o padrão visual observado em vxplain.io: fundo branco, tipografia legível, texto junto da bancada, controles acessíveis, exercícios com resolução.
- Escrever as expressões matemáticas em LaTeX, inclusive nas caixas, demonstrações, legendas e resultados das interações. Usar o KaTeX e as fontes incluídos localmente; não depender de CDN para renderizar matemática.
- Padrão aprovado por Gabriel: manter a apresentação atual, compacta e sóbria, com texto principal de 19 px no computador e 18 px no celular. Não voltar a tamanhos auxiliares desproporcionalmente pequenos.
- Escrever quocientes com barra horizontal: `\dfrac{p}{n}` na prosa e nas provas quando necessário para preservar a leitura; `\frac{p}{n}` em fórmulas de destaque. Não exibir `p/n` em fórmulas renderizadas. A entrada digitável do explorador mantém `/` como sintaxe, com prévia matemática em LaTeX.
- Distinguir interface de matemática: contadores da navegação são texto simples. Aplicar estilos a classes específicas (`.route-step`), sem atingir todos os `span` internos do KaTeX. Hipóteses curtas ficam em linha; não transformar palavras de ligação ou pontuação em blocos separados.
- Referências a teoremas, proposições e resultados devem levar ao enunciado correspondente por links que abrem em nova aba (`target="_blank"`, com `rel="noopener noreferrer"`).
- Evitar rótulos sobre curvas ou sobre outros rótulos. Preferir legendas externas, janelas ajustadas ao exemplo e gráficos com área útil legível. Verificar sobreposições além de verificar se há recorte.
- A implementação é HTML/CSS/JavaScript sem compilação nem dependências obrigatórias. Deve funcionar por arquivo local e por servidor estático.
- Separar os cálculos em assets/math.js. Validar as construções de testemunhas por desigualdades exatas e revisar as provas separadamente.
- Antes de entregar, executar os testes, verificar o navegador em computador e celular e atualizar docs/VERIFICACAO.md com o que foi realmente verificado.
