# Curso de cálculo

Aulas locais para um curso de uma variável real, com demonstrações completas e interações que acompanham os argumentos. O nível de formalismo segue a referência fornecida por Gabriel; a apresentação visual segue as aulas consultadas em [Explicações Visuais](https://vxplain.io/).

## Abrir

Abra `index.html` no navegador ou, a partir desta pasta, execute:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

O endereço é `http://127.0.0.1:8765/`. As aulas e simulações funcionam sem conexão. As fontes do Google são opcionais e têm alternativas locais.

## Verificar

Com Node.js 18 ou posterior:

```sh
node --test tests/*.test.cjs
```

Não é necessário instalar pacotes. Os testes conferem as construções usadas nas interações; as demonstrações gerais passam por revisão matemática própria.

As fórmulas são escritas em LaTeX e renderizadas pelo KaTeX 0.19.1, distribuído com suas fontes e licença em `assets/vendor/katex/`. A renderização matemática funciona sem conexão. As referências aos resultados abrem o enunciado em nova aba.

## Organização

- `index.html`: entrada das aulas disponíveis.
- `ordem-e-distancia.html`: ordem, intervalos, módulo e desigualdades.
- `completude-e-aproximacao.html`: cotas, completude, propriedade arquimediana, acumulação e densidade.
- `funcoes-e-inversas.html`: funções, imagem e pré-imagem, operações, composição e inversa.
- `simetria-e-monotonicidade.html`: paridade, períodos, monotonicidade, linearidade e área orientada.
- Nessa aula, `#explorador` aceita funções digitadas, analisa famílias reconhecidas e compara gráficos. A opção de domínio permite obter ramos inversos. “Não determinado” indica o limite da análise simbólica, sem inferir propriedades globais da amostragem.
- `assets/`: apresentação, interações e cálculos.
- `docs/`: correspondência com as fotos, planejamento e verificações.

O material está em desenvolvimento. O restante do capítulo — trigonometria, limitação e extremos — está mapeado em `docs/ROTEIRO.md`. Não foram copiados arquivos do repositório privado do Renato.
