# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

For V1, keep Signal Forge poster-first and do not add WebGL. The approved responsive artwork, restrained pointer response, native scroll, reduced-motion path and asset-failure fallback are the implementation contract. Reconsider WebGL only if a future beat proves unique narrative value and receives a separate bundle/memory budget.

## 2026-07-14 Signature Motion Override

The user explicitly rejected the poster-only experience because it did not deliver the approved camera journey. This supersedes the no-WebGL implementation restriction for the isolated V2 experiment only. Act 1 must now include a real scroll-driven 3D Signal Forge with distinct CAM-00→CAM-03 states, visible angle/depth changes, reversible scroll progress, and a handoff into real NIS media. Keep the poster-first load path, reduced-motion/no-WebGL parity, keyboard/programmatic instant behavior, lazy scene bundle, cleanup, context-loss recovery, and separate performance budget. Do not describe V2 as motion-complete or release-ready until runtime evidence proves the camera journey.

Scroll progression is required before Gate 4 feel signoff. Keep every chapter fail-open and fully readable in base CSS, then add one-time observer-triggered CSS keyframes as enhancement only. Maintain the passive scroll fallback, prevent reverse-scroll replay, skip staged motion for keyboard/programmatic navigation and reduced motion, gate hover/pointer effects to fine pointers, and never make content visibility depend on JavaScript.

## 2026-07-14 Full-Journey Experience Override

The signature experience is not allowed to end at the Hero or CAM-03. Home, every featured project world, and every internal evidence route must participate in one persistent semantic journey. Keep the real WebGL camera limited to Act 1, then continue with reversible DOM/SVG/media states: Conversion aperture for NIS, registry expansion for Online Converter, guided branching for Emergency Protocol, alignment spine for Method, telemetry for Lab, and convergence for Contact. Case-study routes must advance through Promise, Need, Decision, System, Tradeoffs/Proof, Outcome and Close states through the shared shell controller.

Use one passive requestAnimationFrame evaluator owned by `ExperienceShell`; do not add route-local scroll controllers, ScrollTrigger scrub, scroll hijacking, a second WebGL renderer, infinite loops, or JS-dependent content visibility. Keyboard, programmatic, direct-hash, Back and reduced-motion paths are immediate. Reverse scroll must retarget the current semantic state. Every route must keep its real media and copy readable when JavaScript, motion, WebGL or assets fail.

## 2026-07-14 Lusion-Parity Cinematic Spine Override

The user rejected the threshold-driven Full-Journey RC because separate DOM effects and an Act-1-only camera did not create a continuous Lusion-level experience. This supersedes the `CAM-PARKED`/WebGL-only-in-Act-1 restriction above for the isolated V2 experiment. The approved architecture is one native-scroll `MotionDirector`, one shell-owned persistent Signal Forge renderer, and long CSS-sticky tracks whose local progress drives both DOM composition and camera/object state continuously across Home and every evidence route.

Treat the Signal Core as the protagonist of the complete journey. It must transform continuously through Hero, Thesis, Signals, project portals, real product evidence, Method, Lab, Contact and the seven acts of every case study. Use shared-object transformations, meaningful dolly/yaw/scale/light/fog changes, large masked typography, full-frame real media and deliberate quiet/loud pacing. Do not regress to per-section reveal effects, threshold camera tweens, a second canvas, route-local scroll listeners, ScrollTrigger, virtual-scroll hijacking or decorative motion that is disconnected from narrative state.

`sceneProgress` — not route progress — is the camera interpolation input. Every case route keeps one correctly sized persistent real-media stage across Promise, Need, Decision, System, Proof/Tradeoffs, Outcome and Close. Native scroll remains the source of truth, the central RAF runs only while damping, and reverse scroll must reproduce the same deterministic frame. Keyboard/programmatic navigation snaps immediately. Reduced motion, no-WebGL and no-JS modes must remain complete static stories with no collapsed tracks, hidden content or blocked actions. Mobile uses portrait composition rather than a desktop crop, and RTL must preserve the spatial hierarchy without horizontal overflow.

Do not claim visual parity, release readiness or production approval from implementation alone. Require same-viewport reference/prototype comparisons, desktop and `390×844` runtime evidence, all-route checks, bundle/lifecycle verification and explicit user approval. The legacy site and production deployment remain untouched until the existing Release Gate is explicitly approved.

Keep the V2 application inside a persistent `BrowserRouter` shell. Register only routes backed by real approved content; do not create placeholder pages to demonstrate navigation. Until `ENG-005` and `ENG-006` exist, Lab and Contact should resolve to the canonical legacy routes, while Work remains an in-page story anchor. The route-motion token may exist before a second page, but do not claim or stage a product page transition until a real internal route makes the transition testable.

