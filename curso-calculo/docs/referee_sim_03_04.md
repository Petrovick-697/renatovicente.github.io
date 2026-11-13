# Revisão independente das aulas 03 e 04

Revisão realizada em 12/11/2026, em contexto separado do autor das aulas. Foram lidos `AGENTS.md`, o texto integral de `funcoes-e-inversas.html` e `simetria-e-monotonicidade.html`, o argumento da existência da parte inteira na aula 02 e as nove fotografias correspondentes às pp. 24–32. Autor e edição do livro não foram informados e não foram inferidos.

O exame cobre definições, hipóteses, quantificadores, provas, exemplos, exercícios e a impressão transmitida por aberturas e legendas. Não foram lidos os novos cálculos em JavaScript, executados testes ou usados navegadores. A existência e a qualidade das interações continuam sob verificação do agente principal. Os números de linha abaixo correspondem à primeira versão lida; os identificadores das seções são os localizadores estáveis.

## Audiências e objeções

| Audiência | Por que deve ser ouvida |
|---|---|
| Docente de cálculo e análise | A apresentação promete formalismo e demonstrações completas. |
| Estudante que reconstrói o argumento | As definições anteriores precisam justificar cada notação e cada passo posterior. |
| Leitor que compara a aula com a referência | As aulas identificam páginas e números de resultados do livro. |
| Usuário das figuras | A apresentação promete desenhos que acompanham provas gerais, inclusive afirmações que não podem ser decididas por amostragem. |

| Audiência | Objeção | Eixo | Resposta encontrada ou necessária | Severidade | Correção aplicada nesta revisão |
|---|---|---|---|---|---|
| Docente de cálculo e análise | A condição correta de composição foi obtida, mas a notação de pré-imagem usada nela foi definida para esse conjunto? | Correção | `#composicao` usa `f⁻¹(D)` sem supor `D ⊂ B`; `#imagem` só definiu pré-imagem para subconjuntos de `B`. Ver M1. | MÉDIA | Nenhuma: encaminhada ao autor. |
| Docente de cálculo e análise | O texto apresenta teoremas conhecidos como contribuição matemática nova? | Novidade | Não. A abertura e os rodapés identificam as seções da referência e distinguem os desenvolvimentos explicativos próprios. | Sem achado | Nenhuma necessária. |
| Estudante que reconstrói o argumento | Uma restrição de domínio vazio, ou uma composição sem nenhuma entrada admissível, ainda é função segundo a definição inicial? | Correção | A convenção de não vacuidade em `#funcao` não foi conciliada com `#restricao`, `#operacoes` e `#composicao`. Ver M2. | MÉDIA | Nenhuma: encaminhada ao autor. |
| Estudante que reconstrói o argumento | O novo material acrescenta justificativas à leitura do livro, ou apenas novos nomes para as mesmas fórmulas? | Novidade | Os critérios gráficos, a maximalidade do domínio da composição, a unicidade da inversa, os períodos sem mínimo e a extensão ímpar são demonstrados explicitamente. Trata-se de desenvolvimento didático declarado, sem comparação de eficácia pedagógica. | Sem achado | Nenhuma necessária. |
| Leitor que compara a aula com a referência | Todos os resultados anunciados dessas páginas foram contemplados e numerados corretamente? | Correção | Há referência indevida a “exemplos 1.2.26–1.2.27”, e falta o reescalonamento periódico do exemplo 1.2.26(1), caso o objetivo seja cobrir todos os resultados das páginas. Ver M4 e B1. | MÉDIA para cobertura; BAIXA para numeração | Nenhuma: encaminhada ao autor. |
| Leitor que compara a aula com a referência | As provas próprias são indevidamente atribuídas ao livro? | Novidade | As notas e rodapés dizem que argumentos foram explicitados e que exemplos e diagramas são próprios. As duas correções de formulação da referência são declaradas. Não se reivindica descoberta dos resultados. | Sem achado | Nenhuma necessária. |
| Usuário das figuras | A seleção de poucos pontos pretende provar injetividade, irracionalidade ou a linearidade de uma função arbitrária? | Correção | As legendas de `#graficos`, `#periodo-minimo` e `#linearidade` distinguem fórmula/prova, entradas simbólicas e ponto hipotético. A adequação real da implementação não foi verificada aqui. | Sem achado no texto; execução não examinada | Nenhuma aplicada. |
| Usuário das figuras | A apresentação sugere que a existência de interação demonstra superioridade sobre outras formas de ensino? | Novidade | Não há afirmação comparativa de desempenho ou aprendizagem nos textos lidos. | Sem achado | Nenhuma necessária. |

