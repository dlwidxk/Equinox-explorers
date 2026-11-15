// The astronaut name and score stay in memory only while the page is open.
const screens = document.querySelectorAll('.screen');
const phaseList = document.querySelector('#phase-list');
const phaseDetail = document.querySelector('#phase-detail');
const phaseProgress = document.querySelector('#phase-progress');
const emergencyButton = document.querySelector('#to-emergency-button');
const scenarioCard = document.querySelector('#scenario-card');
const scenarioProgress = document.querySelector('#scenario-progress');
const feedback = document.querySelector('#choice-feedback');
const nextButton = document.querySelector('#next-scenario-button');
const missionDialog = document.querySelector('#mission-dialog');
const missionDialogTitle = document.querySelector('#mission-dialog-title');
const missionDialogMessage = document.querySelector('#mission-dialog-message');
const missionDialogAction = document.querySelector('#mission-dialog-action');
let missionDialogCallback = null;

let astronautName = '';
let openedPhases = new Set();
let scenarioList = [];
let scenarioIndex = 0;
let score = 0;
let resources = { energy: 100, oxygen: 100, shield: 100 };
let depletedResources = new Set();
let soundEnabled = true;
let musicEnabled = true;
let musicContext = null;
let musicOutput = null;
let musicTimer = null;
let musicNoteIndex = 0;
let activePhase = null;
let factIndex = 0;
let hintedScenarios = new Set();
let hintCounts = new Map();

// Create a short beep with the browser, without loading an audio file.
function playFeedbackSound(isGood) {
  if (!soundEnabled) return;
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
    // Visual feedback still works if the browser does not allow sound.
  }
}

function playSoundSequence(frequencies) {
  if (!soundEnabled) return;
  try {
    const audio = new AudioContext();
    frequencies.forEach((frequency, index) => {
      const startTime = audio.currentTime + index * 0.13;
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      volume.gain.setValueAtTime(0.0001, startTime);
      volume.gain.exponentialRampToValueAtTime(0.07, startTime + 0.025);
      volume.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.24);
      oscillator.connect(volume);
      volume.connect(audio.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
      oscillator.onended = () => {
        if (index === frequencies.length - 1) audio.close();
      };
    });
  } catch (error) {
    // The game remains usable if audio is unavailable.
  }
}

// Make a quiet space melody with Web Audio. Browsers may wait for the first user gesture.
function startBackgroundMusic() {
  if (!musicEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    musicContext ||= new AudioContextClass();

    const beginMelody = () => {
      if (!musicEnabled || musicTimer) return;
      musicOutput = musicContext.createGain();
      musicOutput.gain.setValueAtTime(0.055, musicContext.currentTime);
      musicOutput.connect(musicContext.destination);

      const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
      const playNote = () => {
        if (!musicEnabled || musicContext.state !== 'running') return;
        const now = musicContext.currentTime;
        const oscillator = musicContext.createOscillator();
        const volume = musicContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = notes[musicNoteIndex % notes.length];
        musicNoteIndex += 1;
        volume.gain.setValueAtTime(0.0001, now);
        volume.gain.exponentialRampToValueAtTime(0.18, now + 0.12);
        volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        oscillator.connect(volume);
        volume.connect(musicOutput);
        oscillator.start(now);
        oscillator.stop(now + 0.82);
      };

      playNote();
      musicTimer = window.setInterval(playNote, 850);
    };

    if (musicContext.state === 'running') beginMelody();
    else musicContext.resume().then(beginMelody).catch(() => {});
  } catch (error) {
    // The game remains usable if audio is unavailable.
  }
}

function stopBackgroundMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (musicOutput && musicContext) {
    musicOutput.gain.cancelScheduledValues(musicContext.currentTime);
    musicOutput.gain.setTargetAtTime(0.0001, musicContext.currentTime, 0.08);
    musicOutput = null;
  }
}

function unlockBackgroundMusic() {
  if (musicEnabled) startBackgroundMusic();
}

