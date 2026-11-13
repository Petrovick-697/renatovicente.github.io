# Revisão independente da migração para LaTeX

Data: 12 de novembro de 2026. Revisão em contexto separado daquele que fez a migração.

## Escopo e evidência

Foram lidos os quatro HTML de aula e comparados os enunciados e argumentos com `HEAD`. A revisão trata da preservação do conteúdo matemático e da separação entre texto e TeX. Não usou navegador, não verificou a aparência das páginas ou sobreposição de gráficos e não auditou exaustivamente o JavaScript das interações. Também não conferiu novamente as fotografias da referência.

Uma verificação independente compilou os 1.188 trechos literais delimitados por `\(...\)` ou `\[...\]` com o KaTeX local, `throwOnError: true` e `strict: 'error'`: nenhum erro de compilação. Uma busca por palavras com quatro ou mais letras dentro desses trechos encontrou somente os nomes dos ambientes `cases` e `aligned`, sem palavras de prosa indevidamente incluídas. Essas verificações não detectam, por si sós, fórmulas fragmentadas ou variáveis que ficaram fora dos delimitadores.

## Achados na versão inicialmente revisada

As linhas abaixo se referem à versão observada no início desta revisão. Os achados foram enviados ao responsável pela implementação; a tabela não presume que uma correção tenha sido aplicada.

| Severidade | Local | Evidência e efeito | Correção concreta |
|---|---|---|---|
| P2 | `completude-e-aproximacao.html:157` | O raio `η` ficou fora do TeX; a vizinhança foi escrita como `\(B\)η\((a)\)`. Isso perde a estrutura de índice usada para `B_δ` na mesma prova. | Usar `\(\eta=\min\{\delta/2,|x_1-a|/2,\ldots,|x_m-a|/2\}>0\)` e `\(B_\eta(a)\)`. |
| P2 | `completude-e-aproximacao.html:61` | O símbolo `m′` foi convertido em `m\prime`. O MathML produzido pelo KaTeX contém um `mrow` com `mi` e `mo`, ao passo que `m'` produz `msup`. Portanto a marca deixou de ser um primo sobrescrito. | Usar `m'` ou `m^{\prime}` em todas as ocorrências da caracterização do ínfimo. Corrigir também o conversor legado se ele produzir o mesmo padrão. |
| P2 | `ordem-e-distancia.html:45` | O intervalo degenerado aparece como `\([a\), a\(] = \{a\}\)`. O segundo `a` ficou em texto, e uma única identidade foi partida em trechos sem delimitação de intervalo completa. | Usar `\([a,a]=\{a\}\)`. |
| P2 | Quatro aulas, exemplos abaixo | A exigência de toda a matemática em LaTeX ainda não estava cumprida: ficaram variáveis isoladas e expressões inteiras em texto. Exemplos: `√2` em completude:70; `f(A) ⊂ D` em funções:71; `Para a \(\in\mathbb R\)` em completude:147–148; referências ao conjunto `A` em completude:22–24,149–150 e funções:15,33–34,55,68–69; referências à variável `a` em ordem:24,76,98,119. | Delimitar as variáveis matemáticas conforme o contexto, preservando artigos da língua portuguesa. Converter as expressões completas, sem depender apenas de uma busca por símbolos Unicode. |
| P3 | `completude-e-aproximacao.html:69` | A definição do conjunto `S` abre a chave num trecho matemático e a fecha em outro, separados pela conjunção em texto. O significado é recuperável e foi preservado, mas a expressão fica fragmentada. | Preferir um único trecho: `\(S=\{x\in\mathbb R:x\ge0\ \text{e}\ x^2<2\}\)`. |
| P2 | `simetria-e-monotonicidade.html:113–118` | O explorador estático ainda continha `f(x) =`, botões como `x² em ℝ`, opções de domínio com `∩`, `∞` e `π`, e valores iniciais sem LaTeX. Este achado é restrito à fonte estática; não avalia eventual conversão posterior feita pelo JavaScript. | Converter os rótulos renderizáveis e apresentar a matemática das opções nativas em uma prévia LaTeX, com nomes descritivos no controle. Verificar a saída efetiva no navegador. |

Não foi identificado bloqueador lógico ou alteração substantiva de expoentes, quantificadores, conjuntos ou desigualdades nas demonstrações lidas. Os P2 acima são problemas concretos de representação e de cumprimento da migração solicitada.

## Trechos sensíveis conferidos

| Trecho | Conferência |
|---|---|
| `proof-positive-linearity` | A definição por casos conserva a extensão ímpar; os três casos da monotonicidade cobrem pares ordenados; os argumentos para `n=0`, `n>0` e `n<0` conservam a homogeneidade por inteiros. Os ambientes `cases` e `aligned` não mudaram o argumento de `HEAD`. |
| Raiz na pré-imagem do quadrado | `\sqrt{\max\{0,c\}}\le|x|\le\sqrt d`, sob `d\ge0`, preserva o escopo da raiz. Não foi convertido em `\sqrt{\max}\{0,c\}` nem em raiz apenas de `c`. |
| `proof-density` | As três ocorrências de `na` estão em TeX e significam o produto de `n` por `a`. A construção do inteiro mínimo, a desigualdade `k-1\le na<k` e a divisão por `n>0` foram preservadas. |
| Existência de `\sqrt2` | As escolhas de `h`, os denominadores, as potências e os sentidos das duas contradições foram preservados. |
| Ínfimo por reflexão | A troca de sinais e a caracterização por tolerância foram preservadas; o achado sobre `m′` é de representação do símbolo, não uma troca do argumento lógico. |

## Leitores considerados

O leitor de análise real exigiria que os delimitadores preservassem a estrutura das expressões; os achados de índice, primo e intervalo degenerado atendem a essa objeção. Um estudante que usa o curso exigiria consistência entre texto, caixas e controles; os resíduos de matemática fora do TeX contrariam essa expectativa. Esta revisão não avaliou originalidade matemática: a migração não apresenta uma nova alegação de resultado.

## Limite do parecer

A ausência de erros de compilação não certifica correção visual. A verificação no navegador é conduzida separadamente pelo responsável pela implementação.

## Fechamento da checagem textual

Na versão final conferida em 12 de novembro, os seis grupos receberam as correções indicadas: a identidade do intervalo degenerado está em um único trecho; os primos são sobrescritos; a definição de `S` está inteira em TeX; `\eta` e `B_\eta(a)` estão explícitos; os exemplos de variáveis e expressões em prosa apontados foram corrigidos; o explorador tem fórmulas em TeX nos rótulos e nomes descritivos nas opções nativas. A apresentação do domínio calculado fora das opções depende do JavaScript e permanece fora deste parecer textual.

Uma segunda conferência pontual detectou resíduos em `Escolha a`, `Trocando a`, `Se a\notin\mathbb Z`, `o próprio a` e no rótulo `Entrada x`, além de dois artigos de prosa que haviam sido convertidos indevidamente (`Onde a desigualdade` e `excede a área`). Todos esses pontos foram novamente lidos na fonte após a correção e estão resolvidos.

Após essas correções, a compilação independente dos **1.257 trechos literais TeX** das quatro aulas terminou com **zero erros**. Não permanecem achados abertos nos trechos pontuais deste relatório. A conclusão continua restrita à fonte e à preservação matemática; não certifica aparência, controles executados ou ausência de sobreposições.
