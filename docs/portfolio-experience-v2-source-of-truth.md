---
title: Portfolio Experience V2 — Source of Truth
status: active
phase: 6
owner: Evyatar Hazan
created: 2026-07-14
updated: 2026-07-17
reference: https://lusion.co/
---

# Portfolio Experience V2 — מקור אמת

מסמך זה הוא מקור האמת היחיד לתכנון, בנייה, בדיקה ואישור של חוויית הפורטפוליו החדשה. המטרה היא לפתח חוויה מקורית ברמת polish, motion ו־visual storytelling המזוהה עם אתרים דוגמת Lusion, בלי להעתיק את המותג, הנכסים או השפה הייחודית שלהם.

המסמך מתעד החלטות, משימות, קריטריוני הצלחה, רגרסיות, סיכונים ושערי אישור. שינוי שאינו מתועד כאן אינו נחשב החלטה מאושרת.

## 1. מצב נוכחי

| שדה | ערך |
|---|---|
| שלב פעיל | Phase 6 — Cinematic Spine + Full Writing Journey נפרס כ־cloud preview מבודד ועבר smoke חי; `PRO-008`, ‏`QA-003`, ‏`QA-006` ו־`QA-008` עדיין פתוחים |
| מצב כללי | `REG-022`–`REG-044` תוקנו ו־V2 עבר `22/22` + `2/2`. ה־Home החי כולל 12 פרקים, 3+4 פרויקטים, 7 קבוצות יכולת, Blog פנימי עם 16 פוסטים בכל שפה ו־Contact מלא. ריצת `DEC-041` הראשונה שמרה בהצלחה על פריסת ה־legacy אך חשפה את `REG-046` ב־V2 clean checkout; התיקון עבר reproduction נקי וממתין לריצת CI חוזרת. לא בוצעה החלפת production |
| האתר הקיים | פעיל, קנוני וממשיך להתפרסם דרך ה־build, הנתיבים ושני יעדי הפריסה הקיימים ללא שינוי |
| Experience V2 | preview מבודד ב־Cloudflare Pages מתוך `experiments/portfolio-experience-v2/`; אינו canonical ואינו מחליף את production |
| יעד ה־V2 | חוויה מקורית ברמת הבימוי, הרציפות, האסתטיקה וה־craft של Lusion, ללא העתקת המותג או הנכסים |
| פריסת preview | project `evyatar-portfolio-v2`; branch `preview`; deployment חי אחרון `5c19c20e-1055-4b1d-bcee-aa0b70b43b50`; Direct Upload ללא Git provider, עם GitHub Actions automation שהוגדר לפי `DEC-041` וממתין לאימות חי ראשון |
| תת־דומיין preview | `https://experience.evyatarhazan.com/`; ‏DNS proxied, ‏TLS 1.3, validation ו־verification במצב `active` |
| אישור להחלפת production | לא ניתן |
| המשימה הבאה | אישור חזותי למסע החי ב־`experience.evyatarhazan.com`, בדיקת מכשיר mobile פיזי, Core Web Vitals ו־slow-network/failed-asset injection, בדיקת publish של פוסט חדש, proof פרטי של NIS Studio אם תינתן גישה, ואז החלטת Release מפורשת |

## 2. כללי ברזל

1. האתר הקיים הוא ה־production הקנוני עד אישור החלפה מפורש של אביתר.
2. ממשיכים להוסיף לאתר הקיים פוסטים, פרויקטים, תיקוני SEO ותיקוני תוכן כרגיל.
3. Experience V2 נבנה במקביל ובבידוד. הוא אינו רשאי לשנות את ה־build, הנתיבים או הפריסה הקיימים ללא שער אישור.
4. תוכן משותף נשמר במקור אחד בלבד. אין להעתיק ידנית פוסטים, תרגומים או נתוני פרויקטים ל־V2.
5. כל שלב מסתיים בהדגמה, בדיקות ורשימת רגרסיות לפני מעבר לשלב הבא.
6. אישור של סקיצה אינו אישור לפיתוח; אישור prototype אינו אישור לפרסום; אישור preview אינו אישור להחלפת production.
7. אין למחוק או לשכתב את היישום הקיים כחלק מעבודת V2.
8. אין להכניס assets מזויפים, placeholders קבועים או תוכן מומצא כדי ליצור רושם של מוצר עובד.
9. כל חוויה מבוססת WebGL חייבת לכלול fallback, reduced motion ותכנון מובייל נפרד.
10. שינוי החלטה מתועד ב־Decision Log עם תאריך, סיבה והשפעה.

## 3. מקורות אמת והפרדת אחריות

| תחום | מקור אמת קיים | שימוש ב־V2 | כלל סנכרון |
|---|---|---|---|
| פוסטים | `src/content/blog/metadata.ts` ל־metadata וקובצי `src/content/blog/*.mdx` לגוף המאמר | Home צורך `getLatestBlogPostMetadata(language, 3)`; נתיבי `/blog` ו־`/blog/:slug` ב־V2 טוענים את כל קובצי ה־MDX עצל; גם `blogPosts-data.ts` ו־`create-static-routes.mjs` צורכים את אותו metadata | 32/32 רשומות דו־לשוניות עוברות parity; פוסט חדש נכתב פעם אחת ונשאר באותה חוויית V2 |
| פרויקטים וקישורים | `src/data/profile.ts` לזהויות וקישורים, `src/data/portfolioExperiences.ts` לפרקי הדגל ו־`src/data/portfolioProjects.ts` ל־More Work | adapters משותפים בלבד | אין רשימת פרויקטים ידנית בתוך V2 |
| יכולות וטכנולוגיות | `src/data/portfolioCapabilities.ts` | `getPortfolioCapabilityGroups(language)` | 7 קבוצות דו־לשוניות ממקור משותף |
| SEO ודומיין | `src/data/site.ts` ו־`scripts/create-static-routes.mjs` נשארים קנוניים ל־legacy | `experience.evyatarhazan.com` הוא noncanonical ומוגן ב־meta robots וב־`X-Robots-Tag` | אין שינוי canonical לפני Release Gate |
| תרגומים | `src/locales/he.json`, `src/locales/en.json` ותוכן MDX | נשמרת זוגיות עברית/אנגלית | כל תוכן חדש נבדק בשתי השפות |
| production | jobs הקיימים ב־workflow `Validate and Deploy` מ־`main` | ממשיכים לאמת ולפרוס רק את ה־legacy ליעדים הקיימים | אין שינוי ב־build, routes, artifacts או deployment של ה־legacy |
| preview hosting | job עצמאי באותו workflow; Cloudflare Pages project `evyatar-portfolio-v2`, branch `preview` | `npm ci` ו־`npm run validate` נפרדים, ואז Direct Upload של `dist` נפרד דרך `cloudflare/wrangler-action@v3` | כל push ל־`main` אמור לעדכן את `experience.evyatarhazan.com`; כשל V2 אינו חוסם את פריסת ה־legacy ואינו מעניק אישור Release |
| מעקב V2 | מסמך זה | מקור אמת יחיד | מעדכנים סטטוס ומשימות לאחר כל סבב |

## 4. החלטות מאושרות

### DEC-001 — Parallel Build

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **החלטה:** Experience V2 ייבנה במקביל לאתר הקיים.
- **משמעות:** היישום הקיים נשאר פעיל, ניתן לתחזוקה וניתן להוספת פוסטים ותוכן לאורך כל הפרויקט.
- **איסור:** אין להחליף את עמוד הבית, נתיבי התוכן או workflow הפריסה לפני אישור Release Gate.
- **החרגה מאושרת:** `DEC-041` מתיר רק הוספת job עצמאי לפריסת ה־preview המבודד; jobs, artifacts ויעדי הפריסה של ה־legacy אינם משתנים.

### DEC-002 — Shared Content, Separate Experience

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **החלטה:** התוכן הקנוני משותף; שכבת החוויה והעיצוב של V2 מבודדת.
- **מטרה:** למנוע מצב שבו פוסט, פרויקט או תיקון תוכן צריכים להתעדכן פעמיים.

### DEC-003 — Separate Build Pipelines

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **החלטה:** `npm run build` ימשיך לבנות רק את אתר ה־legacy; ל־V2 יהיו פקודות dev/build/validate נפרדות.
- **מטרה:** למנוע מקוד או assets לא מאושרים של V2 להיכנס ל־production artifact.

### DEC-004 — Isolated Cloudflare Preview

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **החלטה:** בשלב ה־prototype יוקם פרויקט Cloudflare Pages נפרד עבור V2, ללא custom domain ועם `noindex`.
- **מטרה:** לאפשר בדיקה ואישור דרך URL מבודד שאינו משפיע על האתר החי.
- **הבהרה:** האישור הוא לארכיטקטורת ה־preview; טרם נוצר פרויקט או deployment חיצוני.
- **סטטוס מעודכן:** הוחלף חלקית על ידי `DEC-040`. דרישות הפרויקט הנפרד, הבידוד וה־`noindex` נשארות מחייבות; רק הסעיפים “ללא custom domain” ו“טרם נוצר deployment” הוחלפו.

### DEC-040 — Isolated Cloud Preview on a Dedicated Subdomain

- **סטטוס:** מאושר, מיושם ומאומת חי עבור preview.
- **תאריך:** 2026-07-16
- **החלטה:** לפרסם את Experience V2 כ־preview חיצוני מבודד בפרויקט Cloudflare Pages נפרד ועל תת־דומיין ייעודי, במקביל לאתר הקיים.
- **זהות הפריסה:** project `evyatar-portfolio-v2`; branch `preview`; deployment ראשוני `5c19c20e-1055-4b1d-bcee-aa0b70b43b50`; Direct Upload ללא Git provider. הפריסה הידנית הראשונית מוחלפת ב־CI לפי `DEC-041`.
- **דומיין:** `experience.evyatarhazan.com`; ‏CNAME proxied, ‏TLS 1.3, validation ו־verification במצב `active`.
- **היקף ההחלפה:** החלטה זו מחליפה ב־`DEC-004` רק את האיסור על custom domain ואת מצב “טרם נוצר deployment”. הפרויקט הנפרד, `noindex`, הבידוד והיעדר canonical נשארים מחייבים.
- **גבול ההרשאה:** זהו אישור ל־preview בלבד. הוא אינו סוגר את Gate 4, Gate 6 או Release Gate, אינו מאשר feature flag או החלפת production ואינו מבטל אף בדיקת QA פתוחה.
- **שמירת legacy:** האתר הקיים, שני יעדי הפרודקשן שלו, ה־build, הנתיבים, ה־SEO וזרימת פרסום התוכן נשארים ללא שינוי.

### DEC-041 — Continuous Isolated Preview from `main`

- **סטטוס:** מאושר על ידי המשתמש; הוגדר מקומית וממתין לאימות CI חי ראשון.
- **תאריך:** 2026-07-17
- **החלטה:** לשמור את קוד V2 ואת adapters התוכן המשותפים ב־`main`, ולאחר כל push להריץ ל־V2 התקנה, validation, build ו־Direct Upload אוטומטי לפרויקט `evyatar-portfolio-v2`.
- **מימוש:** job עצמאי בשם `Validate and Deploy Experience V2` בתוך `.github/workflows/ci.yml`, עם `cloudflare/wrangler-action@v3`, ‏Wrangler 4, ‏`--branch=preview` ו־commit hash של ה־push ל־`main`.
- **סיבת `preview`:** זהו ה־production branch המוגדר בפרויקט Cloudflare המבודד. ה־workflow מופעל מ־GitHub `main`, אך שולח את artifact המאומת ל־branch זה כדי לעדכן את `experience.evyatarhazan.com`.
- **בידוד כשל:** job ה־V2 אינו תלוי ב־job ה־legacy ולהפך. כשל באחת החוויות אינו מפרסם artifact לא מאומת ואינו חוסם את החוויה האחרת.
- **גבול הרשאה:** האוטומציה מעדכנת preview בלבד. היא אינה הופכת אותו לקנוני, אינה מסירה `noindex`, אינה סוגרת Gate 4/6/Release ואינה משנה את שני יעדי הפריסה של ה־legacy.

### DEC-008 — Flagship Project Selection

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **שלישיית הדגל:**
  1. `Nis Boutique Catering` — עולם העסק וההמרה.
  2. `Online Converter` — עולם המוצר, הפרטיות והצמיחה.
  3. `Emergency Protocol Diagram` — עולם המערכת והלוגיקה המורכבת.
- **סדר הסיפור:** עסק והמרה → מוצר וצמיחה → מערכת מורכבת.
- **מועמד reserve:** `United Hatzalah Shoham Branch`, אם אחד מפרויקטי הדגל לא יעמוד בחוזה התוכן והנכסים של MET-003.

### DEC-009 — Bilingual Value Proposition

- **סטטוס:** מאושר על ידי המשתמש
- **תאריך:** 2026-07-14
- **עברית:** אני הופך צרכים עסקיים ומערכות מורכבות למוצרי Web ברורים, אמינים ומוכנים לצמוח.
- **English:** I turn business needs and complex systems into clear, reliable web products built to grow.
- **טקסט תומך בעברית:** מאתר שמייצר פניות, דרך כלי שפועל בדפדפן ושומר על פרטיות ונבנה לצמוח, ועד מערכת שמפשטת לוגיקה תפעולית — אני מחבר חשיבה מוצרית, חוויית משתמש והנדסה מקצה לקצה.
- **Supporting copy in English:** From a website built to generate inquiries, through a privacy-first tool designed to scale, to a system that makes operational logic easier to follow — I connect product thinking, user experience, and end-to-end engineering.
- **CTA ראשי:** לראות את העבודה בפעולה / See the work in action.
- **CTA משני:** מתחילים שיחה / Start a conversation.

## 5. ארכיטקטורת בידוד מוצעת

מבנה הבידוד אושר על ידי המשתמש ב־2026-07-14:

```text
repository
├── src/                         # האתר הקיים והקנוני
│   ├── content/blog/            # תוכן משותף
│   ├── data/                    # נתוני אתר ופרויקטים משותפים
│   └── ...
├── experiments/
│   └── portfolio-experience-v2/ # יישום V2 מבודד
│       ├── src/
│       ├── public/
│       ├── tests/
│       └── vite.config.ts
└── docs/
    └── portfolio-experience-v2-source-of-truth.md
```

### תנאי קבלה לארכיטקטורה

- `npm run dev`, `npm run build` ו־`npm run validate` של האתר הקיים ממשיכים לעבוד ללא שינוי התנהגות.
- ל־V2 יש פקודות dev/build/validate נפרדות.
- build רגיל של production אינו כולל assets או bundles של V2.
- V2 קורא תוכן קנוני דרך שכבה מפורשת ומתועדת.
- ניתן להוסיף פוסט חדש פעם אחת ולראות אותו גם ב־legacy וגם ב־V2.
- preview של V2 אינו מאונדקס ואינו משנה canonical קיים.
- ניתן למחוק את תיקיית הניסוי בלי לפגוע באתר הקיים.

## 6. הגדרת הצלחה כוללת

Experience V2 ייחשב מוכן לשקילת החלפה רק כאשר:

- הוא מספר מסע ברור: צורך → החלטה → בנייה → תוצאה → יצירת קשר.
- לפחות שלושה פרויקטים מרכזיים מקבלים פרק חזותי אמיתי.
- ארבעת הפרויקטים הנוספים נשארים נגישים בפרק More Work ולא נעלמים מאחורי שלישיית הדגל.
- שבע קבוצות יכולת מוצגות כהוכחה משנית, ושלושת הפוסטים האחרונים מגיעים מהמקור הקנוני.
- Contact מציג WhatsApp, אימייל ו־LinkedIn מיד, וניווט ישיר נוחת במקום שבו התוכן והפעולות כבר קריאים.
- אין שימוש ב־skeletons גנריים כתחליף למדיה אמיתית.
- עברית ואנגלית מקבלות אותה רמת איכות ותוכן.
- החוויה עובדת ב־desktop ובמובייל, עם fallback למכשירים חלשים.
- כל התוכן הקיים נשאר זמין ותקין.
- כל נתיבי ה־SEO הקיימים נשארים HTTP 200 עם canonical ו־metadata תקינים.
- `npm run validate` של legacy עובר לאורך כל הפרויקט.
- בדיקות V2, ביצועים, נגישות ו־regression עוברות.
- אביתר מאשר במפורש את Design Gate, Prototype Gate, Preview Gate ו־Release Gate.

## 7. מדדי הצלחה מוצעים

היעדים הבאים הם provisional עד אישור Gate 0:

| תחום | יעד |
|---|---|
| מסר ראשוני | במסך הראשון מוצגים בבירור זהות, הצעה, קהל ופעולה הבאה; לא נדרשת כרגע בדיקת משתמשים חיצונית |
| מסע | ניתן לתאר את רצף האתר במשפט אחד ללא רשימת sections |
| פרויקטים | 3 פרויקטים מובילים כוללים בעיה, החלטה, מוצר ותוצאה |
| CTA | WhatsApp או ערוץ קשר ראשי נגיש בכל נקודת יציאה מרכזית |
| LCP | עד 2.5 שניות במסלול ללא 3D; יעד נפרד יוגדר לסצנת WebGL |
| CLS | עד 0.1 |
| INP | עד 200ms במסלול המרכזי |
| Motion | 55–60 FPS ב־desktop יעד; לפחות 40–45 FPS במובייל נתמך |
| נגישות | ניווט מקלדת, reduced motion, contrast וטקסט מחוץ ל־canvas |
| תוכן | פוסט חדש מוזן פעם אחת ונצרך בשתי החוויות |
| Legacy | אפס שינוי לא מאושר ב־routes, SEO, content או deployment |

### MET-001 — First-screen clarity

- **סטטוס:** מאושר על ידי המשתמש
- **קהל ראשי:** בעלי עסקים, יזמים וצוותים שצריכים מוצר Web או מערכת.
- **קהל משני:** מגייסים ומנהלים טכנולוגיים שבוחנים יכולת מקצועית.
- **דרישת קבלה:** לפני גלילה, ב־desktop ובמובייל, בעברית ובאנגלית, ניתן לזהות בבירור:
  1. מי הוא אביתר.
  2. אילו מוצרים ומערכות הוא בונה.
  3. למי העבודה מתאימה.
  4. מהי הפעולה הבאה — צפייה בעבודות או התחלת שיחה.
- **אופן אימות בשלב הנוכחי:** content/design review מול ארבע הדרישות לעיל.
- **לא נדרש:** גיוס אנשים לבדיקת 15 שניות במסגרת Gate 0.
- **עתידי ואופציונלי:** משוב ממשתמשים או נתוני שימוש לאחר שקיים preview שימושי.

### MET-002 — Narrative journey

- **סטטוס:** מאושר על ידי המשתמש
- **משפט המסע:** מכירים את אביתר → רואים צורך אמיתי → נכנסים לשלושה עולמות של פרויקטים → מבינים את ההחלטות שמאחורי העבודה → מקבלים הוכחה טכנית דרך ה־Lab/Blog → מתחילים שיחה.
- **דרישות קבלה:**
  1. לכל שלב בגלילה יש תפקיד סיפורי אחד וברור.
  2. שלושת הפרויקטים מוצגים כהתקדמות בתוך מסע, ולא כרשימת כרטיסים.
  3. טכנולוגיות משמשות כהוכחה משנית ואינן עוצרות את המסע.
  4. ה־Lab/Blog מחובר להחלטות וללמידה מתוך העבודה.
  5. ניתן לדלג ישירות לפרויקטים או ליצירת קשר.
  6. הסיפור נשאר מובן גם ללא motion או WebGL.
- **אופן אימות:** storyboard review, ובדיקה של אותה היררכיית תוכן ב־reduced motion וב־fallback סטטי.

### MET-003 — Flagship project chapter contract

- **סטטוס:** מאושר על ידי המשתמש
- **היקף:** שלושה פרויקטים מובילים בלבד מקבלים את הטיפול המלא בגרסה הראשונה.
- **מבנה חובה לכל פרק:**
  1. כניסה חזותית לעולם באמצעות נכס אמיתי מתוך המוצר.
  2. הבעיה והקהל שחווה אותה.
  3. החלטת המוצר המרכזית וה־tradeoff שלה.
  4. המערכת בפעולה באמצעות flow, אינטראקציה, לפני/אחרי או ארכיטקטורה מוחשית.
  5. התרומה האישית והאחריות של אביתר.
  6. תוצאה אמינה ומבוססת; אין להמציא מספרים או השפעה שלא אומתו.
  7. המשך טבעי לאתר החי, ל־case study, לקוד או לפרק הבא.
- **דרישות קבלה:**
  1. לכל פרויקט שפה חזותית משלו בתוך מערכת עיצוב אחת.
  2. מופיעים לפחות נכס אמיתי אחד ותהליך או אינטראקציה מוחשיים אחד.
  3. הטכנולוגיות מוצגות כהוכחה משנית בלבד.
  4. הפרק נשאר מובן ושמיש ב־mobile, ב־reduced motion וב־fallback סטטי.
  5. פרויקט שחסרים עבורו מידע או נכסים אמיתיים לא נכנס לשלישיית הדגל עד השלמתם.
- **אופן אימות:** content completeness matrix, asset inventory ו־storyboard review לכל אחד משלושת הפרויקטים.

## 7A. מטריצת תוכן לפרויקטי הדגל — מאושר

המטריצה אושרה על ידי המשתמש ב־2026-07-14 ומבוססת על מצב הריפוזיטוריז הנוכחי. היא אינה מאשרת טענות כמותיות, הצלחה עסקית או השפעה רפואית שלא קיימת עבורן הוכחה.

### Nis Boutique Catering — עסק והמרה

- **הבעיה:** עסק שירות מקומי צריך להציג איכות, לבנות אמון ולהוביל לפנייה ברורה בלי להעמיס מחירים, טקסט או מסלולי פעולה מתחרים.
- **החלטת המוצר:** WhatsApp הוא נתיב ההמרה הראשי; כל היררכיית התוכן, המדיה וה־CTA משרתת את המעבר מרושם ראשוני לשיחה.
- **החלטת המערכת:** להפריד בין אתר ציבורי סטטי ומהיר לבין Content Studio פרטי שמאפשר עריכת תוכן ומדיה דרך Google Sheets ו־Drive, עם schema משותף ופרסום מבוקר דרך CI.
- **Tradeoff:** אין פרסום מיידי ישירות מהדפדפן; שינוי עובר שמירת טיוטה, publish, build ו־deploy. בתמורה מתקבלים נכסים סטטיים, validation, rollback וגבול ברור בין עריכה לפרודקשן.
- **מה נבנה:** אתר RTL חי, Content Studio, מודל תוכן משותף, build-time sync, pipeline למדיה סטטית מותאמת ופריסות Cloudflare נפרדות לאתר ולסטודיו.
- **התרומה האישית:** discovery, מסגור ההמרה, קופי, חוויית האתר, ארכיטקטורת התוכן, תהליך העריכה והפרסום, בדיקות ופריסה.
- **תוצאה מותרת להצגה:** אתר חי בדומיין מותאם ומערכת שמאפשרת לבעלים לנהל טיוטות ותוכן בלי להפוך כל שינוי ידני לעבודת קוד. אין עדיין טענת conversion מספרית מאומתת.
- **הוכחה נדרשת בפרק:** Hero חי, מסלול CTA ל־WhatsApp, עריכת אזור בסטודיו, שמירת טיוטה ותרשים קצר של מסלול הפרסום.

### Online Converter — מוצר, פרטיות וצמיחה

- **הבעיה:** משתמשים טכניים צריכים לבצע המרות מהירות בלי להעלות קלט רגיש לשרת, בעוד שהמוצר צריך להיות ניתן לגילוי ולהרחבה בעברית ובאנגלית.
- **החלטת המוצר:** ההמרה מתבצעת בדפדפן; פרטיות היא חלק מה־UX ומהמסר, ולא הערת שוליים.
- **החלטת המערכת:** Astro מייצר עמודים סטטיים ו־React משמש רק לאי האינטראקטיבי של הממיר; registry מרכזי מניע כלים, תוכן, דוגמאות, FAQ, SEO וקישורים פנימיים.
- **Tradeoff:** מודל תוכן ו־build מורכבים יותר נדרשים כדי לתחזק משטח SEO גדול, אך נמנעים שרת המרה, דפים ידניים וחוסר עקביות בין כלים.
- **מה נבנה:** 124 כלי המרה בשתי שפות, קטגוריות ועמודי SEO סטטיים, המרה מקומית, canonical/hreflang/JSON-LD/sitemap, בדיקות unit ו־browser, smoke production ואנליטיקה שאינה שומרת קלט או פלט גולמי.
- **התרומה האישית:** חשיבת מוצר, ארכיטקטורת Astro/React, מודל registry, זרימת ההמרה, תוכן דו־לשוני, SEO, quality gates ופריסת Cloudflare Pages.
- **תוצאה מותרת להצגה:** מעבר מכלי קטן ל־hub חי של 124 כלים דו־לשוניים עם בסיס טכני להתרחבות. אין עדיין לטעון לצמיחת טראפיק, CTR או הכנסה עד שיש נתוני production מאומתים.
- **הוכחה נדרשת בפרק:** המרה אמיתית מקלט לפלט, החלפת שפה, מעבר בין כלי לקטגוריה, המחשת registry ובדיקת פרטיות קצרה.

### Emergency Protocol Diagram — מערכת ולוגיקה מורכבת

- **הבעיה:** פרוטוקולים מורכבים קשה להבין, לעקוב ולתחזק כאשר הם נשארים מסמך סטטי — במיוחד בסביבה של לחץ ועומס קוגניטיבי.
- **החלטת המוצר:** לספק גם מסלול step-by-step של החלטה אחת בכל רגע וגם תצוגת flow מלאה; המערכת היא כלי למידה ותמיכה ואינה תחליף לשיקול דעת רפואי.
- **החלטת המערכת:** להחזיק את לוגיקת הפרוטוקולים במודל data-driven ולבודד אותה מה־UI; בפרודקשן שכבת הקהילה פועלת דרך Cloudflare Pages Functions ו־D1, בעוד Express ו־Prisma נשארים workspace מקומי/היסטורי החולק את מודל הדומיין.
- **Tradeoff:** flow מלא נותן הקשר אך עלול ליצור עומס; step-by-step מפחית עומס אך מסתיר את התמונה הרחבה. שתי התצוגות נשמרות כדי לאפשר מעבר בין למידה לניווט ממוקד.
- **מה נבנה:** לקוח React/Vite דו־לשוני ו־RTL, פרוטוקולים מבוססי JSON, תצוגת flow, מסלול step-by-step, עזרי סימנים חיוניים, אימות ותגובות, ו־Functions/D1 בפרודקשן.
- **התרומה האישית:** ארכיטקטורת ה־monorepo והפרוטוקולים, מודל הזרימה, ממשקי הלמידה והניווט, שכבת API/קהילה, בדיקות ופריסה.
- **תוצאה מותרת להצגה:** משטח אינטראקטיבי חי שמארגן לוגיקה קלינית למסלולים ניתנים לניווט, דיון ועדכון. אין לטעון ליעילות רפואית, קיצור זמן תגובה או אימוץ מקצועי ללא מחקר ונתונים.
- **הוכחה נדרשת בפרק:** מעבר בין step-by-step ל־flow מלא, צומת החלטה אמיתי, תצוגת סימנים חיוניים, RTL ושכבת דיון או קהילה.

### פערים שחייבים להיסגר לפני Design Gate

1. להחליט אילו תוצאות איכותניות ניתן לייחס בביטחון ואילו דורשות נתונים.
2. לעדכן בהמשך את התיאורים הקנוניים ב־`src/data/profile.ts`, שמציגים כיום ארכיטקטורה ישנה מדי עבור Online Converter ו־Emergency Protocol Diagram.
3. להשלים inventory חזותי נפרד במסגרת CNT-005; קיום פיצ'ר בקוד אינו הוכחה שיש לנו asset טוב להצגה.

## 7B. Asset inventory and capture plan — מאושר

### מצב קיים

| פרויקט | נכסים קיימים שנמצאו | כשירות לפרק חזותי | פער מרכזי |
|---|---|---|---|
| Nis Boutique Catering | לוגו; 17 נושאי צילום קולינריים במספר גדלים ופורמטים; 2 סרטוני MP4 אמיתיים | גבוהה למדיה מותגית; בינונית להוכחת המוצר | חסרים capture-ים נקיים של האתר, ה־CTA, הסטודיו וזרימת הפרסום |
| Online Converter | favicon בלבד; אין screenshots או recordings שמורים | נמוכה | צריך לצלם את המוצר החי, ההמרה, הדו־לשוניות, הקטגוריות והרחבת ה־registry |
| Emergency Protocol Diagram | favicon ואייקוני boilerplate בלבד; אין screenshots או recordings שמורים | נמוכה | צריך לצלם step-by-step, flow מלא, צומת החלטה, סימנים חיוניים ושכבת קהילה |
| Portfolio repository | אין מדיית פרויקטים אמיתית מעבר ל־favicon | נמוכה | V2 יצטרך asset manifest ומדיה משותפת שאינה משוכפלת ידנית לתוך שני אתרים |

### Capture set מחייב לכל פרויקט

כל פרויקט דגל יקבל סט מינימלי עקבי:

1. **Hero still:** צילום desktop נקי של הרגע המייצג ביותר.
2. **Mobile still:** אותו ערך מוצרי ב־viewport נייד, לא crop של desktop.
3. **Interaction loop:** הקלטה אמיתית של 8–12 שניות שמראה פעולה אחת שלמה.
4. **Decision still:** מסך שממחיש את החלטת המוצר המרכזית.
5. **System proof:** capture או תרשים מבוסס־מקור שמציג את המנגנון מאחורי החוויה.
6. **Fallback poster:** frame סטטי איכותי עבור reduced motion, מכשיר חלש וכשל וידאו.

### Shot list — Nis Boutique Catering

- Hero של האתר החי עם המסר וה־CTA.
- גלילה קצרה מה־Hero לאזור שירות או אמון ועד WhatsApp.
- mobile capture של ה־CTA הנגיש.
- Content Studio: עריכת אזור תוכן או מדיה ללא פרטים רגישים.
- רצף Save draft → Publish → site update כשלושה frames אמיתיים.
- בחירה של 4–6 צילומי אוכל קיימים ושני קטעי וידאו כחומרי אווירה; אין צורך לייבא את כל הווריאנטים לתוך V2.

### Shot list — Online Converter

- המרה אמיתית מקלט לפלט בכלי מייצג.
- מצב validation או error שמראה מוצר אמין, לא רק happy path.
- מעבר עברית/אנגלית על אותו כלי.
- ניווט מכלי לקטגוריה ולכלי קשור.
- צילום mobile של פעולת ההמרה והעתקת התוצאה.
- system proof מבוסס registry שמראה כיצד כלי אחד מזין route, תוכן, FAQ ו־SEO; אין להציג קלט משתמש אמיתי.

### Shot list — Emergency Protocol Diagram

- כניסה למסלול step-by-step וצומת החלטה אמיתי.
- מעבר או השוואה בין step-by-step לבין flow מלא.
- תצוגת סימנים חיוניים או reference שימושי.
- mobile/RTL capture שמוכיח שהמסלול נשאר קריא.
- שכבת תגובות או קהילה עם נתוני demo נקיים בלבד.
- system proof של JSON protocol → UI flow → Functions/D1 community layer.
- בכל פריים יופיע disclaimer מתאים: כלי למידה ותמיכה, לא תחליף לשיקול דעת רפואי.

### סטנדרט הפקה ושמירה

- Masters: PNG לצילומי מסך; MP4 או lossless master להקלטות.
- Delivery: AVIF/WebP לתמונות ו־WebM/MP4 לווידאו, בהתאם לתמיכת הדפדפן.
- Viewports בסיסיים: `1440×900` desktop ו־`390×844` mobile; התאמות נוספות ייגזרו מה־storyboard.
- הקלטות קצרות, ללא cursor wandering, loading מקרי, notifications, פרטי התחברות, tokens או מידע אישי.
- לכל וידאו poster סטטי ולכל interaction חלופת reduced-motion בעלת אותו מסר.
- naming: `{project}-{scene}-{viewport}-{state}.{ext}`.
- כל asset יקבל מקור, תאריך capture, route, viewport, זכויות שימוש ותפקיד סיפורי ב־manifest.
- אין להשתמש ב־ImageGen במקום screenshot של מוצר. ImageGen מותר רק בהמשך עבור art-direction מקורי שאינו מתחזה לממשק או לתוצאה אמיתית.

### החלטה מאושרת

ה־capture set, ה־shot list ועקרון השימוש במדיה אמיתית בלבד אושרו על ידי המשתמש ב־2026-07-14.

## 7C. חלוקת עמוד הבית, העמודים הפנימיים וה־Lab — מאושר

החלוקה ותפקיד ה־Lab אושרו על ידי המשתמש ב־2026-07-14.

### עקרון המערכת

- **עמוד הבית הוא הסרט הקצר:** מסע אחד רציף שמספיק כדי להבין את אביתר, לראות שלוש הוכחות ולהתחיל שיחה.
- **העמודים הפנימיים הם חדרי הראיות:** עומק, ארכיטקטורה, gallery, תהליך, קוד, כתיבה וקישורים חיים.
- **הניווט הוא escape hatch:** ניתן לדלג ל־Work, ל־Lab או ל־Contact בלי להשלים את כל חוויית הגלילה.

### מה נשאר בעמוד הבית

1. **Entry / Hero:** זהות, הבטחת הערך ושני CTA מאושרים.
2. **Problem transition:** מעבר קצר מהבטחת הערך לשלושת סוגי האתגרים — המרה, צמיחה ומורכבות.
3. **שלושה Project Chapters:** לכל פרויקט מוצגים הבעיה, החלטה אחת, המוצר בפעולה, הוכחה ותוצאה מותרת. העומק המלא נשאר ב־case study.
4. **Lab / Evidence:** שלוש תובנות נבחרות בלבד שמוכיחות כיצד אביתר חושב, מקושרות להחלטות שהופיעו בפרויקטים.
5. **About קצר:** אחריות, דרך עבודה ויכולת end-to-end; ללא קורות חיים מלאים וללא wall של technologies.
6. **Final CTA:** התחלת שיחה עם WhatsApp כערוץ ראשי וערוצים חלופיים זמינים.

### מה עובר לעמודים פנימיים

- **`/projects/:projectId`:** case study מלא לכל פרויקט דגל — הבעיה, הקשר, תהליך, tradeoffs, gallery, system proof, תוצאה, קוד ואתר חי.
- **`/projects/`:** אינדקס נגיש של כל הפרויקטים, כולל פרויקטים שאינם בשלישיית הדגל; זהו ארכיון שימושי, לא חלק מרכזי במסע.
- **`/blog/`:** כל המאמרים, חיפוש או סינון עתידי וכניסה ישירה לכתיבה.
- **`/blog/:slug`:** מאמר מלא עם metadata, canonical וקריאה לעבודה קשורה כאשר קיימת התאמה אמיתית.
- **`/contact/`:** נתיב ישיר ליצירת קשר למי שאינו רוצה לעבור במסע.
- **`/privacy/`:** עמוד policy עצמאי, מחוץ לסיפור השיווקי אך נגיש מה־footer.
- **About נפרד:** לא נדרש בגרסה הראשונה; יתווסף רק אם התוכן המקוצר לא מספיק.

### תפקיד ה־Lab/Blog במסע

- ה־Blog אינו feed חדשות ואינו section של כרטיסים לפי תאריך.
- בעמוד הבית הוא ממותג כ־**Lab**: הוכחה לחשיבה, ללמידה ולהחלטות שמחזיקות אחרי ההשקה.
- מוצגות שלוש תובנות נבחרות לפי התאמה למסע, לא בהכרח שלושת הפוסטים האחרונים.
- כל תובנה עונה על שאלה אחת: **איזו החלטה מקצועית היא מוכיחה?**
- החיבור לפרויקט נעשה רק כאשר הוא אמיתי: למשל פרטיות ואנליטיקה ל־Online Converter, SEO ונתיבים חיים למוצרי Web, או תחזוקת flow למערכת מורכבת.
- פוסט חדש נכתב פעם אחת במקור הקנוני ומופיע אוטומטית באינדקס הבלוג בשתי החוויות.
- בחירה ל־Lab תתבצע דרך metadata קנוני משותף כגון `featuredInLab` ו־`relatedProjectIds`; אין רשימת פוסטים כפולה בתוך V2.

### ניווט מינימלי מוצע

- זהות / Logo
- Work
- Lab
- Contact
- Language
- נגישות ל־skip link ול־reduced motion נשמרת גם כאשר הניווט החזותי מינימלי.

### תנאי קבלה

1. אדם יכול להשלים את המסע בלי לפתוח עמוד פנימי.
2. אדם שמחפש הוכחות עמוקות יכול להגיע אליהן בלחיצה אחת מכל פרק.
3. כל route קיים נשמר או מקבל מיפוי מפורש; אין שבירת SEO או deep links.
4. עדכון פוסט או פרויקט אינו דורש עריכה כפולה ל־legacy ול־V2.
5. ה־Lab אינו מעכב את ה־CTA ואינו הופך את הבית לעמוד בלוג.
6. כל המסע נשאר מובן גם ללא motion.

## 7D. Technical guardrails — מאושר

ה־guardrails אושרו על ידי המשתמש ב־2026-07-14 ו־Gate 0 נסגר.

היעדים הבאים נגזרים מה־baseline החי. הם חלים על המסלול הראשי ללא WebGL; budget נפרד לסצנת WebGL ייקבע רק לאחר Technical Spike ולא יוכל לבטל את ה־fallback המהיר.

| תחום | Gate מחייב מוצע | דרך אימות |
|---|---|---|
| LCP | עד `2.5s` ב־mobile lab עם Slow 4G ו־CPU×4 | שלוש ריצות cold load; מדווח median והגרועה מביניהן |
| CLS | עד `0.1`, יעד עבודה `0.05` ומטה | טעינה + מסע גלילה + החלפת שפה/theme |
| INP | עד `200ms`; יעד עבודה `100ms` בפעולות המרכזיות | תרחיש אינטראקציה מבוקר; field data יחליף lab כשיהיה זמין |
| Initial JavaScript | עד `250 kB gzip` למסלול non-WebGL | build report + network transfer; קוד 3D מופרד ונטען לפי צורך |
| WebGL | אינו נטען לפני intent או לפני שהפרק דורש אותו | network trace; budget סופי נקבע ב־PRO-007 |
| Motion | יעד `55–60 FPS` ב־desktop נתמך ו־`40–45 FPS` במובייל נתמך | performance trace על המעבר הכבד ביותר; אין long tasks חוזרים |
| Accessibility | Lighthouse `98+`, אפס כשלי contrast/name ידועים, keyboard journey מלא ו־reduced motion שקול | Lighthouse, בדיקה ידנית במקלדת ו־storyboard ללא motion |
| SEO/routes | Lighthouse SEO `100`; כל 24 הנתיבים הקיימים נשארים 200 עם canonical נכון | סריקה אוטומטית בשני היעדים והשוואה ל־baseline |
| Privacy/third parties | אפס ad-tech ואפס third-party cookies ב־V2; analytics פרטיותי רק בהחלטה מפורשת | network/cookie audit ב־preview |
| Cache | assets ממוענים בתוכן מוגשים ב־long-lived immutable cache | בדיקת headers ב־preview |
| Failure modes | המסע, התוכן וה־CTA עובדים ללא WebGL, עם reduced motion ובכשל asset | בדיקות יזומות לכל מצב |