The first approved internal evidence route is `/projects/nis_boutique/`. Its expanded bilingual content lives once in `src/data/portfolioExperiences.ts`, while legacy project metadata remains unchanged in `src/data/profile.ts`. Use real live-product captures, owned media, and documented architecture; never present a generated or code-native diagram as a private Studio screenshot.

Route entry motion is pointer-only, vertical, interruptible CSS (`360ms`, `12px` maximum). Keyboard, programmatic, direct-load, browser-Back and reduced-motion paths are instant. Focus and URL update immediately. Back restores the original NIS launcher and scroll position without replaying the Home Hero. `ENG-003` remains partial until the other two project routes and approved Studio/publishing captures exist.

## 2026-07-15 Content, Coverage and Usability Override

This durable rule supersedes any earlier placeholder-routing or limited-content wording. Every cinematic track must preserve a readable label, headline, explainer and proof or action; motion may change emphasis but may not remove the message. Do not reintroduce disconnected giant typography, invisible context windows or proof that arrives after its explanation has disappeared.

The complete Home journey includes Featured Work, More Work, Capabilities, Writing and Contact. Project, capability and blog content must come from the shared canonical adapters; do not restore hand-maintained V2 lists. Direct navigation must land where the requested content and its primary actions are already readable.

Mobile uses natural-flow content rather than sticky text. Case routes keep the persistent product stage, while their reading layouts must be sized for the narrower evidence column and must not be covered by the journey HUD. Do not claim perfection, release readiness or production approval without all-route desktop/mobile QA, EN/HE+RTL, reduced/no-WebGL, direct-anchor, bundle and external Gate evidence. The legacy build and production deployment remain untouched until explicit Release approval.

## 2026-07-15 Interaction and Accessibility Hardening Override

Cold direct hashes must be applied only after the cinematic layout has published final geometry. Keyboard/programmatic input remains instant, while the next real pointer, wheel or touch intent must restore direct choreography; do not add a second scroll scheduler to achieve this.

No hidden cinematic window may receive focus without becoming readable. Mobile navigation is a true modal interaction with focus trap, Escape/focus return and inert background. Case-study text and H1 precede persistent media in DOM order while CSS grid preserves the visual composition. Failed-media recovery links remain interactive, repeated actions include project context, and priority hero evidence loads eagerly.

Dense proof chapters must preserve all content at every supported viewport. Use asymmetric rows for uneven content, compact editorial chrome on low-height desktop, and fail open to natural document flow when a sticky viewport cannot contain the information. Project URLs, capability inventories and blog metadata must remain canonical and protected by cardinality/parity validation.

## 2026-07-16 Internal Journey and Writing Override

The user explicitly rejected V2 controls that return to the legacy visual experience. Every visible Home, header, project, case-study, Writing and Back/About handoff must remain inside the V2 shell whenever an approved V2 route exists. Render a real fallback `href` for copy, modified-click and new-tab behavior, and use SPA navigation for ordinary activation. Preserve `lang`, motion/debug query parameters and the destination hash across every handoff; localStorage alone is not sufficient.

Writing is now a complete V2 journey, not an external legacy escape. `/blog` and `/blog/:slug` must consume the canonical bilingual metadata and MDX bodies without duplicating post content, expose the complete notebook, and continue the cinematic story through intro, index/reading and conversation-close tracks. Long-form prose owns its reading rail, so the global HUD may not cover article text or code. New posts must continue to appear from the shared source, direct preview routes must resolve to the SPA, and legacy/production remain untouched until explicit Release approval.

## 2026-07-16 Dedicated Cloud Preview Override

The user explicitly approved publishing the isolated V2 alongside the existing portfolio on a dedicated subdomain. The approved preview target is a separate Cloudflare Pages project at `experience.evyatarhazan.com`; it must not replace, redirect, rebuild or otherwise alter the legacy deployment at `evyatarhazan.com` or GitHub Pages.

The cloud preview remains non-canonical and must stay blocked from indexing through the HTML robots meta tag, a site-wide `X-Robots-Tag` response header and `robots.txt`. Deploy the V2 build output independently; do not push the current dirty `main` worktree merely to publish the preview. A successful preview deployment is not approval to switch production or remove the legacy site.

## 2026-07-17 Continuous Cloud Preview Override

The user explicitly approved storing the complete V2 source on `main` and automatically updating the isolated cloud preview after each push to `main`. This narrowly supersedes the earlier restriction against pushing the dirty worktree merely for a manual preview deploy.

Keep the legacy validation and deployment jobs intact. V2 must run its own `npm ci` and `npm run validate`, build its own `dist`, and deploy only to Cloudflare Pages project `evyatar-portfolio-v2` on its configured production branch `preview`. The dedicated subdomain remains non-canonical and `noindex`; CI automation is not Release approval and does not permit replacing, redirecting, or removing the legacy site.
