// 打つ題材。code は必ず ASCII だけで書く。
// 日本語が混ざると IME が要り、打鍵を受け取れなくなるため。
//
// lang: 'html' … code をそのままプレビューに流し込む
// lang: 'css'  … scaffold を土台に置き、code を <style> として当てる

export const LESSONS = [
  {
    id: 'html-hello',
    lang: 'html',
    file: 'index.html',
    level: 1,
    title: 'はじめてのページ',
    subtitle: '見出しと段落',
    note: 'HTML の骨組み。閉じタグを打った瞬間に形が決まる。',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello</title>
</head>
<body>
  <h1>Hello, world</h1>
  <p>This is my first page.</p>
</body>
</html>
`,
  },

  {
    id: 'html-profile',
    lang: 'html',
    file: 'profile.html',
    level: 2,
    title: 'プロフィール',
    subtitle: 'リスト・リンク・style',
    note: '頭が長い。<body> に入った途端に、書いた体裁ごと一気に立ち上がる。',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kanade Ishida</title>
  <style>
    body {
      max-width: 30rem;
      margin: 40px auto;
      font-family: system-ui, sans-serif;
      color: #1f2937;
    }
    h1 { margin-bottom: 2px; }
    .role { color: #6b7280; margin-top: 0; }
    li { line-height: 1.9; }
  </style>
</head>
<body>
  <h1>Kanade Ishida</h1>
  <p class="role">Web Developer</p>
  <hr>
  <h2>Skills</h2>
  <ul>
    <li>HTML and CSS</li>
    <li>JavaScript</li>
    <li>Ruby on Rails</li>
  </ul>
  <p><a href="https://github.com/kanade0525">GitHub</a></p>
</body>
</html>
`,
  },

  {
    id: 'html-form',
    lang: 'html',
    file: 'signup.html',
    level: 3,
    title: '申し込みフォーム',
    subtitle: 'label・input・select',
    note: '属性が多い。引用符とハイフンの往復が効いてくる。',
    code: `<form class="signup" action="/signup" method="post">
  <h2>Create your account</h2>

  <label for="name">Name</label>
  <input id="name" type="text" placeholder="Kanade" required>

  <label for="mail">Email</label>
  <input id="mail" type="email" placeholder="you@example.com" required>

  <label for="plan">Plan</label>
  <select id="plan" name="plan">
    <option value="free">Free</option>
    <option value="pro" selected>Pro</option>
  </select>

  <label class="check">
    <input type="checkbox" name="news" checked>
    Send me product news
  </label>

  <button type="submit">Sign up</button>
</form>
`,
  },

  {
    id: 'html-table',
    lang: 'html',
    file: 'pricing.html',
    level: 3,
    title: '料金表',
    subtitle: 'table の入れ子',
    note: 'tr と td の繰り返し。指が形を覚えるまで打つ。',
    code: `<table class="pricing">
  <caption>Pricing</caption>
  <thead>
    <tr>
      <th scope="col">Plan</th>
      <th scope="col">Price</th>
      <th scope="col">Seats</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Free</td>
      <td>$0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>Pro</td>
      <td>$12</td>
      <td>10</td>
    </tr>
    <tr>
      <td>Team</td>
      <td>$48</td>
      <td>Unlimited</td>
    </tr>
  </tbody>
</table>
`,
  },

  {
    id: 'css-card',
    lang: 'css',
    file: 'card.css',
    level: 2,
    title: 'カードを整える',
    subtitle: '角丸・影・余白',
    note: '素の見出しとボタンが、一行ごとにカードになっていく。',
    scaffold: `<div class="card">
  <span class="tag">NEW</span>
  <h2>Typing Engineer</h2>
  <p>Code typing practice with a live preview.</p>
  <button class="btn">Start typing</button>
</div>`,
    code: `body {
  background: #eef2f7;
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  height: 100vh;
  margin: 0;
}

.card {
  background: #ffffff;
  width: 300px;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
}

.tag {
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 4px 9px;
  border-radius: 99px;
}

.card h2 {
  margin: 14px 0 6px;
  font-size: 21px;
}

.card p {
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 20px;
}

.btn {
  background: #2563eb;
  color: #ffffff;
  border: 0;
  padding: 11px 20px;
  border-radius: 9px;
  font-size: 14px;
}
`,
  },

  {
    id: 'css-flex',
    lang: 'css',
    file: 'layout.css',
    level: 3,
    title: '横に並べる',
    subtitle: 'Flexbox',
    note: '縦に積まれた要素が display: flex の一行で横を向く。',
    scaffold: `<header class="bar">
  <span class="logo">LOGO</span>
  <nav class="menu">
    <a href="#">Home</a>
    <a href="#">Docs</a>
    <a href="#">Blog</a>
  </nav>
</header>
<main class="cards">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</main>`,
    code: `body {
  font-family: system-ui, sans-serif;
  margin: 0;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 22px;
  background: #111827;
  color: #f9fafb;
}

.logo {
  font-weight: 700;
  letter-spacing: 0.14em;
}

.menu {
  display: flex;
  gap: 20px;
}

.menu a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
}

.cards {
  display: flex;
  gap: 16px;
  padding: 22px;
}

.box {
  flex: 1;
  display: grid;
  place-items: center;
  height: 130px;
  background: #e0e7ff;
  border-radius: 14px;
  color: #4338ca;
  font-size: 34px;
}
`,
  },

  {
    id: 'css-anim',
    lang: 'css',
    file: 'motion.css',
    level: 4,
    title: '動かす',
    subtitle: '@keyframes',
    note: '最後の } を打った瞬間に、三つの玉が跳ね始める。',
    scaffold: `<div class="stage">
  <div class="ball"></div>
  <div class="ball"></div>
  <div class="ball"></div>
</div>`,
    code: `body {
  margin: 0;
  background: #0f172a;
}

.stage {
  display: flex;
  gap: 26px;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.ball {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #38bdf8;
  animation: bounce 0.9s ease-in-out infinite;
}

.ball:nth-child(2) {
  background: #a78bfa;
  animation-delay: 0.15s;
}

.ball:nth-child(3) {
  background: #f472b6;
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-46px);
  }
}
`,
  },
];

export function findLesson(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

export function nextLesson(id) {
  const i = LESSONS.findIndex((l) => l.id === id);
  if (i === -1) return null;
  return LESSONS[(i + 1) % LESSONS.length];
}