function getRank(points, maximumPoints) {
  const percentage = maximumPoints ? (points / maximumPoints) * 100 : 0;
  if (percentage >= 80) return 'Junior Astronaut';
  if (percentage >= 50) return 'Cadet';
  return 'Rookie';
}

function shuffleArray(items) {
  const shuffledItems = [...items];
  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }
  return shuffledItems;
}

function updatePlayerHud() {
  const maximumPoints = scenarioList.length * 10;
  document.querySelectorAll('.hud').forEach((hud) => {
    hud.querySelectorAll('.hud__name').forEach((name) => {
      name.textContent = astronautName || 'Junior Astronaut';
    });
    hud.querySelector('.hud__rank').textContent = getRank(score, maximumPoints);
  });
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

// Keep only one screen visible at a time.
function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.hidden = screen.id !== screenId;
  });
  document.querySelector(`#${screenId} h1`)?.focus();
}

function showMissionDialog(title, message, actionLabel, callback) {
  missionDialogTitle.textContent = title;
  missionDialogMessage.textContent = message;
  missionDialogAction.textContent = actionLabel;
  missionDialogCallback = callback;
  missionDialog.showModal();
  missionDialogAction.focus();
}

missionDialogAction.addEventListener('click', () => {
  const callback = missionDialogCallback;
  missionDialogCallback = null;
  missionDialog.close();
  callback?.();
});

missionDialog.addEventListener('cancel', () => {
  window.setTimeout(() => {
    if (document.querySelector('#result-screen').hidden) nextButton.focus();
    else document.querySelector('#result-title').focus();
  }, 0);
});

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
    button.removeAttribute('aria-current');
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

// Enable only the next unfinished phase; earlier phases can be reviewed.
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
    if (button === selectedButton) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
  renderPhaseFact();
}

// Show the current fact, its source link, and navigation controls.
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

  // Keep the image slot stable and show a phase emoji if the file is missing.
  // Use images.nasa.gov, copy credit lines exactly, avoid visible NASA logos and third-party copyrighted content, and keep JPG/WebP files under 250 KB at 1280 px wide.
  const phaseFigure = document.createElement('figure');
  phaseFigure.className = 'phase-figure';
  const phaseImage = document.createElement('img');
  phaseImage.className = 'phase-image';
  phaseImage.src = activePhase.image;
  phaseImage.alt = activePhase.imageAlt;
  phaseImage.loading = 'lazy';
  phaseImage.width = 1280;
  phaseImage.height = 720;
  const imagePlaceholder = document.createElement('span');
  imagePlaceholder.className = 'phase-image-placeholder';
  imagePlaceholder.setAttribute('role', 'img');
  imagePlaceholder.setAttribute('aria-label', `${activePhase.title} image unavailable`);
  imagePlaceholder.textContent = ({ launch: '🚀', orbit: '🪐', 'life-on-board': '🍎', return: '🪂' })[activePhase.id] || '⭐';
  imagePlaceholder.hidden = true;
  phaseImage.addEventListener('error', () => {
    phaseImage.hidden = true;
    imagePlaceholder.hidden = false;
  }, { once: true });

  const imageCaption = document.createElement('figcaption');
  imageCaption.className = 'image-credit';
  imageCaption.append(document.createTextNode(activePhase.imageCredit || 'TODO'));
  if (activePhase.imageSourceUrl && activePhase.imageSourceUrl !== 'TODO') {
    imageCaption.append(document.createTextNode(' '));
    const imageSourceLink = document.createElement('a');
    imageSourceLink.href = activePhase.imageSourceUrl;
    imageSourceLink.target = '_blank';
    imageSourceLink.rel = 'noopener noreferrer';
    imageSourceLink.textContent = 'Image source';
    imageCaption.append(imageSourceLink);
  }
  phaseFigure.append(phaseImage, imagePlaceholder, imageCaption);
  phaseDetail.append(phaseFigure);

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

  if (factIndex === activePhase.facts.length - 1 && activePhase.id === 'life-on-board') {
    const spotlight = createScienceSpotlightCard('Real NASA research on muscle and bone loss in space', 'Searching NASA OSDR...');
    phaseDetail.append(spotlight.card);
    loadOsdrSpotlight(spotlight, activePhase.savedOsdrExample);
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

  const phaseContinueButton = document.createElement('button');
  phaseContinueButton.className = 'button button-primary phase-nav-button';
  phaseContinueButton.type = 'button';
  const isLastFact = factIndex === activePhase.facts.length - 1;
  phaseContinueButton.textContent = isLastFact ? 'Finish phase' : 'Next';
  phaseContinueButton.addEventListener('click', () => {
    if (isLastFact) {
      finishPhase();
    } else {
      factIndex += 1;
      renderPhaseFact();
    }
  });
  navigation.append(backButton, phaseContinueButton);
  phaseDetail.append(navigation);
}