### כללי פרשנות

1. מדד טוב ב־desktop אינו מפצה על כשל במובייל.
2. score כולל אינו מסתיר כשל ידוע; כשל contrast או accessible name נשאר חוסם גם אם Lighthouse עומד ביעד.
3. אין להשוות מדידות מתנאים שונים. כל השוואת legacy/V2 תשתמש באותו viewport, network ו־CPU profile.
4. בהיעדר CrUX, לא יוצגו נתוני lab כנתוני משתמשים אמיתיים.
5. חריגה זמנית ב־prototype מותרת רק אם היא מתועדת עם בעלים, סיבה ותקופת תיקון; היא אינה עוברת Gate 6.

## 7E. Phase 2 visual directions — Signal Forge נבחר

שלושה כיוונים עצמאיים נוצרו ב־2026-07-14. סדר האפשרויות להלן תואם לסדר שבו הוצגו בשיחה; אין לשנות את המספור בלי ליצור סט בחירה חדש.

| אפשרות | שם עבודה | רעיון מארגן | מערכת חזותית | מסלול הפרויקט |
|---|---|---|---|---|
| 1 | Signal Forge | צרכים ומורכבות מתכנסים למערכת אמינה אחת | חלל graphite, אור indigo, לבן חם ונגיעת copper; פיסול שקוף מבוסס שכבות ונקודות | שלושה signals — Conversion, Growth, Complexity — מתכנסים לפרק NIS |
| 2 | Living Systems Atlas | הפורטפוליו הוא אטלס חי של החלטות, זרימות ומערכות | ivory מינרלי, דיו שחור, ירוק מחומצן, burgundy ו־signal orange; מפה רציפה וטופוגרפיה מובלטת | נתיב מערכת עובר בשלושה territories ונפתח לפרק NIS |
| 3 | Kinetic Monolith | מסה אחת משנה מצב לאורך המסע ומכילה את שלושת עולמות העבודה | void שחור, monolith אדריכלי, amber/cyan/ultraviolet וטיפוגרפיה condensed ענקית | שלוש שכבות נפתחות לפי scroll; שכבת amber פותחת את פרק NIS |

### היקף שהודגם

- Hero desktop בגודל `1440×1024`.
- הצעת ערך מאושרת ו־CTA ראשי/משני.
- ניווט Work / Lab / Contact / Language.
- רמז ברור לשלושת עולמות הפרויקטים.
- מעבר פתיחה לפרויקט Nis Boutique Catering ללא המצאת screenshot או תוצאה עסקית.

### מה אינו מאושר עדיין

- mobile frame טרם נוצר.
- typography, palette, material ו־imagery הומרו ל־tokens מחייבים ואושרו בסעיף 7F.
- motion, pointer response, reduced motion ו־fallback טרם פורטו ל־storyboard.
- טרם בוצעה בדיקת מקוריות סופית מול Lusion לכיוון נבחר.
- התמונות הן art-direction concepts בלבד; הן אינן הוכחת מוצר ואינן מאשרות שימוש בנכסים מומצאים.

### בחירת הכיוון

- **כיוון נבחר:** אפשרות 1 — `Signal Forge`.
- **תאריך בחירה:** 2026-07-14.
- **מקור:** בחירה מפורשת של המשתמש באמצעות צילום המסך של האפשרות הראשונה.
- **היקף האישור:** השפה החזותית, חלוקת ה־Hero, האובייקט הפיסולי, פלטת graphite/indigo/copper, מסלולי Conversion/Growth/Complexity והמעבר לפרק NIS.
- **אינו מאשר:** קוד, WebGL, asset סופי, motion implementation או החלפת production.
- **Visual target:** `/Users/evyatarhazan/.codex/generated_images/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/exec-c44d5c63-29f8-401d-9521-f3545dcb42d4.png`.
- שני הכיוונים האחרים נשמרים כהיסטוריית exploration בלבד ואינם מועמדים להמשך אלא אם המשתמש יפתח מחדש את ההחלטה.

### Signal Forge mobile — מאושר

- **תאריך יצירה:** 2026-07-14.
- **Visual target:** `/Users/evyatarhazan/.codex/generated_images/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/exec-af6bb6f3-e1a6-49e6-9adb-532217bac4df.png`.
- **Intent:** קומפוזיציית `390×844` ייעודית, לא crop או הקטנה של desktop.
- **היררכיה:** identity/language/menu → הבטחת הערך המלאה → supporting copy → sculpture → שני CTA → signals → תחילת פרק NIS.
- **התאמות mobile:** CTA ברוחב מלא, ניווט מצומצם, sculpture אנכי, מסלול signals קומפקטי והצצה בלבד לפרק הבא.
- **שמירת החוזה:** אין screenshot מומצא, מדד מומצא או תוצאה עסקית; כל המסר נשאר קריא גם אם sculpture מוחלף ב־poster סטטי.
- **סטטוס:** מאושר על ידי המשתמש ב־2026-07-14; `ART-003` הושלם.

## 7F. Signal Forge design tokens — מאושר

מערכת ה־tokens אושרה על ידי המשתמש ב־2026-07-14; `ART-004` הושלם.

המערכת מתרגמת את כיוון ה־desktop וה־mobile המאושרים לחוקים שניתן לבדוק וליישם. היא אינה משנה עדיין את ה־legacy ואינה מאשרת קוד.

### Typography

| Token | English | עברית | Desktop | Mobile | שימוש |
|---|---|---|---:|---:|---|
| `font-display` | Inter Variable | Noto Sans Hebrew Variable | — | — | Hero, chapter titles, CTA |
| `font-body` | Inter Variable | Noto Sans Hebrew Variable | — | — | Body, navigation, labels ו־Lab |
| `type-hero` | weight 450, tracking `-0.035em`, line-height `1.02` | weight 450, tracking `-0.02em`, line-height `1.08` | `clamp(64px, 6vw, 92px)` | `clamp(44px, 12vw, 58px)` | הבטחת הערך בלבד |
| `type-chapter` | weight 450, line-height `1.04` | weight 500, line-height `1.12` | `56px` | `38px` | שמות פרקים ופרויקטים |
| `type-h2` | weight 500, line-height `1.15` | weight 500, line-height `1.25` | `40px` | `30px` | כותרת החלטה או תוצאה |
| `type-body-lg` | weight 400, line-height `1.5` | weight 400, line-height `1.65` | `20px` | `18px` | supporting copy ופתיחת case study |
| `type-body` | weight 400, line-height `1.65` | weight 400, line-height `1.75` | `16px` | `16px` | טקסט רגיל |
| `type-label` | weight 600, tracking `0.04em` | weight 600, tracking `0` | `14px` | `14px` | ניווט, signals ומספרי פרקים |

כללי typography:

1. שתי משפחות לכל היותר, מאותה שפה צורנית; אין display font דקורטיבי נוסף.
2. עברית אינה מקבלת letter-spacing לטיני ואינה נדחסת כדי להתאים לאורך האנגלית.
3. line breaks של ה־Hero נכתבים בנפרד לכל שפה ולכל breakpoint; אין להסתמך על wrap מקרי.
4. משקל `700+` אינו חלק מהשפה. הנוכחות מגיעה מגודל, חלל וקונטרסט.
5. fallback: `Inter, system-ui, sans-serif` ו־`"Noto Sans Hebrew", Arial, sans-serif`; `font-display: swap` מחייב.
6. מקור רשמי מתוכנן: Google Fonts עבור Inter ו־Noto Sans Hebrew; לפני build תיבדק אפשרות self-hosting כדי למנוע third-party request.

### Color roles

| Token | ערך | תפקיד | יחס ניגודיות רלוונטי |
|---|---|---|---:|
| `color-void` | `#03050B` | רקע קנוני | — |
| `color-surface` | `#080D18` | אזור תוכן מעל ה־void | — |
| `color-surface-raised` | `#0E1524` | menu, fallback ו־loading surface | — |
| `color-text` | `#F2EEE7` | טקסט ראשי | `17.62:1` על void |
| `color-text-muted` | `#AAA59C` | טקסט תומך | `8.32:1` על void |
| `color-text-subtle` | `#7F7B75` | metadata בלבד, 16px ומעלה | `4.85:1` על void |
| `color-signal` | `#738BFF` | מסלולים, nodes וקישור פעיל | `6.66:1` על void |
| `color-signal-bright` | `#A6B4FF` | focus ring ו־signal מודגש | `10.28:1` על void |
| `color-copper` | `#D98A4A` | CTA ראשי ו־NIS signal | `7.19:1` מול `#110A05` |
| `color-copper-hover` | `#F2A25E` | hover/active ל־CTA | `9.81:1` מול void |
| `color-border` | `#2A3142` | separators ו־outline משני | decorative בלבד |
| `color-danger` | `#FF6B6B` | שגיאה אמיתית בלבד | ייבדק מול surface בזמן prototype |

כללי צבע:

1. `color-copper` הוא צבע הפעולה; indigo הוא צבע המערכת. אין להפוך את שניהם ל־CTA מתחרים.
2. לכל פרק מותר signal accent אחד: NIS copper, Online Converter indigo, Emergency Protocol violet מוגדר בהמשך; רק accent פעיל אחד שולט בכל viewport.
3. אין טקסט משמעותי בתוך glow. glow הוא שכבת תאורה מאחורי חומר בלבד.
4. Signal Forge הוא dark-first. אין לבצע light-mode inversion אוטומטי; חלופת light מלאה תדרוש art direction נפרד.
5. focus אינו תלוי בצבע בלבד: ring של `2px` עם offset ו/או underline/shape change.

### Material language

| Material | תיאור | שימוש מותר | איסור |
|---|---|---|---|
| `graphite-void` | שחור כחול עמוק עם grain עדין | רקע, מעברים, negative space | שחור שטוח עם starfield גנרי |
| `signal-glass` | שכבות שקופות, קווים דקים ושבירת אור indigo | sculpture, מעבר בין עולמות | glassmorphism panels או cards |
| `engineered-core` | עמודות כהות, nodes ומוליכים מדויקים | הוכחת מערכת ומורכבות | city skyline, dashboard או data מומצא |
| `copper-conductor` | קו חם שמחבר צורך לפעולה | CTA, node נבחר, פרק NIS | gradient כתום בכל המסך |
| `shadow-fabric` | משטח כהה רך שמקבל את האובייקט | poster/fallback ומעבר לפרק | texture כבד שפוגע בקריאות |

מגבלות חומר:

- blur ב־UI מוגבל; חומר תלת־ממדי יכול להשתמש ב־blur אופטי, אך הטקסט והפקדים נשארים חדים.
- glow אינו גדול מפי 1.5 מקוטר ה־node ואינו משמש מסביב לכל אלמנט.
- grain הוא `2–4%` opacity ומבוטל כאשר הוא פוגע בדחיסה, בביצועים או בנגישות.
- sculpture הוא metaphor מחבר, לא logo חדש ולא הוכחת מוצר.

### Imagery contract

1. ה־Hero משתמש ב־sculpture מקורי של Signal Forge או ב־poster שלו.
2. מרגע כניסה לפרויקט, abstraction מפנה מקום ל־capture אמיתי לפי ה־asset contract בסעיף 7B.
3. screenshot נשמר ביחס המקורי; אין skew, perspective קיצוני או crop שמסתיר את הפעולה המרכזית.
4. video loop מציג פעולה אחת אמיתית במשך 8–12 שניות, ללא cursor wandering, מידע אישי או loading מקרי.
5. כל video מקבל poster זהה במסר וכל אינטראקציה מקבלת reduced-motion equivalent.
6. אין להשתמש ב־ImageGen עבור UI, screenshot, metric, לקוח, תוצאה עסקית או הוכחת מערכת.
7. art generated מותר רק כחומר מופשט מקשר והוא מסומן ב־asset manifest כ־generated artwork.

### Shape, spacing and controls

