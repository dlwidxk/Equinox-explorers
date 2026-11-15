# Equinox Mission Trainer (working title)

A kid-friendly web app that trains junior astronauts for a mission to the International Space Station. Built by the Equinox Explorers team for the NASA Space Apps Challenge 2026, challenge "Build a Junior Astronaut Mission Trainer".

**This is an independent student project. It is not an official NASA product, and NASA does not endorse it.**

## What it does

Kids aged 8-12 learn how a space mission works, then practice making decisions in space emergencies.

1. **Start screen:** the player types an astronaut name (it is never saved or sent anywhere).
2. **Mission map (learn):** four phases of a mission - Launch, Orbit, Life on board, Return. Each phase has an image with its credit and exactly three short facts with sources, shown one at a time with Back and Next controls. There is no end-of-phase quiz; finishing the facts unlocks the next phase.
3. **Emergency simulator (practice):** every run has **2 emergencies: the solar storm scenario (always) plus 1 random one** from the other 6 scenarios. Each choice spends some Energy, Oxygen, or Shield. Options are shuffled, and quick feedback explains the choice with a short "Real life" note and its source.
4. **Training hints:** once per scenario, a player can spend 1 mission point to see a fact from the Mission Map that helps with the emergency.
5. **Real NASA data:** the solar storm scenario shows the most recent solar flare or coronal mass ejection from NASA DONKI. The Life on board phase shows a "Science spotlight" from NASA OSDR.
6. **Results:** mission points (out of 20), badges, a rank (Rookie, Cadet or Junior Astronaut), a "What you learned" list, and a printable diploma with the player's name.

## Run it

- **Online:** TODO add the GitHub Pages link here.
- **On your computer:** download or clone this repository and open `index.html` in a web browser. No installation is needed.
- **Without internet:** the app works offline. If NASA data cannot be loaded (no connection, a blocked request, or no answer within 5 seconds), the solar storm card shows a saved real event labeled **"Example event"** and the Science spotlight shows a saved real study labeled **"Example"**.

## Built with

Plain HTML and CSS with vanilla JavaScript for the game logic. React 18 is included locally for the decorative space scene; there is no build step, backend, or database. The page works offline and can be opened directly as `index.html`. The app uses system fonts already installed on the player's device.

## Project structure

```
AGENTS.md               Project constraints and working agreement
README.md               Project overview, data sources, and remaining setup items
index.html              Screens of the app
css/style.css           Styles and kid-friendly "mission control" theme
js/data.js              Content only: phases, facts, scenarios, badges, saved examples
js/nasa-api.js          NASA API requests (DONKI, OSDR) with a 5-second timeout
js/app.js               Game logic: screens, score, meters, rank
js/react-visuals.js     React component for the animated space scene
js/vendor/              Local React 18 runtime and its MIT license
img/                    Images (credits listed below)
```

React 18's runtime files are included locally under `js/vendor/` so the visual layer does not need an internet connection. React and ReactDOM are distributed under the MIT License; see `js/vendor/LICENSE.react`.

## NASA data and resources

