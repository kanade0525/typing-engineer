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
    series: 'breakout',
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
    series: 'breakout',
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
    series: 'breakout',
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
    series: 'breakout',
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
    series: 'breakout',
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
    series: 'memo',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 1,
    title: 'メモの一覧を描く',
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
    series: 'memo',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 2,
    title: 'メモを追加する',
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
    series: 'memo',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 2,
    title: 'メモを済みにする',
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
    series: 'memo',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 3,
    title: 'メモを消す',
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
    series: 'memo',
    group: 'アプリを写経する',
    lang: 'js',
    file: 'memo.js',
    level: 3,
    title: '閉じても残るようにする',
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

  {
    id: 'game-invader-1',
    series: 'invader',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'invader.js',
    level: 1,
    title: '宇宙と自機を描く',
    subtitle: 'moveTo · lineTo',
    note: '三角形は線をつないで塗る。打ち終えると自機が一機置かれる。',
    scaffold: `<canvas id="cv" width="320" height="360"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: ``,
    code: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const ship = { x: 144, y: 330, w: 32, h: 12 };

function sky() {
  g.fillStyle = '#04040a';
  g.fillRect(0, 0, 320, 360);
}

function drawShip() {
  g.fillStyle = '#4ade80';
  g.beginPath();
  g.moveTo(ship.x + 16, ship.y);
  g.lineTo(ship.x + 32, ship.y + 12);
  g.lineTo(ship.x, ship.y + 12);
  g.fill();
}

sky();
drawShip();
`,
  },

  {
    id: 'game-invader-2',
    series: 'invader',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'invader.js',
    level: 2,
    title: '敵を四角で組み立てる',
    subtitle: '矩形の組み合わせ',
    note: '四つの矩形で一体。二重の繰り返しで二十一体を並べる。',
    scaffold: `<canvas id="cv" width="320" height="360"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const ship = { x: 144, y: 330, w: 32, h: 12 };

function sky() {
  g.fillStyle = '#04040a';
  g.fillRect(0, 0, 320, 360);
}

function drawShip() {
  g.fillStyle = '#4ade80';
  g.beginPath();
  g.moveTo(ship.x + 16, ship.y);
  g.lineTo(ship.x + 32, ship.y + 12);
  g.lineTo(ship.x, ship.y + 12);
  g.fill();
}

sky();
drawShip();
`,
    code: `const aliens = [];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 7; col++) {
    aliens.push({ x: 26 + col * 40, y: 40 + row * 34, alive: true });
  }
}

function drawAliens() {
  g.fillStyle = '#22d3ee';

  for (const a of aliens) {
    if (!a.alive) continue;
    g.fillRect(a.x, a.y + 4, 20, 8);
    g.fillRect(a.x + 4, a.y, 12, 4);
    g.fillRect(a.x, a.y + 12, 4, 4);
    g.fillRect(a.x + 16, a.y + 12, 4, 4);
  }
}

sky();
drawAliens();
drawShip();
`,
  },

  {
    id: 'game-invader-3',
    series: 'invader',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'invader.js',
    level: 2,
    title: '隊列を行進させる',
    subtitle: '端で折り返して降りる',
    note: '一体でも端に触れたら全部が向きを変え、一段降りる。',
    scaffold: `<canvas id="cv" width="320" height="360"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const ship = { x: 144, y: 330, w: 32, h: 12 };

function sky() {
  g.fillStyle = '#04040a';
  g.fillRect(0, 0, 320, 360);
}

function drawShip() {
  g.fillStyle = '#4ade80';
  g.beginPath();
  g.moveTo(ship.x + 16, ship.y);
  g.lineTo(ship.x + 32, ship.y + 12);
  g.lineTo(ship.x, ship.y + 12);
  g.fill();
}

sky();
drawShip();
const aliens = [];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 7; col++) {
    aliens.push({ x: 26 + col * 40, y: 40 + row * 34, alive: true });
  }
}

function drawAliens() {
  g.fillStyle = '#22d3ee';

  for (const a of aliens) {
    if (!a.alive) continue;
    g.fillRect(a.x, a.y + 4, 20, 8);
    g.fillRect(a.x + 4, a.y, 12, 4);
    g.fillRect(a.x, a.y + 12, 4, 4);
    g.fillRect(a.x + 16, a.y + 12, 4, 4);
  }
}

sky();
drawAliens();
drawShip();
`,
    code: `let drift = 1;

function marchAliens() {
  let turn = false;

  for (const a of aliens) {
    if (!a.alive) continue;
    a.x += drift;
    if (a.x < 6 || a.x > 294) turn = true;
  }

  if (!turn) return;
  drift = -drift;

  for (const a of aliens) {
    a.y += 12;
  }
}

function loop() {
  sky();
  marchAliens();
  drawAliens();
  drawShip();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
  },

  {
    id: 'game-invader-4',
    series: 'invader',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'invader.js',
    level: 3,
    title: '撃って当てる',
    subtitle: 'スペースキーと当たり判定',
    note: '最後の一行を打つと、矢印キーで動きスペースで撃てる。',
    scaffold: `<canvas id="cv" width="320" height="360"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const ship = { x: 144, y: 330, w: 32, h: 12 };

function sky() {
  g.fillStyle = '#04040a';
  g.fillRect(0, 0, 320, 360);
}

function drawShip() {
  g.fillStyle = '#4ade80';
  g.beginPath();
  g.moveTo(ship.x + 16, ship.y);
  g.lineTo(ship.x + 32, ship.y + 12);
  g.lineTo(ship.x, ship.y + 12);
  g.fill();
}

sky();
drawShip();
const aliens = [];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 7; col++) {
    aliens.push({ x: 26 + col * 40, y: 40 + row * 34, alive: true });
  }
}