function finishPhase() {
  if (!activePhase) return;
  playSoundSequence([523.25, 659.25, 783.99]);
  completePhase(activePhase);
}

function appendFactSource(container, fact) {
  if (!fact.source || !fact.url || fact.url === 'TODO') return;
  const sourceLine = document.createElement('p');
  sourceLine.className = 'fact-source';
  sourceLine.append(document.createTextNode('Source: '));
  const link = document.createElement('a');
  link.href = fact.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = fact.source;
  sourceLine.append(link);
  container.append(sourceLine);
}

function completePhase(phase) {
  openedPhases.add(phase.id);
  const phaseButton = phaseList.querySelector(`[data-phase-id="${phase.id}"]`);
  phaseButton?.classList.add('is-visited');
  updatePhaseLocks();
  const trackProgress = openedPhases.size / phases.length;
  phaseList.style.setProperty('--rocket-position', `${75 * trackProgress}%`);
  const completion = document.createElement('p');
  completion.className = 'phase-complete';
  completion.textContent = `${phase.title} complete! Next stop unlocked.`;
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
  const hintCard = createTrainingHint(scenario);
  let weatherCard = null;
  if (scenario.id === 'solar-storm') {
    weatherCard = createSpaceWeatherCard();
  }
  const options = document.createElement('div');
  options.className = 'scenario-options';

  const shuffledOptions = shuffleArray(scenario.options);
  shuffledOptions.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.type = 'button';
    button.textContent = option.text;
    button.addEventListener('click', () => chooseOption(scenario, option, options, button));
    options.append(button);
  });

  scenarioCard.append(heading, prompt, hintCard);
  if (weatherCard) scenarioCard.append(weatherCard);
  scenarioCard.append(options);
  if (weatherCard) loadSpaceWeatherCard(weatherCard);
  feedback.hidden = true;
  nextButton.hidden = true;
  nextButton.textContent = 'Next';
}

function createTrainingHint(scenario) {
  const card = document.createElement('section');
  card.className = 'training-hint';
  const button = document.createElement('button');
  button.className = 'button training-hint-button';
  button.type = 'button';
  button.textContent = 'Training hint (-1 mission point)';
  const hintContent = document.createElement('div');
  hintContent.className = 'training-hint-content';
  hintContent.setAttribute('aria-live', 'polite');
  button.disabled = hintedScenarios.has(scenario.id);
  button.addEventListener('click', () => {
    if (hintedScenarios.has(scenario.id)) return;
    const phase = phases.find((item) => item.id === scenario.relatedPhase);
    const fact = phase?.facts[scenario.hintFactIndex];
    if (!phase || !fact) return;

    hintedScenarios.add(scenario.id);
    const previousScore = score;
    score = Math.max(0, score - 1);
    const deductedPoints = previousScore - score;
    const hintKey = `${phase.id}:${scenario.hintFactIndex}`;
    hintCounts.set(hintKey, (hintCounts.get(hintKey) || 0) + 1);
    updatePlayerHud();
    button.disabled = true;

    const message = document.createElement('p');
    message.textContent = deductedPoints
      ? 'Hint used. One mission point was deducted.'
      : 'Hint used. Your score is already at zero, so it stays at zero.';
    const factText = document.createElement('p');
    factText.textContent = fact.text;
    hintContent.replaceChildren(message, factText);
    appendFactSource(hintContent, fact);
  });
  card.append(button, hintContent);
  return card;
}

