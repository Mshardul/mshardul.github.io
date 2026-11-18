(function(){
var r=document.documentElement,b=document.getElementById('tg');
try{var s=localStorage.getItem('theme');if(s)r.dataset.theme=s;else if(matchMedia('(prefers-color-scheme: dark)').matches)r.dataset.theme='dark'}catch(e){}
function sync(){if(b)b.setAttribute('aria-label',r.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme')}sync();
if(b)b.onclick=function(){r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}sync()};
var m=document.getElementById('menu'),l=document.getElementById('links');
function close(){if(l&&m){l.classList.remove('open');m.setAttribute('aria-expanded','false')}}
if(m)m.onclick=function(){var o=l.classList.toggle('open');m.setAttribute('aria-expanded',o)};
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();
