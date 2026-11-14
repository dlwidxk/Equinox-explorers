// El contenido es provisional; el equipo deberá completar y revisar cada dato y su fuente.
const phases = [
  { id: 'launch', title: 'Launch', image: 'img/launch.jpg', facts: ['[Placeholder fact about launch]', '[Placeholder fact about launch]'], source: 'PLACEHOLDER_SOURCE_URL' },
  { id: 'orbit', title: 'Orbit', image: 'img/orbit.jpg', facts: ['[Placeholder fact about orbit]', '[Placeholder fact about orbit]'], source: 'PLACEHOLDER_SOURCE_URL' },
  { id: 'life-on-board', title: 'Life on board', image: 'img/life-on-board.jpg', facts: ['[Placeholder fact about life on board]', '[Placeholder fact about life on board]'], source: 'PLACEHOLDER_SOURCE_URL' },
  { id: 'return', title: 'Return', image: 'img/return.jpg', facts: ['[Placeholder fact about return]', '[Placeholder fact about return]'], source: 'PLACEHOLDER_SOURCE_URL' }
];

// Cada situación tiene opciones con puntaje y una explicación que aparece al elegir.
const scenarios = {
  oxygen: {
    title: '[Placeholder scenario 1]',
    text: '[Placeholder emergency situation]',
    options: [
      { text: '[Placeholder choice A]', points: 10, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice B]', points: 3, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice C]', points: 0, explanation: '[Placeholder explanation]' }
    ]
  },
  power: {
    title: '[Placeholder scenario 2]',
    text: '[Placeholder emergency situation]',
    options: [
      { text: '[Placeholder choice A]', points: 10, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice B]', points: 2, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice C]', points: 0, explanation: '[Placeholder explanation]' }
    ]
  },
  solar: {
    title: '[Placeholder scenario 3]',
    text: '[Placeholder emergency situation]',
    options: [
      { text: '[Placeholder choice A]', points: 10, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice B]', points: 0, explanation: '[Placeholder explanation]' },
      { text: '[Placeholder choice C]', points: 2, explanation: '[Placeholder explanation]' }
    ]
  }
};

// Los umbrales siguen el puntaje acumulado de las tres situaciones.
const badges = [
  { name: 'Rookie', minScore: 0 },
  { name: 'Cadet', minScore: 15 },
  { name: 'Junior Astronaut', minScore: 25 }
];
