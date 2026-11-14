// SealBox sitesi: menü, dil düğmesi, kopyalama, yazılan terminal, video, kaydırma takibi.
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EN = document.documentElement.lang === "en";
  const T = EN
    ? { copy: "Copy", copied: "Copied" }
    : { copy: "Kopyala", copied: "Kopyalandı" };

  // Dil düğmesi: diğer dile geçerken sayfadaki yeri (#bölüm) koru
  document.querySelectorAll("a.lang").forEach((a) => {
    a.addEventListener("click", () => {
      if (location.hash) a.href = a.getAttribute("href").split("#")[0] + location.hash;
    });
  });

  // Kaydırınca menünün arka planı koyulaşsın
  const nav = document.querySelector(".nav");
  if (nav && !nav.classList.contains("always-solid")) {
    const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobil menü
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) navLinks.classList.remove("open");
    });
  }

  // Dokümantasyon kenar menüsü (mobil)
  const sideToggle = document.querySelector(".side-toggle");
  const sidebar = document.querySelector(".sidebar");
  if (sideToggle && sidebar) {
    sideToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a")) sidebar.classList.remove("open");
    });
  }

  // Kopyala düğmeleri: data-copy varsa onu, yoksa yanındaki <pre> içindeki komutları kopyalar
  const copyIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  document.querySelectorAll(".codeblock").forEach((block) => {
    if (block.querySelector(".copy")) return;
    const btn = document.createElement("button");
    btn.className = "copy";
    btn.type = "button";
    btn.innerHTML = copyIcon + T.copy;
    block.appendChild(btn);
  });
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy");
    if (!btn) return;
    let text = btn.dataset.copy;
    if (!text) {
      const pre = btn.parentElement.querySelector("pre");
      // Yorumları ve istem işaretini at, yalnızca komutları kopyala
      text = pre.innerText
        .split("\n")
        .map((l) => l.replace(/^\s*[$>]\s?/, "").replace(/\s+#\s.*$/, "").trimEnd())
        .filter((l) => l && !l.trim().startsWith("#"))
        .join("\n");
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const old = btn.innerHTML;
    btn.classList.add("done");
    btn.innerHTML = copyIcon + T.copied;
    setTimeout(() => {
      btn.classList.remove("done");
      btn.innerHTML = old;
    }, 1600);
  });

  // Belirerek gelme
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Hero: klavyeden yazılıyormuş gibi terminal
  const termBody = document.getElementById("typed");
  if (termBody) {
    const sealOut = EN
      ? [
          '<span class="o">.env → .env.sealed: </span><span class="ok">1 value(s) moved to the vault</span><span class="o"> (DB_PASSWORD)</span>',
          '<span class="o">src/config.py: </span><span class="ok">3 secrets → os.environ[...]</span>',
          '<span class="ok">✓ No exposed secrets left on disk.</span>',
          '<span class="wn">⏵ Approval window: 4 values to hand over…</span>',
        ]
      : [
          '<span class="o">.env → .env.sealed: </span><span class="ok">1 değer kasaya taşındı</span><span class="o"> (DB_PASSWORD)</span>',
          '<span class="o">src/config.py: </span><span class="ok">3 sır → os.environ[...]</span>',
          '<span class="ok">✓ Diskte açık sır kalmadı.</span>',
          '<span class="wn">⏵ Onay penceresi: 4 değer verilecek…</span>',
        ];
    const script = [
      { cmd: "pip install sealbox" },
      { out: '<span class="o">Collecting sealbox</span>', wait: 450 },
      { out: '<span class="ok">Successfully installed sealbox-0.3.0</span>', wait: 600 },
      { cmd: "sealbox seal" },
      { out: sealOut[0], wait: 450 },
      { out: sealOut[1], wait: 300 },
      { out: sealOut[2], wait: 700 },
      { cmd: "sealbox exec -- python app.py" },
      { out: sealOut[3], wait: 0 },
    ];

    const prompt = '<span class="p">$ </span>';
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

    const render = (lines, current) =>
      (termBody.innerHTML = lines.join("\n") + (current !== undefined ? (lines.length ? "\n" : "") + current : "") + '<span class="cursor"></span>');

    async function play() {
      const lines = [];
      await sleep(700);
      for (const step of script) {
        if (step.cmd) {
          let typed = "";
          render(lines, prompt);
          await sleep(500);
          for (const ch of step.cmd) {
            typed += ch;
            render(lines, prompt + esc(typed));
            // İnsan gibi düzensiz hız
            await sleep(45 + Math.random() * 75 + (ch === " " ? 60 : 0));
          }
          await sleep(380);
          lines.push(prompt + esc(step.cmd));
          render(lines);
        } else {
          await sleep(step.wait || 300);
          lines.push(step.out);
          render(lines);
        }
      }
      await sleep(500);
      render(lines, prompt);
    }
    play();
  }

  // Hero videosu: her zaman oynasın. Tarayıcı otomatik başlatmayı engellerse
  // ilk tıklama/kaydırma/tuşta yeniden dene.
  const video = document.querySelector(".hero-video");
  if (video) {
    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    video.addEventListener("canplay", tryPlay, { once: true });
    const kickEvents = ["pointerdown", "keydown", "scroll", "touchstart"];
    const kick = () => {
      if (video.paused) tryPlay();
      kickEvents.forEach((ev) => window.removeEventListener(ev, kick));
    };
    kickEvents.forEach((ev) => window.addEventListener(ev, kick, { passive: true }));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && video.paused) tryPlay();
    });
  }

  // Doküman sayfaları: görünen bölümü kenar menüde işaretle
  const spyLinks = document.querySelectorAll(".sidebar a[href^='#'], .toc a[href^='#']");
  if (spyLinks.length && "IntersectionObserver" in window) {
    const targets = new Map();
    spyLinks.forEach((a) => {
      const el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) {
        if (!targets.has(el)) targets.set(el, []);
        targets.get(el).push(a);
      }
    });
    const visible = new Set();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
        if (!visible.size) return;
        // İç içe bölümlerde en son başlayanı (en içtekini) seç
        const top = [...visible].sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
        spyLinks.forEach((a) => a.classList.remove("active"));
        (targets.get(top) || []).forEach((a) => a.classList.add("active"));
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    targets.forEach((_, el) => spy.observe(el));
  }
})();
