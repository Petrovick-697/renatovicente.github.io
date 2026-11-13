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
      for(const [key,title] of [['parity','Paridade'],['period','Periodicidade'],['monotonic','Monotonicidade'],['inverse','Inversa']]){const item=report[key],card=document.createElement('article'),h=document.createElement('h3'),value=document.createElement('p'),why=document.createElement('p');card.className='explorer-result';h.textContent=title;value.className='explorer-value';value.textContent=key==='monotonic'&&item.status==='neither'?'Não monótona':key==='parity'&&item.status==='neither'?'Nem par nem ímpar':key==='period'&&item.status==='none'?'Não periódica':labels[item.status];if(item.formula)value.textContent+=': '+item.formula;why.textContent=item.why;card.append(h,value,why);results.append(card);}
      render();
    }catch(e){error.textContent=e.message;current=null;svg.innerHTML='';results.replaceChildren();reading.textContent='Corrija a expressão para iniciar a análise.';}
  }
  function render(){if(!current)return;const {ast,report}=current,L=Number(zoomInput.value),x=Number(pointInput.value),mode=view.value,X=v=>80+(v+L)*400/(2*L),Y=v=>340-(v+L)*300/(2*L);
    // O quadrado interno usa unidades iguais: 300 px em cada eixo.
    const XX=v=>130+(v+L)*300/(2*L),YY=Y;
    const text=(px,py,s,color=colors.muted)=>`<text x="${px}" y="${py}" text-anchor="middle" fill="${color}">${esc(s)}</text>`;
    const line=(a,b,c,d,color=colors.line,dash='')=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="5 5"':''}/>`;
    const dot=(a,b,color)=>Number.isFinite(a)&&Number.isFinite(b)?`<circle cx="${XX(a)}" cy="${YY(b)}" r="5" fill="${color}" clip-path="url(#explorer-clip)"/>`:'';
    const f=t=>report.allowed(t)?F.evaluate(ast,t):null;
    function curve(fn,color,dash=false){let d='',previous=null;for(let i=0;i<=800;i++){const t=-L+2*L*i/800,v=fn(t);if(v===null||!Number.isFinite(v)||Math.abs(v)>4*L){previous=null;continue;}const move=previous===null||Math.abs(v-previous)>L;d+=`${move?'M':'L'}${XX(t)},${YY(v)} `;previous=v;}return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} clip-path="url(#explorer-clip)"/>`;}
    let drawing='<defs><clipPath id="explorer-clip"><rect x="130" y="40" width="300" height="300"/></clipPath></defs>';
    for(let i=0;i<=4;i++){const t=-L+2*L*i/4;drawing+=line(XX(t),40,XX(t),340)+line(130,YY(t),430,YY(t))+text(XX(t),365,fmt(t))+text(100,YY(t)+5,fmt(t));}
    drawing+=line(130,YY(0),430,YY(0),colors.muted)+line(XX(0),40,XX(0),340,colors.muted)+curve(f,colors.blue);
    const y=f(x);let detail=y===null?`A entrada x = ${fmt(x)} não tem valor exibível: pode estar fora do domínio ou exceder a faixa numérica.`:`Ponto azul: (${fmt(x)}; ${fmt(y)}).`;
    if(y!==null)drawing+=dot(x,y,colors.blue);
    if(mode==='parity'){const odd=report.parity.status==='odd',g=t=>{const v=f(-t);return v===null?null:odd?-v:v;};drawing+=curve(g,colors.purple,true);detail+=odd?' Roxo tracejado: −f(−x), para comparar com f(x).':' Roxo tracejado: f(−x), para comparar com f(x).';const other=f(-x);if(other!==null)drawing+=dot(-x,other,colors.purple);}
    if(mode==='period'){const T=report.period.value||(report.period.status==='all'?1:null);if(T){drawing+=curve(t=>f(t+T),colors.purple,true);const shifted=f(x+T);if(shifted!==null)drawing+=dot(x+T,shifted,colors.purple);detail+=` Roxo tracejado: f(x+T), com T ≈ ${fmt(T)}. As curvas coincidem pela identidade justificada acima. Amplie a janela se o ponto transladado ficar fora dela.`;}else detail+=' Não há período obtido para sobrepor uma translação justificada.';}
    if(mode==='inverse'){drawing+=line(130,340,430,40,colors.muted,'dash');if(report.inverse.fn){drawing+=curve(report.inverse.fn,colors.green);if(y!==null)drawing+=dot(y,x,colors.green)+line(XX(x),YY(y),XX(y),YY(x),colors.purple,'dash');detail+=' Verde: inversa em f(A). A troca (x,y) ↦ (y,x) reflete o gráfico na reta y=x; as unidades dos eixos são iguais.';}else detail+=' Nenhuma curva inversa foi obtida para este domínio. Veja a justificativa acima.';}
    if(mode==='monotonic'){const x2=x+1,y2=f(x2);if(y!==null&&y2!==null){drawing+=dot(x2,y2,colors.purple)+line(XX(x),YY(y),XX(x2),YY(y2),colors.purple,'dash');detail+=` Compare x₁ = ${fmt(x)} < x₂ = ${fmt(x2)} e as saídas ${fmt(y)} e ${fmt(y2)}. Este par ilustra a comparação; não demonstra uma propriedade global.`;}else detail+=' Uma das entradas x e x+1 não tem valor exibível: domínio ou faixa numérica.';}
    drawing+=text(280,20,'Azul: f(x)',colors.blue);svg.innerHTML=`<desc>${esc(detail)}</desc>`+drawing;reading.textContent=detail;host.querySelector('[data-point-value]').textContent=fmt(x);host.querySelector('[data-zoom-value]').textContent='±'+fmt(L);
  }
  form.addEventListener('submit',e=>{e.preventDefault();run();});domain.addEventListener('change',run);
  for(const element of [pointInput,zoomInput,view])element.addEventListener('input',render);
  host.querySelectorAll('[data-expression]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.expression;domain.value=button.dataset.domain||'natural';run();}));
  run();
})();
