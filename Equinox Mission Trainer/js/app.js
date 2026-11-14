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

// Deja visible una sola pantalla a la vez.
function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.hidden = screen.id !== screenId;
  });
  document.querySelector(`#${screenId} h1`)?.focus();
}

function renderPhases() {
  phaseList.replaceChildren();

  phases.forEach((phase) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'phase-button';
    button.type = 'button';
    button.textContent = phase.title;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => openPhase(phase, button));
    item.append(button);
    phaseList.append(item);
  });
}

function openPhase(phase, selectedButton) {
  openedPhases.add(phase.id);
  phaseList.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button === selectedButton));
    if (button === selectedButton) button.classList.add('is-opened');
  });

  // Por ahora mostramos un recuadro; luego el equipo podrá agregar una imagen aprobada.
  phaseDetail.replaceChildren();
  const imagePlaceholder = document.createElement('div');
  imagePlaceholder.className = 'phase-image';
  imagePlaceholder.setAttribute('role', 'img');
  imagePlaceholder.setAttribute('aria-label', `Placeholder image for ${phase.title}`);
  imagePlaceholder.textContent = '[Phase image placeholder]';

  const heading = document.createElement('h2');
  heading.textContent = phase.title;
  const facts = document.createElement('ul');
  facts.className = 'phase-facts';
  phase.facts.forEach((fact) => {
    const factItem = document.createElement('li');
    factItem.textContent = fact;
    facts.append(factItem);
  });
  const source = document.createElement('p');
  source.textContent = `Source: ${phase.source}`;
  phaseDetail.append(imagePlaceholder, heading, facts, source);

  phaseProgress.textContent = `${openedPhases.size} of ${phases.length} phases opened`;
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
    button.addEventListener('click', () => chooseOption(option, options));
    options.append(button);
  });

  scenarioCard.append(heading, prompt, options);
  feedback.hidden = true;
  nextButton.hidden = true;
}

function chooseOption(option, options) {
  score += option.points;
  options.querySelectorAll('button').forEach((button) => { button.disabled = true; });
  feedback.textContent = `${option.explanation} (+${option.points} points)`;
  feedback.hidden = false;
  nextButton.hidden = false;
}

function showResult() {
  const earnedBadge = [...badges].reverse().find((badge) => score >= badge.minScore) || badges[0];
  document.querySelector('#final-score').textContent = String(score);
  document.querySelector('#earned-badge').textContent = `${earnedBadge.name} Badge`;
  document.querySelector('#diploma-name').textContent = astronautName || 'Junior Astronaut';
  showScreen('result-screen');
}

document.querySelector('#start-button').addEventListener('click', () => {
  astronautName = document.querySelector('#astronaut-name').value.trim();
  openedPhases = new Set();
  score = 0;
  renderPhases();
  phaseProgress.textContent = `0 of ${phases.length} phases opened`;
  emergencyButton.disabled = true;
  showScreen('map-screen');
});

emergencyButton.addEventListener('click', () => {
  if (openedPhases.size !== phases.length) return;
  scenarioIndex = 0;
  scenarioList = Object.values(scenarios);
  renderScenario();
  showScreen('emergency-screen');
});

nextButton.addEventListener('click', () => {
  scenarioIndex += 1;
  if (scenarioIndex < scenarioList.length) {
    renderScenario();
  } else {
    showResult();
  }
});

document.querySelector('#play-again-button').addEventListener('click', () => {
  document.querySelector('#astronaut-name').value = '';
  astronautName = '';
  showScreen('start-screen');
});

showScreen('start-screen');
