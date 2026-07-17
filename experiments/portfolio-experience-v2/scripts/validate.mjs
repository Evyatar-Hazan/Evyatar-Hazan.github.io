import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRibbonGeometry } from '../src/forge/createRibbonGeometry.js';
import {
  cameraStateForBeat,
  cameraStateForHash,
  EXPERIENCE_SCENE_STATES,
  FORGE_STATES,
  resolveSceneCapability,
} from '../src/forge/forgeStates.js';
import {
  blogPostMetadata,
  getLatestBlogPostMetadata,
} from '../../../src/content/blog/metadata.ts';
import { portfolioCapabilityGroups } from '../../../src/data/portfolioCapabilities.ts';
import { projects } from '../../../src/data/profile.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portfolioRoot = path.resolve(root, '../..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

function readImageDimensions(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  throw new Error('Unsupported capture image format');
}

test('the complete V2 journey has stable route and section contracts', async () => {
  const app = await read('src/App.jsx');
  const shell = await read('src/shell/SiteHeader.jsx');

  for (const contract of [
    'projectId="online_converter"',
    'projectId="emergency_protocol"',
    'id="more-work"',
    'id="about"',
    'id="capabilities"',
    'id="lab"',
    'id="contact"',
    'path="projects/online_converter"',
    'path="projects/emergency_protocol"',
  ]) assert.ok(app.includes(contract), `missing contract: ${contract}`);

  assert.ok(shell.includes("localizedStoryPath('#lab', language, location.search)"));
  assert.ok(shell.includes("localizedStoryPath('#capabilities', language, location.search)"));
  assert.ok(shell.includes("localizedStoryPath('#contact', language, location.search)"));
  assert.ok(shell.includes("role={menuOpen ? 'dialog' : undefined}"));
  assert.ok(shell.includes('mainContent.inert = true'));
  assert.ok(shell.includes("event.key !== 'Tab'"));
});

test('content-rich sections use shared lightweight sources instead of hardcoded V2 copies', async () => {
  const app = await read('src/App.jsx');
  const metadata = await readFile(path.join(portfolioRoot, 'src/content/blog/metadata.ts'), 'utf8');
  const capabilities = await readFile(path.join(portfolioRoot, 'src/data/portfolioCapabilities.ts'), 'utf8');
  const projects = await readFile(path.join(portfolioRoot, 'src/data/portfolioProjects.ts'), 'utf8');

  assert.ok(app.includes('getLatestBlogPostMetadata(language, 3)'));
  assert.ok(app.includes('getPortfolioCapabilityGroups(language)'));
  assert.ok(app.includes('getFlagshipPortfolioProjects(language)'));
  assert.ok(app.includes('getRemainingPortfolioProjects(language)'));
  assert.equal(app.includes('const labNotes ='), false);
  assert.ok(metadata.includes('blogPostMetadata'));
  assert.ok(capabilities.includes('portfolioCapabilityGroups'));
  assert.ok(projects.includes('getFlagshipPortfolioProjects'));
  assert.ok(projects.includes('remainingPortfolioProjectIds'));
});

test('the complete canonical blog stays inside V2 with cinematic and fail-open contracts', async () => {
  const app = await read('src/App.jsx');
  const blog = await read('src/routes/BlogRoutes.jsx');
  const navigation = await read('src/navigation.js');
  const projectRoute = await read('src/routes/ProjectCaseStudy.jsx');
  const nisRoute = await read('src/routes/NisCaseStudy.jsx');
  const vite = await read('vite.config.mjs');

  assert.ok(app.includes('path="blog"'));
  assert.ok(app.includes('path="blog/:slug"'));
  assert.ok(blog.includes("import.meta.glob('../../../../src/content/blog/*.mdx')"));
  assert.ok(blog.includes('ArticleLoadBoundary'));
  assert.ok(blog.includes('data-cinema-id="writing-intro"'));
  assert.ok(blog.includes('data-cinema-id="writing-index"'));
  assert.ok(blog.includes('data-cinema-id="writing-close"'));
  assert.ok(vite.includes('mdx()'));
  assert.ok(
    vite.includes('dedupe: ["react", "react-dom"]'),
    'shared root MDX must resolve React from the isolated V2 app in a clean checkout',
  );
  assert.ok(navigation.includes("destination.searchParams.set('lang', language)"));
  assert.ok(navigation.includes('currentParameters.forEach'));
  assert.equal(app.includes('https://evyatarhazan.com/blog'), false);
  assert.equal(projectRoute.includes('https://evyatarhazan.com/blog'), false);
  assert.equal(nisRoute.includes('https://evyatarhazan.com/blog'), false);

  const englishPosts = blogPostMetadata.filter((post) => post.language === 'en');
  const hebrewPosts = blogPostMetadata.filter((post) => post.language === 'he');
  assert.ok(englishPosts.length >= 10, 'V2 must expose the full canonical notebook');
  assert.equal(englishPosts.length, hebrewPosts.length);
});

