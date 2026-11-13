(function(){
  'use strict';
  const host=document.querySelector('[data-explorer]');if(!host)return;
  const F=window.FunctionExplorer,form=host.querySelector('form'),input=host.querySelector('[name="expression"]'),domain=host.querySelector('[name="domain"]'),error=host.querySelector('[data-error]'),results=host.querySelector('[data-results]'),svg=host.querySelector('svg'),reading=host.querySelector('[data-reading]'),pointInput=host.querySelector('[name="point"]'),zoomInput=host.querySelector('[name="zoom"]'),view=host.querySelector('[name="view"]');
  const colors={blue:'#1c7fd6',purple:'#3b3fd8',red:'#c83b2b',green:'#087959',muted:'#566079',line:'#d3d9e3'};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=x=>Number.isFinite(x)?x.toLocaleString('pt-BR',{maximumFractionDigits:5,useGrouping:false}):'não definido';
  const labels={unknown:'Não determinado',none:'Não existe',both:'Par e ímpar',even:'Par',odd:'Ímpar',neither:'Nenhuma das duas',constant:'Crescente e decrescente (não estrita)',increasing:'Estritamente crescente',decreasing:'Estritamente decrescente',nondecreasing:'Crescente (não estrita)',nonincreasing:'Decrescente (não estrita)',periodic:'Periódica',all:'Todo T > 0 é período','not-applicable':'Domínio não simétrico',formula:'Inversa obtida'};
  let current;
  function run(){
    try{const ast=F.parse(input.value),report=F.analyze(ast,domain.value);current={ast,report,expression:input.value};error.textContent='';results.replaceChildren();
      const domainNote=document.createElement('p');domainNote.className='explorer-domain';domainNote.textContent='Domínio analisado: '+report.domain+'. A inversa é considerada de f(A) para A.';results.append(domainNote);
      for(const [key,title] of [['parity','Paridade'],['period','Periodicidade'],['monotonic','Monotonicidade'],['inverse','Inversa']]){const item=report[key],card=document.createElement('article'),h=document.createElement('h3'),value=document.createElement('p'),why=document.createElement('p');card.className='explorer-result';h.textContent=title;value.className='explorer-value';value.textContent=key==='monotonic'&&item.status==='neither'?'Não monótona':key==='parity'&&item.status==='neither'?'Nem par nem ímpar':key==='period'&&item.status==='none'?'Não periódica':labels[item.status];why.textContent=item.why;card.append(h,value);if(item.tex){const formula=document.createElement('div');formula.className='inverse-equation';formula.textContent='\\[f^{-1}(y)='+item.tex+'\\]';card.append(formula);}card.append(why);results.append(card);}
      if(window.CourseMath){window.CourseMath.legacy(domainNote,domainNote.textContent);for(const p of results.querySelectorAll('.explorer-result>p'))window.CourseMath.legacy(p,p.textContent);window.CourseMath.render(results);}
      const preview=host.querySelector('[data-expression-preview]');preview.textContent='\\[f(x)='+F.toLatex(ast)+'\\]';window.CourseMath?.render(preview);
      render();
    }catch(e){error.textContent=e.message;current=null;svg.innerHTML='';results.replaceChildren();reading.textContent='Corrija a expressão para iniciar a análise.';}
  }
  function render(){if(!current)return;const {ast,report}=current,L=Number(zoomInput.value),x=Number(pointInput.value),mode=view.value,Y=v=>440-(v+L)*400/(2*L);
    const XX=v=>80+(v+L)*400/(2*L),YY=Y;
    const text=(px,py,s,color=colors.muted)=>`<text x="${px}" y="${py}" text-anchor="middle" fill="${color}">${esc(s)}</text>`;
    const line=(a,b,c,d,color=colors.line,dash='')=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="5 5"':''}/>`;
    const dot=(a,b,color)=>Number.isFinite(a)&&Number.isFinite(b)?`<circle cx="${XX(a)}" cy="${YY(b)}" r="5" fill="${color}" clip-path="url(#explorer-clip)"/>`:'';
    const f=t=>report.allowed(t)?F.evaluate(ast,t):null;
    function curve(fn,color,dash=false){let d='',previous=null;for(let i=0;i<=800;i++){const t=-L+2*L*i/800,v=fn(t);if(v===null||!Number.isFinite(v)||Math.abs(v)>4*L){previous=null;continue;}const move=previous===null||Math.abs(v-previous)>L;d+=`${move?'M':'L'}${XX(t)},${YY(v)} `;previous=v;}return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} clip-path="url(#explorer-clip)"/>`;}
    let drawing='<defs><clipPath id="explorer-clip"><rect x="80" y="40" width="400" height="400"/></clipPath></defs>';
    for(let i=0;i<=4;i++){const t=-L+2*L*i/4;drawing+=line(XX(t),40,XX(t),440)+line(80,YY(t),480,YY(t))+text(XX(t),470,fmt(t))+text(50,YY(t)+5,fmt(t));}
    drawing+=line(80,YY(0),480,YY(0),colors.muted)+line(XX(0),40,XX(0),440,colors.muted)+curve(f,colors.blue);
    const y=f(x);let detail=y===null?`A entrada x = ${fmt(x)} não tem valor exibível: pode estar fora do domínio ou exceder a faixa numérica.`:`Ponto azul: (${fmt(x)}; ${fmt(y)}).`;
    if(y!==null)drawing+=dot(x,y,colors.blue);
    if(mode==='parity'){const odd=report.parity.status==='odd',g=t=>{const v=f(-t);return v===null?null:odd?-v:v;};drawing+=curve(g,colors.purple,true);detail+=odd?' Roxo tracejado: −f(−x), para comparar com f(x).':' Roxo tracejado: f(−x), para comparar com f(x).';const other=f(-x);if(other!==null)drawing+=dot(-x,other,colors.purple);}
    if(mode==='period'){const T=report.period.value||(report.period.status==='all'?1:null);if(T){drawing+=curve(t=>f(t+T),colors.purple,true);const shifted=f(x+T);if(shifted!==null)drawing+=dot(x+T,shifted,colors.purple);detail+=` Roxo tracejado: f(x+T), com T ≈ ${fmt(T)}. As curvas coincidem pela identidade justificada acima. Amplie a janela se o ponto transladado ficar fora dela.`;}else detail+=' Não há período obtido para sobrepor uma translação justificada.';}
    if(mode==='inverse'){drawing+=line(80,440,480,40,colors.muted,'dash');if(report.inverse.fn){drawing+=curve(report.inverse.fn,colors.green);if(y!==null)drawing+=dot(y,x,colors.green)+line(XX(x),YY(y),XX(y),YY(x),colors.purple,'dash');detail+=' Verde: inversa em f(A). A troca (x,y) ↦ (y,x) reflete o gráfico na reta y=x; as unidades dos eixos são iguais.';}else detail+=' Nenhuma curva inversa foi obtida para este domínio. Veja a justificativa acima.';}
    if(mode==='monotonic'){const x2=x+1,y2=f(x2);if(y!==null&&y2!==null){drawing+=dot(x2,y2,colors.purple)+line(XX(x),YY(y),XX(x2),YY(y2),colors.purple,'dash');detail+=` Compare x₁ = ${fmt(x)} < x₂ = ${fmt(x2)} e as saídas ${fmt(y)} e ${fmt(y2)}. Este par ilustra a comparação; não demonstra uma propriedade global.`;}else detail+=' Uma das entradas x e x+1 não tem valor exibível: domínio ou faixa numérica.';}
    drawing+=text(280,20,'Azul: f(x)',colors.blue);svg.innerHTML=`<desc>${esc(detail)}</desc>`+drawing;window.CourseMath?.svgLabels(svg);if(window.CourseMath)window.CourseMath.legacy(reading,detail);else reading.textContent=detail;if(window.CourseMath){window.CourseMath.legacy(host.querySelector('[data-point-value]'),fmt(x));window.CourseMath.legacy(host.querySelector('[data-zoom-value]'),'±'+fmt(L));}else{host.querySelector('[data-point-value]').textContent=fmt(x);host.querySelector('[data-zoom-value]').textContent='±'+fmt(L);}
  }
  form.addEventListener('submit',e=>{e.preventDefault();run();});domain.addEventListener('change',run);
  for(const element of [pointInput,zoomInput,view])element.addEventListener('input',render);
  host.querySelectorAll('[data-expression]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.expression;domain.value=button.dataset.domain||'natural';run();}));
  run();
  if(window.CourseMath)for(const element of host.querySelectorAll('label,[data-expression]')){
    if(element.matches('[data-expression]'))element.setAttribute('aria-label',element.textContent);
    if(element.querySelector('output')){for(const node of [...element.childNodes])if(node.nodeType===3){const span=document.createElement('span');if(node.textContent.includes('\\(')){span.textContent=node.textContent;window.CourseMath.render(span);}else window.CourseMath.legacy(span,node.textContent);node.replaceWith(span);}}
    else if(element.textContent.includes('\\('))window.CourseMath.render(element);
    else window.CourseMath.legacy(element,element.textContent);
  }
  document.fonts?.ready.then(render);
})();