- בסיס spacing: `4px`; הסולם המחייב הוא `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
- page gutter: `64–80px` ב־desktop, ‏`20–24px` ב־mobile.
- רוחב טקסט רגיל: עד `68ch`; supporting copy ב־Hero עד `42ch`.
- radius: `4px` ל־controls, ‏`12px` ל־media frame; אין pill-shaped default.
- touch target: לפחות `48×48px`; גובה CTA נייד לפחות `56px`.
- border: `1px`; עובי גדול יותר שמור ל־focus או state פעיל.
- CTA ראשי אחד בכל viewport; CTA משני לעולם אינו מקבל fill מתחרה.

### Acceptance criteria for ART-004

1. אותה היררכיה מתקבלת בעברית ובאנגלית ללא font שלישי.
2. כל טקסט עומד ב־WCAG AA; text/subtle אינו משמש מתחת ל־16px.
3. האובייקט נשאר מזוהה כ־Signal Forge ב־desktop, mobile ו־static poster.
4. real product media מובחנת בבירור מ־generated artwork.
5. המערכת אינה נראית כמו dashboard, cyberpunk UI או העתק של Lusion.
6. ה־tokens יכולים להיות מיוצגים בהמשך כ־CSS custom properties ללא שינוי משמעות.

## 7G. Signal Forge motion system — מאושר

מערכת התנועה אושרה במפורש ב־2026-07-14. הסעיף הוא חוזה motion מחייב ל־prototype העתידי; האישור אינו אישור להתחיל קוד או לשלב WebGL.

### Motion thesis

ה־motion מספר רעיון אחד: **אות מפוזר הופך למערכת ברורה ואז למסלול פעולה.** האובייקט אינו מסתובב כדי להרשים; הוא מגיב רק כאשר המשתמש מביע intent, חושף מבנה פנימי ומעביר את האות לפרויקט הבא.

לכל motion חייב להיות לפחות תפקיד אחד: feedback, orientation, continuity או rare delight. אם אין תפקיד — אין animation.

### חוקי יסוד

1. אין intro, splash screen, scroll hijacking או המתנה לפני הופעת המסר וה־CTA.
2. הטקסט, הניווט ושני ה־CTA מופיעים מיידית במצב הסופי. ה־Hero אינו תלוי באנימציית mount כדי להיות מובן.
3. Native scroll הוא מקור האמת; אין snap שמונע עצירה, חזרה לאחור או דילוג.
4. רק surface מרכזי אחד רשאי לבצע motion משמעותי בכל רגע.
5. UI תדיר משתמש ב־CSS transitions; choreography נדיר יכול להשתמש ב־WAAPI או motion values. `requestAnimationFrame` שמור רק לסצנת WebGL.
6. properties מותרות ל־DOM motion: `transform`, `opacity`, color ו־background-color. אין `transition: all` ואין animation של `width`, `height`, `top` או `left`.
7. keyboard navigation אינו מפעיל motion נוסף; focus מתקדם מיידית.
8. כל loop נעצר מחוץ ל־viewport וב־`document.hidden`.

### Motion tokens

| Token | ערך | שימוש |
|---|---:|---|
| `motion-instant` | `0ms` | focus, keyboard, state שחייב להיות מיידי |
| `motion-press` | `140ms` | button press ו־active feedback |
| `motion-hover` | `200ms` | color/opacity/translate קטן במכשיר pointer מדויק |
| `motion-ui` | `280ms` | menu, language swap ו־route continuity קצרה |
| `motion-reveal` | `420ms` | media reveal או section orientation |
| `motion-scene` | `720ms` | מעבר נדיר בין מצב sculpture למצב chapter |
| `motion-narrative-max` | `1000ms` | רגע illustrative יחיד; לא UI תדיר |
| `ease-enter` | `cubic-bezier(0.22, 1, 0.36, 1)` | כניסה ו־reveal |
| `ease-move` | `cubic-bezier(0.25, 1, 0.5, 1)` | תנועה על המסך |
| `ease-scene` | `cubic-bezier(0.19, 1, 0.22, 1)` | מעבר גדול ונדיר |

stagger מותר רק לקבוצת nodes או לשורות headline בעת כניסה לפרק, בטווח `30–50ms` ובסך כולל שאינו עולה על `240ms`.

### Hero states

| State | Trigger | Sculpture | DOM content | מטרה |
|---|---|---|---|---|
| `ready` | first paint | poster או scene יציבה, ללא loop חובה | headline, copy ו־CTA מלאים | מסר מיידי |
| `attention` | pointer נכנס לאזור sculpture או scroll ראשון | parallax עדין; 3–5 nodes נדלקים | ללא תזוזת טקסט | feedback ו־delight נדיר |
| `signal-route` | גלילה אל מסלול Conversion/Growth/Complexity | השכבות נפתחות מעט וה־signal זורם לצומת הפעיל | label פעיל מתחזק | orientation |
| `chapter-handoff` | פרק NIS נכנס ל־viewport | sculpture נסוגה וה־copper conductor הופך ל־chapter rail | כותרת הפרק נכנסת מאותו rail | continuity |

אין autoplay rotation קבוע. במצב מנוחה sculpture שקטה; רק flicker מינימלי או נשימה נדירה יותר מ־12 שניות תישקל ב־prototype ורק אם אינה צורכת GPU באופן קבוע.

### Pointer and touch response

- pointer משפיע על sculpture בלבד, לא על headline או controls.
- translation מרבי: `12px`; rotation מרבי: `1.5deg`; depth shift מרבי: `20px` וירטואלי.
- response retargetable וקצר, ללא spring overshoot; settling בתוך `120–180ms`.
- CTA אינו magnetic. hover הוא `translateY(-2px)` + שינוי fill/border; press חוזר ל־`0` או `scale(0.985)` למשך `140ms`.
- pointer response מופעל רק תחת `(hover: hover) and (pointer: fine)`.
- touch משתמש בגלילה טבעית וב־active feedback בלבד; אין hover-on-tap, gyroscope או drag חובה.

### Scroll journey

1. **Hero → Signals:** הציר אינו מזיז את הדף; הוא נדלק מתוך sculpture ומאריך את ה־rail כלפי הפרק הבא.
2. **Signal selection:** Conversion, Growth ו־Complexity מקבלים focus לפי המיקום הנרטיבי, אך אין צורך לגרור או לבחור כדי להמשיך.
3. **Project entry:** accent אחד משתלט; ה־global sculpture מפנה מקום למדיה אמיתית.
4. **Within project:** media reveal משרת את ההסבר — לפני/אחרי, flow או interaction — ולא מופעל שוב בכל scroll קטן.
5. **Between projects:** shared conductor נשאר רציף ומשנה accent, כדי שהמסע לא ירגיש כמו שלושה אתרים שונים.
6. **Lab → Contact:** המערכת נרגעת; signals מתכנסים ל־CTA ולא נוצר climax שני שמתחרה בפרויקטים.

הגלילה אינה ננעלת. אם המשתמש קופץ דרך Work, Lab או Contact, ה־scene מתעדכנת למצב היעד בלי לנגן את כל השלבים שדולגו.

### Menus, language and route continuity

- menu נפתח מתוך ה־trigger במשך `280ms` ב־desktop וב־mobile; exit קצר יותר, `180ms`.
- החלפת שפה אינה מעיפה טקסט הצידה. מתבצע crossfade של `120–180ms`, reflow מיידי ואז focus נשמר על אותו control.
- מעבר ל־case study משתמש ב־shared conductor וב־fade/translate של עד `12px`, במשך `280–360ms`.
- back navigation מחזיר למיקום הפרק ולמצב signal המתאים; אין restart של ה־Hero.
- ב־RTL משתנים alignment וכיוון micro-slide כאשר יש משמעות מרחבית, אך סדר הסיפור 1→2→3 אינו מתהפך.

### Loading and progressive enhancement

1. HTML, headline, navigation ו־CTA מוצגים ללא תלות ב־WebGL.
2. poster סטטי נטען לפני scene ומקבל מידות קבועות כדי למנוע CLS.
3. bundle של WebGL מופרד ונטען לאחר idle או intent; אינו חלק מ־initial non-WebGL budget.
4. בזמן טעינת scene אין spinner מרכזי ואין אחוז מזויף. poster נשאר תקין עד swap שקט.
5. אם scene אינה מוכנה בתוך `1500ms` לאחר intent, poster נשאר והמסע ממשיך ללא הודעת שגיאה פולשנית.
6. כשל asset או context loss מחזיר ל־poster ול־DOM signals בלי לאפס scroll או focus.

### Reduced motion and fallback ladder

| מצב | Sculpture | Transitions | Signals | תוצאה |
|---|---|---|---|---|
| Full | WebGL או scene אינטראקטיבית | transform + opacity | flow מדורג | החוויה המלאה |
| Reduced motion | poster סטטי | opacity בלבד עד `120ms`, או instant | nodes קבועים והדגשת state | אותו מסר ואותו סדר |
| No WebGL / context loss | AVIF/WebP poster | DOM transitions בסיסיות | SVG/DOM rail סטטי | מסע מלא ללא canvas |
| Save-Data / low capability | poster דחוס | instant states | labels ו־rail מינימלי | תוכן ו־CTA ראשונים |
| Failed media | fallback poster + alt/caption | ללא reveal תלוי asset | rail ממשיך | הפרויקט נשאר מובן |

`prefers-reduced-motion: reduce` מכבה scroll-scrub, parallax, camera motion, stagger ו־loop. אין צורך להפעיל ידנית mode נוסף כדי לקבל את החלופה.

### Performance rules

- יעד: `55–60 FPS` ב־desktop נתמך ו־`40–45 FPS` במובייל נתמך, בהתאם ל־Gate 0.
- DPR clamp מוצע ל־spike: עד `1.5` ב־desktop ועד `1.25` ב־mobile; איכות מותאמת לפני הורדת תוכן.
- scene מושהית מחוץ ל־viewport; RAF נפסק ב־hidden tab וב־reduced motion.
- `will-change` מופעל רק בזמן transform/opacity transition ומוסר ב־end.
- אין filter blur מונפש כחלק מהמסלול המרכזי; blur סטטי נשאר מתחת ל־`20px` אם נדרש.
- pointer values מעדכנים transform של האובייקט ישירות ואינם נכתבים כ־CSS variable יורש על container.
- performance spike מודד את המעבר הכבד ביותר, לא רק idle Hero.

### Acceptance criteria for ART-005

1. ניתן להסביר את תפקיד כל animation כ־feedback, orientation, continuity או rare delight.
2. המסר וה־CTA זמינים לפני scene וללא animation.
3. אין scroll hijacking, hover חובה, gyro חובה או input-dependent content.
4. reduced motion, no-WebGL ו־failed-asset שומרים אותו סדר תוכן ואת אותם נתיבי פעולה.
5. motion אינו מזיז טקסט משמעותי יחד עם pointer ואינו פוגע ב־focus.
6. כל token עומד במגבלות timing וה־performance של Gate 0.
7. הסיפור עובד גם כאשר כל motion מוחלף ב־states סטטיים.

## 7H. Originality audit מול Lusion — מאושר

בדיקת המקוריות וה־guardrails אושרו במפורש ב־2026-07-14. Gate 2 נסגר ו־Phase 3 נפתח; האישור אינו אישור לקוד או ל־prototype.

### היקף והוכחות

הבדיקה בוצעה ב־2026-07-14 מול גרסת הבית החיה של [Lusion](https://lusion.co/) ומול גרסאות ה־desktop וה־mobile המאושרות של Signal Forge. נבדקו המסך הראשון, מודל האובייקט, palette, ניווט, CTA, motion grammar, מבנה המסע ותפקיד הפרויקטים.

| הוכחה | נתיב |
|---|---|
| Lusion — מסך הבית החי | `/Users/evyatarhazan/.codex/visualizations/2026/07/14/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/originality-audit/01-lusion-live-home.png` |
| Lusion — פירוט ה־3D, ה־pills וסמן הגלילה | `/Users/evyatarhazan/.codex/visualizations/2026/07/14/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/originality-audit/04-lusion-featured-work.png` |
| Signal Forge — desktop מאושר | `/Users/evyatarhazan/.codex/visualizations/2026/07/14/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/originality-audit/02-signal-forge-desktop.png` |
| Signal Forge — mobile מאושר | `/Users/evyatarhazan/.codex/visualizations/2026/07/14/019f5f37-bd47-7fc3-b1b3-5280dc0d653c/originality-audit/03-signal-forge-mobile.png` |

### מטריצת דמיון

הציון הוא `0` ללא דמיון, `1` דמיון קטגוריאלי, `2` דמיון מורגש ו־`3` דמיון קרוב שמחייב שינוי.

| ממד | ציון | ממצא |
|---|---:|---|
| קומפוזיציה | 1 | Lusion משתמשת ב־shell בהיר וב־viewport כהה ומעוגל; Signal Forge הוא dark full-bleed עם value proposition משמאל, sculpture מימין ומסלול מסתעף בתחתית. |
| silhouette של האובייקט | 1 | Lusion מציגה ערימה של מודולים צינוריים בצורת plus; Signal Forge מציגה מעטפת ribbon רציפה סביב ליבה אנכית מוליכה. |
| palette | 2 | לשני הכיוונים יש כחול עמוק בתוך מוקד ה־3D; Signal Forge נבדלת באמצעות graphite full-bleed, copper conductor ו־warm white. זהו הסיכון המרכזי. |
| טיפוגרפיה | 1 | בשניהם headline גדול וסנס־סריפי, אך ההיררכיה, הדו־לשוניות, מיקום המסר והקצב שונים. |
| ניווט ו־controls | 0 | Lusion משתמשת ב־pill controls וב־MENU; Signal Forge משתמשת בניווט טקסטואלי, החלפת שפה ושני CTA מפורשים. |
| מסע ו־IA | 0 | Lusion נעה מ־studio statement ל־reel ולגלריית featured work; Signal Forge נעה מהבטחת ערך דרך שלושה signals לשלושה פרקי ראיות, Lab ו־Contact. |
| motion philosophy | 1 | שתיהן חוויות immersive, אך Lusion מובלת בידי spectacle; Signal Forge מחויבת ל־intent, orientation, continuity, native scroll ו־fallback סטטי. |
| mobile | 0 | Signal Forge קיבלה reflow נרטיבי אנכי עצמאי; היא אינה crop או שחזור של מבנה Lusion. |

### פסק דין

**עבר עם guardrails.** לא זוהתה העתקה ישירה של layout, assets, geometry, navigation, copy או journey. הדמיון הקיים הוא דמיון קטגוריאלי ברמת craft: headline גדול, מינימליזם, מוקד 3D וחוויה קולנועית. הסיכון היחיד ברמת ביניים הוא השילוב של אובייקט כחול־מבריק גדול עם מסר oversized; ללא משמעות מערכתית הוא עלול להיראות כמו award-site 3D גנרי.

### Originality guardrails מחייבים

1. אין להשתמש במודולים צינוריים בצורת plus/cross, בערימת אובייקטים כחול־שחור־לבן, ב־lavender shell, ב־pill navigation או ב־rounded viewport שמחקים את המסך של Lusion.
2. ה־copper conductor, שלושת הענפים Conversion/Growth/Complexity והליבה האנכית הם חתימת Signal Forge ואינם קישוט אופציונלי.
3. כל מצב של ה־sculpture חייב לייצג קשר אמיתי בין signals, החלטות או נתוני פרויקט; אין לבנות abstract 3D loop חסר משמעות.
4. מיד לאחר ה־Hero עוברים למדיה אמיתית, החלטות והוכחות מתוך המוצרים; אין reel, wall של שמות פרויקטים או gallery model שמחקים agency showcase.
5. אין להשתמש ב־`SCROLL TO EXPLORE`, בסימני plus דקורטיביים, ב־Play Reel או ב־word-by-letter motion המזוהים עם reference.
6. הדו־לשוניות, פרקי ה־case study, ה־Lab והמסלול העסקי־טכני נשארים חלק מהזהות ולא שכבה משנית.
7. ב־prototype תבוצע בדיקת side-by-side נוספת לפני אישור Gate 3; חריגה מה־guardrails היא P1 וחוסמת מעבר Gate.

### מגבלות הבדיקה

- הבדיקה משווה screenshots, DOM גלוי והחוזים המתוכננים; היא אינה טוענת לזהות קוד, shaders או states שאינם נגישים בבדיקה.
- נגישות, ביצועים, focus, reduced motion ו־WebGL fallback הם כרגע דרישות מתועדות ולא התנהגות ממומשת; הם ייבדקו רק ב־prototype.
- זהו audit עיצובי למקוריות, לא חוות דעת משפטית.

## 7I. MOT-001 — Desktop master storyboard — מאושר

רצף 12 ה־beats, חמשת ה־acts וחוקי הקצב אושרו במפורש ב־2026-07-14. `MOT-001` הושלם.

### תזה נרטיבית

המסע אינו גלריה של פרויקטים. הוא מתחיל באותות מפוזרים — צורך עסקי, צורך בצמיחה ומערכת מורכבת — ומראה כיצד אביתר הופך כל אחד מהם למוצר ברור שניתן להפעיל, לתחזק ולהמשיך לפתח.

ה־copper conductor הוא החוט הרציף: הוא מתחיל כנקודת פעולה ב־Hero, מסתעף לשלושת עולמות העבודה, עובר דרך החלטה אמיתית בכל פרויקט ומתכנס מחדש לקריאה לשיחה. ה־sculpture הגלובלי אינו נשאר מרכז הבמה לאחר הפתיחה; בכל פרק הוא מפנה מקום למדיה אמיתית מתוך המוצר.

### חוקי קצב

1. ה־storyboard מתאר רצף תוכן ו־state activation, לא scroll lock. כל אחוז או `vh` בהמשך הוא budget תכנוני בלבד.
2. כל beat עונה על שאלה אחת בלבד. אם beat דורש שתי כותרות ראשיות או שני מסרים, הוא מפוצל.
3. אין יותר משני beats רצופים ללא הוכחת מוצר אמיתית.
4. בכל viewport יש focal point אחד: sculpture, media, decision או CTA — לעולם לא כולם יחד.
5. התוכן המשמעותי קיים ב־DOM ונקרא גם אם כל state change מיידי.
6. Work, Lab ו־Contact נשארים escape hatches; דילוג מעדכן את ה־state בלי לנגן beats שדולגו.

### מפת־על

| Act | Beats | השאלה שנענית | תוצאה נרטיבית |
|---|---|---|---|
| 1 — Signal | `00–02` | מי אביתר ואילו בעיות הוא פותר? | המשתמש מבין זהות, ערך ושלושה עולמות עבודה. |
| 2 — Conversion | `03–04` | איך צורך עסקי הופך למסלול פעולה? | NIS מוכיח היררכיה, תוכן ו־WhatsApp conversion path. |
| 3 — Growth | `05–06` | איך מוצר רחב נשאר ברור, פרטי וניתן להרחבה? | Online Converter מוכיח registry, דו־לשוניות ו־privacy-first product thinking. |
| 4 — Complexity | `07–08` | איך לוגיקה מורכבת הופכת לזרימה שניתן להבין? | Emergency Protocol מוכיח step-by-step, branching ו־system architecture. |
| 5 — Proof to Action | `09–11` | האם זו שיטת עבודה שחוזרת על עצמה, ומה עושים עכשיו? | Lab, אחריות אישית ו־CTA מסיימים את המסע ללא climax חזותי נוסף. |

### Beat 00 — Immediate value

| שדה | מפרט |
|---|---|
| תפקיד | לזהות את אביתר, ההבטחה והפעולה הבאה לפני כל motion. |
| מצב נראה | identity דו־לשונית, navigation, headline המאושר, supporting copy, שני CTA ו־Signal Forge sculpture במצב `ready`. |
| focal point | ה־headline; ה־sculpture היא הוכחה לאופי המערכת ולא תחליף למסר. |
| מדיה | poster מקורי של Signal Forge; WebGL הוא enhancement בלבד. |
| motion decision | אין mount animation לטקסט. pointer יכול להדליק 3–5 nodes בלבד לאחר intent. |
| יציאה | גלילה טבעית או CTA ראשי מובילים ל־Beat 01; CTA משני עובר ישירות ל־Contact. |
| fallback | אותו layout עם poster סטטי וללא nodes פעילים. |

### Beat 01 — The unresolved signal

| שדה | מפרט |
|---|---|
| תפקיד | להמחיש שהעבודה מתחילה מצורך, לא מטכנולוגיה. |
| מסר | "Every product starts as a signal: a business need, a growth constraint, or a complex system that needs clarity." / נוסח עברי מקביל. |
| מצב נראה | ה־headline מפנה מקום למשפט קצר; הליבה של ה־sculpture נפתחת מעט ושלושה conductors מופיעים. |
| focal point | נקודת המקור המשותפת לשלושת הענפים. |
| motion decision | כן — orientation ו־continuity; rail reveal יחיד עד `420ms`, ללא scrub של הטקסט. |
| יציאה | שלושת הענפים מקבלים שמות: Conversion, Growth, Complexity. |
| fallback | rail סטטי עם שלושה labels וקשר ברור לנקודת המקור. |

### Beat 02 — Three worlds, one method

| שדה | מפרט |
|---|---|
| תפקיד | להציג את סדר המסע בלי להפוך אותו לתפריט חובה. |
| מצב נראה | שלושת signals, כל אחד עם משפט תוצאה קצר ושם הפרויקט שהוא פותח. NIS פעיל ראשון. |
| focal point | Conversion / NIS; שני הענפים האחרים נוכחים אך שקטים. |
| interaction | label יכול לקפוץ לפרק, אך המסלול ממשיך גם ללא click. |
| motion decision | highlight retargetable; אין carousel ואין forced selection. |
| יציאה | copper conductor מתארך לתוך נכס NIS אמיתי. |
| fallback | רשימה סמנטית של שלושת העולמות עם anchor links. |

### Beat 03 — NIS: desire becomes action

| שדה | מפרט |
|---|---|
| תפקיד | להכניס לעולם העסק וההמרה דרך מוצר אמיתי. |
| מסר | עסק קייטרינג צריך להפוך רושם, אמון ותיאבון לשיחה פשוטה ומהירה. |
| מצב נראה | capture אמיתי של Hero האתר לצד צילום קולינרי מאושר; ה־global sculpture נסוג. |
| focal point | hero אמיתי + WhatsApp CTA, לא צילום האוכל לבדו. |
| proof | desktop hero ו־mobile CTA capture. |
| motion decision | media reveal חד־פעמי עד `420ms`; conductor נכנס בדיוק לנקודת ה־CTA. |
| יציאה | השאלה עוברת מ"איך זה נראה?" ל"איזו החלטה מניעה פעולה?". |
| fallback | still משולב עם caption שמסביר את נתיב ההמרה. |

### Beat 04 — NIS: the conversion decision

| שדה | מפרט |
|---|---|
| תפקיד | להראות החלטה, tradeoff ומערכת מאחורי התוצאה. |
| החלטה | WhatsApp הוא נתיב ההמרה הראשי; hierarchy, media ו־CTA מתכנסים אליו. |
| tradeoff | להימנע מריבוי אפשרויות ו־feature clutter לטובת מסלול קצר וברור. |
| proof | interaction loop של CTA + capture של עריכת אזור בסטודיו + תרשים draft→publish קצר. |
| תרומה אישית | product thinking, UX, content structure ו־end-to-end implementation. |
| motion decision | ה־copper line עובר מה־CTA ל־studio state; continuity בלבד, ללא celebration. |
| תוצאה מותרת | מוצר שיווקי ברור ונתיב ישיר לשיחה; אין טענת conversion מספרית ללא נתונים. |
| יציאה | copper מתקרר בהדרגה ל־indigo והופך ל־registry line של Online Converter. |

### Beat 05 — Online Converter: breadth without chaos

| שדה | מפרט |
|---|---|
| תפקיד | להציג מוצר רחב שהאתגר שלו הוא סדר, גילוי ופרטיות. |
| מסר | עשרות כלים אינם מוצר שימושי אם המשתמש אינו מוצא במהירות את הפעולה הנכונה. |
| מצב נראה | capture אמיתי של homepage/category/tool; tiles או controls נשארים חלק מהמוצר ולא הופכים לקיר כרטיסים חדש של V2. |
| focal point | מעבר category→tool וה־input/output של כלי אחד. |
| proof | desktop conversion flow + mobile + language switch. |
| motion decision | shared conductor מתיישר ל־registry grid; אין פיזור כרטיסים תלת־ממדי. |
| יציאה | כלי אחד נפתח וממחיש שמידע נשאר במסלול מקומי/פרטי בהתאם להוכחה הקנונית. |
| fallback | שלושה stills מסודרים כרצף: discover → use → result. |

### Beat 06 — Online Converter: the growth system

| שדה | מפרט |
|---|---|
| תפקיד | לחשוף את החלטת המערכת והיכולת להוסיף ערך בלי לשבור עקביות. |
| החלטה | registry מרכזי מגדיר כלים, categories, routes, metadata ותרגומים. |
| tradeoff | יותר discipline במודל התוכן בתמורה להרחבה עקבית, SEO ותחזוקה. |
| proof | system proof של registry→route→localized UI; analytics/privacy decision only if verified. |
| תרומה אישית | product architecture, frontend system, content model ו־deployment/SEO discipline. |
| motion decision | nodes נוספים מתחברים ל־registry line; אין count-up או metric theatre. |
| תוצאה מותרת | 124 כלים דו־לשוניים רק אם המספר יאומת בזמן capture; אין טענת טראפיק או הכנסה. |
| יציאה | ה־grid מתכנס ל־decision node סגול שמוביל למערכת הרפואית. |

### Beat 07 — Emergency Protocol: complexity under pressure

| שדה | מפרט |
|---|---|
| תפקיד | להראות שהמורכבות אינה מוחבאת אלא מתורגמת למסלול החלטה קריא. |
| מסר | מידע רפואי מורכב דורש סדר צעד־אחר־צעד, context והבחנה ברורה בין למידה לשיקול דעת מקצועי. |
| מצב נראה | capture אמיתי של step-by-step flow, צומת החלטה וסימנים חיוניים; disclaimer גלוי. |
| focal point | השלב הפעיל וההחלטה הבאה, לא diagram מלא בבת אחת. |
| proof | flow recording + mobile/RTL capture. |
| motion decision | focus עובר בין nodes לפי סדר התוכן; אין autoplay שמדמה מצב חירום. |
| יציאה | המשתמש רואה כיצד branch אחד משנה את ההמשך. |
| fallback | סדרת stills ממוספרת עם branch labels וטקסט מלא מחוץ לתמונה. |

### Beat 08 — Emergency Protocol: from protocol to system

| שדה | מפרט |
|---|---|
| תפקיד | לחשוף את שכבות המערכת מאחורי הזרימה בלי להפוך את הפרק לתרשים ארכיטקטורה יבש. |
| החלטה | protocol data מופרד מה־UI; Functions/D1 מוסיפים שכבת קהילה בלי לערבב אותה בלוגיקת ההדרכה. |
| tradeoff | גבולות ברורים בין content, flow ו־community במחיר של מודל נתונים ותפעול מורכבים יותר. |
| proof | JSON protocol→UI flow→Functions/D1 community layer עם demo data נקי בלבד. |
| תרומה אישית | systems modeling, interaction design, frontend, backend integration ו־safety framing. |
| motion decision | camera metaphor אסורה בשלב זה; layers נחשפות ב־DOM continuity. camera states יוגדרו בנפרד ב־MOT-002. |
| תוצאה מותרת | כלי למידה ותמיכה שמארגן מורכבות; אין טענה ליעילות רפואית או תחליף מקצועי. |
| יציאה | שלושת accents חוזרים כשלושה signals שעברו דרך אותה שיטת עבודה. |

### Beat 09 — One operating method

| שדה | מפרט |
|---|---|
| תפקיד | לסכם את השיטה בלי לחזור על שלושת הפרויקטים. |
| מסר | Need → Decision → System → Proof → Growth. |
| מצב נראה | חמש תחנות קצרות על conductor אחד; בכל תחנה thumbnail אמיתי אחד מהפרויקטים שכבר נראה. |
| focal point | שיטת העבודה, לא technology stack. |
| motion decision | כן — continuity; signals מתכנסים פעם אחת. אין loop ואין climax שני. |
| interaction | כל תחנה יכולה לפתוח case study רלוונטי. |
| fallback | ordered list עם אותם links ו־captions. |

### Beat 10 — Lab: decisions that survive launch

| שדה | מפרט |
|---|---|
| תפקיד | להוכיח שהעבודה ממשיכה בלמידה, מדידה ותחזוקה. |
| מצב נראה | שלוש תובנות נבחרות בלבד, כל אחת מחוברת להחלטה שכבר הופיעה בפרויקט. |
| בחירה | פרטיות/אנליטיקה, SEO/real routes, ותחזוקת flow או performance — רק לפי metadata ותוכן קנוני אמיתי. |
| focal point | השאלה המקצועית שכל מאמר עונה עליה, לא תאריך הפרסום. |
| motion decision | ללא card cascade; hover/press feedback בלבד. כניסה טבעית עם document flow. |
| יציאה | CTA משני לכל ה־Lab ו־rail שממשיך ל־About. |
| fallback | אותה רשימת מאמרים ללא motion. |

### Beat 11 — Responsibility to conversation

| שדה | מפרט |
|---|---|
| תפקיד | לסגור את המסע באדם, אחריות ופעולה ברורה. |
| About קצר | אביתר מחבר חשיבת מוצר, UX והנדסה מקצה לקצה; עובד מהצורך ועד מוצר חי שניתן לתחזק. |
| מצב נראה | portrait או identity asset אמיתי אם יאושר; ללא sculpture חדש וללא wall of logos. |
| focal point | CTA ראשי ל־WhatsApp/שיחה; email ו־LinkedIn כחלופות. |
| motion decision | signals מתכנסים ל־CTA פעם אחת; CTA עצמו מקבל feedback של `140–200ms` בלבד. |
| סיום | אין footer spectacle. navigation, privacy וכל הנתיבים הנדרשים נשארים זמינים. |
| fallback | זהה כמעט לחלוטין; ההתכנסות מוחלפת ב־rail סטטי. |

### Motion decision summary for MOT-001

| Surface | האם מנפישים? | מטרה | אופי | מגבלה |
|---|---|---|---|---|
| Hero copy/navigation | לא ב־mount | בהירות | static | זמין ב־first paint. |
| Sculpture after intent | כן | feedback / rare delight | bounded transform/nodes | לא loop קבוע ולא תזוזת טקסט. |
| Shared conductor | כן | orientation / continuity | reveal/retarget | עד `420ms` ב־beat רגיל. |
| Project media | כן, פעם אחת | orientation | opacity + transform | asset אמיתי, poster ו־fixed dimensions. |
| Decision/system proof | כן במידה | continuity | state swap | לא להנפיש layout או להפוך diagram להצגה. |
| Lab | כמעט לא | feedback | hover/press | אין cascade או stagger דקורטיבי. |
| Final CTA | כן | feedback | press/hover | `140–200ms`; ללא magnetic behavior. |

### Acceptance criteria for MOT-001

1. ניתן לתאר את המסע כ־Signal → Conversion → Growth → Complexity → Proof → Conversation.
2. לכל beat תפקיד אחד, focal point אחד, proof מוגדר ויציאה טבעית.
3. כל פרויקט מקבל בעיה, החלטה, tradeoff, מערכת בפעולה, תרומה, תוצאה מותרת וקישור המשך.
4. אין יותר משני beats רצופים בלי נכס מוצר אמיתי.
5. ה־sculpture מפנה מקום למדיה אמיתית ואינו הופך ל־reel או לעולם מקביל למוצר.
6. כל motion ב־storyboard מסווג כ־feedback, orientation, continuity או rare delight.
7. המסע נשאר שלם כרשימת תוכן ו־states סטטיים; פירוט reduced motion יושלם ב־MOT-004.
8. ה־storyboard אינו קובע camera implementation, חלוקת DOM/WebGL או מסלול mobile; אלה נשארים ל־MOT-002 עד MOT-005.
9. אין טענות conversion, traffic, revenue או medical effectiveness ללא ראיה מאומתת.
10. Work, Lab ו־Contact מאפשרים דילוג ישיר בכל שלב.

## 7J. MOT-002 — Camera states and transitions — מאושר

ארבעת camera states, שלושת המעברים והחלטת `CAM-PARKED` אושרו במפורש ב־2026-07-14. `MOT-002` הושלם.

### החלטת הבימוי

המצלמה פעילה רק ב־Act 1, בזמן שהאות המופשט הופך לשלושת עולמות העבודה. קיימים שלושה מהלכי camera משמעותיים בלבד: התקרבות לליבה, פתיחת הטופולוגיה והעברת הבמה ל־NIS. מתחילת Beat 03 המצלמה נעצרת, ה־canvas מפנה את הבמה ונכסי המוצר האמיתיים מובילים את המסע.

אין camera comeback ב־Lab או ב־CTA הסופי. כך ה־3D נשאר חתימה נדירה ולא הופך ל־agency reel, רקע מתמשך או תחרות עם ההוכחות.

### Camera grammar

1. **Camera communicates structure, not excitement.** כל תנועה חושפת קשר מרחבי: ליבה, הסתעפות או handoff.
2. **No continuous scroll camera.** אין scrub של yaw, pitch או dolly לפי כל pixel בגלילה; כל state transition הוא retargetable ועצמאי.
3. **No camera on pointer.** pointer מזיז את קבוצת ה־sculpture בלבד בגבולות שאושרו; המצלמה נשארת יציבה כדי למנוע תחושת seasickness.
4. **No roll.** זווית roll היא תמיד `0°`; אין dutch angles, wobble או orbit loop.
5. **No fly-through.** המצלמה לעולם אינה עוברת בתוך geometry, דרך aperture או מאחורי הטקסט.
6. **One owner.** ה־camera rig הוא הבעלים היחיד של position/target/FOV; object response אינו כותב לאותם transforms.
7. **Content-safe framing.** ה־sculpture נשאר מחוץ ל־content safe zone; שום טקסט משמעותי אינו canvas texture.
8. **Language-aware composition.** עוגן המסך הוא `inline-end`: ימין ב־LTR ושמאל ב־RTL. geometry, lighting וסדר 1→2→3 אינם מתהפכים.

### יחידות המפרט

- `screen center` מתאר את מרכז ה־bounding box של ה־sculpture באחוזים מה־viewport.
- `frame occupancy` מתאר את רוחב וגובה ה־bounding box, לא scale של mesh מסוים.
- `dolly` הוא יחס סמנטי: `1.00` ב־Hero, ערך קטן קרוב יותר וערך גדול רחוק יותר.
- yaw/pitch הם יעדי art direction ויכוילו מול ה־asset האמיתי ב־technical spike; הם אינם Three.js constants מחייבים.
- FOV הוא יעד perspective. אין לשנות אותו בזמן pointer response.

### State CAM-00 — Hero three-quarter

| שדה | מפרט |
|---|---|
| Beat | `00 — Immediate value` |
| תפקיד | להציג אובייקט שלם, מסתורי אך קריא, בלי להתחרות ב־headline. |
| target | מרכז ה־engineered core. |
| lens | perspective מתון, יעד `34° FOV`; ללא wide-angle distortion. |
| orientation | three-quarter קבוע; yaw יעד `+16°`, pitch יעד `-4°`, roll `0°`. |
| screen center | `inline-end 27%`, block `49%`. |
| frame occupancy | עד `48vw × 70vh`; אינו חוצה את אזור ה־headline. |
| depth | foreground ribbon, core ו־rear nodes נבדלים; אין depth-of-field rack. |
| animation | אין camera mount animation. first paint הוא state סופי ויציב. |
| fallback | poster באותו crop ובאותו screen center. |

### State CAM-01 — Core inspection

| שדה | מפרט |
|---|---|
| Beat | `01 — The unresolved signal` |
| תפקיד | לחשוף שמאחורי המעטפת קיימת ליבה שמארגנת אותות. |
| target | הצומת העליון־מרכזי של ה־core, לא נקודת אור דקורטיבית. |
| lens | FOV נשאר `34°`; שינוי הקרבה נעשה ב־dolly בלבד. |
| orientation | yaw יעד `+11°`, pitch יעד `-2°`, roll `0°`. |
| screen center | `inline-end 29%`, block `48%`. |
| frame occupancy | עד `52vw × 74vh`; close-up מבוקר, ללא crop של conductor הראשי. |
| dolly | יעד יחסי `0.90` לעומת CAM-00. |
| scene change | ribbons נפתחים עד `6%–8%` מהטווח החזותי ו־3–5 nodes מקבלים state פעיל. |
| fallback | poster שני או static state שמראה core פתוח; rail labels נשארים ב־DOM. |

### State CAM-02 — Topology overview

| שדה | מפרט |
|---|---|
| Beat | `02 — Three worlds, one method` |
| תפקיד | להראות ליבה אחת שמוציאה שלושה מסלולים בלי להפוך את ה־scene למפת כוכבים. |
| target | נקודת ההסתעפות של Conversion/Growth/Complexity. |
| lens | יעד `32°–34°`; יש לבחור ערך אחד ב־spike ולא לבצע zoom animation. |
| orientation | yaw יעד `+6°`, pitch יעד `-10°`, roll `0°`; מעט יותר top-down כדי לקרוא את ההסתעפות. |
| screen center | `inline-end 31%`, block `45%`. |
| frame occupancy | עד `44vw × 62vh`; dolly out מפנה מקום ל־labels ול־NIS preview. |
| dolly | יעד יחסי `1.12`. |
| scene change | שלושת conductors גלויים; רק Conversion copper פעיל, האחרים ב־subtle state. |
| fallback | poster topology + SVG/DOM rail סמנטי; אין צורך ב־canvas כדי לבחור פרויקט. |

### State CAM-03 — NIS handoff

| שדה | מפרט |
|---|---|
| Boundary | סוף Beat 02 → תחילת Beat 03 |
| תפקיד | להעביר ownership מה־sculpture למדיה האמיתית של NIS. |
| target | conductor של Conversion בנקודת המפגש עם container המדיה. |
| lens | FOV קבוע; אין zoom-to-logo או morph לתוך screenshot. |
| orientation | yaw יעד `+4°`, pitch יעד `-8°`, roll `0°`. |
| screen center | `inline-end 13%`, block `70%`; האובייקט עובר לשוליים ולא נשאר Hero קטן. |
| frame occupancy | עד `24vw × 34vh`. |
| dolly | יעד יחסי `1.32`. |
| scene change | indigo nodes נרגעים; copper conductor ממשיך כ־DOM rail לתוך ה־WhatsApp CTA האמיתי. |
| completion | כאשר מדיית NIS יציבה, scene עוברת ל־`CAM-PARKED`; אין canvas פעיל מאחורי הפרק. |
| fallback | conductor סטטי מחבר בין topology poster לבין NIS still; אין הבדל תוכני. |

### State CAM-PARKED — Product owns the stage

| שדה | מפרט |
|---|---|
| Beats | `03–11` |
| תפקיד | לעצור spectacle ולשמור GPU, קשב והיררכיה עבור מוצר אמיתי. |
| camera | אין עדכון position/target/FOV; ה־RAF נעצר וה־canvas יכול לרדת ממצב active. |
| visible continuity | רק conductor, accents ו־DOM media ממשיכים את הסיפור. |
| project transitions | NIS→Online Converter→Emergency Protocol הם composition/DOM transitions, לא camera moves. |
| synthesis | Beat 09 משתמש ב־DOM rail וב־thumbnails שכבר הופיעו; ה־sculpture אינו חוזר. |
| Lab/Contact | ללא מצלמה וללא reactivation של WebGL. |
| back navigation | חזרה ל־Hero מציגה קודם poster ב־state המתאים; WebGL משוחזר רק לאחר readiness. |

### Transition T-01 — CAM-00 → CAM-01

| שדה | מפרט |
|---|---|
| trigger | Beat 01 חוצה activation line של כ־`35%` מגובה viewport, או anchor navigation ישיר. |
| purpose | orientation: מעבר מהשלם אל הליבה. |
| movement | dolly in `10%`, yaw קטן לכיוון core, target shift רציף. |
| duration | `720ms`. |
| easing | `ease-scene: cubic-bezier(0.19, 1, 0.22, 1)`. |
| sequencing | camera מתחילה; ribbons נפתחים אחרי `80ms`; nodes נדלקים ב־stagger כולל עד `180ms`. |
| interruption | retarget מהמצב הנוכחי; אין keyframe restart ואין snap. |

### Transition T-02 — CAM-01 → CAM-02

| שדה | מפרט |
|---|---|
| trigger | Beat 02 חוצה activation line; לא תלוי ב־click על signal. |
| purpose | orientation: מעבר מליבה אחת לטופולוגיה של שלושה מסלולים. |
| movement | dolly out `22%` ביחס ל־CAM-01, pitch לכיוון overview ו־target לנקודת ההסתעפות. |
| duration | `720ms`. |
| easing | `ease-scene`. |
| sequencing | camera מכינה את הפריים; conductors נחשפים לאחר `120ms`; label פעיל מתחזק ב־DOM. |
| interruption | reverse/retarget רציף; labels מתעדכנים מיידית גם אם camera טרם סיימה. |

### Transition T-03 — CAM-02 → CAM-03 → CAM-PARKED

| שדה | מפרט |
|---|---|
| trigger | NIS media container מתקרב ל־activation line; CTA/anchor jump מפעיל את ה־end state ישירות. |
| purpose | continuity: העברת הבמה מהמטאפורה להוכחת המוצר. |
| movement | dolly out + screen-space move ל־inline-end/bottom; ללא orbit נוסף. |
| duration | עד `900ms` עבור camera; media reveal מתחיל לאחר שרוב המסלול הושלם. |
| easing | `ease-scene`; יציאת ה־scene משתמשת באותו curve וב־`240–320ms` בלבד. |
| sequencing | 1) camera מפנה את safe zone; 2) conductor נוגע ב־media frame; 3) NIS media נהיית focal; 4) canvas נעצר. |
| interruption | חזרה למעלה retargets ל־CAM-02; לאחר parking, poster מוצג מייד לפני חידוש scene. |

### Activation and navigation rules

1. activation line הוא convention תכנוני של כ־`35%` מגובה viewport; אין scroll snapping או scrub חובה.
2. state change מתרחש פעם אחת לכיוון עד שה־beat הפעיל משתנה; jitter סביב threshold אינו מפעיל replay.
3. anchor navigation מעדכן מיד labels, focus ו־content state; camera רשאית להשלים transition בלי לעכב את התוכן.
4. גלילה מהירה שדולגת על state משתמשת בנתיב הקצר ביותר ל־state היעד; אין חובה לעבור דרך כל keyframe.
5. שינוי שפה שומר camera state; רק screen-space anchor מתהפך בין `inline-end` של LTR ו־RTL.
6. resize שומר state סמנטי ומחשב מחדש framing; אינו מתחיל transition נרטיבי חדש.

### Camera safety limits

| משתנה | מגבלה |
|---|---:|
| camera roll | `0°` תמיד |
| yaw delta במעבר יחיד | עד `10°` |
| pitch delta במעבר יחיד | עד `10°` |
| dolly delta במעבר יחיד | עד `22%` |
| FOV animation | אסור; FOV קבוע לאחר בחירת ערך ב־spike |
| pointer-camera coupling | אסור |
| autofocus / DOF rack | אסור במסלול הראשי |
| camera loop / idle orbit | אסור |
| active camera states | `4` כולל handoff; לאחר מכן `CAM-PARKED` |
| simultaneous significant motion | camera או product media — לא שניהם במלוא העוצמה |

### Reduced-motion preview for camera

החוזה המלא יוגדר ב־MOT-004, אך MOT-002 מחייב כבר עכשיו:

- `prefers-reduced-motion: reduce` מבטל את T-01 עד T-03.
- CAM-00, CAM-01 ו־CAM-02 מיוצגים כ־poster crops או state swaps מיידיים.
- המעבר ל־NIS הוא crossfade של opacity בלבד עד `120ms`, או instant.
- כל labels, links ו־media קיימים ללא תלות במעבר camera.

### Acceptance criteria for MOT-002

1. כל camera move חושף מבנה: whole→core→topology→product; אין תנועה שמטרתה spectacle בלבד.
2. קיימים שלושה transitions משמעותיים בלבד, כולם ב־Act 1.
3. CAM-PARKED פעיל לאורך Beats 03–11; הפרויקטים, ה־Lab וה־CTA אינם תלויים ב־WebGL.
4. אין roll, fly-through, camera loop, scroll scrub רציף, pointer-camera coupling או FOV animation.
5. LTR ו־RTL משתמשים באותו עולם ובאותה תאורה, אך מעבירים את ה־screen anchor ל־`inline-end` המתאים.
6. transition ניתן ל־reverse ול־retarget בלי restart ובלי לעכב focus, labels או content.
7. כל state כולל poster-equivalent crop ונתיב reduced motion.
8. ה־technical spike יכייל yaw, pitch, dolly ו־FOV מול asset אמיתי בלי לשנות את הכוונה, ה־safe zones או מספר המצבים.

## 7K. MOT-003 — DOM and WebGL ownership contract — מאושר

חוזה הבעלות, state authority, poster-first handshake, conductor seam, capability tiers ו־failure behavior אושרו במפורש ב־2026-07-14. `MOT-003` הושלם.

### עקרון העל

**ה־DOM הוא המוצר; WebGL הוא שכבת המחשה מתחלפת.** כל מידע, פעולה, ניווט, הוכחת מוצר ומשמעות נרטיבית חייבים להתקיים ב־HTML/CSS/SVG נגישים לפני טעינת scene. אם WebGL חסום, נכשל, איטי או כבוי — המשתמש מקבל אותו מסע, אותם פרויקטים ואותן פעולות.

WebGL אינו מקור אמת, אינו מנהל את הגלילה ואינו מחזיק שום דבר שהמשתמש חייב לקרוא, לבחור או להפעיל.

### Ownership matrix

| Surface / responsibility | DOM owns | WebGL may own | אסור ל־WebGL |
|---|---|---|---|
| Identity and value | שם, תפקיד, headline, supporting copy | אווירה חזותית בלבד | טקסט כ־texture או geometry |
| Navigation | Work, Lab, Contact, language, anchors, routes | כלום | hit areas, routing או focus |
| CTA | label, link/action, focus, hover/press, analytics event | glow תגובתי לא־חיוני בתוך sculpture | כפתור canvas או magnetic target |
| Signals | labels, semantic list, anchor links, active state, DOM/SVG rail | conductors פנימיים בתוך sculpture | signal שקיים רק כ־3D node |
| Story state | `activeBeat`, direction, language, preferences, capability | render של state שהתקבל | לקבוע beat לפי camera או pixels |
| Project chapters | כל copy, screenshots, video, captions, diagrams, links | כלום לאחר handoff | product UI כ־texture או fake 3D mockup |
| Lab / About / Contact | כל התוכן והאינטראקציות | כלום | background scene חוזרת או CTA בתוך canvas |
| Accessibility | headings, landmarks, names, descriptions, focus order | canvas דקורטיבי `aria-hidden` | tab stop, accessible name או live region |
| Loading / errors | poster, reserved dimensions, fallback state | `scene-ready` / `scene-failed` signal בלבד | spinner שחוסם תוכן |
| SEO / sharing | text, links, metadata, static routes | כלום | תוכן שניתן לגלות רק לאחר render |

### DOM layer contract

ה־DOM מחויב להחזיק:

1. `header`, navigation, language control וכל skip/anchor link.
2. `main` עם סדר 12 ה־beats כ־sections סמנטיים, ללא תלות ב־canvas.
3. headline, supporting copy, signal labels והסבר של כל state.
4. שני CTA ב־Hero וכל CTA בפרקי הפרויקטים וב־Contact.
5. `<picture>` או equivalent poster בגודל שמור מראש לכל scene state נדרש.
6. screenshots, recordings, captions, alt text ו־transcripts של נכסי המוצר האמיתיים.
7. DOM/SVG rail שממשיך מה־sculpture ל־NIS ומחבר בין הפרקים.
8. problem, decision, tradeoff, contribution, result ו־links לכל case study.
9. Lab, About, Contact, privacy, footer וכל הנתיבים הקנוניים.
10. loading, error, reduced-motion, Save-Data ו־no-WebGL outcomes.

### WebGL layer contract

WebGL רשאי להחזיק רק:

1. geometry של Signal Forge: ribbon shell, engineered core, internal nodes ו־internal conductors.
2. materials, lighting, shadow/reflection strategy ו־depth שאינם נדרשים להבנת התוכן.
3. `CAM-00` עד `CAM-03` ושלושת transitions שאושרו ב־MOT-002.
4. bounded pointer response על object group בלבד.
5. accent illumination של copper/indigo/violet בתוך sculpture, כהעתק חזותי ל־DOM state קיים.
6. state interpolation בתוך scene, כל עוד היא interruptible ומפסיקה ב־`CAM-PARKED`.

WebGL אינו רשאי להחזיק:

- טקסט, מספרים, project names או labels.
- focusable element, click/tap target או gesture חובה.
- screenshot, recording, diagram או product proof.
- route state, language state, scroll position או content order.
- CTA, form, contact detail או link.
- metric, chart או מידע שמחייב דיוק.
- audio, gyroscope או autoplay narrative.

### Layer stack

| Layer | תפקיד | input policy |
|---|---|---|
| `L0 — page atmosphere` | background colors, static grain/texture מאושרים | `pointer-events: none` |
| `L1 — poster/canvas` | poster תמיד קיים; canvas מחליף אותו רק לאחר readiness | canvas אינו tabbable ו־`aria-hidden="true"` |
| `L2 — decorative continuity` | DOM/SVG conductor, nodes ו־section rails | `pointer-events: none` למעט anchors נפרדים |
| `L3 — semantic content` | headings, copy, media, diagrams, project proof | input רגיל וסמנטי |
| `L4 — controls` | navigation, language, CTA, menu, media controls | תמיד מעל canvas ועם focus visible |

ה־canvas עצמו משתמש ב־`pointer-events: none`. pointer intent נקרא מה־Hero container ורק אם האירוע אינו מגיע מ־control; כך ה־scene לעולם אינה חוסמת link, selection, scrolling או focus.

### State authority

ה־DOM story controller הוא מקור האמת היחיד עבור:

- `activeBeat`
- `activeSignal`
- `readingDirection`
- `language`
- `motionPreference`
- `saveData`
- `webglCapability`
- `documentVisibility`
- `sceneLifecycle`

WebGL הוא subscriber. הוא מקבל פקודות סמנטיות בלבד:

| Command | משמעות |
|---|---|
| `setSceneState(ready | core | topology | handoff)` | מעבר בין states מאושרים |
| `setAccent(copper | indigo | violet | neutral)` | התאמת illumination ל־DOM state |
| `setPointerIntent(x, y)` | bounded object response בלבד |
| `setActive(true | false)` | הפעלה או עצירת render loop |
| `setQuality(tier)` | התאמת DPR/material/post-processing |
| `dispose()` | שחרור scene כאשר אין צורך בהמשך session |

WebGL רשאי להחזיר רק lifecycle diagnostics:

- `scene-ready`
- `scene-failed`
- `context-lost`
- `quality-degraded`

אירועים אלה אינם משנים תוכן או focus. הם רק מחליטים אם להציג canvas או להשאיר poster.

### Beat ownership map

| Beats | DOM | WebGL | תוצאה ללא WebGL |
|---|---|---|---|
| `00` | identity, value, nav, CTA, poster | sculpture ב־CAM-00 + pointer response | Hero מלא עם poster |
| `01` | unresolved-signal copy, three labels, rail | core reveal ב־CAM-01 | poster crop + labels |
| `02` | semantic signal list, anchors, active Conversion state | topology ב־CAM-02 | topology poster + DOM/SVG rail |
| `02→03` | NIS media container, heading, conductor endpoint | CAM-03 handoff בלבד | crossfade poster→NIS media |
| `03–04` | NIS chapter והוכחות | `CAM-PARKED` | זהה למסלול המלא |
| `05–06` | Online Converter chapter והוכחות | none | זהה למסלול המלא |
| `07–08` | Emergency Protocol chapter והוכחות | none | זהה למסלול המלא |
| `09` | method rail + real thumbnails | none | זהה למסלול המלא |
| `10` | Lab | none | זהה למסלול המלא |
| `11` | About, Contact, footer | none | זהה למסלול המלא |

### Poster-first handshake

1. DOM, copy, controls וה־poster נצבעים ראשונים עם dimensions קבועים.
2. WebGL bundle אינו חוסם HTML, fonts, primary CTA או poster.
3. scene נטענת לאחר idle או intent בהתאם לחוזה loading העתידי.
4. canvas נשאר שקוף/מוסתר עד `scene-ready` ולאחר שהפיק frame תקין באותו crop.
5. poster→canvas הוא crossfade קצר עד `180ms`; אין flash שחור ואין שינוי layout.
6. אם scene אינה מוכנה בתוך `1500ms` לאחר intent, poster נשאר וה־DOM ממשיך ללא הודעת שגיאה פולשנית.
7. ב־context loss או asset failure, poster חוזר מיידית; scroll, focus ו־content state אינם משתנים.
8. לאחר CAM-03, poster/canvas יורדים מהבמה; scene עוברת ל־parked או disposed בלי להזיז את NIS media.

### Conductor seam contract

החיבור בין WebGL conductor ל־DOM/SVG rail הוא seam חזותי, לא תלות runtime:

1. DOM מגדיר `handoffAnchor` בתוך container שמידותיו ידועות.
2. CAM-03 מכוון conductor אל normalized anchor שנגזר ב־state change או resize, לא בכל frame.
3. DOM rail מתחיל מתחת לאותה נקודה וממשיך גם כאשר canvas מוסתר.
4. אין DOM element שרודף אחרי pixel של mesh בכל `requestAnimationFrame`.
5. אם alignment אינו מדויק ב־fallback, DOM rail נשאר רציף וה־poster crop מותאם מראש.
6. RTL משנה את מיקום `handoffAnchor` לפי `inline-end`; geometry ותאורה אינן mirrored.

### Motion ownership

| Motion | Owner | מנגנון מועדף | כלל |
|---|---|---|---|
| button/menu/language feedback | DOM | CSS transition | transform/opacity/color בלבד; keyboard מיידי |
| section/media reveal | DOM | CSS transition או WAAPI נדיר | interruptible, עד `420ms` |
| conductor outside sculpture | DOM/SVG | CSS/WAAPI state transition | אינו מעדכן layout בכל frame |
| camera/object/material interpolation | WebGL | scene render loop בלבד | פעיל רק ב־Act 1 |
| pointer response | WebGL object group | direct transform/motion value equivalent | ללא CSS variable יורש וללא camera coupling |
| project flow demonstration | DOM media | video/image/semantic diagram | לעולם לא WebGL texture |

אין element שמקבל transform משני owners. ה־Hero container, canvas וה־sculpture group מקבלים אחריות נפרדת; אין mixing בין CSS transform של canvas לבין camera/object transforms בתוך scene בזמן אותו transition.

### Media and diagram rules

- product screenshots נשמרים כ־`<picture>` עם width/height ו־caption.
- interaction loops הם `<video>` עם poster, captions/transcript לפי הצורך, controls נגישים ו־fallback still.
- autoplay, אם יאושר בהמשך, חייב להיות muted, inline, pause מחוץ ל־viewport וכבוי ב־reduced motion/Save-Data.
- system proof משתמש ב־HTML/SVG סמנטי או still מתועד; אין text בתוך WebGL.
- כל diagram משמעותי מקבל תיאור טקסטואלי וסדר קריאה שאינו תלוי בקווים חזותיים.
- generated art לעולם אינו ממלא slot של product proof.

### Capability ownership

| Tier | DOM | WebGL |
|---|---|---|
| Full | מסע מלא + poster reserve | CAM-00–03, pointer response |
| Reduced motion | מסע מלא + state posters | לא נטען או נשאר static ללא camera transition |
| No WebGL / context loss | מסע מלא + poster/SVG rail | absent/failed |
| Save-Data / low capability | מסע מלא + assets דחוסים | לא נטען כברירת מחדל |
| JS failure before enhancement | HTML routes/content/links נשארים שימושיים ככל שה־architecture מאפשרת | absent |

### Performance boundaries

1. initial non-WebGL JavaScript נשאר בתקציב Gate 0; scene bundle נפרד ואינו dependency של content render.
2. אין העברת per-frame values מ־WebGL ל־React state.
3. אין כתיבת CSS variable יורש על Hero container בכל pointer/frame update.
4. `ResizeObserver` או resize event מעדכנים framing/anchor רק בעת שינוי layout, לא בכל frame.
5. RAF פועל רק כאשר scene active, document visible, motion allowed וה־Hero/transition רלוונטיים.
6. `will-change` מותר ל־DOM transform/opacity רק בזמן transition ומוסר בסיום.
7. scene quality יורדת לפני פגיעה בתוכן: DPR/post-processing/material detail → poster fallback.
8. שום failure של scene אינו גורם ל־layout shift או retry loop שחוסם main thread.

### Accessibility and input contract

- canvas הוא decorative, `aria-hidden="true"`, ללא `role`, `tabindex` או accessible name.
- כל focusable control קיים ב־DOM ובסדר קריאה הגיוני גם כאשר canvas מוסתר.
- focus ring אינו מוסתר מתחת ל־canvas או rail.
- selection, context menu, wheel, touch scroll ו־pinch zoom אינם נחסמים על ידי scene.
- keyboard navigation אינה מפעילה camera transition; content state מתעדכן מיידית.
- signal anchors מסומנים כ־links או buttons רק אם יש להם פעולה אמיתית; decorative nodes אינם controls.
- contrast נמדד מול הרקע הגרוע ביותר כאשר canvas פעיל, לא רק מול poster צפוי.

### Failure contract

| Failure | DOM response | WebGL response | user outcome |
|---|---|---|---|
| chunk load fails | poster נשאר; אין modal | emit `scene-failed` | Hero ומסע מלאים |
| model/texture fails | poster נשאר | dispose partial scene | ללא broken canvas |
| context lost | poster חוזר, focus נשמר | stop RAF, attempt מוגבל בעתיד | אין reset לגלילה |
| FPS below threshold | תוכן ללא שינוי | reduce quality; fallback אם נמשך | CTA ותוכן נשארים responsive |
| tab hidden | state נשמר | stop RAF | resume ללא replay |
| navigation jump to project | project content מופיע מיד | skip directly to parked | אין המתנה למעבר camera |
| language/RTL switch | DOM reflow מיידי, focus נשמר | recompute anchor פעם אחת | אין scene restart |

### Acceptance criteria for MOT-003

1. ניתן להסיר את ה־canvas מה־DOM והמסע נשאר מלא, מובן ופעיל.
2. כל text, link, CTA, signal label, product proof ו־diagram משמעותי נמצאים ב־DOM/SVG.
3. WebGL מוגבל ל־Signal Forge sculpture ול־CAM-00 עד CAM-03 בלבד.
4. ה־DOM story controller הוא מקור האמת; WebGL subscriber שאינו מנהל route, scroll, focus, language או content.
5. canvas decorative, אינו tabbable ואינו חוסם pointer, selection, wheel, touch או zoom.
6. poster-first handshake אינו יוצר CLS, flash שחור או המתנה לתוכן.
7. conductor seam אינו דורש DOM↔mesh synchronization בכל frame.
8. אין React state update, inherited CSS variable update או layout measurement בכל frame.
9. כל failure חוזר ל־poster/DOM state בלי reset לגלילה, focus או active beat.
10. Full, reduced-motion, no-WebGL, Save-Data ו־failed states מציגים אותו מידע ואותם נתיבי פעולה.

## 7L. MOT-004 — Reduced-motion storyboard — מאושר

מסלול ה־reduced motion, מיפוי כל 12 ה־beats, שלושת ה־posters, motion budget ו־runtime switching אושרו במפורש ב־2026-07-14. `MOT-004` הושלם.

### עקרון העל

**Reduced motion הוא מסע מקביל ושווה, לא גרסה חסרה של המסע הראשי.** הוא שומר על אותם 12 beats, אותו סדר תוכן, אותן הוכחות ואותם נתיבי פעולה, אבל מחליף תנועה מרחבית ורציפה ב־layout סטטי, state ברור ומעברים מיידיים או קצרים מאוד.

המשתמש אינו נדרש לצפות בתנועה כדי להבין את המטפורה, לזהות את שלושת העולמות, לראות מוצר בפעולה או להגיע לפעולה הבאה. אין שלב שבו צריך "לחכות לאנימציה" כדי לקבל תוכן.

### Activation and authority

1. `prefers-reduced-motion: reduce` הוא מקור האמת הראשי ומוערך לפני import של WebGL או אתחול motion runtime.
2. כאשר העדפת המערכת היא reduce, WebGL אינו נטען כברירת מחדל; `RM-POSTER-00` עד `RM-POSTER-02` ממלאים את מצבי Signal Forge.
3. אם יתווסף בעתיד control פנימי, בחירת מערכת של reduce תמיד גוברת על בקשה להגדיל motion. control פנימי רשאי רק לצמצם תנועה מעבר לברירת המחדל.
4. שינוי ההעדפה בזמן session מבטל animations ו־RAF פעילים, משמר `activeBeat`, focus ו־scroll, ומחליף canvas ב־poster המקביל ללא replay או reset.
5. `Save-Data` ו־low-capability הם signals נפרדים, אך רשאים להשתמש באותו static path. אין להסיק העדפת motion רק מחיבור איטי.
6. reduced motion אינו משנה route, DOM order, heading structure, מספר הקישורים, analytics meaning או content source.

### Motion budget

| פעולה | התנהגות reduced motion | תקציב מרבי |
|---|---|---|
| anchor / skip link / keyboard navigation | מעבר מיידי; native scroll ללא smooth behavior | `0ms` |
| focus indication | מופיע מיידית; ללא transform | `0ms` |
| route או language change | reflow מיידי; opacity בלבד אם נדרש להתמצאות | `0–120ms` |
| menu open/close | state מיידי או opacity בלבד | `0–120ms` |
| poster / media state change | החלפה מיידית או crossfade opacity | `0–120ms` |
| CTA hover/press | color, border או opacity בלבד | `100–140ms` |
| user-initiated video | playback רק לאחר פעולה מפורשת ועם controls | לפי המדיה |

אסורים במסלול זה: camera movement, parallax, scroll scrub, pinning שנדרש להבנת הסיפור, pointer response, stagger, count-up, spring, zoom, scale reveal, morph, animated blur, looping decoration, autoplay video ו־continuous conductor flow.

### Twelve-beat parity storyboard

| Beat | משמעות שנשמרת | המימוש במסלול reduced motion | מה מוסר |
|---|---|---|---|
| `00 — Immediate value` | זהות, הבטחת הערך, שני CTA והכניסה לשלושת העולמות | Hero מלא ב־DOM עם `RM-POSTER-00`: crop סטטי של ה־Signal Forge במצב CAM-00; ה־signals מוצגים כ־labels סמנטיים מתחת למסך הראשון | scene mount, idle motion, pointer response ו־camera state |
| `01 — The unresolved signal` | הפער בין צורך לא מעובד למוצר ברור | copy מופיע בזרימת המסמך; `RM-POSTER-01` מציג core פתוח מראש ולצדו rail סטטי עם שלושת ה־signals | camera dolly, layer reveal, pulse והשהיית טקסט |
| `02 — Three worlds, one method` | Conversion, Growth ו־Complexity הם שלושה ביטויים של שיטה אחת | `RM-POSTER-02` מציג topology מלאה; רשימת DOM סמנטית ושלושה anchors נגישים מופיעים יחד; Conversion מסומן בצבע, border וטקסט | camera orbit, flowing conductors, node activation ו־scroll choreography |
| `03 — NIS: desire becomes action` | מעבר מעולם מופשט לעסק אמיתי שמייצר פניות | heading ומדיית NIS האמיתית נכנסים בזרימת המסמך; rail נחושתי סטטי מחבר את poster ה־topology למדיה | CAM-03, fly/handoff, autoplay ו־parallax |
| `04 — NIS: conversion decision` | CTA, mobile studio ו־draft→publish מוכיחים החלטת conversion | רצף אנכי גלוי של CTA still, mobile still ו־diagram סמנטי draft→publish; אין carousel שחייב הפעלה כדי לגלות proof | crossfade אוטומטי, stagger, card lift ו־simulated interaction |
| `05 — Online Converter: breadth without chaos` | משתמש עובר מ־discovery לתוצאה בתוך מוצר רחב | שלושה stills אמיתיים מוצגים כ־sequence: discover→use→result, עם captions; החלפת שפה מתבצעת מיידית ושומרת focus | grid morph, tiles flying, animated filtering ו־smooth language transition |
| `06 — Online Converter: growth system` | registry אחד מייצר route וממשק localized | diagram סטטי וסמנטי מציג `registry → route → localized UI`; כל node והקשר זמינים יחד בטקסט וב־SVG | node pulse, line drawing, count-up ו־progressive reveal |
| `07 — Emergency Protocol: complexity under pressure` | סדר החלטות ברור בתוך לוגיקה תפעולית מורכבת | numbered flow מלא עם branch גלוי, screenshot אמיתי ו־disclaimer קבוע; אין הדמיית לחץ או urgency מלאכותית | moving spotlight, auto-advance, flashing status ו־simulated emergency |
| `08 — Emergency Protocol: from protocol to system` | התוכן המובנה מחובר ל־UI ול־backend אמיתי | diagram layered סטטי מציג `JSON → UI → Functions/D1`; כל השכבות גלויות וכוללות תיאור טקסטואלי | layer peel, depth animation, line travel ו־camera metaphor |
| `09 — One operating method` | Need→Decision→System→Proof→Growth מחבר את שלושת הפרויקטים | rail אופקי/אנכי responsive עם חמשת השלבים ושלושה thumbnails אמיתיים; הסדר נקרא ישירות ללא reveal | animated convergence, thumbnail travel ו־scroll pinning |
| `10 — Lab: decisions that survive launch` | שלוש תובנות מקצועיות מוכיחות חשיבה מתמשכת | שלושת פריטי ה־Lab מוצגים מיד ככרטיסים/קישורים; hover ו־focus משנים border/color בלבד | card cascade, hover translate, depth tilt ו־auto preview |
| `11 — Responsibility to conversation` | אחריות מקצה לקצה מובילה להזמנה לשיחה | About, Contact ושני נתיבי הפעולה זמינים בזרימה רגילה; rail סטטי מסתיים ב־CTA; feedback הוא color/opacity בלבד | signal convergence, CTA magnetism, background comeback ו־closing loop |

### Static asset contract

| Asset | תפקיד | דרישה |
|---|---|---|
| `RM-POSTER-00` | CAM-00 / Hero | אותו framing, safe zones ו־color balance של state המלא; headline ו־CTA נשארים DOM |
| `RM-POSTER-01` | CAM-01 / Core | core קריא ללא צורך ב־reveal; אין טקסט אפוי לתמונה |
| `RM-POSTER-02` | CAM-02 / Topology | שלושת המסלולים מובחנים חזותית אך labels וקישורים נשארים DOM |
| Product stills | NIS, Online Converter, Emergency Protocol | אותם capture-ים אמיתיים של המסלול המלא, עם dimensions, alt/caption ומקור מתועד |
| Video posters | interaction loops | still מייצג שאינו מסתיר מידע; playback רק ביוזמת המשתמש ועם controls |

שלושת ה־posters הם exports מאותו asset מאושר ובאותם camera states; אין לייצר 12 איורים חלופיים ואין ליצור visual language שני. כל poster מקבל `width`/`height` או `aspect-ratio` קבוע כדי למנוע CLS.

### Content and interaction parity

1. כל heading, paragraph, caption, disclaimer, CTA, project link, Lab link ופרטי Contact זהים למסלול המלא.
2. כל proof שמוצג בסרטון מקבל poster מייצג, controls נגישים ו־caption/transcript לפי הצורך; אין autoplay.
3. content אינו מוסתר מאחורי tab, carousel או accordion רק כדי לחקות sequence. אם control כזה נדרש במובייל, ברירת המחדל חושפת summary וקיים מסלול מקלדת מלא.
4. active state מסומן בשילוב של text, border, icon או weight; צבע לבדו אינו נושא משמעות.
5. hover אינו תנאי לגילוי מידע. keyboard ו־touch מקבלים את אותה פעולה ללא transition מרחבי.
6. language/RTL switch משמר את ה־section הפעיל ואת focus target; posters משתמשים ב־crop תואם safe zones, וה־geometry אינה mirrored.
7. native document scroll נשמר. אין scroll hijacking, forced snap, pinning או delayed anchor landing.

### Runtime transition from full to reduced

אם preference משתנה בזמן שהמסלול המלא כבר פעיל:

1. ה־controller קורא את `activeBeat` לפני ביטול animation.
2. כל transition פעיל מבוטל ללא completion callback שמשנה beat.
3. pointer listeners, RAF ו־WebGL lifecycle נעצרים; canvas מוחלף ב־poster התואם ל־state האחרון.
4. media autoplay, אם יאושר בעתיד במסלול המלא, נעצר ואינו מתחיל מחדש.
5. DOM state, scroll position, focus, expanded controls ו־language נשמרים.
6. layout dimensions נשארים קבועים; אין קפיצה כאשר canvas או animated wrapper מוסרים.
7. חזרה מ־reduce ל־full אינה מפעילה intro או replay; enhancement יכול להתחיל רק מה־beat הנוכחי ורק אם המערכת אינה מחייבת reduce.

### Future verification checklist

- לפתוח עם reduce פעיל לפני navigation ולוודא שאין request ל־WebGL chunk ואין RAF של scene.
- להחליף preference בזמן CAM-01/CAM-02 ולוודא ש־scroll, focus ו־`activeBeat` נשמרים.
- להשוות DOM outline, headings, links, CTA ו־project proof בין full ל־reduced.
- לוודא שאין autoplay, looping decoration, smooth scroll, parallax, transform reveal או stagger פעיל.
- לבדוק poster dimensions ו־CLS בכל state ובשתי השפות.
- לבדוק keyboard, skip links, anchors, menu, language control, video controls ו־Contact ללא המתנה למעבר.
- לבצע screenshots קבועים לכל 12 beats ב־desktop ובמסלול mobile שיוגדר ב־MOT-005.

### Acceptance criteria for MOT-004

1. כל 12 ה־beats קיימים באותו סדר, עם אותה משמעות, אותה הוכחה ואותה פעולה כמו במסלול המלא.
2. WebGL אינו נטען כברירת מחדל כאשר `prefers-reduced-motion: reduce` פעיל לפני טעינת העמוד.
3. CAM-00–02 מוחלפים בשלושה posters מתועדים; CAM-03 מוחלף בחיבור DOM/SVG סטטי למדיית NIS.
4. אין camera, parallax, scroll scrub, pointer response, stagger, spring, zoom, morph, animated blur, loop או autoplay.
5. opacity transition מותר רק כשעוזר להתמצאות ועד `120ms`; משמעות או פעולה לעולם אינן תלויות בו.
6. שינוי preference בזמן session שומר `activeBeat`, scroll, focus, language, expanded state ו־media controls.
7. poster/media containers שומרים dimensions קבועים ואינם יוצרים CLS.
8. כל סרטון הוא user-initiated, כולל controls ו־poster, ומקבל caption/transcript לפי הצורך.
9. navigation, anchors, focus ו־keyboard feedback מיידיים ואינם משתמשים ב־transform.
10. מסלול reduced motion משתמש באותם content sources, routes, analytics semantics ו־accessibility structure של המסלול המלא.

## 7M. MOT-005 — Independent mobile journey — מאושר

מסלול ה־mobile העצמאי, חמשת composition modes, אסטרטגיית fixed camera, מיפוי כל 12 ה־beats וחוזי touch/media/bilingual אושרו במפורש ב־2026-07-14. `MOT-005` הושלם.

### עקרון העל

**Mobile הוא עריכה נרטיבית עצמאית של אותו סיפור, לא desktop שנדחס לעמודה אחת.** כל 12 ה־beats, כל הוכחות המוצר וכל נתיבי הפעולה נשמרים, אבל ה־focal point, יחס המדיה, צפיפות המידע וקצב המעבר מותאמים לקריאה ביד אחת, למסך צר ולגלילה טבעית.

המסלול אינו משתמש ב־horizontal page scroll, אינו דורש swipe, drag, hover או gyroscope, ואינו מסתיר proof חיוני בתוך carousel. בכל רגע יש focal point אחד בלבד: מסר, sculpture, מדיית מוצר, החלטה או CTA.

### Mobile composition modes

המצב נקבע לפי רוחב וגובה ה־viewport בפועל, לא לפי user-agent:

| Mode | טווח מנחה | התאמה |
|---|---|---|
| `mobile-compact` | רוחב `320–374px` או גובה מתחת `700px` | gutter של `20px`, sculpture נמוכה יותר, פחות negative space; אין הסרת תוכן |
| `mobile-standard` | רוחב `375–430px` וגובה `700–899px` | baseline של `390×844`, gutter של `20–24px`, composition המאושרת של Signal Forge |
| `mobile-tall` | רוחב עד `430px` וגובה `900px+` | יותר breathing room והצצה עמוקה יותר ל־beat הבא; אין הגדלת type מעבר ל־tokens |
| `mobile-wide` | רוחב `431–767px` | single-column רחב עם media עד `640px`; אינו עובר אוטומטית ל־desktop choreography |
| `mobile-landscape` | גובה קטן מרוחב ועד `767px` | document flow קומפקטי, WebGL כבוי כברירת מחדל, ללא הודעת “rotate device” |

כללים משותפים:

1. `320px` הוא רוחב התמיכה המינימלי; אין overflow אופקי ב־English או בעברית.
2. safe areas משתמשים ב־`env(safe-area-inset-*)` עבור header, menu ו־CTA קרוב לתחתית.
3. touch target מינימלי הוא `48×48px`; CTA ראשי/משני בגובה `56px` לפחות.
4. כל media container מקבל dimensions לפני הטעינה; אין layout shift בין poster, video ו־fallback.
5. אין שינוי סדר או מחיקת תוכן בין modes; רק spacing, crop מתועד והצגת proof משתנים.

### Mobile scene strategy

במובייל המצלמה נשארת קבועה. ה־Signal Forge עצמו משנה state; המשתמש אינו “טס” בתוך האובייקט.

| State | Mobile framing | Motion מלא | Reduced/no-WebGL |
|---|---|---|---|
| `M-CAM-00 — Portrait Forge` | sculpture אנכי, ממורכז מתחת ל־copy, safe zone לטקסט מעליו | state יציב; ללא idle orbit או touch response | `RM-POSTER-00-M` |
| `M-CAM-01 — Open Core` | אותו camera ו־scale; core קריא במרכז | internal shell נפתח במעבר יחיד, ללא dolly/zoom | `RM-POSTER-01-M` |
| `M-CAM-02 — Signal Topology` | אותו camera; שלושת הנתיבים נפתחים לאורך הציר האנכי | nodes/conductors עוברים state בדיד; camera אינה זזה | `RM-POSTER-02-M` |
| `M-PARKED` | canvas מוסר לפני מדיית NIS | crossfade קצר ל־DOM rail ולמדיה אמיתית; scene נעצרת/disposed | poster→media instant או opacity עד `120ms` |

WebGL במובייל הוא enhancement אופציונלי בלבד:

- poster מצויר ראשון ותמיד מספיק להבנת ה־Hero.
- scene נטענת רק ב־full motion, ללא `Save-Data`, לאחר capability check ובלי לעכב CTA או LCP.
- אין pointer response, hover emulation, gyro, drag, pinch interception או camera coupling.
- קיימים לכל היותר שני object-state transitions: `M-CAM-00→01` ו־`01→02`; אין CAM-03 נייד.
- בסוף Beat 02 ה־scene אינה חוזרת בשאר העמוד.
- אם frame rate או memory חורגים מהחוזה שייקבע ב־spike, נשארים על poster ללא downgrade גלוי של התוכן.

### Header and navigation

1. header קומפקטי כולל identity, language control ו־menu trigger; כל control הוא לפחות `48px`.
2. identity חוזרת לראש העמוד. Work, Lab ו־Contact נשארים anchors אמיתיים גם כאשר JavaScript נכשל.
3. menu נפתח כ־surface מלאה מתחת ל־header, לא כ־pill ולא כ־bottom sheet שמסתיר context. הוא מקבל heading נגיש, close מפורש, focus management ו־Escape.
4. פתיחת menu עוצרת scroll ברקע בלי לשנות את מיקום העמוד; סגירה מחזירה focus ל־trigger.
5. navigation ל־anchor נוחת לפני heading עם `scroll-margin`, ללא smooth scroll חובה וללא replay של beats שנדילגו.
6. header אינו תופס יותר מ־`72px` כולל safe area במצב רגיל. אם נבחר sticky behavior ב־prototype, הוא מופיע רק בגלילה כלפי מעלה ואינו משנה layout.

### First-screen contract

ב־`390×844` המסך הראשון חייב להציג ללא interaction:

1. identity ושליטה בשפה/תפריט.
2. הבטחת הערך המלאה בשפה הפעילה.
3. supporting copy מקוצר רק באמצעות ניסוח mobile מאושר, לא truncation.
4. sculpture או poster מזוהים כ־Signal Forge.
5. CTA ראשי מלא; CTA משני גלוי או מתחיל בתוך אותו viewport.

ב־viewport קצר מתחת `700px`, sculpture מתקצרת לפני שהמסר או ה־CTA נדחים. CTA המשני רשאי לעבור מיד מתחת לקפל, אך נשאר הבא בסדר ה־DOM. ה־signals מספקים רמז לפרק הבא ואינם מתחרים במסר הראשון.

### Twelve-beat mobile storyboard

| Beat | Mobile composition | Interaction and motion | Exit / continuity |
|---|---|---|---|
| `00 — Immediate value` | header קומפקטי → headline מלא → supporting copy → portrait Forge → שני CTA stacked → רמז signals | text ו־CTA נמצאים במצב הסופי; scene אופציונלית ושקטה; press feedback בלבד | CTA ראשי גולל ל־Beat 01, משני ל־Contact; גלילה טבעית חושפת core |
| `01 — The unresolved signal` | copy קצר מעל `M-CAM-01`; שלושת שמות ה־signals מופיעים כ־DOM rows מתחת לאובייקט | internal core transition אחד עד `motion-scene`; אין pinning והטקסט אינו זז | copper node מסמן את המעבר ל־Conversion בלי לדרוש tap |
| `02 — Three worlds, one method` | `M-CAM-02` מעל שלוש שורות anchor: Conversion, Growth, Complexity; כולן גלויות באותו flow | state change בדיד; tap על anchor מדלג לפרויקט אך אינו תנאי להמשך | copper rail סטטי ממשיך ל־NIS; canvas עובר ל־`M-PARKED` |
| `03 — NIS: desire becomes action` | chapter label וכותרת → צילום mobile/desktop אמיתי ביחס `4:5` או native → problem/audience copy | poster/מדיה נכנסים ב־opacity+translate של עד `12px` פעם אחת; אין autoplay | rail נחושתי מתחבר ישירות ל־decision block |
| `04 — NIS: conversion decision` | stack של שלושה proof blocks: CTA decision, owner studio, draft→publish; כל block כולל media, decision ו־tradeoff | אין carousel; video, אם קיים, מופעל רק בכפתור מפורש; controls נשארים גלויים | project CTA ו־next-project cue אינם באותו visual weight |
| `05 — Online Converter: breadth without chaos` | accent עובר ל־indigo; discover→use→result מוצגים כשלושה blocks אנכיים עם capture אמיתי | אין swipe gallery או grid morph; language demo הוא control מפורש ושומר focus | result block מוביל ל־registry proof ולא לעוד gallery |
| `06 — Online Converter: growth system` | diagram אנכי `registry → route → localized UI`, ולא diagram אופקי מוקטן | nodes נחשפים כקבוצה אחת או נשארים סטטיים; אין line-drawing שנדרש להבנה | CTA למוצר וקישור case study מופיעים לאחר ההסבר, לא מעליו |
| `07 — Emergency Protocol: complexity under pressure` | accent violet; flow ממוספר ברוחב מלא, branch אחד בכל שורה, disclaimer קבוע ליד פתיחת הפרק | אין auto-advance, flashing או simulated urgency; touch רק פותח מידע קיים | branch האחרון מוביל ל־system architecture באותו rail |
| `08 — Emergency Protocol: from protocol to system` | layers נערמים אנכית: structured content → UI → Functions/D1; screenshot ו־diagram אינם side-by-side | כל layer גלוי; optional reveal יחיד לקבוצה, ללא parallax או depth tilt | contribution/result/links מסכמים לפני המעבר לשיטה |
| `09 — One operating method` | spine אנכי של Need→Decision→System→Proof→Growth; thumbnail אמיתי אחד בכל תחנה רלוונטית | active step נקבע לפי heading ב־viewport אך אינו מסתיר steps אחרים | הסוף מצביע ל־Lab כהוכחת חשיבה, לא כפרויקט רביעי |
| `10 — Lab: decisions that survive launch` | שלושה מאמרים כ־cards אנכיים: insight, relevance, זמן קריאה וקישור | אין horizontal carousel, hover preview או card tilt; press/color feedback בלבד | קישור ל־Blog המלא משני לשלושת ה־insights |
| `11 — Responsibility to conversation` | About קצר → identity/portrait אמיתי אם אושר → CTA ראשי full-width → WhatsApp/LinkedIn/email כקישורים ברורים → footer | אין חזרת sculpture או climax שני; CTA feedback עד `140ms` | ה־journey מסתיים בפעולה ובפרטי אמון, לא באנימציית loop |

### Mobile content density rules

1. כל beat מוביל במשפט אחד שמסביר למה הוא קיים; supporting details מגיעים לאחר proof ולא לפניו.
2. paragraph רגיל מוגבל לכ־`6–8` שורות רצופות במובייל לפני חלוקה ל־subheading, list או proof block.
3. אין יותר משני controls בעלי visual weight גבוה באותו viewport; primary CTA אחד בלבד מקבל copper fill.
4. project proof מוצג בסדר `problem → real media → decision → tradeoff → contribution → credible result → action`.
5. technologies מופיעות כ־evidence metadata לאחר החלטת המוצר, לא כ־logo wall ולא כ־marquee.
6. מספור chapters ו־signal accent מייצרים orientation; sticky chapter tabs אינם נדרשים.
7. כל תמונה משתמשת ביחס המקור. crop נייד מותר רק אם הפעולה המרכזית נשמרת ומתועדת ב־asset manifest.

### Touch and media contract

- אין מידע ב־hover ואין hover-on-tap.
- אין swipe-only carousel, pull interaction, drag-to-explore או long-press חובה.
- `touch-action` אינו חוסם pan/zoom טבעיים; pinch zoom נשאר זמין.
- controls של video, language, menu ו־CTA מקבלים spacing של לפחות `8px` בין targets.
- video אינו autoplay במובייל כברירת מחדל, גם ב־full motion; המשתמש מפעיל playback מתוך poster עם label ברור.
- media player אינו משתלט על scroll; fullscreen נשאר אפשרות native ולא תנאי להבנת proof.
- external links מסומנים באופן נגיש; WhatsApp/phone אינם מחליפים דרך Contact כללית.

### Motion hierarchy on mobile

| Surface | Purpose | Motion rule |
|---|---|---|
| Signal Forge | continuity נדירה ב־Act 1 | שני state transitions לכל היותר, fixed camera, עד `motion-scene` |
| chapter/media reveal | orientation | opacity + translate עד `12px`, פעם אחת לכל block מרכזי, `motion-ui` או `motion-reveal` |
| menu | orientation מה־trigger | enter עד `280ms`, exit עד `180ms`; reduced motion instant/opacity |
| language swap | continuity | reflow מיידי + crossfade `120–180ms`; focus נשמר |
| button press | feedback | `140ms`, color/opacity או scale עד `0.985`; keyboard מיידי |
| keyboard/anchor/focus | speed and access | `0ms`; אין transform או replay |

לעולם לא מתרחשים יחד scene transition ו־media reveal משמעותי. stagger, אם יאושר ב־MOT-007, מוגבל לשלושת signal rows בלבד ואינו נדרש להבנת הסדר.

### Bilingual and RTL behavior

1. line breaks של ה־Hero, chapter headings ו־CTA נכתבים בנפרד לעברית ולאנגלית עבור `mobile-compact` ו־`mobile-standard`.
2. RTL משנה alignment ואת צד ה־rail באמצעות logical properties; אינו הופך screenshots, diagrams, מספרי chapters או סדר Conversion→Growth→Complexity.
3. language switch שומר `activeBeat`, focus target, media state ו־scroll anchor; אין חזרה לראש העמוד.
4. copy אינו מתקצר לפי מספר תווים משותף. אם נדרש נוסח mobile קצר, הוא מאושר כתוכן קנוני מקביל בשתי השפות.
5. mixed-direction strings, URLs, code ו־technology names מקבלים isolation מתאים ואינם שוברים את ה־layout ב־320px.

### Accessibility and resilience

1. heading order זהה ל־desktop; visual rearrangement אינו משנה DOM order.
2. skip link, menu, anchors, media controls, project links ו־Contact ניתנים להפעלה מלאה במקלדת וב־switch input.
3. focus ring נשאר גלוי מעל media, rail ו־safe areas; focus אינו נשלח ל־canvas.
4. orientation change, address-bar resize או virtual keyboard אינם מאפסים beat, סוגרים form או גורמים ל־scroll jump.
5. content עובד ב־200% text zoom וב־browser zoom ללא clipping או horizontal scroll.
6. no-JS/no-WebGL/failed-media/reduced-motion שומרים על אותו סדר, headings, קישורים ו־CTA.

### Future mobile verification matrix

| Viewport/device class | מה נבדק |
|---|---|
| `320×568` compact | overflow, line breaks, first CTA, menu ו־touch targets |
| `360×800` Android baseline | native scroll, poster/media sizing, language switch ו־Chrome address-bar resize |
| `390×844` approved baseline | full 12-beat composition, Signal Forge framing ו־first-screen contract |
| `430×932` large phone | max-width, negative space, media density ו־no tablet-like stretching |
| landscape phone | document flow ללא rotate gate, WebGL off, menu ו־media controls |
| iOS Safari + Android Chrome | safe areas, sticky/header behavior, video controls, focus ו־back navigation |

בכל viewport ייבדקו full, reduced motion, no-WebGL, Save-Data, failed media, English ו־RTL Hebrew. בדיקות device אמיתיות נדרשות ב־technical spike; emulator לבדו אינו סוגר את Gate.

### Acceptance criteria for MOT-005

1. כל 12 ה־beats נשמרים באותו סדר ובאותה משמעות, אך מקבלים composition ניידת עצמאית ללא side-by-side desktop layouts מכווצים.
2. המסלול עובד מ־`320px` ועד `767px`, ב־portrait וב־landscape, ללא overflow, rotate gate או מחיקת תוכן.
3. ב־`390×844` המסך הראשון מציג identity, value proposition, supporting copy, Signal Forge ו־CTA ראשי; CTA משני אינו רחוק יותר מהמשך המיידי.
4. camera קבועה במובייל; קיימים לכל היותר שני object-state transitions ב־Act 1, ולאחר Beat 02 ה־scene נעצרת ואינה חוזרת.
5. WebGL הוא enhancement בלבד; poster, content ו־CTA נצבעים ראשונים והמסע מלא ללא canvas.
6. אין hover dependency, gyro, drag, swipe-only UI, horizontal carousel, autoplay video, scroll hijacking או forced snap.
7. כל media אמיתית, שומרת יחס, מקבלת dimensions, poster/alt/caption ו־fallback; proof חיוני אינו מוסתר מאחורי interaction.
8. touch targets, safe areas, keyboard, focus, pinch zoom, 200% text zoom ו־RTL עומדים בחוזה ללא clipping או reset.
9. language/orientation/preference changes שומרים `activeBeat`, focus, scroll ו־media state.
10. mobile full, reduced, no-WebGL, Save-Data ו־failed states משתמשים באותם content sources, routes, analytics semantics ו־accessibility structure.

## 7N. MOT-006 — Loading, error and fallback contract — מאושר

readiness hierarchy, state model, capability decision tree, failure tiers, retry policy, error copy ו־failure-injection contract אושרו במפורש ב־2026-07-14. `MOT-006` הושלם.

### עקרון העל

**התוכן הוא ה־ready state; כל שכבה אחרת היא enhancement.** המשתמש אינו רואה מסך טעינה לפני שהוא רואה מי אביתר, מה הערך, אילו פרויקטים קיימים ומה אפשר לעשות. poster אינו placeholder שמחכים שיעלם — הוא representation תקין של החוויה. WebGL, video ואנימציה משדרגים מצב שכבר עובד.

כשל בשכבת spectacle לעולם אינו הופך לכשל במוצר. שגיאה מוצגת רק כאשר היא משפיעה על פעולה שהמשתמש ביקש או על proof שהוא ניסה לפתוח; כשל דקורטיבי נשאר שקט ומוחלף ב־fallback תקין.

### Readiness hierarchy

| Priority | חייב להיות זמין | רשאי להגיע מאוחר יותר | לעולם אינו מחכה ל־enhancement |
|---|---|---|---|
| `P0 — Meaning` | identity, headline, supporting copy, headings, project summaries | fonts סופיים, scene, motion | קריאה והבנת ההצעה |
| `P0 — Action` | navigation, language, CTA, project/contact links | analytics, route prefetch | click, focus, anchor navigation |
| `P1 — Proof` | poster/still, caption, alt/transcript, diagram text | full-resolution image, user-initiated video | הבנת ההחלטה והתרומה |
| `P2 — Continuity` | DOM/SVG rails ו־static states | WebGL, media reveal, transitions | סדר 12 ה־beats |
| `P3 — Delight` | none | pointer response, internal illumination, scene interpolation | שום מסר או פעולה |

### Canonical state model

ה־DOM controller מחזיק state מפורש לכל שכבה; אין boolean כללי בשם `isLoading` שמקפיא את כל העמוד.

| Layer | States | Default |
|---|---|---|
| document | `static-ready`, `enhancing`, `interactive`, `degraded` | `static-ready` מיד עם ה־HTML |
| fonts | `fallback`, `ready`, `failed` | `fallback` |
| poster | `reserved`, `loading`, `ready`, `failed` | `reserved` עם dimensions קבועים |
| scene | `not-requested`, `loading`, `ready`, `degraded`, `failed`, `context-lost`, `parked`, `disposed` | `not-requested` |
| project image | `reserved`, `loading`, `ready`, `failed` | `reserved` |
| project video | `poster`, `requested`, `ready`, `playing`, `paused`, `failed` | `poster` |
| route/chunk | `idle`, `requested`, `ready`, `failed` | `idle` |
| contact action | `idle`, `submitting`, `success`, `failed`, `unknown` | `idle` |

כל layer משנה רק את ה־surface שבבעלותו. `scene=failed` אינו משנה document, route, focus או project media; `video=failed` אינו מסיר את ה־caption או את proof text.

### Boot sequence

1. השרת/ה־static route מחזיר HTML סמנטי, metadata, headings, links ותוכן קנוני.
2. critical CSS מצייר graphite surface, typography fallback, layout dimensions, CTA ו־poster reserve.
3. Hero poster וה־LCP asset נטענים בעדיפות מתאימה; אין splash, spinner או opacity `0` על root.
4. JavaScript מחבר navigation, language, media controls ו־story state בלי לשנות DOM order.
5. רק לאחר `prefers-reduced-motion`, `Save-Data`, WebGL capability, visibility ו־device tier נקבעת זכאות ל־scene.
6. scene bundle נטען לאחר idle או intent בהתאם ל־Gate 0; poster נשאר גלוי ושימושי בזמן הטעינה.
7. `scene-ready` מתקבל רק לאחר frame תקין ב־crop התואם; אז מתבצע poster→canvas crossfade עד `180ms`.
8. project media נטענת לפי proximity; תוכן, captions ו־diagram text כבר קיימים ואינם מחכים לה.

### Capability decision tree

| Condition | Scene decision | Media decision | User outcome |
|---|---|---|---|
| JavaScript unavailable | absent | native images/links לפי HTML | מסע סטטי מלא ככל שה־architecture מאפשרת |
| `prefers-reduced-motion: reduce` | `not-requested` | posters; video רק ביוזמת המשתמש | MOT-004 מלא |
| `Save-Data` | `not-requested` כברירת מחדל | compressed responsive stills; video לא preloaded | אותו תוכן בפחות bytes |
| WebGL unsupported | `not-requested` | media רגילה | poster + DOM/SVG rail |
| mobile landscape | `not-requested` כברירת מחדל | stills מותאמים | מסלול mobile document-flow |
| low capability / thermal pressure | `degraded` ואז poster | resolution/codec מתאימים | תוכן ו־CTA נשארים responsive |
| full capability | load after idle/intent | responsive images; video metadata/poster בלבד | enhancement מלא |

ההחלטה מתקבלת לפני import של scene. אין לטעון bundle כבד רק כדי לגלות לאחר מכן שהוא אינו נחוץ.

### Loading visual language

1. אין full-page loader, fake percentage, countdown, branded intro או “Preparing experience”.
2. אין shimmer skeleton לטקסט שכבר קיים ב־HTML ואין pulsing placeholders שמוסיפים motion מתמשך.
3. poster, still או graphite media surface עם dimensions קבועים הם loading state חזותי מספק.
4. `aria-busy` משמש רק ל־region שבאמת ממתין לתוצאה user-initiated, לא ל־`main` כולו.
5. spinner מותר רק בתוך control לאחר פעולה מפורשת כמו submit או play, עם label טקסטואלי, וללא loop דקורטיבי מחוץ ל־control.
6. מעבר ready משתמש ב־opacity עד `180ms`; reduced motion הוא instant או עד `120ms`. אין scale, blur reveal או layout tween.
7. loaded content אינו דוחף copy, rail, CTA או focus target. dimensions ו־aspect ratio נשמרים מראש.

### Scene loading and failure contract

| Event | DOM response | Scene response | User visibility |
|---|---|---|---|
| bundle pending | poster נשאר; CTA/content פעילים | `loading` | ללא הודעה |
| ready בתוך התקציב | crossfade poster→canvas עד `180ms` | `ready` | enhancement שקט |
| לא ready בתוך `1500ms` לאחר intent | poster נשאר לכל ה־session או עד retry מפורש של המערכת | stop initialization, `failed` | ללא error UI |
| model/texture failure | poster נשאר | dispose partial resources | ללא broken canvas |
| low FPS / memory pressure | אין שינוי תוכן | DPR/material/post-processing יורדים; אם נמשך, dispose | downgrade שקט ל־poster |
| context lost | poster חוזר באותו crop; focus/scroll נשמרים | stop RAF, release resources | ללא modal או reset |
| tab hidden / offscreen | state נשמר | stop RAF | resume ללא replay |
| Beat 03 reached | NIS media מוצגת | `parked` ואז `disposed` | handoff רציף |

כשל scene אינו מקבל retry loop. מותר ניסיון initialization נוסף אחד לכל session רק לאחר context recovery אמיתי או שינוי capability, ולעולם לא בזמן שהמשתמש כבר עבר לפרקים. אין toast על WebGL דקורטיבי שנכשל.

### Font and CSS resilience

- font fallback שומר metrics קרובים, hierarchy וקריאות; הטקסט אינו מוסתר עד `document.fonts.ready`.
- כשל font אינו מציג error ואינו מונע language switch. typography fallback נשארת תקינה.
- `font-display: swap` מחייב; preload מוגבל למשקלים ולשפות שבאמת נדרשים למסך הראשון.
- CSS קריטי אינו תלוי ב־WebGL או animation package. אם stylesheet משני נכשל, content order, links ו־focus נשארים שימושיים.
- אין transition גורף בעת font swap; layout נבדק כדי למנוע CLS מעבר לתקציב Gate 0.

### Project image and video contract

1. כל image slot מתחיל ב־reserved dimensions וב־background surface התואם לפרק; אין skeleton טקסטואלי.
2. responsive source נבחר לפי viewport ו־DPR; אין הורדת desktop master למובייל כשגרסת capture מתאימה קיימת.
3. media בפרק הבא רשאית להיטען בערך viewport אחד לפני הצורך; אין preload של כל שלושת הפרויקטים ב־first load.
4. image failure משאיר frame בגודל המקורי, caption, alt-equivalent description וקישור למוצר/ל־case study כאשר רלוונטי.
5. video מתחיל תמיד מ־poster. `preload="none"` או `metadata` לפי הצורך; playback מתחיל רק מפעולה מפורשת במובייל, reduced motion ו־Save-Data.
6. video failure חוזר ל־poster ואינו משאיר black rectangle או disabled control ללא הסבר.
7. transcript/caption מתארים את הפעולה המוכחת, כך שה־proof נשאר גם אם playback אינו אפשרי.
8. retry למדיה הוא user-initiated ומוגבל; אין download loop אוטומטי על חיבור כושל.

### Failure visibility tiers

| Tier | דוגמאות | UI behavior |
|---|---|---|
| `Silent enhancement failure` | WebGL, pointer response, analytics, optional font | fallback שקט; אין toast או alert |
| `Inline proof degradation` | screenshot/video/diagram asset | frame יציב + הסבר קצר + poster/description + link חלופי |
| `Recoverable requested action` | route chunk, video play, language resource | הודעה inline ליד ה־surface, Retry ודרך חלופית |
| `Critical user action` | contact submit | status ברור, input נשמר, Retry ופרטי קשר חלופיים |
| `Document unavailable` | network/server/static route failure | browser/server error אמיתי; אין להציג app shell עם success state מזויף |

### Route, language and navigation failures

- anchor navigation בתוך העמוד משתמשת ב־HTML links ולכן אינה תלויה ב־route chunk.
- case study ו־Blog הם static public routes. כשל lazy chunk שומר header/content shell ומציג error boundary בתוך ה־route בלבד.
- route retry מתבצע רק לאחר לחיצה; לאחר כשל חוזר מוצע reload של ה־URL הקנוני, בלי לאבד את כתובת היעד.
- back navigation מחזירה ל־scroll anchor אם state קיים; אם לא, נוחתת ב־heading של הפרק בלי replay.
- כשל language enhancement משאיר את השפה שכבר מוצגת בשלמותה. אין ערבוב עברית ואנגלית ואין חזרה אוטומטית לשפה אחרת באמצע המסע.
- language retry שומר focus ו־active beat; הודעה מופיעה ליד control ולא כ־modal.

### Contact action states

| State | UI | Focus / announcement | Data rule |
|---|---|---|---|
| `idle` | form/links רגילים | ללא live announcement | input מקומי בלבד |
| `submitting` | submit disabled רק למניעת duplicate; label משתנה ל־“שולח…” / “Sending…” | polite status | fields נשארים בזיכרון ה־UI |
| `success` | אישור ברור והפעולה הבאה | focus עובר ל־success heading רק אם נפתח view חדש; אחרת polite announcement | ניקוי fields רק לאחר confirmation אמיתי |
| `failed` | הודעה inline, Retry ו־email/WhatsApp חלופיים | error summary מקושר לשדה/submit | input אינו נמחק |
| `unknown` | “לא ניתן לאמת אם ההודעה נשלחה” ודרכי קשר חלופיות | assertive רק אם המשתמש ממתין לתוצאה | אין שליחה אוטומטית נוספת |

אין optimistic success לפני אישור אמיתי של endpoint. timeout אינו מוצג כהצלחה ואינו גורם לשליחה כפולה אוטומטית.

### Approved error-copy patterns

| Context | עברית | English |
|---|---|---|
| project media | המדיה לא נטענה. אפשר להמשיך לקרוא או לפתוח את הפרויקט. | The media didn’t load. You can keep reading or open the project. |
| video | הסרטון לא זמין כרגע. התמונה וההסבר מתארים את אותה הפעולה. | The video isn’t available right now. The image and description show the same action. |
| route | העמוד לא נטען. אפשר לנסות שוב או לפתוח את הכתובת מחדש. | The page didn’t load. Try again or reopen the address. |
| language | החלפת השפה לא הושלמה. התוכן הנוכחי נשאר זמין. | The language change didn’t complete. The current content is still available. |
| contact failed | ההודעה לא נשלחה. הפרטים נשמרו — אפשר לנסות שוב או ליצור קשר בדרך אחרת. | The message wasn’t sent. Your details are still here—try again or use another contact option. |
| contact unknown | לא ניתן לאמת אם ההודעה נשלחה. כדי למנוע כפילות, אפשר ליצור קשר ישירות. | We couldn’t confirm whether the message was sent. To avoid duplicates, use a direct contact option. |

הטקסטים אינם מאשימים את המשתמש, אינם משתמשים בקוד שגיאה ככותרת ואינם מבטיחים retry אוטומטי שלא קיים.

### Retry and recovery policy

| Surface | Automatic retry | Manual recovery |
|---|---|---|
| WebGL scene | לא; לכל היותר initialization נוסף אחד לאחר recovery אמיתי | לא מוצג control כי ה־poster הוא outcome תקין |
| image | ניסיון browser רגיל בלבד; אין loop אפליקטיבי | Retry אופציונלי רק אם המדיה קריטית; link חלופי תמיד |
| video | לא | Play/Retry מפורש; poster/transcript נשארים |
| route chunk | לא אחרי הכשל הראשון | Retry, ואז reload ל־URL הקנוני |
| language resource | לא | Retry מתוך control; השפה הקיימת נשמרת |
| contact submit | לעולם לא | Retry מפורש; input נשמר; חלופת contact |
| analytics | לא נדרש למסע | כשל שקט; אין recovery UI |

retry controls הם buttons אמיתיים, נגישים ומיידיים. הם אינם מופיעים אם אין פעולה אמיתית מאחוריהם.

### Twelve-beat fallback map

| Beats | Primary experience | Loading state | Failure/fallback outcome |
|---|---|---|---|
| `00–02` | Signal Forge + DOM signals | poster כבר גלוי; scene pending בשקט | desktop/mobile state posters + DOM/SVG rail; כל CTA/anchors פעילים |
| `03–04` | NIS media and conversion proof | real still/poster עם dimensions | caption + decision/tradeoff copy + live/case-study link; rail ממשיך |
| `05–06` | Online Converter flow and registry proof | stills/diagram surface; video on request | discover→use→result descriptions ו־semantic registry diagram נשארים |
| `07–08` | Emergency flow and architecture proof | screenshot/diagram surface | numbered flow, disclaimer ו־JSON→UI→Functions/D1 text נשארים |
| `09` | method spine + thumbnails | spine והטקסט כבר קיימים | Need→Decision→System→Proof→Growth עובד ללא thumbnails |
| `10` | three Lab insights | titles/summaries/links ב־HTML | cards וקישורים נשארים; preview art אינה נדרשת |
| `11` | About, Contact and footer | contact UI זמין מיד | links ישירים נשארים; submit failure אינו מוחק input |

### Accessibility and announcements

1. loading דקורטיבי אינו מוכרז ב־live region. screen reader אינו צריך לשמוע ש־WebGL או תמונה דקורטיבית נטענים.
2. `aria-live="polite"` שמור לתוצאה user-initiated כמו language, media או submit; שגיאה קריטית לפעולה יכולה להשתמש בהודעה מיידית בלי להציף announcements.
3. focus אינו זז כאשר poster מוחלף ב־canvas, image נטענת או fallback מופיע.
4. error message מקושר ל־control/field המתאים ומופיע גם בטקסט וב־icon/shape, לא בצבע בלבד.
5. Retry אינו control היחיד: כאשר failure עשוי להימשך, קיימת דרך להמשיך לקרוא, לפתוח route או ליצור קשר.
6. reduced motion מכבה spinner/loop שאינם חיוניים ומשתמש ב־instant state או opacity עד `120ms`.

### Offline boundary

V2 אינו מבטיח offline-first בשלב זה. אין להוסיף service worker או cache strategy חדשה מתוך MOT-006 בלבד. static assets רשאים ליהנות מ־HTTP/browser cache, אך אין להציג “Available offline” בלי בדיקה מפורשת. אם המשתמש offline ו־route אינו cached, מוצגת אמת: העמוד אינו זמין כרגע, עם Retry לאחר חזרת החיבור.

### Diagnostics and privacy

- events מותרים: `scene_ready`, `scene_failed`, `context_lost`, `media_failed`, `route_failed`, `contact_failed`, עם surface, capability tier ומשך גס.
- אין לשלוח message text, form values, URL query רגיש, pointer coordinates או screenshot contents.
- כל event נשלח לכל היותר פעם אחת ל־surface/session כדי למנוע noise ו־retry traffic.
- analytics failure שקט ואינו גורם ל־console loop, UI error או חסימת interaction.
- V2 אינו טוען ad-tech, tracking cookie או third-party script לצורך error reporting.

### Future failure-injection checklist

- לחסום scene chunk, model ו־texture בנפרד ולוודא Hero מלא ללא black frame או reset.
- לדמות WebGL unsupported ו־context loss ב־CAM-00/01/02 ובמעבר ל־NIS.
- להאט poster, font, image ו־video ולמדוד LCP/CLS ויכולת שימוש לפני readiness.
- להחזיר HTTP 404/500 למדיה, route chunk ו־language resource ולבדוק copy, Retry ו־focus.
- לנתק רשת בזמן video request, route navigation ו־contact submit; למנוע duplicate submit.
- לבדוק `prefers-reduced-motion`, `Save-Data`, low memory ו־tab visibility change.
- לאמת את כל המצבים ב־English/RTL Hebrew וב־desktop, `390×844` ו־`320×568`.
- לספור network requests ולוודא שאין automatic retry loop או preload של כל מדיית הפרויקטים.

### Acceptance criteria for MOT-006

1. identity, value proposition, navigation, CTA, project summaries ו־Contact זמינים ללא המתנה ל־WebGL, video, font סופי או animation.
2. אין full-page loader, fake progress, blocking intro, text shimmer או root hidden עד hydration/readiness.
3. poster-first boot שומר dimensions ו־LCP/CLS; canvas מוצג רק לאחר frame תקין וב־crossfade עד `180ms`.
4. reduced motion, Save-Data, no-WebGL, mobile landscape ו־low capability מחליטים לפני scene import ומשתמשים במסע static מלא.
5. scene failure/context loss/low FPS חוזרים ל־poster בלי toast, retry loop, focus loss, scroll reset או content change.
6. image/video failure שומר frame, caption/description, proof text ודרך חלופית; video אינו משאיר black rectangle.
7. route/language/contact failures מופיעים inline, מציעים recovery אמיתי ושומרים URL, language, beat, focus או input לפי ההקשר.
8. contact success מוצג רק לאחר confirmation אמיתי; timeout/unknown אינו גורם למחיקת input או duplicate retry.
9. loading/error announcements מוגבלים לפעולות user-initiated; decorative enhancement אינו מזהם live regions.
10. כל 12 ה־beats נשארים מובנים ושמישים ב־full, loading, reduced, no-WebGL, failed-media ו־failed-scene states, בעברית ובאנגלית וב־desktop/mobile.

## 7O. MOT-007 — Final motion tokens and orchestration — מאושר

### עקרון העל

**ה־state משתנה מיד; התנועה רק מסבירה את השינוי.** Motion אינו gate לתוכן, אינו מקור אמת ואינו תור של animation שחייב להסתיים. כל transition ניתן לביטול, retarget או reverse, וה־intent האחרון של המשתמש תמיד מנצח.

המערכת משתמשת במספר קטן של durations ו־easing curves סמנטיים. אין “כמעט אותו” timing לכל component, אין spring אקראי ואין choreography שמסתמכת על setTimeout chain.

### Final duration tokens

| Token | Value | שימוש מאושר |
|---|---:|---|
| `motion-instant` | `0ms` | keyboard, focus, skip/anchor, state קריטי, reduced-motion default |
| `motion-press` | `140ms` | button/CTA press, toggle confirmation, control feedback |
| `motion-fade` | `180ms` | poster↔canvas, media swap, error/status appearance, UI exit |
| `motion-hover` | `200ms` | color/opacity/translate עד `2px` תחת fine pointer בלבד |
| `motion-ui` | `280ms` | menu enter, panel orientation, language/route continuity קצרה |
| `motion-route` | `360ms` | מעבר נדיר לעמוד case study עם offset עד `12px` |
| `motion-reveal` | `420ms` | media/chapter reveal חד־פעמי עם offset עד `12px` |
| `motion-scene-mobile` | `560ms` | שני object-state transitions במובייל עם camera קבועה |
| `motion-scene` | `720ms` | CAM-00→01, CAM-01→02 ו־CAM-02→03 ב־desktop |
| `motion-narrative-max` | `1000ms` | תקרה מוחלטת לרגע illustrative נדיר; אינו token ברירת מחדל |

כללים:

1. routine UI נשאר מתחת `300ms`; exit משתמש ב־`motion-fade` או לכל היותר כשני שלישים מ־enter.
2. אין duration מותאם לפי שפה. עברית ואנגלית משתמשות באותו timing גם כאשר line wrapping שונה.
3. distance אינו מגדיל duration מעבר ל־token הבא בסולם ללא החלטה מתועדת.
4. `motion-narrative-max` אינו מתיר intro, loader, autoplay או animation בת שנייה לכל section.
5. reduced motion אינו משתמש בחצי duration של full; הוא מחליף את מנגנון התנועה לפי הטבלה הייעודית בהמשך.

### Final easing tokens

| Token | Curve | Character | שימוש |
|---|---|---|---|
| `ease-enter` | `cubic-bezier(0.22, 1, 0.36, 1)` | תגובה מיידית ונחיתה רכה | entrances, reveal, press release |
| `ease-move` | `cubic-bezier(0.25, 1, 0.5, 1)` | תנועה מרחבית ברורה | panel, route offset, conductor DOM motion |
| `ease-scene` | `cubic-bezier(0.19, 1, 0.22, 1)` | התחלה החלטית ו־settle ארוך | camera/object/material transitions נדירים |
| `ease-linear` | `linear` | קצב קבוע | progress אמיתי בלבד; לא narrative movement |

אסורים:

- `ease-in` ל־UI, משום שהוא מעכב feedback.
- spring/overshoot ב־Signal Forge, CTA, menu או route.
- easing שונה לאלמנטים שמהווים transition זוגי אחד.
- keyframe sequence עבור state שניתן להפעיל שוב לפני סיומו.
- custom curve חדש ללא purpose שלא ניתן לשרת באמצעות ארבעת ה־tokens לעיל.

### Distance and transform tokens

| Token | Value | שימוש |
|---|---:|---|
| `distance-press` | scale עד `0.985` | press ב־pointer/touch; keyboard ללא transform |
| `distance-hover` | `2px` | CTA/card lift תחת fine pointer בלבד |
| `distance-ui` | `8px` | menu/panel orientation כאשר opacity לבדה אינה מספיקה |
| `distance-reveal` | `12px` | media/chapter/route reveal; מקסימום לטקסט משמעותי |
| `distance-pointer-x/y` | `12px` | sculpture group בלבד ב־desktop fine pointer |
| `distance-pointer-depth` | `20px` וירטואלי | sculpture group בלבד; ללא camera coupling |
| `rotation-pointer` | `1.5deg` | sculpture group בלבד |

אין transform על headline בעקבות pointer, אין magnetic CTA, ואין scale reveal ל־section שלם. layout properties כמו `width`, `height`, `top`, `left`, margin ו־padding אינן מונפשות.

### Stagger contract

| Token | Value | Scope |
|---|---:|---|
| `motion-stagger-step` | `40ms` | nodes או שלוש signal rows בלבד |
| `motion-stagger-max` | `160ms` | תקרת offset בין הראשון לאחרון |

1. stagger מותר רק כאשר הוא מסביר סדר או topology, לא כדי להכניס כל heading/card/list בעמוד.
2. הקבוצה כוללת לכל היותר חמישה items; קבוצה גדולה יותר מופיעה יחד או מחולקת לפי תוכן.
3. הפריט החשוב מתחיל ראשון; RTL אינו הופך סדר נרטיבי.
4. container אינו מבצע entrance משמעותי במקביל ל־stagger של ילדיו.
5. reduced motion, keyboard navigation, anchor jump ו־route restore מבטלים stagger לחלוטין.
6. reveal אינו חוזר בכל כניסה ל־viewport; content שכבר נחשף נשאר גלוי.

### Motion purpose matrix

| Surface | Purpose | Duration | Easing | Reduced motion |
|---|---|---:|---|---|
| CTA press | feedback | `140ms` | `ease-enter` | color/opacity `100–140ms`, keyboard `0ms` |
| CTA hover | feedback | `200ms` | `ease-enter` | no transform; touch none |
| menu enter | orientation | `280ms` | `ease-enter` | instant או opacity עד `120ms` |
| menu exit | continuity | `180ms` | `ease-enter` | instant |
| language swap | continuity | `180ms` max | `ease-enter` | reflow מיידי + opacity עד `120ms` |
| route continuity | orientation | `360ms` max | `ease-move` | instant או opacity עד `120ms` |
| chapter/media reveal | orientation | `420ms` | `ease-enter` | content final; opacity עד `120ms` אופציונלי |
| poster→canvas | continuity | `180ms` | `ease-enter` | canvas אינו נטען |
| desktop scene state | continuity/system explanation | `720ms` | `ease-scene` | poster state swap |
| mobile scene state | continuity/system explanation | `560ms` | `ease-scene` | poster state swap |
| error/status | feedback | `0–180ms` | `ease-enter` | instant; no shake |
| focus/keyboard/skip | access and speed | `0ms` | none | `0ms` |

### Orchestration lanes

| Lane | Owner | דוגמאות | Concurrency |
|---|---|---|---|
| `L0 — Immediate state` | DOM controller | activeBeat, language, focus, expanded/error state | מתעדכן מיד ואינו ממתין ל־motion |
| `L1 — Control feedback` | CSS | hover, press, focus-adjacent color | רשאי לחפוף ל־lane אחר כי אינו משמעותי נרטיבית |
| `L2 — DOM continuity` | CSS/WAAPI | menu, media reveal, conductor rail, route offset | transition משמעותי אחד בכל רגע |
| `L3 — Scene continuity` | WebGL render loop | camera/object/material states | אינו חופף ל־L2 משמעותי |
| `L4 — User media` | native media | user-initiated playback | אינו מסונכרן ל־scroll choreography |

`L2` ו־`L3` אינם מבצעים motion משמעותי במלוא העוצמה יחד. control feedback קטן ב־`L1` לעולם אינו נחסם בגלל scene transition.

### Act 1 choreography

| Transition | Scene timing | DOM timing | Rule |
|---|---|---|---|
| `T-01 — Ready→Core` | `720ms`, `ease-scene` | Beat 01 heading/copy כבר זמינים; active state מתעדכן מיד | אין delay לטקסט ואין entrance חוזר |
| `T-02 — Core→Topology` | `720ms`, `ease-scene` | שלושת signal labels קיימים; active Conversion יכול להתחזק ב־`180ms` | stagger מותר ל־nodes בלבד, עד `160ms` |
| `T-03 — Topology→NIS` | `720ms`, `ease-scene` | NIS heading וה־media frame כבר ב־DOM; media reveal מתחיל רק לאחר scene settle או מוצג מיד אם המשתמש דילג | אין two-climax overlap; CAM-PARKED בסיום |

במובייל T-01/T-02 משתמשים ב־`560ms` וב־fixed camera; T-03 מוחלף ב־poster/DOM handoff עד `180ms`.

### Beats 03–11 choreography

1. WebGL אינו חוזר. project, method, Lab ו־Contact משתמשים ב־DOM/media בלבד.
2. chapter heading אינו מחכה ל־media reveal; הוא זמין במצב הסופי ברגע שה־beat פעיל.
3. לכל proof block מותר reveal חד־פעמי אחד של `420ms` לכל היותר. reverse scroll אינו מעלים אותו.
4. בין פרויקטים ה־rail משנה accent ב־`180–280ms`; אין page wipe, full-screen color flash או transition שמסתיר תוכן.
5. method spine יכול לעדכן active step ב־`180ms` color/opacity; thumbnails אינם נוסעים בין sections.
6. Lab cards ו־Contact אינם נכנסים ב־cascade. ה־CTA הסופי אינו מקבל climax motion נוסף.

### Interruption and retargeting contract

1. `activeBeat` מתעדכן מה־intent/position מיד; animation רודפת אחרי state ולא להפך.
2. intent חדש מבטל או retargets את transition הפעיל מאותו computed/current value; אין restart מ־0.
3. completion callback של transition שבוטל אינו רשאי לעדכן state, focus, route או visibility.
4. לכל transition orchestration יש generation/epoch identifier; callback ישן נזרק אם אינו שייך ל־generation הפעיל.
5. anchor jump מדלג ישירות ל־target state. הוא אינו מנגן את כל ה־beats שבדרך.
6. שינוי language, reduced motion, visibility או capability מבטל motion פעיל ושומר DOM state, focus ו־scroll.
7. reverse scroll רשאי להפוך scene transition ב־Act 1; DOM content שכבר נחשף אינו נעלם ואינו חוזר ל־opacity `0`.
8. route navigation מבטלת scene/DOM choreography לפני unmount ומחזירה focus לפי חוזה ה־route, לא לפי animation end.

### Implementation priority

| Need | Preferred mechanism | Reason |
|---|---|---|
| control/state feedback | CSS transition | retargetable, compositor-friendly, מינימום runtime |
| menu/simple panel | CSS transition | state ידוע ושני endpoints |
| coordinated DOM handoff | WAAPI רק אם CSS אינו מספיק | cancel/reverse ו־imperative control ללא React frame updates |
| scene interpolation | WebGL render loop | transform/material/camera בתוך owner יחיד |
| native video playback | media element | אין orchestration מלאכותי |

CSS transitions עדיפות על WAAPI; WAAPI עדיפה על keyframes/JS choreography. keyframes אינן משמשות ל־menu, route, beat או error states. בחירת library בפועל נשארת ל־technical spike, אך semantic tokens והחוזים אינם תלויים ב־library.

### Transform ownership and performance

- כל element מקבל owner יחיד ל־`transform`; אין mixing בין Motion `x/y`, CSS transform ו־WebGL על אותו surface.
- אין React state update או inherited CSS variable write בכל frame.
- `will-change` מתווסף רק בזמן transform/opacity transition ומוסר ב־end/cancel.
- אין permanent compositor promotion לקבוצות cards או rails.
- CSS variables סטטיים מותרים ל־tokens; pointer/frame values אינם נכתבים ל־ancestor יורש.
- RAF פועל רק עבור scene פעילה, visible, full-motion וב־Act 1.
- scene/DOM cancellation משחררת listeners, WAAPI handles ו־will-change גם כאשר אין `transitionend`.

### Reduced-motion token mapping

| Full token | Reduced equivalent |
|---|---|
| `motion-instant` | `0ms` |
| `motion-press` | `100–140ms` color/opacity; keyboard `0ms` |
| `motion-fade` | `0–120ms` opacity בלבד |
| `motion-hover` | color/opacity בלבד או none |
| `motion-ui` / `motion-route` | `0–120ms` opacity בלבד; ללא slide/scale |
| `motion-reveal` | content final; `0–120ms` opacity אופציונלי |
| `motion-scene-mobile` / `motion-scene` | `0ms` poster state swap |
| stagger | `0ms` לכל הפריטים |

`prefers-reduced-motion` נבדק לפני scene import ובכל runtime change. אין transition property כללית שממשיכה להניע transform לאחר שה־mode השתנה.

### RTL and direction

1. route/menu micro-slide משתמש ב־logical inline direction כאשר spatial meaning קיים.
2. סדר המסע, chapter numbers ו־Conversion→Growth→Complexity אינם מתהפכים.
3. camera, sculpture geometry ו־product screenshots אינם mirrored; screen anchor ו־DOM rail עוברים ל־`inline-end` המתאים.
4. transition duration/easing/stagger זהים בשתי השפות; רק כיוון spatial transform משתנה.
5. language swap אינו מעיף את הטקסט לצד; reflow מיידי ו־crossfade קצר שומרים focus.

### Motion QA matrix

- להאט את כל animations ל־10% ולבדוק transform origin, paired timing ו־1px jumps.
- להפעיל כל menu/route/beat transition במהירות הלוך־חזור ולוודא retarget ללא restart.
- לקפוץ דרך Work/Lab/Contact בזמן T-01/T-02/T-03 ולוודא שאין stale callback או delayed content.
- להחליף language, reduced motion ו־tab visibility באמצע transition ולוודא cleanup מלא.
- לחפש `transition: all`, animation של layout properties, permanent `will-change` ו־CSS variable frame writes.
- למדוד simultaneous compositor layers, main-thread tasks, RAF count ו־frame rate ב־desktop/mobile.
- לבדוק touch שאין hover-on-tap וש־press feedback אינו מעכב navigation.
- לבדוק keyboard שכל focus, anchor, menu ו־route action מיידיים וללא transform.
- להשוות full/reduced/no-WebGL ולוודא אותו content order, פעולות ו־active state.

### Acceptance criteria for MOT-007

1. כל motion משתמש באחד מעשרת duration tokens, ארבעת easing tokens וארבעת purpose categories המאושרים; חריגה דורשת החלטה מתועדת.
2. routine UI נשאר מתחת `300ms`; narrative motion אינו עולה על `1000ms` ואינו חוסם content או input.
3. keyboard, focus, skip links, anchor jumps ו־critical state הם `0ms` ואינם מפעילים transform.
4. stagger מוגבל ל־`40ms` step, ‏`160ms` total, עד חמישה nodes/signals, ונכבה ב־reduced motion וב־navigation restore.
5. `L2` DOM continuity ו־`L3` scene continuity אינם מבצעים motion משמעותי יחד; control feedback נשאר responsive.
6. כל transition משמעותי ניתן ל־cancel, reverse או retarget מהמצב הנוכחי; intent חדש אינו ממתין ל־animation קודמת.
7. callback ישן אינו משנה state לאחר cancel; language/reduced/visibility/route changes שומרים focus, scroll ו־activeBeat.
8. אין `transition: all`, layout-property animation, spring/overshoot, pointer-camera coupling, magnetic CTA, inherited per-frame CSS variable או permanent `will-change`.
9. reduced motion ממפה כל token ל־`0–120ms` opacity/instant, אינו טוען scene ואינו משתמש ב־stagger או transform.
10. motion system זהה במשמעות ב־desktop/mobile, LTR/RTL, full/reduced/no-WebGL, ועומד בחוזי MOT-001 עד MOT-006 בלי ליצור מקור אמת נוסף.

## 7P. Gate 3 completeness review — סגור

בדיקת השלמות בוצעה לאחר אישור `MOT-007`. היא בוחנת אם Phase 3 יוצר חוזה נרטיבי וטכני אחד שאפשר למסור ל־Technical Spike, ולא רק אוסף מסמכי motion נפרדים.

| תחום | מקור מחייב | תוצאת הבדיקה |
|---|---|---|
| מסע ו־story state | `MOT-001` | 12 beats בחמישה acts, עם proof, focal point, fallback ויציאה לכל beat |
| camera grammar | `MOT-002` | ארבעה states ושלושה transitions ב־Act 1 בלבד; לאחר מכן `CAM-PARKED` |
| בעלות DOM/WebGL | `MOT-003` | DOM הוא מקור האמת; WebGL הוא subscriber דקורטיבי ואינו מחזיק תוכן או interaction |
| reduced motion | `MOT-004` | אותו מסע ואותן פעולות באמצעות posters ו־DOM/SVG, ללא טעינת scene כברירת מחדל |
| mobile | `MOT-005` | עריכה נרטיבית עצמאית לכל 12 ה־beats, fixed camera ו־WebGL אופציונלי בלבד |
| loading/failure | `MOT-006` | content-first, poster-first, recovery ללא reset וללא loader או fake success |
| timing/orchestration | `MOT-007` | tokens סופיים, lanes נפרדים, intent אחרון מנצח ו־cancel/reverse/retarget ללא stale state |

### Invariants שנבדקו לרוחב כל המערכת

1. native scroll נשמר; אין scroll hijacking, scrub רציף, intro חוסם או מסע שמותנה ב־animation.
2. כל 12 ה־beats נשארים מובנים ושמישים ב־desktop/mobile, עברית/אנגלית, full/reduced/no-WebGL ובכשל scene או media.
3. תוכן, navigation, CTA, focus, URL ו־active beat אינם תלויים ב־canvas readiness או callback של animation.
4. ה־scene מסתיים לפני NIS ואינו חוזר בפרקי הפרויקטים, ב־Lab או ב־Contact.
5. choreography אינה יוצרת מקור אמת נוסף: DOM state משתנה מיד ו־motion רק מסביר אותו.
6. אין סתירה חוסמת בין camera, mobile, reduced motion, failure states ו־token durations.

### פריטים פתוחים שאינם חוסמים את Gate 3

- חסרים capture-ים אמיתיים ל־Online Converter ול־Emergency Protocol Diagram. הם נדרשים לפני בניית הפרקים שלהם, אך אינם חוסמים spike מוגבל ל־Hero→NIS.
- נדרשים תיקוני copy קנוני ב־`src/data/profile.ts`; הם יבוצעו רק במסגרת מימוש מאושרת ולא במשימת המחקר.
- נכס production אמיתי ל־Signal Forge טרם הופק. תמונת הכיוון המאושרת היא יעד חזותי, לא asset שמותר להכניס למוצר.
- טרם נבחר renderer או stack ל־WebGL; הבחירה תיעשה בתוך ה־spike על בסיס budget, fallback ויכולת תחזוקה, לא לפניו.

### תוצאת Gate 3

אין blocker תכנוני ל־Technical Spike. `MOT-001` עד `MOT-007` מאושרים, Phase 3 הושלם ו־Gate 3 נסגר ב־2026-07-14.

**הסגירה אינה אישור לקוד, scaffold, deployment או שינוי production.** התחלת Phase 4 דורשת אישור ביצוע נפרד לאחר הצגת תנאי הכניסה והיקף ה־spike.

## 7Q. Phase 4 entry brief — מוכן, ממתין לאישור ביצוע

### שאלת ה־spike

האם אפשר לממש את הרגע הקשה ביותר — `Hero / Signal Forge → NIS / Conversion` — ברמת fidelity שמרגישה מכוונת ומרשימה, תוך שמירת תוכן מיידי, native scroll, mobile עצמאי, reduced motion, no-WebGL fallback ותקציבי הביצועים של Gate 0?

### היקף מותר לאחר אישור ביצוע

- scaffold מבודד בלבד תחת `experiments/portfolio-experience-v2/` עם פקודות dev/build נפרדות.
- beats `00–03` בלבד: Hero, התקרבות ל־core, topology ושליחת signal אל NIS.
- Hero מינימלי, transition ראשון ופרק NIS חלקי שמספיק להוכחת ה־handoff.
- desktop, mobile, reduced motion ו־no-WebGL מאותו חוזה תוכן.
- poster-first boot, failure injection ו־legacy regression.

### מחוץ להיקף

- אין בנייה מלאה של Online Converter, Emergency Protocol, Lab, About או Contact.
- אין שינוי ל־`src/`, ל־build הקיים, לנתיבים הקנוניים, ל־SEO, ל־Cloudflare או לדומיין.
- אין deployment, custom domain, feature flag או החלפת production.
- אין assets מזויפים, copy מומצא או scene שמתחזה ל־production ready.

### תנאי כניסה לפני שורת קוד ראשונה

1. אישור מפורש להתחיל Phase 4 כמשימת ביצוע, בנפרד מאישור מסמך התכנון.
2. בחירת נכסי NIS אמיתיים ל־handoff הראשון מתוך ה־inventory המאושר.
3. הגדרת דרך הפקה חוקית ומעשית לנכס Signal Forge אמיתי; ה־concept image משמש reference בלבד.
4. baseline חוזר ל־legacy (`npm run validate`) ואימות שאין שינוי לא מכוון בקבצים קיימים.
5. החלטה שה־preview נשאר local/isolated עד Gate 4; כל deployment ידרוש אישור נוסף.

### תוצרי חובה

- preview מבודד של Hero→NIS בכל ארבעת המסלולים: full desktop, full mobile, reduced motion ו־no-WebGL.
- דוח bundle/loading/FPS/memory מול budgets של Gate 0.
- מטריצת failure עבור asset failure, scene init failure, context loss ו־runtime preference change.
- בדיקת fidelity מול יעדי Signal Forge המאושרים, ללא העתקת Lusion וללא שימוש בתמונה כתחליף למערכת.
- Legacy Regression Suite מלא והוכחה שהאתר הישן ותהליך הוספת הפוסטים לא השתנו.

### תנאי יציאה ל־Gate 4

ה־spike עובר רק אם הרגע Hero→NIS מרגיש נכון ב־desktop ובמובייל, כל ה־fallbacks שומרים על אותו מסע, תקציבי Gate 0 עומדים, וכל P0/P1 סגור. לאחר מכן עוצרים להצגה ולאישור; אין התרחבות אוטומטית ל־Production Build.

## 7R. Phase 4 Technical Spike — סבב ראשון הושלם, Gate 4 פתוח

האישור להתחיל את Phase 4 ניתן במפורש ב־2026-07-14. נוצר יישום מבודד תחת `experiments/portfolio-experience-v2/` בלי לחבר אותו לנתיב, build או deployment של האתר הקיים.

### מה נבנה

- Hero דו־לשוני מלא עם identity, הבטחת הערך, supporting copy ושני CTA כ־DOM מיידי.
- asset עצמאי ל־Signal Forge שנוצר מן היעד המאושר, הופרד מטקסט UI והומר מ־PNG של `2.1 MB` ל־WebP של `149 KB`.
- תגובת pointer מוגבלת ל־artwork בלבד, native scroll ו־motion tokens המאושרים.
- signal conductor שמוביל מ־Conversion/Growth/Complexity אל פרק NIS.
- מעבר ממשי מ־abstraction למדיית NIS אמיתית: brand card, salad cups ו־event food.
- פרק NIS חלקי שמציג צורך, החלטת WhatsApp, product proof וקישור לפרויקט החי.
- מסלול mobile עצמאי ב־`390×844`, תפריט נגיש, CTA stacked ומפת signals אנכית.
- עברית/אנגלית עם עדכון `lang`, ‏`dir`, copy ו־RTL ללא reset למסע.
- `noindex, nofollow`, fonts מקומיים, reduced-motion CSS ו־poster-first/no-WebGL baseline.

### הוכחות בדיקה

| בדיקה | תוצאה |
|---|---|
| V2 build | עבר; JS `212.95 KB` / `66.19 KB gzip`, CSS `15.29 KB` / `4.06 KB gzip` |
| Hero asset | `149 KB` WebP לאחר compression |
| Desktop | נבדק ב־`1440×900`; אין horizontal overflow או console errors |
| Mobile | נבדק ב־`390×844`; אין horizontal overflow או console errors |
| bilingual/RTL | language switch משנה `lang`, ‏`dir` ואת כל ה־copy; Hebrew menu נבדק |
| primary journey | CTA ראשי מגיע ל־`#signals`; Conversion ממשיך ל־`#work` ולמדיית NIS |
| visual QA | side-by-side מול יעדי desktop/mobile עבר ללא P0/P1/P2; `design-qa.md` מסומן `passed` |
| legacy regression | `npm run validate` עבר, `18/18` tests ו־24 routes; artifacts חזרו בדיוק ל־CSS `63.96 KB` ו־JS `807.79 KB` |