test('shared portfolio coverage keeps projects, capabilities, writing and actions complete', async () => {
  const app = await read('src/App.jsx');
  const flagshipIds = ['nis_boutique', 'online_converter', 'emergency_protocol'];
  const projectIds = new Set(projects.map((project) => project.id));
  const remainingProjects = projects.filter((project) => !flagshipIds.includes(project.id));

  assert.equal(projects.length, 7, 'the portfolio must expose exactly 3 flagship + 4 additional projects');
  assert.equal(remainingProjects.length, 4, 'four additional projects must remain visible');
  flagshipIds.forEach((id) => {
    const project = projects.find((candidate) => candidate.id === id);
    assert.ok(projectIds.has(id), `missing flagship project: ${id}`);
    assert.ok(project?.liveUrl, `missing live action for flagship project: ${id}`);
    assert.ok(project?.githubUrl, `missing source action for flagship project: ${id}`);
  });
  remainingProjects.forEach((project) => {
    assert.ok(project.githubUrl, `missing source action for additional project: ${project.id}`);
  });

  assert.equal(portfolioCapabilityGroups.length, 7, 'all seven capability groups must remain available');
  portfolioCapabilityGroups.forEach((group) => {
    assert.ok(group.label.en && group.label.he, `missing capability translation: ${group.id}`);
    assert.ok(group.description.en && group.description.he, `missing capability context: ${group.id}`);
    assert.ok(group.skills.length > 0, `empty capability group: ${group.id}`);
  });

  const postsByLanguage = Object.groupBy(blogPostMetadata, (post) => post.language);
  assert.equal(postsByLanguage.en?.length, postsByLanguage.he?.length, 'blog language counts must match');
  const enSlugs = new Set(postsByLanguage.en?.map((post) => post.slug));
  const heSlugs = new Set(postsByLanguage.he?.map((post) => post.slug));
  assert.deepEqual(enSlugs, heSlugs, 'every post must have an EN/HE pair');
  assert.deepEqual(
    getLatestBlogPostMetadata('en', 3).map((post) => post.slug),
    getLatestBlogPostMetadata('he', 3).map((post) => post.slug),
    'the three latest posts must stay paired across languages',
  );

  for (const routeId of flagshipIds.slice(1)) {
    assert.ok(app.includes(`projectId="${routeId}"`), `missing Home world route: ${routeId}`);
    assert.ok(app.includes(`path="projects/${routeId}"`), `missing case-study route: ${routeId}`);
  }
  for (const duplicatedUrl of [
    'https://nisboutiquecatering.com/',
    'https://online-converter.evyatarhazan.com/',
    'https://bls-protocol.evyatarhazan.com/',
  ]) {
    assert.equal(app.includes(duplicatedUrl), false, `V2 duplicated canonical project URL: ${duplicatedUrl}`);
  }
  assert.ok(app.includes("window.location.origin === 'https://evyatarhazan.com'"));
  assert.ok(app.includes('if (!isCanonicalOrigin) window.location.replace(destination)'));
  assert.ok(app.includes('subject=${encodeURIComponent(emailSubject)}'));
});

