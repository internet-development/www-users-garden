import styles from '@components/WaterFrame.module.css';

import * as React from 'react';
import { createWater } from '@common/water';

export default function WaterFrame() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [available, setAvailable] = React.useState(false);
  const [generation, setGeneration] = React.useState(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let water: ReturnType<typeof createWater> | null = null;
    try {
      water = createWater(canvas);
      water.setPaused(motion.matches);
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
    const changeMotion = () => water?.setPaused(motion.matches);
    const lost = (event: Event) => {
      event.preventDefault();
      water?.dispose();
      water = null;
      setAvailable(false);
    };
    const restored = () => setGeneration((value) => value + 1);
    motion.addEventListener('change', changeMotion);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      water?.dispose();
      motion.removeEventListener('change', changeMotion);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [generation]);

  return (
    <figure className={styles.root}>
      <div className={styles.frame}>
        <img className={styles.image} src="/artwork/garden-frame.jpg" alt={available ? 'An angled view into a painted pond, with large, richly illustrated koi weaving between broad lily pads and ivory, rose, apricot, and lavender blooms, inside an ornate gold frame.' : 'A painting of doves in a blue sky, inside an ornate gold frame.'} width={1024} height={1024} />
        <canvas className={available ? styles.canvas : styles.hiddenCanvas} ref={canvasRef} aria-hidden="true" />
      </div>
    </figure>
  );
}
