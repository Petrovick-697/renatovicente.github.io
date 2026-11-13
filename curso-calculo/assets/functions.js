/* Bancadas das aulas 03–04. Os exemplos não substituem as provas gerais. */
(function () {
  'use strict';
  const C=window.Calculo;
  const E=window.CalculoLessons={config:{},drawers:{},onInput:{},onStep:{}};
  const range=(key,label,min,max,step,value,display)=>({key,label,min,max,step,value,display});
  const select=(key,label,options,value)=>({key,label,options,value});
  const families=[['square','x²'],['cube','x³'],['mixed','x² + x'],['zero','0']];
  const graphCases=[['square','x² em ℝ'],['positive','x² em ℝ₊'],['circle','Relação x² + y² = 1']];
  const mapCases={bijective:{a:[0,1,2],b:[0,1,2],out:[2,0,1]},collision:{a:[0,1,2],b:[0,1],out:[0,0,1]},missing:{a:[0,1],b:[0,1,2],out:[0,1]}};
  Object.assign(E.config,{
    'f-map':{label:'Entradas, saídas e contradomínio',controls:[select('wide','Contradomínio',[['no','{0, 1, 4}'],['yes','{0, 1, 2, 3, 4}']],'yes'),range('i','Entrada selecionada (índice)',0,4,1,0)]},
    'f-image':{label:'Imagem e imagem inversa pelo quadrado',controls:[select('mode','Operação',[['image','Imagem de D = [a, b]'],['preimage','Imagem inversa de C = [a, b]']],'image'),range('a','Extremo a',-3,3,.25,-1),range('width','Largura b − a',0,4,.25,2)]},
    'f-restriction':{label:'Duas extensões da identidade em ℝ₊',controls:[select('family','Extensão a ℝ',[['identity','F(x) = x'],['absolute','G(x) = |x|']],'absolute'),range('x','Entrada x',-2,2,.25,-1)]},
    'f-sequence':{label:'Sequência e sua imagem',controls:[select('family','Sequência',[['alternating','aₙ = (−1)ⁿ'],['opposite','bₙ = (−1)ⁿ⁺¹'],['reciprocal','cₙ = 1/(n + 1)']],'alternating'),range('n','Índice n',0,8,1,0)]},
    'f-operation':{label:'Operações e seus domínios',controls:[select('operation','Expressão',[['sum','√x + (x − 1)'],['product','√x · (x − 1)'],['quotient','√x / (x − 1)'],['floor','⌊x⌋']],'quotient'),range('x','Entrada x',-2,4,.25,1)]},
    'f-graph':{label:'Critérios vertical e horizontal',controls:[select('family','Relação / domínio',graphCases,'square'),select('codomain','Contradomínio do quadrado',[['real','ℝ'],['positive','ℝ₊']],'positive'),range('value','Coordenada da reta de teste',-1.5,1.5,.25,1)]},
    'f-composition':{label:'Domínio máximo da composição com raiz',controls:[range('c','c',0,4,.25,1),range('x','Entrada x',-3,3,.25,.5)]},
    'f-associative':{label:'Dois agrupamentos de uma composição',controls:[range('x','Entrada x',-2,2,.25,1)]},
    'f-inverse':{label:'Bijeção e construção da inversa',controls:[select('family','Aplicação finita',[['bijective','Bijetora'],['collision','Sobrejetora com colisão'],['missing','Injetora com saída ausente']],'bijective'),range('i','Índice da entrada',0,s=>mapCases[s.family].a.length-1,1,0)],normalize:s=>{s.i=Math.min(s.i,mapCases[s.family].a.length-1);}},
    'f-reflection':{label:'Gráfico da inversa por reflexão',controls:[select('family','Função',[['affine','mx + b em ℝ'],['square','x² em ℝ₊']],'affine'),range('m','m',-2,2,.5,1),range('b','b',-2,2,.5,1),range('x','Entrada x',-2,2,.25,1)],normalize:s=>{if(s.family==='square')s.x=Math.max(0,s.x);}},
    's-parity':{label:'Paridade e transformações do gráfico',controls:[select('family','Função em ℝ',families,'square'),range('x','Entrada x',-2,2,.25,1)]},
    's-multiples':{label:'Translações por múltiplos inteiros do período',controls:[range('x','Entrada inicial x',-1,1,.25,.25),range('m','Número de saltos m',1,4,1,3)]},
    's-rescale':{label:'Mudança de escala em uma função periódica',controls:[range('p','Inteiro p ≠ 0',-3,3,1,2),range('q','Inteiro q ≥ 1',1,4,1,3),range('x','Entrada x',-1,1,.25,.25)],normalize:s=>{if(s.p===0)s.p=1;}},
    's-periods':{label:'Períodos e existência de um mínimo',controls:[select('family','Função em ℝ',[['fraction','Parte fracionária'],['constant','Constante f = 1'],['rational-indicator','χℚ']],'fraction'),select('type','Deslocamento T',[['rational','T = 1/q'],['root','T = √2']],'rational'),range('q','Denominador q',1,8,1,2)]},
    's-monotone':{label:'Ordem das entradas e saídas',controls:[select('family','Função',[['affine','mx em ℝ'],['square','x² em ℝ'],['positive','x² em ℝ₊'],['floor','⌊x⌋ em ℝ']],'affine'),range('m','Inclinação m',-2,2,.5,1),range('x','Primeira entrada x₁',-2,1,.25,-1),range('gap','x₂ − x₁',.25,2,.25,1)],normalize:s=>{if(s.family==='positive')s.x=Math.max(0,s.x);}},
    's-linearity':{label:'Racional que contradiz um desvio da reta',controls:[range('c','c',1,4,1,2,v=>String(v/2)),select('kind','Entrada x',[['positive','√2'],['negative','−√2'],['shifted','1 + √2']],'positive'),range('d','Desvio δ',-4,4,1,-2,v=>String(v/4))]},
    's-positive':{label:'Extensão ímpar da função da semirreta',controls:[select('family','Modelo em ℝ₊',[['affine','f(x) = cx'],['square','f(x) = x² (falha homogeneidade)']],'affine'),range('c','c',.5,2,.5,1),range('x','x positivo',.25,2,.25,1),range('n','Inteiro n',-3,3,1,2)]},
    's-sector':{label:'Área orientada de um setor com multiplicidade',controls:[range('r','Raio r',.5,2,.25,1),range('theta','θ/π',-2,4,.25,1)]}
  });
  for(const kind of ['f-image','f-restriction','f-sequence','f-operation','f-graph','f-reflection','s-parity','s-multiples','s-rescale','s-periods','s-monotone','s-linearity','s-positive'])E.config[kind].viewBox='0 0 560 420';
  E.config['s-periods'].viewBox=s=>s.family==='rational-indicator'?'0 0 560 280':'0 0 560 420';
  function niceTicks(min,max){const raw=(max-min)/4,power=10**Math.floor(Math.log10(raw)),n=raw/power,step=(n<1.5?1:n<3?2:n<7?5:10)*power,out=[];for(let i=Math.ceil(min/step);i*step<=max+step*1e-8;i++)out.push(i*step);return out;}
  function plot(H,name,xmin,xmax,ymin,ymax,equal=false,ticks={}) {
    const left=equal?115:75,right=equal?445:515,top=30,bottom=360;
    const X=x=>left+(x-xmin)/(xmax-xmin)*(right-left),Y=y=>bottom-(y-ymin)/(ymax-ymin)*(bottom-top);
    const id='clip-'+name;
    let svg=`<defs><clipPath id="${id}"><rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/></clipPath></defs>`;
    const xticks=ticks.x||niceTicks(xmin,xmax),yticks=ticks.y||niceTicks(ymin,ymax);
    for(const x of xticks)svg+=H.segment(X(x),top,X(x),bottom,H.line,1)+H.text(X(x),390,H.fmt(x,2));
    for(const y of yticks)svg+=H.segment(left,Y(y),right,Y(y),H.line,1)+H.text(left-10,Y(y)+5,H.fmt(y,2),H.muted,'end');
    if(xmin<=0&&xmax>=0)svg+=H.segment(X(0),top,X(0),bottom,H.muted,1.5);
    if(ymin<=0&&ymax>=0)svg+=H.segment(left,Y(0),right,Y(0),H.muted,1.5);
    function curve(fn,color=H.blue,a=xmin,b=xmax) {
      let d='',pen=false;
      for(let j=0;j<=220;j++) {
        const x=a+(b-a)*j/220,y=fn(x);
        if(y===null||!Number.isFinite(y)){pen=false;continue;}
        d+=`${pen?'L':'M'}${X(x)},${Y(y)} `;pen=true;
      }
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" clip-path="url(#${id})"/>`;
    }
    const dot=(x,y,label,color=H.blue,closed=true,radius=6)=>{if(label)H.legend.push({label:`${label}: (${H.fmt(x)}; ${H.fmt(y)})`,color});return `<g clip-path="url(#${id})"><circle cx="${X(x)}" cy="${Y(y)}" r="${radius}" fill="${closed?color:'white'}" stroke="${color}" stroke-width="2.5"/></g>`;};
    return {svg,X,Y,curve,dot,id,left,right,top,bottom};
  }
  function arrow(H,x1,y1,x2,y2,color) {
    const a=Math.atan2(y2-y1,x2-x1),r=8;
    return H.segment(x1,y1,x2,y2,color,2)+`<path d="M${x2-r*Math.cos(a-.5)},${y2-r*Math.sin(a-.5)} L${x2},${y2} L${x2-r*Math.cos(a+.5)},${y2-r*Math.sin(a+.5)}" fill="none" stroke="${color}" stroke-width="2"/>`;
  }
  function nodes(H,a,b,out,selected,reverse=false) {
    const y=(i,n)=>65+i*160/Math.max(1,n-1);
    let svg=H.text(85,28,'A',H.ink)+H.text(475,28,'B',H.ink);
    out.forEach((v,i)=>{const j=b.indexOf(v),color=i===selected?H.purple:H.line;svg+=reverse?arrow(H,455,y(j,b.length),105,y(i,a.length),color):arrow(H,105,y(i,a.length),455,y(j,b.length),color);});
    a.forEach((v,i)=>svg+=`<circle cx="85" cy="${y(i,a.length)}" r="19" fill="white" stroke="${i===selected?H.purple:H.line}" stroke-width="2"/>`+H.text(85,y(i,a.length)+6,String(v),H.ink));
    b.forEach((v,i)=>svg+=`<circle cx="475" cy="${y(i,b.length)}" r="19" fill="white" stroke="${v===out[selected]?H.purple:H.line}" stroke-width="2"/>`+H.text(475,y(i,b.length)+6,String(v),H.ink));
    return svg;
  }
  const set=values=>'{'+values.join(', ')+'}';
  E.drawers['f-map']=(s,H)=>{
    const a=[-2,-1,0,1,2],b=s.wide==='yes'?[0,1,2,3,4]:[0,1,4],out=a.map(x=>C.exampleValue('square',x)),m=C.finiteMap(a,b,out);
    return H.result(nodes(H,a,b,out,s.i),[['Imagem',set(m.image)],['Sobrejetora?',m.surjective?'Sim':'Não']],`Cada entrada tem uma saída. ${a[s.i]} é enviado a ${out[s.i]}. −1 e 1 terem a mesma saída não impede que seja função. O contradomínio ${s.wide==='yes'?'tem valores não atingidos.':'coincide com a imagem.'}`);
  };
  E.drawers['f-image']=(s,H)=>{
    const a=s.a,b=a+s.width,image=s.mode==='image',R=Math.max(2,Math.abs(a),Math.abs(b))+1,p=plot(H,'image',-R,R,Math.min(-1,a-1),image?R*R:Math.max(2,b+1));
    let svg=p.svg+p.curve(x=>C.exampleValue('square',x)),label;
    if(image) {
      const v=C.squareImage(a,b);label=`[${H.fmt(v.min)}; ${H.fmt(v.max)}]`;
      svg+=H.segment(p.X(a),p.Y(0),p.X(b),p.Y(0),H.purple,8)+H.segment(p.X(0),p.Y(v.min),p.X(0),p.Y(v.max),H.green,8);
      svg+=p.dot(a,a*a,'a²',H.purple)+p.dot(b,b*b,'b²',H.green);
    } else {
      const intervals=C.squarePreimage(a,b);
      label=intervals.length?intervals.map(([l,r])=>`[${l<0?'−':''}√${H.fmt(l*l)}; ${r<0?'−':''}√${H.fmt(r*r)}]`).join(' ∪ '):'∅';
      svg+=H.segment(p.X(0),p.Y(a),p.X(0),p.Y(b),H.purple,8);
      intervals.forEach(([l,r])=>{svg+=H.intervalDrawing(p.X,l,r,p.Y(0),true,true,H.green);svg+=p.dot(l,l*l,'',H.green)+p.dot(r,r*r,'',H.green);});
    }
    return H.result(svg,[[image?'D':'C',`[${H.fmt(a)}; ${H.fmt(b)}]`],[image?'f(D)':'f⁻¹(C)',label]],image?'O segmento roxo está no eixo das entradas; o verde mostra todas as saídas correspondentes. Se o intervalo contém zero, o mínimo é zero.':'A faixa roxa seleciona saídas. Os segmentos verdes contêm todas as entradas cujo quadrado está nessa faixa. f⁻¹(C) é um conjunto e não exige que f tenha inversa.');
  };
  E.drawers['f-restriction']=(s,H)=>{
    const p=plot(H,'restriction',-2.5,2.5,-2.5,2.5),f=x=>C.exampleValue(s.family,x),svg=p.svg+p.curve(f,H.purple,-2.5,0)+p.curve(x=>x,H.blue,0,2.5)+p.dot(s.x,f(s.x),'(x, F(x))',H.green);
    return H.result(svg,[['Entrada',H.fmt(s.x)],['Saída',H.fmt(f(s.x))]],s.x>=0?'As duas extensões coincidem com a identidade para toda entrada não negativa.':'No eixo negativo, x e |x| dão extensões diferentes da mesma função original em ℝ₊.');
  };
  E.drawers['f-sequence']=(s,H)=>{
    const p=plot(H,'sequence',0,9,-1.5,1.5);let svg=p.svg;
    for(let n=0;n<=8;n++)svg+=p.dot(n,C.sequenceValue(s.family,n),n===s.n?'n = '+n:'',n===s.n?H.purple:H.blue);
    svg+=H.text(535,130,'…',H.ink);
    return H.result(svg,[['Termo selecionado',H.fmt(C.sequenceValue(s.family,s.n))],['Imagem',s.family==='reciprocal'?'{1/(n+1) : n ∈ ℕ}':'{−1, 1}']],s.family==='reciprocal'?'A fórmula define infinitos termos. A figura exibe somente os índices de 0 a 8.':'As duas sequências alternadas têm a mesma imagem, mas valores opostos em cada índice; portanto são funções diferentes.');
  };
  E.drawers['f-operation']=(s,H)=>{
    const floor=s.operation==='floor',fn=x=>floor?C.exampleValue('floor',x):C.functionOperation(x,s.operation),p=plot(H,'operation',-2,4,-5,7);let svg=p.svg;
    if(floor){for(let k=-2;k<4;k++)svg+=H.intervalDrawing(p.X,k,k+1,p.Y(k),true,false,H.blue);}
    else if(s.operation==='quotient')svg+=p.curve(fn,H.blue,0,.998)+p.curve(fn,H.blue,1.002,4)+H.segment(p.X(1),30,p.X(1),230,H.red,1.5,'5 5');
    else svg+=p.curve(fn,H.blue,0,4);
    const value=fn(s.x);if(value!==null)svg+=p.dot(s.x,value,'x',H.purple);
    return H.result(svg,[['Domínio',floor?'ℝ':s.operation==='quotient'?'[0,1) ∪ (1,+∞)':'[0,+∞)'],['Valor',value===null?'Não definido':H.fmt(value)]],floor?`⌊${H.fmt(s.x)}⌋ = ${H.fmt(value)}. O piso é o maior inteiro menor ou igual à entrada; para negativos ele não trunca em direção a zero.`:value===null?'A entrada viola o domínio da raiz ou anula o denominador. Nenhum valor real é atribuído.':'A operação usa a mesma entrada nas duas funções; no quociente, o denominador precisa ser não nulo.');
  };
  E.drawers['f-graph']=(s,H)=>{
    const circle=s.family==='circle',positive=s.family==='positive',horizontal=s.step>=2,p=plot(H,'graph',-2.5,2.5,-2.5,2.5,true);let svg=p.svg,count;
    if(circle) {
      svg+=`<circle cx="${p.X(0)}" cy="${p.Y(0)}" r="${p.X(1)-p.X(0)}" fill="none" stroke="${H.blue}" stroke-width="3"/>`;
      count=Math.abs(s.value)>1?0:Math.abs(s.value)===1?1:2;
    } else {svg+=p.curve(x=>x*x,H.blue,positive?0:-2.5,2.5);count=horizontal?(s.value<0?0:s.value===0||positive?1:2):(positive&&s.value<0?0:1);}
    svg+=horizontal?H.segment(p.left,p.Y(s.value),p.right,p.Y(s.value),H.red,2):H.segment(p.X(s.value),p.top,p.X(s.value),p.bottom,H.purple,2);
    if(s.step===1)svg+=H.text(280,20,circle?'Duas saídas na mesma entrada':'Uma saída por entrada',H.ink);
    if(s.step===3)svg+=H.text(280,20,s.codomain==='real'?'Saídas negativas em B':'B = ℝ₊',H.ink);
    const global=circle?'Não é gráfico de função':positive?`Injetora; ${s.codomain==='positive'?'sobrejetora':'não sobrejetora'} em B`:`Não injetora; ${s.codomain==='positive'?'sobrejetora':'não sobrejetora'} em B`;
    return H.result(svg,[['Interseções na reta',String(count)],['Classificação global',global]],horizontal?'Injetividade exige no máximo uma interseção em toda horizontal. Sobrejetividade exige pelo menos uma para cada altura pertencente ao contradomínio declarado.':'O critério vertical exige exatamente uma saída para cada entrada do domínio declarado. Para x² em ℝ₊, entradas negativas estão fora do domínio; na circunferência, x = 0 possui duas saídas.');
  };
  E.drawers['f-composition']=(s,H)=>{
    const v=C.squareRootComposition(s.x,s.c),labels=[`x = ${H.fmt(s.x)}`,`u = ${H.fmt(v.inner)}`,v.defined?`√u ≈ ${H.fmt(v.value)}`:'Sem saída real'];
    let svg=H.text(80,95,labels[0],H.blue)+H.text(280,50,'f(x) = x² − c',H.ink);
    if(s.step>=1)svg+=arrow(H,135,100,220,100,H.purple)+H.text(280,105,labels[1],v.defined?H.green:H.red)+H.text(280,160,v.defined?'u ∈ [0,+∞)':'u ∉ [0,+∞)',v.defined?H.green:H.red);
    if(s.step>=2)svg+=arrow(H,340,100,425,100,v.defined?H.green:H.red)+H.text(475,105,labels[2],v.defined?H.green:H.red)+H.text(475,50,'g(u) = √u',H.ink);
    svg+=H.text(280,235,s.c===0?'E = ℝ; √(x²) = |x|':`E = (−∞,−√${H.fmt(s.c)}] ∪ [√${H.fmt(s.c)},+∞)`,H.ink);
    return H.result(svg,[['Teste de domínio',`${H.fmt(s.x*s.x)} ${v.defined?'≥':'<'} ${H.fmt(s.c)}`],['Composição',v.defined?'Definida':'Não definida']],['Primeiro calcule f(x). O fato de x pertencer ao domínio de f não basta para compor.','Agora teste se a saída de f pertence ao domínio de g.','Só depois do teste podemos aplicar g; as entradas aprovadas formam o domínio máximo E.'][s.step]);
  };
  E.drawers['f-associative']=(s,H)=>{
    const v=[s.x,s.x+1,(s.x+1)**2,2*(s.x+1)**2],positions=[55,205,355,505];let svg='';
    for(let i=0;i<=Math.min(3,s.step+1);i++){svg+=H.text(positions[i],130,H.fmt(v[i]),i===s.step+1?H.purple:H.ink);if(i)svg+=arrow(H,positions[i-1]+30,123,positions[i]-30,123,H.blue)+H.text((positions[i-1]+positions[i])/2,95,['','f: +1','g: quadrado','h: ×2'][i],H.muted);}
    if(s.step===1)svg+=H.segment(45,180,365,180,H.purple,4)+H.text(205,210,'g ∘ f',H.purple);
    if(s.step===2)svg+=H.segment(195,180,515,180,H.green,4)+H.text(355,210,'h ∘ g',H.green);
    return H.result(svg,[['h ∘ (g ∘ f)',H.fmt(v[3])],['(h ∘ g) ∘ f',H.fmt(v[3])]],['Os tipos permitem aplicar f e depois g.','O primeiro agrupamento calcula g∘f antes de aplicar h.','O segundo calcula h∘g após f. A ordem f, g, h é a mesma nos dois agrupamentos.'][s.step]);
  };
  E.drawers['f-inverse']=(s,H)=>{
    const {a,b,out}=mapCases[s.family],v=C.finiteMap(a,b,out);let svg=nodes(H,a,b,out,s.i,s.step>=2);
    if(s.step===1)svg+=H.text(280,265,'Toda saída y precisa de uma entrada h(y)',H.ink);
    if(s.step===3)svg+=arrow(H,160,250,400,250,H.green)+H.text(280,245,'f(h(y)) = y; h(f(x)) = x',H.green);
    if(s.step===4)svg+=H.text(280,265,'h(y) = k(y): a entrada é única',H.purple);
    return H.result(svg,[['Injetora / sobrejetora',`${v.injective?'Sim':'Não'} / ${v.surjective?'Sim':'Não'}`],['Inversa A ← B',v.bijective?'Existe e é única':'Não existe']],v.bijective?['Se uma inversa existe, entradas distintas não podem colidir. A aplicação mostrada é bijetora.','A identidade f(h(y)) = y exige que todas as saídas sejam atingidas.','Inverta as setas: a existência vem da sobrejetividade e a escolha única vem da injetividade.','Percorrer uma seta e voltar pela inversa recupera o ponto inicial dos dois lados.','Qualquer outra inversa k precisa escolher a mesma entrada única para cada y.'][s.step]:s.family==='collision'?'A saída 0 tem duas entradas. Uma inversa teria de retornar ambas como uma única saída, o que é impossível.':'A saída 2 não é atingida. Não há valor h(2) que satisfaça f(h(2)) = 2.');
  };
  E.drawers['f-reflection']=(s,H)=>{
    const square=s.family==='square',valid=square||s.m!==0,f=x=>C.exampleValue(square?'square':'affine',x,s.m,s.b),y=f(s.x),R=Math.max(3,Math.abs(y)+1),p=plot(H,'reflection',-R,R,-R,R,true);let svg=p.svg+p.curve(f,H.blue,square?0:-R,R)+p.dot(s.x,y,'(x, f(x))',H.blue);
    if(valid&&s.step>=1)svg+=p.curve(v=>square?(v>=0?Math.sqrt(v):null):C.affineInverse(s.m,s.b,v),H.green)+p.dot(y,s.x,'(f(x), x)',H.green);
    if(valid&&s.step>=2)svg+=p.curve(v=>v,H.muted)+H.segment(p.X(s.x),p.Y(y),p.X(y),p.Y(s.x),H.purple,2,'5 5')+p.dot((s.x+y)/2,(s.x+y)/2,'M ∈ {y=x}',H.purple);
    return H.result(svg,[['Inversa',!valid?'Não existe':square?'√y em ℝ₊':`(y − ${H.fmt(s.b)})/${H.fmt(s.m)}`],['Coordenadas',`(${H.fmt(s.x)}; ${H.fmt(y)})`]],!valid?'m = 0: a função constante em ℝ não é bijetora de ℝ em ℝ.':s.step===0?'O ponto azul registra entrada e saída.':s.step===1?'O ponto verde troca as coordenadas; o gráfico verde é o da inversa.':'A reta y = x bissecta perpendicularmente o segmento entre os pontos. Os eixos têm a mesma unidade geométrica.');
  };
  E.drawers['s-parity']=(s,H)=>{
    const f=x=>C.exampleValue(s.family,x),bounds={square:[-1,5],cube:[-9,9],mixed:[-3,7],zero:[-1,1]}[s.family],p=plot(H,'parity',-2.25,2.25,...bounds),y=f(s.x),transformed=s.step===0?y:-y;
    const svg=p.svg+p.curve(f)+p.dot(s.x,y,'(x, f(x))',H.blue)+p.dot(-s.x,transformed,'Transformado',H.purple,false,10)+p.dot(-s.x,f(-s.x),'Valor em −x',H.green,true,5)+H.segment(p.X(s.x),p.Y(y),p.X(-s.x),p.Y(transformed),H.purple,2,'5 5');
    const parity={square:'Par',cube:'Ímpar',mixed:'Nem par nem ímpar',zero:'Par e ímpar'}[s.family];
    return H.result(svg,[['Classificação global',parity],[s.step===0?'f(−x) e f(x)':'f(−x) e −f(x)',`${H.fmt(f(-s.x))} e ${H.fmt(transformed)}`]],s.step===0?'A reflexão no eixo vertical preserva a altura. A igualdade para todo x caracteriza uma função par.':'A simetria central troca os dois sinais. A igualdade para todo x caracteriza uma função ímpar. Um ponto coincidente isolado não decide a classificação global.');
  };
  E.drawers['s-multiples']=(s,H)=>{
    const sign=s.step===2?-1:1,count=s.step===0?1:s.m,destination=s.x+sign*count,min=Math.floor(Math.min(s.x,destination))-.2,max=Math.ceil(Math.max(s.x,destination))+.2,integers=Array.from({length:Math.ceil(max)-Math.floor(min)},(_,i)=>Math.floor(min)+i),p=plot(H,'multiples',min,max,-.12,1.12,false,{x:integers.filter(k=>k>=min),y:[0,.5,1]});let svg=p.svg;
    for(const k of integers)svg+=p.curve(x=>x-k,H.blue,Math.max(k,min),Math.min(k+1-.001,max))+p.dot(k,0,'',H.blue)+p.dot(k+1,1,'',H.blue,false);
    for(let j=0;j<=count;j++) {const x=s.x+sign*j,y=C.fractionalPart(s.x);svg+=p.dot(x,y,j===count?'x + kT':j===0?'x':'',j===count?H.purple:H.green);if(j)svg+=arrow(H,p.X(x-sign),p.Y(y)-20,p.X(x),p.Y(y)-20,H.purple);}
    return H.result(svg,[['T; k','1; '+sign*count],['Altura preservada',H.fmt(C.fractionalPart(s.x))]],['Um salto de tamanho T preserva o domínio e o valor da função.','A hipótese pode ser aplicada outra vez no ponto alcançado; essa é a etapa de indução.','Repetir os saltos de −T prova os deslocamentos negativos. mT é período porque ambos os sentidos estão permitidos.'][s.step]);
  };
  E.drawers['s-rescale']=(s,H)=>{
    const u=s.p*s.x/s.q,next=u+s.p,y=C.fractionalPart(u),min=Math.floor(Math.min(u,next))-.2,max=Math.ceil(Math.max(u,next))+.2,integers=Array.from({length:Math.ceil(max)-Math.floor(min)},(_,i)=>Math.floor(min)+i),p=plot(H,'rescale',min,max,-.12,1.12,false,{x:integers.filter(k=>k>=min),y:[0,.5,1]});let svg=p.svg;
    for(const k of integers)svg+=p.curve(x=>x-k,H.blue,Math.max(k,min),Math.min(k+1-.001,max))+p.dot(k,0,'',H.blue)+p.dot(k+1,1,'',H.blue,false);
    svg+=p.dot(u,y,'(p/q)x',H.purple);
    if(s.step>=1)svg+=p.dot(next,y,'(p/q)x + pT',H.green)+arrow(H,p.X(u),p.Y(y)-20,p.X(next),p.Y(y)-20,H.purple);
    if(s.step>=2)svg+=H.text(280,20,'g(x ± qT) = g(x)',H.green);
    return H.result(svg,[['Período de g garantido',`qT = ${s.q}`],['Argumentos de f',`${H.fmt(u)} e ${H.fmt(next)}`]],['A mudança de escala leva a entrada x de g ao argumento (p/q)x de f.','Somar qT na entrada de g soma pT no argumento de f.','pT é um deslocamento por um número inteiro de períodos. Isso prova que qT é período; não prova que seja o menor.'][s.step]);
  };
  E.drawers['s-periods']=(s,H)=>{
    const T=s.type==='root'?Math.SQRT2:1/s.q,valid=C.knownPeriod(s.family,s.type,s.q),label=s.type==='root'?'√2':`1/${s.q}`;let svg;
    if(s.family==='rational-indicator') {
      svg=H.text(130,70,'0 ∈ ℚ',H.blue)+H.text(430,70,s.type==='root'?'√2 ∉ ℚ':`${label} ∈ ℚ`,H.purple)+arrow(H,180,100,380,100,H.purple)+H.text(280,130,'Translação por T',H.muted)+H.point(130,190,'χℚ(0) = 1',H.blue,true,225)+H.point(430,valid?190:255,`χℚ(T) = ${valid?1:0}`,valid?H.green:H.red,true,valid?225:225);
    } else {
      const p=plot(H,'periods',0,2.5,-.2,1.5);svg=p.svg;
      if(s.family==='constant')svg+=p.curve(()=>1);else for(let k=0;k<3;k++)svg+=p.curve(x=>C.fractionalPart(x),H.blue,k,Math.min(2.5,k+1-.001));
      const f=x=>s.family==='constant'?1:C.fractionalPart(x);
      svg+=p.dot(0,f(0),'x = 0',H.blue)+p.dot(T,f(T),'x + T',valid?H.green:H.red);
      if(s.family==='constant')svg+=p.dot(T/2,1,'T/2',H.purple,false);
    }
    return H.result(svg,[['T é período?',valid?'Sim':'Não'],['Período mínimo',s.family==='fraction'?'1':'Não existe']],s.family==='fraction'?'Os períodos positivos da parte fracionária são exatamente os inteiros positivos. Se T não é inteiro, a falha já ocorre em x = 0.':s.family==='constant'?'Todo T positivo é período; T/2 é sempre um período menor.':'Somar um racional preserva racionalidade e irracionalidade. Um T irracional falha em x = 0. Os períodos racionais positivos não têm mínimo.');
  };
  E.drawers['s-monotone']=(s,H)=>{
    const family=s.family==='positive'?'square':s.family,f=x=>C.exampleValue(family,x,s.m),x1=s.x,x2=s.x+s.gap,y1=f(x1),y2=f(x2),p=plot(H,'monotone',-3,4,-6,10);let svg=p.svg;
    if(family==='floor')for(let k=-3;k<4;k++)svg+=H.intervalDrawing(p.X,k,k+1,p.Y(k),true,false,H.blue);
    else svg+=p.curve(f,H.blue,s.family==='positive'?0:-3,4);
    svg+=p.dot(x1,y1,'x₁',H.purple)+p.dot(x2,y2,'x₂',H.green);
    if(s.step>=1)svg+=arrow(H,p.X(x1),p.Y(y1),p.X(x2),p.Y(y2),s.step===1?H.green:H.red);
    if(s.step===2)svg+=H.text(280,20,'y₁ < y₂ implica h(y₁) > h(y₂)',H.red);
    const classification=s.family==='positive'?'Estritamente crescente':s.family==='square'?'Não monótona em ℝ':s.family==='floor'?'Crescente, não estritamente':s.m>0?'Estritamente crescente':s.m<0?'Estritamente decrescente':'Constante: crescente e decrescente';
    return H.result(svg,[['Classificação global',classification],['Saídas do par',`${H.fmt(y1)} ${y1<y2?'<':y1>y2?'>':'='} ${H.fmt(y2)}`]],['Saídas de entradas diferentes precisam ser distintas sob monotonicidade estrita. A classificação global é justificada pela fórmula, não por este único par.','Na função crescente, a ordem das saídas é a ordem das entradas; a inversa a preserva.','Na função decrescente, a ordem das saídas é oposta à das entradas; a inversa também inverte a ordem.'][s.step]);
  };
  E.drawers['s-linearity']=(s,H)=>{
    const w=C.linearityWitness(s.c,s.kind,s.d),R=Math.max(3,Math.abs(w.x)+.5),minY=Math.min(-2,w.fx-1,-R*w.c),maxY=Math.max(3,w.fx+1,R*w.c),p=plot(H,'linearity',-R,R,minY,maxY);let svg=p.svg;
    if(s.step===0)svg+=p.dot(0,0,'f(0)=0',H.blue)+p.dot(1,w.c,'f(1)=c>0',H.green);
    else {
      svg+=p.curve(x=>w.c*x,H.blue);
      if(s.step===1){const q=w.q??.5;svg+=p.dot(q,w.c*q,'(q, cq)',H.green)+H.text(280,20,'nf(p/n) = pc',H.ink);}
      else if(s.step===4)svg+=p.dot(w.x,w.c*w.x,'f(x) = cx',H.green)+H.text(280,20,'Nenhum desvio é possível',H.green);
      else if(w.delta!==0){svg+=p.dot(w.x,w.fx,'Suposição: f(x)',H.red)+p.dot(w.q,w.c*w.q,'f(q) = cq',H.green)+p.dot(w.x,w.c*w.x,'cx',H.blue,false)+H.segment(p.X(w.q),p.Y(w.c*w.q),p.X(w.x),p.Y(w.fx),H.red,3,'5 5');}
    }
    const inequality=w.delta<0?'f(x)/c < q < x':'x < q < f(x)/c';
    return H.result(svg,[['Racional testemunha',w.k===null?'Sem desvio':`${w.k}/${w.n}`],['Comparação exata',w.k===null?'f(x) = cx':inequality]],s.step<=1?'A homogeneidade determina primeiro a origem e depois todos os pontos racionais da reta.':s.step===4?'Cada real x deve estar na reta, porque ambos os desvios contradizem a monotonicidade.':w.delta===0?'Não há desvio nesta escolha. Altere δ para construir a contradição.':`${inequality}. O segmento vermelho teria inclinação negativa entre duas entradas, contrariando o crescimento estrito. A posição decimal é aproximada; as duas desigualdades que localizam q são verificadas exatamente.`);
  };
  E.drawers['s-positive']=(s,H)=>{
    const square=s.family==='square',g=x=>C.exampleValue(square?'oddSquare':'affine',x,s.c),p=plot(H,'positive',-3,3,-6,6);let svg=p.svg+p.curve(g,H.blue,0,3);
    if(s.step>=1)svg+=p.curve(g,H.purple,-3,0)+p.dot(-s.x,g(-s.x),'g(−x) = −f(x)',H.purple);
    svg+=p.dot(s.x,g(s.x),'f(x)',H.blue);
    if(s.step===2){const nx=s.n*s.x;if(Math.abs(nx)<=3)svg+=p.dot(nx,g(nx),'g(nx)',H.green);svg+=H.text(280,20,'g(nx) = ng(x), n ∈ ℤ',H.green);}
    if(s.step===3)svg+=H.text(280,20,'Restrição a x ≥ 0: f(x) = cx',H.green);
    return H.result(svg,[['Extensão ímpar',square?'g(x) = x|x|':'g(x) = cx'],['Homogeneidade por n',square?'Falha: f(2) = 4 ≠ 2f(1)':'Vale para todo n inteiro']],square?'x² é estritamente crescente em ℝ₊, mas viola a homogeneidade. O corolário não se aplica.':s.step===0?'A função original só usa a semirreta não negativa. A extensão g é definida também para entradas negativas.':s.step===1?'A reflexão central mantém a ordem no lado negativo. Entre os dois lados, g(x₁) < 0 < g(x₂).':s.step===2?'A homogeneidade para inteiros negativos decorre da imparidade e do caso positivo.':'Aplicamos a proposição em toda a reta e restringimos a conclusão ao domínio original.');
  };
  E.drawers['s-sector']=(s,H)=>{
    const theta=s.step===1?2:s.theta,w=C.sectorModel(s.r,theta),cx=220,cy=135,r=55*s.r;let svg=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${H.blue}" stroke-width="2"/>`;
    if(s.step>=1||s.step===0) {
      if(w.turns)svg+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${H.purple}" fill-opacity=".12"/>`;
      if(w.remainder>0){const a=w.sign*w.remainder*Math.PI,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);svg+=`<path d="M${cx},${cy} L${cx+r},${cy} A${r},${r} 0 ${w.remainder>1?1:0} ${w.sign>0?0:1} ${x},${y} Z" fill="${H.purple}" fill-opacity=".28"/>`;}
      const end=w.theta;svg+=H.segment(cx,cy,cx+r,cy,H.blue,2)+H.segment(cx,cy,cx+r*Math.cos(end),cy-r*Math.sin(end),H.purple,3);
    }
    svg+=H.text(435,90,theta<0?'Sentido negativo':theta>0?'Sentido positivo':'Ângulo zero',H.ink)+H.text(435,135,`${w.turns} volta(s) completa(s)`,H.muted)+H.text(435,180,`+ ${H.fmt(w.remainder)}π rad`,H.muted);
    return H.result(svg,[['Ângulo exibido',`${H.fmt(theta)}π rad`],['Área orientada',`${H.fmt(w.coefficient)}π ≈ ${H.fmt(w.area)}`]],s.step===0?'Sob as hipóteses declaradas, S é proporcional a θ. As voltas contam com multiplicidade; o sinal registra a orientação.':s.step===1?'A figura fixa uma volta completa para determinar a constante: S(2π) = πr², logo k = r²/2.':'A fórmula vale para o ângulo selecionado, inclusive negativo ou maior que 2π. A sombra sozinha não conta as voltas; o contador e o sinal completam a leitura.');
  };
  E.onInput['f-graph']=(s,key)=>{if(key==='family'&&s.family==='circle')s.step=0;};
  E.onStep['f-graph']=s=>{if(s.step>=2&&s.family==='circle')s.family='square';};
  E.onInput['f-inverse']=(s,key)=>{if(key==='family'&&s.family!=='bijective')s.step=0;};
  E.onStep['f-inverse']=s=>{if(s.step>=1)s.family='bijective';};
  E.onInput['f-reflection']=(s,key)=>{if(key==='m'&&s.m===0)s.step=0;};
  E.onStep['f-reflection']=s=>{if(s.step>0&&s.family==='affine'&&s.m===0)s.m=1;};
  E.onStep['s-periods']=s=>{s.family=['fraction','constant','rational-indicator'][s.step];};
  E.onInput['s-periods']=(s,key)=>{if(key==='family')s.step=['fraction','constant','rational-indicator'].indexOf(s.family);};
  E.onStep['s-monotone']=s=>{if(s.step>=1){s.family='affine';s.m=s.step===1?1:-1;}};
  E.onInput['s-monotone']=(s,key)=>{if(key==='family'||key==='m')s.step=0;};
  E.onStep['s-linearity']=s=>{if(s.step===2)s.d=-Math.max(1,Math.abs(s.d));if(s.step===3)s.d=Math.max(1,Math.abs(s.d));if(s.step===4)s.d=0;};
  E.onInput['s-linearity']=(s,key)=>{if(key==='d')s.step=s.d<0?2:s.d>0?3:4;};
  E.onStep['s-positive']=s=>{if(s.step>0)s.family='affine';};
  E.onInput['s-positive']=(s,key)=>{if(key==='family'&&s.family==='square')s.step=0;};
})();