### ממצא בידוד ותיקון

Tailwind v4 של ה־legacy סרק אוטומטית את קבצי ה־experiment והגדיל את artifact ה־CSS מ־`63.96 KB` ל־`64.57 KB`, אף שה־V2 לא יובא לקוד הקיים. הממצא נתפס לפני commit או deployment. נוסף `@source not "../experiments"` ל־`src/index.css`; build חוזר החזיר את artifact המקורי ואת hash ה־CSS המקורי.

זהו שינוי guardrail יחיד ב־legacy: הוא אינו משנה UI או התנהגות, אלא מונע מתוכן V2 להיכנס ל־CSS הקנוני דרך auto-detection.

### מה טרם הוכח

- לא נבנתה שכבת WebGL. הסבב הנוכחי מוכיח poster-first visual fidelity, pointer continuity והמעבר ל־NIS; `PRO-004` נשאר פתוח להכרעה אם WebGL מוסיף ערך שמצדיק bundle, memory ותחזוקה.
- reduced motion קיים בקוד אך preference emulation ייעודית טרם הורצה בדפדפן.
- לא נמדדו עדיין LCP, FPS, memory או context loss; נמדדו bundle ו־asset sizes בלבד.
- Safari, Firefox ומכשיר mobile אמיתי טרם נבדקו.
- לא נוצר preview חיצוני או Cloudflare project.