function drawAliens() {
  g.fillStyle = '#22d3ee';

  for (const a of aliens) {
    if (!a.alive) continue;
    g.fillRect(a.x, a.y + 4, 20, 8);
    g.fillRect(a.x + 4, a.y, 12, 4);
    g.fillRect(a.x, a.y + 12, 4, 4);
    g.fillRect(a.x + 16, a.y + 12, 4, 4);
  }
}

sky();
drawAliens();
drawShip();
let drift = 1;

function marchAliens() {
  let turn = false;

  for (const a of aliens) {
    if (!a.alive) continue;
    a.x += drift;
    if (a.x < 6 || a.x > 294) turn = true;
  }

  if (!turn) return;
  drift = -drift;

  for (const a of aliens) {
    a.y += 12;
  }
}

function loop() {
  sky();
  marchAliens();
  drawAliens();
  drawShip();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
    code: `const keys = {};

addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ') shot.on = true;
});

addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

const shot = { x: 0, y: 0, on: false };
let hits = 0;

function fire() {
  if (keys.ArrowLeft) ship.x -= 4;
  if (keys.ArrowRight) ship.x += 4;
  if (ship.x < 0) ship.x = 0;
  if (ship.x > 288) ship.x = 288;

  if (shot.on && shot.y <= 0) {
    shot.x = ship.x + 16;
    shot.y = ship.y;
  }

  if (shot.y > 0) shot.y -= 7;

  for (const a of aliens) {
    if (!a.alive) continue;
    if (shot.x > a.x && shot.x < a.x + 20 && shot.y < a.y + 16 && shot.y > a.y) {
      a.alive = false;
      shot.y = 0;
      hits += 1;
    }
  }

  shot.on = false;
  g.fillStyle = '#fde047';
  if (shot.y > 0) g.fillRect(shot.x, shot.y, 2, 10);
  g.fillText('HIT ' + hits, 8, 352);
}

function loop() {
  sky();
  marchAliens();
  drawAliens();
  drawShip();
  fire();
  requestAnimationFrame(loop);
}
`,
  },

  {
    id: 'game-drop-1',
    series: 'drop',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'drop.js',
    level: 1,
    title: '升目のフィールドを引く',
    subtitle: '二次元配列と格子',
    note: '十かける二十の升目を引く。中身はまだ空。',
    scaffold: `<canvas id="cv" width="220" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: ``,
    code: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const W = 10;
const H = 20;
const S = 20;

const field = [];

for (let y = 0; y < H; y++) {
  field.push(new Array(W).fill(0));
}

function drawField() {
  g.fillStyle = '#0b0f1a';
  g.fillRect(0, 0, 220, 400);

  g.strokeStyle = '#1e293b';

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      g.strokeRect(10 + x * S, y * S, S, S);
    }
  }
}

drawField();
`,
  },

  {
    id: 'game-drop-2',
    series: 'drop',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'drop.js',
    level: 2,
    title: '積み上がった様子を描く',
    subtitle: '色番号で塗り分ける',
    note: '配列の数字を色に読み替えて塗る。下三段が埋まる。',
    scaffold: `<canvas id="cv" width="220" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const W = 10;
const H = 20;
const S = 20;

const field = [];

for (let y = 0; y < H; y++) {
  field.push(new Array(W).fill(0));
}

function drawField() {
  g.fillStyle = '#0b0f1a';
  g.fillRect(0, 0, 220, 400);

  g.strokeStyle = '#1e293b';

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      g.strokeRect(10 + x * S, y * S, S, S);
    }
  }
}

drawField();
`,
    code: `const COLORS = ['#0b0f1a', '#38bdf8', '#a78bfa', '#f472b6', '#fbbf24'];

field[19] = [1, 1, 2, 2, 0, 0, 3, 3, 1, 1];
field[18] = [0, 1, 2, 0, 0, 0, 0, 3, 1, 0];
field[17] = [0, 0, 4, 0, 0, 0, 0, 0, 4, 0];

function drawStack() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!field[y][x]) continue;
      g.fillStyle = COLORS[field[y][x]];
      g.fillRect(11 + x * S, y * S + 1, S - 2, S - 2);
    }
  }
}

drawField();
drawStack();
`,
  },

  {
    id: 'game-drop-3',
    series: 'drop',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'drop.js',
    level: 2,
    title: 'ピースを落とす',
    subtitle: 'カウンタで落下',
    note: '数十フレームに一度だけ一段下げる。落ちてくるようになる。',
    scaffold: `<canvas id="cv" width="220" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const W = 10;
const H = 20;
const S = 20;

const field = [];

for (let y = 0; y < H; y++) {
  field.push(new Array(W).fill(0));
}

function drawField() {
  g.fillStyle = '#0b0f1a';
  g.fillRect(0, 0, 220, 400);

  g.strokeStyle = '#1e293b';

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      g.strokeRect(10 + x * S, y * S, S, S);
    }
  }
}

drawField();
const COLORS = ['#0b0f1a', '#38bdf8', '#a78bfa', '#f472b6', '#fbbf24'];

field[19] = [1, 1, 2, 2, 0, 0, 3, 3, 1, 1];
field[18] = [0, 1, 2, 0, 0, 0, 0, 3, 1, 0];
field[17] = [0, 0, 4, 0, 0, 0, 0, 0, 4, 0];

function drawStack() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!field[y][x]) continue;
      g.fillStyle = COLORS[field[y][x]];
      g.fillRect(11 + x * S, y * S + 1, S - 2, S - 2);
    }
  }
}

drawField();
drawStack();
`,
    code: `const piece = { x: 4, y: 0, cells: [[1, 1], [1, 1]], color: 1 };

function drawPiece() {
  g.fillStyle = COLORS[piece.color];

  for (let y = 0; y < piece.cells.length; y++) {
    for (let x = 0; x < piece.cells[y].length; x++) {
      if (!piece.cells[y][x]) continue;
      g.fillRect(11 + (piece.x + x) * S, (piece.y + y) * S + 1, S - 2, S - 2);
    }
  }
}

let tick = 0;

function loop() {
  tick += 1;

  if (tick % 30 === 0) {
    piece.y += 1;
    if (piece.y > 14) piece.y = 0;
  }

  drawField();
  drawStack();
  drawPiece();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
  },

  {
    id: 'game-drop-4',
    series: 'drop',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'drop.js',
    level: 3,
    title: '寄せて積み上げる',
    subtitle: '当たり判定と固定',
    note: '最後の一行を打つと、矢印キーで寄せて積めるようになる。',
    scaffold: `<canvas id="cv" width="220" height="400"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const W = 10;
const H = 20;
const S = 20;

const field = [];

for (let y = 0; y < H; y++) {
  field.push(new Array(W).fill(0));
}

function drawField() {
  g.fillStyle = '#0b0f1a';
  g.fillRect(0, 0, 220, 400);

  g.strokeStyle = '#1e293b';

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      g.strokeRect(10 + x * S, y * S, S, S);
    }
  }
}