function createSpaceWeatherCard() {
  const card = document.createElement('section');
  card.className = 'space-weather-card';
  card.setAttribute('aria-labelledby', 'space-weather-title');

  const title = document.createElement('h3');
  title.id = 'space-weather-title';
  title.textContent = 'Live space weather';
  const status = document.createElement('p');
  status.className = 'space-weather-status';
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Contacting NASA...';
  const eventDetails = document.createElement('div');
  eventDetails.className = 'space-weather-details';
  const note = document.createElement('p');
  note.className = 'space-weather-note';
  note.textContent = 'DONKI data is experimental and shown here for learning, not for forecasting.';

  card.append(title, status, eventDetails, note);
  return card;
}

function createScienceSpotlightCard(description, statusText) {
  const card = document.createElement('section');
  card.className = 'science-spotlight';
  card.setAttribute('aria-labelledby', 'science-spotlight-title');
  const title = document.createElement('h3');
  title.id = 'science-spotlight-title';
  title.textContent = 'Science spotlight';
  const descriptionLine = document.createElement('p');
  descriptionLine.className = 'science-spotlight__description';
  descriptionLine.textContent = description;
  const status = document.createElement('p');
  status.className = 'science-spotlight__status';
  status.setAttribute('aria-live', 'polite');
  status.textContent = statusText;
  const content = document.createElement('div');
  content.className = 'science-spotlight__content';
  card.append(title, descriptionLine, status, content);
  return { card, status, content };
}

async function loadOsdrSpotlight(spotlight, savedExample) {
  try {
    const study = await getOsdrSpotlightStudy();
    spotlight.status.textContent = 'Study found in NASA OSDR.';
    renderOsdrStudy(spotlight.content, study, false);
  } catch (error) {
    spotlight.status.textContent = 'Live search is unavailable. Showing an Example study.';
    renderOsdrStudy(spotlight.content, savedExample, true);
  }
}

function renderOsdrStudy(container, study, isExample) {
  container.replaceChildren();
  if (isExample) {
    const exampleLabel = document.createElement('p');
    exampleLabel.className = 'science-spotlight__example';
    exampleLabel.textContent = 'Example';
    container.append(exampleLabel);
  }
  const studyTitle = document.createElement('p');
  studyTitle.className = 'science-spotlight__study-title';
  studyTitle.textContent = study.title;
  const identifier = document.createElement('p');
  identifier.textContent = `Study ID: ${study.identifier}`;
  const link = document.createElement('a');
  link.href = study.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open study';
  container.append(studyTitle);
  if (study.note) {
    const note = document.createElement('p');
    note.textContent = study.note;
    container.append(note);
  }
  container.append(identifier, link);
}

async function loadSpaceWeatherCard(card) {
  const status = card.querySelector('.space-weather-status');
  const details = card.querySelector('.space-weather-details');
  try {
    const event = await getLiveSpaceWeather();
    status.textContent = 'Latest event from NASA DONKI:';
    renderSpaceWeatherEvent(details, event, '');
  } catch (error) {
    status.textContent = 'NASA data is unavailable. Showing the saved example event.';
    renderSpaceWeatherEvent(details, savedSpaceWeatherExample, 'Example event');
  }
}

function renderSpaceWeatherEvent(container, event, label) {
  container.replaceChildren();
  if (label) {
    const labelLine = document.createElement('p');
    labelLine.className = 'space-weather-example';
    labelLine.textContent = label;
    container.append(labelLine);
  }

  [
    ['Event type', event.type],
    ['Date and time', event.dateTimeUtc],
    ['Class or detail', event.detail]
  ].forEach(([labelText, value]) => {
    if (!value || value === 'TODO') return;
    const line = document.createElement('p');
    line.textContent = `${labelText}: ${value}`;
    container.append(line);
  });

  if (event.url && event.url !== 'TODO') {
    const link = document.createElement('a');
    link.href = event.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'More info';
    container.append(link);
  }
}

