// Each phase links to official sources for further learning.
const NASA_ISS_K4 = 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-k-4/';
const NASA_ISS_58 = 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-5-8/';
const NASA_FAQ = 'https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf';
const CSA_EATING = 'https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp';
const CSA_FOOD_TOOLKIT = 'https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/';
const NASA_CREW1_RETURN = 'https://www.nasa.gov/news-release/crew-1-astronauts-safely-splash-down-after-space-station-mission/';

const phases = [
  {
    id: 'launch',
    title: 'Launch',
    tagline: 'Three, two, one... blast off!',
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
      }
    ],
    image: 'img/launch.jpg',
    imageAlt: 'A SpaceX Falcon 9 rocket with its Crew Dragon spacecraft lifting off from Kennedy Space Center',
    imageCredit: 'Image Credit: NASA/Joel Kowsky',
    imageSourceUrl: 'https://www.nasa.gov/image-article/spacex-demo-1-launch-2/'
  },
  {
    id: 'orbit',
    title: 'Orbit',
    tagline: 'Welcome to your home above Earth!',
    facts: [
      { text: 'The International Space Station is a large spacecraft that circles Earth.', source: 'NASA, What Is the International Space Station? (Grades K-4)', url: NASA_ISS_K4 },
      { text: 'It travels about 17,500 miles per hour and circles Earth roughly every 90 minutes.', source: 'NASA, What Is the International Space Station? (Grades 5-8)', url: NASA_ISS_58 },
      { text: 'Astronauts see the Sun rise and set about 16 times each day.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ }
    ],
    image: 'img/orbit.jpg',
    imageAlt: 'The International Space Station above blue ocean and white clouds',
    imageCredit: 'Image Credit: NASA',
    imageSourceUrl: 'https://www.nasa.gov/image-detail/gmt297_flyover-3/'
  },
  {
    id: 'life-on-board',
    title: 'Life on board',
    tagline: 'Home sweet home in space!',
    facts: [
      { text: 'Astronauts exercise about two hours every day to help keep their bones and muscles strong.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'A standard space station menu includes three meals and one snack each day.', source: 'Canadian Space Agency, Eating in space', url: CSA_EATING },
      { text: 'The toolkit explores how food production in space connects to astronaut health and nutrition and may benefit people on Earth.', source: 'Canadian Space Agency, Food production toolkit', url: CSA_FOOD_TOOLKIT }
    ],
    savedOsdrExample: {
      title: 'Targeting myostatin/activin A protects against skeletal muscle and bone loss during spaceflight [plasma proteomics]',
      identifier: 'OSD-342',
      url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-342',
      note: 'This study was done with mice that flew to the space station.'
    },
    image: 'img/life-on-board.jpg',
    imageAlt: 'Two food trays with shrimp cocktail and sushi aboard the International Space Station',
    imageCredit: 'Image credit: NASA/Jonny Kim',
    imageSourceUrl: 'https://www.nasa.gov/image-article/dinner-is-served/'
  },
  {
    id: 'return',
    title: 'Return',
    tagline: 'Welcome back, Earth!',
    facts: [
      { text: 'Space station missions usually last about six months.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ },
      { text: 'Crew Dragon uses parachutes before it splashes down in the ocean.', source: 'NASA, Crew-1 Astronauts Safely Splash Down', url: NASA_CREW1_RETURN },
      { text: 'After returning to Earth, astronauts can feel dizzy or queasy while getting used to gravity again.', source: 'NASA, Astronaut FAQ (PDF)', url: NASA_FAQ }
    ],
    image: 'img/return.jpg',
    imageAlt: 'A SpaceX Crew Dragon capsule descending under four parachutes toward the Atlantic Ocean',
    imageCredit: 'Image credit: NASA/Cory Huston',
    imageSourceUrl: 'https://www.nasa.gov/image-article/spacex-demo-1-splashdown-recovery-i/'
  }
];

// These scenarios are teaching simulations inspired by real space station events. The choices and point values are a game, not real NASA procedures.
const scenarios = [
  {
    id: 'low-oxygen',
    title: 'A low oxygen warning',
    relatedPhase: 'life-on-board',
    hintFactIndex: 0,
    text: "Low oxygen in one cabin. What do you do first?",
    options: [
      { text: 'Check the backup sensor and crew checklist', points: 10, costs: { energy: 10, oxygen: 0, shield: 0 }, good: true, explanation: "Check the backup sensor before using supplies." },
      { text: 'Seal the cabin right away', points: 4, costs: { energy: 0, oxygen: 40, shield: 0 }, good: false, explanation: "Sealing the cabin uses oxygen before the crew checks the warning." },
      { text: 'Ignore the warning and keep working', points: 0, costs: { energy: 0, oxygen: 65, shield: 0 }, good: false, explanation: 'Ignoring the warning can put the crew at risk.' }
    ],
    realWorldNote: "The station's life support system makes oxygen by splitting water into oxygen and hydrogen.",
    sources: [
      { name: "NASA, Environmental Control and Life Support Systems (ECLSS)", url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss" }
    ]
  },
  {
    id: 'power-dip',
    title: 'A power dip',
    relatedPhase: 'life-on-board',
    hintFactIndex: 0,
    text: "Power is low. What should your crew do?",
    options: [
      { text: 'Turn off nonessential gear and follow the power plan', points: 10, costs: { energy: 5, oxygen: 0, shield: 5 }, good: true, explanation: "Save power for the systems the crew needs most." },
      { text: 'Keep every device running', points: 2, costs: { energy: 45, oxygen: 0, shield: 0 }, good: false, explanation: "Keeping every device on drains energy quickly." },
      { text: 'Use the emergency battery for everything', points: 0, costs: { energy: 60, oxygen: 0, shield: 0 }, good: false, explanation: 'The backup battery is limited. Save it for essential equipment.' }
    ],
    realWorldNote: "About half of the space station’s solar power made in daylight is stored in batteries for periods without sunlight.",
    sources: [
      { name: "NASA, New Solar Arrays to Power NASA's International Space Station Research", url: "https://www.nasa.gov/missions/station/new-solar-arrays-to-power-nasas-international-space-station-research/" }
    ]
  },
  {
    id: 'smoke-alarm',
    title: 'The smoke alarm is ringing',
    relatedPhase: 'life-on-board',
    hintFactIndex: 2,
    text: "The smoke alarm rings. What do you do?",
    options: [
      { text: 'Alert the crew and Mission Control, power down nearby gear, and follow the fire checklist.', points: 10, costs: { energy: 10, oxygen: 5, shield: 0 }, good: true, explanation: "Use a little energy and oxygen to follow the fire checklist." },
      { text: 'Wait a minute to see if the alarm stops by itself.', points: 3, costs: { energy: 0, oxygen: 30, shield: 0 }, good: false, explanation: "Waiting can waste valuable oxygen." },
      { text: 'Turn every fan up to blow the smoke away.', points: 0, costs: { energy: 30, oxygen: 15, shield: 0 }, good: false, explanation: 'Fans use resources; follow the fire checklist.' }
    ],
    realWorldNote: "Smoke detectors sit inside the station’s air system. An alert can make software stop airflow in that module.",
    sources: [
      { name: "NASA, Fire Protection technical brief (NASA-STD-3001)", url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf" }
    ]
  },
  {
    id: 'coolant-leak',
    title: "A cooling line is leaking",
    relatedPhase: 'life-on-board',
    hintFactIndex: 2,
    text: "A crew member spots a coolant leak outside. What first?",
    options: [
      { text: "Tell Mission Control and use the repair plan.", points: 10, costs: { energy: 10, oxygen: 5, shield: 0 }, good: true, explanation: "Report the leak and follow the repair plan." },
      { text: "Wait a day to see if the leak stops by itself.", points: 3, costs: { energy: 20, oxygen: 10, shield: 0 }, good: false, explanation: "Waiting uses supplies, and the crew still needs to report it." },
      { text: "Ignore the small leak.", points: 0, costs: { energy: 40, oxygen: 0, shield: 20 }, good: false, explanation: "Ignoring a leak uses up energy and shield resources while the problem grows." }
    ],
    realWorldNote: "In May 2013, a leak of ammonia coolant was found on the space station. Two NASA astronauts did a spacewalk of about five and a half hours to replace a pump controller box.",
    sources: [
      { name: "NASA, Repairing the Station in Orbit", url: "https://www.nasa.gov/image-article/repairing-station-orbit" }
    ]
  },
  {
    id: 'space-debris',
    title: 'Space junk may pass close to the station',
    relatedPhase: 'orbit',
    hintFactIndex: 1,
    text: "Space debris may pass close. What is your move?",
    options: [
      { text: 'Follow Mission Control’s plan: prepare to move or shelter in the docked spacecraft.', points: 10, costs: { energy: 15, oxygen: 0, shield: 0 }, good: true, explanation: "Mission Control’s plan gives the crew a clear next step." },
      { text: 'Try to grab the debris with the robotic arm.', points: 3, costs: { energy: 30, oxygen: 0, shield: 30 }, good: false, explanation: "Trying to grab debris costs lots of energy and shield." },
      { text: 'Do nothing and keep exercising.', points: 0, costs: { energy: 0, oxygen: 0, shield: 60 }, good: false, explanation: 'Doing nothing spends a lot of shield.' }
    ],
    realWorldNote: "The station sometimes fires its engines to dodge debris. If there is too little warning, the crew can shelter in a docked Soyuz spacecraft.",
    sources: [
      { name: "NASA, Station Maneuvers to Avoid Orbital Debris", url: "https://www.nasa.gov/blogs/spacestation/2025/04/30/station-maneuvers-to-avoid-orbital-debris" },
      { name: "Space.com, Station Astronauts Take Shelter from Space Debris", url: "https://www.space.com/6410-station-astronauts-shelter-space-debris.html" }
    ]
  },
  {
    id: 'solar-storm',
    title: 'A space weather alert',
    relatedPhase: 'orbit',
    hintFactIndex: 2,
    text: "A space weather alert is active. How do you protect the crew?",
    options: [
      { text: 'Move to the most shielded area and follow Mission Control’s checklist.', points: 10, costs: { energy: 0, oxygen: 5, shield: 10 }, good: true, explanation: "Follow the checklist and use a little oxygen and shield." },
      { text: 'Turn on every system just in case.', points: 3, costs: { energy: 40, oxygen: 0, shield: 10 }, good: false, explanation: "Turning on every system uses lots of energy." },
      { text: 'Stay near the window to watch the storm.', points: 0, costs: { energy: 0, oxygen: 0, shield: 60 }, good: false, explanation: 'Watching from the window does not protect the crew.' }
    ],
    realWorldNote: "Earth’s magnetic field and the station hull usually protect the crew. During strong storms, controllers may delay spacewalks or direct the crew to more shielded areas.",
    sources: [
      { name: "NASA Science, How NASA Will Protect Astronauts from Space Radiation", url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon" },
      { name: "Science Line, Astronauts will soon head deeper into space", url: "https://scienceline.org/2023/03/astronauts-will-soon-head-deeper-into-space-theyll-need-eyes-on-the-sun/" }
    ]
  },
  {
    id: 'comms-loss',
    title: 'The radio link with Mission Control drops',
    relatedPhase: 'launch',
    hintFactIndex: 1,
    text: "The Mission Control radio link is lost. What now?",
    options: [
      { text: 'Switch to the backup link and follow the communication checklist.', points: 10, costs: { energy: 10, oxygen: 0, shield: 0 }, good: true, explanation: "The backup link and checklist keep the crew organized." },
      { text: 'Take apart the radio to look for the problem.', points: 3, costs: { energy: 25, oxygen: 0, shield: 5 }, good: false, explanation: "Taking the radio apart uses resources." },
      { text: 'Stop all science work until the signal comes back.', points: 0, costs: { energy: 5, oxygen: 5, shield: 15 }, good: false, explanation: 'Stopping work does not restore the radio link.' }
    ],
    realWorldNote: "In February 2013, the station lost Mission Control contact for nearly three hours. Controllers used Russian ground stations and a backup computer to restore the link.",
    sources: [
      { name: "SpaceNews, NASA re-establishes contact with the space station", url: "https://spacenews.com/?p=12472" }
    ]
  }
];

// Badges reward different ways of completing the simulation.
const badges = [
  { name: 'Energy Master', resource: 'energy', minimum: 60, icon: '⚡' },
  { name: 'Oxygen Guardian', resource: 'oxygen', minimum: 60, icon: '💨' },
  { name: 'Shield Expert', resource: 'shield', minimum: 60, icon: '🛡️' },
  { name: 'Quick Thinker', minScore: 16, icon: '🌟' }
];

// Saved real DONKI record (solar flare of October 26, 2024), shown as "Example event" if the live request fails.
const savedSpaceWeatherExample = {
  type: 'Solar flare',
  dateTimeUtc: 'Oct 26, 2024, 6:32 AM UTC',
  detail: 'X1.8 class (peak at 7:19 AM UTC)',
  url: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/34206/1'
};