drawField();
const COLORS = ['#0b0f1a', '#38bdf8', '#a78bfa', '#f472b6', '#fbbf24'];

field[19] = [1, 1, 2, 2, 0, 0, 3, 3, 1, 1];
field[18] = [0, 1, 2, 0, 0, 0, 0, 3, 1, 0];
field[17] = [0, 0, 4, 0, 0, 0, 0, 0, 4, 0];

function drawStack() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!field[y][x]) continue;
      g.fillStyle = COLORS[field[y][x]];
      g.fillRect(11 + x * S, y * S + 1, S - 2, S - 2);
    }
  }
}

drawField();
drawStack();
const piece = { x: 4, y: 0, cells: [[1, 1], [1, 1]], color: 1 };

function drawPiece() {
  g.fillStyle = COLORS[piece.color];

  for (let y = 0; y < piece.cells.length; y++) {
    for (let x = 0; x < piece.cells[y].length; x++) {
      if (!piece.cells[y][x]) continue;
      g.fillRect(11 + (piece.x + x) * S, (piece.y + y) * S + 1, S - 2, S - 2);
    }
  }
}

let tick = 0;

function loop() {
  tick += 1;

  if (tick % 30 === 0) {
    piece.y += 1;
    if (piece.y > 14) piece.y = 0;
  }

  drawField();
  drawStack();
  drawPiece();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
`,
    code: `function hits(nx, ny) {
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      const cy = ny + y;
      const cx = nx + x;
      if (cx < 0 || cx >= W || cy >= H) return true;
      if (field[cy][cx]) return true;
    }
  }
  return false;
}

addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && !hits(piece.x - 1, piece.y)) piece.x -= 1;
  if (e.key === 'ArrowRight' && !hits(piece.x + 1, piece.y)) piece.x += 1;
});

function fall() {
  if (!hits(piece.x, piece.y + 1)) {
    piece.y += 1;
    return;
  }

  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      field[piece.y + y][piece.x + x] = piece.color;
    }
  }

  piece.x = 4;
  piece.y = 0;
  piece.color = 1 + (piece.color % 4);
}

function loop() {
  tick += 1;
  if (tick % 24 === 0) fall();

  drawField();
  drawStack();
  drawPiece();
  requestAnimationFrame(loop);
}
`,
  },

  {
    id: 'game-othello-1',
    series: 'othello',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'othello.js',
    level: 1,
    title: '盤に線を引く',
    subtitle: 'moveTo · lineTo の繰り返し',
    note: '縦横九本ずつ引くだけで八かける八の盤になる。',
    scaffold: `<canvas id="cv" width="336" height="336"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: ``,
    code: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const N = 8;
const S = 40;

function drawBoard() {
  g.fillStyle = '#166534';
  g.fillRect(0, 0, 336, 336);

  g.strokeStyle = '#14532d';
  g.lineWidth = 2;

  for (let i = 0; i <= N; i++) {
    g.beginPath();
    g.moveTo(8 + i * S, 8);
    g.lineTo(8 + i * S, 328);
    g.moveTo(8, 8 + i * S);
    g.lineTo(328, 8 + i * S);
    g.stroke();
  }
}

drawBoard();
`,
  },

  {
    id: 'game-othello-2',
    series: 'othello',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'othello.js',
    level: 2,
    title: '石を並べる',
    subtitle: '二次元配列と円',
    note: '真ん中の四石を置く。数字を白黒に読み替えて丸を描く。',
    scaffold: `<canvas id="cv" width="336" height="336"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const N = 8;
const S = 40;