## Achados acionáveis

### M1 — O domínio geral da composição exige uma convenção adicional de pré-imagem

Local: aula 03, `#imagem`, linha 22; `#composicao`, linhas 66–74.

A condição `f(A) ⊂ D` e a descrição por compreensão `E = {x ∈ A : f(x) ∈ D}` estão corretas. O problema é local de definição: anteriormente `f⁻¹(C)` só foi definido para `C ⊂ B`, enquanto o domínio `D` de `g` pode conter elementos fora de `B`. Isso ocorre, por exemplo, com `f : {0} → {0}`, `f(0)=0`, e `g : ℝ → ℝ`. A composição existe, mas `D=ℝ` não é subconjunto de `B={0}`.

Correção mínima: escrever `E = f⁻¹(B ∩ D) = {x ∈ A : f(x) ∈ D}`, ou estender explicitamente a notação de pré-imagem a qualquer conjunto `C`, observando que ela só depende de `C ∩ B`. Não é necessário fortalecer a condição de composição para `B ⊂ D`: isso excluiria casos válidos.

### M2 — Conciliar domínio vazio com as construções posteriores

Local: aula 03, `#funcao`, linha 14; `#restricao`, linha 31; `#operacoes`, linhas 44–45; `#composicao`, linhas 67–74.

A definição inicial começa com conjuntos não vazios, como a fonte na p. 24. Mais tarde são admitidos `D ⊂ A`, interseções arbitrárias de domínios e o conjunto `E` de entradas admissíveis, todos possivelmente vazios. Por exemplo, `f(x)=0` em `ℝ`, seguida de uma função com domínio `{1}`, produz `E=∅`. A prova da maximalidade do conjunto `E` permanece correta, mas a frase de que a fórmula define uma função nesse domínio conflita com a convenção inicial se o vazio estiver excluído.

Correção mínima: declarar a extensão da convenção para admitir funções de domínio vazio, com gráfico vazio, ou qualificar as construções de função pela não vacuidade do novo domínio e explicar o caso vazio. A primeira opção evita acrescentar condições artificiais a cada construção. A pré-imagem vazia de um conjunto não é problemática: ela é um conjunto, mesmo que o curso exclua funções de domínio vazio.

### M3 — Explicitar as hipóteses reais onde começa a interpretação geométrica ou ordenada

Local: aula 03, `#reflexao`, linha 105; aula 04, `#periodos`, linha 22, e `#monotonicidade`, linha 44.

A primeira aula define funções entre conjuntos gerais. Em `#graficos`, corretamente restringe `A,B ⊂ ℝ`, mas a declaração posterior da reflexão volta a dizer apenas `f : A → B`. A troca de coordenadas faz sentido para conjuntos gerais; a reflexão na reta `y=x` exige coordenadas reais. Acrescentar `A,B ⊂ ℝ` ao enunciado da reflexão elimina a hipótese implícita. A demonstração geométrica está correta sob essa hipótese.

Na aula 04, o contexto inicial já usa um domínio real, mas as definições de período e monotonicidade voltam a quantificar apenas `f : A → ℝ`. Acrescentar `A ⊂ ℝ` nessas duas definições, ou declarar essa convenção para a aula inteira, torna legítimas as operações `x±T` e a ordem de quaisquer entradas. A omissão é de explicitação, não uma falha nas provas para funções reais.

Severidade: MÉDIA para o enunciado geométrico depois da teoria de funções gerais; BAIXA para a convenção real já sugerida pelo contexto da aula 04.

### M4 — Resultado de reescalonamento periódico não contemplado

Local: fotografia da p. 30, exemplo 1.2.26(1), e aula 04, `#periodos`–`#periodo-minimo`.

A fonte inclui o resultado de que, se `f` tem período `T` e `p,q` são inteiros positivos, então `g(x)=f((p/q)x)` tem período `qT`. Não se afirma que esse seja o período mínimo. As aulas lidas provam os múltiplos de um período, mas não esse resultado sobre uma nova função. Se a entrega cobre cada resultado das pp. 24–32, falta essa aplicação.

