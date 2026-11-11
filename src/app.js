document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    toggle.focus();
  }
});

// An abstract point cloud．This is procedural artwork，not survey data．
const canvas = document.querySelector('#point-cloud');
const ctx = canvas.getContext('2d');
if (ctx) {
  const draw = () => {
    const {width:w,height:h} = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(171,207,190,.09)';
    ctx.lineWidth = 1;
    for (let x=0;x<w;x+=42) {ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for (let y=0;y<h;y+=42) {ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    const scale = Math.min(w/110,h/96);
    for (let z=0;z<67;z++) for (let x=0;x<83;x++) {
      const xx=(x-41)/18, zz=(z-33)/18;
      const height = 16*Math.exp(-((xx+.6)**2*.8+(zz+.15)**2*.65)) + 9*Math.exp(-((xx-1.5)**2*1.7+(zz-.9)**2*1.9)) + 1.7*Math.sin(xx*2+zz*2);
      const px=w*.51+(x-41)*scale*.91+(z-33)*scale*.42;
      const py=h*.57+(z-33)*scale*.48-(x-41)*scale*.13-height*scale*1.6;
      const light=Math.min(1,height/23);
      ctx.fillStyle=`rgba(${Math.round(104+light*103)},${Math.round(158+light*67)},${Math.round(148-light*5)},${.4+light*.55})`;
      ctx.beginPath();ctx.arc(px,py,Math.max(.7,scale*.22),0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='rgba(204,229,186,.35)';
    const cx=w*.51,cy=h*.83;
    ctx.beginPath();ctx.moveTo(cx-13,cy);ctx.lineTo(cx+13,cy);ctx.moveTo(cx,cy-13);ctx.lineTo(cx,cy+13);ctx.stroke();
  };
  new ResizeObserver(draw).observe(canvas.parentElement);
}