| Resource | Used for |
|---|---|
| [NASA STEM, What Is the International Space Station? (Grades K-4)](https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-k-4/) and [(Grades 5-8)](https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-5-8/) | Orbit phase |
| [NASA, Astronaut FAQ (PDF, Johnson Space Center)](https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf) | Launch, Orbit, Life on board and Return phases |
| [NASA STEM, What Is the Commercial Crew Program? (Grades K-4)](https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-commercial-crew-program-grades-k-4/) | Launch phase |
| [NASA, Crew-1 Astronauts Safely Splash Down](https://www.nasa.gov/news-release/crew-1-astronauts-safely-splash-down-after-space-station-mission/) | Return phase |
| [NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)](https://ccmc.gsfc.nasa.gov/tools/DONKI/) | Live solar flare / coronal mass ejection in the solar storm scenario |
| [NASA OSDR (Open Science Data Repository)](https://osdr.nasa.gov/bio/repo/) | "Science spotlight" in the Life on board phase |

Resources reviewed but **not used**: NASA Open APIs portal (DONKI now has its own service, see below), NASA OSDR RadLab (no verified ISS radiation reading was included, so the app does not show radiation data), NASA Mars Trek (this trainer focuses on the International Space Station).

## Space agency partner resources

| Resource | Used for |
|---|---|
| [Canadian Space Agency, Eating in space](https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp) | Life on board phase |
| [Canadian Space Agency, Food production on the moon and in remote areas](https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/) | Life on board phase (1 fact) |

## Sources by phase

### Launch
- NASA STEM Team. "What Is the Commercial Crew Program? (Grades K-4)". https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-commercial-crew-program-grades-k-4/
- NASA Johnson Space Center. "Astronaut FAQ" (PDF). https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf

### Orbit
- NASA. "What Is the International Space Station? (Grades K-4)". https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-k-4/
- NASA. "What Is the International Space Station? (Grades 5-8)". https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-international-space-station-grades-5-8/
- NASA Johnson Space Center. "Astronaut FAQ" (PDF). https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf

### Life on board
- Canadian Space Agency. "Eating in space". https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/eating-in-space.asp
- Canadian Space Agency. "Food production on the moon and in remote areas". https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- NASA Johnson Space Center. "Astronaut FAQ" (PDF). https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf

### Return
- NASA Johnson Space Center. "Astronaut FAQ" (PDF). https://www.nasa.gov/wp-content/uploads/2017/05/569954main_astronaut20_faq.pdf
- NASA. "Crew-1 Astronauts Safely Splash Down After Space Station Mission". https://www.nasa.gov/news-release/crew-1-astronauts-safely-splash-down-after-space-station-mission/

## Emergency simulator

There are 7 scenarios. Each run plays the solar storm scenario plus 1 random one (maximum 20 points). The choices and point values are a teaching game, not real NASA procedures. The rules appear before the first question. Each answer shows a short explanation and a "Real life" note with its sources. Resource depletion and mission rewards use accessible pop-up messages.

| Scenario | Systems affected | Real-life basis (source) |
|---|---|---|
| Low oxygen warning | Energy, Oxygen | [NASA, Environmental Control and Life Support Systems (ECLSS)](https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss) |
| Power dip | Energy, Shield | [NASA, New Solar Arrays to Power NASA's International Space Station Research](https://www.nasa.gov/missions/station/new-solar-arrays-to-power-nasas-international-space-station-research/) |
| Smoke alarm | Energy, Oxygen | [NASA, Fire Protection technical brief (NASA-STD-3001)](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf) |
| Cooling line leak | Energy, Oxygen, Shield | [NASA, Repairing the Station in Orbit (May 2013 spacewalk)](https://www.nasa.gov/image-article/repairing-station-orbit/) |
| Space debris | Energy, Shield | [NASA, Station Maneuvers to Avoid Orbital Debris](https://www.nasa.gov/blogs/spacestation/2025/04/30/station-maneuvers-to-avoid-orbital-debris); news article: [Space.com](https://www.space.com/6410-station-astronauts-shelter-space-debris.html) |
| Solar storm (always included, real DONKI event) | Oxygen, Shield, Energy | [NASA Science, How NASA Will Protect Astronauts from Space Radiation](https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon); news article: [Science Line](https://scienceline.org/2023/03/astronauts-will-soon-head-deeper-into-space-theyll-need-eyes-on-the-sun/); NASA DONKI |
| Communications loss | Energy, Shield | News report quoting NASA statements: [SpaceNews, Feb. 2013](https://spacenews.com/?p=12472) |

Sources that are news articles (not NASA pages) are marked above; the "Real life" notes that use them only repeat facts those articles attribute to NASA.

## Real space weather data (DONKI)

The solar storm scenario asks NASA CCMC for the most recent solar flare (`FLR`) or coronal mass ejection (`CME`) of the last 30 days and shows its type, date and time (UTC), class or detail, and a link to the DONKI record.

- Service used: `https://ccmc.gsfc.nasa.gov/DONKI-API/get/`. Since September 30, 2026 DONKI is served from this address and no API key is needed. No key is stored in this project.
- If the request fails, is blocked by the browser, returns no events, or takes more than 5 seconds, the app shows a saved real record labeled **"Example event"**.
- Saved example event: X1.8-class solar flare, start 2024-10-26 06:32 UTC, peak 07:19 UTC, source region S16E60 (active region 13873), activity ID 2024-10-26T06:32:00-FLR-001. [DONKI record](https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/34206/1).
- Credit: space weather data from NASA CCMC DONKI. DONKI data is experimental and shown for learning, not for forecasting. NOAA SWPC is the official U.S. source for space weather forecasts.

## Science spotlight (OSDR)

At the end of the Life on board phase, the app searches the NASA OSDR search API for a spaceflight study about muscle or bone and shows its title, study ID and link. If the search fails or takes more than 5 seconds, it shows a saved real study labeled **"Example"**: [OSD-342, "Targeting myostatin/activin A protects against skeletal muscle and bone loss during spaceflight"](https://osdr.nasa.gov/bio/repo/data/studies/OSD-342). This study was done with mice that flew to the space station.

## Images and credits

| File | What it shows | Credit line (copied from the source page) | Source page | Accessed |
|---|---|---|---|---|
| img/launch.jpg | A SpaceX Falcon 9 rocket with a Crew Dragon spacecraft launching from Kennedy Space Center (Demo-1, March 2, 2019) | Image Credit: NASA/Joel Kowsky | https://www.nasa.gov/image-article/spacex-demo-1-launch-2/ | 2026-11-14 |
| img/orbit.jpg | The International Space Station above the Pacific Ocean (iss072e316087, Oct. 23, 2024) | Image Credit: NASA | https://www.nasa.gov/image-detail/gmt297_flyover-3/ | 2026-11-14 |
| img/life-on-board.jpg | Trays of food for dinner aboard the International Space Station: shrimp cocktail with crackers and sushi | Image credit: NASA/Jonny Kim | https://www.nasa.gov/image-article/dinner-is-served/ | 2026-11-14 |
| img/return.jpg | SpaceX Crew Dragon guided by four parachutes toward the Atlantic Ocean after returning from the ISS (Demo-1, March 8, 2019) | Image Credit: NASA/Cory Huston | https://www.nasa.gov/image-article/spacex-demo-1-splashdown-recovery-i/ | 2026-11-14 |

Images come from NASA. No NASA logos or insignia are used in the design of the app. The credit line and a link to the source page are shown under each image in the app.

## Accessibility

- Designed for keyboard use, with visible focus and labels for screen readers.
- Animations stop when the device is set to "reduce motion".
- Sound effects can be turned off with the Sound button.
- Quiet background music is generated in the browser, starts when allowed, and can be turned off with Music.
- Layout adapts to small phone screens.

## Use of artificial intelligence

AI tools were used to build this project. (Edit this section so it is accurate for your team.)

- Codex: generated and edited code (HTML, CSS and JavaScript).
- Claude: brainstorming, help finding and organizing sources, reviewing the project against the challenge rules, drafting English texts, Codex prompts and this README.
- AI-generated images: None. The four phase images are credited NASA images listed above.

The team reviewed the facts against the cited sources before including them. All facts in the app have a source link.

## Privacy

The app does not collect, store or send personal data. The astronaut name typed by the player stays in the browser and is lost when the page closes. The only network requests are to NASA public services (DONKI and OSDR) to read public data; no personal data is sent. Source links open other websites only when the player clicks them.

## License

TODO: add a LICENSE file (for example MIT or Apache 2.0) and name it here. Original content created for the Space Apps Challenge is released under that open-source license. Facts, images and data from NASA, CSA and other sources belong to their respective owners and are credited above.

## Team

Equinox Explorers, Ecuador. TODO: add team member names (or usernames).