Uma versão precisa para domínio geral é: `f : A → ℝ`, `A ⊂ ℝ`, com período `T`; defina `E={x∈ℝ : (p/q)x∈A}` e `g : E → ℝ` por `g(x)=f((p/q)x)`. Para cada `x∈E`, `(p/q)(x±qT)=(p/q)x±pT∈A`, e `g(x±qT)=g(x)` pela propriedade já demonstrada dos múltiplos inteiros. Logo `qT` é período. Para uma inclusão mais curta, pode-se assumir `A=ℝ`.

Severidade: MÉDIA em relação à exigência de cobertura integral; não é um teorema falso das aulas atuais. A decisão de escopo cabe ao agente principal.

### B1 — Número de exemplo na seção de período mínimo

Local: aula 04, `#periodo-minimo`, linhas 32 e 35.

Na fonte fotografada, a p. 30 traz os exemplos periódicos em 1.2.26, com continuação na p. 31. O número 1.2.27 é a definição de monotonicidade, não um exemplo sobre períodos. Substituir “Exemplos 1.2.26–1.2.27” por “Exemplo 1.2.26 e exemplos próprios”; na referência, citar “definição 1.2.25 e exemplo 1.2.26, pp. 30–31”. A função constante sem período mínimo é um exemplo próprio válido.

Severidade: BAIXA, de localização na referência.

### B2 — “Função inteira” na abertura

Local: aula 04, abertura, linha 8.

A expressão “determina uma função inteira” quer dizer que determina todos os seus valores. Em uma apresentação matemática, “função inteira” também é termo de análise complexa. Preferir “determina a função em todo o domínio” evita a ambiguidade sem mudar a afirmação. Severidade BAIXA.

## Aprovação fundamentada dos argumentos principais

| Resultado | Verificação matemática |
|---|---|
| Imagem e pré-imagem pelo quadrado | Os extremos descritos em `#imagem` estão corretos, incluindo intervalos que cruzam zero, bandas com limite inferior negativo e a pré-imagem vazia quando o limite superior é negativo. A raiz não negativa produz as entradas dos valores intermediários; não há apelo indevido a uma amostragem do gráfico. |
| Critérios gráficos | O critério vertical exige existência e unicidade para cada `a∈A`; o horizontal de injetividade exige **no máximo** um ponto para cada `b∈B`; o de sobrejetividade exige **pelo menos** um. As quatro etapas provam os critérios com os quantificadores corretos. |
| Domínio da composição | A condição utiliza `f(A)`, não todo o contradomínio `B`. A prova identifica cada entrada admissível e demonstra a inclusão de qualquer outro domínio admissível em `E`. A ressalva é M1, sobre a notação, e M2, se `E=∅`. |
| Associatividade | Os conjuntos de passagem declarados garantem as três aplicações. Ambas as funções têm o mesmo domínio, o mesmo contradomínio e valor `h(g(f(x)))` para toda entrada. O exemplo de não comutatividade usa duas funções definidas em todo `ℝ` e as distingue em `x=1`. |
| Bijeção e inversa | A prova extrai injetividade e sobrejetividade das duas identidades, constrói a entrada única para cada `y∈B` na recíproca e verifica as duas identidades. A demonstração da unicidade usa as identidades corretas. Não depende de escolher arbitrariamente entre várias pré-imagens. |
| Reflexão e inversa afim | A equivalência dos pares ordenados e o argumento do ponto médio/perpendicularidade estão corretos para coordenadas reais. O caso de ponto fixo e a hipótese `m≠0` são tratados. A ressalva é M3. |
| Paridade | A simetria do domínio é declarada. A invariância do gráfico é provada nas duas direções; a transformação involutiva justifica passar de preservação a invariância. O exercício demonstra que somente a função nula pode ser simultaneamente par e ímpar no mesmo domínio simétrico. |
| Múltiplos de períodos | A indução mantém pertença ao domínio em cada passo, além da igualdade dos valores. A segunda indução cobre deslocamentos negativos e os casos `k=±m` provam que `mT` é período para todo inteiro positivo `m`. Não se chama `0` de período positivo. |
| Período mínimo | Para a parte fracionária, avaliar em zero força qualquer período positivo a ser inteiro, e a identidade do piso prova que todos os inteiros positivos são períodos. Para constantes, `T/2` refuta qualquer candidato mínimo. Para `χℚ`, a racionalidade é preservada por translação racional e a entrada zero exclui todo deslocamento irracional; `T/2` prova a ausência de mínimo. |
| Monotonicidade estrita e inversa | Não se pressupõe que o domínio seja um intervalo. O argumento por ordem das entradas prova injetividade; a mudança do contradomínio para `f(A)` garante sobrejetividade. As duas provas da ordem da inversa excluem corretamente as alternativas de ordem que contradizem `y₁<y₂`. |
| Proposição 1.2.28 | `n=0` dá `f(0)=0`; a monotonicidade dá `c=f(1)>0`; os inteiros e os quocientes determinam `f(q)=cq` para todo racional. Em cada desvio hipotético, a densidade fornece um racional num intervalo não vazio e a monotonicidade contradiz o valor racional. Os dois sinais são demonstrados, e a unicidade de `c` é obtida em `1`. |
| Corolário 1.2.29 | A convenção `0∈ℕ` está explícita e dá `f(0)=0`. A extensão ímpar é estritamente crescente: os casos não negativos, não positivos e de sinais opostos cobrem todos os pares ordenados, incluindo zero. A homogeneidade é verificada para `n=0`, `n>0` e `n<0`, em ambos os sinais da entrada. A proposição anterior pode então ser aplicada. |
| Área orientada | A hipótese `r>0`, a medida em radianos, o sinal e a multiplicidade são declarados antes da fórmula. O resultado é explicitamente condicional às propriedades admitidas de `S`; o texto não alega deduzir uma teoria geométrica de área. A normalização em `2π` dá `k=r²/2` e o exercício em `−3π` está correto. |

