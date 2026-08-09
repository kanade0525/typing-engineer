// 打つ題材。code は必ず ASCII だけで書く。
// 日本語が混ざると IME が要り、打鍵を受け取れなくなるため。
//
// lang: 'html' … code をそのままプレビューに流し込む
// lang: 'css'  … scaffold を土台に置き、code を <style> として当てる

export const LESSONS = [
  {
    id: 'css-first',
    group: '見た目が変わる',
    lang: 'css',
    file: 'first.css',
    level: 1,
    title: 'カードを画面の中央に置く',
    subtitle: 'place-items · border-radius',
    note: '素の文字列が、七行で真ん中の光るカードになる。',
    scaffold: `<div class="box">Hello</div>`,
    code: `body {
  display: grid;
  place-items: center;
  height: 100vh;
  margin: 0;
  background: #0f172a;
}

.box {
  padding: 30px 44px;
  border-radius: 16px;
  background: linear-gradient(135deg, #22d3ee, #6366f1);
  color: #ffffff;
  font: 700 28px system-ui, sans-serif;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.45);
}
`,
  },

  {
    id: 'css-grid',
    group: '見た目が変わる',
    lang: 'css',
    file: 'grid.css',
    level: 3,
    title: '画面を四つの面に分ける',
    subtitle: 'grid-template-areas',
    note: '縦に積まれた四枚が、areas を打ち終えた瞬間に画面の形になる。',
    scaffold: `<div class="page">
  <header class="hd">header</header>
  <aside class="sd">side</aside>
  <main class="mn">main</main>
  <footer class="ft">footer</footer>
</div>`,
    code: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.page {
  display: grid;
  grid-template-areas:
    "hd hd"
    "sd mn"
    "ft ft";
  grid-template-columns: 170px 1fr;
  grid-template-rows: 62px 1fr 54px;
  gap: 10px;
  height: 100vh;
  padding: 10px;
  background: #eef2ff;
}

.hd { grid-area: hd; background: #4338ca; color: #ffffff; }
.sd { grid-area: sd; background: #c7d2fe; }
.mn { grid-area: mn; background: #ffffff; }
.ft { grid-area: ft; background: #e0e7ff; }

.page > * {
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 14px;
  color: #312e81;
}
`,
  },

  {
    id: 'css-hover',
    group: '見た目が変わる',
    lang: 'css',
    file: 'hover.css',
    level: 2,
    title: 'マウスを乗せたら浮かせる',
    subtitle: 'transition · transform',
    note: '打ち終わったら、右のカードにマウスを乗せてみる。',
    scaffold: `<div class="row">
  <a class="tile" href="#">Hover me</a>
  <a class="tile" href="#">And me</a>
  <a class="tile" href="#">Me too</a>
</div>`,
    code: `body {
  margin: 0;
  display: grid;
  place-items: center;
  height: 100vh;
  background: #0f172a;
  font-family: system-ui, sans-serif;
}

.row {
  display: flex;
  gap: 16px;
}

.tile {
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  border-radius: 18px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 14px;
  text-decoration: none;
  transition: transform 0.25s, background 0.25s, box-shadow 0.25s;
}

.tile:hover {
  transform: translateY(-9px) scale(1.05);
  background: #6366f1;
  box-shadow: 0 18px 32px rgba(99, 102, 241, 0.5);
}
`,
  },

  {
    id: 'html-hello',
    group: 'HTML から CSS へ',
    lang: 'html',
    file: 'index.html',
    level: 1,
    title: 'HTML の骨組みを書く',
    subtitle: 'DOCTYPE · head · body',
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
    group: 'HTML から CSS へ',
    lang: 'html',
    file: 'profile.html',
    level: 2,
    title: 'プロフィールを HTML で組む',
    subtitle: 'ul · a · hr',
    note: '<body> に入った所から、打つそばで中身が積み上がっていく。',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ada Lovelace</title>
</head>
<body>
  <h1>Ada Lovelace</h1>
  <p class="role">Web Developer</p>
  <hr>
  <h2>Skills</h2>
  <ul>
    <li>HTML and CSS</li>
    <li>JavaScript</li>
    <li>Ruby on Rails</li>
  </ul>
  <p><a href="https://example.com">Portfolio</a></p>
</body>
</html>
`,
  },

  {
    id: 'css-profile',
    group: 'HTML から CSS へ',
    lang: 'css',
    file: 'profile.css',
    level: 2,
    title: 'プロフィールを CSS で整える',
    subtitle: 'max-width · color',
    note: '前の課題で組んだ素の文書に、一行ずつ体裁を与えていく。',
    scaffold: `  <h1>Ada Lovelace</h1>
  <p class="role">Web Developer</p>
  <hr>
  <h2>Skills</h2>
  <ul>
    <li>HTML and CSS</li>
    <li>JavaScript</li>
    <li>Ruby on Rails</li>
  </ul>
  <p><a href="https://example.com">Portfolio</a></p>`,
    code: `body {
  max-width: 30rem;
  margin: 40px auto;
  font-family: system-ui, sans-serif;
  color: #1f2937;
  line-height: 1.8;
}

h1 {
  margin-bottom: 2px;
  font-size: 30px;
}

.role {
  margin-top: 0;
  color: #6b7280;
}

hr {
  margin: 26px 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
}

li {
  line-height: 1.9;
}

a {
  color: #2563eb;
}
`,
  },

  {
    id: 'html-form',
    group: '王道パターン',
    lang: 'html',
    file: 'signup.html',
    level: 3,
    title: '申し込みフォームを組む',
    subtitle: 'label · input · select',
    note: '属性が多い。引用符とハイフンの往復が効いてくる。',
    code: `<form class="signup" action="/signup" method="post">
  <h2>Create your account</h2>

  <label for="name">Name</label>
  <input id="name" type="text" placeholder="Ada" required>

  <label for="mail">Email</label>
  <input id="mail" type="email" placeholder="you@example.com" required>

  <label for="plan">Plan</label>
  <select id="plan" name="plan">
    <option value="free">Free</option>
    <option value="pro" selected>Pro</option>
  </select>

  <button type="submit">Sign up</button>
</form>
`,
  },

  {
    id: 'html-table',
    group: '王道パターン',
    lang: 'html',
    file: 'pricing.html',
    level: 3,
    title: '料金表を組む',
    subtitle: 'table · thead · tbody',
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
    group: '見た目が変わる',
    lang: 'css',
    file: 'card.css',
    level: 2,
    title: '部品をカードにまとめる',
    subtitle: '余白 · 角丸 · 影',
    note: '中身の余白だけを決めていく。外側の置き方は前の単元でやった。',
    scaffold: `<div class="card">
  <span class="tag">NEW</span>
  <h2>Typing Engineer</h2>
  <p>Code typing practice with a live preview.</p>
  <button class="btn">Start typing</button>
</div>`,
    code: `body {
  margin: 0;
  padding: 40px;
  background: #eef2f7;
  font-family: system-ui, sans-serif;
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
    group: '見た目が変わる',
    lang: 'css',
    file: 'layout.css',
    level: 3,
    title: 'メニューを横一列に並べる',
    subtitle: 'display: flex · justify-content',
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
    group: '見た目が変わる',
    lang: 'css',
    file: 'motion.css',
    level: 4,
    title: '玉を順ぐりに跳ねさせる',
    subtitle: '@keyframes · animation-delay',
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
  {
    id: 'html-blog',
    group: '王道パターン',
    lang: 'html',
    file: 'post.html',
    level: 3,
    title: 'ブログ記事を組む',
    subtitle: 'article · time · blockquote',
    note: '記事の骨格。引用と本文の入れ子を打ち分ける。',
    code: `<article class="post">
  <header>
    <p class="cat">Engineering</p>
    <h1>Why we rewrote the editor</h1>
    <p class="meta">
      <time datetime="2026-08-08">August 8, 2026</time>
      &middot; 6 min read
    </p>
  </header>

  <p>The old editor shipped in 2020 and it served us well.</p>

  <h2>What went wrong</h2>
  <p>Every keystroke rebuilt the whole document. Fine for a
    short file, painful for a long one.</p>

  <blockquote>
    <p>Make it work, make it right, make it fast.</p>
    <cite>Kent Beck</cite>
  </blockquote>

  <p>So we stream the changes instead. See <code>render()</code>.</p>
</article>
`,
  },

  {
    id: 'html-login',
    group: '王道パターン',
    lang: 'html',
    file: 'login.html',
    level: 3,
    title: 'ログイン画面を組む',
    subtitle: 'form · autocomplete',
    note: 'どのサービスにもある一枚。属性を省かずに打つ。',
    code: `<main class="auth">
  <form class="card" action="/login" method="post">
    <h1>Sign in</h1>
    <p class="sub">Welcome back. Enter your details.</p>

    <label for="mail">Email</label>
    <input id="mail" name="mail" type="email"
           autocomplete="email" required>

    <label for="pw">Password</label>
    <input id="pw" name="pw" type="password"
           autocomplete="current-password" required>

    <button type="submit">Sign in</button>
    <p class="alt">No account? <a href="/signup">Create one</a></p>
  </form>
</main>
`,
  },

  {
    id: 'html-nav',
    group: '王道パターン',
    lang: 'html',
    file: 'shell.html',
    level: 2,
    title: 'ナビとフッターを組む',
    subtitle: 'nav · ul · li',
    note: '<li><a href> の繰り返し。手が形を覚えると速くなる。',
    code: `<header class="site">
  <a class="brand" href="/">ACME</a>
  <nav>
    <ul>
      <li><a href="/product">Product</a></li>
      <li><a href="/pricing">Pricing</a></li>
      <li><a href="/docs">Docs</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </nav>
  <a class="cta" href="/signup">Get started</a>
</header>

<footer class="site">
  <nav>
    <h2>Product</h2>
    <ul>
      <li><a href="/features">Features</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul>
  </nav>
  <small>&copy; 2026 ACME Inc.</small>
</footer>
`,
  },

  {
    id: 'css-products',
    group: '王道パターン',
    lang: 'css',
    file: 'products.css',
    level: 4,
    title: '商品を格子に並べる',
    subtitle: 'EC · grid · aspect-ratio',
    note: '縦に並んだ商品が、grid の一行で棚に並ぶ。',
    scaffold: `<h1 class="head">New arrivals</h1>
<ul class="grid">
  <li class="item">
    <div class="thumb thumb--a"></div>
    <span class="badge">SALE</span>
    <h2>Canvas Tote</h2>
    <p class="price"><b>$32</b> <s>$48</s></p>
  </li>
  <li class="item">
    <div class="thumb thumb--b"></div>
    <h2>Enamel Mug</h2>
    <p class="price"><b>$18</b></p>
  </li>
  <li class="item">
    <div class="thumb thumb--c"></div>
    <h2>Field Notebook</h2>
    <p class="price"><b>$12</b></p>
  </li>
</ul>`,
    code: `body {
  margin: 0;
  padding: 26px;
  background: #fafafa;
  color: #18181b;
  font-family: system-ui, sans-serif;
}

.head {
  margin: 0 0 20px;
  font-size: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  position: relative;
  padding: 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.thumb {
  aspect-ratio: 4 / 3;
  border-radius: 8px;
}

.thumb--a { background: linear-gradient(135deg, #fbbf24, #f97316); }
.thumb--b { background: linear-gradient(135deg, #60a5fa, #2563eb); }
.thumb--c { background: linear-gradient(135deg, #34d399, #059669); }

.item h2 {
  margin: 12px 0 4px;
  font-size: 14px;
}

.price b {
  font-size: 17px;
}

.price s {
  color: #a1a1aa;
  font-size: 13px;
}

.badge {
  position: absolute;
  top: 17px;
  left: 17px;
  padding: 3px 7px;
  background: #dc2626;
  color: #ffffff;
  font-size: 10px;
  border-radius: 4px;
}
`,
  },

  {
    id: 'css-article',
    group: '王道パターン',
    lang: 'css',
    file: 'post.css',
    level: 3,
    title: '本文の行長と行間を決める',
    subtitle: 'max-width · line-height',
    note: 'べた組みの文章が、max-width 一行で読み物になる。',
    scaffold: `<article>
  <h1>Why we rewrote the editor</h1>
  <p class="meta">August 8, 2026 &middot; 6 min read</p>
  <p>The old editor shipped in 2020 and it served us well.
  Every keystroke rebuilt the whole document, which was fine
  for a short file and painful for a long one.</p>
  <h2>What went wrong</h2>
  <p>We measured it. On a 400 line file, one keystroke cost
  90 milliseconds. You could feel it.</p>
  <blockquote><p>Make it work, make it right, make it fast.</p></blockquote>
  <p>So we stream the changes instead of rebuilding.</p>
</article>`,
    code: `body {
  margin: 0;
  background: #fffdf8;
  color: #292524;
  font-family: Georgia, serif;
}

article {
  max-width: 34rem;
  margin: 46px auto;
  padding: 0 24px;
  line-height: 1.9;
}

h1 {
  margin-bottom: 8px;
  font-size: 31px;
  line-height: 1.3;
}

.meta {
  margin-top: 0;
  color: #a8a29e;
  font-size: 13px;
  font-family: system-ui, sans-serif;
}

h2 {
  margin-top: 38px;
  font-size: 21px;
}

blockquote {
  margin: 30px 0;
  padding-left: 20px;
  border-left: 3px solid #d6d3d1;
  color: #57534e;
  font-style: italic;
}
`,
  },

  {
    id: 'css-hero',
    group: '王道パターン',
    lang: 'css',
    file: 'hero.css',
    level: 4,
    title: 'トップの一画面をつくる',
    subtitle: 'ヒーロー · radial-gradient',
    note: 'サイトを開いて最初に見える一画面。素の文字列が見せ場になる。',
    scaffold: `<section class="hero">
  <p class="eyebrow">2026.03.14 SAT / SHIBUYA</p>
  <h1>Tokyo Web<br>Meetup</h1>
  <p class="lead">A night for people who build the web.</p>
  <div class="actions">
    <a class="btn" href="#">Get a ticket</a>
    <a class="ghost" href="#">See the talks</a>
  </div>
</section>`,
    code: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.hero {
  min-height: 100vh;
  display: grid;
  place-content: center;
  padding: 24px;
  text-align: center;
  color: #f8fafc;
  background: radial-gradient(circle at 30% 20%, #4c1d95, #0f172a 60%);
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c4b5fd;
}

.hero h1 {
  margin: 12px 0 16px;
  font-size: 45px;
  line-height: 1.2;
}

.lead {
  margin: 0 0 30px;
  color: #cbd5e1;
  font-size: 17px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 13px 26px;
  background: #a78bfa;
  color: #1e1b4b;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
}

.ghost {
  padding: 13px 26px;
  color: #e2e8f0;
  border: 1px solid #475569;
  border-radius: 10px;
  text-decoration: none;
}
`,
  },

  {
    id: 'css-dashboard',
    group: '王道パターン',
    lang: 'css',
    file: 'admin.css',
    level: 4,
    title: '管理画面の骨格を組む',
    subtitle: 'ダッシュボード · サイドバー',
    note: '縦積みの数字が、脇に柱の立った管理画面になる。',
    scaffold: `<aside class="side">
  <p class="logo">ACME</p>
  <nav>
    <a class="on" href="#">Overview</a>
    <a href="#">Orders</a>
    <a href="#">Customers</a>
  </nav>
</aside>
<main class="main">
  <h1>Overview</h1>
  <div class="kpis">
    <div class="kpi"><p>Revenue</p><b>$48,120</b><span class="up">+12%</span></div>
    <div class="kpi"><p>Orders</p><b>1,284</b><span class="up">+4%</span></div>
    <div class="kpi"><p>Refunds</p><b>37</b><span class="down">-8%</span></div>
  </div>
</main>`,
    code: `body {
  margin: 0;
  display: flex;
  min-height: 100vh;
  background: #f4f5f7;
  color: #1f2937;
  font-family: system-ui, sans-serif;
}

.side {
  width: 168px;
  padding: 20px 14px;
  background: #111827;
  color: #e5e7eb;
}

.logo {
  margin: 0 0 22px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.side nav {
  display: grid;
  gap: 2px;
}

.side a {
  padding: 9px 11px;
  border-radius: 8px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 13px;
}

.side a.on {
  background: #1f2937;
  color: #ffffff;
}

.main {
  flex: 1;
  padding: 26px;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.kpi {
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.kpi p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

.kpi b {
  display: block;
  margin: 6px 0;
  font-size: 25px;
}

.up { color: #059669; font-size: 12px; }
.down { color: #dc2626; font-size: 12px; }
`,
  },
  {
    id: 'game-breakout-1',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'breakout.js',
    level: 1,
    title: '台と玉を描く',
    subtitle: 'canvas · fillRect · arc',
    note: '打ち終えると、板と玉が置かれた台が一枚出る。まだ動かない。',
    scaffold: `<canvas id="cv" width="320" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: ``,
    code: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const paddle = { x: 124, y: 380, w: 72, h: 10 };
const ball = { x: 160, y: 200, r: 7 };

function draw() {
  g.fillStyle = '#05070f';
  g.fillRect(0, 0, 320, 400);

  g.fillStyle = '#e2e8f0';
  g.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(ball.x, ball.y, ball.r, 0, 7);
  g.fill();
}

draw();
`,
  },

  {
    id: 'game-breakout-2',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'breakout.js',
    level: 2,
    title: '板を矢印キーで動かす',
    subtitle: 'keydown · requestAnimationFrame',
    note: 'キーの状態を持って毎フレーム描き直す。「遊ぶ」を押すと動かせる。',
    scaffold: `<canvas id="cv" width="320" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const paddle = { x: 124, y: 380, w: 72, h: 10 };
const ball = { x: 160, y: 200, r: 7 };

function draw() {
  g.fillStyle = '#05070f';
  g.fillRect(0, 0, 320, 400);

  g.fillStyle = '#e2e8f0';
  g.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(ball.x, ball.y, ball.r, 0, 7);
  g.fill();
}

draw();
`,
    code: `const keys = {};

addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function move() {
  if (keys.ArrowLeft) paddle.x -= 6;
  if (keys.ArrowRight) paddle.x += 6;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > 248) paddle.x = 248;
}

function loop() {
  move();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
  },

  {
    id: 'game-breakout-3',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'breakout.js',
    level: 2,
    title: '玉を飛ばす',
    subtitle: '速度と壁の跳ね返り',
    note: '座標に速度を足すだけ。壁に触れたら符号を反転する。',
    scaffold: `<canvas id="cv" width="320" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const paddle = { x: 124, y: 380, w: 72, h: 10 };
const ball = { x: 160, y: 200, r: 7 };

function draw() {
  g.fillStyle = '#05070f';
  g.fillRect(0, 0, 320, 400);

  g.fillStyle = '#e2e8f0';
  g.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(ball.x, ball.y, ball.r, 0, 7);
  g.fill();
}

draw();
const keys = {};

addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function move() {
  if (keys.ArrowLeft) paddle.x -= 6;
  if (keys.ArrowRight) paddle.x += 6;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > 248) paddle.x = 248;
}

function loop() {
  move();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
    code: `ball.vx = 2.4;
ball.vy = -3;

function fly() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x < 7 || ball.x > 313) ball.vx = -ball.vx;
  if (ball.y < 7) ball.vy = -ball.vy;

  if (ball.y > 430) {
    ball.x = 160;
    ball.y = 200;
    ball.vy = -3;
  }
}

function loop() {
  move();
  fly();
  draw();
  requestAnimationFrame(loop);
}
`,
  },

  {
    id: 'game-breakout-4',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'breakout.js',
    level: 3,
    title: '板で打ち返す',
    subtitle: '当たり判定',
    note: '板と玉が重なったかを見る。当たった位置で跳ね返る角度が変わる。',
    scaffold: `<canvas id="cv" width="320" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const paddle = { x: 124, y: 380, w: 72, h: 10 };
const ball = { x: 160, y: 200, r: 7 };

function draw() {
  g.fillStyle = '#05070f';
  g.fillRect(0, 0, 320, 400);

  g.fillStyle = '#e2e8f0';
  g.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(ball.x, ball.y, ball.r, 0, 7);
  g.fill();
}

draw();
const keys = {};

addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function move() {
  if (keys.ArrowLeft) paddle.x -= 6;
  if (keys.ArrowRight) paddle.x += 6;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > 248) paddle.x = 248;
}

function loop() {
  move();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
ball.vx = 2.4;
ball.vy = -3;

function fly() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x < 7 || ball.x > 313) ball.vx = -ball.vx;
  if (ball.y < 7) ball.vy = -ball.vy;

  if (ball.y > 430) {
    ball.x = 160;
    ball.y = 200;
    ball.vy = -3;
  }
}

function loop() {
  move();
  fly();
  draw();
  requestAnimationFrame(loop);
}
`,
    code: `function bounce() {
  const onX = ball.x > paddle.x && ball.x < paddle.x + paddle.w;
  const onY = ball.y + ball.r > paddle.y && ball.y < paddle.y + paddle.h;

  if (onX && onY && ball.vy > 0) {
    ball.vy = -ball.vy;
    ball.vx += (ball.x - paddle.x - 36) / 22;
  }
}

function loop() {
  move();
  fly();
  bounce();
  draw();
  requestAnimationFrame(loop);
}
`,
  },

  {
    id: 'game-breakout-5',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'breakout.js',
    level: 3,
    title: 'ブロックを壊して得点',
    subtitle: '配列と総当たり',
    note: '最後の一行を打つと、崩せるものになる。',
    scaffold: `<canvas id="cv" width="320" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const paddle = { x: 124, y: 380, w: 72, h: 10 };
const ball = { x: 160, y: 200, r: 7 };

function draw() {
  g.fillStyle = '#05070f';
  g.fillRect(0, 0, 320, 400);

  g.fillStyle = '#e2e8f0';
  g.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(ball.x, ball.y, ball.r, 0, 7);
  g.fill();
}

draw();
const keys = {};

addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function move() {
  if (keys.ArrowLeft) paddle.x -= 6;
  if (keys.ArrowRight) paddle.x += 6;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > 248) paddle.x = 248;
}

function loop() {
  move();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
ball.vx = 2.4;
ball.vy = -3;

function fly() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x < 7 || ball.x > 313) ball.vx = -ball.vx;
  if (ball.y < 7) ball.vy = -ball.vy;

  if (ball.y > 430) {
    ball.x = 160;
    ball.y = 200;
    ball.vy = -3;
  }
}

function loop() {
  move();
  fly();
  draw();
  requestAnimationFrame(loop);
}
function bounce() {
  const onX = ball.x > paddle.x && ball.x < paddle.x + paddle.w;
  const onY = ball.y + ball.r > paddle.y && ball.y < paddle.y + paddle.h;

  if (onX && onY && ball.vy > 0) {
    ball.vy = -ball.vy;
    ball.vx += (ball.x - paddle.x - 36) / 22;
  }
}

function loop() {
  move();
  fly();
  bounce();
  draw();
  requestAnimationFrame(loop);
}
`,
    code: `const bricks = [];

for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 8; c++) {
    bricks.push({ x: 10 + c * 38, y: 24 + r * 22, on: true });
  }
}

let score = 0;

function smash() {
  for (const b of bricks) {
    if (!b.on) continue;
    if (ball.x > b.x && ball.x < b.x + 34 && ball.y > b.y && ball.y < b.y + 15) {
      b.on = false;
      ball.vy = -ball.vy;
      score += 10;
    }
  }
}

function drawBricks() {
  for (const b of bricks) {
    if (!b.on) continue;
    g.fillStyle = b.y < 40 ? '#38bdf8' : b.y < 62 ? '#a78bfa' : '#f472b6';
    g.fillRect(b.x, b.y, 34, 15);
  }

  g.fillStyle = '#94a3b8';
  g.font = '12px monospace';
  g.fillText('SCORE ' + score, 10, 396);
}

function loop() {
  move();
  fly();
  bounce();
  smash();
  draw();
  drawBricks();
  requestAnimationFrame(loop);
}
`,
  },

  {
    id: 'app-memo-1',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 1,
    title: '一覧を描く',
    subtitle: 'Read · createElement',
    note: '配列を回して li を作るだけ。打ち終えると三件が並ぶ。',
    scaffold: `<div class="app">
  <h1>Memo</h1>
  <form id="form">
    <input id="text" placeholder="Add a task" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</div>`,
    styles: `.app{width:340px;padding:24px;background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-family:system-ui,sans-serif;color:#1f2937}
h1{margin:0 0 16px;font-size:20px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;font-size:14px}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:14px;cursor:pointer}
ul{margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid #f3f4f6;font-size:14px}
.txt{flex:1;cursor:pointer}
li.done .txt{color:#9ca3af;text-decoration:line-through}
.del{padding:2px 8px;background:#f3f4f6;color:#6b7280;font-size:12px}
#count{margin:14px 0 0;color:#9ca3af;font-size:12px}`,
    base: ``,
    code: `const list = document.getElementById('list');
const count = document.getElementById('count');

const items = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write the report', done: true },
  { id: 3, text: 'Call the dentist', done: false },
];

function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.text;
    if (item.done) li.className = 'done';
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

render();
`,
  },

  {
    id: 'app-memo-2',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 2,
    title: '追加する',
    subtitle: 'Create · submit',
    note: 'フォームの既定の送信を止めて、配列に足して描き直す。',
    scaffold: `<div class="app">
  <h1>Memo</h1>
  <form id="form">
    <input id="text" placeholder="Add a task" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</div>`,
    styles: `.app{width:340px;padding:24px;background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-family:system-ui,sans-serif;color:#1f2937}
h1{margin:0 0 16px;font-size:20px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;font-size:14px}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:14px;cursor:pointer}
ul{margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid #f3f4f6;font-size:14px}
.txt{flex:1;cursor:pointer}
li.done .txt{color:#9ca3af;text-decoration:line-through}
.del{padding:2px 8px;background:#f3f4f6;color:#6b7280;font-size:12px}
#count{margin:14px 0 0;color:#9ca3af;font-size:12px}`,
    base: `const list = document.getElementById('list');
const count = document.getElementById('count');

const items = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write the report', done: true },
  { id: 3, text: 'Call the dentist', done: false },
];

function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.text;
    if (item.done) li.className = 'done';
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

render();
`,
    code: `const form = document.getElementById('form');
const text = document.getElementById('text');

let nextId = 4;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = text.value.trim();
  if (!value) return;

  items.push({ id: nextId, text: value, done: false });
  nextId += 1;
  text.value = '';
  render();
});
`,
  },

  {
    id: 'app-memo-3',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 2,
    title: '完了に切り替える',
    subtitle: 'Update · イベント委譲',
    note: '一件ずつに listener は付けない。ul で受けて、押された相手を見る。',
    scaffold: `<div class="app">
  <h1>Memo</h1>
  <form id="form">
    <input id="text" placeholder="Add a task" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</div>`,
    styles: `.app{width:340px;padding:24px;background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-family:system-ui,sans-serif;color:#1f2937}
h1{margin:0 0 16px;font-size:20px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;font-size:14px}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:14px;cursor:pointer}
ul{margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid #f3f4f6;font-size:14px}
.txt{flex:1;cursor:pointer}
li.done .txt{color:#9ca3af;text-decoration:line-through}
.del{padding:2px 8px;background:#f3f4f6;color:#6b7280;font-size:12px}
#count{margin:14px 0 0;color:#9ca3af;font-size:12px}`,
    base: `const list = document.getElementById('list');
const count = document.getElementById('count');

const items = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write the report', done: true },
  { id: 3, text: 'Call the dentist', done: false },
];

function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.text;
    if (item.done) li.className = 'done';
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

render();
const form = document.getElementById('form');
const text = document.getElementById('text');

let nextId = 4;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = text.value.trim();
  if (!value) return;

  items.push({ id: nextId, text: value, done: false });
  nextId += 1;
  text.value = '';
  render();
});
`,
    code: `function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    if (item.done) li.className = 'done';

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    li.append(txt);
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('txt')) return;

  const id = Number(e.target.closest('li').dataset.id);
  const item = items.find((v) => v.id === id);
  item.done = !item.done;
  render();
});
`,
  },

  {
    id: 'app-memo-4',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 3,
    title: '消す',
    subtitle: 'Delete · splice',
    note: '削除ボタンを足す。押された相手で処理を分けるので、切り替えとは衝突しない。',
    scaffold: `<div class="app">
  <h1>Memo</h1>
  <form id="form">
    <input id="text" placeholder="Add a task" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</div>`,
    styles: `.app{width:340px;padding:24px;background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-family:system-ui,sans-serif;color:#1f2937}
h1{margin:0 0 16px;font-size:20px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;font-size:14px}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:14px;cursor:pointer}
ul{margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid #f3f4f6;font-size:14px}
.txt{flex:1;cursor:pointer}
li.done .txt{color:#9ca3af;text-decoration:line-through}
.del{padding:2px 8px;background:#f3f4f6;color:#6b7280;font-size:12px}
#count{margin:14px 0 0;color:#9ca3af;font-size:12px}`,
    base: `const list = document.getElementById('list');
const count = document.getElementById('count');

const items = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write the report', done: true },
  { id: 3, text: 'Call the dentist', done: false },
];

function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.text;
    if (item.done) li.className = 'done';
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

render();
const form = document.getElementById('form');
const text = document.getElementById('text');

let nextId = 4;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = text.value.trim();
  if (!value) return;

  items.push({ id: nextId, text: value, done: false });
  nextId += 1;
  text.value = '';
  render();
});
function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    if (item.done) li.className = 'done';

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    li.append(txt);
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('txt')) return;

  const id = Number(e.target.closest('li').dataset.id);
  const item = items.find((v) => v.id === id);
  item.done = !item.done;
  render();
});
`,
    code: `function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    if (item.done) li.className = 'done';

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = 'x';

    li.append(txt, del);
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('del')) return;

  const id = Number(e.target.closest('li').dataset.id);
  const at = items.findIndex((v) => v.id === id);
  items.splice(at, 1);
  render();
});
`,
  },

  {
    id: 'app-memo-5',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 3,
    title: '保存する',
    subtitle: 'localStorage',
    note: '最後の一行を打つと、閉じても中身が残るようになる。',
    scaffold: `<div class="app">
  <h1>Memo</h1>
  <form id="form">
    <input id="text" placeholder="Add a task" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</div>`,
    styles: `.app{width:340px;padding:24px;background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-family:system-ui,sans-serif;color:#1f2937}
h1{margin:0 0 16px;font-size:20px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:9px 11px;border:1px solid #d1d5db;border-radius:8px;font-size:14px}
button{padding:9px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-size:14px;cursor:pointer}
ul{margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:8px;padding:10px 4px;border-bottom:1px solid #f3f4f6;font-size:14px}
.txt{flex:1;cursor:pointer}
li.done .txt{color:#9ca3af;text-decoration:line-through}
.del{padding:2px 8px;background:#f3f4f6;color:#6b7280;font-size:12px}
#count{margin:14px 0 0;color:#9ca3af;font-size:12px}`,
    base: `const list = document.getElementById('list');
const count = document.getElementById('count');

const items = [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Write the report', done: true },
  { id: 3, text: 'Call the dentist', done: false },
];

function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.text;
    if (item.done) li.className = 'done';
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

render();
const form = document.getElementById('form');
const text = document.getElementById('text');

let nextId = 4;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = text.value.trim();
  if (!value) return;

  items.push({ id: nextId, text: value, done: false });
  nextId += 1;
  text.value = '';
  render();
});
function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    if (item.done) li.className = 'done';

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    li.append(txt);
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('txt')) return;

  const id = Number(e.target.closest('li').dataset.id);
  const item = items.find((v) => v.id === id);
  item.done = !item.done;
  render();
});
function render() {
  list.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    if (item.done) li.className = 'done';

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = 'x';

    li.append(txt, del);
    list.append(li);
  }

  count.textContent = items.length + ' items';
}

list.addEventListener('click', (e) => {
  if (!e.target.classList.contains('del')) return;

  const id = Number(e.target.closest('li').dataset.id);
  const at = items.findIndex((v) => v.id === id);
  items.splice(at, 1);
  render();
});
`,
    code: `function save() {
  localStorage.setItem('memo', JSON.stringify(items));
}

function load() {
  const raw = localStorage.getItem('memo');
  if (!raw) return;

  items.length = 0;
  for (const v of JSON.parse(raw)) items.push(v);
  nextId = items.length + 1;
}

list.addEventListener('click', save);
form.addEventListener('submit', save);

load();
render();
`,
  },

];

/** 一覧の並び。打った通りに見た目が変わるものを先に置く */
export const GROUPS = ['見た目が変わる', '王道パターン', 'アプリを写経する', 'ゲームを写経する', 'HTML から CSS へ'];

export function lessonsByGroup() {
  return GROUPS.map((name) => ({
    name,
    items: LESSONS.filter((l) => l.group === name),
  })).filter((g) => g.items.length);
}

export function findLesson(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

export function nextLesson(id) {
  const i = LESSONS.findIndex((l) => l.id === id);
  if (i === -1) return null;
  return LESSONS[(i + 1) % LESSONS.length];
}
