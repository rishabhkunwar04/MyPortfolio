// Each strand follows the same wave, with a phase offset across the ribbon
// so the bundle alternately opens into a fan and twists to a narrow edge.
export function drawSignalRibbon(
  ctx: CanvasRenderingContext2D, width: number, height: number,
  seconds: number, pointerX: number, pointerY: number,
) {
  ctx.clearRect(0, 0, width, height);
  const phase = seconds * .32;
  const strands = width < 640 ? 32 : 52;
  const steps = Math.ceil(width / 12);
  const color = ctx.createLinearGradient(0, height * .8, width, height * .2);
  color.addColorStop(0, '#ffaa70');
  color.addColorStop(.32, '#ff89b4');
  color.addColorStop(.65, '#b69aff');
  color.addColorStop(1, '#67dcf5');

  function yAt(x: number, strand: number) {
    const angle = x * 5.9 + .22 * Math.sin(phase) + pointerX * .16;
    const center = .48 + .31 * Math.cos(angle + .38);
    const twist = .15 * Math.sin(angle * 1.42 - phase * .65);
    const fold = .055 * Math.sin(angle * 1.8 + strand * 2 + phase);
    return height * (center + strand * twist + fold + pointerY * .035);
  }

  ctx.strokeStyle = color;
  for (let i = 0; i < strands; i++) {
    const strand = 2 * i / (strands - 1) - 1;
    ctx.globalAlpha = .38 + .32 * (1 + Math.cos(strand * Math.PI)) / 2;
    ctx.lineWidth = i % 8 === 0 ? 1.65 : .85;
    ctx.beginPath();
    for (let j = 0; j <= steps; j++) {
      const x = j / steps;
      if (j === 0) ctx.moveTo(0, yAt(x, strand));
      else ctx.lineTo(x * width, yAt(x, strand));
    }
    ctx.stroke();
  }

  // Small pulses travel along the strands rather than floating independently.
  ctx.fillStyle = '#fff4ed';
  for (let i = 0; i < 9; i++) {
    const x = (seconds * (.035 + i % 3 * .007) + i * .38197) % 1;
    const strand = -1 + 2 * ((i * 7) % strands) / (strands - 1);
    const y = yAt(x, strand);
    for (const radius of [5, 1.8]) {
      ctx.globalAlpha = radius === 5 ? .15 : .95;
      ctx.beginPath();
      ctx.arc(x * width, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
