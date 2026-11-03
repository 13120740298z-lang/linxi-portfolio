(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------------- 作品 ---------------- */
  const works = [
    { no: '01', title: '第三百次日落', medium: ['装置', '亚克力 / LED / 程序'], year: '2025',
      desc: '三百个亚克力盒子，每盒一枚 LED，按上海真实日落时间错开一秒点亮。第 301 天开始，盒子不再熄灭——它们开始记住光。',
      tags: ['材料', '时间', '程序控制'] },
    { no: '02', title: '未通电的夏天', medium: ['单频影像', '11′42″'], year: '2025',
      desc: '一台没有插电的落地扇，一片被风反复吹起的塑料布。整段影像没有电流声，只有布料的呼吸。',
      tags: ['影像', '声音', '缺席'] },
    { no: '03', title: '静电花园', medium: ['交互装置', '静电感应 / 棉布'], year: '2024',
      desc: '观众把手放在布面上，静电吸附起细小的纤维，长成一株只存在几分钟的植物。离开，它就散。',
      tags: ['交互', '触觉', '短暂'] },
    { no: '04', title: '把噪声折叠', medium: ['丝网印', '六色 / 手工套印'], year: '2024',
      desc: '把一段录音转成波形，再把波形折成纸。六次套印的偏移不做修正，误差本身就是图像的一部分。',
      tags: ['平面', '误差', '印刷'] },
    { no: '05', title: '一伏特的安静', medium: ['声音', '接触麦克风 / 单声道'], year: '2024',
      desc: '贴在墙上、水管上、自己的喉咙上，录下电压低到几乎听不见的地方。整理成八段，每段不超过一分钟。',
      tags: ['声音', '身体', '阈值'] },
    { no: '06', title: '夜班电梯', medium: ['书籍', '96 页 / 单色'], year: '2023',
      desc: '一栋宿舍楼的电梯，夜里十二点到凌晨四点。同一部电梯，按一次停一次，书里每一页只放一个按键的编号。',
      tags: ['编辑设计', '排版', '夜晚'] },
    { no: '07', title: '白噪肖像', medium: ['实时交互', '摄像头 / 网格'], year: '2023',
      desc: '摄像头把人的轮廓切成网格，每一格用白噪填满，再慢慢塌回人脸。看得越久，越像自己。',
      tags: ['生成图形', '肖像', '噪点'] }
  ];

  /* ---------------- 履历 ---------------- */
  const honors = [
    { year: '2025', title: '「海上青年艺术季」观察名单', sub: '装置 · 入选', place: '上海' },
    { year: '2025', title: '长三角青年设计联展 · 新锐提名', sub: '视觉传达 · 提名', place: '杭州' },
    { year: '2024', title: 'M50 开放工作室 · 秋季驻地', sub: '驻地创作 · 六周', place: '上海' },
    { year: '2024', title: '「纸上一页」小幅作品展', sub: '评委提名', place: '南京' },
    { year: '2023', title: '校园创作扶持计划', sub: '个人项目 · 入选', place: '上海电力大学' }
  ];

  /* ---------------- 生成图形 ---------------- */
  const art = {
    rings: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="warp"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="26"/></filter></defs>
        <rect width="400" height="500" fill="#FF3B00"/>
        <g filter="url(#warp)" fill="none" stroke="#0A0A0A" stroke-width="3">
          ${Array.from({ length: 18 }, (_, i) => `<circle cx="200" cy="250" r="${18 + i * 11}"/>`).join('')}
        </g>
        <circle cx="200" cy="250" r="9" fill="#0A0A0A"/>
      </svg>`,
    bands: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#0A0A0A"/>
        ${Array.from({ length: 30 }, (_, i) => {
          const h = 500 / 30;
          return `<rect x="0" y="${i * h}" width="${40 + ((i * 53) % 340)}" height="${h - 4}" fill="#E9E4D6" opacity="${0.25 + ((i * 7) % 10) / 14}"/>`;
        }).join('')}
        <rect x="0" y="212" width="400" height="4" fill="#FF3B00"/>
      </svg>`,
    field: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#E9E4D6"/>
        ${Array.from({ length: 300 }, (_, i) => {
          const x = (i % 20) * 20 + 10, y = Math.floor(i / 20) * 30 + 15;
          const d = Math.hypot(x - 200, y - 250) / 260;
          const r = Math.max(1, 7 * (1 - d));
          return `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#0A0A0A" opacity="${(1 - d).toFixed(2)}"/>`;
        }).join('')}
        <rect x="150" y="120" width="100" height="260" fill="#FF3B00" opacity=".22"/>
      </svg>`,
    moire: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#FF3B00"/>
        <g stroke="#0A0A0A" stroke-width="2">
          ${Array.from({ length: 34 }, (_, i) => `<line x1="${-40 + i * 13}" y1="0" x2="${20 + i * 13}" y2="500"/>`).join('')}
          ${Array.from({ length: 34 }, (_, i) => `<line x1="${440 - i * 13}" y1="0" x2="${380 - i * 13}" y2="500"/>`).join('')}
        </g>
      </svg>`,
    wave: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#0A0A0A"/>
        ${Array.from({ length: 44 }, (_, i) => {
          const h = 24 + Math.abs(Math.sin(i * .7) * 130) + ((i * 17) % 40);
          return `<rect x="${8 + i * 9}" y="${250 - h / 2}" width="5" height="${h}" fill="#E9E4D6"/>`;
        }).join('')}
        <rect x="0" y="247" width="400" height="3" fill="#FF3B00"/>
      </svg>`,
    book: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#0A0A0A"/>
        <g stroke="#E9E4D6" stroke-width="1" fill="none">
          ${Array.from({ length: 9 }, (_, i) => `<rect x="${30 + i * 6}" y="${40 - i * 0}" width="300" height="420" opacity="${0.2 + i * 0.08}"/>`).join('')}
        </g>
        <rect x="330" y="0" width="10" height="500" fill="#FF3B00"/>
      </svg>`,
    portrait: `
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" fill="#E9E4D6"/>
        ${Array.from({ length: 18 * 22 }, (_, i) => {
          const c = i % 18, r = Math.floor(i / 18);
          const x = c * 22 + 8, y = r * 22 + 10;
          const inFace = Math.hypot((x - 200) / 110, (y - 240) / 150) < 1;
          return `<rect x="${x}" y="${y}" width="18" height="18" fill="${inFace ? '#0A0A0A' : '#FF3B00'}" opacity="${inFace ? 0.9 : 0.12}"/>`;
        }).join('')}
      </svg>`
  };

  /* ---------------- 渲染作品 ---------------- */
  const list = $('#work-list');
  const preview = $('#preview');
  const previewInner = $('#preview-inner');

  works.forEach((w, i) => {
    const li = document.createElement('li');
    li.className = 'work';
    li.tabIndex = 0;
    li.dataset.art = ['rings', 'bands', 'field', 'moire', 'wave', 'book', 'portrait'][i];
    li.innerHTML = `
      <div class="work-row">
        <span class="work-no">${w.no}</span>
        <h3 class="work-title">${w.title}</h3>
        <span class="work-meta">${w.medium.map(m => `<i>${m}</i>`).join('&nbsp;·&nbsp;')}</span>
        <span class="work-year">${w.year}</span>
      </div>
      <div class="work-more"><div class="work-more-inner"><div class="work-more-body">
        <p class="work-desc">${w.desc}</p>
        <div class="work-tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div></div></div>
    `;
    li.addEventListener('click', () => li.classList.toggle('is-open'));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.classList.toggle('is-open'); }
    });
    list.appendChild(li);
  });

  /* ---------------- 履历 ---------------- */
  const honorBox = $('#honor-list');
  honors.forEach(h => {
    const d = document.createElement('div');
    d.className = 'honor rv';
    d.innerHTML = `
      <span class="honor-year">${h.year}</span>
      <div>
        <div class="honor-main">${h.title}</div>
        <div class="honor-sub">${h.sub}</div>
      </div>
      <span class="honor-place">${h.place}</span>
    `;
    honorBox.appendChild(d);
  });

  /* ---------------- 预览跟随光标 ---------------- */
  let px = 0, py = 0, tx = 0, ty = 0, previewOn = false;

  if (!isTouch) {
    $$('.work').forEach(li => {
      li.addEventListener('mouseenter', () => {
        previewInner.innerHTML = art[li.dataset.art] || '';
        preview.classList.add('on');
        previewOn = true;
      });
      li.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
      li.addEventListener('mouseleave', () => {
        preview.classList.remove('on');
        previewOn = false;
      });
    });
  }

  /* ---------------- 反相透镜 + 光标 ---------------- */
  const lens = $('#lens');
  const cursor = $('#cursor');
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;

  const moveLens = (x, y, r) => {
    lens.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
  };

  if (!reduced) {
    window.addEventListener('pointermove', e => {
      cx = e.clientX; cy = e.clientY;
      moveLens(cx, cy, isTouch ? 78 : 132);
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      cursor.classList.add('on');
    }, { passive: true });

    window.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (!t) return;
      moveLens(t.clientX, t.clientY, 84);
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      if (!t) return;
      moveLens(t.clientX, t.clientY, 84);
    }, { passive: true });

    $$('.work').forEach(li => {
      li.addEventListener('mouseenter', () => cursor.classList.add('is-hot'));
      li.addEventListener('mouseleave', () => cursor.classList.remove('is-hot'));
    });

    const loop = () => {
      px += (tx - px) * 0.14;
      py += (ty - py) * 0.14;
      if (previewOn) preview.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  } else {
    lens.style.display = 'none';
    cursor.style.display = 'none';
  }

  /* ---------------- 首屏字形拆解 + 视差 ---------------- */
  $$('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    [...text].forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = c;
      span.style.transitionDelay = `${i * 90}ms`;
      el.appendChild(span);
    });
  });

  const chars = $$('.hero-name .ch');
  let raf = 0;
  const parallax = () => {
    const y = window.scrollY;
    chars.forEach((c, i) => {
      c.style.transform = `translate3d(0,${(i % 2 ? -1 : 1) * y * 0.06}px,0)`;
    });
    raf = 0;
  };
  if (!reduced) {
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(parallax);
    }, { passive: true });
  }

  /* ---------------- 波形 ---------------- */
  const wa = $('#wave-a'), wb = $('#wave-b');
  let phase = 0;
  const drawWave = () => {
    const pts = [];
    const pts2 = [];
    for (let x = 0; x <= 1200; x += 12) {
      const y = 60 + Math.sin((x / 1200) * Math.PI * 6 + phase) * 26
        + Math.sin((x / 1200) * Math.PI * 17 + phase * 1.7) * 8;
      pts.push(`${x},${y.toFixed(1)}`);
      pts2.push(`${x},${(60 + Math.sin((x / 1200) * Math.PI * 4 - phase * .8) * 38).toFixed(1)}`);
    }
    wa.setAttribute('d', 'M' + pts.join(' L'));
    wb.setAttribute('d', 'M' + pts2.join(' L'));
    phase += 0.02;
  };
  drawWave();
  if (!reduced) setInterval(drawWave, 60);

  /* ---------------- 滚动速度驱动跑马灯 ---------------- */
  const track = $('#marquee-track');
  let lastY = window.scrollY, lastT = performance.now(), vAcc = 0;

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - lastY);
    const dt = Math.max(16, now - lastT);
    vAcc = Math.min(3, (dy / dt) * 2.2);
    lastY = window.scrollY;
    lastT = now;
    if (!reduced) {
      const dur = Math.max(8, 26 - vAcc * 7);
      track.style.setProperty('--dur', dur + 's');
    }
  }, { passive: true });

  /* ---------------- 入场观察 ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  $$('.rv').forEach(el => io.observe(el));
  $$('.sec-head, .statement-body, .contact-mail').forEach(el => {
    el.classList.add('rv');
    io.observe(el);
  });

  /* 首屏字符入场 */
  requestAnimationFrame(() => {
    document.body.classList.add('ready');
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
})();
