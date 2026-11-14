// El nombre y el puntaje solo viven mientras la página está abierta.
const screens = document.querySelectorAll('.screen');
const phaseList = document.querySelector('#phase-list');
const phaseDetail = document.querySelector('#phase-detail');
const phaseProgress = document.querySelector('#phase-progress');
const emergencyButton = document.querySelector('#to-emergency-button');
const scenarioCard = document.querySelector('#scenario-card');
const scenarioProgress = document.querySelector('#scenario-progress');
const feedback = document.querySelector('#choice-feedback');
const nextButton = document.querySelector('#next-scenario-button');

let astronautName = '';
let openedPhases = new Set();
let scenarioList = Object.values(scenarios);
let scenarioIndex = 0;
let score = 0;
let resources = { energy: 100, oxygen: 100, shield: 100 };
let missionFailed = false;
let activePhase = null;
let factIndex = 0;

// Crea un beep corto con el navegador, sin cargar archivos de sonido.
function playFeedbackSound(isGood) {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.connect(volume);
    volume.connect(audio.destination);
    oscillator.frequency.value = isGood ? 660 : 220;
    volume.gain.setValueAtTime(0.08, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.18);
    oscillator.onended = () => audio.close();
  } catch (error) {
    // Si el navegador no permite sonido, el feedback visual sigue funcionando.
  }
}

function updateResourceBars() {
  Object.entries(resources).forEach(([resource, value]) => {
    const bar = document.querySelector(`#${resource}-bar`);
    const label = document.querySelector(`#${resource}-value`);
    const track = bar.closest('.meter-track');
    bar.style.width = `${value}%`;
    label.textContent = `${value}%`;
    track.setAttribute('aria-valuenow', String(value));
    track.classList.toggle('is-low', value <= 25);
  });
}

// Deja visible una sola pantalla a la vez.
function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.hidden = screen.id !== screenId;
  });
  document.querySelector(`#${screenId} h1`)?.focus();
}

function renderPhases() {
  phaseList.replaceChildren();
  phaseList.style.setProperty('--rocket-position', '0%');
  const rocketWrap = document.createElement('li');
  rocketWrap.className = 'phase-track__rocket-wrap';
  rocketWrap.setAttribute('aria-hidden', 'true');
  const rocket = document.createElement('span');
  rocket.className = 'phase-track__rocket';
  rocket.textContent = '🚀';
  rocketWrap.append(rocket);
  phaseList.append(rocketWrap);

  phases.forEach((phase) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'phase-button phase-track__stop';
    button.type = 'button';
    button.setAttribute('aria-selected', 'false');
    button.dataset.phaseId = phase.id;
    const icon = document.createElement('span');
    icon.className = 'phase-track__dot';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ({ launch: '🚀', orbit: '🪐', 'life-on-board': '🏠', return: '🌎' })[phase.id] || '⭐';
    const label = document.createElement('span');
    label.textContent = phase.title;
    button.append(icon, label);
    button.addEventListener('click', () => openPhase(phase, button));
    item.append(button);
    phaseList.append(item);
  });
  updatePhaseLocks();
}

// Solo habilita la siguiente fase pendiente; las anteriores se pueden repasar.
function updatePhaseLocks() {
  phaseList.querySelectorAll('.phase-track__stop').forEach((button, index) => {
    const isLocked = index > openedPhases.size;
    button.disabled = isLocked;
    if (isLocked) {
      button.title = 'Complete the earlier phase first';
    } else {
      button.removeAttribute('title');
    }
  });
}

function openPhase(phase, selectedButton) {
  const phaseIndex = phases.findIndex((item) => item.id === phase.id);
  if (phaseIndex > openedPhases.size) return;
  activePhase = phase;
  factIndex = 0;
  phaseList.querySelectorAll('.phase-track__stop').forEach((button) => {
    button.setAttribute('aria-selected', String(button === selectedButton));
  });
  renderPhaseFact();
}

