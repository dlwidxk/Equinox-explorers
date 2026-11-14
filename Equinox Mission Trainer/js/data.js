// Las fases enlazan fuentes oficiales para que niñas y niños puedan seguir aprendiendo.
const NASA_ISS_K4 = 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-k-4/';
const NASA_ISS_58 = 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-5-8/';
const NASA_FAQ = 'https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf';
const CSA_EATING = 'https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp';
const NASA_CREW1_RETURN = 'https://www.nasa.gov/news-release/crew-1-astronauts-safely-splash-down-after-space-station-mission/';

const phases = [
  {
    id: 'launch',
    title: 'Launch',
    tagline: 'Three, two, one... blast off!',
    intro: 'Every space mission starts with a launch. Let\'s see what happens before and after liftoff.',
    facts: [
      {
        text: 'NASA astronauts blast off from Florida on rockets and spaceships built with business partners.',
        source: 'NASA, What Is the Commercial Crew Program? (Grades K-4)',
        url: 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-commercial-crew-program-grades-k-4/'
      },
      {
        text: 'Spaceships like SpaceX\'s Crew Dragon carry astronauts to the space station.',
        source: 'NASA, What Is the Commercial Crew Program? (Grades K-4)',
        url: 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-commercial-crew-program-grades-k-4/'
      },
      {
        text: 'In a Soyuz launch, the crew climbs in about two and a half hours before liftoff.',
        source: 'NASA, Astronaut FAQ (PDF)',
        url: 'https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf'
      },
      {
        text: 'The engines rumble and shake the capsule, and astronauts feel a strong push called g-load.',
        source: 'NASA, Astronaut FAQ (PDF)',
        url: 'https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf'
      },
      {
        text: 'About eight and a half minutes after a Soyuz launch, the crew is in space and everything floats!',
        source: 'NASA, Astronaut FAQ (PDF)',
        url: 'https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf'
      }
    ],
    image: 'img/launch.jpg',
    imageAlt: 'A rocket lifting off',
    imageCredit: 'TODO: copy the credit line from the image page'
  },
  {
    id: 'orbit',
    title: 'Orbit',
    tagline: 'Welcome to your home above Earth!',
    intro: 'You made it to space! Now let\'s see how the space station travels around our planet.',
    facts: [
      { text: 'The International Space Station is a large spacecraft that circles Earth.', source: 'NASA, What Is the International Space Station? (Grades K-4)', url: NASA_ISS_K4 },
      { text: 'It orbits about 250 miles above Earth.', source: 'NASA, What Is the International Space Station? (Grades K-4)', url: NASA_ISS_K4 },
      { text: 'It travels about 17,500 miles per hour and circles Earth roughly every 90 minutes.', source: 'NASA, What Is the International Space Station? (Grades 5-8)', url: NASA_ISS_58 },
      { text: 'Astronauts see the Sun rise and set about 16 times each day.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'People have lived on the space station every day since 2000.', source: 'NASA, What Is the International Space Station? (Grades K-4)', url: NASA_ISS_K4 }
    ],
    image: 'img/orbit.jpg',
    imageAlt: 'The International Space Station above Earth',
    imageCredit: 'TODO: copy the credit line from the image page'
  },
  {
    id: 'life-on-board',
    title: 'Life on board',
    tagline: 'Home sweet home in space!',
    intro: 'Living in space is different from living on Earth. Here are a few parts of an astronaut\'s day.',
    facts: [
      { text: 'Astronauts exercise about two hours every day to help keep their bones and muscles strong.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'A standard space station menu includes three meals and one snack each day.', source: 'Canadian Space Agency, Eating in space', url: CSA_EATING },
      { text: 'Space food is packed to be compact, lightweight, and low in crumbs.', source: 'Canadian Space Agency, Eating in space', url: CSA_EATING },
      { text: 'When astronauts first arrive, a stuffy feeling in the head can make food seem bland.', source: 'Canadian Space Agency, Eating in space', url: CSA_EATING },
      { text: 'A small Velcro dot helps keep food packages from floating away.', source: 'Canadian Space Agency, Eating in space', url: CSA_EATING }
    ],
    image: 'img/life-on-board.jpg',
    imageAlt: 'Packaged space food',
    imageCredit: 'TODO: copy the credit line from the image page'
  },
  {
    id: 'return',
    title: 'Return',
    tagline: 'Welcome back, Earth!',
    intro: 'Your mission is almost done. It is time for the crew to come home.',
    facts: [
      { text: 'Space station missions usually last about six months.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'Crew Dragon uses parachutes before it splashes down in the ocean.', source: 'NASA, Crew-1 Astronauts Safely Splash Down', url: NASA_CREW1_RETURN },
      { text: 'After returning to Earth, astronauts can feel dizzy or queasy while getting used to gravity again.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'After a two-week flight, readjusting to gravity may take a day or two.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'After a six-month flight, feeling normal again may take several weeks.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ }
    ],
    image: 'img/return.jpg',
    imageAlt: 'A space capsule returning to Earth under parachutes',
    imageCredit: 'TODO: copy the credit line from the image page'
  }
];

// Estos escenarios son simulaciones ficticias para practicar decisiones, no datos de NASA.
const scenarios = {
  oxygen: {
    title: 'A low oxygen warning',
    text: 'A sensor shows a low oxygen reading in one cabin. What should your crew do first?',
    options: [
      { text: 'Check the backup sensor and follow the crew checklist', points: 10, costs: { energy: 10, oxygen: 0, shield: 0 }, good: true, explanation: 'Good call! Checking the reading can avoid wasting supplies. The crew uses a little energy to investigate.' },
      { text: 'Seal the cabin right away', points: 4, costs: { energy: 0, oxygen: 40, shield: 0 }, good: false, explanation: 'That may isolate the problem, but it uses valuable oxygen before the crew confirms the warning.' },
      { text: 'Ignore the warning and keep working', points: 0, costs: { energy: 0, oxygen: 65, shield: 0 }, good: false, explanation: 'A warning needs attention. Waiting too long can put the crew at risk and drain oxygen.' }
    ]
  },
  power: {
    title: 'A power dip',
    text: 'The ship has less power than expected. Choose how to protect the most important systems.',
    options: [
      { text: 'Switch off nonessential equipment and check the power plan', points: 10, costs: { energy: 5, oxygen: 0, shield: 5 }, good: true, explanation: 'Smart thinking! Saving power protects key systems. The shield uses a little energy while the crew checks the plan.' },
      { text: 'Keep every device running', points: 2, costs: { energy: 45, oxygen: 0, shield: 0 }, good: false, explanation: 'Keeping everything on feels helpful, but it drains energy quickly.' },
      { text: 'Use the emergency battery for everything', points: 0, costs: { energy: 60, oxygen: 0, shield: 0 }, good: false, explanation: 'The backup battery is limited. Saving it for essential equipment keeps more options open.' }
    ]
  },
  solar: {
    title: 'A storm alert',
    text: 'A space weather alert appears in this fictional training scenario. How will you protect the crew?',
    options: [
      { text: 'Move to the protected area and follow the safety checklist', points: 10, costs: { energy: 0, oxygen: 5, shield: 10 }, good: true, explanation: 'Crew safety comes first. Using the protected area costs some shield and oxygen supplies.' },
      { text: 'Stay by the window to watch what happens', points: 0, costs: { energy: 0, oxygen: 0, shield: 100 }, good: false, explanation: 'Watching from the window does not protect the crew. The ship loses shield resources while waiting.' },
      { text: 'Turn on every system just in case', points: 3, costs: { energy: 45, oxygen: 0, shield: 10 }, good: false, explanation: 'Extra systems use energy. A safety checklist helps the crew choose what really needs power.' }
    ]
  }
};

// Las medallas premian distintas maneras de completar la simulación.
const badges = [
  { name: 'Energy Master', resource: 'energy', minimum: 60, icon: '⚡' },
  { name: 'Oxygen Guardian', resource: 'oxygen', minimum: 60, icon: '💨' },
  { name: 'Shield Expert', resource: 'shield', minimum: 60, icon: '🛡️' },
  { name: 'Quick Thinker', minScore: 25, icon: '🌟' }
];