function chooseOption(scenario, option, options, selectedButton) {
  const newlyDepleted = [];
  Object.entries(option.costs).forEach(([resource, cost]) => {
    const previousValue = resources[resource];
    resources[resource] = Math.max(0, resources[resource] - cost);
    if (previousValue > 0 && resources[resource] === 0 && !depletedResources.has(resource)) {
      depletedResources.add(resource);
      newlyDepleted.push(resource);
    }
  });
  const penalty = newlyDepleted.length * 5;
  score = Math.max(0, score + option.points - penalty);
  options.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
    button.classList.add(button === selectedButton ? (option.good ? 'choice-good' : 'choice-risky') : 'choice-muted');
  });
  updateResourceBars();
  updatePlayerHud();
  const supplyNote = Object.entries(option.costs).filter(([, cost]) => cost > 0).map(([resource, cost]) => `${cost}% ${resource}`).join(', ') || 'no supplies';
  const criticalNote = newlyDepleted.length
    ? ` Critical! ${newlyDepleted.join(' and ')} reached zero. A 5-point penalty was applied for each depleted resource.`
    : '';
  feedback.replaceChildren();
  const choiceSummary = document.createElement('p');
  choiceSummary.textContent = `${option.explanation} You used ${supplyNote}.${criticalNote}`;
  feedback.append(choiceSummary);

  const validSources = scenario.sources.filter((source) => (
    source.name && source.name !== 'TODO' && source.url && source.url !== 'TODO'
  ));
  if (scenario.realWorldNote && scenario.realWorldNote !== 'TODO' && validSources.length) {
    const realWorldLine = document.createElement('p');
    realWorldLine.append(document.createTextNode(`Real life: ${scenario.realWorldNote} `));
    validSources.forEach((source, index) => {
      if (index > 0) realWorldLine.append(document.createTextNode(', '));
      const sourceLink = document.createElement('a');
      sourceLink.href = source.url;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = source.name;
      realWorldLine.append(sourceLink);
    });
    feedback.append(realWorldLine);
  }
  feedback.classList.toggle('feedback-good', option.good);
  feedback.classList.toggle('feedback-risky', !option.good);
  playFeedbackSound(option.good);
  feedback.hidden = false;
  nextButton.hidden = false;
  nextButton.textContent = 'Next';
  selectedButton.classList.add('choice-pop');
  if (newlyDepleted.length) {
    const lostResources = newlyDepleted.map((resource) => `${resource[0].toUpperCase()}${resource.slice(1)}`).join(' and ');
    showMissionDialog('Resource depleted!', `Oh no! You lost ${lostResources}. Keep going and protect the other resources.`, 'Continue', () => nextButton.focus());
  }
}