### מצב Gate 4

Gate 4 נשאר פתוח. אין מעבר ל־Phase 5 לפני הצגה ואישור תחושת ה־spike, הכרעת WebGL, השלמת performance/failure evidence וסגירת כל P0/P1.

## 7S. Phase 4 Performance, Failure ו־WebGL Decision — הושלם ב־Chrome

סבב הראיות השני בוצע ב־2026-07-14 על build ייצור מקומי של ה־spike, ללא deployment וללא חיבור ל־legacy. סביבת המדידה הייתה Chrome `150`, viewport של `390×844` ב־DPR `3`, ‏Slow 4G ו־CPU×4. כל ריצת cold load השתמשה ב־origin חדש כדי למנוע cache חם; אלה נתוני lab בלבד ואין להציגם כנתוני משתמשים אמיתיים.

### ממצא ותיקון נתיב הטעינה

הטעינה הקרה הראשונה חשפה LCP של `5.383s`, אף שמדידה קודמת עם cache חם נראתה כמו `1.8s`. הגורמים היו גילוי מאוחר של תמונת ה־Hero ושליחת artwork בגודל `1586×992` גם למובייל, לצד media של NIS שנמשכה מוקדם מדי.

בוצעו ארבעה תיקונים מבודדים ב־V2 בלבד:

1. preload מותאם־media ל־Hero לפני אתחול React.
2. `loading="lazy"`, ‏`decoding="async"` ומידות מפורשות למדיית NIS שמתחת לקפל.
3. `<picture>` עם נגזרת mobile של `800×500` ו־`21,604` bytes; artwork ה־desktop נשאר `152,828` bytes.
4. כשל artwork מסיר את התמונה השבורה ושומר את ה־headline, שני ה־CTA והמעבר ל־signals.

### תוצאות סופיות מול Gate 0

| מדד | תוצאה | Gate | סטטוס |
|---|---:|---:|---|
| LCP cold load — ריצה 1 | `1.822s` | `≤2.5s` | עבר |
| LCP cold load — ריצה 2 | `2.362s` | `≤2.5s` | עבר |
| LCP cold load — ריצה 3 | `2.297s` | `≤2.5s` | עבר |
| LCP חציון / גרועה | `2.297s` / `2.362s` | `≤2.5s` | עבר |
| CLS | `0.00` | `≤0.1` | עבר |
| INP — language switch ב־CPU×4 | `124ms` | `≤200ms` | עבר; מעל יעד העבודה `100ms` |
| Motion — Hero→NIS smooth scroll | `112.4 FPS` ממוצע, p95 frame `9.1ms`, ‏`99.6%` מהפריימים ב־`40 FPS+` | `40–45 FPS` mobile | עבר |
| Long tasks | משימה אחת של `65ms`, ללא חזרתיות | אין long tasks חוזרים | עבר |
| JS heap לאחר המסע | `2.7 MB` used / `3.7 MB` total | למדוד ולזהות חריגה | עבר ללא חריגה נראית ב־spike |
| Initial JS | `213.46 KB` / `66.35 KB gzip` | `≤250 KB gzip` | עבר |
| CSS | `15.34 KB` / `4.08 KB gzip` | מעקב | עבר |
| Lighthouse Accessibility | `100` | `98+` | עבר |
| Lighthouse Best Practices | `100` | ללא כשל ידוע | עבר |

Lighthouse SEO הוא `58` במכוון: ה־spike המקומי מוגדר `noindex, nofollow` ואינו כולל את `robots.txt`/`llms.txt` של המוצר הסופי. זה אינו אישור ל־SEO של V2; יעד `100` נשאר מחייב לפני Production Build.

### Failure matrix

| מצב | הזרקה / בדיקה | תוצאה |
|---|---|---|
| no-WebGL | אין canvas, renderer או ספריית 3D ב־bundle או ב־network | כל המסע, המדיה, התוכן וה־CTA עובדים |
| Hero asset failure | הוחלף mobile `srcset` ל־URL חסר בזמן ריצה | ה־picture הוסר ללא broken-image UI; headline, CTA ו־`#signals` נשמרו; אין overflow |
| reduced motion | preference הוזרק לפני mount ונבדקו מסלול JS וכללי CSS | כל `.reveal` גלוי, pointer motion מושבת, smooth scroll מבוטל וכל transition יורד ל־`0.01ms` |
| scene init failure | לא רלוונטי לאחר החלטת no-WebGL ב־V1 | אין scene שיכול לחסום readiness או תוכן |
| context loss | לא רלוונטי לאחר החלטת no-WebGL ב־V1 | אין WebGL context ואין state מוצר ב־canvas |
| console/runtime | טעינה ואינטראקציה ב־Chrome | אפס error/warn/issue רלוונטיים |

### החלטת WebGL — היסטורית, הוחלפה עבור V2 על ידי DEC-033

החלטה זו הייתה נכונה ל־spike שנבדק באותו רגע, אך אינה עוד מצב ה־V2 הפעיל. לאחר שאביתר קבע שה־poster-only אינו מספק מסע מצלמה אמיתי וביקש לממש את כל שכבת ה־signature motion, נפתח החריג שהוגדר כאן: `DEC-033` מחייב WebGL ב־Act 1 בלבד, עם budget נפרד, טעינה עצלה, poster-first ו־fallback מלא. ההיסטוריה נשמרת כדי לתעד מדוע נדרשה פתיחה מחדש.

`PRO-004` ו־`PRO-007` הושלמו. `PRO-008` נשאר פתוח: Chrome desktop/mobile emulation עבר, אך Safari, Firefox ומכשיר mobile אמיתי אינם זמינים בסביבת הבדיקה הנוכחית ולא הוצהר כאילו נבדקו.

### מצב Gate 4 לאחר סבב הראיות

כל P0/P1 שנמצא ב־Chrome נסגר, ה־legacy עבר שוב `npm run validate` עם `18/18` tests, ‏24 routes ואותם artifacts (`CSS 63.96 KB`, ‏`JS 807.79 KB`). Gate 4 נשאר פתוח רק עבור `PRO-008` ואישור סופי של אביתר לתוצאה המעודכנת. אין deployment ואין מעבר ל־Phase 5.

## 7T. Phase 4 Cross-Browser Capability Audit — אישור spike התקבל, PRO-008 פתוח

ב־2026-07-14 אביתר אישר להמשיך לאחר הצגת תוצאות ה־spike, תקציבי הביצועים והחלטת no-WebGL. בכך אושרו תחושת ה־Hero→NIS ו־DEC-029. האישור אינו מבטל את חוזה `PRO-008` ואינו מאשר Phase 5 או deployment.

### סביבת הבדיקה הזמינה

- מותקן בפועל רק Google Chrome; לא נמצאו Safari או Firefox ב־`/Applications`, ‏`/System/Applications` או `~/Applications`.
- לא נמצאו browser binaries קיימים של Playwright/WebKit/Firefox ולא קיימת תלות Playwright בריפו או ב־experiment.
- Browser plugin אינו חשוף ככלי callable בסשן הנוכחי; בדיקת Chrome בוצעה באמצעות Chrome DevTools הקיים.
- הורדת Firefox/WebKit תהיה הוספת browser binaries חיצונית של מאות MB ודורשת אישור מפורש. גם WebKit של Playwright אינו הוכחה ל־Safari אמיתי, ומנוע desktop אינו הוכחה למכשיר mobile פיזי.

### בדיקת תאימות סטטית והקשחה

- build ברירת המחדל של Vite 6 ממפה `modules` ל־`es2020`, ‏Edge `88`, ‏Firefox `78`, ‏Chrome `87` ו־Safari `14`.
- שימושי `svh`, ‏CSS logical properties ו־`object-fit` נבדקו מול `caniuse-lite` המקומי ונמצאו נתמכים בגרסאות Safari/iOS ו־Firefox המודרניות שנבדקו סטטית.
- `backdrop-filter` דורש prefix ב־Safari 16–17; נוסף במקור `-webkit-backdrop-filter` לשני משטחי ה־glass. ה־production CSS מכיל את שתי הצורות ושומר גם background אטום כ־fallback.
- נוסף favicon מפורש לאחר ש־Chrome smoke test חשף בקשת `/favicon.ico` עם `404`; טעינה חוזרת הסתיימה ללא error/warn/issue בקונסול.

### Chrome smoke חוזר ו־preview למכשיר

ה־production build נבדק שוב ב־`390×844`, ‏DPR `3`: page identity ו־DOM תקינים, עברית משנה `lang=he` ו־`dir=rtl`, התפריט עובר ל־`aria-expanded=true`, אין horizontal overflow ואין console errors. ה־legacy עבר שוב `npm run validate`, ‏`18/18` tests ו־24 routes עם אותם artifacts.

נפתח preview מקומי בלבד על `http://10.0.0.4:4187/` למכשיר באותה רשת. זה אינו deployment, אינו נגיש מחוץ לרשת המקומית ואינו מהווה ראיית mobile אמיתי עד שהעמוד ייפתח וייבדק בפועל במכשיר.

### מצב Gate 4

