// React draws the decorative space scene; app.js still controls the mission.
const createElement = React.createElement;

function RocketArtwork() {
  return createElement(
    'svg',
    { viewBox: '0 0 100 100', role: 'presentation', focusable: 'false' },
    createElement('path', { className: 'rocket-flame', d: 'M50 82c-3 7-2 12 0 16 4-6 5-11 0-16Z' }),
    createElement('path', { className: 'rocket-fin', d: 'm35 64-14 15 20-3m24-12 14 15-20-3' }),
    createElement('path', { className: 'rocket-body', d: 'M50 8C35 22 31 43 34 70h32c3-27-1-48-16-62Z' }),
    createElement('circle', { className: 'rocket-window', cx: '50', cy: '43', r: '8' }),
    createElement('path', { className: 'rocket-fin', d: 'M34 61 25 75l12-3m29-11 9 14-12-3' })
  );
}

function SpaceScene() {
  const stars = [
    [8, 18, 2], [17, 72, 1.5], [29, 30, 1], [38, 84, 2], [47, 12, 1.5],
    [58, 68, 1], [68, 22, 2], [78, 78, 1.5], [89, 34, 1], [94, 61, 2],
    [12, 49, 1], [35, 9, 1.5], [73, 48, 1], [55, 91, 1.5], [24, 91, 1]
  ];

  return createElement(
    'div',
    { className: 'react-flight-scene' },
    createElement('div', { className: 'flight-orbit flight-orbit--wide' }),
    createElement('div', { className: 'flight-orbit flight-orbit--small' }),
    ...stars.map(([x, y, size], index) => createElement('span', {
      className: 'flight-star',
      key: index,
      style: { left: `${x}%`, top: `${y}%`, '--star-size': `${size}px`, '--twinkle-delay': `${index * -0.31}s` }
    })),
    createElement('div', { className: 'flight-rocket' }, createElement(RocketArtwork))
  );
}

// Keep the moving art behind the cards and out of the screen reader flow.
ReactDOM.createRoot(document.querySelector('#react-visual-root')).render(createElement(SpaceScene));