## Conferência com as fotografias

Esta tabela registra material efetivamente aberto, sem inferir identificação bibliográfica.

| Fotografia | Página | Conferência realizada |
|---|---:|---|
| `IMG_20261112_152558692_AE.jpg` | 24 | Definição com conjuntos não vazios; domínio, contradomínio, imagem e pré-imagem; convenção para `ℝ₊`. |
| `IMG_20261112_152603060_AE.jpg` | 25 | Domínio natural, restrição, extensão, sequências e exemplos próprios correspondentes. |
| `IMG_20261112_152611338_AE.jpg` | 26 | Sequência versus imagem; soma, produto, quociente; gráfico real; parte inteira. |
| `IMG_20261112_152616224_AE.jpg` | 27 | Critério vertical; injetividade e sobrejetividade; problema de formulação do critério horizontal e da inclusão na composição. |
| `IMG_20261112_152622894_AE.jpg` | 28 | Associatividade e exemplos de composição; duas identidades na definição de inversa. |
| `IMG_20261112_152627649_AE.jpg` | 29 | Bijeção/inversa, reflexão, exemplos afim e quadrado restrito, paridade e simetria do domínio. |
| `IMG_20261112_152634352_AE.jpg` | 30 | Definições de período e período mínimo; exemplo 1.2.26(1)–(3). |
| `IMG_20261112_152638239_AE.jpg` | 31 | Continuação da ausência de período mínimo; definição 1.2.27; enunciado e início da prova da proposição 1.2.28. |
| `IMG_20261112_152645376_AE.jpg` | 32 | Final da proposição, corolário 1.2.29 e aplicação condicional à área orientada com múltiplas voltas. |

As correções dos dois erros de formulação da p. 27 são necessárias. A fonte escreve, para a composição, `D ⊂ f(A) ⊂ B`, mas a condição que permite todas as aplicações é `f(A) ⊂ D`. A fonte também diz que uma função injetora encontra cada horizontal sobre o contradomínio em um único ponto; isso acrescentaria sobrejetividade. A aula usa corretamente “no máximo um”.

## Leitura final das aberturas e veredito

As aberturas não reivindicam novidade matemática nem usam exemplos finitos como demonstrações universais. A aula 04 distingue o ponto hipotético da proposição de linearidade de uma função efetivamente admissível. Na aplicação geométrica, a restrição condicional é visível no enunciado e no parágrafo imediatamente seguinte, onde o leitor precisa encontrá-la.