test('direct navigation lands where capabilities, Lab and Contact content is already readable', async () => {
  const app = await read('src/App.jsx');
  const shell = await read('src/shell/ExperienceShell.jsx');
  const director = await read('src/journey/useMotionDirector.js');
  assert.ok(app.includes('data-cinema-anchor="0.38"'));
  assert.ok(app.includes('data-cinema-anchor="0.5"'));
  assert.ok(app.includes('data-cinema-anchor="0.58"'));
  assert.equal(app.match(/data-cinema-anchor="0.18"/g)?.length, 2);
  assert.ok(shell.includes('scrollableDistance * narrativeAnchor'));
  assert.ok(shell.includes('pendingHashAnchorRef'));
  assert.ok(shell.includes('pendingHashFrameRef'));
  assert.ok(shell.includes('hashSettleFrameRef'));
  assert.ok(shell.includes('hashSettleTimerRef'));
  assert.ok(shell.includes('CINEMA_GEOMETRY_READY_EVENT'));
  assert.ok(shell.includes("useLayoutEffect(() => {\n    const handleGeometryReady"));
  assert.ok(shell.includes('pendingHashFrameRef.current = window.requestAnimationFrame'));
  assert.ok(shell.includes('hashSettleFrameRef.current = window.requestAnimationFrame'));
  assert.ok(shell.includes("hashSettleTimerRef.current = window.setTimeout(settleHashAnchor, 320)"));
  assert.ok(director.includes("export const CINEMA_GEOMETRY_READY_EVENT = 'cinema:geometry-ready'"));
  assert.ok(director.includes('detail: { revision: geometryRevision, routeKey }'));
  assert.ok(
    director.indexOf("writeDatasetValue(shell, shellDatasetCache, 'motionDirector', 'ready')")
      < director.indexOf('document.documentElement.scrollHeight - viewportHeight'),
    'cinematic track heights must be enabled before geometry is measured',
  );
});

test('input modality follows real scroll intent without adding another scroll scheduler', async () => {
  const shell = await read('src/shell/ExperienceShell.jsx');

  assert.ok(shell.includes('KEYBOARD_SCROLL_KEYS.has(event.key)'));
  assert.ok(shell.includes("event.key === 'Tab'"));
  assert.ok(shell.includes("setInputMode('keyboard')"));
  assert.ok(shell.includes('{ replace: location.hash === hash, state: { inputMode: mode } }'));
  for (const eventName of ['pointerdown', 'touchstart', 'wheel']) {
    assert.ok(
      shell.includes(`window.addEventListener('${eventName}', restoreDirectInput`),
      `missing direct-input recovery for ${eventName}`,
    );
  }
  assert.equal(shell.includes("window.addEventListener('scroll'"), false);
});

test('every featured V2 project uses real desktop and mobile captures', async () => {
  const captures = [
    'nis-live-hero-desktop.png',
    'nis-live-hero-mobile.png',
    'online-live-hero-desktop.png',
    'online-live-hero-mobile.png',
    'protocol-live-hero-desktop.png',
    'protocol-live-hero-mobile.png',
  ];

  for (const capture of captures) {
    const file = path.join(root, 'public/assets', capture);
    await access(file);
    assert.ok((await stat(file)).size > 10_000, `${capture} is not a credible capture`);
  }

  for (const base of ['nis-live-hero', 'online-live-hero', 'protocol-live-hero']) {
    const desktop = await readFile(path.join(root, 'public/assets', `${base}-desktop.png`));
    const mobile = await readFile(path.join(root, 'public/assets', `${base}-mobile.png`));
    const desktopSize = readImageDimensions(desktop);
    const mobileSize = readImageDimensions(mobile);
    assert.ok(desktopSize.width > desktopSize.height, `${base} desktop capture must be landscape`);
    assert.ok(mobileSize.height > mobileSize.width, `${base} mobile capture must be portrait`);
    assert.notEqual(
      createHash('sha256').update(desktop).digest('hex'),
      createHash('sha256').update(mobile).digest('hex'),
      `${base} desktop and mobile captures must be distinct`,
    );
  }
});

test('expanded project stories stay in the shared typed source', async () => {
  const source = await readFile(path.join(portfolioRoot, 'src/data/portfolioExperiences.ts'), 'utf8');
  for (const id of ['nis_boutique', 'online_converter', 'emergency_protocol']) {
    assert.ok(source.includes(`${id}: {`), `missing ${id} experience`);
  }
  assert.equal(source.includes('Lorem ipsum'), false);
  assert.equal(source.includes('TODO'), false);
});

