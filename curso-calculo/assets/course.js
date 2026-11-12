/* Interações sem dependências: os dados matemáticos vêm de math.js. */
(function () {
  'use strict';
  const C = window.Calculo;
  const ink = '#172033', muted = '#566079', blue = '#1c7fd6', purple = '#3b3fd8';
  const red = '#c83b2b', green = '#087959', line = '#d3d9e3', soft = '#e9eafd';
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (x, digits = 5) => (Object.is(x,-0) ? 0 : x).toLocaleString('pt-BR', {maximumFractionDigits:digits,useGrouping:false}).replace('-', '−');
  const fraction = (p,q) => q===1 ? String(p) : `${p}/${q}`;
  const range = (key,label,min,max,step,value,display) => ({key,label,min,max,step,value,display});
  const select = (key,label,options,value) => ({key,label,options,value});
  const config = {
    order: {label:'Efeito de multiplicar uma desigualdade', controls:[range('a','a',-3,1,.25,-2),range('gap','b − a',.5,5,.5,4),range('c','c',-2,2,.25,-1)]},
    interval: {label:'Extremos de um intervalo e teste de pertinência', controls:[range('center','Centro',-2,2,.25,0),range('half','Meia largura',0,3,.25,2),select('ends','Extremos',[['open','(a, b)'],['closed','[a, b]'],['left','[a, b)'],['right','(a, b]']],'open'),range('x','Ponto x',-5,5,.25,1)]},
    modulus: {label:'Módulo como distância e módulo de um produto', controls:[range('x','x',-5,5,.25,-3),range('y','y',-5,5,.25,2)]},
    neighborhood: {label:'Pontos a uma distância menor que epsilon do centro', controls:[range('a','Centro a',-2,2,.25,0),range('epsilon','Raio ε',.25,2,.25,1),range('t','λ: x=a+λε',-2,2,.25,.5)]},
    triangle: {label:'Soma de duas inclusões em intervalos simétricos', controls:[range('a','a',-5,5,.25,3),range('b','b',-5,5,.25,-2)]},
    reverse: {label:'Distância entre pontos e diferença entre seus módulos', controls:[range('a','a',-5,5,.25,-3),range('b','b',-5,5,.25,2)]},
    bounds: {label:'Cota superior proposta e ponto que a refuta', controls:[select('ends','Conjunto',[['open','A = (0, 1)'],['closed','A = [0, 1]'],['right','A = (0, 1]'],['left','A = [0, 1)']],'open'),range('bound','Cota M',-.5,1.5,.05,.8)]},
    supremum: {label:'Testemunha da caracterização por epsilon do supremo', controls:[range('epsilon','ε',10,1500,10,200,v=>fmt(v/1000))]},
    infimum: {label:'Reflexão de um conjunto e troca de cotas', controls:[range('a','Extremo a',-4,4,.5,1),range('b','Largura b − a',1,6,1,4,v=>fmt(v/2)),select('left','Extremo a',[['open','Excluído: (a, b]'],['closed','Incluído: [a, b]']],'open')]},
    completeness: {label:'Correção de um candidato ao supremo para construir a raiz de dois', controls:[range('p','Candidato s',100,200,1,130,v=>fmt(v/100))]},
    irrationality: {label:'Comparação exata entre p ao quadrado e duas vezes q ao quadrado', controls:[range('p','Numerador p',1,99,1,7),range('q','Denominador q',1,70,1,5)]},
    bisection: {label:'Intervalos racionais encaixados em torno da raiz de dois', controls:[range('steps','Bisseções',0,12,1,3)]},
    arithmetic: {label:'Consequência de supor racional uma soma ou produto com raiz de dois', controls:[select('operation','Operação',[['sum','r + √2'],['product','r · √2']],'sum'),range('r','r',-8,8,1,2,v=>fraction(v,4)),range('q','q',-8,8,1,5,v=>fraction(v,4))]},
    archimedean: {label:'Múltiplo de um passo positivo acima de uma cota proposta', controls:[range('x','Passo x',1,20,1,5,v=>fmt(v/10)),range('bound','Cota L',0,120,1,20,v=>fmt(v/10))]},
    reciprocal: {label:'Recíproco estritamente menor que a tolerância escolhida', controls:[range('epsilon','ε',1,1000,1,100,v=>fmt(v/1000))]},
    accumulation: {label:'Vizinhanças de zero em diferentes conjuntos', controls:[select('kind','Conjunto',[['reciprocal','D = {1/n : n ≥ 1}'],['interval','A = (0, 1)'],['integers','ℤ'],['finite','F = {0, 1, 2}']],'reciprocal'),range('power','δ = 2⁻ʲ; j',1,14,1,3)]},
    density: {label:'Construção de um racional no interior de um intervalo', controls:[range('center','Centro',-16,16,1,2,v=>fmt(v/8)),range('power','Largura 2⁻ʲ; j',0,12,1,1)]},
    'irrational-density': {label:'Translação de um racional para construir um irracional no intervalo', controls:[range('center','Centro',-16,16,1,2,v=>fmt(v/8)),range('power','Largura 2⁻ʲ; j',0,12,1,1)]}
  };
  function text(x,y,value,color=muted,anchor='middle',strong=false) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" style="fill:${color}"${strong?' class="strong"':''}>${escape(value)}</text>`;
  }
  function segment(x1,y1,x2,y2,color=blue,width=3,dash='') {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''} stroke-linecap="round"/>`;
  }
  function point(x,y,label,color=blue,closed=true,labelY=y-16) {
    return `<circle cx="${x}" cy="${y}" r="6" fill="${closed?color:'white'}" stroke="${color}" stroke-width="2.5"/>${label?text(x,labelY,label,color):''}`;
  }
  function axis(min,max,y,ticks=true) {
    const scale = value => 48 + (value-min)/(max-min)*464;
    let drawing=segment(38,y,522,y,line,2);
    if(ticks) for(let j=0;j<=4;j++) {
      const value=min+(max-min)*j/4,x=scale(value);
      drawing+=segment(x,y-4,x,y+4,line,1.5)+text(x,y+28,fmt(value,3));
    }
    return {x:scale,drawing};
  }
  function intervalDrawing(scale,a,b,y,left=true,right=true,color=purple) {
    return segment(scale(a),y,scale(b),y,color,7)+point(scale(a),y,'',color,left)+point(scale(b),y,'',color,right);
  }
  function result(svg,stats,reading) { return {svg,stats,reading}; }
  function draw(kind,s) {
    let svg='';
    if(kind==='order') {
      const {a,gap,c}=s,b=a+gap,ca=c*a,cb=c*b;
      const low=Math.min(-1,a,b,ca,cb)-1,high=Math.max(1,a,b,ca,cb)+1;
      const top=axis(low,high,90),bottom=axis(low,high,205);
      svg=top.drawing+bottom.drawing+segment(top.x(a),90,top.x(b),90,blue,5);
      svg+=point(top.x(a),90,`a=${fmt(a)}`)+point(top.x(b),90,`b=${fmt(b)}`);
      if(c===0) svg+=point(bottom.x(0),205,'ca = cb = 0',red);
      else svg+=segment(bottom.x(ca),205,bottom.x(cb),205,red,5)+point(bottom.x(ca),205,`ca=${fmt(ca)}`,red)+point(bottom.x(cb),205,`cb=${fmt(cb)}`,red,true,246);
      return result(svg,[['Antes',`${fmt(a)} < ${fmt(b)}`],['Depois',`${fmt(ca)} ${c>0?'<':c<0?'>':'='} ${fmt(cb)}`]],c>0?'c > 0: a multiplicação preserva a ordem.':c<0?'c < 0: a multiplicação inverte a ordem.':'c = 0: os dois produtos coincidem na origem.');
    }
    if(kind==='interval') {
      const a=s.center-s.half,b=s.center+s.half,left=s.ends==='closed'||s.ends==='left',right=s.ends==='closed'||s.ends==='right';
      const inside=C.contains(s.x,a,b,left,right),ax=axis(-6,6,150);
      svg=ax.drawing;
      if(a!==b||left&&right) svg+=intervalDrawing(ax.x,a,b,150,left,right);
      else svg+=text(280,80,'Conjunto vazio',red);
      svg+=text(ax.x(a),110,`a=${fmt(a)}`,purple)+text(ax.x(b),205,`b=${fmt(b)}`,purple)+point(ax.x(s.x),150,'x',inside?green:red,true,75);
      const label=a===b&&!(left&&right)?'∅':`${left?'[':'('}${fmt(a)}; ${fmt(b)}${right?']':')'}`;
      return result(svg,[['Intervalo',label],['Pertinência',inside?'x pertence':'x não pertence']],`${fmt(s.x)} ${inside?'satisfaz':'não satisfaz'} as duas condições: ${fmt(a)} ${left?'≤':'<'} x ${right?'≤':'<'} ${fmt(b)}.`);
    }
    if(kind==='modulus') {
      const {x,y}=s,top=axis(-6,6,95),bottom=axis(0,26,220);
      if(s.step===0) {
        svg=top.drawing+point(top.x(x),95,'x',blue)+point(top.x(0),95,'0',ink,true,140);
        svg+=segment(top.x(0),180,top.x(Math.abs(x)),180,green,6)+point(top.x(Math.abs(x)),180,'|x| ≥ 0',green,true,225);
      } else if(s.step===1) {
        svg=top.drawing+(x===0?point(top.x(0),95,'x = −x = 0'):point(top.x(x),95,'x',blue)+point(top.x(-x),95,'−x',red,true,145));
        svg+=segment(top.x(0),68,top.x(x),68,blue,5)+segment(top.x(0),123,top.x(-x),123,red,5)+text(280,235,'Distâncias iguais até a origem',ink);
      } else if(s.step===2) {
        svg=top.drawing+segment(top.x(x),95,top.x(Math.abs(x)),95,green,5)+point(top.x(x),95,'x',blue)+point(top.x(Math.abs(x)),95,'|x|',green,true,150);
        svg+=text(280,225,`${fmt(x)} ≤ ${fmt(Math.abs(x))}`,ink,'middle',true);
      } else {
        svg=top.drawing+bottom.drawing+point(top.x(x),95,'x',blue)+point(top.x(y),95,'y',red,true,145);
        svg+=segment(bottom.x(0),220,bottom.x(Math.abs(x*y)),220,green,7)+point(bottom.x(Math.abs(x*y)),220,'|xy| = |x||y|',green,true,185);
      }
      const explanations=[`A distância |x| = ${fmt(Math.abs(x))} é não negativa; ela é zero somente quando x = 0.`,`A reflexão x ↦ −x troca o lado da origem e preserva o comprimento ${fmt(Math.abs(x))}.`,`O ponto x = ${fmt(x)} fica à esquerda de |x| = ${fmt(Math.abs(x))}, ou coincide com ele.`,`Para x = ${fmt(x)} e y = ${fmt(y)}, o módulo do produto é ${fmt(Math.abs(x*y))}. Compare os sinais com os casos da demonstração.`];
      return result(svg,[['Módulos de x e −x',`${fmt(Math.abs(x))} e ${fmt(Math.abs(-x))}`],['Produto',`|${fmt(x*y)}| = ${fmt(Math.abs(x)*Math.abs(y))}`]],explanations[s.step]);
    }
    if(kind==='neighborhood') {
      const {a,epsilon,t}=s,x=a+t*epsilon,center=s.step===2?a:0,position=center+t*epsilon,low=center-epsilon,high=center+epsilon;
      const ax=axis(center-2.5*epsilon,center+2.5*epsilon,150,false);
      svg=ax.drawing+intervalDrawing(ax.x,low,high,150,false,false);
      svg+=text(ax.x(low),190,s.step===2?'a − ε':'−ε',purple)+text(ax.x(high),190,s.step===2?'a + ε':'ε',purple)+point(ax.x(center),150,s.step===2?'a':'0',ink,true,120);
      svg+=point(ax.x(position),150,s.step===2?'x':'t = x − a',Math.abs(t)<1?green:red,true,75)+segment(ax.x(center),220,ax.x(position),220,blue,4);
      if(s.step===1) svg+=text(280,260,t>=0?'t ≥ 0: |t| = t':'t < 0: |t| = −t',ink);
      if(s.step===2) svg+=text(280,260,'Translação por +a',ink);
      const inside=Math.abs(t)<1;
      const stage=s.step===0?'Compare o módulo de t com o intervalo (−ε, ε).':s.step===1?'Escolha o sinal de t para acompanhar os dois casos da recíproca.':'A translação por a leva t a x e os extremos −ε, ε a a − ε, a + ε.';
      return result(svg,[['Distância |x − a|',fmt(Math.abs(x-a))],['Comparação com ε',`${fmt(Math.abs(x-a))} ${inside?'<':Math.abs(t)===1?'=':'>'} ${fmt(epsilon)}`]],`${stage} ${inside?'O ponto satisfaz a desigualdade estrita.':Math.abs(t)===1?'O extremo é excluído.':'O ponto fica fora do intervalo.'}`);
    }
    if(kind==='triangle') {
      const {a,b}=s,R=Math.max(1,Math.abs(a)+Math.abs(b))*1.25,t=C.triangle(a,b);
      [[a,Math.abs(a),'a',70],[b,Math.abs(b),'b',145],[a+b,Math.abs(a)+Math.abs(b),'a + b',220]].forEach(([p,r,label,y],j)=>{
        if(j>s.step) return;
        const ax=axis(-R,R,y,false),color=j===s.step?purple:blue;
        svg+=ax.drawing+intervalDrawing(ax.x,-r,r,y,true,true,color)+point(ax.x(p),y,label,ink,true,y-22);
        svg+=r===0?text(ax.x(0),y+30,'0',color):text(ax.x(-r),y+30,`−${fmt(r)}`,color)+text(ax.x(r),y+30,fmt(r),color);
      });
      const stage=['Primeiro enquadramos a entre −|a| e |a|.','Agora enquadramos b e podemos somar as duas relações.','A terceira linha é o intervalo obtido pela soma dos extremos.'][s.step];
      return result(svg,[['|a + b|',fmt(t.direct)],['|a| + |b|',fmt(t.detour)]],`${stage} ${fmt(t.direct)} ≤ ${fmt(t.detour)}. ${a*b>=0?'Neste exemplo ocorre igualdade.':'Neste exemplo ocorre desigualdade estrita.'}`);
    }
    if(kind==='reverse') {
      const {a,b}=s,t=C.triangle(a,b),R=Math.max(1,Math.abs(a),Math.abs(b))+1,ax=axis(-R,R,80);
      svg=ax.drawing+segment(ax.x(a),80,ax.x(b),80,blue,5)+point(ax.x(a),80,'a',blue,true,48)+point(ax.x(b),80,'b',red,true,135);
      if(s.step===2) {
        const r=Math.max(1,t.distance)*1.2,lower=axis(-r,r,215,false);
        svg+=lower.drawing+intervalDrawing(lower.x,-t.distance,t.distance,215,true,true,purple)+point(lower.x(Math.abs(a)-Math.abs(b)),215,'|a| − |b|',ink,true,185);
        svg+=t.distance===0?text(lower.x(0),257,'|a − b| = 0',purple):text(lower.x(-t.distance),257,'−|a − b|',purple)+text(lower.x(t.distance),257,'|a − b|',purple);
      } else {
        const first=s.step===0?b:a,last=s.step===0?a:b;
        svg+=segment(ax.x(0),177,ax.x(first),177,red,5)+segment(ax.x(first),228,ax.x(last),228,green,5);
        svg+=point(ax.x(0),177,'0',ink,true,162)+point(ax.x(first),177,s.step===0?'b':'a',red,true,210)+point(ax.x(last),228,s.step===0?'a':'b',green,true,263);
      }
      const stage=['O percurso 0 → b → a mostra |a| ≤ |b| + |a − b|. Subtraia |b|.','Trocamos os pontos: o percurso 0 → a → b mostra |b| ≤ |a| + |a − b|. Subtraia |a|.','Reúna as duas cotas no intervalo simétrico. O módulo de |a| − |b| fica limitado por |a − b|.'][s.step];
      return result(svg,[['||a| − |b||',fmt(t.reverse)],['|a − b|',fmt(t.distance)]],stage);
    }
    if(kind==='bounds') {
      const left=s.ends==='closed'||s.ends==='left',right=s.ends==='closed'||s.ends==='right',M=s.bound,x=C.refuteUpperBound(M),ax=axis(-.6,1.6,145);
      svg=ax.drawing+intervalDrawing(ax.x,0,1,145,left,right)+text(ax.x(0),110,'0',purple)+text(ax.x(1),110,'1',purple);
      svg+=segment(ax.x(M),65,ax.x(M),205,red,2,'5 5')+text(ax.x(M),50,'M',red);
      if(x!==null) svg+=point(ax.x(x),145,'x',green,true,235);
      return result(svg,[['M é cota superior?',M>=1?'Sim':'Não'],['Supremo / máximo',`1 / ${right?'1':'não existe'}`]],x===null?'M ≥ 1: para todo ponto do intervalo, x ≤ 1 ≤ M.':`O ponto x = ${fmt(x)} pertence ao intervalo e satisfaz x > M. Portanto M não é uma cota superior.`);
    }
    if(kind==='supremum') {
      const e=s.epsilon/1000,x=C.supWitness(e),top=axis(-.1,1.1,85,false),zoom=axis(1-1.2*e,1+.2*e,215,false);
      svg=top.drawing+intervalDrawing(top.x,0,1,85,false,false)+text(top.x(1),122,'L = 1',purple);
      if(s.step===0) svg+=segment(top.x(1),38,top.x(1),105,purple,2,'5 5')+text(280,200,'Todo x ∈ A satisfaz x ≤ L',ink);
      else if(s.step===3) {
        const final=axis(.7,1.5,215,false);
        svg+=final.drawing+segment(final.x(1),215,final.x(1.5),215,green,7)+point(final.x(1),215,'L',purple,true,255)+point(final.x(1.3),215,'M ≥ L',green,true,175);
      } else {
        svg+=point(top.x(x),85,'x',green,true,58)+zoom.drawing+intervalDrawing(zoom.x,1-e,1,215,false,false)+point(zoom.x(x),215,'x',green,true,177);
        svg+=text(zoom.x(1-e),252,s.step===2?'M = L − ε':'L − ε',s.step===2?red:purple)+text(zoom.x(1),252,'L',purple);
        if(s.step===2) svg+=segment(zoom.x(1-e),145,zoom.x(1-e),235,red,2,'5 5');
      }
      const stage=['L é cota superior: todo o intervalo está à sua esquerda. A minimalidade será usada no próximo passo.',`A testemunha satisfaz 1 − ε = ${fmt(1-e)} < x = ${fmt(x)} < 1. Logo L − ε não é cota superior.`,`Se M = L − ε fosse cota superior, este ponto x > M produziria a contradição.`,`Assim toda cota superior M deve estar em [L, +∞). Como L também é cota, é a menor delas.`][s.step];
      return result(svg,[['ε',fmt(e)],['Testemunha x',fmt(x)]],stage);
    }
    if(kind==='infimum') {
      const a=s.a,b=a+s.b/2,m=a-s.b/4,closed=s.left==='closed';
      const low=Math.min(a,-a,b,-b,m,-m)-.5,high=Math.max(a,-a,b,-b,m,-m)+.5;
      const upper=axis(low,high,90,false),lower=axis(low,high,215,false);
      svg=upper.drawing+lower.drawing+intervalDrawing(upper.x,a,b,90,closed,true)+intervalDrawing(lower.x,-b,-a,215,true,closed,green);
      svg+=text(upper.x((a+b)/2),50,closed?'A = [a, b]':'A = (a, b]',purple)+text(lower.x(-(a+b)/2),173,closed?'−A = [−b, −a]':'−A = [−b, −a)',green);
      if(s.step===0) {
        svg+=point(upper.x(m),90,`m₀=${fmt(m)}`,red,true,135)+point(lower.x(-m),215,`−m₀=${fmt(-m)}`,red,true,260);
        svg+=segment(upper.x(m),100,lower.x(-m),200,red,2,'5 5');
      } else if(s.step===1) {
        svg+=point(lower.x(-a),215,`s=${fmt(-a)}`,red,closed,260)+point(upper.x(a),90,`−s=${fmt(a)}`,red,closed,135);
        svg+=segment(lower.x(-a),190,upper.x(a),150,red,3,'5 5');
      } else {
        svg+=point(upper.x(m),90,'m',red,true,135)+point(upper.x(a),90,'−s',purple,closed,20);
        svg+=point(lower.x(-m),215,'−m',red,true,260)+point(lower.x(-a),215,'s',purple,closed,165);
      }
      const stage=['A cota inferior m₀ de A é refletida na cota superior −m₀ de −A.','A cota superior s de −A é refletida em −s, uma cota inferior de A.','Para qualquer cota inferior m, sua reflexão −m fica acima de s. Refletindo de volta: m ≤ −s. Portanto −s é a maior cota inferior.'][s.step];
      return result(svg,[['inf A',`${fmt(a)}${closed?' = min A':''}`],['sup(−A)',`${fmt(-a)}${closed?' = max(−A)':''}`]],stage);
    }
    if(kind==='completeness') {
      const c=C.completenessCorrection(s.p),root=Math.sqrt(2),ax=axis(0,2.1,145);
      svg=ax.drawing+intervalDrawing(ax.x,0,root,145,true,false,purple)+text(ax.x(root),110,'√2',purple);
      if(s.step===0) svg+=point(ax.x(1),145,'1 ∈ S',green,true,75)+point(ax.x(2),145,'cota: 2',red,true,235);
      else if(s.step===3) {
        svg+=point(ax.x(root),145,'s² = 2; s ∉ S',green,false,68)+point(ax.x(root*.7),145,'t < s ⇒ t² < 2',red,true,240);
      } else {
        svg+=point(ax.x(c.s),145,'s',red,true,65)+point(ax.x(c.t),145,c.below?'s + h':'s − h',green,true,240);
        svg+=segment(ax.x(c.s),185,ax.x(c.t),185,green,4);
      }
      const message=s.step===0?'S contém 1 e é limitado por 2. A existência de s = sup S é dada pelo axioma.':s.step===3?'Os dois casos s² < 2 e s² > 2 foram excluídos. Resta s² = 2. Qualquer t não negativo menor que s tem quadrado menor que 2, o que dá a unicidade.':c.below?'s² < 2: o ponto s + h ainda tem quadrado menor que 2 e está acima de s. Esse candidato não é cota superior de S.':'s² > 2: s − h é menor que s e ainda tem quadrado maior que 2. Ele é uma cota superior de S menor que o candidato.';
      return result(svg,[['s² do candidato',fmt(c.s*c.s)],['Ponto corrigido',`≈ ${fmt(c.t,7)}`]],message);
    }
    if(kind==='irrationality') {
      const {p,q}=s,A=p*p,B=2*q*q,scale=v=>48+v/Math.max(A,B)*460;
      svg=segment(48,95,scale(A),95,blue,10)+segment(48,205,scale(B),205,red,10);
      svg+=text(48,60,`p² = ${A}`,blue,'start')+text(48,170,`2q² = ${B}`,red,'start');
      svg+=text(280,254,`p² − 2q² = ${C.squareResidual(p,q)}`,ink,'middle',true);
      if(s.step>0) {
        svg='';
        const tile=(x,y,label,color)=>`<rect x="${x}" y="${y}" width="140" height="90" fill="${soft}" stroke="${color}" stroke-width="2" rx="6"/>${text(x+70,y+52,label,color)}`;
        if(s.step===1) svg=tile(50,75,'q²',blue)+tile(210,75,'q²',blue)+text(430,123,'= p²',purple,'middle',true)+text(280,220,'Hipótese: p² = 2q² ⇒ p é par',ink);
        else if(s.step===2) svg=tile(50,75,'k²',green)+tile(210,75,'k²',green)+text(430,123,'= q²',purple,'middle',true)+text(280,220,'p = 2k ⇒ q² = 2k² ⇒ q é par',ink);
        else svg=text(280,80,'p = 2k e q = 2ℓ',purple,'middle',true)+segment(90,155,470,155,line,3)+text(280,130,'p/q = (2k)/(2ℓ)',ink)+text(280,200,'= k/ℓ',green,'middle',true)+text(280,255,'Fator comum 2: contradição',red);
      }
      const stage=[`O resíduo inteiro desta fração é ${C.squareResidual(p,q)}. No próximo passo, considere a hipótese geral de existir uma fração irredutível com quadrado 2.`,`As duas partes de área q² representam a hipótese p² = 2q². Por paridade, p teria de ser par; não se afirma que os parâmetros escolhidos satisfaçam essa igualdade.`,`Substituindo p = 2k na hipótese e dividindo por 2, q² = 2k². O mesmo argumento de paridade força q a ser par.`,`A igualdade hipotética produziria p = 2k e q = 2ℓ. Cancelar o fator 2 contradiz a escolha inicial da fração irredutível.`][s.step];
      return result(svg,[['Fração para comparar',`${p}/${q}`],['Valor decimal','≈ '+fmt(p/q,7)]],stage);
    }
    if(kind==='bisection') {
      const t=C.sqrtTwoBracket(s.steps),ax=axis(t.a-.15*(t.b-t.a),t.b+.15*(t.b-t.a),150,false);
      svg=ax.drawing+intervalDrawing(ax.x,t.a,t.b,150,false,false)+point(ax.x(Math.sqrt(2)),150,'√2',green,true,95);
      svg+=text(ax.x(t.a),200,`${t.lower}/${t.denominator}`,purple)+text(ax.x(t.b),240,`${t.upper}/${t.denominator}`,purple);
      return result(svg,[['Extremo inferior',`${t.lower}/${t.denominator}`],['Extremo superior',`${t.upper}/${t.denominator}`]],`Os extremos são racionais e seus quadrados ficam estritamente abaixo e acima de 2. A largura exata é 1/${t.denominator}; nenhuma igualdade com uma fração é afirmada.`);
    }
    if(kind==='arithmetic') {
      const r=s.r/4,q=s.q/4,product=s.operation==='product',required=product?q/r:q-r,root=Math.sqrt(2);
      if(product&&r===0) {
        svg=text(280,110,'0 · √2 = 0',purple,'middle',true)+text(280,190,'A hipótese r ≠ 0 é necessária',red);
        return result(svg,[['r',fraction(s.r,4)],['q',fraction(s.q,4)]],q===0?'O produto é racional. Não se pode dividir por r para concluir que √2 seria racional.':'O produto vale zero e não pode ser igual ao q escolhido. A conclusão de irracionalidade exige r ≠ 0.');
      }
      const low=Math.min(-1,required,root)-.5,high=Math.max(2,required,root)+.5,ax=axis(low,high,150);
      svg=ax.drawing+point(ax.x(root),150,'√2',purple,true,98)+point(ax.x(required),150,product?'q/r':'q − r',red,true,222);
      const requiredExact=product?fraction(s.q,s.r):fraction(s.q-s.r,4);
      return result(svg,[['Racional exigido',requiredExact],['Número considerado',product?`${fraction(s.r,4)} · √2`:`${fraction(s.r,4)} + √2`]],`Uma igualdade com q = ${fraction(s.q,4)} exigiria √2 = ${requiredExact}, um racional. Isso contradiz a irracionalidade de √2. As coordenadas decimais do desenho são aproximações.`);
    }
    if(kind==='archimedean') {
      const w=C.archimedean(s.x,s.bound),max=Math.max(w.value,w.x)*1.15,ax=axis(Math.min(0,w.bound-w.x)-.1*w.x,max,150,false),m=w.n-1;
      svg=ax.drawing;
      const indices=[...new Set([0,1,2,Math.max(0,m-1),m,w.n])].filter(j=>j>=0&&j<=w.n);
      indices.filter(j=>s.step===2||j<w.n).forEach((j,i)=>{svg+=point(ax.x(j*w.x),150,`${j}x`,j===w.n?green:blue,true,i%2?205:110);});
      if(w.n>6) svg+=text(ax.x(w.value*.45),145,'…',ink);
      svg+=segment(ax.x(w.bound),55,ax.x(w.bound),235,red,2,'5 5')+text(ax.x(w.bound),40,'L',red);
      if(s.step===1) svg+=intervalDrawing(ax.x,w.bound-w.x,w.bound,150,false,true,soft)+point(ax.x(m*w.x),150,'mx',green,true,245)+text(ax.x(w.bound-w.x),85,'L − x',purple);
      if(s.step===2) svg+=segment(ax.x(m*w.x),230,ax.x(w.value),230,green,5)+text((ax.x(m*w.x)+ax.x(w.value))/2,265,'+ x',green);
      const stage=['Suponha que L fosse uma cota de todos os múltiplos. O desenho exibe somente alguns elementos de A. A prova supõe uma cota para o conjunto inteiro.',`O intervalo (L − x, L] tem largura x. A propriedade do supremo exige um múltiplo mx nele; neste exemplo, m = ${m}.`,`Somar mais x produz (m + 1)x = ${fmt(w.value)} > L. Esse novo elemento contradiz a hipótese de que L limita todos os múltiplos.`][s.step];
      return result(svg,[['n construído',String(w.n)],['nx e L',`${fmt(w.value)} > ${fmt(w.bound)}`]],stage);
    }
    if(kind==='reciprocal') {
      const w=C.reciprocal(s.epsilon),ax=axis(-.1*w.epsilon,1.2*w.epsilon,145,false);
      if(s.step===0) {
        const multiples=axis(0,Math.max(1.2,1.15*w.n*w.epsilon),150,false);
        svg=multiples.drawing+segment(multiples.x(0),150,multiples.x(w.n*w.epsilon),150,green,6);
        svg+=point(multiples.x(1),150,'1',red,true,210)+point(multiples.x(w.n*w.epsilon),150,'nε > 1',green,true,95);
      } else {
        svg=ax.drawing+intervalDrawing(ax.x,0,w.epsilon,145,false,false)+point(ax.x(w.value),145,'1/n',green,true,100);
        svg+=text(ax.x(0),200,'0',purple)+text(ax.x(w.epsilon),200,'ε',purple)+text(280,255,'Divisão por n > 0',ink);
      }
      return result(svg,[['ε exato',`${s.epsilon}/1000`],['n',String(w.n)],['1/n',`1/${w.n} ≈ ${fmt(w.value,7)}`],['Desigualdade exata',`${w.n} · ${s.epsilon} > 1000`]],s.step===0?`A propriedade arquimediana fornece n com nε > 1. Aqui n = ${w.n}. No próximo passo, dividimos por esse inteiro positivo.`:`Dividir nε > 1 por n produz ε > 1/n. A multiplicação inteira ${w.n}·${s.epsilon} > 1000 confirma a desigualdade estrita neste exemplo.`);
    }
    if(kind==='accumulation') {
      const w=C.accumulation(s.kind,s.power),global=axis(-.3,2.2,80,false),zoom=axis(-1.25*w.delta,1.25*w.delta,215,false);
      svg=global.drawing+zoom.drawing;
      if(s.kind==='interval') {
        svg+=intervalDrawing(global.x,0,1,80,false,false);
        svg+=segment(zoom.x(0),215,zoom.x(1.25*w.delta),215,purple,7)+point(zoom.x(0),215,'',purple,false);
      } else if(s.kind==='reciprocal') {
        for(let n=1;n<=12;n++) svg+=point(global.x(1/n),80,'',blue);
        svg+=text(global.x(.2),47,'primeiros termos de D',muted);
      } else {
        for(const k of s.kind==='integers'?[-1,0,1,2]:[0,1,2]) if(k>=-.3) svg+=point(global.x(k),80,String(k),blue,true,55);
      }
      svg+=segment(zoom.x(-w.delta),215,zoom.x(w.delta),215,soft,18);
      svg+=point(zoom.x(-w.delta),215,'−δ',purple,false,255)+point(zoom.x(w.delta),215,'δ',purple,false,255);
      svg+=point(zoom.x(0),215,'a = 0',ink,w.member,175);
      if(w.point!==null) svg+=point(zoom.x(w.point),215,s.kind==='reciprocal'?'1/n':'x',green,true,130);
      let witness=w.point===null?'não há outro ponto':w.n?`1/${w.n}`:`1/${2*w.denominator}`;
      let reading=w.accumulation?`Para a tolerância escolhida, a construção fornece um ponto diferente de zero, com distância menor que δ. ${w.n?'O índice pode estar além dos termos exibidos na linha superior.':'O intervalo continua à direita da janela ampliada.'}`:'A vizinhança de raio 1/2 já isola zero nesse conjunto. Diminuir o raio mantém a ausência de outro ponto.';
      if(s.step>0&&w.accumulation) {
        const d=w.denominator,x1=1/(2*d+1),xm=1/(3*d+1),eta=xm/2;
        const outer=axis(-1.25*w.delta,1.25*w.delta,95,false),inner=axis(-1.3*eta,1.3*eta,220,false);
        svg=outer.drawing+intervalDrawing(outer.x,-w.delta,w.delta,95,false,false,soft);
        svg+=point(outer.x(x1),95,'x₁',blue,true,55)+point(outer.x(xm),95,'xₘ',blue,true,135)+point(outer.x(0),95,'a',ink,false,55);
        if(s.step===1) svg+=text(280,215,'Hipótese: apenas uma lista finita',red);
        else {
          svg+=inner.drawing+intervalDrawing(inner.x,-eta,eta,220,false,false,purple)+point(inner.x(0),220,'a',ink,false,185);
          svg+=text(inner.x(-eta),260,'−η',purple)+text(inner.x(eta),260,'η',purple);
          if(s.step===2) svg+=text(280,160,'η < distância a cada ponto listado',ink);
          else {
            const n=2*(3*d+1)+1,y=s.kind==='reciprocal'?1/n:eta/2;
            svg+=point(inner.x(y),220,'novo ponto y',green,true,155);
            witness=s.kind==='reciprocal'?`1/${n}`:`1/${4*(3*d+1)}`;
          }
        }
        reading=s.step===1?'Suponha que os pontos de A nessa vizinhança, distintos de a, formem uma lista finita. No exemplo desenhado, xₘ é o mais próximo de a; a prova usa o mínimo das distâncias de toda a lista.':s.step===2?'Escolhemos η = min{δ/2, |xᵢ − a|/2}. Na lista desenhada, xₘ é o mais próximo de a, então η = |xₘ − a|/2. A vizinhança menor não contém nenhum ponto listado.':'A hipótese de acumulação exige outro ponto na vizinhança menor. Ele não pode estar na lista anterior: contradição. Para o conjunto escolhido, a bancada constrói explicitamente esse novo ponto.';
      }
      return result(svg,[['δ exato',`1/${w.denominator}`],['0 pertence?',w.member?'Sim':'Não'],['0 é de acumulação?',w.accumulation?'Sim':'Não'],['Testemunha',witness]],reading);
    }
    if(kind==='density'||kind==='irrational-density') {
      const width=2**(-s.power),a=s.center/8-width/2,b=s.center/8+width/2,shift=kind==='irrational-density'?Math.sqrt(2):0;
      const w=C.rationalBetween(a-shift,b-shift),q=w.value;
      const leftView=kind==='density'&&s.step===1?Math.min(a-.15*width,(w.k-1)/w.n-.1*width):a-shift-.15*width;
      const top=axis(leftView,b-shift+.15*width,kind==='density'?145:90,false);
      const y=kind==='density'?145:90;
      svg=top.drawing+intervalDrawing(top.x,a-shift,b-shift,y,false,false);
      for(let j=Math.ceil((a-shift-.15*width)*w.n);j<=Math.floor((b-shift+.15*width)*w.n);j++) {
        svg+=segment(top.x(j/w.n),y-8,top.x(j/w.n),y+8,line,2);
      }
      if(kind!=='density'||s.step===2) svg+=point(top.x(q),y,`${w.k}/${w.n}`,green,true,y-40);
      svg+=text(top.x(a-shift),y+40,shift?'a − √2':'a',purple)+text(top.x(b-shift),y+40,shift?'b − √2':'b',purple);
      if(kind==='density'&&s.step===0) svg+=segment(top.x(a),225,top.x(a+1/w.n),225,green,6)+text((top.x(a)+top.x(a+1/w.n))/2,260,'1/n < b − a',green);
      if(kind==='density'&&s.step===1) svg+=point(top.x((w.k-1)/w.n),y,'(k − 1)/n',blue,true,65)+point(top.x(q),y,'k/n',green,true,235);
      if(kind==='density'&&s.step===2) svg+=point(top.x(a+1/w.n),y,'a + 1/n',blue,true,245);
      if(shift) {
        const bottom=axis(a-.15*width,b+.15*width,220,false);
        svg+=bottom.drawing+intervalDrawing(bottom.x,a,b,220,false,false);
        if(s.step>=1) svg+=point(bottom.x(q+shift),220,'α',green,true,194)+segment(top.x(q),140,bottom.x(q+shift),175,green,2,'4 5')+text(480,171,'+ √2',green);
        svg+=text(bottom.x(a),260,'a',purple)+text(bottom.x(b),260,'b',purple);
        if(s.step===2) {
          const final=axis(q-.2,q+shift+.2,145,false);
          svg=final.drawing+point(final.x(q),145,'q ∈ ℚ',blue,true,105)+point(final.x(q+shift),145,'α = q + √2',purple,true,215);
          svg+=segment(final.x(q),60,final.x(q+shift),60,green,5)+text(280,40,'α − q = √2',green)+text(280,265,'Se α ∈ ℚ, então √2 ∈ ℚ: contradição',red);
        }
      }
      const stage=shift?['Primeiro escolhemos q racional no intervalo transladado (a − √2, b − √2).','Somar √2 transporta o ponto q para α = q + √2, dentro de (a, b).','A diferença entre α e o racional q é √2. Se α também fosse racional, essa diferença seria racional: contradição.'][s.step]:['Escolha n de modo que o passo 1/n seja menor que b − a.','O primeiro ponto k/n à direita de a satisfaz (k − 1)/n ≤ a < k/n. A existência do inteiro é justificada na prova.','O ponto r = k/n satisfaz a < r ≤ a + 1/n < b. A malha garante a inclusão estrita no intervalo.'][s.step];
      return result(svg,[['Intervalo (a; b)',`(${fmt(a,7)}; ${fmt(b,7)})`],['Fração construída',`${w.k}/${w.n}`],['Número no intervalo',shift?`${w.k}/${w.n} + √2`:`${w.k}/${w.n}`],['Aproximação','≈ '+fmt(q+shift,8)]],stage);
    }
    throw new Error(`Bancada desconhecida: ${kind}`);
  }
  function mount(figure) {
    const kind=figure.dataset.lab,cfg=config[kind];
    if(!cfg) throw new Error(`Configuração ausente: ${kind}`);
    const state={step:0},proof=figure.dataset.proof?document.getElementById(figure.dataset.proof):null;
    const steps=proof?[...proof.children]:[],caption=figure.querySelector('figcaption');
    caption.className='diagram-caption';
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 560 280');svg.setAttribute('role','img');svg.id=`${figure.id}-diagram`;
    svg.setAttribute('aria-label',cfg.label);
    const controls=document.createElement('div');controls.className='controls';
    for(const item of cfg.controls) {
      state[item.key]=item.value;
      const row=document.createElement('div');row.className=`control${item.options?' select':''}`;
      const label=document.createElement('label'),id=`${figure.id}-${item.key}`;label.htmlFor=id;label.textContent=item.label;
      const input=document.createElement(item.options?'select':'input');input.id=id;input.dataset.key=item.key;
      input.setAttribute('aria-controls',svg.id);
      if(item.options) for(const [value,name] of item.options) {const option=document.createElement('option');option.value=value;option.textContent=name;input.append(option);}
      else {input.type='range';input.min=item.min;input.max=item.max;input.step=item.step;}
      input.value=item.value;row.append(label,input);
      if(!item.options) {const output=document.createElement('output');output.htmlFor=id;output.dataset.output=item.key;row.append(output);}
      input.addEventListener('input',()=>{
        state[item.key]=item.options?input.value:Number(input.value);
        if(kind==='arithmetic'&&item.key==='operation') state.step=state.operation==='sum'?0:1;
        if(kind==='completeness'&&item.key==='p') state.step=state.p*state.p<20000?1:2;
        if(kind==='accumulation'&&item.key==='kind') state.step=0;
        render();
      });
      controls.append(row);
    }
    const stats=document.createElement('div');stats.className='stats';
    const reading=document.createElement('div');reading.className='reading';reading.id=`figure-${figure.id}-reading`;
    reading.setAttribute('aria-live','polite');reading.setAttribute('aria-atomic','true');
    svg.setAttribute('aria-describedby',reading.id);
    const proofControl=document.createElement('div');proofControl.className='proof-control';
    const position=document.createElement('span');
    let back,next;
    if(steps.length) {
      back=document.createElement('button');back.type='button';back.textContent='← Anterior';back.setAttribute('aria-label','Passo anterior da demonstração');
      next=document.createElement('button');next.type='button';next.textContent='Próximo →';next.setAttribute('aria-label','Próximo passo da demonstração');
      for(const [button,delta] of [[back,-1],[next,1]]) {
        button.setAttribute('aria-controls',proof.id+' '+svg.id);
        button.addEventListener('click',()=>{
          state.step=Math.max(0,Math.min(steps.length-1,state.step+delta));
          if(kind==='arithmetic') state.operation=state.step===0?'sum':'product';
          if(kind==='completeness') {
            if(state.step===1&&state.p*state.p>20000) state.p=130;
            if(state.step===2&&state.p*state.p<20000) state.p=160;
          }
          if(kind==='accumulation'&&state.step>0&&['integers','finite'].includes(state.kind)) state.kind='reciprocal';
          render();
        });
      }
      proofControl.append(position,back,next);
    }
    figure.replaceChildren(svg,controls,stats,reading,...(steps.length?[proofControl]:[]),caption);
    function render() {
      for(const item of cfg.controls) {
        controls.querySelector(`[data-key="${item.key}"]`).value=state[item.key];
        if(item.options) continue;
        const output=controls.querySelector(`[data-output="${item.key}"]`);
        output.textContent=item.display?item.display(state[item.key]):fmt(state[item.key]);
      }
      const r=draw(kind,state);
      svg.innerHTML=`<desc>${escape(r.reading)}</desc>${r.svg}`;
      stats.replaceChildren(...r.stats.map(([label,value])=>{const cell=document.createElement('div');cell.className='stat';const name=document.createElement('span'),number=document.createElement('b');name.textContent=label;number.textContent=value;cell.append(name,number);return cell;}));
      reading.textContent=r.reading;
      if(steps.length) {
        steps.forEach((step,j)=>{step.classList.toggle('active',j===state.step);if(j===state.step) step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
        position.textContent=`Demonstração · passo ${state.step+1} de ${steps.length}`;
        back.disabled=state.step===0;next.disabled=state.step===steps.length-1;
      }
    }
    render();
  }
  document.querySelectorAll('[data-lab]').forEach(mount);
})();