אישור המשתמש על ה־spike ועל no-WebGL התקבל. Gate 4 נשאר פתוח רק בגלל `PRO-008`: אין עדיין runtime evidence מ־Firefox, Safari או מכשיר mobile אמיתי. אין לייצר סימון pass על בסיס התאימות הסטטית בלבד.

## 7U. Phase 4 Firefox/WebKit Runtime QA — engine evidence הושלם, Safari/mobile אמיתי פתוחים

אביתר אישר במפורש הורדה מבודדת של browser binaries מחוץ לריפו. Playwright הותקן רק תחת `/tmp/portfolio-v2-playwright-qa`, וה־binaries נשמרו ב־cache המשתמש; לא שונו `package.json`, ‏lockfiles או dependencies של ה־legacy או של ה־experiment.

### מטריצת runtime

| מנוע | גרסה | viewport | תוצאה | ראיות |
|---|---:|---|---|---|
| Firefox | `151.0` | `1440×900`, DPR `1` | עבר פונקציונלית | HTTP 200, Hero וה־desktop asset נטענו, EN→HE שינה `lang/dir`, CTA ומסלול Signal→Work עבדו, אין overflow/page errors/request failures |
| Firefox | `151.0` | `390×844`, DPR `3`, touch | עבר פונקציונלית | mobile asset `800px` נבחר, תפריט נפתח עם `aria-expanded=true`, RTL/CTA/journey עברו וללא overflow/page errors/request failures |
| WebKit | `26.5` | `1440×900`, DPR `1` | עבר | אותן בדיקות עברו ללא console warnings/errors וללא request failures |
| WebKit | `26.5` | `390×844`, DPR `3`, touch | עבר | mobile asset, תפריט, RTL, CTA והמסע עברו ללא console warnings/errors וללא request failures |

Firefox דיווח warning אינפורמטיבי אחד בכל viewport: ה־preload של תמונת ה־Hero המיועדת ל־media query האחרת הוזנח. המשאב הנכון נבחר ונטען בכל תרחיש, לא הייתה בקשת רשת שנכשלה ולא נוצרה שגיאת עמוד; לכן זה מתועד כ־engine diagnostic ידוע ולא כרגרסיה פונקציונלית. WebKit היה נקי לחלוטין.

בדיקת WebKit מחזקת תאימות מנוע אך אינה שקולה ל־Safari אמיתי: היא אינה כוללת את מעטפת Safari, גרסת iOS פיזית, thermal behavior או מגבלות device. לכן `PRO-008` נשאר פתוח עבור Safari ומכשיר mobile אמיתי, וה־LAN preview נשאר זמין ב־`http://10.0.0.4:4187/`.

### מצב Gate 4 לאחר runtime QA

Chrome, Firefox ו־WebKit מכוסים כעת ב־desktop/mobile-emulation evidence. אין P0/P1 חדש. Gate 4 נשאר פתוח רק עבור Safari בפועל ומכשיר mobile פיזי; אין deployment ואין מעבר ל־Phase 5.

## 7V. Phase 4 Safari Desktop Runtime QA — REG-004 נמצא ונסגר

Safari אמיתי אותר דרך הממשק הגרפי המקומי ונבדק ישירות מול production preview ב־`127.0.0.1:4187`; זו אינה בדיקת Playwright WebKit. לאחר טעינת ה־Hero והחלפת EN→HE, ה־CTA עדכן את ה־URL ל־`#signals`, אך התוכן החזותי של Signal Map ופרק NIS נשאר מוסתר בעוד שהוא עדיין הופיע בעץ הנגישות. זה סווג `REG-004` כ־P1 משום שהמסע הפך למסך ריק בדפדפן נתמך.

מקור הכשל היה תלות של תוכן מהותי ב־`IntersectionObserver` ובמצב opacity התחלתי. התיקון שינה את reveal ל־fail-open: תוכן הפרקים מוצג תמיד ואינו תלוי ב־JavaScript או ב־observer כדי להפוך לנראה. שכבת ה־observer הוסרה; motion דקורטיבי אינו רשאי עוד לשלוט בנראות התוכן.

לאחר build חדש וטעינה עם cache-buster, Safari עבר באנגלית ובעברית: Hero, ‏RTL, ‏Signal Map, ‏CTA ל־`#signals`, מעבר ל־`#work`, כותרת NIS ומדיית המוצר האמיתית נראו ופעלו. בדיקות Firefox/WebKit החוזרות שמרו על RTL, CTA, responsive assets, ללא overflow, page errors או request failures. bundle סופי: JavaScript `213.05 KB` / `66.18 KB gzip`; CSS `15.19 KB` / `4.06 KB gzip`.

Legacy validation חשף בנפרד שה־Tailwind auto source detection סרק גם את מסמך מקור האמת תחת `docs/` והגדיל את CSS ל־`64.53 KB`. נוסף `@source not "../docs"` לצד החרגת `experiments/`; build חוזר החזיר את ה־legacy artifact ל־baseline של `62.46 KB` / `9.62 KB gzip`, ‏JavaScript `807.79 KB` / `220.54 KB gzip` ו־24 routes. האירוע מתועד כ־`REG-005` ואינו שינוי UI.

Safari desktop מכוסה כעת. `PRO-008` נשאר פתוח רק עבור מכשיר mobile פיזי; בדיקת desktop Safari או mobile emulation אינן תחליף ל־thermal/touch/viewport behavior של מכשיר אמיתי.

בדיקת סביבת המשך לא מצאה iPhone/iPad מחובר ב־USB. Xcode דרש additional required components עבור Simulator; לאחר אישור מפורש של אביתר הרכיבים הותקנו, והסבב המשלים מתועד להלן. התוצאה נחשבת simulator evidence בלבד ולא mobile פיזי.

## 7W. Phase 4 iOS Simulator Safari QA — ראיית mobile runtime נוספה

לאחר אישור הפעולה הותקנו רכיבי ה־Simulator של Xcode, הופעל `iPhone 17` עם `iOS 26.4`, ו־Safari `26.4` חובר ל־preview המקומי ב־`127.0.0.1:4187`. הבדיקה נעשתה ב־Safari של ה־Simulator וב־WebDriver המובנה של Apple, לא באמצעות Chrome emulation או Playwright WebKit. ה־viewport שנמדד בדף היה `402×714` CSS pixels.

### תוצאות מסע המובייל

| בדיקה | תוצאה | ראיה |
|---|---|---|
| Page identity וטעינת Hero | עבר | title היה `Signal Forge — Portfolio Experience V2`; תמונת ה־Hero המובייל נטענה ברוחב טבעי `800px` |
| EN→HE ו־RTL | עבר | האינטראקציה החליפה `lang=en/dir=ltr` ל־`lang=he/dir=rtl` והכותרת הוחלפה לנוסח העברי |
| תפריט mobile | עבר | התפריט נפתח חזותית, `aria-expanded=true`, והציג עבודות, מעבדה ויצירת קשר |
| תפריט→Lab | עבר | לחיצה על מעבדה עדכנה ל־`#signals`, גללה את Signal Map לראש ה־viewport וסגרה את התפריט |
| CTA ראשי→Signals | עבר | לחיצת WebDriver מדומה־touch על `See the work in action` עדכנה ל־`#signals` ו־`signalsTop=0` |
| Signal→Work | עבר | קישור האות הפעיל קיבל focus והופעל ב־Enter ב־Safari; נוצר אירוע click, ה־URL עבר ל־`#work` ו־`workTop=0` |
| פרק NIS | עבר | הכותרת וה־lead נראו; `opacity=1`, ‏`transform=none`; שלוש התמונות נטענו עם `naturalWidth` של `1080`, ‏`1200` ו־`945` |

לצורך בדיקת ניווט מקלדת הופעלה זמנית Full Keyboard Access ב־Simulator והוחזרה ל־Off בסיום. Safari Remote Automation כבר היה מאופשר; לא הופעל `safaridriver --enable` ולא נדרש שינוי הרשאות נוסף. ניסיון touch נוסף על קישור האות לאחר smooth scroll לא נמסר על ידי WebDriver, ולכן אותו מעבר הופעל והוכח דרך focus+Enter; קישור touch אל Signals והתפריט עצמו כן הופעלו ב־input מדומה־touch. זהו diagnostic של כלי ה־Simulator ולא רגרסיית מוצר, משום שה־href, אירוע ה־click, מצב ה־DOM והמסע המקביל ב־WebKit כבר הוכחו.

לא נמצא P0/P1/P2 חדש. `PRO-008` ו־Gate 4 נשארים פתוחים רק עבור מכשיר mobile פיזי: Simulator אינו מוכיח thermal behavior, קצב פריימים תחת עומס מכשיר, safe-area/toolbar שונות בין דגמים או touch פיזי. אין deployment ואין מעבר ל־Phase 5.

## 7X. Phase 4 Scroll Motion Pass — REG-006 נמצא ונסגר

אביתר זיהה שה־spike אמנם מציג את כל התוכן לאחר תיקון `REG-004`, אך אינו מייצר מסע ממשי בזמן גלילה. החוסר סווג `REG-006` כ־P2: התוכן היה שמיש, אך progression, pacing והחיבור Hero→Signals→NIS שנדרשו ב־motion contract לא באו לידי ביטוי.

התיקון שומר את חוזה ה־fail-open במלואו: כל `.reveal` מוצג כברירת מחדל ב־`opacity: 1` ו־`transform: none`. מעל הבסיס נוספה שכבת enhancement בלבד, באמצעות `IntersectionObserver` עם fallback פסיבי של בדיקת scroll/resize כל `48ms`. ארבע פעימות נחשפות פעם אחת ואינן מתאפסות בגלילה לאחור: Signal Map, פתיחת NIS, מדיית NIS ו־decision grid. ה־Hero מגיב לפאזת המסע, רשת SVG מתכנסת אל conductor מרכזי, שורות האות מקבלות stagger של `0/40/80ms`, ופרק NIS ממשיך את אותו קו דרך intro, media והחלטות.

האנימציה פועלת רק ב־direct input. ניווט מקלדת, כניסה ישירה ל־`#signals`/`#work`, מצב programmatic ו־`prefers-reduced-motion` מקבלים תוכן סופי מיד וללא staging. כניסה ראשונית עם hash תוקנה כך שהיעד נגלל לראש ה־viewport לאחר mount, בלי smooth motion ובלי replay. pointer parallax ו־hover מופעלים רק תחת `(hover: hover) and (pointer: fine)`; במובייל ה־Hero משנה opacity בלבד ורשת ה־SVG מוחלפת ב־rail האנכי הקיים.

### ראיית QA לסבב

| תרחיש | תוצאה |
|---|---|
| Desktop `1280×720` | פאזות Hero→Signals→NIS התחלפו; רשת האות, השורות, conductor, media והחלטות נמדדו באמצע keyframe ולאחר השלמה |
| גלילה לאחור וחזרה | כל ארבע הפעימות נשארו `seen`; התוכן נשאר סופי והאנימציות לא שוחזרו |
| Keyboard/programmatic | playback הוחלף ל־`skip`; ‏`html` עבר ל־`scroll-behavior: auto`; כל reveal נשאר `opacity: 1`, ‏`transform: none`, ‏`animation: none` |
| Direct hash | `#signals` הגיע ל־`signalsTop=0`; ‏`#work` הגיע ל־`workTop≈0`, פאזת `nis`, וכל הפעימות דולגו ללא staging |
| Mobile `390×844` ו־`320×568` | נכס mobile נטען, רשת desktop הוסתרה, Hero נשאר ללא translate, ולא נמצא horizontal overflow |
| Hebrew/RTL + menu | `lang=he`, ‏`dir=rtl`, אין overflow; התפריט נפתח עם `aria-expanded=true` והציג את כל שלושת הקישורים |
| Reduced motion | בסיס ה־CSS, ענף `matchMedia` וכללי ה־media query נבדקו סטטית כ־fail-open; runtime override חדש לא היה זמין בכלי ה־Browser בסבב זה, ולכן אין טענה לראיית runtime חדשה מעבר לראיה הקודמת של PRO-006 |
| Console | לא נמצאו errors או warnings חדשים בתרחישי הדפדפן |

ביקורת קוד/runtime סופית מצאה וסגרה עוד שני P2 לפני Gate: `REG-007` מנע ירושה של smooth scroll בניווט keyboard/programmatic, ו־`REG-008` ניקה state של motion ב־effect cleanup כדי ש־React StrictMode לא יחשיב reveal ככבר נוגן בהרצת dev הכפולה. ב־Vite dev בגובה `900px` ה־Signal נשאר `seen=null` ו־`animation=none` לפני גלילה; לאחר `140px` גלילה עבר ל־`seen=true`, ‏`playback=play` ו־`signal-network-reveal`.

V2 build עבר עם JavaScript `218.57 KB` / `67.79 KB gzip` ו־CSS `19.60 KB` / `4.78 KB gzip`. ‏Legacy `npm run validate` עבר עם `18/18` tests, ‏24 routes וה־artifacts הקנוניים ללא שינוי: CSS `62.46 KB` / `9.62 KB gzip`, JavaScript `807.79 KB` / `220.54 KB gzip`. אין deployment ואין מעבר ל־Phase 5; `PRO-008` נשאר פתוח למכשיר mobile פיזי על הגרסה המעודכנת.

## 7Y. Human Override — הרשאה מוגבלת ל־ENG-001 לפני סגירת Gate 4

לאחר שהוצג במפורש כי `PRO-008` חסום רק על מכשיר mobile פיזי, אביתר אישר להמשיך. לפי Human Override Protocol האישור מתועד כחריג מוגבל: מותר לבנות ולהציג את תשתית `ENG-001` בתוך ה־experiment בלבד, בלי להכריז ש־Gate 4 נסגר ובלי לפתוח את Phase 5 בכללותו.

### גבולות ההרשאה

- מותר: persistent shell, ניווט, חוזה route, תשתית transition, נגישות תפריט ו־skip link בתוך `experiments/portfolio-experience-v2/`.
- אסור: להתחיל `ENG-002` עד `ENG-010`, ליצור תוכן או routes מדומים, לפרוס preview חיצוני, לחבר custom domain, לשנות production או לסגור `PRO-008` ללא מכשיר פיזי.
- נקודת עצירה: לאחר הצגת תשתית `ENG-001`; route פנימי ראשון דורש הרשאה נפרדת וממומש תחת המשימה המתאימה לו.

### מצב המימוש

- נוסף `BrowserRouter` עם `ExperienceShell` מתמשך ו־`Outlet`; כרגע `/` הוא עמוד ה־V2 האמיתי היחיד.
- routes מתוכננים שלא נבנו אינם מוצגים כעמודי דמה. נתיב V2 לא ממומש עובר באופן fail-safe אל אותו נתיב באתר הקנוני.
- `Work` ממשיך לעוגן `#work`; ‏`Lab` ו־`Contact` מפנים זמנית לנתיבים הקנוניים הקיימים עד `ENG-005` ו־`ENG-006`.
- תפריט mobile נסגר מחוץ לסדר ה־Tab, נפתח עם focus על הקישור הראשון, נסגר ב־Escape ומחזיר focus לכפתור; נעילת scroll פעילה רק בזמן פתיחה.
- skip link מפנה ל־`#main-content`, היעד ניתן למיקוד, וניווט keyboard/programmatic אינו מקבל smooth scroll.
- נוסף token של `360ms` למעבר route, אבל לא נבנתה אנימציית עמוד מדומה. `ENG-001` נשארת פתוחה עד שניתן יהיה להוכיח מעבר בין `/` לבין route פנימי אמיתי.

### ראיית QA לסבב ENG-001 foundation

| תרחיש | תוצאה |
|---|---|
| Desktop `1280×720` | shell בגובה `72px`, ניווט קנוני, CTA→`#signals`, focus ליעד ו־Scroll Motion Pass נשמרו; console נקי |
| Mobile `390×844` | trigger בגודל `48×48`, אין overflow, פתיחה מעבירה focus ל־Work, ‏Escape סוגר ומחזיר focus, body scroll lock משתחרר |
| Hebrew/RTL | `lang=he`, ‏`dir=rtl`, תפריט, skip link וכותרות מקומיות; אין overflow |
| Build V2 | JavaScript `260.13 KB` / `82.21 KB gzip`; CSS `20.13 KB` / `4.94 KB gzip`; עדיין מתחת ל־Gate 0 budget של `250 KB gzip` |
| Legacy Regression | `npm run validate` עבר: lint, ‏`18/18` tests, ‏24 routes; CSS `62.46 KB` / `9.62 KB gzip`, JavaScript `807.79 KB` / `220.54 KB gzip` |

לא בוצעו deployment, commit או push. `PRO-008`, ‏Gate 4 ו־Release Gate נשארים פתוחים.

## 7Z. NIS Evidence Route — DEC-031

אביתר אישר במפורש את route ה־NIS הראשון. נבנה `/projects/nis_boutique/` כעמוד ראיות אמיתי, ללא placeholder וללא שינוי production. התוכן המורחב נשמר פעם אחת ב־`src/data/portfolioExperiences.ts`; נתוני ה־legacy נשארו ללא שינוי ב־`src/data/profile.ts`.

- צילום Hero/CTA חי אמיתי נוסף ב־`1440×900`, וצילום mobile עצמאי נוסף ב־`390×844`.
- העמוד מציג צורך עסקי, החלטת WhatsApp, מסע משתמש, הפרדת public/private, זרימת draft→publish, tradeoffs, תרומה ותוצאה ללא מדדים מומצאים.
- מעבר pointer משתמש ב־`route-enter`, ‏`360ms`, ‏`12px`, `ease-move`; focus ו־URL מתעדכנים מיד. keyboard, direct load, browser Back ו־reduced motion נשארים instant.
- Back מחזיר ל־launcher ול־scroll position המקוריים. skip, Brand ו־Work נשארים נכונים גם ב־detail route.
- Browser QA עבר ב־desktop וב־`390×844` RTL ללא overflow; built preview החזיר HTTP `200` בטעינה ישירה. אמולציית runtime חדשה ל־reduced motion לא הייתה זמינה ב־in-app Browser, ולכן הראיה בסבב זה היא חוזה CSS/build בלבד.
- V2 build: JavaScript `299.08 KB` / `93.66 KB gzip`; CSS `33.22 KB` / `7.19 KB gzip`. Legacy חזר ל־baseline המדויק: `18/18`, ‏24 routes, CSS `62.46 KB` / `9.62 KB gzip`, JavaScript `807.79 KB` / `220.54 KB gzip`.

`ENG-001` הושלם. `ENG-003` נשאר פתוח: NIS route/content slice קיים, אך שני הפרויקטים האחרים וצילומי Studio/Save draft→Publish עדיין חסרים. `PRO-008`, Gate 4, deployment ו־release נשארים פתוחים.

## 8. Regression Contract

### P0 — עוצר עבודה ושחרור

- אתר production אינו נטען.
- `npm run validate` נכשל בגלל עבודת V2.
- פוסט או נתיב ציבורי קיים מחזיר 404/soft-404.
- canonical, sitemap או metadata קיימים נשברים.
- V2 נכנס ל־production build לפני אישור.
- תוכן או תרגום קנוני נמחק או מתפצל לשני מקורות אמת.
- טופס קשר, WhatsApp או קישור פרויקט מרכזי מפסיקים לעבוד.

### P1 — חוסם מעבר Gate

- הבדל תוכן מהותי בין עברית לאנגלית.
- חוויית מובייל אינה שמישה או גורמת לחימום/תקיעות חריגים.
- אין fallback למכשיר ללא WebGL או ל־reduced motion.
- ניווט מקלדת אינו מאפשר להשלים את המסע.
- פרויקט מוצג באמצעות placeholder במקום נכס מאושר.
- preview נגיש למנועי חיפוש ללא `noindex` לפני Release Gate.
- הוספת פוסט דורשת עדכון ידני כפול.

### P2 — חייב תיקון לפני Release Gate

- motion לא עקבי, easing שונה או transition שבור.
- טקסט נחתך ברזולוציה נתמכת.
- asset נטען מאוחר ויוצר קפיצה חזותית.
- אזור אינו מתפקד נכון ב־RTL.
- קישור, focus state או hover state חסרים.
- חוויית loading ארוכה או לא מסבירה מה קורה.

### Legacy baseline — 2026-07-14

- `npm run validate`: עבר.
- ESLint: עבר.
- Vitest: קובץ בדיקות אחד, 18 מתוך 18 בדיקות עברו.
- Production build: עבר.
- Static routes: נוצרו 24 נתיבים ציבוריים.
- Bundle מרכזי נוכחי: `807.79 kB` minified, `220.54 kB` gzip.
- CSS מרכזי נוכחי: `62.46 kB` minified, `9.62 kB` gzip.
- הערת baseline: קיימת אזהרת Vite על chunk גדול מ־500 kB. זו אינה רגרסיית V2, אך היא תישמר להשוואה ולא תורשה להחמיר ללא החלטה.

#### Production routes and SEO

- `sitemap.xml` כולל 24 נתיבים ציבוריים.
- 24 מתוך 24 הנתיבים מחזירים HTTP 200 בדומיין `evyatarhazan.com`.
- 24 מתוך 24 הנתיבים מחזירים HTTP 200 גם ב־GitHub Pages.
- בדומיין הראשי, 24 מתוך 24 ה־canonical tags קיימים ומתאימים לנתיב הממותג.
- ב־GitHub Pages, 24 מתוך 24 ה־canonical tags מצביעים לנתיב המקביל בדומיין הממותג.

#### Production performance — lab baseline

| תרחיש | תנאים | TTFB | LCP | CLS | INP |
|---|---|---:|---:|---:|---:|
| Desktop cold load | ללא throttling | `42ms` | `1.163s` | `0.00` | לא נמדד |
| Mobile simulated cold load | `390×844`, ‏Slow 4G, ‏CPU ×4 | `53ms` | `1.891s` | `0.00` | לא נמדד בטעינה |
| Mobile controlled interaction | אותו mobile profile; החלפת theme | — | — | `0.00` | `89ms` |

- אין כרגע נתוני CrUX/field זמינים; המספרים לעיל הם מדידות lab נקודתיות וישמשו להשוואה חוזרת באותם תנאים.
- Lighthouse ב־desktop וב־mobile: נגישות `96`, Best Practices `77`, ‏SEO `100`.
- ה־JavaScript הראשי החי הוא `807,794` bytes וה־CSS הראשי `62,462` bytes; שניהם מוגשים כרגע עם cache של 4 שעות ו־`must-revalidate`.

#### Existing baseline findings — not V2 regressions

1. עמוד הפורטפוליו החי טוען AdSense, ‏DoubleClick, ‏adtrafficquality ו־reCAPTCHA, כולל שתי עוגיות צד שלישי שנרשמו בבדיקת Lighthouse. הדבר אינו תואם את כוונת המוצר המתועדת שלפיה הפורטפוליו עצמו אינו אמור להציג מודעות.
2. ציון הנגישות `96` נובע בין היתר מניגודיות לא מספקת ב־CTA ובקישורי קשר, ומאי־התאמה בין הטקסט הנראה לשם הנגיש בלוגו ובמתג השפה.
3. ציון Best Practices `77` מושפע מעוגיות צד שלישי ומ־Chrome Inspector issues.
4. הממצאים הם חוב קיים ב־legacy. הם אינם נרשמים כרגרסיות של V2, אך V2 לא יורשה לרשת או להחמיר אותם.

## 9. בדיקות קבועות בכל שלב

### Legacy baseline

- [x] `npm run validate`
- [x] עמוד הבית נטען בשני הדומיינים הפעילים
- [x] `/blog/` ועמוד מאמר ישיר מחזירים HTTP 200
- [x] עמוד case study ישיר מחזיר HTTP 200
- [x] `/contact/` ו־`/privacy/` תקינים
- [x] sitemap ו־canonical תקינים בכל 24 הנתיבים; OG ו־Twitter metadata ייבדקו שוב ב־Release Gate
- [ ] מעבר עברית/אנגלית עובד
- [x] dark/light theme עובד כל עוד הוא חלק מהמוצר הקיים
- [ ] אין iframe חיצוני בפרויקטים

### V2 baseline

- [x] build עצמאי עובר — artifact חי כולל 65 קבצים.
- [x] tests ו־lint עצמאיים עוברים — `22/22` חוזי source/runtime ו־`2/2` חוזי build.
- [x] preview מסומן `noindex` — meta robots ו־`X-Robots-Tag: noindex, nofollow, noarchive` אומתו ב־Home, Project ו־Blog חיים.
- [x] fallback ללא WebGL עובד.
- [x] reduced motion עובד.
- [x] Keyboard flow עובד.
- [ ] Desktop, tablet ו־mobile נבדקו חזותית — desktop, low-height ו־mobile emulation עברו; tablet ייעודי ומכשיר mobile פיזי עדיין פתוחים.
- [x] אין console errors או failed network requests במסלולי ה־smoke החיים שנדגמו; assets מרכזיים החזירו `200` עם MIME תקין.
- [x] performance budget נבדק — entry ‏`132.32 KB gzip` ו־scene async ‏`172.32 KB gzip`, בתוך budgets של `250/200 KB gzip`.

### Content synchronization

- [ ] פוסט בדיקה חדש מופיע ב־legacy
- [ ] אותו פוסט מופיע ב־V2 ללא העתקה
- [ ] אותו slug משמש בשתי החוויות
- [ ] עברית ואנגלית מוצגות בכיוון ובטיפוגרפיה הנכונים
- [ ] static routes ו־sitemap של production אינם משתנים ללא צורך

## 10. שלבים ושערי אישור

### Phase 0 — Governance and Isolation

**מטרה:** לקבע כללי עבודה ולבחור ארכיטקטורה שאינה מסכנת production.

- [x] `GOV-001` ליצור מקור אמת יחיד למשימה.
- [x] `GOV-002` לתעד שהאתר הקיים נשאר קנוני ופעיל.
- [x] `GOV-003` לתעד שתוכן חדש ממשיך להתפרסם ב־legacy.
- [x] `GOV-004` לאשר את מבנה `experiments/portfolio-experience-v2/`.
- [x] `GOV-005` לאשר ש־V2 צורך blog, project ו־site data ממקורות התוכן הקיימים דרך adapter משותף.
- [x] `GOV-006` לאשר build נפרד ל־V2 שאינו נכלל ב־production artifact הקיים.
- [x] `GOV-007` לבחור פרויקט Cloudflare Pages נפרד כיעד preview עם `noindex`; סעיף “ללא custom domain” הוחלף מאוחר יותר על ידי `DEC-040`.
- [x] `GOV-008` לתעד baseline של routes, SEO, bundle ו־Core Web Vitals.
- [x] `GOV-009` להריץ ולתעד `npm run validate` לפני תחילת פיתוח.

**Gate 0:** אביתר מאשר את מבנה הבידוד, יעד ה־preview ומדדי ההצלחה.

**Gate 0 status:** מאושר ונסגר ב־2026-07-14.

### Phase 1 — Narrative and Content Inventory

**מטרה:** להחליט מהו הסיפור לפני שמעצבים מסכים.

- [x] `CNT-001` להגדיר קהל ראשי וקהל משני.
- [x] `CNT-002` לנסח ולאשר הבטחת ערך אחת בעברית ובאנגלית.
- [x] `CNT-003` לבחור 3 פרויקטים מרכזיים: Nis Boutique Catering, Online Converter ו־Emergency Protocol Diagram.
- [x] `CNT-004` לתעד ולאשר לכל פרויקט: הבעיה, ההחלטה, ה־tradeoff, מה נבנה, התרומה האישית והתוצאה המותרת להצגה.
- [x] `CNT-005` למפות screenshots, videos, metrics ו־assets קיימים בשלושת הריפוזיטוריז.
- [x] `CNT-006` לזהות נכסים שחסרים ולאשר capture set, shot list וסטנדרט הפקה.
- [x] `CNT-007` להחליט מה נשאר בעמוד הבית ומה עובר לעמודים פנימיים.
- [x] `CNT-008` להגדיר את תפקיד ה־Lab/Blog כהוכחה לחשיבה ולהחלטות מתוך העבודה.

**Gate 1:** אביתר מאשר את המסר, סדר הסיפור ושלושת הפרויקטים.

**Gate 1 status:** מאושר ונסגר ב־2026-07-14.

### Phase 2 — Art Direction

**מטרה:** לבחור שפה מקורית לפני פיתוח.

- [x] `ART-001` ליצור 3 כיווני art direction שונים.
- [x] `ART-002` לכל כיוון ליצור Hero, מעבר, פרויקט ו־CTA.
- [x] `ART-003` להשלים ולאשר mobile לכיוון Signal Forge; ה־desktop הושלם לכל שלושת הכיוונים והכיוונים שלא נבחרו אינם דורשים פיתוח נוסף.
- [x] `ART-004` להגדיר ולאשר typography, palette, material ו־imagery.
- [x] `ART-005` להגדיר ולאשר עקרונות motion ותגובה לגלילה/עכבר.
- [x] `ART-006` לבצע בדיקת מקוריות מול Lusion, לתעד מטריצת דמיון ולקבע originality guardrails.

**Gate 2:** אביתר בוחר כיוון אחד ומאשר אותו כבסיס ל־prototype.

**Gate 2 status:** מאושר ונסגר ב־2026-07-14. Phase 3 נפתח; אין עדיין אישור לקוד או ל־prototype.

### Phase 3 — Storyboard and Motion System

**מטרה:** להפוך את הכיוון הנבחר למסע מדויק.

- [x] `MOT-001` לבנות ולאשר storyboard מלא על ציר גלילה.
- [x] `MOT-002` להגדיר ולאשר camera states ומעברים.
- [x] `MOT-003` להגדיר DOM motion מול WebGL motion.
- [x] `MOT-004` להגדיר reduced-motion storyboard.
- [x] `MOT-005` להגדיר מסלול מובייל נפרד.
- [x] `MOT-006` להגדיר loading, error ו־fallback states.
- [x] `MOT-007` להגדיר motion tokens: duration, easing ו־stagger.

**Gate 3:** storyboard, מובייל ו־fallback מאושרים.

**Gate 3 status:** מאושר ונסגר ב־2026-07-14. Phase 3 הושלם; Phase 4 טרם התחיל ואין אישור לקוד.

### Phase 4 — Technical Spike

**מטרה:** להוכיח את הרגע הקשה ביותר לפני בנייה מלאה.

- [x] `PRO-001` להקים V2 מבודד בלי לשנות legacy build.
- [x] `PRO-002` לממש Hero מינימלי.
- [x] `PRO-003` לממש מעבר ראשון לפרויקט אחד.
- [x] `PRO-004` לבדוק WebGL, assets ו־post-processing — ההחלטה הראשונית `DEC-029` הוחלפה עבור ה־V2 המבודד ב־`DEC-033`; המימוש החדש משתמש ב־Three.js ישיר ללא post-processing.
- [x] `PRO-005` לממש fallback ללא WebGL.
- [x] `PRO-006` לממש reduced motion.
- [x] `PRO-007` למדוד bundle, loading, FPS ו־memory.
- [ ] `PRO-008` לבדוק Chrome, Safari, Firefox ומובייל אמיתי — Chrome/Firefox/WebKit/Safari desktop ו־Safari ב־iOS Simulator הושלמו; מכשיר פיזי בלבד עדיין פתוח.
- [x] `PRO-009` להריץ Legacy Regression Suite.
- [x] `PRO-010` להחזיר progression בגלילה בלי לשבור את חוזה ה־fail-open של REG-004.

**Gate 4:** אביתר מאשר שה־prototype מרגיש נכון; כל P0/P1 סגור.

**Gate 4 status:** פתוח. `PRO-008` עדיין דורש מכשיר mobile פיזי. `DEC-031` הרחיב את החריג רק ל־NIS slice תחת `ENG-003`; הוא אינו סוגר את Gate 4.

### Phase 5 — Production Build

**מטרה:** להרחיב prototype מאושר לחוויה שלמה.

**Phase 5 status:** הושלם לפי Human Override `DEC-032`. לאחר מכן נוצר preview חיצוני מבודד לפי `DEC-040`; ה־legacy production לא שונה.

- [x] `ENG-001` לבנות shell, navigation ו־page transitions — מעבר אמיתי `/` ↔ NIS, focus, Back restoration ו־motion contract עברו.
- [x] `ENG-002` להשלים Hero והעולם הראשי — Act 1 כולל כעת Signal Forge פרוצדורלי אמיתי, ארבעה camera states, Beat ליבה, topology והעברה מרחבית ל־NIS.
- [x] `ENG-003` לבנות שלושה project chapters — NIS, Online Converter ו־Emergency Protocol כוללים פרק Home, route פנימי ותצלומי production אמיתיים. צילום Studio פרטי לא זויף ונשאר פער proof חיצוני מתועד.
- [x] `ENG-004` לבנות About מקוצר כחלק מהמסע — הושלם כפרק עקרונות בתוך רצף הגלילה.
- [x] `ENG-005` לחבר Blog/Lab למקור התוכן הקיים — `getLatestBlogPostMetadata(language, 3)` קורא metadata קנוני קל ללא MDX וללא `labNotes` קשיח; 32/32 רשומות דו־לשוניות תואמות ל־bindings ולמחולל הנתיבים.
- [x] `ENG-006` לבנות Contact ו־CTA סופי — WhatsApp, email ו־LinkedIn קנוניים.
- [x] `ENG-007` להשלים RTL ו־bilingual parity — EN/HE, `lang`, ‏`dir`, copy ו־overflow עברו runtime QA.
- [x] `ENG-008` להשלים mobile experience — 390×844, תפריט, routes ו־project captures עברו runtime QA; device פיזי נשאר תחת `PRO-008`.
- [x] `ENG-009` להשלים fallback ו־reduced motion — capability נקבעת לפני import; reduced, Save-Data, mobile landscape, no-WebGL ו־context loss חוזרים ל־poster ול־DOM בלי לחסום את המסע.
- [x] `ENG-010` להוסיף tests ו־visual regression coverage — `npm run validate` מריץ lint, 21 חוזי Node ברמת source/runtime, build וחוזה build נוסף; `21/21` ו־`1/1` עברו וה־dynamic scene chunk נשאר מבודד ובתוך budget.

### Signature Motion Remediation — DEC-033

- [x] `SIG-001` להחליף את הזזת ה־poster בסצנת Three.js פרוצדורלית אמיתית בלי model חיצוני.
- [x] `SIG-002` לממש `CAM-00→01→02→03` כמעברים דיסקרטיים של `720/720/900ms`, ללא scroll hijack, roll או FOV animation.
- [x] `SIG-003` לממש retarget/reverse, direct-hash ומקלדת מיידיים, `CAM-PARKED` ו־RAF אפס לאחר handoff.
- [x] `SIG-004` לשמור את Three.js/GSAP ב־dynamic chunk בלבד: entry `106.46 KB gzip`, scene `171.48 KB gzip`, שניהם בתוך budgets של `250/200 KB gzip`.
- [x] `SIG-005` לבדוק runtime ב־`1280×720` וב־`390×844`: ארבעת states, reverse scroll, RTL, overflow אפס, poster-only, reduced motion, context loss ו־console נקי עברו.
- [ ] `SIG-006` לקבל מאביתר אישור חזותי מפורש למסע המצלמה החדש; המימוש קיים אך אין להמיר אותו לאישור Release משתמע.

### Full-Journey Motion Remediation — DEC-034

- [x] `JRN-001` להוסיף `JourneyField` משותף ובקר semantic יחיד, reversible ו־route-aware לכל ארבעת נתיבי V2.
- [x] `JRN-002` להמשיך את המסע לכל ה־Home באמצעות מנגנונים ייחודיים: NIS aperture, ‏Online Converter registry, ‏Emergency Protocol branching, ‏About method spine, ‏Lab telemetry ו־Contact convergence.
- [x] `JRN-003` להרחיב choreography לכל שלושת חדרי הראיות באמצעות phases ו־beats עבור intro, need, decision, system, tradeoffs, proof/outcome ו־close.
- [x] `JRN-004` לשמור את WebGL ומסע המצלמה ב־Act 1 בלבד; לאחר `CAM-PARKED` להשתמש ב־DOM/SVG ללא camera comeback, scroll hijack, `ScrollTrigger` או animation loop.
- [x] `JRN-005` לשמור fail-open content, reverse/retarget, keyboard/programmatic instant, reduced motion, mobile ו־RTL parity, ולהרחיב את validate ל־`12/12` חוזים.
- [ ] `JRN-006` לקבל מאביתר אישור חזותי מפורש שהחוויה נשמרת לאורך כל ה־Home וכל חדרי הראיות; אין להמיר את עצם המימוש לאישור Release.

### Lusion-Parity Cinematic Spine Remediation — DEC-035

- [x] `CIN-001` לבצע אודיט חי מלא ל־Lusion ולשמור מפת רשמים, cadence, camera grammar, mobile, originality ו־QA תחת `audit/lusion-2026-07-14/experience-map.md`.
- [x] `CIN-002` להחליף threshold states ובקרי route מקומיים ב־`useMotionDirector` יחיד: passive scroll, ‏RAF רק בזמן damping, progress דטרמיניסטי והפיך ו־CSS variables לכל track/window.
- [x] `CIN-003` להשאיר renderer יחיד בבעלות `ExperienceShell` ולהזין אותו ב־`sceneProgress` מקומי לאורך 12 Home tracks — Hero, Thesis, Signals, Handoff, שלושת עולמות הפרויקט, More Work, About, Capabilities, Lab ו־Contact — וכל שבעת ה־acts של חדרי הראיות.
- [x] `CIN-004` לבנות מסע Home ארוך של sticky tracks, shared Signal Core, טיפוגרפיה קריאה, contrast בין עולמות כהים/בהירים, מדיית מוצר אמיתית כמעט full-frame וכיסוי מפורש לפרויקטים, יכולות, כתיבה וקשר.
- [x] `CIN-005` לבנות בכל case route במה מדיה persistent ושבעה acts — Promise, Need, Decision, System, Proof/Tradeoffs, Outcome ו־Close — כולל camera drift רציף ו־capture→proof transition אמיתי ב־NIS.
- [x] `CIN-006` לאמת desktop `1280×720`, ‏mobile `390×844`, ‏RTL, progress מלא `0→1`, exact adjacent-camera boundaries, reverse determinism, canvas יחיד, no-WebGL, reduced motion, overflow אפס, direct anchors ו־direct internal routes.
- [ ] `CIN-007` לקבל מאביתר אישור חזותי מפורש שהחוויה והקצב הגיעו לרמת היעד; אין להמיר implementation או QA טכני לאישור Release.

**Gate 5:** feature complete ב־preview; אין שינוי ב־production.