test('motion remains fail-open and respects reduced motion', async () => {
  const director = await read('src/journey/useMotionDirector.js');
  const shell = await read('src/shell/ExperienceShell.jsx');
  const styles = await read('src/styles.css');
  const cinema = await read('src/cinema.css');
  assert.ok(director.includes('prefers-reduced-motion: reduce'));
  assert.ok(director.includes('isReducedMotion'));
  assert.ok(shell.includes("root.dataset.motionOverride = 'reduce'"));
  assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(cinema.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(cinema.includes("html[data-motion-override='reduce']"));
  assert.ok(styles.includes("data-input-mode='keyboard'"));
  assert.ok(cinema.includes('[data-cinema-window]:focus-within'));
  assert.ok(cinema.includes("[data-cinema-readable='true']"));
  assert.ok(cinema.includes('pointer-events: none'));
  assert.ok(styles.includes('box-shadow: 0 0 0 2px #101522'));
  assert.ok(cinema.includes('.case-cinema-stage .evidence-image-fallback'));
});

test('the full journey has one shared reversible controller and distinct world mechanisms', async () => {
  const app = await read('src/App.jsx');
  const nisRoute = await read('src/routes/NisCaseStudy.jsx');
  const projectRoute = await read('src/routes/ProjectCaseStudy.jsx');
  const shell = await read('src/shell/ExperienceShell.jsx');
  const controller = await read('src/journey/useMotionDirector.js');
  const mechanisms = await read('src/journey/WorldMechanism.jsx');
  const styles = `${await read('src/styles.css')}\n${await read('src/cinema.css')}`;

  for (const phase of ['conversion', 'archive', 'about', 'capabilities', 'lab', 'contact']) {
    assert.ok(app.includes(`data-journey-phase="${phase}"`), `missing Home journey phase: ${phase}`);
  }
  assert.ok(app.includes('data-journey-phase={world.theme}'));
  for (const phase of ['case-intro', 'case-need', 'case-decision', 'case-system', 'case-tradeoffs', 'case-outcome', 'case-close']) {
    assert.ok(nisRoute.includes(`data-journey-phase="${phase}"`), `missing NIS phase: ${phase}`);
    assert.ok(projectRoute.includes(`data-journey-phase="${phase}"`), `missing shared project phase: ${phase}`);
  }
  assert.ok(shell.includes('<JourneyField journey={journey}'));
  assert.ok(shell.includes('useMotionDirector'));
  assert.equal(shell.includes('useJourneyController'), false);
  assert.ok(controller.includes('[data-cinema-track]'));
  assert.ok(controller.includes("window.addEventListener('scroll', handleScroll"));
  assert.ok(controller.includes('sceneProgress'));
  assert.ok(controller.includes('CINEMA_PROGRESS_EVENT'));
  assert.ok(controller.includes('requestAnimationFrame'));
  assert.equal(controller.includes('setInterval'), false);
  assert.ok(mechanisms.includes('registry-mechanism'));
  assert.ok(mechanisms.includes('protocol-mechanism'));
  assert.ok(styles.includes('.conversion-aperture'));
  assert.ok(styles.includes('.method-spine'));
  assert.ok(styles.includes('.lab-telemetry'));
});

test('journey motion keeps the entry light and avoids fragile animation primitives', async () => {
  const sourceFiles = await Promise.all([
    read('src/App.jsx'),
    read('src/shell/ExperienceShell.jsx'),
    read('src/journey/useMotionDirector.js'),
    read('src/styles.css'),
    read('src/cinema.css'),
  ]);
  const source = sourceFiles.join('\n');
  assert.equal(source.includes('ScrollTrigger'), false);
  assert.equal(/transition\s*:\s*all(?:\s|;)/.test(source), false);
  assert.equal(source.includes("from 'three'"), false);
});

test('the cinematic spine covers every Home and case-study act', async () => {
  const app = await read('src/App.jsx');
  const caseLayout = await read('src/routes/CaseJourneyLayout.jsx');
  const controller = await read('src/journey/useMotionDirector.js');
  const projectRoute = await read('src/routes/ProjectCaseStudy.jsx');
  const nisRoute = await read('src/routes/NisCaseStudy.jsx');
  for (const id of ['hero', 'thesis', 'signals', 'handoff', 'work', 'online_converter', 'emergency_protocol', 'more_work', 'about', 'capabilities', 'lab', 'contact']) {
    assert.ok(app.includes(`data-cinema-id="${id}"`) || app.includes('data-cinema-id={projectId}'), `missing cinematic Home act: ${id}`);
  }
  for (const act of ['promise', 'need', 'decision', 'system', 'proof-tradeoffs', 'outcome', 'close']) {
    assert.ok(projectRoute.includes(`act="${act}"`), `missing shared case act: ${act}`);
    assert.ok(nisRoute.includes(`act="${act}"`), `missing NIS case act: ${act}`);
  }
  assert.ok(caseLayout.includes('case-cinema-stage-pin'));
  assert.ok(caseLayout.includes("const contentWindow = holdsFinalFrame ? '0,1' : '0,0.9'"));
  assert.ok(controller.includes('describeSemanticWindows'));
  assert.ok(controller.includes('.flatMap(describeWindowDescriptors)'));
  assert.ok(controller.includes("'cinemaReadable'"));
  assert.ok(
    caseLayout.indexOf('case-cinema-tracks-before')
      < caseLayout.indexOf('className="case-cinema-stage"')
      && caseLayout.indexOf('className="case-cinema-stage"')
      < caseLayout.indexOf('case-cinema-tracks-after'),
    'case DOM order must be intro/H1, persistent proof, then the remaining acts',
  );
  assert.ok(projectRoute.includes('fetchPriority="high"'));
  assert.ok(nisRoute.includes("fetchPriority={priority ? 'high' : undefined}"));
});

test('the final Home and case-study frames hold their message and actions', async () => {
  const app = await read('src/App.jsx');
  const caseLayout = await read('src/routes/CaseJourneyLayout.jsx');
  const director = await read('src/journey/useMotionDirector.js');
  const styles = await read('src/styles.css');

  assert.ok(app.includes('data-motion-key="contact-copy" data-journey-beat="incoming" data-cinema-window="0.04,1"'));
  assert.ok(app.includes('data-motion-key="contact-actions" data-journey-beat="ready" data-cinema-window="0.32,1"'));
  assert.ok(caseLayout.includes("const holdsFinalFrame = act === 'close'"));
  assert.ok(caseLayout.includes("const contentWindow = holdsFinalFrame ? '0,1' : '0,0.9'"));
  assert.ok(director.includes("cinemaWindow.end >= 0.999"));
  assert.ok(styles.includes('.case-study .case-cinema-track.case-footer a'));
  assert.equal(styles.includes('.case-study .case-cinema-track .case-footer a'), false);
});

test('the signature scene stays lazy, observable and lifecycle-safe', async () => {
  const stage = await read('src/forge/SignalForgeStage.jsx');
  const canvas = await read('src/forge/SignalForgeCanvas.jsx');
  const scene = await read('src/forge/createSignalForgeScene.js');
  const entry = await read('src/App.jsx');

  assert.ok(stage.includes("import('./SignalForgeCanvas.jsx')"));
  assert.equal(entry.includes("from 'three'"), false);
  for (const diagnostic of ['data-scene-state', 'data-camera-state', 'data-quality-tier']) {
    assert.ok(stage.includes(diagnostic), `missing scene diagnostic: ${diagnostic}`);
  }
  assert.ok(stage.includes('data-poster-state'));
  assert.ok(
    stage.indexOf('if (!preflight.eligible) return preflight')
      < stage.lastIndexOf('supportsWebGL()'),
    'ineligible users must short-circuit before probing WebGL',
  );
  for (const lifecycle of ['webglcontextlost', 'ResizeObserver', 'visibilitychange', 'forceContextLoss', 'renderer.dispose']) {
    assert.ok(scene.includes(lifecycle), `missing lifecycle guard: ${lifecycle}`);
  }
  assert.ok(canvas.includes('useGSAP'));
  assert.ok(canvas.includes("window.addEventListener('cinema:progress'"));
  assert.ok(scene.includes('setProgress'));
  assert.ok(scene.includes('interpolateState'));
  assert.ok(scene.includes('Number.isFinite(sceneProgress)'));
  assert.ok(scene.includes('experienceStateForViewport(states[0])'));
  assert.ok(scene.includes('renderFrameId = window.requestAnimationFrame'));
  assert.ok(Object.keys(EXPERIENCE_SCENE_STATES).length >= 10);
});

test('adjacent Home camera worlds share exact boundary states', () => {
  const sequence = [
    'hero',
    'thesis',
    'signals',
    'handoff',
    'work',
    'online_converter',
    'emergency_protocol',
    'more_work',
    'about',
    'capabilities',
    'lab',
    'contact',
  ];

  sequence.slice(0, -1).forEach((id, index) => {
    const next = sequence[index + 1];
    assert.deepEqual(
      EXPERIENCE_SCENE_STATES[id][1],
      EXPERIENCE_SCENE_STATES[next][0],
      `${id} must hand off continuously to ${next}`,
    );
  });
});

test('adjacent case-study camera acts share exact boundary states', () => {
  const sequence = [
    'case-intro',
    'case-need',
    'case-decision',
    'case-system',
    'case-tradeoffs',
    'case-outcome',
    'case-close',
  ];

  sequence.slice(0, -1).forEach((id, index) => {
    const next = sequence[index + 1];
    assert.deepEqual(
      EXPERIENCE_SCENE_STATES[id][1],
      EXPERIENCE_SCENE_STATES[next][0],
      `${id} must hand off continuously to ${next}`,
    );
  });
});

test('the compact journey keeps semantic content and adapts WebGL framing', async () => {
  const cinema = await read('src/cinema.css');
  const scene = await read('src/forge/createSignalForgeScene.js');
  assert.ok(cinema.includes('@supports (animation-timeline: view())'));
  assert.ok(cinema.includes("data-compact-fallback='true'"));
  assert.ok((await read('src/journey/useMotionDirector.js')).includes('IntersectionObserver'));
  assert.ok(cinema.includes('@keyframes compact-story-reveal'));
  assert.ok(cinema.includes('.cinema-pin-capabilities .capabilities-grid'));
  assert.ok(cinema.includes('.cinema-pin-more-work .archive-grid'));
  assert.ok(scene.includes('experienceStateForViewport'));
});

test('language and cold-route handoffs preserve user context', async () => {
  const app = await read('src/App.jsx');
  const shell = await read('src/shell/ExperienceShell.jsx');
  const navigation = await read('src/navigation.js');
  const projectRoute = await read('src/routes/ProjectCaseStudy.jsx');
  const legacyI18n = await readFile(path.join(portfolioRoot, 'src/i18n.ts'), 'utf8');

  assert.ok(app.includes("window.localStorage.setItem('i18nextLng', language)"));
  assert.ok(app.includes('onLanguageChange={handleLanguageChange}'));
  assert.ok(app.includes('navigate(nextDestination, { replace: true, state: location.state })'));
  assert.ok(app.includes("destinationUrl.searchParams.set('lang', language)"));
  assert.ok(legacyI18n.includes("order: ['querystring', 'localStorage', 'navigator']"));
  assert.ok(shell.includes("fallbackHash = '#work'"));
  assert.ok(shell.includes('localizedStoryPath(hash, language, location.search)'));
  assert.ok(shell.includes('localizedInternalPath(destination, language, location.search)'));
  assert.ok(navigation.includes('currentParameters.forEach'));
  assert.ok(projectRoute.includes('onProjectBack(event, `#${projectId}`)'));
});

test('the JavaScript failure mode still exposes identity and contact paths', async () => {
  const html = await read('index.html');
  assert.ok(html.includes('<noscript>'));
  assert.ok(html.includes('mailto:evyatarhazan3.14@gmail.com'));
  assert.ok(html.includes('https://wa.me/972587127547'));
});

test('camera beats preserve the approved CAM-00 through CAM-03 contract', () => {
  assert.equal(cameraStateForHash(''), 'CAM-00');
  assert.equal(cameraStateForHash('#signals'), 'CAM-02');
  assert.equal(cameraStateForHash('#work'), 'CAM-03');
  assert.deepEqual([0, 1, 2, 3].map(cameraStateForBeat), ['CAM-00', 'CAM-01', 'CAM-02', 'CAM-03']);
  assert.deepEqual(
    Object.values(FORGE_STATES).map(({ yaw, pitch, dolly }) => [yaw, pitch, dolly]),
    [[16, -4, 1], [11, -2, 0.9], [6, -10, 1.12], [4, -8, 1.32]],
  );
});

test('fallback capability decisions fail open before importing WebGL', () => {
  for (const input of [
    { reducedMotion: true },
    { saveData: true },
    { webgl: false },
    { mobileLandscape: true },
    { forcedOff: true },
  ]) {
    assert.equal(resolveSceneCapability(input).eligible, false);
  }
  assert.deepEqual(resolveSceneCapability(), { eligible: true, reason: 'eligible' });
});

test('procedural ribbon buffers stay finite and index-safe', () => {
  const geometry = createRibbonGeometry({
    radiusX: 2.4,
    radiusZ: 1.8,
    yOffset: 0,
    yWave: 0.8,
    halfWidth: 0.4,
    phase: 0.2,
    wave: 0.4,
    twist: 0.7,
  }, { segments: 24, rows: 4 });
  const positions = geometry.getAttribute('position').array;
  const indices = geometry.index.array;
  assert.ok([...positions].every(Number.isFinite));
  assert.ok(Math.max(...indices) < positions.length / 3);
  assert.ok(geometry.boundingSphere?.radius > 0);
  geometry.dispose();
});
