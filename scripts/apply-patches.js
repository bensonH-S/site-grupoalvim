const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "assets", "index-CgtScmUm.js");
let j = fs.readFileSync(file, "utf8");

const replacements = [
  [
    '{name:"CNM 1, Bloco K, Lojas 05E e 01C",region:"Ceilândia",lat:-15.8156,lng:-48.1108}',
    '{name:"CNM 1, Bloco K, Lojas 05E e 01C",region:"Ceilândia",lat:-15.8156,lng:-48.1108,brand:"popeyes"}',
  ],
  [
    '{to:"/sobre",label:"Sobre Nós"}',
    '{to:"/sobre#nossa-historia",label:"Sobre Nós"}',
  ],
  [
    's.pathname===u.to?"is-active":"text-foreground/70"',
    's.pathname===(u.to.split("#")[0]||u.to)?"is-active":"text-foreground/70"',
  ],
  [
    's.pathname===u.to?"is-active":"text-foreground/60"',
    's.pathname===(u.to.split("#")[0]||u.to)?"is-active":"text-foreground/60"',
  ],
  [
    'm.jsx(no,{to:"/sobre",className:"text-sm text-muted-foreground hover:text-primary transition-colors",children:"Sobre Nós"})',
    'm.jsx(no,{to:"/sobre#nossa-historia",className:"text-sm text-muted-foreground hover:text-primary transition-colors",children:"Sobre Nós"})',
  ],
  [
    'm.jsx("section",{className:"py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-background",children:m.jsxs("div",{className:"max-w-5xl mx-auto grid md:grid-cols-[1fr_0.8fr] gap-16 items-start",children:[m.jsxs("div",{children:[m.jsx("h2",{className:"text-3xl md:text-4xl font-extrabold text-foreground mb-10",children:"Nossa História"})',
    'm.jsx("section",{id:"nossa-historia",className:"nossa-historia-section py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-background",children:m.jsxs("div",{className:"max-w-5xl mx-auto grid md:grid-cols-[1fr_0.8fr] gap-16 items-start",children:[m.jsxs("div",{children:[m.jsx("h2",{className:"text-3xl md:text-4xl font-extrabold text-foreground mb-10",children:"Nossa História"})',
  ],
  [
    'OL=()=>{S.useEffect(function(){document.title="Grupo Alvim - Sobre Nós";return function(){document.title="Grupo Alvim Fast Food Holding"}},[]);return',
    'OL=()=>{S.useEffect(function(){document.title="Grupo Alvim - Sobre Nós";return function(){document.title="Grupo Alvim Fast Food Holding"}},[]);S.useEffect(function(){function h(){var id=(window.location.hash||"").replace("#","");if(id){var el=document.getElementById(id);el&&setTimeout(function(){el.scrollIntoView({behavior:"smooth",block:"start"})},300)}}h();window.addEventListener("hashchange",h);return function(){window.removeEventListener("hashchange",h)}},[]);return',
  ],
  [
    'm.jsx("p",{children:"A história do Grupo Alvim começa muito antes de sua fundação. Quando a família Alvim se mudou do Rio de Janeiro para Brasília, os cinco filhos se tornaram empreendedores no universo de cosméticos, construindo do zero uma rede de perfumarias que rapidamente se tornou referência no mercado local."})',
    'm.jsx("p",{children:"A história do Grupo Alvim começa antes mesmo da fundação oficial. Quando a família Alvim deixou o Rio de Janeiro e se instalou em Brasília, os cinco filhos entraram no mercado de cosméticos e construíram, com trabalho e dedicação, uma rede de perfumarias que se tornou referência na capital."})',
  ],
  [
    'm.jsx("p",{children:"Em 2001, Felipe Alvim — hoje presidente do Grupo — deu os primeiros passos de sua jornada profissional, organizando eventos e estagiando no negócio da família. Desde criança, carregava o sonho de ter restaurantes de fast food e proporcionar momentos marcantes na vida das pessoas."})',
    'm.jsx("p",{children:"Em 2001, Felipe Alvim, hoje presidente do Grupo, deu os primeiros passos na carreira organizando eventos e trabalhando no negócio da família. Desde criança, sonhava em ter restaurantes de fast food e criar experiências que ficassem na memória das pessoas."})',
  ],
  [
    'm.jsx("p",{children:"Foi em 2008 que esse sonho se materializou. Com empréstimos e sócios investidores, Felipe fundou o Grupo Alvim, inaugurando uma pizzaria e, logo depois, suas primeiras franquias de fast food — cuja expansão havia sido negociada ainda em 2007."})',
    'm.jsx("p",{children:"Em 2008, esse sonho virou empresa. Com apoio de investidores e muito empenho, Felipe fundou o Grupo Alvim, abriu uma pizzaria e, em seguida, as primeiras franquias de fast food. Parte dessa expansão já estava sendo preparada desde 2007."})',
  ],
  [
    'm.jsx("p",{children:"A visão se tornou realidade progressivamente: novos restaurantes foram inaugurados, unidades estratégicas foram adquiridas, e o grupo consolidou-se como uma das maiores operadoras de franquias do Centro-Oeste. Hoje, o Grupo Alvim opera mais de 20 restaurantes das marcas Burger King e Popeyes — com um planejamento arrojado para o futuro."})',
    'm.jsx("p",{children:"Com o tempo, o grupo ganhou escala: novas lojas, aquisições estratégicas e uma operação sólida no Centro-Oeste. Hoje, o Grupo Alvim administra mais de 20 restaurantes Burger King e Popeyes, com planos claros de crescimento para os próximos anos."})',
  ],
  [
    'm.jsx("img",{src:_h,alt:"Restaurante Burger King do Grupo Alvim",className:"rounded-3xl shadow-xl shadow-black/10 w-full object-cover aspect-[4/3]"})',
    'm.jsx("img",{src:N_,alt:"Whopper Burger King Grupo Alvim",className:"site-history-photo site-history-photo-main rounded-3xl shadow-xl shadow-black/10 w-full object-cover"})',
  ],
  [
    'm.jsx("img",{src:yh,alt:"Interior Burger King Grupo Alvim",className:"rounded-3xl shadow-xl shadow-black/10 w-full object-cover aspect-[4/3]"})',
    'm.jsx("img",{src:L_,alt:"Restaurante Burger King à noite",className:"site-history-photo site-history-photo-secondary rounded-3xl shadow-xl shadow-black/10 w-full object-cover"})',
  ],
  [
    '[{img:xL.url,label:"DF & Goiás",desc:"Coração da operação — onde nascemos e crescemos."},{img:NL.url,label:"Minas Gerais",desc:"Expansão estratégica consolidando nossa presença no Sudeste."}]',
    '[{img:"/assets/mapa-df-goias.jpg",label:"Distrito Federal & Goiás",desc:"Coração da operação — onde nascemos e crescemos."},{img:"/assets/mapa-minas-gerais.webp",label:"Minas Gerais",desc:"Expansão estratégica consolidando nossa presença no Sudeste."}]',
  ],
  [
    'className:"group bg-card rounded-3xl p-8 md:p-10 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",children:[m.jsx("div",{className:"aspect-square w-full max-w-[280px] mx-auto mb-6 flex items-center justify-center",children:m.jsx("img",{src:e.img,alt:`Mapa ${e.label}`,className:"max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"})',
    'className:"group site-presence-card rounded-3xl p-8 md:p-10 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",children:[m.jsx("div",{className:"site-presence-map aspect-square w-full max-w-[280px] mx-auto mb-6 flex items-center justify-center",children:m.jsx("img",{src:e.img,alt:`Mapa ${e.label}`,className:"site-presence-map-img max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"})',
  ],
  [
    'className:"store-modal-brand h-9 w-auto object-contain flex-shrink-0 opacity-90"',
    'className:"store-modal-brand w-auto object-contain flex-shrink-0 opacity-95"',
  ],
  [
    'const[e,t]=S.useState({name:"",email:"",phone:"",city:"",investment:"",experience:"",message:""}),[n,i]=S.useState(!1),s=u=>{t({...e,[u.target.name]:u.target.value})},a=u=>{u.preventDefault(),i(!0)}',
    'const[e,t]=S.useState({name:"",email:"",phone:"",city:"",investment:"",experience:"",message:""}),[n,i]=S.useState(!1),[l,d]=S.useState(!1),s=u=>{t({...e,[u.target.name]:u.target.value})},a=async u=>{u.preventDefault();if(l)return;d(!0);try{const c=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),f=await c.json().catch(()=>({}));if(!c.ok)throw new Error(f.error||"Erro ao enviar mensagem.");zP.success("Mensagem enviada com sucesso! Entraremos em contato em breve."),t({name:"",email:"",phone:"",city:"",investment:"",experience:"",message:""}),i(!0)}catch(c){zP.error(c.message||"Não foi possível enviar. Tente novamente.")}finally{d(!1)}}',
  ],
  [
    'whenReady:function(b){try{var M=b.target||b;M.scrollWheelZoom&&M.scrollWheelZoom.disable();M.getContainer().addEventListener("wheel",function(N){if(N.ctrlKey){N.preventDefault(),N.stopPropagation();var H=N.deltaY>0?-1:1;M.setZoom(M.getZoom()+H)}},{passive:!1})}catch(e){}}',
    'whenReady:function(b){try{var M=b.target||b;M.scrollWheelZoom&&M.scrollWheelZoom.disable();var mob=window.innerWidth<768;if(mob){M.touchZoom&&M.touchZoom.disable();M.doubleClickZoom&&M.doubleClickZoom.disable()}function syncView(){try{M.invalidateSize({pan:false});var center=[-15.793,-47.882],z=10;if(window.innerWidth<1536){var sz=M.getSize(),rw=1200,rh=480,r=Math.min(sz.x/rw,sz.y/rh);if(r>0&&r<1)z=Math.max(4,Math.round((10+Math.log(r)/Math.LN2)*10)/10)}M.setView(center,z,{animate:false})}catch(e){}}syncView();setTimeout(syncView,100);setTimeout(syncView,450);window.addEventListener("resize",function(){clearTimeout(M._siteFitT);M._siteFitT=setTimeout(syncView,200)},{passive:!0});M.getContainer().addEventListener("wheel",function(N){if(N.ctrlKey){N.preventDefault(),N.stopPropagation();var H=N.deltaY>0?-1:1;M.setZoom(M.getZoom()+H)}},{passive:!1})}catch(e){}}',
  ],
  [
    'whenReady:function(b){try{var M=b.target||b;M.scrollWheelZoom&&M.scrollWheelZoom.disable();var mob=window.innerWidth<768;if(mob){M.touchZoom&&M.touchZoom.disable();M.doubleClickZoom&&M.doubleClickZoom.disable()}function fitAll(){try{M.invalidateSize();var pts=Uc.map(function(u){return[u.lat,u.lng]});var pad=mob?[10,10]:[28,28];var mz=mob?4:window.innerWidth<1536?6:7;if(window.innerWidth<1536){M.fitBounds(pts,{padding:pad,maxZoom:mz})}}catch(z){if(window.innerWidth<1536)M.setZoom(mob?4:6)}}if(window.innerWidth<1536){fitAll();setTimeout(fitAll,150);setTimeout(fitAll,500);window.addEventListener("resize",function(){clearTimeout(M._siteFitT);M._siteFitT=setTimeout(fitAll,200)},{passive:!0})}M.getContainer().addEventListener("wheel",function(N){if(N.ctrlKey){N.preventDefault(),N.stopPropagation();var H=N.deltaY>0?-1:1;M.setZoom(M.getZoom()+H)}},{passive:!1})}catch(e){}}',
    'whenReady:function(b){try{var M=b.target||b;M.scrollWheelZoom&&M.scrollWheelZoom.disable();var mob=window.innerWidth<768;if(mob){M.touchZoom&&M.touchZoom.disable();M.doubleClickZoom&&M.doubleClickZoom.disable()}function syncView(){try{M.invalidateSize({pan:false});var center=[-15.793,-47.882],z=10;if(window.innerWidth<1536){var sz=M.getSize(),rw=1200,rh=480,r=Math.min(sz.x/rw,sz.y/rh);if(r>0&&r<1)z=Math.max(4,Math.round((10+Math.log(r)/Math.LN2)*10)/10)}M.setView(center,z,{animate:false})}catch(e){}}syncView();setTimeout(syncView,100);setTimeout(syncView,450);window.addEventListener("resize",function(){clearTimeout(M._siteFitT);M._siteFitT=setTimeout(syncView,200)},{passive:!0});M.getContainer().addEventListener("wheel",function(N){if(N.ctrlKey){N.preventDefault(),N.stopPropagation();var H=N.deltaY>0?-1:1;M.setZoom(M.getZoom()+H)}},{passive:!1})}catch(e){}}',
  ],
  [
    'style:{height:"480px",width:"100%"}',
    'style:{height:"100%",width:"100%"}',
  ],
  [
    'u.to===s.pathname?setTimeout(p,250):null};return m.jsxs("nav"',
    'if(u.to===s.pathname){p()}else if(u.scroll){window.scrollTo({top:0,behavior:"auto"});window.gaRunScroll&&window.gaRunScroll()}};return m.jsxs("nav"',
  ],
  [
    'S.useEffect(function(){window.gaRunScroll&&window.gaRunScroll();setTimeout(function(){window.gaRunScroll&&window.gaRunScroll()},500);setTimeout(function(){window.gaRunScroll&&window.gaRunScroll()},1200)},[]);return m.jsxs("div",{className:"min-h-screen",children:[m.jsx(vh,{}),m.jsxs("section",{className:"relative min-h-[80vh]',
    'S.useEffect(function(){window.gaRunScroll&&window.gaRunScroll()},[]);return m.jsxs("div",{className:"min-h-screen",children:[m.jsx(vh,{}),m.jsxs("section",{className:"relative min-h-[80vh]',
  ],
  [
    'const p=()=>{if(u.scroll==="top")window.scrollTo({top:0,behavior:"smooth"});else if(u.scroll){const v=document.getElementById(u.scroll);v&&v.scrollIntoView({behavior:"smooth",block:"start"});sessionStorage.removeItem("ga-scroll")}}',
    'const p=()=>{if(u.scroll==="top"){window.scrollTo({top:0,behavior:"auto"});sessionStorage.removeItem("ga-scroll")}else if(u.scroll){sessionStorage.setItem("ga-scroll",u.scroll);window.gaRunScroll&&window.gaRunScroll()}}',
  ],
  [
    'm.jsx("button",{undefined})',
    'm.jsx("button",{type:"submit",disabled:l,className:"w-full bg-primary text-primary-foreground py-4 rounded-full text-sm font-semibold uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none",children:l?"Enviando...":"Enviar Formulário"})',
  ],
];

let ok = 0;
let fail = 0;

for (const [from, to] of replacements) {
  if (!j.includes(from)) {
    console.error("MISSING:", from.slice(0, 80) + "...");
    fail++;
    continue;
  }
  j = j.replace(from, to);
  ok++;
}

fs.writeFileSync(file, j);
console.log(`Patches: ${ok} ok, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
