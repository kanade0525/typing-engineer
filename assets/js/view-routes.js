// config/routes.rb を読んで `rails routes` の表にする。
//
// Rails は動かせない。だが打った一行が何本の道になるのかは示せる。
// resources :posts と書いた瞬間に七行が現れる。あれを見せたい。
//
// Ruby の全部は読まない。ルーティングに出てくる書き方だけ。

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const single = (s) => (s.endsWith('ies') ? s.slice(0, -3) + 'y' : s.replace(/s$/, ''));
const plural = (s) => (s.endsWith('y') ? s.slice(0, -1) + 'ies' : s + 's');

/** resources が生む七本。Rails が出すものと同じ並びにしてある */
function seven(name, parent) {
  const base = parent ? `/${parent}/:${single(parent)}_id/${name}` : `/${name}`;
  const pre = parent ? `${single(parent)}_` : '';
  const one = single(name);
  return [
    ['GET', base, `${name}#index`, `${pre}${name}`],
    ['POST', base, `${name}#create`, `${pre}${name}`],
    ['GET', `${base}/new`, `${name}#new`, `new_${pre}${one}`],
    ['GET', `${base}/:id/edit`, `${name}#edit`, `edit_${pre}${one}`],
    ['GET', `${base}/:id`, `${name}#show`, `${pre}${one}`],
    ['PATCH', `${base}/:id`, `${name}#update`, `${pre}${one}`],
    ['DELETE', `${base}/:id`, `${name}#destroy`, `${pre}${one}`],
  ];
}

/** resource（単数）が生む六本。index が無く、:id も付かない */
function sixSingular(name) {
  const c = plural(name);
  return [
    ['GET', `/${name}/new`, `${c}#new`, `new_${name}`],
    ['POST', `/${name}`, `${c}#create`, name],
    ['GET', `/${name}`, `${c}#show`, name],
    ['GET', `/${name}/edit`, `${c}#edit`, `edit_${name}`],
    ['PATCH', `/${name}`, `${c}#update`, name],
    ['DELETE', `/${name}`, `${c}#destroy`, name],
  ];
}

const ACTION_OF = {
  index: 'index',
  create: 'create',
  new: 'new',
  edit: 'edit',
  show: 'show',
  update: 'update',
  destroy: 'destroy',
};

export function parseRoutes(src) {
  const rows = [];
  let parent = null;

  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    if (line === 'end') {
      parent = null;
      continue;
    }

    // get "/legacy", to: redirect("/about")
    let m = line.match(
      /^(get|post|patch|put|delete)\s+["']([^"']+)["']\s*,\s*to:\s*redirect\(\s*["']([^"']+)["']/
    );
    if (m) {
      const path = m[2].startsWith('/') ? m[2] : `/${m[2]}`;
      rows.push([m[1].toUpperCase(), path, `redirect(${m[3]})`, path.slice(1).replace(/\//g, '_')]);
      continue;
    }

    // root "home#index" / root to: "home#index"
    m = line.match(/^root\s+(?:to:\s*)?["']([^"']+)["']/);
    if (m) {
      rows.push(['GET', '/', m[1], 'root']);
      continue;
    }

    // get "/about", to: "pages#about", as: :about
    m = line.match(/^(get|post|patch|put|delete)\s+["']([^"']+)["']\s*,\s*to:\s*["']([^"']+)["']/);
    if (m) {
      const path = m[2].startsWith('/') ? m[2] : `/${m[2]}`;
      const as = line.match(/as:\s*:([a-z_]+)/);
      rows.push([m[1].toUpperCase(), path, m[3], as ? as[1] : path.slice(1).replace(/\//g, '_')]);
      continue;
    }

    // resources :posts（複数）/ resource :session（単数）
    m = line.match(/^(resources?)\s+:([a-z_]+)/);
    if (m) {
      const name = m[2];
      let list = m[1] === 'resource' ? sixSingular(name) : seven(name, parent);

      const only = line.match(/only:\s*\[([^\]]*)\]/);
      const except = line.match(/except:\s*\[([^\]]*)\]/);
      const picked = (s) => s.split(',').map((v) => v.trim().replace(/^:/, '')).filter(Boolean);

      if (only) {
        const keep = new Set(picked(only[1]).map((a) => ACTION_OF[a]).filter(Boolean));
        list = list.filter((r) => keep.has(r[2].split('#')[1]));
      }
      if (except) {
        const drop = new Set(picked(except[1]).map((a) => ACTION_OF[a]).filter(Boolean));
        list = list.filter((r) => !drop.has(r[2].split('#')[1]));
      }

      rows.push(...list);
      if (m[1] === 'resources' && /\bdo\b\s*$/.test(line)) parent = name;
      continue;
    }
  }
  return rows;
}

export function renderRoutes(src) {
  const rows = parseRoutes(src);
  if (!rows.length) {
    return '<p class="empty">道を一本書くと、ここに rails routes と同じ表が出ます</p>';
  }

  const body = rows
    .map(
      ([verb, path, to, name]) =>
        `<tr><td class="v v-${verb.toLowerCase()}">${esc(verb)}</td>` +
        `<td class="p">${esc(path)}</td>` +
        `<td class="t">${esc(to)}</td>` +
        `<td class="n">${esc(name)}</td></tr>`
    )
    .join('');

  return (
    `<p class="count">${rows.length} routes</p>` +
    `<table><thead><tr><th>Verb</th><th>Path</th><th>Controller#Action</th><th>Prefix</th></tr></thead>` +
    `<tbody>${body}</tbody></table>`
  );
}

export const ROUTES_STYLES = `
.count { margin: 0 0 10px; font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #64748b; }
table { width: 100%; border-collapse: collapse; font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
th { text-align: left; padding: 0 8px 8px; font-weight: 400; font-size: 10px;
  letter-spacing: .08em; color: #94a3b8; border-bottom: 1px solid #e2e8f0; }
td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; white-space: nowrap; }
.v { font-weight: 700; font-size: 11px; }
.v-get { color: #15803d; }
.v-post { color: #1d4ed8; }
.v-patch, .v-put { color: #b45309; }
.v-delete { color: #b91c1c; }
.p { color: #0f172a; }
.t { color: #7c3aed; }
.n { color: #94a3b8; }
.empty { color: #94a3b8; font-size: 13px; }
`;
