(function(){
var r=document.documentElement,b=document.getElementById('tg');
try{var s=localStorage.getItem('theme');if(s)r.dataset.theme=s;else if(matchMedia('(prefers-color-scheme: dark)').matches)r.dataset.theme='dark'}catch(e){}
function sync(){if(b)b.setAttribute('aria-label',r.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme')}sync();
if(b)b.onclick=function(){r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}sync()};
// Mobile menu: the links work without JS; this only opens and closes them (decision 9).
// The button text and aria-expanded always change together (decision 17).
var m=document.getElementById('menu'),l=document.getElementById('links');
function setMenu(open){if(!l||!m)return;l.classList.toggle('open',open);m.setAttribute('aria-expanded',open);m.textContent=open?'Close':'Menu'}
if(m)m.onclick=function(){setMenu(!l.classList.contains('open'))};
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&l&&l.classList.contains('open')){setMenu(false);m.focus()}
});
})();