function showResult() {
  const earnedBadges = badges.filter((badge) => {
    if (badge.resource) return resources[badge.resource] >= badge.minimum;
    return score >= badge.minScore;
  });
  const maximumPoints = scenarioList.length * 10;
  const finalRank = getRank(score, maximumPoints);
  document.querySelector('#final-score').textContent = String(score);
  document.querySelector('#score-total').textContent = String(maximumPoints);
  document.querySelector('#final-rank').textContent = `Rank: ${finalRank}`;
  const outcome = document.querySelector('#mission-outcome');
  outcome.textContent = 'Mission complete! You handled both emergencies.';
  playSoundSequence([523.25, 659.25, 783.99, 1046.5]);
  const badgeList = document.querySelector('#earned-badge');
  badgeList.replaceChildren();
  if (!earnedBadges.length) {
    const message = document.createElement('p');
    message.textContent = 'No medals yet. Try another flight!';
    badgeList.append(message);
  }
  earnedBadges.forEach((badge) => {
    const medal = document.createElement('p');
    medal.className = 'badge';
    medal.textContent = `${badge.icon} ${badge.name}`;
    badgeList.append(medal);
  });
  renderLearnedFacts();
  document.querySelector('#diploma-name').textContent = astronautName || 'Junior Astronaut';
  document.querySelector('#diploma-rank').textContent = finalRank;
  document.querySelector('#diploma-date').textContent = new Date().toLocaleDateString();
  showScreen('result-screen');
  const newBadge = earnedBadges[0];
  const rewardMessage = newBadge
    ? `You earned a new ${newBadge.name} badge. See it on your diploma.`
    : 'Your mission is complete. Your diploma is ready to view.';
  showMissionDialog('Congratulations!', rewardMessage, 'View my diploma', () => {
    const diplomaTitle = document.querySelector('#diploma-title');
    diplomaTitle.focus();
    diplomaTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function renderLearnedFacts() {
  const list = document.querySelector('#learned-facts');
  list.replaceChildren();
  const mostUsed = [...hintCounts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3);

  if (!mostUsed.length) {
    const message = document.createElement('li');
    message.textContent = 'No hints used. Try one next flight!';
    list.append(message);
    return;
  }

  mostUsed.forEach(([key, count]) => {
    const [phaseId, indexText] = key.split(':');
    const phase = phases.find((item) => item.id === phaseId);
    const fact = phase?.facts[Number(indexText)];
    if (!phase || !fact) return;
    const item = document.createElement('li');
    const phaseName = document.createElement('strong');
    phaseName.textContent = `${phase.title} · used ${count} ${count === 1 ? 'time' : 'times'}`;
    const factText = document.createElement('p');
    factText.textContent = fact.text;
    item.append(phaseName, factText);
    appendFactSource(item, fact);
    list.append(item);
  });
}

function startMission() {
  scenarioIndex = 0;
  score = 0;
  resources = { energy: 100, oxygen: 100, shield: 100 };
  depletedResources = new Set();
  hintedScenarios = new Set();
  hintCounts = new Map();
  const solarStorm = scenarios.find((scenario) => scenario.id === 'solar-storm');
  const otherScenarios = scenarios.filter((scenario) => scenario.id !== 'solar-storm');
  scenarioList = shuffleArray([solarStorm, ...shuffleArray(otherScenarios).slice(0, 1)]);
  updateResourceBars();
  updatePlayerHud();
  renderScenario();
  showScreen('emergency-screen');
}

document.querySelector('#start-button').addEventListener('click', () => {
  playSoundSequence([392, 523.25, 659.25]);
  astronautName = document.querySelector('#astronaut-name').value.trim();
  openedPhases = new Set();
  score = 0;
  resources = { energy: 100, oxygen: 100, shield: 100 };
  depletedResources = new Set();
  scenarioList = [];
  renderPhases();
  phaseProgress.textContent = `0 of ${phases.length} phases completed`;
  emergencyButton.disabled = true;
  updatePlayerHud();
  showScreen('map-screen');
});

emergencyButton.addEventListener('click', () => {
  if (openedPhases.size !== phases.length) return;
  startMission();
});

nextButton.addEventListener('click', () => {
  scenarioIndex += 1;
  if (scenarioIndex < scenarioList.length) {
    renderScenario();
  } else {
    showResult();
  }
});

document.querySelector('#sound-toggle').addEventListener('click', (event) => {
  soundEnabled = !soundEnabled;
  event.currentTarget.textContent = `Sound: ${soundEnabled ? 'On' : 'Off'}`;
  event.currentTarget.setAttribute('aria-pressed', String(soundEnabled));
});

document.querySelector('#music-toggle').addEventListener('click', (event) => {
  musicEnabled = !musicEnabled;
  event.currentTarget.textContent = `Music: ${musicEnabled ? 'On' : 'Off'}`;
  event.currentTarget.setAttribute('aria-pressed', String(musicEnabled));
  if (musicEnabled) startBackgroundMusic();
  else stopBackgroundMusic();
});

document.addEventListener('pointerdown', unlockBackgroundMusic, { once: true });
document.addEventListener('keydown', unlockBackgroundMusic, { once: true });

document.querySelector('#print-diploma-button').addEventListener('click', () => {
  window.print();
});

document.querySelector('#play-again-button').addEventListener('click', () => {
  openedPhases = new Set(phases.map((phase) => phase.id));
  startMission();
});

showScreen('start-screen');
startBackgroundMusic();