# Verificação

Critérios definidos antes de implementar as interações, em 12/11/2026.

## Matemática e cálculos

Os enunciados gerais são sustentados por provas completas. Os testes de software verificam a execução das construções para os parâmetros oferecidos pela interface. Não há ajustes de modelos nem reconhecimento de constantes.

- Intervalos: extremos abertos e fechados, intervalo degenerado e recusa de extremos invertidos.
- Desigualdades de módulo: exemplos de igualdade, desigualdade estrita e sinais distintos; prova por casos e prova pela ordem no texto.
- Testemunhas arquimedianas: conferir `n*x > L` por multiplicação inteira, incluindo igualdade de `L` com um múltiplo de `x`.
- Recíprocos: conferir `1/n < epsilon` por multiplicação cruzada com inteiros, sem comparar números formatados.
- Raiz de 2: conferir os extremos racionais da bisseção por quadrados inteiros, em todos os níveis oferecidos.
- Densidade: conferir `a < k/n < b` por multiplicação cruzada com BigInt, para intervalos diádicos positivos e negativos da interface.
- Acumulação em zero: conferir a testemunha `1/n` dentro da vizinhança perfurada por aritmética inteira.
- Controle negativo: mostrar que os comparadores rejeitam uma testemunha no extremo excluído e um denominador insuficiente.

As verificações exatas compartilham a álgebra elementar descrita nas provas, mas não usam o arredondamento nem o desenho da interface. Não se reivindica uma certificação numérica independente de um teorema novo.

## Navegador

Conferir links, ausência de erros de JavaScript, atualização dos valores e figuras, passos das demonstrações, extremos dos controles, teclado e ausência de transbordamento em tela de celular.

## Execução

Concluída em 12/11/2026 para a primeira versão das duas aulas.

- **13 testes automatizados passaram:** dois de estrutura e links; onze de cálculos, desigualdades e controles negativos. Executados com Node.js 24.22.1. Também foi conferida a sintaxe de `assets/course.js`.
- **Revisão matemática em contexto separado:** provas e lógica das figuras examinadas; os achados substantivos foram corrigidos. O histórico está em `referee_sim_aulas.md`. A revisão não se apresentou como execução de testes ou inspeção de navegador.
- **31 transições de prova**, nas **14 bancadas com demonstração**, foram percorridas no navegador. Em cada transição, o SVG mudou. As figuras também foram inspecionadas visualmente em exemplos representativos.
- **66 mudanças para extremos de controles** foram executadas com teclado: 30 na aula 01 e 36 na aula 02, incluindo a bisseção inicialmente recolhida. Não produziram `NaN`, `Infinity` ou valores indefinidos nos desenhos.
- Casos particulares conferidos pela interface: intervalo degenerado `[0,0]` com pertinência de zero; intervalo vazio `(0,0)`; multiplicação da ordem por zero; produto por racional zero; conjunto finito sem acumulação; reflexão de um conjunto com ínfimo −4 em outro de supremo 4.
- Visualização conferida em **1280×900** e **390×844**. Não houve transbordamento horizontal das páginas nas inspeções, nem rótulos SVG fora dos respectivos quadros nos estados examinados. O tamanho de tela foi restaurado após os testes.
- Não foram registrados erros de JavaScript no console durante os percursos examinados. A prévia foi servida localmente; o servidor temporário foi encerrado após a verificação.

## Limites

Os testes de amostras e de interface não provam os teoremas: essa função pertence aos argumentos gerais do texto. A localização de números como `k/n + √2` usa aproximações de ponto flutuante no desenho; a forma exata e sua classificação são justificadas pela prova. Os controles têm faixas finitas.

A navegação foi testada por HTTP local. A abertura direta por `file:` não foi executada pelo navegador de verificação, que bloqueia esse protocolo. O código não usa carregamento dinâmico, pacotes externos obrigatórios ou servidor de aplicação; o uso direto dos HTML fica como verificação adicional possível no navegador do usuário. As fontes externas são opcionais.

O restante do capítulo está planejado e ainda não foi implementado. Autor e edição do livro continuam pendentes de identificação. O material não foi publicado nem integrado ao repositório privado do Renato.
Atualização: as aulas 03–04 e o explorador aberto foram acrescentados. A verificação específica está em [VERIFICACAO_03_04.md](VERIFICACAO_03_04.md); os registros anteriores abaixo se referem à entrega das aulas 01–02.
