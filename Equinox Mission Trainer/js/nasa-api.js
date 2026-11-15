// The public DONKI API moved to CCMC on September 30, 2026.
// The response fields and request parameters were kept the same.
const DONKI_BASE_URL = 'https://ccmc.gsfc.nasa.gov/DONKI-API/get';
const DONKI_TIMEOUT_MS = 5000;

function shortenText(text, maxLength) {
  if (!text) return '';
  const cleanText = String(text).replace(/\s+/g, ' ').trim();
  return cleanText.length > maxLength ? `${cleanText.slice(0, maxLength - 1)}…` : cleanText;
}

// Get the latest solar flare or CME from the previous 30 days.
async function getLiveSpaceWeather() {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 30);
  const dateParams = new URLSearchParams({
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10)
  });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DONKI_TIMEOUT_MS);

  async function fetchEvents(endpoint) {
    const response = await fetch(`${DONKI_BASE_URL}/${endpoint}?${dateParams}`, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`DONKI request failed: ${response.status}`);
    const events = await response.json();
    if (!Array.isArray(events)) throw new Error('Unexpected DONKI response');
    return events;
  }

  try {
    // Keep usable data from one endpoint if the other endpoint is unavailable.
    const results = await Promise.allSettled([
      fetchEvents('FLR'),
      fetchEvents('CME')
    ]);
    if (results.every((result) => result.status === 'rejected')) {
      throw new Error('DONKI is unavailable');
    }
    const [flares, cmes] = results.map((result) => (
      result.status === 'fulfilled' ? result.value : []
    ));

    const events = [
      ...flares.map((event) => ({
        type: 'Solar flare',
        timestamp: event.beginTime,
        detail: event.classType ? `${event.classType} class` : '',
        url: event.link
      })),
      ...cmes.map((event) => ({
        type: 'Coronal mass ejection (CME)',
        timestamp: event.startTime,
        detail: shortenText(event.note, 140),
        url: event.link
      }))
    ].filter((event) => (
      event.timestamp && event.url && !Number.isNaN(Date.parse(event.timestamp))
    ));

    if (!events.length) throw new Error('DONKI returned no events');
    events.sort((first, second) => Date.parse(second.timestamp) - Date.parse(first.timestamp));
    const latest = events[0];
    return {
      type: latest.type,
      dateTimeUtc: `${new Date(latest.timestamp).toLocaleString('en-US', {
        timeZone: 'UTC',
        dateStyle: 'medium',
        timeStyle: 'short'
      })} UTC`,
      detail: latest.detail,
      url: latest.url
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
// Search the documented OSDR study API for a relevant spaceflight research record.
async function getOsdrSpotlightStudy() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  async function searchStudies(term) {
    const params = new URLSearchParams({ term, from: '0', size: '25', type: 'cgene' });
    const response = await fetch(`https://osdr.nasa.gov/osdr/data/search?${params}`, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`OSDR search failed: ${response.status}`);
    return response.json();
  }

  try {
    const results = await Promise.allSettled([
      searchStudies('exercise'),
      searchStudies('bone')
    ]);
    const records = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value.hits?.hits || [])
      .map((hit) => hit._source)
      .filter((study) => study && study['Study Title'] && study['Study Identifier'] && study['Authoritative Source URL']);

    const selectedStudy = records.find((study) => (
      /spaceflight/i.test(study['Project Type'] || '') && /bone|muscle/i.test(study['Study Title'])
    )) || records.find((study) => /spaceflight/i.test(study['Project Type'] || ''));
    if (!selectedStudy) throw new Error('OSDR search returned no matching studies');

    const studyUrl = new URL(
      selectedStudy['Authoritative Source URL'],
      'https://osdr.nasa.gov/bio/repo/data/studies/'
    );
    if (studyUrl.origin !== 'https://osdr.nasa.gov') throw new Error('Unexpected OSDR study link');

    return {
      title: selectedStudy['Study Title'],
      identifier: selectedStudy['Study Identifier'],
      url: studyUrl.href
    };
  } catch (error) {
    controller.abort();
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
