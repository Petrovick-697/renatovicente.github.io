# Revisão de apresentação — 12/11/2026

Solicitação de Gabriel: remover sobreposições e elementos pequenos, usar LaTeX em todas as expressões matemáticas e abrir referências aos resultados em novas abas. A revisão cobre as quatro aulas existentes; nenhuma aula nova foi acrescentada.

## Alterações

- Fonte matemática em TeX nas caixas, demonstrações, exercícios e prosa matemática. KaTeX 0.19.1 e fontes WOFF2 incluídos localmente, com licença MIT. A integração segue a [documentação oficial do navegador](https://katex.org/docs/browser.html) e da [extensão de renderização](https://katex.org/docs/autorender.html).
- Fórmulas dinâmicas, legendas, valores e resultados do explorador também usam o renderizador. As expressões e inversas do explorador têm representação TeX própria. Os seletores nativos usam nomes descritivos; a expressão escolhida aparece em LaTeX fora do seletor.
- A demonstração da extensão ímpar usa uma definição por casos e cadeias alinhadas. Os índices de vizinhanças, primos e intervalos degenerados foram conferidos em revisão separada, registrada em `revisao_latex.md`.
- Gráficos das aulas 03–04 com maior altura e área útil; legendas dos pontos fora das curvas. Em paridade, anel e ponto distinguem transformação e valor efetivo, inclusive quando coincidem.
- Periodicidade e reescalonamento usam janelas ajustadas aos pontos envolvidos, em vez de uma grade fixa com doze períodos. Graduações numéricas simples substituem divisões arbitrárias da escala.
- Rótulos dentro dos diagramas mantêm tamanho legível e passam por composição sem sobreposição; os que não cabem vão para a legenda. Essa composição não reduz a fonte.
- Referências numeradas e remissões aos resultados têm destino local e `target="_blank"`, com `rel="noopener noreferrer"`. A navegação do índice da aula continua servindo para percorrer a página.

## Verificação executada

- 31 testes passaram. Incluem compilação das 1.257 expressões TeX literais das aulas, validação das âncoras e da abertura em nova aba, composição de rótulos e TeX das expressões/inversas do explorador, além das verificações matemáticas anteriores.
- Percorridas as 62 transições das demonstrações das quatro aulas no navegador, sem erros de renderização matemática.
- Realizados 128 deslocamentos de controles até os extremos e 57 escolhas de famílias. Nos estados inspecionados, não houve sobreposição ou recorte dos rótulos compostos, nem rolagem horizontal da página em largura CSS de 390 px.
- Telas de 1440 px e 390 px conferidas visualmente; uma restrição adicional a 260 px identificou e motivou ajuste do título longo da aula de completude.
- Um clique na referência da proposição de linearidade abriu o enunciado em outra aba. A URL da aba de origem permaneceu inalterada.
- Sete exemplos do explorador e modos de sobreposição conferidos. Gráficos continuam sendo aproximações; as regras de classificação matemática foram preservadas.

Os registros de testes confirmam os estados examinados, não uma garantia para toda expressão arbitrária. Os limites matemáticos e numéricos do explorador permanecem explícitos na ferramenta. A prévia local solicitada foi preservada.
