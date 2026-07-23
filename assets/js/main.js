// Dr. Shaiful Islam — site interactions
document.addEventListener('DOMContentLoaded', () => {

  /* Custom magnetic cursor */
  (function initCursor(){
    if (window.matchMedia('(hover:none)').matches || window.innerWidth < 780) return;
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.className = 'cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let ringX = mouseX, ringY = mouseY;
    let magnetTarget = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (window.gsap) {
        gsap.to(dot, {x: mouseX, y: mouseY, duration:.08, ease:'power2.out'});
      } else {
        dot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
      }
    });

    function loop(){
      const targetX = magnetTarget ? magnetTarget.mx : mouseX;
      const targetY = magnetTarget ? magnetTarget.my : mouseY;
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    const magnetic = 'a, button, .btn, .exp-card, .g-item, .v-card, .proc-tile, .chamber-card, input, select, textarea';
    document.querySelectorAll(magnetic).forEach(el => {
      const isImage = el.classList.contains('g-item') || el.tagName === 'IMG';
      const isText = el.tagName === 'A' || el.tagName === 'BUTTON';

      el.addEventListener('mouseenter', () => {
        ring.classList.add(isImage ? 'image' : (isText ? 'link' : 'hover'));
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('image','link','hover');
        magnetTarget = null;
      });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const pull = (el.classList.contains('btn') || el.tagName === 'BUTTON') ? 0.35 : 0.15;
        magnetTarget = { mx: cx + (mouseX - cx) * (1-pull) * -1 + (mouseX-cx)*pull + cx*0, my: cy + (mouseY-cy)*pull + cy*0 };
        // simplified magnetic pull toward pointer biased by center
        magnetTarget = { mx: mouseX * (1-pull) + cx * pull, my: mouseY * (1-pull) + cy * pull };
      });
    });

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));
    document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
  })();

  /* Loader */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 500);
  });
  setTimeout(() => loader && loader.classList.add('hide'), 2200);

  /* Navbar solid on scroll */
  const nav = document.querySelector('header.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
    const backTop = document.querySelector('.back-top');
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* Hamburger */
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      burger.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
    }));
  }

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* Counters */
  const counters = document.querySelectorAll('[data-count]');
  const cIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
      cIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cIo.observe(el));

  /* Testimonial auto-scroll (simple) */
  const track = document.querySelector('.testi-track');

  /* Appointment form (demo only, no backend) */
  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      apptForm.style.display = 'none';
      document.querySelector('.form-success').classList.add('show');
    });
  }

  /* Contact form (demo only) */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      document.querySelector('.contact-success')?.classList.add('show');
    });
  }

  /* Gallery lightbox */
  document.querySelectorAll('.g-item img').forEach(img => {
    img.addEventListener('click', () => {
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;inset:0;background:rgba(7,59,80,.92);z-index:5000;display:flex;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;';
      const big = document.createElement('img');
      big.src = img.src;
      big.style.cssText = 'max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,.5);';
      box.appendChild(big);
      box.addEventListener('click', () => box.remove());
      document.body.appendChild(box);
    });
  });

  /* Expertise card expand */
  document.querySelectorAll('.exp-card .more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.exp-card');
      const extra = card.querySelector('.exp-extra');
      if (extra) extra.style.display = extra.style.display === 'block' ? 'none' : 'block';
    });
  });

  /* Active nav link by page */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

});