function drawBoard() {
  g.fillStyle = '#166534';
  g.fillRect(0, 0, 336, 336);

  g.strokeStyle = '#14532d';
  g.lineWidth = 2;

  for (let i = 0; i <= N; i++) {
    g.beginPath();
    g.moveTo(8 + i * S, 8);
    g.lineTo(8 + i * S, 328);
    g.moveTo(8, 8 + i * S);
    g.lineTo(328, 8 + i * S);
    g.stroke();
  }
}

drawBoard();
`,
    code: `const board = [];

for (let y = 0; y < N; y++) {
  board.push(new Array(N).fill(0));
}

board[3][3] = 1;
board[4][4] = 1;
board[3][4] = 2;
board[4][3] = 2;

function drawStones() {
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!board[y][x]) continue;
      g.fillStyle = board[y][x] === 1 ? '#f8fafc' : '#0f172a';
      g.beginPath();
      g.arc(28 + x * S, 28 + y * S, 15, 0, 7);
      g.fill();
    }
  }
}

drawBoard();
drawStones();
`,
  },

  {
    id: 'game-othello-3',
    series: 'othello',
    group: 'ゲームを写経する',
    lang: 'js',
    file: 'othello.js',
    level: 4,
    title: '挟んで返す',
    subtitle: '八方向の走査',
    note: '最後の一行を打つと、挟んだ石が返るようになる。',
    scaffold: `<canvas id="cv" width="336" height="336"></canvas>`,
    styles: `canvas { border-radius: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.6); }`,
    base: `const cv = document.getElementById('cv');
const g = cv.getContext('2d');

const N = 8;
const S = 40;

function drawBoard() {
  g.fillStyle = '#166534';
  g.fillRect(0, 0, 336, 336);

  g.strokeStyle = '#14532d';
  g.lineWidth = 2;

  for (let i = 0; i <= N; i++) {
    g.beginPath();
    g.moveTo(8 + i * S, 8);
    g.lineTo(8 + i * S, 328);
    g.moveTo(8, 8 + i * S);
    g.lineTo(328, 8 + i * S);
    g.stroke();
  }
}

drawBoard();
const board = [];

for (let y = 0; y < N; y++) {
  board.push(new Array(N).fill(0));
}

board[3][3] = 1;
board[4][4] = 1;
board[3][4] = 2;
board[4][3] = 2;

function drawStones() {
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!board[y][x]) continue;
      g.fillStyle = board[y][x] === 1 ? '#f8fafc' : '#0f172a';
      g.beginPath();
      g.arc(28 + x * S, 28 + y * S, 15, 0, 7);
      g.fill();
    }
  }
}

drawBoard();
drawStones();
`,
    code: `let turn = 2;

function flip(x, y, dx, dy, put) {
  const line = [];
  let cx = x + dx;
  let cy = y + dy;

  while (cx >= 0 && cx < N && cy >= 0 && cy < N && board[cy][cx] && board[cy][cx] !== turn) {
    line.push([cx, cy]);
    cx += dx;
    cy += dy;
  }

  if (!line.length) return 0;
  if (cx < 0 || cx >= N || cy < 0 || cy >= N) return 0;
  if (board[cy][cx] !== turn) return 0;

  if (put) {
    for (const [fx, fy] of line) board[fy][fx] = turn;
  }
  return line.length;
}

cv.addEventListener('click', (e) => {
  const r = cv.getBoundingClientRect();
  const x = Math.floor((e.clientX - r.left - 8) / S);
  const y = Math.floor((e.clientY - r.top - 8) / S);

  if (x < 0 || x >= N || y < 0 || y >= N || board[y][x]) return;

  let got = 0;
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx || dy) got += flip(x, y, dx, dy, true);
    }
  }

  if (!got) return;
  board[y][x] = turn;
  turn = turn === 1 ? 2 : 1;
  drawBoard();
  drawStones();
});
`,
  },

  {
    id: 'infra-compose-1',
    group: '設定ファイルを書く',
    lang: 'yaml',
    file: 'compose.yaml',
    level: 2,
    title: 'サービスを一台立てる',
    subtitle: 'services · image · ports',
    note: 'Docker は動かせない。代わりに打った内容を読んで、何が立つのかを図にする。',
    code: `services:
  web:
    image: nginx:1.27
    container_name: shop-web
    restart: unless-stopped
    ports:
      - "8080:80"
      - "8443:443"
    environment:
      APP_ENV: production
      TZ: Asia/Tokyo
    volumes:
      - ./public:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