// Muestra solo el dato actual, con su enlace y controles de avance.
function renderPhaseFact() {
  if (!activePhase) return;

  const fact = activePhase.facts[factIndex];
  phaseDetail.replaceChildren();
  phaseDetail.dataset.phase = activePhase.id;
  const heading = document.createElement('h2');
  heading.textContent = activePhase.title;
  phaseDetail.append(heading);

  if (activePhase.tagline) {
    const tagline = document.createElement('p');
    tagline.className = 'phase-tagline';
    tagline.textContent = activePhase.tagline;
    phaseDetail.append(tagline);
  }
  if (factIndex === 0 && activePhase.intro) {
    const intro = document.createElement('p');
    intro.className = 'phase-intro';
    intro.textContent = activePhase.intro;
    phaseDetail.append(intro);
  }

  const dots = document.createElement('ol');
  dots.className = 'fact-dots';
  dots.setAttribute('aria-label', `Fact ${factIndex + 1} of ${activePhase.facts.length}`);
  activePhase.facts.forEach((item, index) => {
    const dot = document.createElement('li');
    if (index === factIndex) {
      dot.className = 'is-current';
      dot.setAttribute('aria-current', 'step');
    }
    dot.setAttribute('aria-hidden', 'true');
    dots.append(dot);
  });
  phaseDetail.append(dots);

  const factCard = document.createElement('div');
  const animationName = ({
    launch: 'launch',
    orbit: 'orbit',
    'life-on-board': 'life',
    return: 'return'
  })[activePhase.id] || 'orbit';
  factCard.className = `fact-step fact-step--${animationName}`;
  factCard.setAttribute('aria-live', 'polite');
  const factText = document.createElement('p');
  factText.textContent = typeof fact === 'string' ? fact : fact.text;
  const animation = document.createElement('span');
  animation.className = 'fact-animation';
  animation.setAttribute('aria-hidden', 'true');
  animation.textContent = ({ launch: '🚀', orbit: '🪐', life: '🍎', return: '🪂' })[animationName];
  factCard.append(factText, animation);
  phaseDetail.append(factCard);

  const sourceName = typeof fact === 'string' ? activePhase.source : fact.source;
  const sourceUrl = typeof fact === 'string' ? '' : fact.url;
  if (sourceName) {
    const source = document.createElement('details');
    source.className = 'source-toggle';
    const summary = document.createElement('summary');
    summary.textContent = 'Source';
    const sourceText = document.createElement('p');
    if (sourceUrl) {
      const link = document.createElement('a');
      link.href = sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = sourceName;
      sourceText.append(link);
    } else {
      sourceText.textContent = sourceName;
    }
    source.append(summary, sourceText);
    phaseDetail.append(source);
  }

  const navigation = document.createElement('div');
  navigation.className = 'phase-navigation';
  const backButton = document.createElement('button');
  backButton.className = 'button phase-nav-button button-secondary';
  backButton.type = 'button';
  backButton.textContent = 'Back';
  backButton.disabled = factIndex === 0;
  backButton.addEventListener('click', () => {
    if (factIndex > 0) {
      factIndex -= 1;
      renderPhaseFact();
    }
  });

  const nextButton = document.createElement('button');
  nextButton.className = 'button button-primary phase-nav-button';
  nextButton.type = 'button';
  const isLastFact = factIndex === activePhase.facts.length - 1;
  nextButton.textContent = isLastFact ? 'Finish phase' : 'Next';
  nextButton.addEventListener('click', () => {
    if (isLastFact) {
      finishPhase();
    } else {
      factIndex += 1;
      renderPhaseFact();
    }
  });
  navigation.append(backButton, nextButton);
  phaseDetail.append(navigation);
}

function finishPhase() {
  if (!activePhase) return;
  openedPhases.add(activePhase.id);
  const phaseButton = phaseList.querySelector(`[data-phase-id="${activePhase.id}"]`);
  phaseButton?.classList.add('is-visited');
  updatePhaseLocks();
  const trackProgress = openedPhases.size / phases.length;
  phaseList.style.setProperty('--rocket-position', `${75 * trackProgress}%`);
  const completion = document.createElement('p');
  completion.className = 'phase-complete';
  completion.textContent = `${activePhase.title} complete! Choose another phase.`;
  phaseDetail.replaceChildren(completion);
  phaseProgress.textContent = `${openedPhases.size} of ${phases.length} phases completed`;
  emergencyButton.disabled = openedPhases.size !== phases.length;
}

