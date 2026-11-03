(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const page = document.body.dataset.page || 'home';

  const INK = '#16130E';
  const PAPER = '#F4EFE3';
  const PAPER2 = '#FBF7EC';
  const VOLT = '#D93A1A';

  const rnd = i => {
    const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };

  /* ================= 数据 ================= */
  const works = [
    { no: '01', title: '第三百次日落', medium: ['装置', '亚克力 / LED / 程序'], year: '2025',
      slug: 'work-sunset.html', art: 'rings',
      desc: '三百个亚克力盒子，每盒一枚 LED，按上海真实日落时间错开一秒点亮。第 301 天开始，盒子不再熄灭——它们开始记住光。',
      tags: ['材料', '时间', '程序控制'] },
    { no: '02', title: '未通电的夏天', medium: ['单频影像', '11′42″'], year: '2025',
      art: 'bands',
      desc: '一台没有插电的落地扇，一片被风反复吹起的塑料布。整段影像没有电流声，只有布料的呼吸。',
      tags: ['影像', '声音', '缺席'] },
    { no: '03', title: '静电花园', medium: ['交互装置', '静电感应 / 棉布'], year: '2024',
      slug: 'work-garden.html', art: 'field',
      desc: '观众把手放在布面上，静电吸附起细小的纤维，长成一株只存在几分钟的植物。离开，它就散。',
      tags: ['交互', '触觉', '短暂'] },
    { no: '04', title: '把噪声折叠', medium: ['丝网印', '六色 / 手工套印'], year: '2024',
      slug: 'work-noise.html', art: 'moire',
      desc: '把一段录音转成波形，再把波形折成纸。六次套印的偏移不做修正，误差本身就是图像的一部分。',
      tags: ['平面', '误差', '印刷'] },
    { no: '05', title: '一伏特的安静', medium: ['声音', '接触麦克风 / 单声道'], year: '2024',
      art: 'wave',
      desc: '贴在墙上、水管上、自己的喉咙上，录下电压低到几乎听不见的地方。整理成八段，每段不超过一分钟。',
      tags: ['声音', '身体', '阈值'] },
    { no: '06', title: '夜班电梯', medium: ['书籍', '96 页 / 单色'], year: '2023',
      art: 'book',
      desc: '一栋宿舍楼的电梯，夜里十二点到凌晨四点。同一部电梯，按一次停一次，书里每一页只放一个按键的编号。',
      tags: ['编辑设计', '排版', '夜晚'] },
    { no: '07', title: '白噪肖像', medium: ['实时交互', '摄像头 / 网格'], year: '2023',
      art: 'portrait',
      desc: '摄像头把人的轮廓切成网格，每一格用白噪填满，再慢慢塌回人脸。看得越久，越像自己。',
      tags: ['生成图形', '肖像', '噪点'] }
  ];

  const honors = [
    { year: '2025', title: '「海上青年艺术季」观察名单', sub: '装置 · 入选', place: '上海' },
    { year: '2025', title: '长三角青年设计联展 · 新锐提名', sub: '视觉传达 · 提名', place: '杭州' },
    { year: '2024', title: 'M50 开放工作室 · 秋季驻地', sub: '驻地创作 · 六周', place: '上海' },
    { year: '2024', title: '「纸上一页」小幅作品展', sub: '评委提名', place: '南京' },
    { year: '2023', title: '校园创作扶持计划', sub: '个人项目 · 入选', place: '上海电力大学' }
  ];

  /* ================= 图形 ================= */
  const art = {
    rings: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="warpA"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="24"/></filter></defs>
        <rect width="400" height="500" fill="${PAPER2}"/>
        <g filter="url(#warpA)" fill="none" stroke="${INK}" stroke-width="2.6">
          ${Array.from({ length: 18 }, (_, i) => `<circle cx="200" cy="250" r="${18 + i * 11}"/>`).join('')}
        </g>
        <rect x="330" y="330" width="70" height="70" fill="${VOLT}"/>
        <circle cx="200" cy="250" r="7" fill="${VOLT}"/>
      </svg>`,

    bands: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${VOLT}"/>
        ${Array.from({ length: 30 }, (_, i) => {
          const h = 500 / 30;
          return `<rect x="0" y="${i * h}" width="${40 + ((i * 53) % 340)}" height="${h - 4}" fill="${PAPER2}" opacity="${0.3 + ((i * 7) % 10) / 14}"/>`;
        }).join('')}
        <rect x="0" y="212" width="400" height="5" fill="${INK}"/>
      </svg>`,

    field: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        ${Array.from({ length: 300 }, (_, i) => {
          const x = (i % 20) * 20 + 10, y = Math.floor(i / 20) * 30 + 15;
          const d = Math.hypot(x - 200, y - 250) / 260;
          const r = Math.max(1, 7 * (1 - d));
          return `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${INK}" opacity="${(1 - d).toFixed(2)}"/>`;
        }).join('')}
        <rect x="150" y="120" width="100" height="260" fill="${VOLT}" opacity=".18"/>
      </svg>`,

    moire: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        <g stroke="${INK}" stroke-width="1.6" opacity=".85">
          ${Array.from({ length: 34 }, (_, i) => `<line x1="${-40 + i * 13}" y1="0" x2="${20 + i * 13}" y2="500"/>`).join('')}
          ${Array.from({ length: 34 }, (_, i) => `<line x1="${440 - i * 13}" y1="0" x2="${380 - i * 13}" y2="500"/>`).join('')}
        </g>
        <circle cx="200" cy="250" r="72" fill="none" stroke="${VOLT}" stroke-width="6"/>
      </svg>`,

    wave: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        ${Array.from({ length: 44 }, (_, i) => {
          const h = 24 + Math.abs(Math.sin(i * .7) * 130) + ((i * 17) % 40);
          return `<rect x="${8 + i * 9}" y="${250 - h / 2}" width="5" height="${h}" fill="${INK}"/>`;
        }).join('')}
        <rect x="0" y="247" width="400" height="4" fill="${VOLT}"/>
      </svg>`,

    book: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        <g stroke="${INK}" stroke-width="1" fill="none">
          ${Array.from({ length: 9 }, (_, i) => `<rect x="${28 + i * 7}" y="40" width="300" height="420" opacity="${0.18 + i * 0.07}"/>`).join('')}
        </g>
        <rect x="330" y="0" width="10" height="500" fill="${VOLT}"/>
      </svg>`,

    portrait: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        ${Array.from({ length: 18 * 22 }, (_, i) => {
          const c = i % 18, r = Math.floor(i / 18);
          const x = c * 22 + 8, y = r * 22 + 10;
          const inFace = Math.hypot((x - 200) / 110, (y - 240) / 150) < 1;
          return `<rect x="${x}" y="${y}" width="18" height="18" fill="${inFace ? INK : VOLT}" opacity="${inFace ? 0.9 : 0.09}"/>`;
        }).join('')}
      </svg>`,

    /* ---- 详情：第三百次日落 ---- */
    'sunset-main': (() => {
      const cells = Array.from({ length: 300 }, (_, i) => {
        const c = i % 20, r = Math.floor(i / 20);
        const lit = i > 205 ? rnd(i) > .38 : rnd(i) > .82;
        const x = 18 + c * 18.4, y = 38 + r * 27;
        return `<rect x="${x.toFixed(1)}" y="${y}" width="15" height="21" fill="${lit ? VOLT : INK}" opacity="${lit ? .92 : .09}" stroke="${INK}" stroke-width=".5"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        ${cells}
        <path d="M12 470h376" stroke="${INK}" stroke-width="2"/>
        <text x="18" y="490" font-family="monospace" font-size="10" fill="${INK}" letter-spacing="2">300 / 301 SUNSETS</text>
      </svg>`;
    })(),

    'sunset-p1': (() => {
      const pts = Array.from({ length: 301 }, (_, i) => {
        const x = 20 + i * 1.2;
        const season = Math.sin((i / 300) * Math.PI * 2 - 1.2) * 26;
        const y = 190 + season + Math.sin(i * .9) * 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' L');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        <g stroke="${INK}" stroke-width=".6" opacity=".3">
          <path d="M20 40h360M20 110h360M20 190h360M20 260h360"/>
        </g>
        <path d="M${pts}" fill="none" stroke="${INK}" stroke-width="2"/>
        <path d="M20 190h360" stroke="${VOLT}" stroke-width="3"/>
        <circle cx="380" cy="196" r="4" fill="${VOLT}"/>
        <text x="20" y="282" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">DAY 1 → 301</text>
      </svg>`;
    })(),

    'sunset-p2': (() => {
      const cells = Array.from({ length: 300 }, (_, i) => {
        const c = i % 20, r = Math.floor(i / 20);
        const x = 22 + c * 18, y = 34 + r * 26;
        const missing = rnd(i + 40) < .07;
        return `<rect x="${x}" y="${y}" width="14" height="20" fill="${missing ? 'none' : INK}" opacity="${missing ? 0 : .16}" stroke="${missing ? INK : 'none'}" stroke-width=".8" stroke-dasharray="2 2"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        <g transform="translate(0,6)">${cells}</g>
        <rect x="22" y="250" width="356" height="2" fill="${VOLT}"/>
        <text x="22" y="278" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">LAYOUT · 20 × 15</text>
      </svg>`;
    })(),

    /* ---- 详情：静电花园 ---- */
    'garden-main': (() => {
      const fibers = Array.from({ length: 220 }, (_, i) => {
        const baseX = 60 + rnd(i) * 280;
        const h = 40 + rnd(i + 7) * 190;
        const lean = (rnd(i + 13) - .5) * 60;
        const volt = rnd(i + 21) > .78;
        return `<path d="M${baseX.toFixed(1)} 470 Q${(baseX + lean / 2).toFixed(1)} ${(470 - h / 2).toFixed(1)} ${(baseX + lean).toFixed(1)} ${(470 - h).toFixed(1)}" stroke="${volt ? VOLT : INK}" stroke-width="${(.6 + rnd(i + 31) * 1.4).toFixed(1)}" opacity="${(.25 + rnd(i + 41) * .6).toFixed(2)}" fill="none"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        <ellipse cx="200" cy="470" rx="190" ry="26" fill="${INK}" opacity=".07"/>
        ${fibers}
        <path d="M0 472h400" stroke="${INK}" stroke-width="1.2" opacity=".3"/>
      </svg>`;
    })(),

    'garden-p1': (() => {
      const rays = Array.from({ length: 96 }, (_, i) => {
        const a = (i / 96) * Math.PI * 2;
        const len = 50 + rnd(i) * 120;
        const x = 200 + Math.cos(a) * len, y = 210 + Math.sin(a) * len * .7;
        return `<line x1="200" y1="210" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${rnd(i + 9) > .8 ? VOLT : INK}" stroke-width="1" opacity=".55"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        ${rays}
        <circle cx="200" cy="210" r="7" fill="${VOLT}"/>
        <text x="20" y="284" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">DIRECTION TEST · V11</text>
      </svg>`;
    })(),

    'garden-p2': (() => {
      const pts = Array.from({ length: 60 }, (_, i) => {
        const x = 30 + i * 5.8;
        const y = 70 + Math.sin(i * .35) * 10 + (i > 20 ? (i - 20) * 4.6 : 0) + rnd(i) * 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' L');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        <g stroke="${INK}" stroke-width=".6" opacity=".3"><path d="M30 40v210M30 250h350"/></g>
        <path d="M${pts}" fill="none" stroke="${INK}" stroke-width="2"/>
        <rect x="240" y="40" width="140" height="210" fill="${VOLT}" opacity=".1"/>
        <text x="30" y="280" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">HUMIDITY · %RH</text>
      </svg>`;
    })(),

    /* ---- 详情：把噪声折叠 ---- */
    'noise-main': (() => {
      const curves = Array.from({ length: 6 }, (_, k) => {
        const pts = Array.from({ length: 80 }, (_, i) => {
          const x = 30 + i * 4.3 + k * 2;
          const y = 250 + Math.sin(i * .42 + k * .8) * (40 + k * 6) + Math.sin(i * .11) * 24;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' L');
        return `<path d="M${pts}" fill="none" stroke="${k % 2 ? VOLT : INK}" stroke-width="1.4" opacity="${.85 - k * .1}" transform="translate(${k * 1.6},${-k * 1.4})"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="${PAPER2}"/>
        <rect x="20" y="86" width="360" height="330" fill="none" stroke="${INK}" stroke-width="1.2"/>
        <g transform="translate(0,-20)">${curves}</g>
        <text x="30" y="452" font-family="monospace" font-size="10" fill="${INK}" letter-spacing="2">6 PASSES · OFFSET 2MM</text>
      </svg>`;
    })(),

    'noise-p1': (() => {
      const pts = Array.from({ length: 160 }, (_, i) => {
        const x = 20 + i * 2.25;
        const y = 160 + Math.sin(i * .3) * 30 + Math.sin(i * 1.7) * 9 + rnd(i) * 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' L');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        <path d="M20 160h360" stroke="${INK}" stroke-width=".8" opacity=".3"/>
        <path d="M${pts}" fill="none" stroke="${INK}" stroke-width="1.8"/>
        <text x="20" y="278" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">RAW · 47 SEC</text>
      </svg>`;
    })(),

    'noise-p2': (() => {
      const patches = Array.from({ length: 6 }, (_, k) =>
        `<rect x="${70 + k * 4}" y="${70 + k * 4}" width="250" height="150" fill="${k === 2 ? VOLT : 'none'}" stroke="${k % 2 ? VOLT : INK}" stroke-width="1.4" opacity="${k === 2 ? .18 : .8}"/>`
      ).join('');
      return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${PAPER2}"/>
        ${patches}
        <text x="20" y="278" font-family="monospace" font-size="9" fill="${INK}" letter-spacing="2">REGISTRATION · +2MM</text>
      </svg>`;
    })(),

    /* ---- 关于：肖像 ---- */
    portraitBig: (() => {
      const cells = Array.from({ length: 16 * 19 }, (_, i) => {
        const c = i % 16, r = Math.floor(i / 16);
        const x = c * 22 + 18, y = r * 22 + 24;
        const head = Math.hypot((x - 194) / 68, (y - 168) / 84) < 1;
        const neck = Math.abs(x - 194) < 22 && y >= 235 && y <= 312;
        const body = y > 296 && Math.hypot((x - 194) / 150, (y - 442) / 112) < 1;
        const eye = (Math.abs(x - 172) < 10 && Math.abs(y - 178) < 10) || (Math.abs(x - 216) < 10 && Math.abs(y - 178) < 10);
        const on = (head || neck || body) && !eye;
        return `<rect x="${x}" y="${y}" width="19" height="19" fill="${on ? INK : VOLT}" opacity="${on ? .88 : .07}"/>`;
      }).join('');
      return `<svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="460" fill="${PAPER2}"/>
        ${cells}
        <path d="M20 448h360" stroke="${VOLT}" stroke-width="2"/>
      </svg>`;
    })()
  };

  /* ================= 公共：导航高亮 ================= */
  $$('.nav a').forEach(a => {
    if (a.dataset.nav === page) {
      a.classList.add('is-here');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ================= 生成图形注入 ================= */
  $$('[data-art]').forEach(el => {
    const svg = art[el.dataset.art];
    if (svg) el.innerHTML = svg;
  });

  /* ================= 首页 ================= */
  if (page === 'home') initHero();

  function initHero() {
    const nameEl = $('.hero-name');
    const chars = [];

    $$('[data-split]').forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';
      [...text].forEach((c, i) => {
        const span = document.createElement('span');
        span.className = 'ch';
        span.textContent = c;
        span.style.transitionDelay = `${i * 90}ms`;
        el.appendChild(span);
        if (el === nameEl) chars.push(span);
      });
    });

    const wa = $('#wave-a'), wb = $('#wave-b');
    if (wa && wb) {
      let phase = 0;
      const drawWave = () => {
        const p1 = [], p2 = [];
        for (let x = 0; x <= 1200; x += 12) {
          p1.push(`${x},${(60 + Math.sin((x / 1200) * Math.PI * 6 + phase) * 26 + Math.sin((x / 1200) * Math.PI * 17 + phase * 1.7) * 8).toFixed(1)}`);
          p2.push(`${x},${(60 + Math.sin((x / 1200) * Math.PI * 4 - phase * .8) * 38).toFixed(1)}`);
        }
        wa.setAttribute('d', 'M' + p1.join(' L'));
        wb.setAttribute('d', 'M' + p2.join(' L'));
        phase += 0.02;
      };
      drawWave();
      if (!reduced) setInterval(drawWave, 60);
    }

    if (!reduced) {
      let raf = 0;
      window.addEventListener('scroll', () => {
        if (!raf) raf = requestAnimationFrame(() => {
          const y = window.scrollY;
          chars.forEach((c, i) => {
            c.style.transform = `translate3d(0,${(i % 2 ? -1 : 1) * y * 0.06}px,0)`;
          });
          raf = 0;
        });
      }, { passive: true });
    }

    const track = $('#marquee-track');
    if (track) {
      let lastY = window.scrollY, lastT = performance.now();
      window.addEventListener('scroll', () => {
        const now = performance.now();
        const dy = Math.abs(window.scrollY - lastY);
        const dt = Math.max(16, now - lastT);
        const v = Math.min(3, (dy / dt) * 2.2);
        lastY = window.scrollY;
        lastT = now;
        if (!reduced) track.style.setProperty('--dur', Math.max(8, 26 - v * 7) + 's');
      }, { passive: true });
    }

    requestAnimationFrame(() => {
      document.body.classList.add('ready');
      if (reduced) return;
      chars.forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(40px)';
        setTimeout(() => {
          c.style.transition = 'opacity .8s ease, transform .9s cubic-bezier(.2,.8,.2,1)';
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, 120 + i * 110);
      });
    });
  }

  /* ================= 作品索引 ================= */
  const list = $('#work-list');
  if (list) {
    works.forEach(w => {
      const li = document.createElement('li');
      li.className = 'work rv';
      li.tabIndex = 0;
      li.dataset.art = w.art;
      li.innerHTML = `
        <div class="work-row">
          <span class="work-no">${w.no}</span>
          <h3 class="work-title">${w.title}</h3>
          <span class="work-meta">${w.medium.map(m => `<i>${m}</i>`).join('<br>')}</span>
          <span class="work-year">${w.year}</span>
        </div>
        <div class="work-more"><div class="work-more-inner"><div class="work-more-body">
          <p class="work-desc">${w.desc}</p>
          <div>
            <div class="work-tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</div>
            ${w.slug ? `<a class="work-link" href="${w.slug}">看过程 →</a>` : ''}
          </div>
        </div></div></div>
      `;
      const toggle = () => li.classList.toggle('is-open');
      li.addEventListener('click', e => {
        if (e.target.closest('.work-link')) return;
        toggle();
      });
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
      list.appendChild(li);
    });

    /* 预览跟随 */
    const preview = $('#preview');
    const previewInner = $('#preview-inner');
    if (preview && previewInner && !isTouch && !reduced) {
      let px = 0, py = 0, tx = 0, ty = 0, on = false;
      $$('.work', list).forEach(li => {
        li.addEventListener('mouseenter', () => {
          previewInner.innerHTML = art[li.dataset.art] || '';
          preview.classList.add('on');
          on = true;
        });
        li.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        li.addEventListener('mouseleave', () => {
          preview.classList.remove('on');
          on = false;
        });
      });
      const loop = () => {
        px += (tx - px) * 0.14;
        py += (ty - py) * 0.14;
        if (on) preview.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`;
        requestAnimationFrame(loop);
      };
      loop();
    }
  }

  /* ================= 实验场 ================= */
  if (page === 'play') initPlay();

  function initPlay() {
    initStack();
    initDecode();
    initDots();
    initWaveToy();
    initEgg();
  }

  /* --- 01 卡片堆 --- */
  function initStack() {
    const stack = $('#stack');
    if (!stack) return;
    const cards = $$('.card', stack);
    const tip = $('#stack-tip');
    const reset = $('#stack-reset');
    const rots = cards.map(c => parseFloat(c.dataset.rot) || 0);

    const place = (c, i) => {
      c.style.transform = `translate(0,0) rotate(${rots[i]}deg)`;
      c.style.zIndex = String(cards.length - i);
    };
    const updateTip = () => {
      const left = cards.filter(c => !c.classList.contains('gone')).length;
      if (tip) tip.textContent = left ? `还剩 ${left} 层 · 继续往外拖` : '见底了 · 点「再来一次」';
    };
    const resetAll = () => {
      cards.forEach((c, i) => {
        c.classList.remove('gone', 'dragging');
        place(c, i);
      });
      updateTip();
    };

    cards.forEach((c, idx) => {
      place(c, idx);
      let drag = null;
      c.addEventListener('pointerdown', e => {
        if (c.classList.contains('gone')) return;
        e.preventDefault();
        drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
        c.classList.add('dragging');
        try { c.setPointerCapture(e.pointerId); } catch (_) {}
      });
      c.addEventListener('pointermove', e => {
        if (!drag) return;
        drag.dx = e.clientX - drag.x;
        drag.dy = e.clientY - drag.y;
        c.style.transform = `translate(${drag.dx}px,${drag.dy}px) rotate(${rots[idx] + drag.dx * 0.05}deg)`;
      });
      const finish = () => {
        if (!drag) return;
        const { dx, dy } = drag;
        drag = null;
        c.classList.remove('dragging');
        if (Math.hypot(dx, dy) > 58) {
          const len = Math.hypot(dx, dy) || 1;
          c.style.transform = `translate(${(dx / len) * 280}px,${(dy / len) * 280}px) rotate(${rots[idx] + dx * 0.08}deg)`;
          c.classList.add('gone');
          const rest = cards.filter(x => !x.classList.contains('gone'));
          rest.forEach((x, i) => { x.style.zIndex = String(20 - i); });
          updateTip();
        } else {
          place(c, idx);
        }
      };
      c.addEventListener('pointerup', finish);
      c.addEventListener('pointercancel', finish);
    });

    if (reset) reset.addEventListener('click', resetAll);
    updateTip();
  }

  /* --- 02 解码 --- */
  function initDecode() {
    const el = $('#decode');
    if (!el) return;
    const GLYPH = '▓▒░#%&@¥*=+/<>';
    const raw = el.textContent.trim();
    const reset = $('#decode-reset');

    const build = () => {
      el.textContent = '';
      [...raw].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'dec-char';
        const isSpace = /\s/.test(ch);
        span.dataset.real = ch;
        span.dataset.on = '0';
        span.textContent = isSpace ? ch : GLYPH[Math.floor(Math.random() * GLYPH.length)];
        el.appendChild(span);
      });
    };

    const reveal = c => {
      if (!c || c.dataset.on === '1') return;
      c.dataset.on = '1';
      c.textContent = c.dataset.real;
      c.classList.add('on');
      setTimeout(() => c.classList.remove('on'), 420);
    };

    const decodeAt = (x, y) => {
      $$('.dec-char', el).forEach(c => {
        if (c.dataset.on === '1') return;
        const r = c.getBoundingClientRect();
        if (x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 12 && y <= r.bottom + 12) reveal(c);
      });
    };

    el.addEventListener('pointermove', e => decodeAt(e.clientX, e.clientY));
    el.addEventListener('pointerdown', e => decodeAt(e.clientX, e.clientY));
    el.addEventListener('touchmove', e => {
      const t = e.touches[0];
      if (t) decodeAt(t.clientX, t.clientY);
    }, { passive: true });

    if (reset) reset.addEventListener('click', build);
    build();
  }

  /* --- 03 网点 --- */
  function initDots() {
    const cv = $('#dots');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const read = $('#dots-read');
    const reset = $('#dots-reset');
    let px = .5, py = .5;
    let W = 0, H = 0, DPR = 1, pending = false;

    const fit = () => {
      W = cv.clientWidth;
      H = window.innerWidth < 820 ? 192 : 228;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      cv.style.height = H + 'px';
      draw();
    };

    const draw = () => {
      pending = false;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = PAPER2;
      ctx.fillRect(0, 0, W, H);

      const angle = px * Math.PI;
      const spacing = 24 - py * 15;
      const cx = W / 2, cy = H / 2;
      const tx = px * W, ty = py * H;
      const ext = Math.hypot(W, H) / 2 + 24;

      ctx.fillStyle = INK;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      for (let gx = -ext; gx <= ext; gx += spacing) {
        for (let gy = -ext; gy <= ext; gy += spacing) {
          const wx = cx + gx * Math.cos(angle) - gy * Math.sin(angle);
          const wy = cy + gx * Math.sin(angle) + gy * Math.cos(angle);
          if (wx < -8 || wx > W + 8 || wy < -8 || wy > H + 8) continue;
          const d = Math.hypot(wx - tx, wy - ty);
          const r = Math.max(0.7, 5.4 * Math.exp(-d / 95));
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.restore();

      ctx.strokeStyle = VOLT;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(tx, ty, 17, 0, 6.2832);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx - 25, ty); ctx.lineTo(tx + 25, ty);
      ctx.moveTo(tx, ty - 25); ctx.lineTo(tx, ty + 25);
      ctx.stroke();

      if (read) {
        read.textContent = `密度 ${spacing.toFixed(0)} px · 角度 ${(angle * 180 / Math.PI).toFixed(0)}°`;
      }
    };

    const queue = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(draw);
    };

    const setFromEvent = e => {
      const r = cv.getBoundingClientRect();
      px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      queue();
    };

    cv.addEventListener('pointermove', setFromEvent);
    cv.addEventListener('pointerdown', setFromEvent);
    cv.addEventListener('touchmove', setFromEvent, { passive: true });

    if (reset) reset.addEventListener('click', () => { px = .5; py = .5; queue(); });
    window.addEventListener('resize', fit);
    fit();
  }

  /* --- 04 波形 --- */
  function initWaveToy() {
    const cv = $('#wave');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const freq = $('#w-freq'), amp = $('#w-amp'), speed = $('#w-speed');
    const freqV = $('#w-freq-v'), ampV = $('#w-amp-v'), speedV = $('#w-speed-v');
    const pauseBtn = $('#wave-pause');
    let W = 0, H = 0, DPR = 1, phase = 0, paused = false, raf = 0;

    const fit = () => {
      W = cv.clientWidth;
      H = window.innerWidth < 820 ? 154 : 176;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      cv.style.height = H + 'px';
      draw();
    };

    const vals = () => ({
      f: parseFloat(freq.value),
      a: parseFloat(amp.value),
      s: parseFloat(speed.value)
    });

    const draw = () => {
      const { f, a } = vals();
      const s = parseFloat(speed.value);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = PAPER2;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = INK;
      ctx.globalAlpha = .25;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const wave = (phaseShift, stroke, width, mul) => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const u = x / W;
          const y = H / 2 + Math.sin(u * Math.PI * 2 * f + phase + phaseShift) * a * mul
            + Math.sin(u * Math.PI * 5 * f + phase * 1.6) * a * .18;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
      };

      wave(0, INK, 2, 1);
      wave(1.9, VOLT, 1.6, .62);
      wave(-1.2, INK, 1, .38);

      if (freqV) freqV.textContent = f.toFixed(1);
      if (ampV) ampV.textContent = a.toFixed(0);
      if (speedV) speedV.textContent = s.toFixed(2);
    };

    const loop = () => {
      const s = parseFloat(speed.value);
      if (!paused && !reduced && s > 0) {
        phase += s * 0.028;
        draw();
      } else if (!paused && reduced) {
        draw();
        paused = true;
      }
      raf = requestAnimationFrame(loop);
    };

    [freq, amp, speed].forEach(el => {
      if (el) el.addEventListener('input', draw);
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? '继续' : '暂停';
        draw();
      });
    }

    window.addEventListener('resize', fit);
    fit();
    if (!reduced) raf = requestAnimationFrame(loop);
  }

  /* --- 彩蛋 --- */
  function initEgg() {
    const btn = $('#egg-btn');
    const out = $('#egg-out');
    if (!btn || !out) return;
    let timer = 0;

    const fire = () => {
      out.textContent = '灯亮了一下，又灭了。你找到了。';
      btn.classList.add('holding');
      setTimeout(() => btn.classList.remove('holding'), 260);
    };

    const start = () => {
      clearTimeout(timer);
      timer = setTimeout(fire, 1500);
    };
    const stop = () => clearTimeout(timer);

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointercancel', stop);

    let hits = 0, last = 0;
    window.addEventListener('keydown', e => {
      if (e.key !== 'l' && e.key !== 'L') return;
      const now = Date.now();
      if (now - last > 1500) hits = 0;
      last = now;
      hits++;
      if (hits >= 3) {
        hits = 0;
        out.textContent = 'L 按下三次。这行字本来不该出现。';
      }
    });
  }

  /* ================= 公共：透镜 + 光标 ================= */
  const lens = $('#lens');
  const cursor = $('#cursor');
  if (!reduced && lens) {
    const moveLens = (x, y, r) => {
      lens.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
    };
    const radius = () => (isTouch ? 72 : 108);

    window.addEventListener('pointermove', e => {
      moveLens(e.clientX, e.clientY, radius());
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        cursor.classList.add('on');
      }
    }, { passive: true });

    window.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (t) moveLens(t.clientX, t.clientY, 84);
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      if (t) moveLens(t.clientX, t.clientY, 84);
    }, { passive: true });

    $$('.work, .toy, .card, .contact-mail').forEach(el => {
      el.addEventListener('mouseenter', () => cursor && cursor.classList.add('is-hot'));
      el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('is-hot'));
    });
  }

  /* ================= 公共：入场 ================= */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  $$('.rv, .page-head, .detail-hero, .detail-note, .about-grid, .contact-grid, .statement-body').forEach(el => {
    if (!el.classList.contains('rv')) el.classList.add('rv');
    io.observe(el);
  });
})();
