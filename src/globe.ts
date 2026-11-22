// Land samples derived from Natural Earth's public-domain 1:110m land polygons.
import landRows from './data/globe-land.json' with { type: 'json' };

type Point = { x: number; y: number; z: number };
const rad = Math.PI / 180;
function onSphere(lat: number, lon: number): Point {
  return { x: Math.cos(lat * rad) * Math.sin(lon * rad), y: Math.sin(lat * rad),
    z: Math.cos(lat * rad) * Math.cos(lon * rad) };
}
const land = landRows.flatMap(([lat, ...longitudes]) => longitudes.map(lon => onSphere(lat, lon)));
const hubs = [[19,73],[51,-.1],[1,104],[36,140],[37,-122],[41,-74],[-1,37],[-34,151],[-24,-47]]
  .map(([lat, lon]) => onSphere(lat, lon));

// Interpolate on the sphere, raising each route above the surface at its midpoint.
const routes = [[0,1],[0,2],[0,6],[1,5],[1,6],[2,3],[2,7],[3,4],[5,8],[4,5]].map(([a,b]) => {
  const start = hubs[a], end = hubs[b];
  const angle = Math.acos(start.x*end.x + start.y*end.y + start.z*end.z);
  return Array.from({length: 81}, (_, i) => {
    const t = i / 80;
    const height = (1 + Math.sin(t*Math.PI) * angle * .16) / Math.sin(angle);
    const s = height * Math.sin((1-t)*angle), e = height * Math.sin(t*angle);
    return {x:s*start.x + e*end.x, y:s*start.y + e*end.y, z:s*start.z + e*end.z};
  });
});

export function drawGlobe(ctx: CanvasRenderingContext2D, w: number, h: number, seconds: number, tiltX = 0, tiltY = 0) {
  const r = Math.min(w * .64, h * .58);
  const cx = w * .53, cy = h * .50;
  const spin = (.032 * seconds) - .92 + tiltX * .10;
  const pitch = .32 + tiltY * .08;
  const cos = Math.cos(spin), sin = Math.sin(spin), up = Math.cos(pitch), down = Math.sin(pitch);
  function project(p: Point) {
    const z = p.z*cos - p.x*sin;
    return {x: cx+r*(p.x*cos+p.z*sin), y:cy-r*(p.y*up-z*down), z:z*up+p.y*down};
  }
  function disc(x: number, y: number, radius: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, 2*Math.PI); ctx.fill();
  }
  ctx.fillStyle = '#101617'; ctx.fillRect(0,0,w,h);
  const halo = ctx.createRadialGradient(cx,cy,r*.95,cx,cy,r*1.25);
  halo.addColorStop(0,'#70beb425'); halo.addColorStop(.27,'#518e8c16'); halo.addColorStop(1,'#518e8c00');
  ctx.fillStyle = halo; ctx.fillRect(0,0,w,h);
  const shade = ctx.createRadialGradient(cx+r*.3,cy-r*.6,0,cx,cy,r);
  shade.addColorStop(0,'#214349'); shade.addColorStop(.72,'#132c30'); shade.addColorStop(1,'#244245');
  ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#81beb97a'; ctx.lineWidth = 1; ctx.stroke();

  const dot = Math.max(.75,r*.0051);
  ctx.fillStyle = '#7eb4ab';
  for (const point of land) {
    const p = project(point);
    if (p.z <= 0) continue;
    ctx.globalAlpha = .38 + .48*p.z;
    ctx.fillRect(p.x,p.y,dot*Math.max(.5,p.z),dot);
  }
  ctx.globalAlpha = 1;
  routes.forEach((route, index) => {
    const track = route.map(project);
    ctx.strokeStyle = '#f4ac7390'; ctx.lineWidth = 1;
    ctx.beginPath();
    track.forEach((point,i) => {
      if (point.z < 0) return;
      if (!i || track[i-1].z < 0) ctx.moveTo(point.x,point.y);
      else ctx.lineTo(point.x,point.y);
    });
    ctx.stroke();
    const head = (seconds*(.11 + index*.004) + index*.237) % 1 * 80;
    for (let tail=5; tail>=0; tail--) {
      const pos = Math.max(0, head-tail*.65);
      const a = track[Math.floor(pos)], b = track[Math.ceil(pos)];
      if (a.z < 0) continue;
      const t = pos % 1;
      const x = a.x+(b.x-a.x)*t, y = a.y+(b.y-a.y)*t;
      if (!tail) disc(x,y,5,'#ffc99e35');
      disc(x,y,tail ? 1.2 : 2.2, tail ? '#ffbc83aa' : '#fff4d5');
    }
  });
  hubs.forEach((hub, i) => {
    const p = project(hub);
    if (p.z < 0) return;
    const pulse = (seconds*.55+i*.19)%1;
    ctx.beginPath(); ctx.arc(p.x,p.y,4+pulse*9,0,2*Math.PI);
    ctx.strokeStyle = `rgba(255,193,140,${(1-pulse)*.6})`; ctx.stroke();
    disc(p.x,p.y,3,'#ffd3a8');
  });
}