Não foi encontrado teorema principal falso ou lacuna nas demonstrações gerais, sob as hipóteses reais pretendidas. Antes da entrega, devem ser conciliadas a notação de pré-imagem e a convenção sobre domínios vazios; também convém explicitar os domínios reais e corrigir os números de referência. A cobertura do reescalonamento periódico depende do compromisso de abranger todos os resultados dessas páginas. Este parecer não certifica cálculos executados, estados das interações ou aparência em tela.

## Segunda leitura: fechamento das aulas

Após a implementação das correções, foram relidos os trechos alterados, sem navegador.

| Achado | Estado verificado |
|---|---|
| M1 — notação da pré-imagem | Resolvido: o domínio admissível agora usa `f⁻¹(D ∩ B)` e explica por que a interseção é necessária. |
| M2 — domínio vazio | Resolvido: `#funcao` permite explicitamente domínio vazio nas construções auxiliares e registra a ampliação da convenção da fonte. |
| M3 — hipóteses reais | Resolvido no enunciado da reflexão, que agora explicita `A,B ⊂ ℝ`. Nas definições de períodos e monotonicidade da aula 04, `A ⊂ ℝ` ainda fica implícito no contexto; permanece a recomendação de baixa severidade. |
| M4 — reescalonamento | Resolvido: `#reescalonamento` declara o domínio `E`, demonstra sua invariância nos dois sentidos e a igualdade dos valores. A extensão a `p` inteiro negativo é válida pela propriedade já provada para todos os múltiplos inteiros. O texto não confunde o período obtido com um período mínimo. A existência da bancada é identificável no HTML; seu funcionamento não foi examinado. |
| B1 — número do exemplo | Resolvido: o texto usa exemplo 1.2.26. A discussão da ausência de mínimo continua na p. 31, que pode ser acrescentada à nota de referência. |
| B2 — “função inteira” | Permanece como ajuste de clareza de baixa severidade na abertura. |

O núcleo textual das duas aulas pode ser aprovado. As recomendações residuais acima não invalidam as demonstrações.

## Revisão crítica do explorador digitável

Escopo: leitura integral de `assets/explorer-math.js`, leitura da apresentação do explorador em `simetria-e-monotonicidade.html#explorador`, dos testes em `tests/explorer.test.cjs` e do uso dos resultados em `assets/explorer.js`. A análise abaixo é estática. Uma tentativa de executar Node puro não prosseguiu porque `node` não estava disponível no caminho de comandos deste revisor; nenhum teste do explorador é certificado como executado por esta revisão.

### E1 — Decidir um ramo trigonométrico por coeficientes arredondados produz afirmações falsas

Severidade ALTA. Local: `analyze`, ramo elementar, declaração `canonical=B===1&&K===0` e uso em `restricted`.

Entrada aceita pela linguagem: `sin((1+1e-16)*x)`, com a restrição `sine`, declarada como `[−π/2,π/2]`. O coeficiente racional exato é `B=1+10⁻¹⁶>1`, mas sua conversão por `num` arredonda para `1`. A regra identifica indevidamente o ramo canônico de `sin(x)` e afirma monotonicidade estritamente crescente e uma inversa dada por `arcsin(y)`.

Contraexemplo matemático: `x₀=π/(2B)` está estritamente dentro do intervalo e satisfaz `f(x₀)=1`. No extremo direito, `f(π/2)=sin(Bπ/2)<1`, pois `1<B<3`. Logo a função não é crescente no intervalo declarado. Também deixa de ser injetora, porque o intervalo contém pontos dos dois lados do máximo de seno. A inversa anunciada não existe nesse domínio. A diferença ser pequena demais para uma figura não altera a afirmação global.

Correção mínima: testar `inner[1]` exatamente contra o racional `1` e `inner[0]` exatamente contra zero. A classificação pode retornar `unknown` para os demais coeficientes; não precisa resolver novos ramos. O mesmo cuidado vale para qualquer decisão estrutural que use `K===0` após conversão numérica.

### E2 — Produto de coeficientes numéricos pode inverter a classificação de monotonicidade

Severidade ALTA. Local: `orientation=Math.sign(A*B)` no ramo elementar; decisões análogas em `abs` e no recíproco.