function renderScenario() {
  const scenario = scenarioList[scenarioIndex];
  scenarioProgress.textContent = `Scenario ${scenarioIndex + 1} of ${scenarioList.length}`;
  scenarioCard.replaceChildren();

  const heading = document.createElement('h2');
  heading.textContent = scenario.title;
  const prompt = document.createElement('p');
  prompt.textContent = scenario.text;
  const options = document.createElement('div');
  options.className = 'scenario-options';

  scenario.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.type = 'button';
    button.textContent = option.text;
    button.addEventListener('click', () => chooseOption(option, options, button));
    options.append(button);
  });

  scenarioCard.append(heading, prompt, options);
  feedback.hidden = true;
  nextButton.hidden = true;
  nextButton.textContent = 'Next';
}

function chooseOption(option, options, selectedButton) {
  score += option.points;
  Object.entries(option.costs).forEach(([resource, cost]) => {
    resources[resource] = Math.max(0, resources[resource] - cost);
  });
  options.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
    button.classList.add(button === selectedButton ? (option.good ? 'choice-good' : 'choice-risky') : 'choice-muted');
  });
  updateResourceBars();
  missionFailed = Object.values(resources).some((value) => value === 0);
  feedback.textContent = `${option.explanation} You used ${Object.entries(option.costs).filter(([, cost]) => cost > 0).map(([resource, cost]) => `${cost}% ${resource}`).join(', ') || 'no supplies'}.`;
  feedback.classList.toggle('feedback-good', option.good);
  feedback.classList.toggle('feedback-risky', !option.good);
  playFeedbackSound(option.good);
  feedback.hidden = false;
  nextButton.hidden = false;
  nextButton.textContent = missionFailed ? 'See Mission Result' : 'Next';
  selectedButton.classList.add('choice-pop');
}

function showResult() {
  const earnedBadges = badges.filter((badge) => {
    if (badge.resource) return resources[badge.resource] >= badge.minimum;
    return score >= badge.minScore;
  });
  document.querySelector('#final-score').textContent = String(score);
  const outcome = document.querySelector('#mission-outcome');
  outcome.textContent = missionFailed
    ? 'Mission paused! One resource ran out. Review your choices and try again.'
    : 'Mission complete! Your crew kept every system running.';
  outcome.classList.toggle('outcome-failed', missionFailed);
  const badgeList = document.querySelector('#earned-badge');
  badgeList.replaceChildren();
  if (!earnedBadges.length) {
    const message = document.createElement('p');
    message.textContent = 'No medals this time. Play again and try a new strategy!';
    badgeList.append(message);
  }
  earnedBadges.forEach((badge) => {
    const medal = document.createElement('p');
    medal.className = 'badge';
    medal.textContent = `${badge.icon} ${badge.name}`;
    badgeList.append(medal);
  });
  document.querySelector('#diploma-name').textContent = astronautName || 'Junior Astronaut';
  showScreen('result-screen');
}

function startMission() {
  scenarioIndex = 0;
  score = 0;
  resources = { energy: 100, oxygen: 100, shield: 100 };
  missionFailed = false;
  scenarioList = Object.values(scenarios);
  updateResourceBars();
  renderScenario();
  showScreen('emergency-screen');
}

document.querySelector('#start-button').addEventListener('click', () => {
  astronautName = document.querySelector('#astronaut-name').value.trim();
  openedPhases = new Set();
  score = 0;
  resources = { energy: 100, oxygen: 100, shield: 100 };
  renderPhases();
  phaseProgress.textContent = `0 of ${phases.length} phases opened`;
  emergencyButton.disabled = true;
  showScreen('map-screen');
});

emergencyButton.addEventListener('click', () => {
  if (openedPhases.size !== phases.length) return;
  startMission();
});

nextButton.addEventListener('click', () => {
  if (missionFailed) {
    showResult();
    return;
  }
  scenarioIndex += 1;
  if (scenarioIndex < scenarioList.length) {
    renderScenario();
  } else {
    showResult();
  }
});

document.querySelector('#play-again-button').addEventListener('click', () => {
  openedPhases = new Set(phases.map((phase) => phase.id));
  startMission();
});

showScreen('start-screen');
