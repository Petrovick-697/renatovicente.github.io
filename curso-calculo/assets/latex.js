/* TeX é a fonte das fórmulas. A conversão legada atende aos valores das bancadas. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CourseMath=api;})(typeof window==='object'?window:this,function(){
  'use strict';
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const symbols={'ℝ':'\\mathbb{R}','ℚ':'\\mathbb{Q}','ℤ':'\\mathbb{Z}','ℕ':'\\mathbb{N}','ε':'\\varepsilon ','δ':'\\delta ','α':'\\alpha ','λ':'\\lambda ','θ':'\\theta ','π':'\\pi ','χ':'\\chi ','∞':'\\infty ','∅':'\\varnothing ','∈':'\\in ','∉':'\\notin ','⊂':'\\subseteq ','⊆':'\\subseteq ','∖':'\\setminus ','∪':'\\cup ','∩':'\\cap ','∀':'\\forall ','∃':'\\exists ','⇒':'\\implies ','⇔':'\\iff ','→':'\\to ','←':'\\leftarrow ','↦':'\\mapsto ','≤':'\\le ','≥':'\\ge ','≠':'\\ne ','≈':'\\approx ','∘':'\\circ ','·':'\\cdot ','×':'\\times ','…':'\\ldots ','−':'-','±':'\\pm ','⌊':'\\lfloor ','⌋':'\\rfloor ','′':'\\prime '};
  const supers={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','ⁿ':'n'};
  const subs={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-','ₙ':'n','ₘ':'m','ᵢ':'i'};
  symbols['η']='\\eta ';symbols['′']='^{\\prime}';
  function tex(source){
    let s=String(source).trim().replace(/B([δη])/g,'B_$1').replace(/χℚ/g,'χ_ℚ').replace(/[{}]/g,c=>'\\'+c);
    // As barras de fração são mantidas no modo compacto; as fórmulas de destaque
    // usam frações explícitas na fonte HTML quando necessário.
    s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+/g,t=>`^{${[...t].map(c=>supers[c]).join('')}}`).replace(/[₀₁₂₃₄₅₆₇₈₉₊₋ₙₘᵢ]+/g,t=>`_{${[...t].map(c=>subs[c]).join('')}}`);
    s=s.replace(/√(max|min)\\\{([^{}]*)\\\}/g,'\\sqrt{\\$1\\{$2\\}}');
    s=s.replace(/√(?:\(([^()]*)\)|([\p{L}\p{N}]+(?:\^\{[^}]+\})?))/gu,(_,group,atom)=>`\\sqrt{${group||atom}}`);
    s=s.replace(/(?<!\\)\b(sup|inf|max|min|sin|cos|tan|exp|ln|log)\b/g,'\\$1 ').replace(/\bsen\b/g,'\\sin ');
    s=s.replace(/[ℝℚℤℕεδηαλθπχ∞∅∈∉⊂⊆∖∪∩∀∃⇒⇔→←↦≤≥≠≈∘·×…−±⌊⌋′]/g,c=>symbols[c]);
    s=s.replace(/_([A-Za-z]|\\mathbb\{[A-Z]\}|\\(?:delta|chi) )/g,'_{$1}');
    return s;
  }
  const words=new Set(('x y z a b c d f g h i j k m n p q r s t u v A B C D E F G H I L M N P Q R S T U V ab xy ca cb cx mx nx nf ng pf pc cq fg na nS rα jT kT mT pT qT sh α ε δ λ θ π χ ℝ ℚ ℤ ℕ sup inf max min sen sin cos tan exp ln log').split(' '));
  const token=/[A-Za-zÀ-ÖØ-öø-ÿ]+|[α-ωΑ-Ωℝℚℤℕ]+|\d+(?:[.,]\d+)?|\s+|./gu;
  words.add('η');
  function mark(source){
    const parts=String(source).match(token)||[];let result='',pending='';
    const mathToken=t=>/^\s+$/.test(t)||words.has(t)||/^\d+(?:[.,]\d+)?$/.test(t)||/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ₀₁₂₃₄₅₆₇₈₉₊₋ₙₘᵢ]$/.test(t)||/^[+−\-*/=<>≤≥≠≈|()\[\]{},:;_^′√∀∃∈∉⊂⊆∖∪∩⇒⇔→←↦∘·×±∞∅…⌊⌋]$/.test(t);
    function flush(){
      if(!pending)return;
      let lead=pending.match(/^\s*/)[0],tail=pending.match(/\s*$/)[0],core=pending.trim();
      if(!core){result+=escape(pending);pending='';return;}
      const before=core.match(/^[,:;]+\s*/)?.[0]||'';if(before){lead+=before;core=core.slice(before.length);}
      // Separadores de prosa e pontuação ficam fora do trecho matemático.
      const punctuation=core.match(/[,:;]+$/)?.[0]||'';if(punctuation)core=core.slice(0,-punctuation.length).trimEnd();
      if(/^a\s+(?=[A-Za-zα-ωℝℚℤℕ])/.test(core)){lead+='a ';core=core.replace(/^a\s+/,'');}
      if(/^A$/.test(core)&&!/(?:de|em|conjunto|domínio|imagem|sobre|todo|a)\s+$/.test(result)) {result+=escape(lead+core+punctuation+tail);pending='';return;}
      const looks=/[A-Za-z\dα-ωℝℚℤℕ√∀∃∈∉⊂⊆∖∪∩⇒⇔↦≤≥≠≈<>|=⁰¹²³ⁿ₀₁₂∞∅⌊⌋]/.test(core);
      if(looks&&core)result+=escape(lead)+'\\('+escape(tex(core))+'\\)'+escape(punctuation+tail);
      else result+=escape(lead+core+punctuation+tail);
      pending='';
    }
    for(let i=0;i<parts.length;i++){
      const t=parts[i],prev=parts.slice(0,i).filter(p=>p.trim()).at(-1),next=parts.slice(i+1).find(p=>p.trim());
      const article=(t==='a'||t==='na')&&!/^[+−\-*/=<>≤≥≠≈|({]$/.test(prev||'')&&!/^[+−\-*/=<>≤≥≠≈|),:;⁰¹²³⁴⁵ⁿ₀₁₂ₙₘ]$/.test(next||'');
      if(mathToken(t)&&!article)pending+=t;else{flush();result+=escape(t);}
    }flush();return result;
  }
  function render(element){
    if(!element||typeof window==='undefined'||!window.renderMathInElement)return;
    window.renderMathInElement(element,{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false,strict:'error',trust:false,ignoredTags:['script','noscript','style','textarea','pre','code','option','select','svg'],errorCallback:(message)=>{console.error('LaTeX:',message);}});
  }
  function legacy(element,value){element.innerHTML=/^[−-]?\d+(?:[.,/]\d+)*$/.test(String(value))||words.has(String(value).trim())?'\\('+escape(tex(value))+'\\)':mark(value);render(element);}
  const choices={'x²':'Quadrática','x³':'Cúbica','x² + x':'Quadrática com termo linear','0':'Função nula','F(x) = x':'Identidade','G(x) = |x|':'Módulo','aₙ = (−1)ⁿ':'Alternada, começando em 1','bₙ = (−1)ⁿ⁺¹':'Alternada, começando em −1','cₙ = 1/(n + 1)':'Recíprocos deslocados','√x + (x − 1)':'Soma','√x · (x − 1)':'Produto','√x / (x − 1)':'Quociente','⌊x⌋':'Piso','x² em ℝ':'Quadrado na reta real','x² em ℝ₊':'Quadrado na semirreta','Relação x² + y² = 1':'Circunferência','ℝ':'Todos os reais','ℝ₊':'Reais não negativos','mx + b em ℝ':'Função afim','mx em ℝ':'Função linear','⌊x⌋ em ℝ':'Piso','Constante f = 1':'Função constante','χℚ':'Indicadora dos racionais','T = 1/q':'Recíproco de inteiro','T = √2':'Raiz de dois','√2':'Raiz de dois','−√2':'Oposto da raiz de dois','1 + √2':'Raiz de dois mais um','f(x) = cx':'Modelo linear','f(x) = x² (falha homogeneidade)':'Contraexemplo quadrático','r + √2':'Soma','r · √2':'Produto','ℤ':'Números inteiros','D = {1/n : n ≥ 1}':'Recíprocos','A = (0, 1)':'Intervalo aberto','A = [0, 1]':'Intervalo fechado','A = (0, 1]':'Incluir só o extremo direito','A = [0, 1)':'Incluir só o extremo esquerdo','F = {0, 1, 2}':'Conjunto finito','(a, b)':'Ambos os extremos excluídos','[a, b]':'Ambos os extremos incluídos','[a, b)':'Incluir só o extremo esquerdo','(a, b]':'Incluir só o extremo direito','{0, 1, 4}':'Imagem como contradomínio','{0, 1, 2, 3, 4}':'Contradomínio ampliado'};
  const choiceName=value=>choices[value]||value;
  function placeLabels(labels,width,height){
    const placed=[];
    return labels.map(item=>{
      const x=item.anchor==='start'?item.x:item.anchor==='end'?item.x-item.width:item.x-item.width/2,y=Math.max(3,item.y-item.height*.78);
      for(const [dx,dy] of [[0,0],[0,-26],[0,26],[0,-52],[0,52],[-40,0],[40,0],[0,-78],[0,78]]){
        const box={x:x+dx,y:y+dy,width:item.width,height:item.height};
        if(box.x<4||box.y<3||box.x+box.width>width-4||box.y+box.height>height-3)continue;
        if(placed.some(p=>box.x<p.x+p.width+4&&box.x+box.width+4>p.x&&box.y<p.y+p.height+3&&box.y+box.height+3>p.y))continue;
        placed.push(box);return box;
      }
      return null;
    });
  }
  function svgLabels(svg){
    if(typeof document==='undefined'||!window.katex)return [];
    const nodes=[...svg.querySelectorAll('text')],measurement=document.createElement('div');
    measurement.className='svg-label math-measure';document.body.append(measurement);
    const labels=nodes.map(node=>{
      const value=node.textContent,markup=/^[−-]?\d+(?:[,.]\d+)?$/.test(value)?`\\(${tex(value)}\\)`:mark(value);
      measurement.innerHTML=markup;render(measurement);
      const rect=measurement.getBoundingClientRect();
      return {node,value,markup:measurement.innerHTML,width:Math.ceil(rect.width)+6,height:Math.ceil(rect.height)+2,x:Number(node.getAttribute('x')),y:Number(node.getAttribute('y')),anchor:node.getAttribute('text-anchor')||'middle',color:node.getAttribute('fill')||'#566079'};
    });
    measurement.remove();const view=svg.viewBox.baseVal,positions=placeLabels(labels,view.width,view.height),overflow=[];
    labels.forEach((item,i)=>{
      const box=positions[i];if(!box){overflow.push({label:item.value,color:item.color});item.node.remove();return;}
      const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
      for(const [key,value] of Object.entries(box))fo.setAttribute(key,value);
      const div=document.createElementNS('http://www.w3.org/1999/xhtml','div');div.className='svg-label';div.style.color=item.color;div.innerHTML=item.markup;fo.append(div);item.node.replaceWith(fo);
    });return overflow;
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>render(document.body));
  return Object.freeze({tex,mark,render,legacy,escape,placeLabels,svgLabels,choiceName});
});