**Gate 5 status:** feature completeness עבר מחדש לאחר `DEC-036`–`DEC-039`. V2 עבר lint, ‏`22/22` חוזי source/runtime, build ו־`2/2` חוזי build; entry ‏`132.32 KB gzip` ו־scene async ‏`172.32 KB gzip` נשארים בתוך budgets של `250/200 KB gzip`. ה־legacy עבר שוב lint, ‏`18/18` tests ויצר 24 routes. ה־preview נפרס בפרויקט `evyatar-portfolio-v2` כ־deployment `5c19c20e-1055-4b1d-bcee-aa0b70b43b50`; `experience.evyatarhazan.com` פעיל ומאומת. הפריסה אינה אישור production ואינה סוגרת את Gate 6 או Release Gate.

### Phase 6 — QA and Hardening

**מטרה:** להוכיח שהחוויה עמידה, מהירה ונגישה.

- [x] `QA-001` להריץ functional regression מלא — 12 Home tracks, כל שבעת ה־acts בשלושת חדרי הראיות, reverse scroll, direct-load, direct anchors, internal navigation, EN/HE ו־console עברו.
- [x] `QA-002` להריץ visual regression בכל breakpoint — נשמרו ונבדקו Hero, More Work, Capabilities, Lab, Contact, שלושת פרקי הדגל ו־case acts ב־`1280×720`, ‏`1280×520` וב־`390×844`; device פיזי נשאר `PRO-008`.
- [ ] `QA-003` לבדוק Core Web Vitals ו־asset budgets — budgets נמדדו ועברו; Core Web Vitals מלא ל־RC המורחב טרם הורץ.
- [x] `QA-004` לבדוק keyboard ו־screen reader basics — journey state מתעדכן ללא motion למקלדת/programmatic; focus rings דו־שכבתיים, `aria-current`, landmarks, headings, contextual link names ו־skip נשמרים. תפריט mobile עבר focus trap, ‏Escape, focus return ו־background inert; חלון cinematic שנכנס ל־focus נחשף מיד. בדיקת screen reader מלאה במכשיר חיצוני נשארת חלק מ־`PRO-008`.
- [x] `QA-005` לבדוק reduced motion ו־WebGL fallback — `?motion=reduce` ו־`?scene=off` הוכיחו שהמסע המלא נשאר גלוי ללא canvas, camera, sticky transforms או spatial choreography.
- [ ] `QA-006` לבדוק context loss, slow network ו־failed assets — context loss אמיתי דרך `WEBGL_lose_context` עבר וחזר ל־poster עם RAF אפס; slow-network ו־failed-asset injection מלאים ל־RC החדש עדיין פתוחים.
- [x] `QA-007` לבדוק SEO parity וכל הנתיבים הציבוריים — ארבעת נתיבי V2 מחזירים 200 ו־title ייעודי; legacy ממשיך לייצר 24 routes.
- [ ] `QA-008` להוסיף פוסט אמיתי ולוודא סנכרון בשתי החוויות.
- [x] `QA-009` לבצע content proofread בעברית ובאנגלית — copy נשען על המקורות הקנוניים והריפוזיטוריז הפעילים, ללא claim רפואי או placeholder.
- [x] `QA-010` לסגור את כל P0/P1 ולתעד P2 שנותרו — 12/12 Home tracks עברו בסדר הצפוי עם beat פעיל, 7/7 case acts עברו, cold hash/cold Back, final-frame hold, pointer gating, case reading order, real responsive captures, mobile menu, RTL, focus contrast, low-height, reduced/no-WebGL, blog/contact actions ומקורות הנתונים נבדקו מחדש; `git diff --check` עבר. חסמי evidence מתועדים ואינם מוסווים כבאגים סגורים.
- [x] `QA-011` להשלים cloud-preview smoke — custom domain במצב `active`; Home כולל 12 sections, ‏HE/RTL, ‏canvas יחיד ו־overflow אפס; Blog מציג 16 פוסטים; מאמר ישיר מציג 127 פסקאות ו־29 בלוקי קוד; שלושת נתיבי הפרויקטים והמסלולים הישירים החזירו `200`; קישורי Contact קיימים; meta/header noindex וכותרות האבטחה אומתו; console של ה־host נקי; apex, ‏www ו־GitHub Pages נשארו `200`.
- [ ] `QA-012` לאמת continuous preview delivery — push ל־`main` מפעיל validation נפרד ל־V2, יוצר deployment חדש בפרויקט `evyatar-portfolio-v2`, מעדכן את `experience.evyatarhazan.com` ושומר את ה־legacy פעיל וללא artifact משותף.

**Gate 6:** אביתר מאשר candidate להשקה.

### Phase 7 — Release Decision

**מטרה:** לבחור באופן מודע בין המשך preview, rollout מדורג או החלפה.

- [ ] `REL-001` להציג השוואת legacy מול V2.
- [ ] `REL-002` להציג תוצאות ביצועים, נגישות ו־SEO.
- [ ] `REL-003` להגדיר rollback מיידי.
- [x] `REL-004` לבחור rollout: preview בלבד בשלב הנוכחי לפי `DEC-040`; feature flag והחלפת production לא אושרו.
- [ ] `REL-005` לקבל אישור מפורש להחלפת production.
- [ ] `REL-006` לאמת את שני הדומיינים לאחר פריסה.
- [ ] `REL-007` לעקוב אחרי שגיאות ומדדים לאחר השקה.

**Release Gate:** רק אישור מפורש של אביתר מאפשר שינוי production.

## 11. Risk Register

| ID | סיכון | הסתברות | השפעה | מניעה | סטטוס |
|---|---|---:|---:|---|---|
| R-001 | V2 שובר build קיים | בינונית | קריטית | build נפרד ו־legacy regression | פתוח |
| R-002 | תוכן מתפצל לשני מקורות | נמוכה | גבוהה | metadata, projects ו־capabilities משותפים, legacy About צורך את inventory המשותף, flagship URLs מגיעים מ־`profile.ts`, ובדיקות cardinality/parity מגינות על 3+4/7/EN↔HE | מטופל מקומית; `QA-008` נשאר פתוח לבדיקת publish אמיתי |
| R-003 | 3D כבד מדי במובייל | בינונית | גבוהה | dynamic chunk `172.32 KB gzip`, tier נייד מצומצם, DPR מוגבל, capability preflight לפני WebGL, landscape/reduced/Save-Data ללא import ו־poster fallback | פתוח למכשיר פיזי; מטופל ב־DEC-033/DEC-038 |
| R-004 | מראה מרשים אך הסיפור לא ברור או נשבר לאחר ה־Hero | נמוכה | גבוהה | `DEC-036`–`DEC-038`, ‏12 tracks, beats פנימיים וחוזה label→headline→explainer→proof→action, לצד protagonist, captures אמיתיים, landing/final frames ו־MotionDirector רציפים | מטופל מקומית; פתוח עד אישור חזותי מלא |
| R-005 | העתקה חזותית של Lusion | בינונית | גבוהה | בדיקת מקוריות וארט־דירקשן עצמאי | פתוח |
| R-006 | SEO נפגע בהחלפה | בינונית | קריטית | parity audit ו־rollback | פתוח |
| R-007 | תחזוקת legacy נעצרת | בינונית | גבוהה | legacy נשאר קנוני עד Release Gate | מטופל בהחלטה |
| R-008 | assets אמיתיים חסרים | בינונית | גבוהה | כל שלושת פרקי הדגל משתמשים ב־desktop/mobile captures אמיתיים; אין זיוף של proof פרטי | מטופל לפרקים הציבוריים; proof פרטי של NIS Studio עדיין חיצוני |
| R-009 | scope גדל ללא שליטה | גבוהה | גבוהה | Gate לכל שלב ו־3 פרויקטים בלבד ב־V1 | פתוח |
| R-010 | תיאורי הפרויקטים הקנוניים מפגרים אחרי הארכיטקטורה החיה | בינונית | גבוהה | `portfolioExperiences.ts` ו־`portfolioProjects.ts` הם adapters typed מעל זהויות וקישורים מ־`profile.ts`; parity נשמר ב־validation | מטופל מקומית; נדרש לשמור parity בכל שינוי עתידי |
| R-011 | הפורטפוליו החי טוען scripts ועוגיות פרסום אף שהכוונה היא ללא מודעות בפורטפוליו | ודאית ב־baseline | גבוהה | לא לרשת scripts אלה ב־V2; להפריד בהמשך את הקשר AdSense של Online Converter מהפורטפוליו בהחלטה מפורשת | פתוח |
| R-012 | חוב נגישות קיים עלול לעבור ל־V2 דרך צבעים, focus ושמות נגישים | נמוכה–בינונית | גבוהה | contrast tokens, focus ring דו־שכבתי, mobile modal trap/inert, contextual action names, DOM reading order, reduced motion ו־no-WebGL עברו מקומית | מטופל מקומית; Lighthouse, screen reader ומכשיר פיזי עדיין נדרשים |
| R-013 | אין נתוני CrUX ולכן baseline הביצועים הוא lab בלבד | גבוהה | בינונית | לחזור על תרחישים קבועים; להוסיף field monitoring כאשר preview יקבל תעבורה מספקת | פתוח |
| R-014 | סביבת QA אינה כוללת מכשיר mobile אמיתי | ודאית | גבוהה ל־Gate 4 | Firefox/WebKit, ‏Safari desktop ו־Safari ב־iOS Simulator נבדקו; עדיין נדרש מכשיר פיזי | פתוח — חוסם `PRO-008`, ‏Gate 4 ו־Release; אינו חוסם עוד את ה־preview המבודד שאושר ב־`DEC-040` |

## 12. Decision Log

| ID | תאריך | החלטה | סטטוס | השפעה |
|---|---|---|---|---|
| DEC-001 | 2026-07-14 | לבנות V2 במקביל ולשמור את legacy פעיל | מאושר | אין החלפת production לפני Release Gate |
| DEC-002 | 2026-07-14 | תוכן קנוני משותף ושכבת חוויה מבודדת תחת `experiments/portfolio-experience-v2/` | מאושר | תוכן חדש נכתב פעם אחת ונצרך בשתי החוויות |
| DEC-003 | 2026-07-14 | build נפרד ל־legacy ול־V2 | מאושר | production artifact אינו כולל V2 לפני Release Gate |
| DEC-004 | 2026-07-14 | Cloudflare Pages נפרד ל־preview, עם `noindex` וללא custom domain | מאושר; הוחלף חלקית על ידי `DEC-040` | בידוד, פרויקט נפרד ו־noindex נשארים; סעיפי custom domain וטרם־נפרס הוחלפו |
| DEC-005 | 2026-07-14 | מדד בהירות המסך הראשון יאומת בביקורת תוכן ועיצוב, ללא תלות בבדיקת אנשים כרגע | מאושר | בדיקות משתמשים נשארות אופציונליות לשלב מאוחר |
| DEC-006 | 2026-07-14 | לאמץ את MET-002 כמסע הנרטיבי המחייב של V2 | מאושר | כל פרק, motion ונכס חזותי יידרשו לשרת את רצף ההיכרות, הפרויקטים, ההוכחה והשיחה |
| DEC-007 | 2026-07-14 | לאמץ את MET-003 כחוזה מחייב לכל פרויקט דגל | מאושר | פרויקט לא יקבל פרק מוביל בלי בעיה, החלטה, tradeoff, תרומה אישית, תוצאה ונכסים אמיתיים |
| DEC-008 | 2026-07-14 | לבחור ב־Nis Boutique Catering, Online Converter ו־Emergency Protocol Diagram כשלישיית הדגל | מאושר | המסע מתקדם מעסק והמרה למוצר וצמיחה ולבסוף למערכת מורכבת; United Hatzalah נשמר כ־reserve |
| DEC-009 | 2026-07-14 | לאשר הבטחת ערך דו־לשונית שמחברת צורך עסקי ומורכבות למוצרי Web ברורים, אמינים ומוכנים לצמוח | מאושר | המסך הראשון יוביל בערך ובתוצאה; טכנולוגיות יישארו הוכחה משנית |
| DEC-010 | 2026-07-14 | לאשר את מטריצת התוכן ואת ניסוח התרומה האישית בשלושת פרויקטי הדגל | מאושר | CNT-004 הושלם; אין להוסיף טענות כמותיות, עסקיות או רפואיות ללא הוכחה |
| DEC-011 | 2026-07-14 | לאשר capture set ו־shot list המבוססים על מדיה וממשקים אמיתיים בלבד | מאושר | CNT-006 הושלם; ImageGen לא ישמש כתחליף להוכחת מוצר |
| DEC-012 | 2026-07-14 | לאשר את הבית כמסע קצר, את העמודים הפנימיים כחדרי ראיות ואת ה־Blog כ־Lab נבחר | מאושר | CNT-007/CNT-008 ו־Gate 1 הושלמו; כל route ותוכן קנוני נשמרים |
| DEC-013 | 2026-07-14 | לאשר את ה־technical guardrails ולסגור את Gate 0 | מאושר | Phase 2 נפתח; V2 מחויב לביצועים, נגישות, SEO, privacy, cache ו־fallback שהוגדרו בסעיף 7D |
| DEC-014 | 2026-07-14 | לבחור באפשרות 1 — Signal Forge — ככיוון החזותי של V2 | מאושר | ממשיכים mobile, tokens, motion ומקוריות רק לכיוון הנבחר; אין עדיין אישור לקוד או לסגירת Gate 2 |
| DEC-015 | 2026-07-14 | לאשר את גרסת ה־mobile של Signal Forge | מאושר | ART-003 הושלם; desktop/mobile חולקים מסר, sculpture, CTA ומסלול signals ללא crop של desktop |
| DEC-016 | 2026-07-14 | לאשר את מערכת ה־tokens של Signal Forge | מאושר | ART-004 הושלם; Inter/Noto Sans Hebrew, graphite/indigo/copper, material language וחוזה imagery הופכים לחוקים המחייבים של הכיוון |
| DEC-017 | 2026-07-14 | לאשר את מערכת ה־motion, ה־pointer response ו־fallback ladder של Signal Forge | מאושר | ART-005 הושלם; אין intro או scroll hijacking, התוכן קודם ל־scene והחוויה נשמרת ב־reduced motion וללא WebGL |
| DEC-018 | 2026-07-14 | לאשר את בדיקת המקוריות וה־guardrails, לסגור את Gate 2 ולפתוח את Phase 3 | מאושר | Signal Forge הוא הבסיס ל־storyboard; אין אישור לקוד לפני Gate 3 ו־Phase 4 |
| DEC-019 | 2026-07-14 | לאשר את ה־desktop master storyboard בן 12 beats | מאושר | MOT-001 הושלם; Phase 3 ממשיך ל־camera states, DOM/WebGL, reduced motion, mobile ו־fallback לפני Gate 3 |
| DEC-020 | 2026-07-14 | לאשר ארבעה camera states, שלושה transitions ו־CAM-PARKED לאחר handoff ל־NIS | מאושר | MOT-002 הושלם; camera פעילה רק ב־Act 1 ואינה חוזרת בפרויקטים, Lab או Contact |
| DEC-021 | 2026-07-14 | לאשר את חוזה הבעלות DOM/WebGL, את ה־DOM כמקור אמת ואת WebGL כ־subscriber דקורטיבי | מאושר | MOT-003 הושלם; canvas אינו מחזיק תוכן או input והמסע המלא נשמר ב־poster-first, reduced-motion, no-WebGL ובכשל scene |
| DEC-022 | 2026-07-14 | לאשר את מסלול ה־reduced motion כגרסה מקבילה ושוות־ערך לכל 12 ה־beats | מאושר | MOT-004 הושלם; WebGL אינו נטען כברירת מחדל, שלושה posters מחליפים את Act 1 ותוכן, proof ופעולות נשמרים ללא motion מרחבי |
| DEC-023 | 2026-07-14 | לאשר מסלול mobile עצמאי עם fixed camera, WebGL אופציונלי ומיפוי נייד לכל 12 ה־beats | מאושר | MOT-005 הושלם; mobile תומך ב־320–767px ללא hover/gyro/swipe-only/autoplay ושומר parity מלא ב־RTL, reduced motion ובכשל assets |
| DEC-024 | 2026-07-14 | לאשר חוזה content-first ל־loading, error ו־fallback בכל שכבות V2 | מאושר | MOT-006 הושלם; אין loader חוסם או fake success, כשל spectacle חוזר בשקט ל־poster וכשל action שומר state ומציע recovery אמיתי |
| DEC-025 | 2026-07-14 | לאשר את מערכת ה־motion tokens וה־orchestration הסופית | מאושר | MOT-007 הושלם; durations, easing, stagger, lanes וחוזי cancel/reverse/retarget הם החוזה המחייב |
| DEC-026 | 2026-07-14 | לסגור את Gate 3 לאחר בדיקת שלמות של MOT-001 עד MOT-007 | מאושר | Phase 3 הושלם ללא blocker תכנוני; הסגירה אינה אישור לקוד, scaffold, deployment או שינוי production |
| DEC-027 | 2026-07-14 | להתחיל Phase 4 כ־Technical Spike מבודד ומוגבל ל־Hero→NIS | מאושר | נוצר V2 מקומי תחת `experiments/portfolio-experience-v2/`; אין deployment או מעבר ל־Phase 5 |
| DEC-028 | 2026-07-14 | להחריג את `experiments/` מסריקת המקורות האוטומטית של Tailwind ב־legacy | מיושם | מונע מ־class names של V2 לשנות את production CSS; artifact ה־legacy חזר לבסיס המדויק |
| DEC-029 | 2026-07-14 | לא להכניס WebGL ל־V1 ולקבע poster-first responsive כפתרון ה־Hero | מאושר על ידי אביתר | שומר את המסע וה־fidelity שאושרו, סוגר scene/context failure states ומגן על budget המובייל; ניסוי WebGL עתידי דורש ערך ייחודי ו־budget נפרד |
| DEC-030 | 2026-07-14 | להפעיל Human Override מוגבל ולהתקדם רק עם תשתית `ENG-001` לפני סגירת Gate 4 | מאושר על ידי אביתר | persistent shell/navigation מותרים ב־experiment; ‏`PRO-008` ו־Gate 4 נשארים פתוחים, `ENG-002`–`ENG-010` ו־deployment אינם מורשים, ו־page transition מלא ממתין ל־route אמיתי |
| DEC-031 | 2026-07-14 | לאשר את NIS כ־route הפנימי הראשון ואת המעבר האמיתי מה־Home | מאושר על ידי אביתר | מותר NIS slice בלבד תחת `ENG-003`; אין הרשאה לשני הפרויקטים האחרים, deployment או סגירת Gate 4 |
| DEC-032 | 2026-07-14 | להשלים את כל V2 עד local Release Candidate בלי סבבי אישור נוספים | מאושר על ידי אביתר | מותר להשלים `ENG-002`–`ENG-010` במקביל ל־legacy; אין לזייף Studio/device evidence, אין לסגור `PRO-008`, ואין לשנות production בלי Gate Release מפורש |
| DEC-033 | 2026-07-14 | לפתוח מחדש את החלטת no-WebGL ולחייב מסע מצלמה אמיתי ב־Act 1 של ה־V2 המבודד | מאושר ומיושם לפי דרישת אביתר “ממש את הכל” | `DEC-029` נשאר היסטורי אך הוחלף עבור V2; Three.js/GSAP נטענים עצל, DOM נשאר מקור אמת, וה־legacy/production אינם משתנים |
| DEC-034 | 2026-07-14 | לחייב continuity של ה־signature experience לאורך כל ה־Home וכל שלושת חדרי הראיות, כאשר WebGL והמצלמה נשארים ב־Act 1 בלבד והמשך המסע מופעל באמצעות בקר DOM/SVG סמנטי משותף | מאושר ומיושם מקומית בעקבות דרישת אביתר שהחוויה תהיה מושלמת “לכל אורך הדרך” | מבטל את ההנחה שמסע Hero לבדו משלים את חוויית V2; מוסיף מנגנון ייחודי לכל עולם ו־route בלי לשנות legacy, production או Release Gate |
| DEC-035 | 2026-07-14 | להחליף את ה־Full-Journey threshold RC בציר קולנועי רציף המבוסס על native scroll, ‏MotionDirector יחיד, Signal Forge persistent, sticky tracks ובמות מדיה מרחביות בכל ה־Home ובכל חדר ראיות | מאושר ומיושם מקומית בעקבות דרישת אביתר להגיע לרמת החוויה של Lusion | מחליף עבור V2 את מגבלת WebGL ל־Act 1 ואת `CAM-PARKED`; שומר DOM כמקור אמת, canvas יחיד, reduced/no-WebGL/mobile/RTL, בידוד legacy ו־Release Gate הקיים |
| DEC-036 | 2026-07-15 | motion אינו רשאי לבוא על חשבון הבנת המסר; המסע חייב לכלול 12 Home tracks עם 3+4 פרויקטים, יכולות, כתיבה וקשר ממקורות משותפים | מיושם מקומית בעקבות בקשת אביתר לבדוק ולתקן את החוויה כולה | כל direct anchor נוחת בחלון קריא; case copy מותאם לעמודת הראיות; מובייל natural-flow; אין טענת “מושלם” או release-ready לפני QA חיצוני ואישור מפורש |
| DEC-037 | 2026-07-15 | להקשיח את המסע כך ש־geometry, input modality, focus, layout צפוף ומקורות תוכן לעולם לא יקריבו קריאות או פעולה לטובת motion | מיושם מקומית בעקבות בקשת אביתר לבדוק שוב ולתקן כל פער | cold hashes מחכים ל־geometry-ready; pointer/wheel/touch מחזירים direct motion; focus חושף חלון; מסכים נמוכים נפתחים לזרימה טבעית; תפריט mobile הוא modal; קישורים ונתונים נשענים על מקורות קנוניים |
| DEC-038 | 2026-07-15 | להגדיר continuity כשלמות משולבת של motion, message, evidence ו־action — כולל beat פנימי, landing frame, מסגרת סיום ו־route handoff | מיושם מקומית בעקבות האודיט החוזר | controller מנהל גם beats סמנטיים בתוך כל track; פרקי דגל נוחתים עם intro ו־capture קריאים; Home Contact ו־case Close מחזיקים את הפריים האחרון; Back קר ממתין ל־geometry של הנתיב החדש; תוכן וקישורים שומרים שפה ומקור קנוני |
| DEC-039 | 2026-07-16 | ה־Blog הקנוני הוא חלק מלא מחוויית V2 ואינו רשאי להוציא את המשתמש לעיצוב הישן | מיושם מקומית בעקבות זיהוי קישורי legacy | נוספו `/blog` ו־`/blog/:slug`, טעינת MDX עצלה מתוך המקור הקנוני, 3 cinematic tracks, reduced-motion/mobile/RTL ו־fail-open; Home וכל שלושת ה־case routes משתמשים בנתיבים פנימיים בלבד |
| DEC-040 | 2026-07-16 | לפרסם את V2 כ־preview חיצוני מבודד בפרויקט `evyatar-portfolio-v2` ועל `experience.evyatarhazan.com` | מאושר, מיושם ומאומת חי | preview בלבד; deployment `5c19c20e-1055-4b1d-bcee-aa0b70b43b50`, branch `preview`; legacy, canonical ו־Release Gate ללא שינוי |
| DEC-041 | 2026-07-17 | לשמור את V2 ב־`main` ולפרוס אותו אוטומטית כ־preview מבודד לאחר validation נפרד | מאושר; ממתין לאימות CI חי ראשון | job עצמאי משתמש ב־`wrangler-action@v3` ו־branch `preview`; jobs/artifacts/targets של ה־legacy נשארים ללא שינוי |

## 13. Success Log

| תאריך | הישג | הוכחה | שלב |
|---|---|---|---|
| 2026-07-14 | נוצר מקור אמת למשימת Experience V2 | מסמך זה | Phase 0 |
| 2026-07-14 | תועד חוזה שמירת ה־legacy והמשך עדכוני תוכן | DEC-001 וכללי הברזל | Phase 0 |
| 2026-07-14 | baseline ה־legacy עבר לפני תחילת V2 | lint, 18 tests, build ו־24 static routes עברו | Phase 0 |
| 2026-07-14 | אושרו מבנה הבידוד ומקור התוכן המשותף | אישור משתמש לסעיפים 1–2 של Gate 0 | Phase 0 |
| 2026-07-14 | אושרו build נפרד ויעד preview מבודד | אישור משתמש לסעיפים 3–4 של Gate 0 | Phase 0 |
| 2026-07-14 | אושר MET-001 והוגדרו הקהל הראשי והמשני | אישור משתמש; ארבע דרישות קבלה ללא בדיקת אנשים | Phase 0 |
| 2026-07-14 | אושר MET-002 ונקבע משפט מסע אחד לכל החוויה | אישור משתמש; שש דרישות קבלה למסע ול־fallback | Phase 0 |
| 2026-07-14 | אושר MET-003 ונקבע חוזה מלא לפרקי הפרויקטים | אישור משתמש; מבנה בן שבעה שלבים וחמש דרישות קבלה | Phase 0 |
| 2026-07-14 | נבחרה שלישיית פרויקטי הדגל | אישור משתמש ל־NIS, Online Converter ו־Emergency Protocol Diagram | Phase 1 |
| 2026-07-14 | אושרה הבטחת הערך בעברית ובאנגלית | אישור משתמש לנוסח הראשי, לטקסט התומך ולשני ה־CTA | Phase 1 |
| 2026-07-14 | אושרה מטריצת התוכן לשלושת פרויקטי הדגל | אישור משתמש לבעיה, החלטה, tradeoff, תרומה אישית ותוצאה מותרת | Phase 1 |
| 2026-07-14 | הושלם inventory של המדיה הקיימת | מיפוי שלושת הריפוזיטוריז; NIS עשיר במדיה, בשני המוצרים האחרים חסרים capture-ים | Phase 1 |
| 2026-07-14 | אושרה תוכנית הפקת הנכסים | אישור משתמש ל־capture set, shot list וסטנדרט מדיה אמיתית | Phase 1 |
| 2026-07-14 | Gate 1 נסגר | אושרו המסר, המסע, שלושת הפרויקטים, חלוקת הבית ותפקיד ה־Lab | Phase 1 |
| 2026-07-14 | הושלם baseline חי של legacy | 24/24 routes ו־canonical תקינים בשני היעדים; LCP/CLS/INP נמדדו ב־desktop וב־mobile lab | Phase 0 |
| 2026-07-14 | Gate 0 נסגר | המשתמש אישר את כל ה־technical guardrails לאחר השלמת baseline חי | Phase 0 |
| 2026-07-14 | נוצרו שלושה כיווני Art Direction עצמאיים | Signal Forge, Living Systems Atlas ו־Kinetic Monolith הוצגו כשלוש תמונות נפרדות | Phase 2 |
| 2026-07-14 | Signal Forge נבחר ככיוון הרשמי | המשתמש הצביע במפורש על האפשרות הראשונה באמצעות צילום מסך | Phase 2 |
| 2026-07-14 | נוצר mobile candidate ל־Signal Forge | קומפוזיציית portrait עצמאית עם המסר, sculpture, שני CTA, signals ורמז לפרק NIS | Phase 2 |
| 2026-07-14 | mobile Signal Forge אושר | אישור משתמש מפורש; ART-003 הושלם | Phase 2 |
| 2026-07-14 | מערכת ה־tokens של Signal Forge אושרה | אישור משתמש מפורש ל־typography, palette, materials, imagery, spacing ו־controls; ART-004 הושלם | Phase 2 |
| 2026-07-14 | מערכת ה־motion של Signal Forge אושרה | אישור משתמש מפורש ל־motion thesis, pointer response, native scroll, reduced motion ו־fallback; ART-005 הושלם | Phase 2 |
| 2026-07-14 | בדיקת המקוריות הושלמה ועברה עם guardrails | השוואה מול Lusion החי; לא נמצאה העתקה ישירה, תועד סיכון palette/3D בינוני ונקבעו שבעה guardrails; ART-006 הושלם | Phase 2 |
| 2026-07-14 | Gate 2 נסגר ו־Phase 3 נפתח | המשתמש אישר במפורש את בדיקת המקוריות, ה־guardrails ואת המשך התכנון | Phase 2 |
| 2026-07-14 | נוצר desktop master storyboard ל־MOT-001 | 12 beats בחמישה acts, עם תפקיד, proof, focal point, motion decision, fallback ויציאה לכל beat | Phase 3 |
| 2026-07-14 | desktop master storyboard אושר | אישור משתמש מפורש לרצף 12 ה־beats; MOT-001 הושלם | Phase 3 |
| 2026-07-14 | נוצר מפרט camera states ל־MOT-002 | ארבעה states פעילים, שלושה transitions ב־Act 1 ו־CAM-PARKED לאורך פרקי המוצר | Phase 3 |
| 2026-07-14 | camera states והמעברים אושרו | אישור משתמש מפורש; MOT-002 הושלם | Phase 3 |
| 2026-07-14 | נוצר חוזה DOM/WebGL ל־MOT-003 | ownership matrix, state authority, poster handshake, conductor seam, capability tiers ו־failure contract | Phase 3 |
| 2026-07-14 | חוזה DOM/WebGL אושר | אישור משתמש מפורש; MOT-003 הושלם וה־DOM נקבע כמוצר ומקור האמת | Phase 3 |
| 2026-07-14 | נוצר reduced-motion storyboard ל־MOT-004 | מיפוי parity לכל 12 ה־beats, שלושה posters, motion budget, runtime switching וקריטריוני קבלה | Phase 3 |
| 2026-07-14 | reduced-motion storyboard אושר | אישור משתמש מפורש; MOT-004 הושלם והמסלול הסטטי נקבע כשווה־ערך למסלול המלא | Phase 3 |
| 2026-07-14 | נוצר מסלול mobile עצמאי ל־MOT-005 | חמישה composition modes, fixed-camera scene, מיפוי כל 12 ה־beats, touch/media/bilingual contracts ומטריצת בדיקה | Phase 3 |
| 2026-07-14 | מסלול mobile עצמאי אושר | אישור משתמש מפורש; MOT-005 הושלם ו־mobile נקבע כעריכה נרטיבית עצמאית | Phase 3 |
| 2026-07-14 | נוצר חוזה loading/error/fallback ל־MOT-006 | readiness hierarchy, state model, capability tree, failure tiers, recovery policy, error copy ו־failure-injection checklist | Phase 3 |
| 2026-07-14 | חוזה loading/error/fallback אושר | אישור משתמש מפורש; MOT-006 הושלם ו־content-first נקבע כ־ready state | Phase 3 |
| 2026-07-14 | נוצרה מערכת motion tokens סופית ל־MOT-007 | 10 duration tokens, 4 easing tokens, stagger, orchestration lanes, interruption/retargeting ו־QA matrix | Phase 3 |
| 2026-07-14 | מערכת motion tokens וה־orchestration אושרה | אישור משתמש מפורש; MOT-007 הושלם | Phase 3 |
| 2026-07-14 | Gate 3 נסגר ו־Phase 3 הושלם | בדיקת שלמות רוחבית עברה עבור storyboard, camera, DOM/WebGL, mobile, reduced motion, fallback ו־tokens | Phase 3 |
| 2026-07-14 | הוכן Phase 4 entry brief ללא קוד | הוגדרו שאלת spike, scope, תנאי כניסה, תוצרים ותנאי יציאה ל־Hero→NIS | Phase 4 planning |
| 2026-07-14 | נבנה Hero→NIS Technical Spike מבודד | Hero, mobile, bilingual/RTL, signal handoff, NIS real media, reduced motion ו־no-WebGL fallback | Phase 4 |
| 2026-07-14 | Design QA עבר | השוואות side-by-side ב־desktop וב־mobile הסתיימו ללא P0/P1/P2 | Phase 4 |
| 2026-07-14 | נשמר בידוד ה־legacy | זוהתה סריקת Tailwind חוצת־תיקיות, נוספה החרגה וה־artifact חזר ל־baseline המדויק | Phase 4 |
| 2026-07-14 | נתיב הטעינה הקר של ה־Hero הובא לתוך budget | שלוש ריצות Slow 4G/CPU×4: `1.822s`, ‏`2.362s`, ‏`2.297s`; חציון `2.297s`, גרועה `2.362s` | Phase 4 |
| 2026-07-14 | performance ו־failure evidence הושלמו ב־Chrome | INP `124ms`, CLS `0`, motion `112.4 FPS`, heap `2.7 MB`, Lighthouse Accessibility/Best Practices `100`, asset failure ו־reduced motion עברו | Phase 4 |
| 2026-07-14 | WebGL הוכרע מחוץ ל־V1 | DEC-029; no-WebGL path עומד ב־fidelity, motion, failure ו־performance contracts ללא renderer | Phase 4 |
| 2026-07-14 | תוצאת ה־spike והחלטת no-WebGL אושרו על ידי אביתר | אישור מפורש להמשיך לאחר הצגת performance/failure evidence ו־DEC-029 | Phase 4 |
| 2026-07-14 | הושלמה הקשחת תאימות סטטית והוכן preview למכשיר | Vite targets נבדקו, Safari prefix הוסף, Chrome smoke נקי ו־LAN preview זמין ב־`10.0.0.4:4187` | Phase 4 |
| 2026-07-14 | הושלם runtime QA ב־Safari של iOS Simulator | iPhone 17 / iOS 26.4: Hero mobile, EN→HE/RTL, תפריט, CTA, Signals→Work ופרק NIS עברו; לא נמצא P0/P1/P2 חדש | Phase 4 |
| 2026-07-14 | הושלם Scroll Motion Pass fail-open | Hero phases, רשת אותות, conductor, reveal חד־פעמי, direct-hash skip ו־mobile/RTL QA עברו; PRO-010 הושלם | Phase 4 |
| 2026-07-14 | הושלמו `ENG-001` ו־NIS evidence route ראשון | route אמיתי, product captures, pointer transition, focus, Back restoration, direct-load 200, mobile/RTL ו־legacy baseline עברו | Phase 4 / חריג מוגבל |
| 2026-07-14 | הושלם local Release Candidate של Experience V2 | 8 פרקי מסע, 3 evidence routes, captures חיים, EN/HE, mobile, motion, 4/4 V2 tests, direct routes 200 ו־legacy `18/18` + 24 routes ללא שינוי artifacts | Phase 5–6 |
| 2026-07-14 | הושלם Signature Motion RC לאחר דחיית ה־poster-only | canvas חי; `CAM-00`–`CAM-03`, reverse, parked RAF `0`, mobile/RTL, reduced/no-WebGL/context-loss, 9/9 חוזים ו־legacy `18/18` + 24 routes עברו | Phase 6 / DEC-033 |
| 2026-07-14 | הושלם Full-Journey Motion RC לאחר שהחוויה נעצרה ב־Hero | בקר reversible משותף פועל בכל ארבעת נתיבי V2; Home כולל Conversion/Growth/Complexity/About/Lab/Contact מובחנים וכל שלושת חדרי הראיות כוללים choreography רב־שלבי; `12/12` חוזים עברו, budgets עברו וה־legacy נשאר `18/18` + 24 routes עם artifacts זהים | Phase 6 / DEC-034 |
| 2026-07-14 | נבנה Lusion-Parity Cinematic Spine לאחר דחיית ה־threshold RC | אודיט Lusion עמיד, 10 Home tracks ו־7 case acts, Signal Core persistent, progress רציף והפיך, real-media stages, ‏canvas יחיד/RAF `0`, desktop/mobile/RTL/reduced/no-WebGL QA והשוואות same-viewport | Phase 6 / DEC-035 |
| 2026-07-15 | הוחזר חוזה התוכן וההקשר לכל המסע בלי להסיר את המנוע הקולנועי | Hero מלא, Thesis קריא, שלושה signals עם צורך ותוצאה, 3 פרקים ממקור `portfolioExperiences`, Lab/Contact עם חלונות חופפים, case text בזרימה טבעית, mobile `390×844`; V2 `npm run validate` עבר `11/11` + built-artifact `1/1`, legacy `npm run validate` עבר `18/18`, console נקי, EN↔HE ו־CTA→Signals עברו, ו־same-viewport screenshots נשמרו תחת `audit/context-clarity-2026-07-15/` | Phase 6 / REG-022 |
| 2026-07-15 | הושלם כיסוי תוכן מלא מעבר לשלישיית הדגל | 4 פרויקטים נוספים ב־More Work, ‏7 קבוצות יכולת, 3 פוסטים אחרונים ו־3 ערוצי קשר מוצגים ממקורות משותפים; 32/32 רשומות blog metadata עברו parity | Phase 6 / DEC-036 |
| 2026-07-15 | הושלמה רציפות camera ומסע לאורך כל ה־V2 | 12 Home tracks ו־7 acts בכל case; 17/17 גבולות camera סמוכים זהים בדיוק, progress ‏`0→1`, reverse deterministic ו־mobile adaptation עברו | Phase 6 / DEC-036 |
| 2026-07-15 | הושלם סבב QA חי של בהירות, נגישות ונתיבי קשר | desktop `1280×720`, mobile `390×844`, EN/HE+RTL persistence, reduced motion, no-WebGL, direct anchors, case layouts ו־console נקי; V2 `16/16` + `1/1`, legacy `18/18` + 24 routes | Phase 6 / REG-023–REG-026 |
| 2026-07-15 | הושלם סבב hardening שני למסע, לתוכן ולנגישות | 12/12 Home tracks עברו ברצף ב־desktop וב־`390×844`; כל 7 acts עברו בכל 3 case routes; cold anchors, menu modal, RTL, reduced/no-WebGL, contact actions ו־console נקי אומתו; V2 `18/18` + `1/1`, legacy `18/18` + 24 routes | Phase 6 / DEC-037, REG-027–REG-034 |
| 2026-07-15 | הושלם סבב QA ותיקון שלישי לכל המסע מול ה־bundle העדכני | 12/12 Home tracks הפעילו את ה־track וה־beat הצפויים ללא overflow; cold project Back חזר לפרויקט הנכון עם capture קריא; Contact ו־case Close נשארו גלויים ופעילים בקצה; desktop `1280×720`, low-height `1280×520`, mobile `390×844`, RTL, reduced-motion ו־no-WebGL עברו. V2 `21/21` + `1/1`, legacy `18/18` + 24 routes ו־`git diff --check` עברו | Phase 6 / DEC-038, REG-035–REG-041 |
| 2026-07-16 | הושלם סבב QA ותיקון רביעי לכל המסע ולכל נתיבי הכתיבה | 12/12 Home tracks, ‏33/33 content windows/beats, ‏21/21 case acts בדסקטופ ובמובייל ו־reduced motion עברו; Blog מציג 16 פוסטים בכל שפה, מאמר מלא של 123 פסקאות ו־29 בלוקי קוד עבר פתיחה→קריאה→שיחה, וכל 6 הנתיבים שנדגמו החזירו `legacyBlog=[]`, ‏overflow `0` ו־console נקי. V2 `22/22` + `2/2`, legacy `18/18` + 24 routes עברו | Phase 6 / DEC-039, REG-042–REG-044 |
| 2026-07-16 | נוצר ואומת cloud preview מבודד ל־Experience V2 | project `evyatar-portfolio-v2`, branch `preview`, deployment `5c19c20e`; ‏`experience.evyatarhazan.com` active עם TLS 1.3; Home/Blog/מאמר/3 Projects, noindex, assets ו־Contact עברו smoke; apex/www/GitHub Pages נשארו `200` | Phase 6 / DEC-040 / QA-011 |