`,
  },

  {
    id: 'infra-compose-2',
    group: '設定ファイルを書く',
    lang: 'yaml',
    file: 'compose.yaml',
    level: 3,
    title: 'もう一台足して繋ぐ',
    subtitle: 'depends_on · volumes',
    note: 'depends_on を書いた瞬間に、箱のあいだに矢印が引かれる。',
    code: `services:
  web:
    image: nginx:1.27
    ports:
      - "8080:80"
    depends_on:
      - api
  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://db:5432/shop
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data
  cache:
    image: redis:7
    volumes:
      - cache-data:/data

volumes:
  db-data:
  cache-data:
`,
  },

  {
    id: 'infra-routes-1',
    group: '設定ファイルを書く',
    lang: 'ruby',
    file: 'routes.rb',
    level: 2,
    title: 'ルーティングを一本ずつ書く',
    subtitle: 'root · get · post',
    note: 'Rails も動かせない。打った行が何本の道になるかを rails routes の形で出す。',
    code: `Rails.application.routes.draw do
  root "home#index"

  get "/about", to: "pages#about"
  get "/pricing", to: "pages#pricing"
  get "/faq", to: "pages#faq"

  get "/contact", to: "contacts#new"
  post "/contact", to: "contacts#create"

  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"
end
`,
  },

  {
    id: 'infra-routes-2',
    group: '設定ファイルを書く',
    lang: 'ruby',
    file: 'routes.rb',
    level: 3,
    title: 'resources で七本まとめて引く',
    subtitle: 'resources · only · 入れ子',
    note: 'resources :posts と打ち終えた瞬間に、七行が一度に現れる。',
    code: `Rails.application.routes.draw do
  root "home#index"

  resources :posts do
    resources :comments, only: [:create, :destroy]
  end

  resources :users, only: [:index, :show, :edit, :update]

  resources :orders, except: [:destroy]

  resources :sessions, only: [:new, :create, :destroy]
end
`,
  },

];


/**
 * ひと続きの作品。章はその中の段取りでしかない。
 * 一覧では作品名と「打ち終えると何ができるか」を先に出し、章はその下に並べる。
 */
export const SERIES = {
  memo: {
    name: 'メモ帳',
    headline: 'メモ帳をつくる',
    goal: '書いて、済みにして、消して、閉じても残る。CRUD がひと通り入った道具に。',
  },
  breakout: {
    name: 'ブロック崩し',
    headline: 'ブロック崩しをつくる',
    goal: '矢印キーで板を動かし、跳ね返る玉でブロックを崩す。遊べる形まで。',
  },
  invader: {
    name: 'インベーダー',
    headline: 'インベーダーをつくる',
    goal: '降りてくる敵の隊列を、スペースキーで撃ち落とす。',
  },
  drop: {
    name: 'ブロック落とし',
    headline: 'ブロック落としをつくる',
    goal: '落ちてくるピースを左右に寄せて積み上げる。',
  },
  othello: {
    name: 'オセロ',
    headline: 'オセロをつくる',
    goal: '盤を敷き、石を並べ、挟んだ石が返るところまで。',
  },
};

/** 作品ごとにまとめる。作品に属さないものは一つずつの札のまま */
export function blocksOf(items) {
  const out = [];
  for (const l of items) {
    if (!l.series) {
      out.push({ items: [l] });
      continue;
    }
    const last = out[out.length - 1];
    if (last && last.series === l.series) last.items.push(l);
    else out.push({ series: l.series, ...SERIES[l.series], items: [l] });
  }
  return out;
}

/** 一覧の並び。打った通りに見た目が変わるものを先に置く */
export const GROUPS = ['見た目が変わる', '王道パターン', 'アプリを写経する', 'ゲームを写経する', '設定ファイルを書く', 'HTML から CSS へ'];

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
