// docker-compose.yml を読んで構成図にする。
//
// Docker は動かせない。だが「打っても何も見えない」のはこの入れ物の看板に反する。
// そこで打った内容を解釈して、何が立って何に繋がるのかを絵にする。
// 打つそばからサービスの箱が増え、depends_on を書いた瞬間に矢印が引かれる。
//
// YAML の全部は読まない。この題材に要る範囲だけ。

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const unquote = (s) => s.replace(/^["']|["']$/g, '');

/** 字下げで入れ子を決める、ごく小さな読み取り */
function parseYaml(src) {
  const root = {};
  const stack = [{ indent: -1, node: root }];

  for (const raw of src.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    const body = line.trim();
    if (!body || body.startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].node;

    if (body.startsWith('- ')) {
      if (!parent.__list) parent.__list = [];
      parent.__list.push(unquote(body.slice(2).trim()));
      continue;
    }

    const at = body.indexOf(':');
    if (at === -1) continue;

    const key = body.slice(0, at).trim();
    const value = body.slice(at + 1).trim();

    if (value) {
      parent[key] = unquote(value);
    } else {
      const node = {};
      parent[key] = node;
      stack.push({ indent, node });
    }
  }
  return root;
}

const listOf = (v) => (v && Array.isArray(v.__list) ? v.__list : []);
const pairsOf = (v) =>
  v && typeof v === 'object'
    ? Object.entries(v).filter(([k]) => k !== '__list').map(([k, x]) => `${k}=${x}`)
    : [];

function chips(label, items) {
  if (!items.length) return '';
  return (
    `<div class="row"><span class="tag">${esc(label)}</span>` +
    items.map((v) => `<code>${esc(v)}</code>`).join('') +
    `</div>`
  );
}

export function renderCompose(src) {
  const doc = parseYaml(src);
  const services = doc.services && typeof doc.services === 'object' ? doc.services : {};
  const names = Object.keys(services).filter((k) => k !== '__list');

  if (!names.length) {
    return '<p class="empty">services: を書くと、ここに立ち上がる構成が出ます</p>';
  }

  const boxes = names
    .map((name) => {
      const s = services[name] || {};
      const deps = listOf(s.depends_on);
      const arrows = deps.length
        ? `<div class="deps">${deps
            .map((d) => `<span class="arrow">${esc(name)} <i>&rarr;</i> ${esc(d)}</span>`)
            .join('')}</div>`
        : '';

      return (
        `<article class="svc">` +
        `<header><b>${esc(name)}</b>` +
        (s.image ? `<span class="img">${esc(s.image)}</span>` : '') +
        (s.build ? `<span class="img">build: ${esc(s.build)}</span>` : '') +
        `</header>` +
        chips('ports', listOf(s.ports)) +
        chips('env', pairsOf(s.environment).concat(listOf(s.environment))) +
        chips('volumes', listOf(s.volumes)) +
        arrows +
        `</article>`
      );
    })
    .join('');

  const vols = Object.keys(doc.volumes || {}).filter((k) => k !== '__list');
  const volBox = vols.length
    ? `<div class="named"><span class="tag">volumes</span>${vols
        .map((v) => `<code>${esc(v)}</code>`)
        .join('')}</div>`
    : '';

  return `<div class="stack">${boxes}</div>${volBox}`;
}

export const COMPOSE_STYLES = `
.stack { display: grid; gap: 12px; }
.svc { background: #fff; border: 1px solid #dbe1ea; border-left: 4px solid #2563eb;
  border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 3px rgba(16,24,40,.08); }
.svc header { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.svc b { font-size: 16px; color: #0f172a; }
.img { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #475569;
  background: #f1f5f9; padding: 2px 7px; border-radius: 5px; }
.row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.tag { font-size: 10px; letter-spacing: .08em; color: #94a3b8; min-width: 52px; }
code { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #1e293b;
  background: #eef2f7; padding: 2px 7px; border-radius: 5px; }
.deps { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px;
  padding-top: 9px; border-top: 1px dashed #e2e8f0; }
.arrow { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #b45309;
  background: #fffbeb; padding: 2px 8px; border-radius: 5px; }
.arrow i { color: #f59e0b; font-style: normal; }
.named { display: flex; align-items: center; gap: 6px; margin-top: 12px; }
.empty { color: #94a3b8; font-size: 13px; }
`;