## 14. Regression Log

| תאריך | מזהה | חומרה | תיאור | סיבה | תיקון | סטטוס |
|---|---|---|---|---|---|---|
| 2026-07-14 | REG-001 | P0 — נתפס מקומית | Tailwind v4 כלל class names מה־experiment ב־legacy CSS והגדיל אותו מ־`63.96 KB` ל־`64.57 KB` | auto source detection סרק את `experiments/` | נוסף `@source not "../experiments"`; validate חוזר החזיר hash וגודל מקוריים | תוקן לפני commit/deploy |
| 2026-07-14 | REG-002 | P1 — נתפס במעבדה | cold mobile LCP הגיע ל־`5.383s`; מדידת cache חם קודמת הסתירה את הבעיה | Hero התגלה אחרי React, artwork desktop נשלח למובייל ומדיית NIS התחרתה על הרשת | preload מותאם־media, responsive `picture` של `21,604` bytes, lazy NIS media ומידות מפורשות; שלוש ריצות סופיות עברו | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-003 | P2 — נתפס מקומית | Chrome ביקש `/favicon.ico` והפיק console error `404` | ל־spike לא הוגדר favicon מפורש | נוסף `<link rel="icon" href="/assets/evyatar-mark.png">`; smoke חוזר ללא הודעות console | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-004 | P1 — נתפס ב־Safari אמיתי | Hero→Signals/Work הפך למסך ריק חזותית אף שהתוכן נשאר בעץ הנגישות | תוכן מהותי התחיל ב־opacity 0 והיה תלוי ב־IntersectionObserver כדי להיחשף | reveal שונה ל־fail-open וה־observer הוסר; Safari EN/HE ו־Signals→Work עברו בבדיקה חוזרת | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-005 | P0 — נתפס מקומית | תיעוד V2 תחת `docs/` הגדיל את production CSS של ה־legacy מ־`62.46 KB` ל־`64.53 KB` ללא import | Tailwind v4 auto source detection סרק class-like tokens במסמכי Markdown | נוסף `@source not "../docs"`; artifact חזר בדיוק ל־`62.46 KB` ו־24 routes | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-006 | P2 — דווח על ידי אביתר | לאחר תיקון REG-004 כל התוכן היה גלוי, אך לא נוצר progression ממשי בזמן גלילה | שכבת reveal הוסרה במלואה כדי לסגור תלות מסוכנת ב־observer | נוסף motion enhancement חד־פעמי מעל בסיס fail-open, עם observer+fallback, skip למקלדת/hash/reduced ו־desktop/mobile/RTL QA | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-007 | P2 — נתפס בביקורת runtime | Enter על CTA סימן keyboard/skip אך עדיין ירש smooth scroll של כ־`700ms` | `scroll-behavior: smooth` הוגדר על `html` בלי override לפי input mode | input mode מסונכרן גם ל־`html`; keyboard/programmatic מקבלים `scroll-behavior: auto` וכל reveal מדולג | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-008 | P2 — נתפס בביקורת dev | ב־React StrictMode הרצת effect כפולה יכלה להשאיר Signal כ־seen/skip לפני גלילת המשתמש | cleanup עצר playback אך השאיר `data-motion-seen/observed/playback`, וה־setup הבא שיחזר אותם | cleanup מנקה את כל state ה־DOM וה־Set; trigger הועבר ל־72% viewport; Vite dev חוזר הוכיח reveal רק לאחר גלילה | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-009 | P1 — נתפס בביקורת ENG-001 | תפריט mobile סגור נשאר נגיש ב־Tab ולא תמך ב־Escape או החזרת focus | מצב סגור הסתמך רק על opacity ו־pointer-events | נוסף `visibility: hidden`, ‏focus לקישור הראשון, Escape, החזרת focus ונעילת body; runtime mobile עבר | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-010 | P2 — נתפס בביקורת ENG-001 | skip link הצביע ליעד שאינו ניתן למיקוד והשתמש ב־transform גם בניווט מקלדת | ל־main לא היה focus contract וה־skip link ירש motion חזותי | נוסף `#main-content` עם `tabIndex=-1`; החשיפה משתמשת ב־clip-path ללא transform | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-011 | P2 — נתפס בביקורת ENG-001 | `Lab` בתפריט סימן באופן מטעה את `#signals` במקום יעד Lab אמיתי | ה־spike השתמש בעוגן זמני כאילו היה route מוצרי | `Lab` ו־`Contact` מפנים זמנית לנתיבי ה־legacy הקנוניים עד לבניית routes אמיתיים | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-012 | P1 — נתפס לפני NIS route | skip link היה מקודד ל־`/` ולכן detail route היה יוצא ל־Home | shell foundation נבנה לפני route פנימי אמיתי | skip מתמקד ב־main של ה־route הנוכחי ואינו משנה pathname | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-013 | P1 — נתפס לפני NIS route | Brand ו־Work היו hash-only והיו יוצרים hash בתוך detail route | קישורי shell נבדקו קודם רק ב־Home | fallback URLs שונו ל־`/#top` ו־`/#work`; runtime detail→Home עבר | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-014 | P0 — נתפס ב־legacy regression | הכנסת תוכן NIS מורחב ל־`profile.ts` הגדילה את bundle הישן | מקור הנתונים הקנוני היה מיובא גם ל־legacy runtime | התוכן הועבר ל־`portfolioExperiences.ts` שאינו מיובא ב־legacy; artifact חזר בדיוק ל־baseline | תוקן לפני Gate/deploy |
| 2026-07-14 | REG-015 | P1 — דווח על ידי אביתר | ה־RC תואר בטעות כבעל “מסע מצלמה” אף שה־Hero היה poster-only עם opacity/translate קטן | `DEC-029` הוחל על התוצאה הסופית למרות שחוזה `MOT-002` והציפייה החזותית דרשו CAM אמיתי | `DEC-033`: Act 1 פרוצדורלי ב־Three.js, ארבע זוויות, reverse, handoff, fallback ובדיקות runtime; הסטטוס הוחזר ל־RC רק אחרי ראיה בדפדפן | תוקן מקומית; ממתין לאישור חזותי של אביתר |
| 2026-07-14 | REG-016 | P1 — דווח על ידי אביתר | מסע המצלמה עבד ב־Hero/Act 1, אך יתר ה־Home וכל חדרי הראיות חזרו לסקשנים סטטיים עם reveal גנרי ולכן החוויה נשברה מיד לאחר ה־Hero | בקר ה־phase עקב רק אחרי Signals/NIS; הפרקים המאוחרים חלקו `surface-reveal` קטן ותפאורה סטטית ללא state רציף או מנגנון ייחודי | `DEC-034`: נוסף `JourneyField`, בקר semantic reversible משותף, מנגנונים נפרדים לכל עולם ו־phase/beat choreography בכל שלושת חדרי הראיות, עם reduced/mobile/RTL/fail-open ובדיקות budget | תוקן מקומית לפני deploy; ממתין לאישור חזותי ולמכשיר mobile פיזי |
| 2026-07-14 | REG-017 | P1 — דווח על ידי אביתר | גם לאחר Full-Journey RC החוויה עדיין לא התקרבה ל־Lusion: נראתה כרצף סקשנים ואפקטי DOM במקום מסע מצלמה רציף ובלתי נשכח | `DEC-034` השאיר את WebGL ב־Act 1, השתמש במעברי state סף והחליף protagonist משותף במנגנון נפרד לכל סקשן | `DEC-035`: אודיט חי ל־Lusion, ‏MotionDirector רציף, Signal Core persistent, sticky tracks, shared-object states ובמות מדיה מרחביות בכל Home/case route | תוקן מקומית לפני deploy; ממתין לאישור חזותי מפורש |
| 2026-07-14 | REG-018 | P1 — נתפס ב־runtime QA | renderer דיווח `36` draw calls אך ה־Signal Core היה מכוסה ב־Hero, והמצלמה השתמשה ב־route progress הזעיר במקום ב־scene progress המקומי | wrapper היסטורי `.forge-act` נשאר opaque/isolated; `setProgress` קרא את השדה `progress` במקום `sceneProgress` | wrapper הפך transparent, ‏`sceneProgress` הוא קלט interpolation, ונוסף חוזה validation; forward→reverse באותו `scrollY=1300` החזיר rig זהה בדיוק | תוקן מקומית לפני deploy |
| 2026-07-14 | REG-019 | P1 — נתפס ב־runtime QA | בכניסה לחדר הראיות של NIS במת המדיה persistent הייתה בגובה `0`, ולכן הפרק הראשון הופיע בלי הוכחת המוצר | children מוחלטים הונחו בתוך wrapper ללא גובה; selector של NIS proof השתמש בשם class שאינו קיים | `.case-cinema-stage-window` קיבל inset/height בפועל, stack בגובה מלא ו־capture→proof transition לפי act; desktop/mobile/RTL עברו | תוקן מקומית לפני deploy |
| 2026-07-14 | REG-020 | P1 — נתפס ב־accessibility QA | `?motion=reduce` ביטל Canvas אך כיווץ שמונה tracks לכ־`124px` וגרם לחפיפות/תוכן חתוך | override של URL היה חלש יותר מכללי sticky runtime ולא שיחזר את layout הסטטי המלא של media query | נוסף reduced-motion layout מפורש ובעל specificity מתאים; Canvas `0`, כל החלונות visible, עשרת tracks בגובה תוכן מלא, scroll height `10,369px` ו־overflow אופקי `0` | תוקן מקומית לפני deploy |
| 2026-07-14 | REG-021 | P1 — נתפס ב־performance review | native smooth-scroll, director damping ו־CSS transform transitions התחרו; pointer ו־scroll יכלו לבקש שתי ריצות renderer; hot path הקצה מערכים/objects ועיבד tracks רחוקים; rail beat נשאר קפוא | שכבות runtime היסטוריות נשארו פעילות במקביל ל־MotionDirector החדש | anchor navigation עבר ל־`auto`, scrub transitions בוטלו, renderer קיבל scheduler RAF מאוחד, interpolation כותב ישירות ל־rig, מעובדים רק active/adjacent tracks, snapshot ואירוע progress ממוחזרים, semantic/style writes נשמרות ב־cache, diagnostics נדגמים ב־`96ms`, ‏`will-change` מוגבל ל־track פעיל ו־React state מתעדכן גם בהחלפת beat | תוקן מקומית לפני deploy; `12/12` V2 ו־legacy `18/18` עברו |
| 2026-07-15 | REG-022 | P1 — דווח על ידי אביתר | האנימציה הייתה מרשימה אך הקשר האתר אבד: טקסט חסר, כותרות בגודל 9–11.5rem, חלונות תוכן שנעלמו לפני proof, signals ללא הסבר, Lab ללא heading פעיל, case acts חתוכים ומובייל עם labels מוסתרים | ה־Cinematic Spine עקף את `MET-001/002`, את typography tokens המאושרים ואת mobile storyboard; חלק מהפרויקטים השתמשו בקופי משוכפל במקום במקור הקנוני | הוחזר ה־supporting copy המאושר; נוסף חוזה label→headline→explainer→proof→action; ה־tokens המאושרים ממפים את הכותרות והגוף; project semantics נקראים מ־`portfolioExperiences`; חלונות התוכן חופפים; case text זורם לצד media stage; mobile הוא natural-flow וה־header מקבל scrim; same-viewport desktop + `390×844` QA, console נקי, EN↔HE, CTA→Signals, V2 `11/11` + artifact `1/1` ו־legacy `18/18` עברו | תוקן מקומית; ממתין לאישור חזותי מפורש ולבדיקת mobile פיזי |
| 2026-07-15 | REG-023 | P1 — נתפס בביקורת כיסוי | ה־V2 היה קולנועי אך לא שלם כמוצר: ארבעה פרויקטים, יכולות אמיתיות וה־Blog לא קיבלו מקום ברור | המסע התבסס רק על שלישיית הדגל ו־Lab קשיח | נוספו More Work, ‏Capabilities ו־Lab קנוני דרך `portfolioProjects.ts`, ‏`portfolioCapabilities.ts` ו־`metadata.ts` | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-024 | P2 — נתפס ב־runtime QA | ניווט ישיר ל־Capabilities, Writing ו־Contact נחת לפני שהכרטיסים או הפעולות היו קריאים | anchor בתחילת sticky track לא התחשב ב־window progression | anchors עודכנו ל־`0.38`, ‏`0.5`, ‏`0.58` ונוסף חוזה validation; desktop/mobile עברו | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-025 | P2 — נתפס ב־runtime QA | layouts רחבים של case study נדחסו לעמודת תוכן של כ־40rem; טקסט נמחץ, proof boards חפפו ל־HUD ו־light acts סבלו מחוזי צבע לא עקביים | styles של עמוד מלא הוכנסו לעמודת evidence של כ־506px שימושיים | נוספו desktop-only compact layouts, HUD הוסתר ב־routes, color/focus tokens הוקשחו ומובייל נשמר single-column | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-026 | P2 — נתפס ב־visual QA | צילום Emergency הראה חלל לבן גדול ו־Capabilities נחתכו/היו עמומים בכניסה; intro של case במובייל איבד contrast מעל המדיה | נבחר capture חלש, grid inset ו־anchor מוקדמים, ו־overlay שקוף מדי | נבחר capture production ברור יותר, grid/anchor תוקנו ו־mobile case overlay הוכהה; same-viewport QA עבר | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-027 | P1 — נתפס ב־cold-load QA | טעינה ישירה ל־`#capabilities`, ‏`#lab` או `#contact` חישבה scroll מול geometry קצר לפני שה־sticky tracks הורחבו | MotionDirector מדד לפני `data-motion-director=ready` ולא הודיע ל־shell שה־geometry הסופי זמין | director מפעיל layout לפני המדידה ומשדר `cinema:geometry-ready`; ה־shell מעגן מחדש פעם אחת; שלושת היעדים נחתו בחלון קריא | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-028 | P2 — נתפס ב־motion QA | לאחר keyboard/programmatic navigation מצב הקלט נשאר instant ולכן wheel/pointer אמיתי לא החזיר את ה־choreography | input mode עודכן רק דרך פעולות הניווט עצמן | pointerdown, touchstart ו־wheel מחזירים `direct`; מקשי גלילה נשארים `keyboard/instant`; אין scroll listener שני | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-029 | P1 — נתפס ב־visual QA | skills ב־Capabilities ו־CTA בכרטיסי Writing נחתכו ב־desktop, במיוחד ב־viewport נמוך | שורות grid שוות ו־`overflow:hidden` לא התאימו לכמות תוכן לא אחידה | שורות capabilities חולקו לפי עומס, methodology נפרס לשתי עמודות, Lab rhythm צומצם, ועד `760px` chrome נדחס; עד `560px` הפרקים עוברים לזרימה טבעית | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-030 | P1 — נתפס ב־accessibility QA | Tab יכול היה להגיע לחלון opacity-0, focus ring נעלם על light scenes וקישורי failed-image בתוך stage לא היו לחיצים | opacity לא הוציא controls מסדר focus; ring היה תלוי רק ב־copper; stage חסם pointer events | `:focus-within` חושף חלון, ring דו־שכבתי עובד על כהה ובהיר, ו־fallback links מחזירים pointer events | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-031 | P1 — נתפס ב־mobile accessibility QA | התפריט נעל scroll אך לא לכד focus ולא סימן את הרקע inert | menu overlay היה ויזואלי בלבד | header מקבל dialog/aria-modal, focus trap, Escape/focus-return, main inert ו־fullscreen scrim; ניווט ל־Contact מחזיר focus לעוגן | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-032 | P2 — נתפס ב־case accessibility QA | media קדמה ל־H1 ב־DOM, תמונת hero נטענה lazy ושמות פעולות חוזרות איבדו הקשר | סדר DOM הותאם רק לקומפוזיציה החזותית והפעולות הסתמכו על טקסט קצר | tracks/H1 קודמים ל־stage ב־DOM בעוד grid areas שומרים media משמאל; hero eager/high; action/fallback names כוללים project context ו־touch targets בגובה 44px | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-033 | P2 — נתפס ב־content/source audit | capabilities ו־flagship URLs נשמרו גם בעותקים ידניים, ובדיקות V2 לא הגנו על cardinality/parity | adapters משותפים לא כיסו את legacy About ואת URLs ב־V2; validation הסתפק במחרוזות | legacy About קורא `portfolioCapabilityGroups`, ‏V2 קורא URLs מ־`profile.ts`, ונוסף חוזה 3+4 פרויקטים, 7 קבוצות, EN/HE pairing ופעולות לא ריקות | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-034 | P2 — נתפס ב־content/route audit | CTA הראשי נחת ב־Signals, קופי עברי היה עמום, mailto היה ריק, Blog יצא באותו tab ו־legacy bridge יכול היה לולא ב־canonical origin | פעולות וקופי נשארו מגרסאות ביניים וה־bridge הניח origin חיצוני | CTA נוחת ב־Work, הקופי לוטש, email מקבל subject/body מקומיים, Writing נפתח בטאב חדש עם שם נגיש ו־same-origin guard מונע redirect loop | תוקן מקומית לפני deploy; שילוב routes של Blog נדרש לפני Release |
| 2026-07-15 | REG-035 | P1 — נתפס ב־motion continuity audit | tracks היו רציפים, אך beats פנימיים כמו media/decision/proof, capability cards ו־Lab notes לא היו בבעלות ה־MotionDirector ולכן חלק מהמסע הרגיש כמו reveal יחיד ארוך | ה־director תיאר רק אלמנטים עם `data-cinema-window`; ה־semantic descendants שימשו copy/state אך לא progress מקומי | נוספו descriptors סמנטיים לכל `data-journey-beat` בתוך החלון, חלוקה דטרמיניסטית של טווח ה־window ו־validation לרציפות Home/case | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-036 | P1 — נתפס ב־cold-route runtime QA | חזרה מ־case שנפתח ישירות עדכנה URL ו־focus ל־`#emergency_protocol`, אך המצלמה וה־scroll יכלו להישאר בעולם הקודם | ה־shell השתמש ב־ready flag של הנתיב הישן לפני שנאספה geometry של Home; בטעינה קרה ה־native hash יכול היה לעקוף את העיגון הקולנועי | fallback hash הפך project-specific; route change מחכה לאירוע geometry עם `routeKey` תואם; listener מוקדם ו־post-load settle מעגנים מחדש אחרי native hash/layout | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-037 | P1 — נתפס ב־media/source audit | Emergency Protocol השתמש ב־capture לא מתאים למובייל וה־desktop proof לא היה נכס desktop אמיתי ונפרד | אותו קובץ שימש שתי אוריינטציות והוצג בתוך מסגרות שונות | הופקו captures חיים נפרדים `1280×720` ו־`390×844`; dimensions ו־hash נבדקים אוטומטית, ו־Home/case משתמשים ב־`picture` המתאים | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-038 | P1 — נתפס בקצה מסע מלא | בדיוק ב־scroll endpoint, Contact וה־case Close השלימו exit והותירו פריים ריק או פעולות לא זמינות | חלונות הסיום הסתיימו ב־`0.9/0.98`, בעוד scene progress האחרון מגיע ל־1 ואין עוד מרחק גלילה להחזירם | חלונות הסיום מסתיימים ב־1; director אינו מחשב exit לחלון terminal; readability ו־pointer actions נשארים פעילים בקצה | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-039 | P2 — נתפס ב־visual contrast QA | קישורי case Close נראו אפורים מדי על act בהיר למרות token כהה תקין | selector חיפש `.case-footer` כצאצא של track, אך footer הוא ה־track עצמו ולכן fallback `#aaa69f` ניצח | selector תוקן ל־`.case-cinema-track.case-footer a`; computed color חזר ל־`rgb(63,67,82)` והפעולות נשארו focusable/clickable | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-040 | P2 — נתפס ב־direct-project visual QA | `#work` ו־project hashes נחתו עם שם והסבר, אך capture המוצר היה כמעט שקוף (`opacity≈0.01`) ולכן proof לא היה מיידי | anchor ברירת המחדל היה תחילת ה־track, בדיוק לפני תחילת window המדיה ב־0.12 | שלושת פרקי הדגל קיבלו anchor `0.18`; runtime חזר עם scene progress≈0.25, media opacity≈0.87–0.90 ו־`data-cinema-readable=true` | תוקן מקומית לפני deploy |
| 2026-07-15 | REG-041 | P2 — נתפס ב־interaction/content audit | חלונות שקופים יכלו ללכוד pointer, שפת case/blog יכלה להיעלם במעבר, ו־flagship titles נשענו על עותקים מקומיים | visibility הייתה opacity בלבד; URL/localStorage לא תיאמו שפה בכל handoff; adapter קנוני חסר לשלישיית הדגל | pointer-events נפתחים רק לחלון readable/focus-within; `lang` נשמר ב־query וב־localStorage; titles/URLs מגיעים מ־adapter קנוני; Home images ו־poster קיבלו fail-open recovery | תוקן מקומית לפני deploy |
| 2026-07-16 | REG-042 | P1 — דווח על ידי אביתר | כרטיסי Blog, “כל הכתיבה” והפוסטים הקשורים בקייסים הוציאו את המשתמש לעיצוב הישן | ל־V2 לא היו routes פנימיים לכל המחברת; קישורים absolute/relative נפלו ל־legacy או ל־bridge | נוספו Blog index/article פנימיים עם כל 32 רשומות metadata וגופי MDX lazy; כל 6 routes שנדגמו החזירו אפס קישורי legacy | תוקן מקומית לפני deploy |
| 2026-07-16 | REG-043 | P1 — נתפס ב־route audit | החלפת שפה שינתה state אך לא URL מחוץ ל־Blog; Brand/Nav/Back/Case Study השמיטו `lang` ופרמטרים נוספים; footer About ביצע hard navigation | ניווט הסתמך על localStorage ועל hrefs קשיחים במקום על destination helper משותף | נוסף `localizedInternalPath/localizedStoryPath`; החלפת שפה מבצעת replace ושומרת search/hash; כל handoff משתמש ב־SPA handler וב־href תקין גם ל־modified-click | תוקן מקומית לפני deploy |
| 2026-07-16 | REG-044 | P1/P2 — נתפס ב־content/accessibility QA | ה־Journey HUD כיסה פרוזה וקוד במאמר; טקסטי Capabilities ו־Lab action/meta היו קטנים או בעלי ניגודיות נמוכה; מונה `01/16` נראה בטעות כהתקדמות קריאה | HUD גלובלי נותר מעל reading rail מקומי ו־dense desktop overrides כיווצו טקסט | HUD מוסתר רק במאמרים שבהם יש reading rail ייעודי; גדלי body/tags/meta/action הוגדלו, צבע action הוכהה, ומיקום הפוסט מסומן במפורש כ־Note/רשימה | תוקן מקומית לפני deploy |
| 2026-07-16 | REG-045 | P2 — נתפס ב־cloud-preview QA | `/sitemap.xml` מוחזר כ־SPA shell עם HTTP `200` במקום `404/410` או sitemap אמיתי | כלל ה־SPA fallback חל גם על קובצי SEO שאינם קיימים | ה־preview כולו עדיין מוגן ב־meta/header noindex; יש להוסיף negative route לפני Release אם V2 יפסיק להיות noindex | פתוח ל־hardening לפני Release; אינו חוסם preview |
| 2026-07-17 | REG-046 | P1 — נתפס בריצת GitHub Actions הראשונה של `DEC-041` | V2 עבר local validation אך build ב־checkout נקי לא הצליח לפתור `react/jsx-runtime` מתוך קובצי MDX משותפים שמחוץ ל־experiment | ה־build המקומי מצא במקרה `node_modules` נוסף ב־root; ב־job העצמאי מותקנות בכוונה רק תלויות V2 | נוסף `resolve.dedupe` ל־React/ReactDOM ב־Vite ונוסף חוזה validation; reproduction מארכיון Git נקי ללא root dependencies עבר `22/22`, build ו־`2/2` | תוקן מקומית; ממתין לאימות CI חוזר |

## 15. Change Log

| תאריך | שינוי | מבצע |
|---|---|---|
| 2026-07-14 | יצירת המסמך והגדרת Phase 0 | Codex |
| 2026-07-14 | סימון GOV-004 ו־GOV-005 כמאושרים | Codex |
| 2026-07-14 | הוספת DEC-003/DEC-004 וסימון GOV-006/GOV-007 כמאושרים | Codex |
| 2026-07-14 | הוספת MET-001/DEC-005 וסימון CNT-001 כהושלם | Codex |
| 2026-07-14 | הוספת MET-002/DEC-006 וקיבוע המסע הנרטיבי | Codex |
| 2026-07-14 | הוספת MET-003/DEC-007 וקיבוע חוזה פרויקט הדגל | Codex |
| 2026-07-14 | הוספת DEC-008 וסימון CNT-003 כהושלם | Codex |
| 2026-07-14 | הוספת DEC-009 וסימון CNT-002 כהושלם | Codex |
| 2026-07-14 | הוספת טיוטת מטריצת CNT-004, תיעוד פערי תוכן והוספת R-010 | Codex |
| 2026-07-14 | אישור מטריצת התוכן, הוספת DEC-010 וסימון CNT-004 כהושלם | Codex |
| 2026-07-14 | הוספת asset inventory, capture plan וסימון CNT-005 כהושלם | Codex |
| 2026-07-14 | אישור capture plan, הוספת DEC-011 וסימון CNT-006 כהושלם | Codex |
| 2026-07-14 | הוספת הצעת חלוקת עמוד הבית, routes פנימיים ותפקיד ה־Lab | Codex |
| 2026-07-14 | אישור חלוקת הבית וה־Lab, הוספת DEC-012, סימון CNT-007/CNT-008 וסגירת Gate 1 | Codex |
| 2026-07-14 | השלמת GOV-008 עם baseline חי, Lighthouse, route parity והוספת R-011 עד R-013 | Codex |
| 2026-07-14 | אישור guardrails, הוספת DEC-013 וסגירת Gate 0 | Codex |
| 2026-07-14 | הוספת שלושת כיווני Phase 2 וסימון ART-001/ART-002 כהושלמו | Codex |
| 2026-07-14 | בחירת Signal Forge, הוספת DEC-014 ועדכון היקף ART-003 לכיוון הנבחר | Codex |
| 2026-07-14 | יצירת ותיעוד mobile candidate ל־Signal Forge ללא סגירת ART-003 לפני אישור | Codex |
| 2026-07-14 | אישור mobile, הוספת DEC-015 וסימון ART-003 כהושלם | Codex |
| 2026-07-14 | הוספת הצעת typography, palette, material, imagery, spacing ו־control tokens ל־ART-004 | Codex |
| 2026-07-14 | אישור tokens, הוספת DEC-016 וסימון ART-004 כהושלם | Codex |
| 2026-07-14 | הוספת הצעת motion system, pointer response, loading, reduced motion ו־fallback ל־ART-005 | Codex |
| 2026-07-14 | אישור motion, הוספת DEC-017 וסימון ART-005 כהושלם | Codex |
| 2026-07-14 | השלמת originality audit, תיעוד הוכחות, מטריצת דמיון ו־guardrails וסימון ART-006 כהושלם | Codex |
| 2026-07-14 | אישור originality audit, הוספת DEC-018, סגירת Gate 2 ופתיחת Phase 3 | Codex |
| 2026-07-14 | הוספת הצעת desktop master storyboard בת 12 beats ל־MOT-001 | Codex |
| 2026-07-14 | אישור storyboard, הוספת DEC-019 וסימון MOT-001 כהושלם | Codex |
| 2026-07-14 | הוספת הצעת camera grammar, states, transitions, safety limits ו־parking ל־MOT-002 | Codex |
| 2026-07-14 | אישור camera states, הוספת DEC-020 וסימון MOT-002 כהושלם | Codex |
| 2026-07-14 | הוספת הצעת DOM/WebGL ownership contract ל־MOT-003 | Codex |
| 2026-07-14 | אישור חוזה DOM/WebGL, הוספת DEC-021 וסימון MOT-003 כהושלם | Codex |
| 2026-07-14 | הוספת reduced-motion storyboard מלא ל־MOT-004 ללא קוד | Codex |
| 2026-07-14 | אישור reduced motion, הוספת DEC-022 וסימון MOT-004 כהושלם | Codex |
| 2026-07-14 | הוספת מסלול mobile עצמאי ומלא ל־MOT-005 ללא קוד | Codex |
| 2026-07-14 | אישור mobile, הוספת DEC-023 וסימון MOT-005 כהושלם | Codex |
| 2026-07-14 | הוספת חוזה loading, error ו־fallback מלא ל־MOT-006 ללא קוד | Codex |
| 2026-07-14 | אישור loading/fallback, הוספת DEC-024 וסימון MOT-006 כהושלם | Codex |
| 2026-07-14 | הוספת מערכת motion tokens ו־orchestration סופית ל־MOT-007 ללא קוד | Codex |
| 2026-07-14 | אישור MOT-007, הוספת DEC-025 וסימון המשימה כהושלמה | Codex |
| 2026-07-14 | בדיקת שלמות, הוספת DEC-026, סגירת Gate 3 והשלמת Phase 3 | Codex |
| 2026-07-14 | הוספת Phase 4 entry brief למחקר, ללא scaffold או קוד | Codex |
| 2026-07-14 | פתיחת Phase 4 ובניית Hero→NIS spike מבודד תחת `experiments/portfolio-experience-v2/` | Codex |
| 2026-07-14 | הוספת assets אמיתיים, bilingual/RTL, mobile, motion, fallback ו־Design QA evidence | Codex |
| 2026-07-14 | תיקון REG-001 באמצעות החרגת `experiments/` מסריקת Tailwind והשלמת Legacy Regression Suite | Codex |
| 2026-07-14 | השלמת performance/failure evidence, תיקון REG-002, הוספת DEC-029 וסימון PRO-004/PRO-007 כהושלמו | Codex |
| 2026-07-14 | תיעוד אישור ה־spike/no-WebGL, השלמת capability audit, הוספת Safari CSS hardening, תיקון REG-003 והוספת R-014 | Codex |
| 2026-07-14 | התקנה מבודדת והרצת runtime QA ב־Firefox 151 וב־WebKit 26.5 ב־desktop/mobile; PRO-008 נשאר פתוח ל־Safari ולמכשיר פיזי | Codex |
| 2026-07-14 | הרצת Safari desktop אמיתי, זיהוי ותיקון REG-004 באמצעות reveal fail-open, ואימות חוזר של Hero→Signals→Work בעברית | Codex |
| 2026-07-14 | תיקון REG-005 באמצעות החרגת `docs/` מסריקת Tailwind והחזרת legacy CSS ל־baseline | Codex |
| 2026-07-14 | התקנת רכיבי Xcode המאושרים והרצת Safari iOS Simulator QA מלאה; Full Keyboard Access הוחזר ל־Off ו־PRO-008 נשאר פתוח למכשיר פיזי בלבד | Codex |
| 2026-07-14 | השלמת PRO-010, תיקון REG-006 באמצעות Scroll Motion Pass fail-open, תיקון deep-link ראשוני ואימות desktop/mobile/RTL/keyboard | Codex |
| 2026-07-14 | סגירת REG-007/REG-008: ביטול smooth-scroll למקלדת/programmatic, ניקוי StrictMode idempotent ואימות Vite dev חוזר | Codex |
| 2026-07-14 | תיעוד DEC-030, בניית תשתית `ENG-001`, סגירת REG-009–REG-011 ואימות desktop/mobile/RTL/legacy ללא פתיחת Phase 5 מלאה | Codex |
| 2026-07-14 | תיעוד DEC-031, בניית NIS evidence route, סגירת ENG-001 ו־REG-012–REG-014, ואימות direct-load/mobile/RTL/legacy ללא deployment | Codex |
| 2026-07-14 | תיעוד DEC-032, השלמת שלושת עולמות הפרויקט, About/Lab/Contact, routes, mobile/RTL/motion/fallback, V2 validate ו־legacy regression ללא deployment | Codex |
| 2026-07-14 | תיעוד DEC-033 ו־REG-015, מימוש Signature Motion מלא ב־Three.js, הקשחת lifecycle/fallback, הרחבת validate ל־9 חוזים ואימות runtime + legacy ללא deployment | Codex |
| 2026-07-14 | תיעוד `DEC-034` ו־`REG-016`, הוספת `JourneyField` ובקר מסע משותף, הרחבת choreography לכל פרקי ה־Home ולכל שלושת חדרי הראיות, הרחבת validate ל־`12/12`, אימות budgets ו־legacy regression ללא deployment | Codex |
| 2026-07-14 | תיעוד `DEC-035` ו־`REG-017`–`REG-021`, אודיט Lusion, החלפת threshold runtime ב־MotionDirector רציף ו־renderer persistent, בניית sticky cinematic tracks ובמות case media, תיקון scene-progress/reduced-motion/performance, visual QA והשוואות same-viewport ללא deployment | Codex |
| 2026-07-15 | תיעוד וסגירת `REG-022`: החזרת חוזה התוכן וה־typography המאושרים, canonical project semantics, overlap בטוח בין context/proof, case natural-flow, mobile content-first ו־visual QA ללא deployment | Codex |
| 2026-07-15 | תיעוד `DEC-036` ו־`REG-023`–`REG-026`: השלמת 12 Home tracks, מקורות blog/projects/capabilities משותפים, direct anchors קריאים, case compaction, Emergency capture, desktop/mobile/RTL/reduced/no-WebGL QA ו־V2 `16/16` + `1/1` ללא deployment | Codex |
| 2026-07-15 | תיעוד `DEC-037` ו־`REG-027`–`REG-034`: cold-hash/input fixes, clipping/low-height hardening, keyboard/mobile accessibility, case DOM/action repair, source consolidation, content/contact cleanup ו־V2 `18/18` + `1/1` ללא deployment | Codex |
| 2026-07-15 | תיעוד `DEC-038` ו־`REG-035`–`REG-041`: semantic beat ownership, cold Back/geometry settle, captures responsive אמיתיים, final-frame hold, contrast, project landing anchors, pointer/language/source hardening ו־V2 `21/21` + `1/1` ללא deployment | Codex |
| 2026-07-16 | תיעוד `DEC-039` ו־`REG-042`–`REG-044`: שילוב Blog/MDX מלא בתוך V2, תיקון כל יציאות ה־legacy, שימור language/query בכל ניווט, Blog reading journey, HUD/contrast/readability hardening ו־V2 `22/22` + `2/2` ללא deployment | Codex |
| 2026-07-16 | תיעוד `DEC-040`, פריסת V2 ל־Cloudflare Pages נפרד, חיבור ואימות `experience.evyatarhazan.com`, השלמת `QA-011` ותיעוד `REG-045`; ה־legacy נשאר ללא שינוי | Codex |
| 2026-07-17 | תיעוד ואישור `DEC-041`: שמירת V2 ב־`main` והוספת continuous preview job עצמאי; `QA-012` ממתין לאימות הריצה החיה הראשונה | Codex |
| 2026-07-17 | תיעוד `REG-046`: clean-checkout חשף תלות סמויה ב־root React runtime; נוסף Vite dedupe וחוזה regression, ו־reproduction נקי עבר לפני rerun | Codex |

## 16. פרוטוקול עדכון המסמך

לאחר כל סבב עבודה:

1. לעדכן `updated` ו־Current Phase.
2. לסמן משימות שהושלמו רק לאחר הוכחה.
3. להוסיף הצלחה ל־Success Log.
4. להוסיף כל כשל ל־Regression Log, גם אם תוקן באותו סבב.
5. להוסיף החלטות חדשות ל־Decision Log.
6. לעדכן Risk Register אם סיכון השתנה.
7. לציין במפורש איזה Gate ממתין לאישור.
8. לא למחוק היסטוריה; החלטה שהוחלפה מסומנת superseded.

## 17. נקודת העצירה הנוכחית

Gate 0 עד Gate 3 סגורים. לפי `DEC-035` הושלם Cinematic Spine, ולפי `DEC-036`–`DEC-039` המסע כולל 12 Home tracks עם חוזה תוכן מלא והקשחת interaction/accessibility: Signal Core אחד, renderer אחד ו־MotionDirector אחד מלווים את המסר ואת ה־beats הפנימיים; 3+4 פרויקטים, 7 קבוצות יכולת, Blog פנימי מלא עם 16 פוסטים בכל שפה ו־3 tracks קולנועיים, ו־Contact מלא. פרקי הדגל נוחתים עם proof אמיתי שכבר קריא; חדרי הראיות שומרים media stage persistent לצד DOM קריא; Blog נשאר בתוך V2 מהכרטיס ועד CTA הסיום; מובייל content-first עם menu modal. `REG-017`–`REG-044` תוקנו. V2 עבר `22/22` + `2/2`, ה־legacy עבר `18/18` + 24 routes. לפי `DEC-040` קיים כעת preview מבודד בפרויקט `evyatar-portfolio-v2`, branch `preview`, deployment `5c19c20e`, ב־`experience.evyatarhazan.com`; `QA-011` עבר. אין שינוי ב־production הקנוני.

נדרש כעת:

1. לקבל מאביתר אישור חזותי למסע החי ב־`experience.evyatarhazan.com` ולסגור `SIG-006`, ‏`JRN-006` ו־`CIN-007`.
2. לפתוח את ה־RC במכשיר mobile אמיתי כדי לסגור `PRO-008` ו־Gate 4.
3. להשלים Core Web Vitals ל־RC המורחב תחת `QA-003`.
4. להשלים slow-network ו־failed-asset injection תחת `QA-006`.
5. לפרסם פוסט בדיקה אמיתי ולסגור את `QA-008`.
6. אם נדרש proof חזותי של owner workflow, לספק גישה בטוחה ל־NIS Studio או צילום מאושר.
7. לאמת את הריצה החיה הראשונה של `DEC-041` ולסגור `QA-012`; לאחר מכן שינויי תוכן חדשים ב־`main` אמורים לעדכן את ה־preview אוטומטית. `REG-045` עדיין דורש hardening לפני Release.
8. לאחר סגירת הראיות, לקבל החלטת Release מפורשת. עד אז אין release, feature flag, החלפת production או שינוי ב־legacy; ה־preview המבודד נשאר מותר לפי `DEC-040`.