Entrada aceita pela linguagem: `((1e-20)^6)^2*exp((1e-20)^6*x)`, no domínio natural. O coeficiente externo exato é `A=10⁻²⁴⁰>0` e o interno é `B=10⁻¹²⁰>0`. A função matemática é estritamente crescente. Os dois coeficientes ainda são representáveis individualmente como números positivos, mas seu produto `10⁻³⁶⁰` sofre subfluxo para zero em double. Assim `orientation` recebe zero e o código seleciona o ramo `decreasing`, uma afirmação global falsa.

Correção mínima: obter a orientação por `sign(atom.a)*sign(inner[1])`, usando os racionais exatos já disponíveis. No caso do módulo em semirreta, decidir o sinal pelo coeficiente externo e pelo sinal da semirreta; no recíproco, usar `sign(numerator[0])*sign(denominator[1])`. Produtos aproximados podem ser usados para desenhar uma inclinação, mas não para escolher o enunciado matemático.

### E3 — Separar impedimento numérico de exclusão do domínio

Severidade MÉDIA, de interpretação. Local: `allowed`, `evaluate` e a leitura do ponto em `assets/explorer.js`.

`allowed` exige que `evaluate` produza um número finito. Por isso `exp(x)` em `x=1000` é recusado por estouro de representação, embora `1000` pertença ao domínio real da exponencial. O texto da leitura desse ponto diz que a entrada está fora do domínio real selecionado. A nota sobre amostragem e janela não distingue explicitamente esse caso da inexistência matemática de valor.

Correção mínima: quando a representação numérica falhar, dizer “valor não representável nesta avaliação numérica ou fora do domínio” se o sistema ainda não consegue separar as causas; para famílias com domínio conhecido, separar as duas verificações. Não é necessário prometer desenho de valores de qualquer magnitude. A nota de uso de `cbrt(x)` para raízes cúbicas negativas já explicita a limitação prática pertinente às potências fracionárias.

### E4 — Justificativa do recíproco em domínio restrito

Severidade BAIXA. Local: ramo `a/(bx+c)`, justificativa de ausência de período.

Para `1/(x+3)` restrita a `[0,+∞)`, o domínio escolhido não exclui um polo interno; o polo `−3` já está fora da semirreta. A conclusão de ausência de período está correta, mas a justificativa “O domínio exclui exatamente um polo” não descreve esse domínio. Usar a obstrução pela semirreta em restrições e a obstrução pelo polo no domínio natural.

### Regras aprovadas no escopo lido

O parser constrói uma árvore de uma linguagem restrita e não usa execução do texto digitado. As precedências de unário, potência e operações binárias correspondem às regras pretendidas nos exemplos dos testes. A redução de polinômios usa coeficientes racionais exatos e recusa divisores polinomiais não constantes; assim não cancela, por exemplo, o furo de `x/x` para classificá-lo como uma constante em toda a reta. Divisão por constante zero é recusada, em vez de introduzir um coeficiente inválido.

As regras de monotonicidade para polinômios afins, monômios de grau par ou ímpar e somas de potências com sinais compatíveis são válidas nos domínios que identificam. As afirmações negativas sobre a inversa de potências pares usam domínios com pontos simétricos, e a inversa do ramo negativo recebe o sinal adequado. As fórmulas algébricas das inversas elementares afins e do recíproco estão corretas quando o ramo foi reconhecido legitimamente; o teste da entrada reconstruída na restrição impede os principais retornos fora da imagem, sujeito às limitações de avaliação numérica.

As regras recursivas de paridade e de simetria natural examinadas são conservadoras nos casos usuais: raízes e logaritmos exigem argumento par para certificar domínio simétrico; a divisão exige paridade do denominador para certificar a simetria dos zeros removidos. Não se encontrou nesta leitura um contraexemplo de paridade global falsa independente dos problemas de comparações aproximadas e da convenção para potência de expoente zero. A linguagem deve manter explícita a convenção de `0^0` ou recusar essa avaliação: `Math.pow(0,0)=1` não é uma convenção matemática universal.

