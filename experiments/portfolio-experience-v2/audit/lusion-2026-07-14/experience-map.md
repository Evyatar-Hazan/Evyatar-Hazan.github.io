# מפת חוויה — Lusion → Portfolio Experience V2

**תאריך האודיט:** 2026-07-14

**מקור ההשראה שנבדק:** [lusion.co](https://lusion.co/)

**Viewport עיקרי:** `1440×900`

**מטרת המסמך:** לתרגם את רמת ה־craft, הקצב והסיפור המרחבי של Lusion לחוויה מקורית של אביתר — בלי להעתיק קוד, נכסים, מותג או שפה חזותית.
**סטטוס:** מחקר הושלם; זהו חוזה תכנון ו־QA, לא אישור Release.

---

## 1. פסק הדין

הדבר המרשים ב־Lusion אינו “הרבה אנימציות”. זו **יצירה קולנועית אחת שנמשכת לכל אורך הגלילה**.

המשתמש אינו מרגיש שהוא עובר בין סקשנים נפרדים. הוא מרגיש שאותו עולם משנה צורה שוב ושוב:

`אובייקט → מסגרת → מכשיר → שער → עולם → מסך → שבר → הזמנה לפעולה`

זהו הפער העיקרי מול V2 הנוכחי. כבר קיימים אצלנו יסודות טכניים טובים מאוד — Motion Director סמנטי, סצנת Signal Forge, עולמות פרויקט אמיתיים, מסלולי case study, fallback ו־reduced motion — אבל בחלקים רבים החוויה עדיין נקראת כ־**רצף סקשנים יפים עם שכבת motion**, ולא כאובייקט אחד שמוביל מסע בלתי נשכח.

לכן ההמלצה אינה להוסיף עוד `fade`, עוד `scale` או עוד קווים דקורטיביים. ההמלצה היא לבנות **ציר קולנועי יחיד**, שבו Signal Core הוא הגיבור, וכל פרויקט הוא שינוי פיזי שלו.

### הגדרת היעד

“אותה רמה” פירושו כאן:

- אותה רמת בימוי, רציפות, קצב, דיוק ותחושת production value.
- חוויה שבה כל גלילה משנה את הפריים באופן מהותי ומובן.
- רגע שיא אחד ארוך שנחרט בזיכרון, ולא עשרה אפקטים מקומיים שמתחרים זה בזה.
- מקוריות מלאה של אביתר: Graphite / Indigo / Copper, Signal Forge, תכני הפרויקטים והטון המקצועי שלו.

“אותה רמה” **אינו** אומר:

- שכפול האסטרונאוט, הסטיקרים, הצבע הכחול, הטיפוגרפיה, ה־pills או המודלים של Lusion.
- העתקת קוד, assets, timing מדויק או מבנה DOM.
- אימוץ scroll hijacking שפוגע בנגישות רק מפני שהוא קיים באתר הייחוס.

---

## 2. שיטת האודיט ומגבלות הראיות

האודיט כלל:

- גלילה מלאה בעמוד הבית החי, קדימה ואחורה.
- מדידת מבנה הגלילה, אורכי הסקשנים וקצב ההתייצבות.
- פירוק ה־journey ל־beats, מעברי אובייקט ותנועות מצלמה.
- בדיקת טיפוגרפיה, media treatment, ניווט ו־microinteractions.
- בדיקת responsive ב־viewport של `390×844`.
- בדיקת Console ונקודות נגישות בולטות.
- השוואה מול מימוש V2 המקומי והחוזים הקיימים בו.

### מגבלת תיעוד

קבצי `reference/` המצורפים מתעדים היטב את ה־Hero, רצף ההצהרה/Showreel ואת גלריית העבודות. רצף ה־3D המאוחר — device, tunnel, monitor, shatter, CTA — נצפה ונחקר בזמן האודיט החי, אך אינו מיוצג במלואו בסט התמונות העמיד שבתיקייה. לכן:

- ממצאי הרצף המאוחר מסומנים במסמך כ־**תצפית חיה**.
- אינדקס התמונות אינו מוצג כאילו הוא מכסה את כל המסע.
- לפני חתימת art direction יש לבצע capture מסודר נוסף של הרצף המאוחר, אם תנאי האתר מאפשרים זאת.

---

## 3. מפת המסע של Lusion

| Beat | מה המשתמש רואה | מה הגלילה עושה | התפקיד הסיפורי | מה לומדים מזה |
|---|---|---|---|---|
| L00 — Hero | הצהרה קצרה מעל חלון 3D גדול ומעוגל; צורות מודולריות כחול/שחור/לבן | המצלמה מתקרבת, האובייקטים ממלאים את החלון וה־Hero מתחיל להתפרק | הבטחה + הוכחת יכולת מיידית | ה־Hero אינו poster; הוא הפריים הראשון בסרט |
| L01 — Collapse | חלון ה־3D נשאר נוכח בזמן שהתוכן הבא מתחיל להיחשף | האובייקט והמסגרת ממשיכים לנוע בזמן שהכותרת הבאה נכנסת | מעבר ללא “חיתוך” לסקשן חדש | שני פרקים צריכים לחלוק לפחות אובייקט או מסגרת אחת בזמן המעבר |
| L02 — Bold Ideas | טיפוגרפיה עצומה, spline כחול, copy קטן וחלון media | הכותרת נחשפת כמסה, הקו חוצה את הפריים וה־media תופס נפח | ניסוח הגישה של הסטודיו | טיפוגרפיה היא חומר תנועתי, לא רק טקסט שקוף שנכנס |
| L03 — Reel | media כמעט full-bleed עם `PLAY REEL` ענק | המסגרת נעה/נחתכת, התוכן מתחלף בתוך אותה במה | הוכחת craft חזותית | media אמיתי צריך לשלוט בפריים, לא להישאר thumbnail |
| L04 — Featured Work | כותרת גדולה וגלריה דו־טורית של עבודות | הקצב נרגע; התמונות והכותרות נשענות על scroll טבעי | עיגון אמינות לאחר spectacle | אחרי שיא צריך מרווח נשימה, אחרת הכול מרגיש כמו רעש |
| L05 — Context / Approach | כותרת ענקית, copy ומכשיר שבתוכו דמות/עולם | המכשיר מסתובב וגדל; ה־copy נדחק החוצה | פתיחת המערכה הקולנועית הארוכה | אובייקט UI יכול להפוך פיזית ל־portal |
| L06 — Enter the World | המכשיר מתרחב עד שהמסגרת נעלמת והעולם שבתוכו ממלא את המסך | dolly פנימה, scale ו־reframe רציפים | שבירת הגבול בין אתר לעולם | המעבר הטוב ביותר אינו dissolve אלא שינוי תפקיד של אותו אובייקט |
| L07 — Corridor | עולם כחול עמוק, מסדרון ומצלמה נעה; הדמות נשארת עוגן | תנועה קדימה + camera roll יחיד ומבוקר | רגע ה־“איך הם עשו את זה?” | roll הוא סימן פיסוק נדיר, לא אפקט שחוזר בכל סקשן |
| L08 — Monitor Reframe | המסדרון/עולם מתכווץ ומתברר כתוכן בתוך monitor | reframe מעולם למסך, בלי cut חד | החזרת המשתמש מהעולם לאובייקט | כל יציאה מסצנה צריכה להכין את צורת הסצנה הבאה |
| L09 — Shatter | המסך/זכוכית נשברים; shards חוצים את גבולות המסגרת | פיצול, עומק ותנועה מחוץ ל־container | שיא פיזי וסיום המתח | שיא עובד כשנבנה אליו לאורך זמן וכשהוא משנה silhouette |
| L10 — Final CTA | הדמות חוזרת עם shards/אלמנטים סביב `Let's work together` | החלקים מתארגנים סביב קריאה אחת ברורה | המרת spectacle לפעולה | ה־CTA הסופי צריך להיות תוצאה של המסע, לא footer שהודבק בסוף |
| L11 — Calm Footer | אזור לבן, רגוע ופשוט | motion יורד כמעט לאפס | decompression + פרטים שימושיים | יש לאפשר למוח לנוח לפני הסיום |
| L12 — Next Page Rail | פס שחור עם `Keep scrolling / About Us / Next page` | המשך גלילה מעביר ל־`/about` | המסע ממשיך מעבר ל־route | route transition הוא beat נרטיבי, לא רק click/navigation |

### הצורה הכוללת

```text
הבטחה שקטה
  ↓
הדגמת craft קצרה
  ↓
עבודות אמיתיות ונשימה
  ↓
מערכה קולנועית ארוכה אחת
  ↓
שיא פיזי
  ↓
CTA רגוע
  ↓
מעבר למסלול הבא
```

---

## 4. Cadence — למה הגלילה מרגישה “מעולם אחר”

### 4.1 מבנה מדוד

ב־desktop `1440×900` נמדד מסע בגובה וירטואלי של כ־`50,972px`:

| אזור | גובה בקירוב | חלק מהמסע | תפקיד קצבי |
|---|---:|---:|---|
| Hero | `900px` | `1.8%` | פתיחה מיידית |
| Reel / statement | `2,532px` | `5.0%` | האצה ראשונה |
| Featured work | `3,321px` | `6.5%` | הוכחה + נשימה |
| Signature sequence | `39,855px` | `78.2%` | המערכה הקולנועית העיקרית |
| End CTA | `3,150px` | `6.2%` | התכנסות והמרה |
| Footer | `900px` | `1.8%` | רגיעה |
| Next-page rail | `313px` | `0.6%` | מעבר route |

המסקנה אינה שעלינו לייצר `40,000px` של גלילה. המסקנה היא ש־Lusion מקדישה את רוב זמן המשתמש ל־**סיפור מרכזי אחד**, במקום לחלק את תשומת הלב באופן שווה בין עשרות סקשנים.

### 4.2 תגובת הגלילה שנמדדה

באתר הייחוס:

- `body` נשאר בגובה viewport (`900px`) עם `overflow: hidden`.
- `#ui` וה־canvas קבועים; `#page-container` זז ב־transform כגלילה וירטואלית.
- אירוע wheel של כ־`160px` יצר תרגום חזותי של כ־`320px`.
- כ־`70%` מהתנועה הושלמו סביב `50ms`.
- כ־`87%` הושלמו סביב `100ms`.
- ההתייצבות המלאה נמשכה בקירוב עד `550ms`.

התחושה מתקבלת משילוב של **תגובה מיידית + זנב easing ארוך**, לא מהשהיה לפני התנועה.

### 4.3 תרגום נכון ל־V2

אין צורך להעתיק את ה־scroll hijack. `useMotionDirector` כבר נותן בסיס בטוח יותר:

- native scroll נשאר מקור האמת.
- smoothing חזותי בטווח `80–120ms` מספק response איכותי.
- keyboard, programmatic navigation ו־reduced motion נשארים מיידיים.
- semantic tracks/windows מאפשרים לביים beats ללא תלות ב־pixel offsets קשיחים.

כדי להגיע לאותה תחושה, יש לשנות את **מה שמתרחש במהלך ההחלקה**, לא להחליף את מנגנון הגלילה:

1. כל `data-cinema-track` חייב להכיל 3–5 שינויים מובחנים, לא reveal אחד.
2. גבול בין tracks חייב לכלול handoff משותף של אובייקט/מסגרת.
3. damping צריך לשרת תנועה שכבר משמעותית; smoothing אינו יכול להציל פריים סטטי.
4. אורך כל act נקבע לפי מספר ההחלטות החזותיות שבו, לא לפי גובה תוכן שרירותי.

---

## 5. דקדוק המצלמה והאובייקט

### 5.1 חוק הגיבור המתמשך

ב־Lusion הדמות/המכשיר אינם decoration. הם מחזיקים זיכרון בין פרקים. אצלנו התפקיד הזה שייך ל־**Signal Core**.

Signal Core צריך:

- להתחיל כאובייקט שלם וברור ב־Hero.
- להיפתח ולחשוף ליבה/מערכת החלטות.
- להפוך למסגרת שדרכה נכנסים ל־NIS.
- להפוך לרשת/registry בעולם Online Converter.
- להתפצל לצמתים בעולם Emergency Protocol.
- להידחס לציר של Method.
- להירגע לטלמטריה דקה ב־Lab.
- להתכנס מחדש לסימן ברור סביב Contact.

אם בכל פרק מופיע “אפקט אחר” ללא חומר משותף, המשתמש יראה דמו של animation library. אם אותו חומר משנה תפקיד, המשתמש יחווה סיפור.

### 5.2 ארבעה סוגי תנועת מצלמה מותרים

| תנועה | משמעות | שימוש מומלץ |
|---|---|---|
| Dolly | התקרבות להבנה/ליבה | Hero → Decision Core; כניסה לפורטל פרויקט |
| Orbit / yaw | חשיפת צד חדש של אותה מערכת | מעבר בין problem, decision ו־proof |
| Reframe / projection offset | העברת מרכז הכובד בין copy, object ו־media | EN/HE, project handoff, real-media reveal |
| Roll | שבירת יציבות ברגע שיא בלבד | פעם אחת במעבר Complexity → Convergence, אם יאושר |

### 5.3 כללים

- לכל תנועת מצלמה חייב להיות הסבר נרטיבי במשפט אחד.
- אין orbit רק כדי “להראות 3D”.
- אין scale שמדמה dolly כשהפרספקטיבה אמורה להשתנות.
- שינוי silhouette חשוב יותר משינוי קטן ב־opacity.
- roll, chromatic aberration, blur ו־shatter הם סימני פיסוק נדירים.
- reverse scroll חייב לשחזר את אותה לוגיקה בכיוון ההפוך, לא לקפוץ ל־state קודם.

---

## 6. טיפוגרפיה, media ו־microinteractions

### 6.1 טיפוגרפיה שנצפתה

ב־desktop נצפו בקירוב:

- Hero: `36px / 39.6px`.
- כותרת Reel: `144px / 144px`, tracking של כ־`-2.88px`.
- Featured Work: `115.2px / 103.68px`.
- body copy: `21.6px / 30.24px`.
- UI: סביב `14px`.

השימוש אינו “כל הטקסט ענק”. יש שלוש שכבות ברורות:

1. display type שחוצה את הפריים;
2. body copy קריא ומצומצם;
3. UI שקט ומדויק.

### 6.2 תנועה טיפוגרפית

- שורות ומילים עטופות ב־overflow masks ונחשפות כחומר.
- כותרות project משתמשות בשכבות אותיות מתחלפות ל־hover.
- טקסט ענק לעיתים נחתך במכוון בקצה viewport.
- הטיפוגרפיה מתוזמנת מול האובייקט, לא נכנסת תמיד ב־fade-up אחיד.

תרגום ל־V2:

- להשתמש ב־line masks עבור 2–3 משפטי מפתח בלבד.
- ב־project titles ליצור retarget reversible בין title, category ו־proof — לא שכפול אותיות נגישות.
- אותיות דקורטיביות מרובות חייבות להיות `aria-hidden`; שם אחד נקי נשאר ב־accessibility tree.
- לתת לטיפוגרפיה לשנות scale/position/clip בהתאם ל־beat, לא להשתמש ב־opacity כערוץ הראשי.

### 6.3 Media treatment

Lusion נותנת ל־media אמיתי להיות עצום, חד ובעל משקל. אצלנו גם צריך:

- להשתמש בצילומי המוצרים האמיתיים כ־surfaces גדולים בתוך העולם.
- לא להציג screenshot בתוך card קטן אם אותו screenshot הוא ההוכחה המרכזית.
- לבצע מעבר `surface → portal → full-frame proof → surface`.
- לשמור aspect-ratio ומידות קבועות כדי למנוע CLS.
- להימנע מ־dark overlay קבוע שמחליש את המוצר רק כדי להשאיר copy קריא; במקום זאת לביים reframe או quiet zone.

### 6.4 ניווט ו־microinteractions

נצפה ב־Lusion:

- header קבוע עם Logo, sound, `Let's Talk` ו־Menu.
- Menu נפתח כ־overlay של שלושה cards.
- Hover של CTA ממלא צבע ומחליף dot בחץ.
- Hover של project מזיז חץ בכ־`43px` ומגלגל שכבות title.
- אין צורך ב־custom cursor כדי שהאתר ירגיש איכותי.

תרגום ל־V2:

- לשמור את הניווט הטקסטואלי והדו־לשוני של אביתר.
- לבנות hover אחד עשיר ומדויק לכל משפחת רכיבים, לא אפקט שונה בכל כפתור.
- כל hover חייב להיות reversible ו־retargetable.
- motion ב־pointer הוא שכבת polish; המסע חייב לעבוד גם בלי pointer.

---

## 7. עשרת העקרונות שניתן להעביר בלי להעתיק

1. **גיבור אחד לאורך כל הדרך** — Signal Core נוכח או מורגש בכל act.
2. **Shared-object transitions** — הסוף של סצנה הוא החומר שממנו נולדת הסצנה הבאה.
3. **שיא ארוך אחד** — רוב ההשקעה הולכת למערכה מרכזית רציפה, לא לגימיקים מפוזרים.
4. **מצלמה עם משמעות** — dolly, orbit, reframe ו־roll מתארים החלטה או שינוי הבנה.
5. **טיפוגרפיה כחומר** — clip, mask, scale וקומפוזיציה; לא reveal גנרי לכל פסקה.
6. **הוכחה אמיתית בגודל אמיתי** — media של המוצר תופס את הבמה.
7. **ניגוד בין שקט ל־spectacle** — שיאים עובדים רק כשיש לפניהם ואחריהם מרחב נשימה.
8. **רציפות בין routes** — מעבר לפרויקט או ל־About הוא beat במסע.
9. **Microinteraction מדויק במקום gimmick** — hover/focus איכותי עדיף על custom cursor רועש.
10. **Mobile הוא storyboard אחר** — לא crop של desktop ולא 3D דחוס לרצועה צרה.

---

## 8. מפת פערים מול V2 הנוכחי

### 8.1 מה כבר נכון

| יכולת קיימת | הערך שלה |
|---|---|
| `ExperienceShell` משותף | בסיס לרציפות בין Home ו־case routes |
| `useMotionDirector` | native-scroll director יחיד, reversible, semantic ו־route-aware |
| `data-cinema-track/window` | תשתית טובה ל־beats בלי ScrollTrigger ובלי pixel choreography קשיח |
| `SignalForgeStage` + Three.js lazy chunk | גיבור מקורי, poster-first ו־fallback בטוח |
| `EXPERIENCE_SCENE_STATES` | שפה פרמטרית למצלמה, אובייקט, אור ו־fog |
| project media אמיתי | חומר הוכחה איכותי ל־NIS, Online Converter ו־Emergency Protocol |
| מנגנוני DOM/SVG ייעודיים | Conversion aperture, registry, branching, Method spine, Lab telemetry, Contact convergence |
| case-study phases | Promise, Need, Decision, System, Tradeoffs/Proof, Outcome, Close |
| reduced/no-WebGL/Save-Data paths | בסיס נגיש ו־fail-open שאסור לאבד |

### 8.2 הפער התפיסתי

| מצב נוכחי | למה הוא עדיין מרגיש פחות קולנועי | תיקון נדרש |
|---|---|---|
| Signal Forge משתנה ברקע בין phases | לעיתים התוכן הקדמי נתפס כסקשן חדש והאובייקט רק atmosphere | לתת לאובייקט לבצע פעולה פיזית שמייצרת את ה־layout הבא |
| כל עולם כולל mechanism מקומי | mechanisms שונים אינם בהכרח סיפור אחד | לגזור את כולם מאותו Signal Core ומאותם conductors |
| screenshots בתוך stages/cards | המוצר אמיתי אך נשאר “בתוך אתר” | להפוך media ל־surface שחודר/ממלא את הפריים ברגע proof |
| הרבה כותרות גדולות | ללא rhythm היררכי הן מתחרות זו בזו | לבחור 3 display moments; שאר הכותרות שקטות יותר |
| transitions בתוך סקשנים | boundary בין סקשנים עדיין עשוי להרגיש כמו cut | לבנות overlap של 15–25% בין outgoing object ל־incoming world |
| Lab/Contact כפרקי סיום | חסר שיא פיזי ברור לפני ההתכנסות | לבנות compression/shatter/reassembly מקורי לפני Contact |
| routes קיימים ופונקציונליים | המעבר אליהם עדיין נתפס כניווט | להכין portal frame, לבצע route swap, ולהמשיך מאותו visual state |

### 8.3 פער governance שחייב הכרעה

קיים כרגע חוסר התאמה בין מסמכי החוזה לבין הקוד:

- `AGENTS.md` ו־`DEC-034` קובעים שה־WebGL והמצלמה מסתיימים ב־Act 1, ואחריהם המסע ממשיך ב־DOM/SVG בלבד.
- הקוד הנוכחי מעלה `SignalForgeStage` במצב `continuous` וממפה `EXPERIENCE_SCENE_STATES` גם ל־work, online, emergency, about, lab, contact ו־case acts.

לפני הרחבת המימוש יש לקבע החלטה מפורשת. ההמלצה כדי להגיע ליעד החזותי היא:

> **Renderer יחיד ומתמשך ב־Home, on-demand בלבד, שמקבל progress מה־Motion Director; אין renderer שני, אין loop אינסופי ואין scroll hijack. במסלולי case study משתמשים בכניסה/יציאה קצרה או poster/DOM parity, לא במערכה תלת־ממדית נוספת.**

אם החלטה זו אינה מאושרת, יש להשיג shared-object transitions מאוחרים באמצעות DOM/SVG/Canvas 2D בלבד ולכבות את נוכחות ה־WebGL לאחר handoff. אסור להמשיך במצב ביניים שבו המסמך מבטיח דבר אחד והקוד עושה דבר אחר.

---

## 9. התרגום הישיר: המסע המומלץ לאתר של אביתר

שם עבודה למסע: **Signal Core: From Complexity to Clarity**.

### Storyboard מוצע

| Beat | מצב חזותי | תפקיד התוכן | תנועה/מצלמה | fallback / reduced |
|---|---|---|---|---|
| P00 — Signal Origin | Signal Forge שלם, ליבה וקווי conductor; headline ו־CTA | מי אביתר ומה הוא הופך לתוצאה | dolly עדין + orbit קטן; pointer response מוגבל | poster מלא, headline ו־CTA ללא תלות ב־JS |
| P01 — Core Inspection | המעטפת נפתחת וחושפת decision core | Product thinking / UX / Engineering | dolly לליבה, ribbons נפתחים, copy נחתך בשכבות | 3 posters/DOM states דיסקרטיים |
| P02 — Signal Topology | conductors יוצרים שלושה נתיבים: Conversion, Growth, Complexity | מפת שלושת תחומי ההשפעה | reframe רחב; nodes נדלקים לפי beat | SVG conductor ברור, links פעילים |
| P03 — Portal Formation | שלושת הנתיבים מתקפלים לפתח אחד | handoff מהבטחה להוכחה | core נמתח למסגרת; camera מתיישרת אל הפתח | aperture DOM עם screenshot אמיתי מאחוריו |
| P04 — NIS / Conversion | המסגרת הופכת לחלון food/product; copper dominates | צורך עסקי → WhatsApp → conversion | media נעה מ־surface צדדי ל־full-frame proof; core הוא מסגרת | גלריה קריאה, screenshots ללא crop פוגעני |
| P05 — Registry / Growth | מסגרת NIS מתפרקת לתאים/כלים; indigo/light | 124 מסלולים, bilingual, privacy-first | tiles יוצאים מאותה מסגרת; camera orbit קל חושף registry | grid/DOM מלא עם סדר קריאה טבעי |
| P06 — Protocol / Complexity | registry lines מתכנסים ואז מתפצלים לענפי החלטה | הדרכה מדורגת ומערכת החלטות | dolly לתוך node; branch selection משנה עומק; no medical theatrics | תרשים branch סמנטי; הכול קריא ללא motion |
| P07 — Compression Corridor | כל הענפים נמשכים לציר אחד ארוך | המעבר מעבודות למתודולוגיה | תנועה קדימה במסדרון של signals; roll יחיד אופציונלי | קו Method אנכי/אופקי פשוט, ללא roll |
| P08 — Proof Breakout | הציר נשבר ל־fragments שהם screenshots, metrics ו־decisions | הוכחות ו־tradeoffs | shards מקוריים, לא זכוכית מועתקת; כל fragment נושא proof אמיתי | cards גדולים במבנה רגיל, בלי particles |
| P09 — Method Reassembly | fragments מסתדרים ל־01/02/03 method spine | Clarify → Decide → Build/Verify | reassembly איטי; camera נעצרת | רשימה ממוספרת קריאה |
| P10 — Lab Quiet | ה־core מצטמצם לקו telemetry עדין; הרבה white space | כתיבה, ניסויים ולמידה | כמעט ללא מצלמה; parallax מינימלי בלבד | אותו layout סטטי |
| P11 — Contact Convergence | ה־telemetry חוזר לליבה אחת סביב CTA | שיחה, WhatsApp, email, LinkedIn | conductors מתכנסים; copper pulse אחד; headline ננעל | CTA מלא ומיידי, ללא המתנה |
| P12 — Next Route | הליבה נפתחת ל־portal קטן של case/next page | המשכיות | transition קצר, route swap ו־focus נכון | navigation רגיל ומיידי |

### חוקי handoff בין beats

כל מעבר חייב לענות על ארבע שאלות:

1. מהו האובייקט שנשאר על המסך לפני ואחרי הגבול?
2. כיצד תפקידו משתנה?
3. איזו החלטה/הוכחה תוכנית מוצגת בזכות השינוי?
4. מה רואה משתמש ללא motion או ללא WebGL באותו רגע?

אם אין תשובה טובה לאחת מהן, המעבר הוא decoration ולא חלק מהמסע.

### מיפוי למנגנונים הקיימים

| מנגנון קיים | תפקיד חדש בתוך הציר |
|---|---|
| Signal Forge ribbons | מעטפת הגיבור וחומר הגלם של כל המעברים |
| Conductors / JourneyField | חיבור פיזי בין עולמות; orientation בלבד ברמת ה־HUD |
| Conversion aperture | הפתח שנוצר מה־core ומוסר את הבמה ל־media של NIS |
| Online registry | אותה aperture מתפצלת לתאי מערכת/כלים |
| Protocol branching | registry connections הופכים לענפי החלטה |
| Method spine | כל הענפים נדחסים לציר עבודה אחד |
| Lab telemetry | הציר נרגע וממשיך כמדידה/למידה |
| Contact convergence | telemetry חוזר לליבה ויוצר את ה־CTA |

---

## 10. תכנון Desktop לעומת Mobile

### 10.1 מה נצפה ב־mobile של Lusion

ב־viewport `390×844`:

- Hero הפך לפורטרט ולא ל־crop ישיר של desktop.
- Hero H1 סביב `23.4px`.
- Reel title סביב `78px`.
- Featured title סביב `58.5px`.
- body סביב `16px / 22.4px`.
- gutters סביב `15px`.
- sound ו־Let's Talk הוסתרו; נשארו logo ו־menu trigger.
- גלריית העבודות הפכה לטור יחיד; שמות וחצים נשארו גלויים.

עם זאת, בבדיקת Chrome responsive האתר נשאר במצב `html.is-desktop`, ובחלק העמוק של ה־3D התקבלה רצועה צרה ולא הוכחה לחוויה ניידת מלאה. לכן אסור להשתמש באמולציית viewport בלבד כהוכחת mobile parity.

### 10.2 Mobile storyboard של V2

Mobile אינו צריך “אותה מצלמה בקטן”. הוא צריך אותה משמעות בפחות דרגות חופש:

- P00–P03: poster portrait + 3 discrete states; ללא orbit רחב.
- P04–P06: media אנכי full-width; swipe אינו חובה והגלילה נשארת טבעית.
- P07: corridor מוחלף ב־conductor אנכי עם scale/depth קל.
- P08: fragments נכנסים מלמעלה/למטה, ללא particle field.
- P09–P11: reassembly, Lab ו־Contact כ־DOM/SVG; CTA תמיד נגיש.
- landscape קטן, Save-Data, reduced motion או WebGL חלש: no-import/fallback מיידי.

### Mobile acceptance

- אין frame שבו הגיבור נהפך לרצועה צרה או crop לא מובן.
- הטקסט הראשי וה־CTA תמיד מעל fold או נגישים בגלילה אחת קצרה.
- אין horizontal overflow ב־`320px`, `360px`, `390px`, `430px`.
- כל media נבדק גם ב־portrait וגם ב־landscape.
- בדיקה סופית נעשית במכשיר iOS ובמכשיר Android פיזיים, לא רק simulator.

---

## 11. מה לא להעתיק

### נכסים ושפה חזותית

- לא להשתמש בצורות plus/cross הצינוריות של ה־Hero.
- לא להשתמש באסטרונאוט, shards זהים, stickers או מודל device דומה.
- לא לאמץ lavender shell + cobalt blue + black/white object stack.
- לא להעתיק rounded viewport, pill navigation או wording של Lusion.
- לא להעתיק reel, project imagery, fonts או sound design.

### מבנה וטכנולוגיה

- לא להעתיק scroll multiplier של `2×` או לנעול את body רק כדי לחקות תחושה.
- לא להוסיף ScrollTrigger scrub, route-local controllers או renderer שני.
- לא לבנות `40,000px` גלילה ללא הצדקה נרטיבית.
- לא להסתיר content עד ש־JS/scene נטענים.
- לא להפעיל infinite animation loop כשהפריים אינו משתנה.

### בעיות נגישות שלא מעבירים

- sound control ללא accessible name.
- project title עם ארבע שכבות אותיות שנכנסות כולן ל־accessibility tree.
- body locked ללא הוכחת keyboard/reduced-motion parity.
- רצף 3D ארוך שכמעט אינו מגובה בנרטיב DOM סמנטי.
- route transition שנשען על גלילה בלבד ללא link/focus behavior תקין.

---

## 12. שערי QA — מתי באמת אפשר לומר “באותה רמה”

### Gate A — Story continuity

- [ ] המשתמש יכול לתאר אחרי צפייה אחת: Core → שלושה עולמות → Compression → Proof → Contact.
- [ ] לכל boundary בין acts יש shared object גלוי לפני ואחרי המעבר.
- [ ] אין שני beats רצופים שעושים רק fade/translate של תוכן.
- [ ] יש שיא אחד ברור לפני Contact, ולא שיא חדש בכל סקשן.
- [ ] ה־CTA הסופי נוצר מתוך האובייקט/המסלול ולא מופיע כ־footer שרירותי.

### Gate B — Motion quality

- [ ] forward ו־reverse scroll עוברים באותה רציפות וללא snap לא מכוון.
- [ ] שינוי כיוון באמצע transition מבצע retarget מהמצב הנוכחי.
- [ ] wheel, trackpad, touch, Page Down, Home/End, keyboard navigation ו־direct hash נבדקו.
- [ ] keyboard/programmatic/reduced motion אינם מקבלים smoothing כפוי.
- [ ] אין flicker, black frame, stale transform או jump לאחר resize/font/image load.
- [ ] אין יותר מ־RAF evaluator פסיבי אחד למסע; WebGL מרנדר on-demand בלבד כשהמצב משתנה.
- [ ] אין `ScrollTrigger`, scroll hijack, renderer שני או animation loop אינסופי.

### Gate C — Visual direction

- [ ] Signal Core נשאר בעל silhouette מקורי ומובחן מ־Lusion.
- [ ] Graphite / Indigo / Copper נשמרים; אין גלישה ל־cobalt/lavender של אתר הייחוס.
- [ ] לכל עולם יש material/light behavior משלו אך אותם conductors מחברים ביניהם.
- [ ] לפחות שלושה רגעים מציגים real product media ביותר מ־60% משטח הפריים.
- [ ] יש יחס מתוכנן של quiet/spectacle; Lab ו־footer אינם מתחרים בשיא.
- [ ] type scale נשלט: לכל היותר שלושה display moments דומיננטיים במסע הבית.
- [ ] אין overlap לא מכוון בין headline, cards ו־navigation בכל breakpoint ובשתי השפות.

### Gate D — Accessibility and fail-open

- [ ] DOM semantic הוא מקור האמת; כל תוכן, link ו־CTA נגישים ללא canvas.
- [ ] `prefers-reduced-motion`, `?motion=reduce`, `?scene=off`, Save-Data ו־no-WebGL מציגים מסע מלא וקוהרנטי.
- [ ] focus order, skip link, route focus restoration ו־Back restoration תקינים.
- [ ] animated duplicate letters/shapes הם `aria-hidden`; accessible names נקיים.
- [ ] אם יתווסף sound, הוא opt-in, עם שם נגיש, מצב ברור וזיכרון העדפה.
- [ ] asset failure, dynamic-import timeout ו־context loss חוזרים ל־poster/DOM ללא תוכן חסר.
- [ ] Lighthouse Accessibility ו־Best Practices: יעד `100`; אין P0/P1 ידני פתוח.

### Gate E — Performance

- [ ] non-WebGL entry קטן מ־`250 kB gzip`.
- [ ] dynamic scene chunk קטן מ־`200 kB gzip` ואינו eagerly preloaded.
- [ ] LCP עד `2.5s` במסלול non-WebGL בתנאי mobile lab; שלוש cold runs, median והגרועה מדווחות.
- [ ] CLS עד `0.1`, יעד עבודה `≤0.05`.
- [ ] INP עד `200ms`, יעד עבודה `≤100ms` בפעולות המרכזיות.
- [ ] poster מקבל מידות קבועות ומופיע לפני frame תקין של canvas.
- [ ] DPR, geometry, texture/media decode ו־memory נבדקים ב־mobile physical.
- [ ] לאחר scroll settlement אין RAF פעיל ללא צורך; tab hidden עוצר עבודה.

### Gate F — Browser, responsive and RTL

- [ ] Chromium, Safari ו־Firefox desktop — forward, reverse, resize, route transition ו־console נקי.
- [ ] iOS Safari ו־Android Chrome פיזיים — portrait/landscape, thermal/memory ו־touch.
- [ ] EN ו־HE/RTL — framing, projection offset, type masks ו־media crop נבדקים בנפרד.
- [ ] breakpoints: `320`, `360`, `390`, `430`, `768`, `1024`, `1280`, `1440`, `1920`.
- [ ] אין horizontal overflow ואין content שנעלם מתחת ל־header.

### Gate G — Route continuity

- [ ] Home → כל case route מתחיל מאותו portal/frame שהמשתמש לחץ עליו.
- [ ] Back מחזיר ל־scroll position ול־focus המקוריים.
- [ ] direct load ו־refresh מציגים content מיד, ללא תלות במעבר קודם.
- [ ] route swap אינו מעכב URL, title, landmarks או focus עבור animation.
- [ ] next-route rail הוא link אמיתי גם אם scroll מפעיל אותו חזותית.

### Gate H — Regression and isolation

- [ ] כל חוזי V2 עוברים, כולל build-budget test.
- [ ] legacy `npm run validate` עובר ללא שינוי artifacts/24 routes.
- [ ] production הישן אינו מייבא assets, CSS או bundle של V2.
- [ ] הוספת פוסט חדש ממשיכה להזין את שתי החוויות מאותו מקור אמת.
- [ ] אין deployment, domain switch או replacement ללא אישור מפורש.

### Gate I — Visual regression evidence

יש לשמור לכל act את המצבים הבאים:

- `enter` — `sceneProgress=0`.
- `focus` — `sceneProgress≈0.5`.
- `exit/handoff` — `sceneProgress=1`.

עבור desktop `1440×900`, mobile `390×844`, EN ו־HE. בנוסף:

- צילום transition אחד בין כל שני acts, לא רק midpoint של סקשנים.
- צילום fallback ללא canvas.
- צילום reduced motion.
- capture וידאו רציף של forward + reverse; screenshots לבדם אינם מוכיחים cadence.

---

## 13. Definition of Done לחוויה

החוויה אינה “מוכנה” כאשר:

- כל הסקשנים קיבלו אנימציה.
- build עובר.
- ה־Hero מרשים.
- יש canvas שפועל לכל אורך העמוד.

החוויה מוכנה רק כאשר:

1. כל beats מחוברים באובייקט משותף ובסיבה נרטיבית.
2. שלושת הפרויקטים מקבלים עולם מובחן והוכחה אמיתית בגודל משמעותי.
3. השיא המאוחר עובד באותה איכות כמו ה־Hero.
4. Contact הוא תוצאה של המסע.
5. mobile, reduced motion ו־no-WebGL מספרים את אותו סיפור בלי לחקות את אותה מצלמה.
6. forward, reverse, routes, EN/HE ו־failure paths עברו ראיות runtime.
7. budgets, legacy regression והפרדת production עברו.
8. אביתר נתן אישור חזותי מפורש על מסע מלא, לא על frame בודד.

---

## 14. סדר ביצוע מומלץ

1. **לקבע החלטת rendering:** WebGL persistent יחיד או Act 1 בלבד.
2. **לנעול storyboard P00–P12:** ללא קוד נוסף עד שכל handoff מתואר באובייקט, משמעות ו־fallback.
3. **לבנות animatic גס:** primitives בלבד, בלי polish; לבדוק cadence forward/reverse.
4. **להוכיח את המעבר הקשה ביותר:** P06 → P07 → P08 → P09.
5. **לחבר real media:** NIS, Online ו־Protocol כ־surfaces, לא כקישוט.
6. **לכוון quiet/spectacle:** להסיר motion שאינו משרת את הציר.
7. **לבנות mobile storyboard עצמאי.**
8. **לחבר route handoffs.**
9. **להריץ performance/failure/accessibility gates.**
10. **לצלם מסע מלא ולהשוות מול יעד ה־craft, לא מול pixels של Lusion.**

---

## 15. אינדקס צילומי הייחוס

כל הקישורים יחסיים למסמך זה.

| קובץ | מה הוא מתעד | שימוש בתכנון |
|---|---|---|
| [01-hero-approved.jpg](./reference/01-hero-approved.jpg) | Hero מלא: statement, controls וחלון 3D | היררכיה, חלוקת copy/visual, פתיחה שקטה |
| [01-hero.jpg](./reference/01-hero.jpg) | וריאציית capture של ה־Hero | בדיקת עקביות/תזמון capture |
| [01-hero.png](./reference/01-hero.png) | אותו Hero בפורמט PNG | מקור השוואה lossless; אין צורך להשתמש באתר |
| [02-hero-collapse.jpg](./reference/02-hero-collapse.jpg) | התקרבות האובייקטים בתוך חלון ה־Hero | שינוי scale/depth לפני handoff |
| [03-intro-reveal.jpg](./reference/03-intro-reveal.jpg) | סוף ה־Hero ותחילת `Bold Ideas` באותו פריים | overlap בין outgoing ל־incoming act |
| [04-statement.jpg](./reference/04-statement.jpg) | כותרת display ענקית, copy וקו כחול | type hierarchy ו־negative space |
| [05-approach.jpg](./reference/05-approach.jpg) | statement מתקדם, media window ו־CTA | שילוב type, curve, media ופעולה |
| [06-reel-shift.jpg](./reference/06-reel-shift.jpg) | ה־media/reel נע בתוך ההצהרה | shared frame ותנועת media |
| [07-featured-transition.jpg](./reference/07-featured-transition.jpg) | Reel כמעט full-frame עם PLAY | media dominance וכניסה לשיא קצר |
| [08-featured-title.jpg](./reference/08-featured-title.jpg) | Reel במצב ממורכז וממוסגר | scale, crop ו־focal point |
| [09-featured-work.jpg](./reference/09-featured-work.jpg) | Reel full-bleed עם image/video שונה | הוכחת craft באמצעות תוכן אמיתי |
| [10-featured-header.jpg](./reference/10-featured-header.jpg) | מעבר/חיתוך נוסף בתוך רצף ה־Reel | קצב שינויי media תוך שמירת אותה במה |
| [11-work-heading.jpg](./reference/11-work-heading.jpg) | frame נוסף ב־Reel עם typography חוצה מסך | continuity בין תוכן משתנה ל־UI קבוע |
| [12-featured-entry.jpg](./reference/12-featured-entry.jpg) | כניסת `Featured Work` והגלריה | decompression אחרי Reel |
| [13-project-grid.jpg](./reference/13-project-grid.jpg) | שורת הפרויקטים הראשונה | grid, labeling ו־media density |
| [14-project-grid-rhythm.jpg](./reference/14-project-grid-rhythm.jpg) | שתי שורות בתוך grid | קצב אנכי, gutters ו־thumbnail scale |
| [15-late-journey.jpg](./reference/15-late-journey.jpg) | המשך גלריית הפרויקטים | עקביות לאורך תוכן ארוך |
| [16-late-projects.jpg](./reference/16-late-projects.jpg) | פרויקטים מאוחרים בגלריה | שמירת quality/density גם אחרי foldים רבים |

---

## 16. סיכונים פתוחים

| סיכון | חומרה | טיפול נדרש |
|---|---|---|
| להוסיף עוד motion בלי לחזק continuity | גבוהה | לאשר handoff map לפני polish |
| WebGL persistent מול DEC-034 | סגור מקומית | `DEC-035` החליף את המגבלה; renderer יחיד, lifecycle ו־budget נבדקו |
| חיקוי יתר של Lusion | גבוהה | originality review על silhouette, palette, IA ו־camera beats |
| media אמיתי אך כהה/קטן מדי | בינונית־גבוהה | full-frame proof states ו־contrast QA |
| desktop מרשים, mobile דחוס | גבוהה | storyboard עצמאי + שני מכשירים פיזיים |
| שיא מאוחר חלש מה־Hero | גבוהה | prototype ראשון דווקא של P06–P09 |
| עומס טיפוגרפי/overlap | בינונית־גבוהה | type hierarchy ו־visual regression לכל breakpoint/שפה |
| אורך גלילה מנופח | בינונית | לקשור כל scroll range למספר beats ממשי |
| ביצועים/חום/זיכרון | גבוהה | on-demand rendering, bounded geometry, physical-device profiling |
| fallback שמרגיש כמו אתר אחר | גבוהה | poster/DOM storyboard מקביל מאותו art direction |

---

## 17. משפט הכיוון הסופי

> לא לבנות עמוד עם אנימציות. לבנות מערכת אחת שמתפרקת, הופכת לשלושה מוצרים אמיתיים, נדחסת להבנה אחת ומתכנסת להזמנה לשיחה — כאשר כל גלילה משנה את המשמעות של אותו חומר.

זהו העיקרון שצריך להנחות כל החלטת עיצוב, קוד ו־QA מכאן.

---

## 18. סטטוס מימוש בעקבות האודיט

האודיט הומר ל־`DEC-035` ומומש ב־V2 המבודד:

- `useMotionDirector` הוא בעל הגלילה היחיד: native scroll, ‏damping של `100ms`, ‏RAF מותנה ו־progress דטרמיניסטי.
- `SignalForgeStage` אחד נשאר mounted ב־`ExperienceShell` ומקבל `sceneProgress` מקומי בכל 10 פרקי ה־Home ובכל 7 acts של חדרי הראיות.
- ה־Home נבנה כ־sticky cinematic spine עם Signal Core, טיפוגרפיה בקנה מידה גדול, contrast בין עולמות ומדיית מוצר אמיתית.
- שלושת חדרי הראיות משתמשים בבמת מדיה persistent; ב־NIS ה־capture מתחלף בהדרגה לגלריית proof אמיתית.
- ה־renderer אוחד ל־scheduler יחיד; interpolation כותב ישירות ל־rig; מעובדים רק active/adjacent tracks; snapshot/event ממוחזרים, writes נשמרות ב־cache ו־diagnostics נדגמים; במנוחה `activeRafCount=0`.
- forward→reverse באותו `scrollY=1300` החזיר בדיוק `sceneProgress=0.6226`, ‏`yaw=12.5989`, ‏`dolly=0.9320` ו־`scale=1.0272`.
- desktop `1280×720`, ‏mobile `390×844`, ‏RTL, no-WebGL ו־reduced motion עברו runtime QA ללא overflow אופקי.
- V2 עבר `12/12` חוזים; build אחרון: CSS `20.04 KB gzip`, entry `109.33 KB gzip`, scene `172.17 KB gzip`. ה־legacy עבר `18/18` tests ויצר 24 routes.

השוואות same-viewport שנבדקו יחד:

- [Hero: מקור מול V2](./comparison-hero.jpg)
- [Statement: מקור מול V2](./comparison-statement.jpg)
- [Hero חי עם WebGL לאחר ה־QA הסופי](./local/35-final-live-webgl-hero.jpg)
- [Hero נייד `390×844` לאחר הכיול הסופי](./local/34-final-mobile-hero.jpg)

מה נשאר פתוח ואינו מוצג כהצלחה:

- אישור חזותי מפורש של אביתר למסע המלא (`CIN-007`).
- בדיקת מכשיר mobile פיזי (`PRO-008`).
- Core Web Vitals מלא ל־candidate החדש ו־slow-network/failed-asset injection (`QA-003`, ‏`QA-006`).
- אין deployment ואין שינוי ב־production.
