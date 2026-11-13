(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FunctionExplorer=api;})(typeof window==='object'?window:this,function(){
  'use strict';
  const gcd=(a,b)=>b?gcd(b,a%b):a<0n?-a:a;
  function Q(n,d=1n){if(!d)throw Error('Divisão por zero numa constante.');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);n/=g;d/=g;if(n.toString().length>250||d.toString().length>250)throw Error('Os coeficientes excedem o limite de cálculo exato deste explorador.');return {n,d};}
  const zero=Q(0n),one=Q(1n),add=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d),neg=a=>Q(-a.n,a.d),mul=(a,b)=>Q(a.n*b.n,a.d*b.d),div=(a,b)=>Q(a.n*b.d,a.d*b.n),num=a=>Number(a.n)/Number(a.d),sign=a=>a.n<0n?-1:a.n>0n?1:0;
  const qstr=a=>a.d===1n?String(a.n):`${a.n}/${a.d}`;
  const qtex=a=>a.d===1n?String(a.n):`\\frac{${a.n}}{${a.d}}`;
  const subtract=(value,c)=>sign(c)?`${value}-\\left(${qtex(c)}\\right)`:value;
  const divide=(value,c)=>c.n===c.d?value:`\\frac{${value}}{${qtex(c)}}`;
  function toLatex(a,parent=0){
    if(a.kind==='number')return qtex(a.value);if(a.kind==='x')return 'x';if(a.kind==='constant')return a.name==='π'?'\\pi':'e';
    if(a.kind==='unary'){const value=a.op+toLatex(a.arg,25);return parent>25?`\\left(${value}\\right)`:value;}
    if(a.kind==='call'){const v=toLatex(a.arg);return a.name==='sqrt'?`\\sqrt{${v}}`:a.name==='cbrt'?`\\sqrt[3]{${v}}`:a.name==='abs'?`\\left|${v}\\right|`:a.name==='floor'?`\\left\\lfloor${v}\\right\\rfloor`:`\\${a.name}\\left(${v}\\right)`;}
    const priority=a.op==='^'?30:['*','/'].includes(a.op)?20:10;
    const l=toLatex(a.left,a.op==='^'?31:priority),r=toLatex(a.right,a.op==='-'?priority+1:0);
    if(a.op==='/')return `\\frac{${toLatex(a.left)}}{${r}}`;if(a.op==='^'){const value=`${l}^{${r}}`;return parent>30?`\\left(${value}\\right)`:value;}
    const right=a.op==='*'?toLatex(a.right,20):r,value=`${l}${a.op==='*'?'\\cdot ':a.op}${right}`;
    return priority<parent?`\\left(${value}\\right)`:value;
  }
  const funcs={sin:Math.sin,cos:Math.cos,tan:Math.tan,exp:Math.exp,ln:Math.log,sqrt:Math.sqrt,abs:Math.abs,floor:Math.floor,cbrt:Math.cbrt};
  const aliases={sen:'sin',tg:'tan',log:'ln',raiz:'sqrt',piso:'floor'};
  function parse(source){
    if(typeof source!=='string'||source.length>400)throw Error('Use uma expressão de até 400 caracteres.');
    const tokens=[];let i=0;
    while(i<source.length){if(/\s/.test(source[i])){i++;continue;}const tail=source.slice(i),m=tail.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);if(m){if(m[0].length>18||Math.abs(Number(m[0]))>1e9)throw Error('Constante fora do limite do explorador.');tokens.push(m[0]);i+=m[0].length;continue;}const word=tail.match(/^[A-Za-z]+|^π/);if(word){tokens.push(word[0].toLowerCase());i+=word[0].length;continue;}if('+-*/^()'.includes(source[i])){tokens.push(source[i++]);continue;}throw Error('Símbolo não reconhecido. Use ponto decimal e * para multiplicar.');}
    let pos=0,nodes=0;
    function expression(min=0,depth=0){
      if(depth>25||++nodes>120)throw Error('Expressão muito complexa para esta bancada.');
      const token=tokens[pos++];let left;
      if(token==='+'||token==='-')left={kind:'unary',op:token,arg:expression(25,depth+1)};
      else if(token==='('){left=expression(0,depth+1);if(tokens[pos++]!==')')throw Error('Feche os parênteses.');}
      else if(token&&/^(?:\d|\.)/.test(token)){
        const [mantissa,exponent='0']=token.toLowerCase().split('e'),parts=mantissa.split('.'),digits=(parts[0]||'0')+(parts[1]||''),power=Number(exponent)-(parts[1]||'').length;
        if(Math.abs(power)>20)throw Error('Expoente decimal fora do limite.');
        left={kind:'number',value:power>=0?Q(BigInt(digits)*10n**BigInt(power)):Q(BigInt(digits),10n**BigInt(-power))};
      }else if(token==='x')left={kind:'x'};
      else if(token==='pi'||token==='π'||token==='e')left={kind:'constant',name:token==='e'?'e':'π'};
      else if(token&&funcs[aliases[token]||token]){const name=aliases[token]||token;if(tokens[pos++]!=='(')throw Error('Use parênteses após '+token+'.');const arg=expression(0,depth+1);if(tokens[pos++]!==')')throw Error('Feche os parênteses da função.');left={kind:'call',name,arg};}
      else throw Error('Use x, números, pi, e e as funções indicadas abaixo.');
      while(pos<tokens.length){const op=tokens[pos],p={'+':10,'-':10,'*':20,'/':20,'^':30}[op];if(p===undefined||p<min)break;pos++;left={kind:'binary',op,left,right:expression(op==='^'?p:p+1,depth+1)};}
      return left;
    }
    const ast=expression();if(pos!==tokens.length)throw Error('Há termos sem operador. Escreva, por exemplo, 2*x e sin(x).');
    function validate(a){if(a.kind==='binary'){if(a.op==='^'){const e=polynomial(a.right);if(e?.length===1&&!sign(e[0]))throw Error('Expoente constante zero não é aceito nesta bancada, para evitar 0^0. Digite 1 se deseja a função constante.');}validate(a.left);validate(a.right);}else if(a.arg)validate(a.arg);}
    validate(ast);return ast;
  }
  function evaluate(a,x){let v;if(a.kind==='number')v=num(a.value);else if(a.kind==='constant')v=a.name==='e'?Math.E:Math.PI;else if(a.kind==='x')v=x;else if(a.kind==='unary'){const t=evaluate(a.arg,x);v=t===null?NaN:a.op==='-'?-t:t;}else if(a.kind==='call'){const t=evaluate(a.arg,x);v=t===null?NaN:a.name==='tan'&&Math.abs(Math.cos(t))<1e-12?NaN:funcs[a.name](t);}else{const l=evaluate(a.left,x),r=evaluate(a.right,x);if(l===null||r===null)return null;v=a.op==='+'?l+r:a.op==='-'?l-r:a.op==='*'?l*r:a.op==='/'?(r===0?NaN:l/r):(l===0&&r===0?NaN:Math.pow(l,r));}return Number.isFinite(v)?v:null;}
  function polynomial(a){
    if(a.kind==='number')return [a.value];if(a.kind==='x')return [zero,one];
    if(a.kind==='unary'){const p=polynomial(a.arg);return p&&(a.op==='-'?p.map(neg):p);}
    if(a.kind!=='binary')return null;const p=polynomial(a.left),r=polynomial(a.right);if(!p||!r)return null;let out;
    if(a.op==='+'||a.op==='-'){out=Array.from({length:Math.max(p.length,r.length)},(_,i)=>add(p[i]||zero,a.op==='-'?neg(r[i]||zero):r[i]||zero));}
    else if(a.op==='*'){if(p.length+r.length>10)return null;out=Array(p.length+r.length-1).fill(zero);p.forEach((v,i)=>r.forEach((w,j)=>{out[i+j]=add(out[i+j],mul(v,w));}));}
    else if(a.op==='/'&&r.length===1){out=p.map(v=>div(v,r[0]));}
    else if(a.op==='^'&&r.length===1&&r[0].d===1n&&r[0].n>=0n&&r[0].n<=6n){out=[one];for(let j=0;j<Number(r[0].n);j++){if(out.length+p.length>10)return null;const t=Array(out.length+p.length-1).fill(zero);out.forEach((v,i)=>p.forEach((w,k)=>{t[i+k]=add(t[i+k],mul(v,w));}));out=t;}}
    else return null;
    while(out.length>1&&!sign(out.at(-1)))out.pop();return out;
  }
  const key=a=>a.kind==='number'?qstr(a.value):a.kind==='x'?'x':a.kind==='constant'?a.name:a.kind==='call'?`${a.name}(${key(a.arg)})`:a.kind==='unary'?a.op+key(a.arg):`(${key(a.left)}${a.op}${key(a.right)})`;
  function atomForm(a){
    const p=polynomial(a);if(p&&p.length===1)return {a:zero,d:p[0],atom:null};
    if(a.kind==='call')return {a:one,d:zero,atom:a};
    if(a.kind==='unary'){const f=atomForm(a.arg);return f&&(a.op==='-'?{...f,a:neg(f.a),d:neg(f.d)}:f);}
    if(a.kind!=='binary')return null;const l=atomForm(a.left),r=atomForm(a.right);if(!l||!r)return null;
    if(a.op==='+'||a.op==='-'){if(l.atom&&r.atom&&key(l.atom)!==key(r.atom))return null;return {a:add(l.a,a.op==='-'?neg(r.a):r.a),d:add(l.d,a.op==='-'?neg(r.d):r.d),atom:l.atom||r.atom};}
    if(a.op==='*'&&(!l.atom||!r.atom)){const f=l.atom?l:r,c=l.atom?r:l;return {a:mul(f.a,c.d),d:mul(f.d,c.d),atom:f.atom};}
    if(a.op==='/'&&!r.atom)return {a:div(l.a,r.d),d:div(l.d,r.d),atom:l.atom};return null;
  }
  function formalParity(a){
    const p=polynomial(a);if(p)return p.every((v,i)=>i%2===0||!sign(v))?'even':p.every((v,i)=>i%2===1||!sign(v))?'odd':'unknown';
    if(a.kind==='constant')return 'even';if(a.kind==='unary')return formalParity(a.arg);
    if(a.kind==='call'){const t=formalParity(a.arg);if(t==='even')return 'even';if(t==='odd'){if(['sin','tan','cbrt'].includes(a.name))return 'odd';if(['cos','abs'].includes(a.name))return 'even';}return 'unknown';}
    if(a.kind==='binary'){const l=formalParity(a.left),r=formalParity(a.right);if(['+','-'].includes(a.op))return l===r?l:'unknown';if(['*','/'].includes(a.op)&&l!=='unknown'&&r!=='unknown')return l===r?'even':'odd';if(a.op==='^'){const n=polynomial(a.right);if(n?.length===1&&n[0].d===1n&&l!=='unknown')return n[0].n%2n===0n?'even':l;}}
    return 'unknown';
  }
  function symmetricNatural(a){
    if(['number','constant','x'].includes(a.kind))return true;
    if(a.kind==='unary')return symmetricNatural(a.arg);
    if(a.kind==='call'){if(!symmetricNatural(a.arg))return null;if(['ln','sqrt'].includes(a.name))return formalParity(a.arg)==='even'?true:null;if(a.name==='tan')return formalParity(a.arg)!=='unknown'?true:null;return true;}
    if(a.kind==='binary'){if(!symmetricNatural(a.left)||!symmetricNatural(a.right))return null;if(a.op==='/')return formalParity(a.right)!=='unknown'?true:null;if(a.op==='^'){const p=polynomial(a.right);return p?.length===1&&p[0].d===1n?true:null;}return true;}return null;
  }
  const domains={natural:{label:'Domínio natural real',min:-Infinity,max:Infinity},positive:{label:'Domínio natural ∩ [0,+∞)',min:0,max:Infinity},negative:{label:'Domínio natural ∩ (−∞,0]',min:-Infinity,max:0},sine:{label:'Domínio natural ∩ [−π/2,π/2]',min:-Math.PI/2,max:Math.PI/2},cosine:{label:'Domínio natural ∩ [0,π]',min:0,max:Math.PI},tangent:{label:'Domínio natural ∩ (−π/2,π/2)',min:-Math.PI/2,max:Math.PI/2,open:true}};
  function analyze(ast,domain='natural'){
    if(!domains[domain])throw Error('Domínio desconhecido.');const dom=domains[domain],allowed=x=>x>=dom.min&&x<=dom.max&&(!dom.open||x>dom.min&&x<dom.max)&&evaluate(ast,x)!==null;
    const unknown=why=>({status:'unknown',why}),yes=(status,why)=>({status,why});
    const report={domain:dom.label,parity:unknown('A análise simbólica disponível não decidiu a paridade neste domínio.'),period:unknown('Um trecho do gráfico não demonstra periodicidade nem sua ausência.'),monotonic:unknown('Não foi obtido um argumento global de monotonicidade para esta expressão.'),inverse:unknown('Não foi obtida uma fórmula de inversa. Isso não prova que ela não exista.'),allowed};
    let symmetric=['natural','sine','tangent'].includes(domain)&&symmetricNatural(ast)===true;
    const p=polynomial(ast),atom=atomForm(ast),only=p?p.map((v,i)=>i&&sign(v)?i:0).filter(Boolean):[],power=only.length===1?only[0]:null;
    const innerPolynomial=atom?.atom?polynomial(atom.atom.arg):null,linearInner=innerPolynomial?.length===2&&sign(innerPolynomial[1]);
    const knownDomain=!!p||!!(linearInner&&['sin','cos','tan','exp','ln','sqrt','cbrt','abs','floor'].includes(atom.atom.name));
    let intervalMin=dom.min,intervalMax=dom.max,naturalHalf=false;
    if(linearInner&&['ln','sqrt'].includes(atom.atom.name)){
      naturalHalf=true;const B=num(innerPolynomial[1]),edge=num(div(neg(innerPolynomial[0]),innerPolynomial[1]));
      if(['sine','cosine','tangent'].includes(domain)&&[dom.min,dom.max].some(t=>Math.abs(edge-t)<1e-12)){
        report.domain=dom.label+'; fronteira próxima de um extremo, sem certificação nesta versão';return report;
      }
      if(B>0)intervalMin=Math.max(intervalMin,edge);else intervalMax=Math.min(intervalMax,edge);
      if(intervalMin>intervalMax||intervalMin===intervalMax&&(atom.atom.name==='ln'||dom.open)){
        report.domain='Domínio vazio nesta restrição';report.parity=unknown('Não há entradas neste domínio; escolha outra restrição.');report.period=unknown('A análise foi interrompida porque o domínio é vazio.');return report;
      }
      symmetric=intervalMin===-intervalMax;
      if(intervalMin===intervalMax){report.domain=`Domínio com uma única entrada: {${intervalMin}}`;report.parity=unknown('O caso de domínio unitário não é classificado por esta versão do explorador.');return report;}
    }
    const noPeriod=why=>{report.period=yes('none',why);};
    const mono=(direction,why)=>{report.monotonic=yes(direction,why);};
    function inverse(formula,fn,why,tex){report.inverse={status:'formula',formula,tex,why,fn:y=>{const x=fn(y);return Number.isFinite(x)&&allowed(x)?x:null;}};}
    if(domain!=='natural'&&knownDomain)noPeriod('Este domínio não vazio é limitado em pelo menos um sentido. Nenhum T > 0 pode preservá-lo por todas as translações ±T.');
    if(p){
      report.domain=domain==='natural'?'ℝ':dom.label.replace('Domínio natural ∩ ','');
      if(p.length===1){mono('constant','As saídas são iguais: a função é crescente e decrescente no sentido não estrito.');if(domain==='natural')report.period=yes('all','Todo T > 0 é período. Não existe período mínimo.');report.inverse=yes('none','Uma constante num domínio com mais de um ponto não é injetora.');}
      else{
        if(domain==='natural')noPeriod('Para um polinômio de grau n ≥ 1, P(x+T)−P(x) tem termo de grau n−1 com coeficiente n·aₙ·T ≠ 0. Logo não pode ser identicamente zero.');
        let transformed=only.map(i=>sign(p[i])*(domain==='negative'&&i%2?-1:1));
        if(p.length===2)mono(sign(p[1])>0?'increasing':'decreasing','Uma função afim de inclinação não nula transporta as diferenças por f(v)−f(u) = a(v−u).');
        else if(power){const a=sign(p[power]);if(power%2)mono(a>0?'increasing':'decreasing','Potências inteiras ímpares preservam estritamente a ordem; o sinal do coeficiente determina o sentido.');else if(['positive','cosine'].includes(domain))mono(a>0?'increasing':'decreasing','Na semirreta não negativa, a potência par é estritamente crescente antes de multiplicar pelo coeficiente.');else if(domain==='negative')mono(a>0?'decreasing':'increasing','Na semirreta não positiva, a potência par é estritamente decrescente antes de multiplicar pelo coeficiente.');else {mono('neither','Há entradas simétricas distintas com a mesma saída e a função varia nos dois lados de zero.');report.inverse=yes('none','Neste domínio, entradas x e −x distintas têm a mesma saída.');}}
        else if(only.every(i=>i%2===1)&&only.every(i=>sign(p[i])===sign(p[only[0]])))mono(sign(p[only[0]])>0?'increasing':'decreasing','Cada potência ímpar preserva a ordem; os coeficientes não nulos têm o mesmo sinal.');
        else if(['positive','negative','cosine'].includes(domain)&&transformed.every(v=>v===transformed[0]))mono(transformed[0]*(domain==='negative'?-1:1)>0?'increasing':'decreasing','Após escrever x = ±t, com t ≥ 0, todas as potências variam no mesmo sentido.');
        if(power&&['increasing','decreasing'].includes(report.monotonic.status)){
          const a=num(p[power]),b=num(p[0]);inverse(power===1?`(y − (${qstr(p[0])}))/(${qstr(p[power])})`:`${power}ª raiz de ((y − (${qstr(p[0])}))/(${qstr(p[power])}))${domain==='negative'&&power%2===0?', com sinal negativo':''}`,
            y=>{const t=(y-b)/a;if(power%2)return Math.sign(t)*Math.abs(t)**(1/power);if(t<0)return NaN;return (domain==='negative'?-1:1)*t**(1/power);},'Resolva y = axⁿ+b no domínio escolhido. A inversa é definida na imagem f(A); fora dela não recebe um valor.',(domain==='negative'&&power%2===0?'-':'')+(power===1?divide(subtract('y',p[0]),p[power]):`\\sqrt${power===2?'':`[${power}]`}{${divide(subtract('y',p[0]),p[power])}}`));
        }
      }
      const even=p.every((v,i)=>i%2===0||!sign(v)),odd=p.every((v,i)=>i%2===1||!sign(v));
      if(symmetric)report.parity=yes(even&&odd?'both':even?'even':odd?'odd':'neither','Em P(−x), os termos de grau par preservam o sinal e os de grau ímpar o trocam. Compare os coeficientes.');
    }else if(atom?.atom&&sign(atom.a)){
      const inner=polynomial(atom.atom.arg),name=atom.atom.name;
      if(inner?.length===2&&sign(inner[1])){
        const A=num(atom.a),D=num(atom.d),B=num(inner[1]),K=num(inner[0]),orientation=sign(atom.a)*sign(inner[1]),canonical=inner[1].n===inner[1].d&&!sign(inner[0]);
        const increasing=orientation>0?'increasing':'decreasing';
        const outerY=divide(subtract('y',atom.d),atom.a),undoInner=value=>divide(subtract(value,inner[0]),inner[1]);
        if(['exp','ln','sqrt','cbrt'].includes(name)){
          if(name==='exp'&&domain==='natural')report.parity=yes('neither','Uma exponencial afim não constante é injetora, portanto não é par. Ela tende a uma constante em um extremo e diverge no outro, o que também impede a identidade ímpar.');
          mono(increasing,'A função elementar é estritamente crescente no seu domínio; as mudanças afins de entrada e saída determinam o sentido.');
          if(domain==='natural')noPeriod('Uma função estritamente monótona não pode repetir a saída em x e x+T, para T > 0.');
          if(name==='ln'||name==='sqrt'){report.domain=`${dom.label}; exigir ${key(atom.atom.arg)} ${name==='ln'?'>':'≥'} 0`;if(K===0)symmetric=false;}
          const u=y=>(y-D)/A;
          if(name==='exp')inverse(`(ln((y − (${qstr(atom.d)}))/(${qstr(atom.a)})) − (${qstr(inner[0])}))/(${qstr(inner[1])})`,y=>u(y)>0?(Math.log(u(y))-K)/B:NaN,'A imagem exige (y−d)/a > 0. Logaritmo e exponencial se desfazem nesse domínio.',undoInner(`\\ln\\left(${outerY}\\right)`));
          if(name==='ln')inverse(`(exp((y − (${qstr(atom.d)}))/(${qstr(atom.a)})) − (${qstr(inner[0])}))/(${qstr(inner[1])})`,y=>(Math.exp(u(y))-K)/B,'Exponencie a igualdade e isole x. A fórmula usa a imagem do domínio escolhido.',undoInner(`e^{${outerY}}`));
          if(name==='sqrt')inverse(`(((y − (${qstr(atom.d)}))/(${qstr(atom.a)}))² − (${qstr(inner[0])}))/(${qstr(inner[1])})`,y=>u(y)>=0?(u(y)**2-K)/B:NaN,'Antes de elevar ao quadrado, exija (y−d)/a ≥ 0; a raiz quadrada é não negativa.',undoInner(`\\left(${outerY}\\right)^2`));
          if(name==='cbrt')inverse(`(((y − (${qstr(atom.d)}))/(${qstr(atom.a)}))³ − (${qstr(inner[0])}))/(${qstr(inner[1])})`,y=>(u(y)**3-K)/B,'A raiz cúbica real e o cubo se desfazem em toda a reta.',undoInner(`\\left(${outerY}\\right)^3`));
        }else if(['sin','cos','tan'].includes(name)){
          if(domain==='natural'){report.period=yes('periodic',`Um período é ${name==='tan'?'π':'2π'}/|${qstr(inner[1])}|. A translação do argumento preserva o domínio e os valores, também para a tangente.`);report.period.value=(name==='tan'?Math.PI:2*Math.PI)/Math.abs(B);}
          const restricted=canonical&&((name==='sin'&&domain==='sine')||(name==='cos'&&domain==='cosine')||(name==='tan'&&domain==='tangent'));
          if(restricted){mono(name==='cos'?(A>0?'decreasing':'increasing'):(A>0?'increasing':'decreasing'),'Neste intervalo canônico a função trigonométrica é estritamente monótona.');const inv=name==='sin'?Math.asin:name==='cos'?Math.acos:Math.atan;inverse(`${name==='sin'?'arcsin':name==='cos'?'arccos':'arctan'}((y − (${qstr(atom.d)}))/(${qstr(atom.a)}))`,y=>inv((y-D)/A),'A restrição escolhe um único ramo. Sem ela, a função trigonométrica periódica não é injetora.',`\\${name==='sin'?'arcsin':name==='cos'?'arccos':'arctan'}\\left(${outerY}\\right)`);}
          else if(['natural','positive','negative'].includes(domain)){mono('neither','As oscilações ou os saltos entre ramos impedem monotonicidade global neste domínio.');report.inverse=yes('none','Há entradas diferentes com a mesma saída. Restrinja a um ramo injetor para obter uma inversa.');}
        }else if(name==='abs'&&!sign(inner[0])){
          if(domain==='natural'){mono('neither','Entradas opostas têm a mesma saída.');noPeriod('O valor absoluto cresce sem limite nos dois extremos; translações sucessivas não mantêm o valor.');report.inverse=yes('none','A simetria x ↦ −x impede a injetividade em ℝ.');}
          else if(['positive','negative','cosine'].includes(domain)){const slopeQ=mul(atom.a,Q(inner[1].n<0n?-inner[1].n:inner[1].n,inner[1].d)),signed=domain==='negative'?neg(slopeQ):slopeQ,slope=num(signed);mono(sign(signed)>0?'increasing':'decreasing','O sinal de x está fixado; o módulo reduz-se a uma função afim.');inverse(`(y − (${qstr(atom.d)}))/(${qstr(signed)})`,y=>(y-D)/slope,'No domínio escolhido o módulo tem uma única expressão afim.',divide(subtract('y',atom.d),signed));}
        }else if(name==='floor'&&domain==='natural'){mono(orientation>0?'nondecreasing':'nonincreasing','O piso preserva a ordem no sentido não estrito e é constante em intervalos.');noPeriod('Nenhum deslocamento não nulo preserva o piso em todos os pontos; existe sempre um degrau atravessado por esse deslocamento.');report.inverse=yes('none','Cada degrau contém entradas distintas com a mesma saída.');}
      }
    }
    if(!p&&!atom?.atom){
      let numerator,denominator;
      if(ast.kind==='binary'&&ast.op==='/'){numerator=polynomial(ast.left);denominator=polynomial(ast.right);}
      if(ast.kind==='binary'&&ast.op==='^'){const exponent=polynomial(ast.right);if(exponent?.length===1&&exponent[0].n===-1n&&exponent[0].d===1n){numerator=[one];denominator=polynomial(ast.left);}}
      if(numerator?.length===1&&sign(numerator[0])&&denominator?.length===2&&sign(denominator[1])){
        const A=num(numerator[0]),B=num(denominator[1]),K=num(denominator[0]);
        report.domain=`${dom.label}; excluir x = ${-K/B}`;
        noPeriod(domain==='natural'?'O domínio exclui exatamente um polo. Uma translação não nula deslocaria esse polo, portanto não preservaria o domínio.':'O domínio restrito é não vazio e limitado em pelo menos um sentido. Nenhum T > 0 o preserva por todas as translações ±T.');
        if(domain==='natural')mono('neither','A função muda de ramo ao atravessar o polo; a monotonicidade em cada ramo não implica monotonicidade em todo o domínio.');
        if(!sign(denominator[0])&&['positive','negative','cosine'].includes(domain))mono(sign(numerator[0])*sign(denominator[1])>0?'decreasing':'increasing','No ramo de sinal fixado, comparar os recíprocos inverte a ordem; o coeficiente determina o sentido final.');
        inverse(`((${qstr(numerator[0])})/y − (${qstr(denominator[0])}))/(${qstr(denominator[1])})`,y=>y===0?NaN:(A/y-K)/B,'Resolver y = a/(bx+c) exige y ≠ 0. A fórmula retorna apenas entradas do domínio escolhido. A função é injetora mesmo quando não é globalmente monótona.',divide(subtract(`\\frac{${qtex(numerator[0])}}{y}`,denominator[0]),denominator[1]));
        if(domain!=='natural'&&!['sine','tangent'].includes(domain))report.parity=yes('not-applicable','O ramo selecionado não tem domínio simétrico.');
      }
    }
    if(!symmetric&&report.parity.status==='unknown'&&domain!=='natural'&&knownDomain)report.parity=yes('not-applicable','O domínio selecionado não é simétrico em relação a zero, condição exigida nesta aula.');
    else if(symmetric&&report.parity.status==='unknown'){const t=formalParity(ast);if(t!=='unknown')report.parity=yes(t,'A identidade de paridade resulta das regras algébricas e das identidades das funções elementares, em um domínio simétrico.');}
    if(!symmetric&&domain==='natural'&&naturalHalf)report.parity=yes('not-applicable','O domínio natural desta função afim sob logaritmo ou raiz é uma semirreta, não simétrica.');
    return report;
  }
  return Object.freeze({parse,evaluate,analyze,domains,toLatex});
});