Os períodos trigonométricos são obtidos por identidade estrutural, e não por repetição de amostras. A ausência de período em um domínio real não vazio limitado em pelo menos um sentido é correta com a definição que exige preservação por `±T`. Os resultados `unknown` são apresentados como não decididos, sem convertê-los em inexistência. A nova justificativa de que uma exponencial afim não constante em toda a reta não é par nem ímpar é válida: ela é injetora e tem limite finito em apenas um dos extremos, divergindo no outro.

### Veredito do explorador nesta leitura

E1 e E2 precisam ser corrigidos antes de aprovar as classificações globais do explorador. São falhas concretas de passagem entre cálculo exato e aproximado, e não uma exigência de ampliar a lista de funções reconhecidas. Retornar `unknown` ou recusar a classificação nesses casos é suficiente. E3 pede uma mensagem que distinga corretamente a limitação numérica. Não foi realizada busca exaustiva em todas as expressões aceitas, nem inspeção visual no navegador.

## Conferência de encerramento do explorador

Depois da comunicação dos contraexemplos, o agente principal substituiu as comparações estruturais por operações com os racionais exatos. A nova leitura confirmou: o ramo trigonométrico canônico exige coeficiente interno exatamente igual a `1` e translação exatamente nula; a orientação usa o produto dos sinais exatos; o módulo calcula sua inclinação como racional; o recíproco decide o sentido por sinais exatos. O limite de 250 algarismos para numerador e denominador recusa coeficientes maiores, em vez de os usar silenciosamente nas decisões.

Com o executável de Node indicado pelo agente principal, esta revisão executou `tests/explorer.test.cjs`: os seis testes passaram. Também foram feitas chamadas dirigidas próprias:

| Entrada e restrição | Resultado observado após a correção | Juízo |
|---|---|---|
| `sin((1+1e-16)*x)`, ramo `sine` | Monotonicidade e inversa `unknown`; paridade ímpar; ausência de período pela restrição do domínio. | E1 resolvido. A regra já não faz a afirmação falsa. |
| `((1e-20)^6)^2*exp((1e-20)^6*x)`, natural | Estritamente crescente, nem par nem ímpar, sem período; fórmula de inversa. | E2 resolvido. O sinal é decidido exatamente, ainda que o desenho perca variações minúsculas. |
| `sqrt(x+1.5707963267948966)`, ramo `sine` | Fronteira próxima do extremo sem certificação; classificações `unknown`. | A recusa conservadora evita usar arredondamento como prova de igualdade com `π/2`. |
| `sin(x)/x`, natural | Paridade par, sem classificação de período ou monotonicidade; avaliação em zero recusada. | Preserva o furo da expressão original. |
| `sqrt(x^2)`, natural | Paridade par; demais propriedades gerais não determinadas. | Correto e conservador. |
| `(x+1)^(-2)`, natural | Propriedades gerais não determinadas. | Não foi atribuída paridade a partir de uma falsa simetria dos polos. |
| `ln((1e-20)^6*x-((1e9)^6)^4)`, natural | Recusa por limite dos coeficientes ao construir a fronteira exata. | Não se converte um estouro de fronteira em afirmação de domínio vazio. |

As classificações examinadas podem ser aprovadas depois das correções E1–E2, com escopo restrito às regras e aos casos efetivamente lidos e executados. Permanecem E3 (a mensagem de falha numérica não deve afirmar exclusão matemática do domínio), E4 (justificativa local do recíproco) e a necessidade de declarar ou recusar `0^0`. Nos testes dirigidos, `exp(x)` em `1000` continuou a produzir `null` por estouro; `x^0` e `0^0` continuaram a valer `1` inclusive em zero. Essas convenções e limitações devem estar visíveis ao usuário. Não foi realizada enumeração exaustiva da linguagem nem verificação de navegador, desenho ou desempenho.
### Fechamento aplicado pelo implementador

Após o parecer adicional: E3 passou a dizer “fora do domínio ou exceder a faixa numérica”, sem deduzir exclusão matemática de uma falha numérica. E4 usa o argumento do polo somente no domínio natural do recíproco; nas restrições usa a limitação do domínio em pelo menos um sentido. Expoentes constantes iguais a zero são recusados explicitamente pelo parser; `1` define a constante. `0^0` e `x^0` são controles de rejeição nos testes, e `x^x` não recebe valor em zero. Os 27 testes completos passaram após essas alterações. Este parágrafo registra as correções do implementador, sem ampliar o escopo da revisão independente acima.
