
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
$('#yr').textContent = new Date().getFullYear();

const root = document.documentElement;
try {
  const t = localStorage.getItem('theme');
  if (t) root.dataset.theme = t;
} catch (e) {}

$('#themeBtn').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

$('#menuBtn').addEventListener('click', () =>
  $('#links').classList.toggle('open')
);

$$('#links a').forEach(a =>
  a.addEventListener('click', () =>
    $('#links').classList.remove('open')
  )
);

// Header, back-to-top, scroll spy
const header = $('header');
const toTop = $('#toTop');
const sections = $$('main section[id]');

function onScroll() {
  header.classList.toggle('scrolled', scrollY > 20);
  toTop.classList.toggle('show', scrollY > 600);

  let current = '';

  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 140) current = s.id;
  });

  $$('#links a').forEach(a =>
    a.classList.toggle(
      'active',
      a.getAttribute('href') === '#' + current
    )
  );
}

addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () =>
  scrollTo({ top: 0, behavior: 'smooth' })
);

// Typing effect
const roles = [
  'Computer Science Student',
  'Python & C Programmer',
  'Aspiring Software Developer'
];

const typed = $('#typed');
let ri = 0, ci = 0, del = false;

(function tick() {
  const word = roles[ri];
  typed.textContent = word.slice(0, ci);

  if (!del && ci === word.length) {
    del = true;
    return setTimeout(tick, 1600);
  }

  if (del && ci === 0) {
    del = false;
    ri = (ri + 1) % roles.length;
  }

  ci += del ? -1 : 1;
  setTimeout(tick, del ? 38 : 75);
})();

// Reveal, skill bars, counters
function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 30));

  const t = setInterval(() => {
    n = Math.min(target, n + step);
    el.textContent = n + (target > 4 ? '+' : '');
    if (n >= target) clearInterval(t);
  }, 35);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    e.target.classList.add('show');

    $$('.bar i', e.target).forEach(b =>
      b.style.width = b.dataset.w + '%'
    );

    io.unobserve(e.target);
  });
}, { threshold: .15 });

$$('.reveal').forEach(el => io.observe(el));

const io2 = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      io2.unobserve(e.target);
    }
  });
}, { threshold: .6 });

$$('[data-count]').forEach(el => io2.observe(el));

// Contact form opens the visitor's email app
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();

  const name = $('#n').value.trim();
  const from = $('#e').value.trim();
  const msg = $('#m').value.trim();

  const subject = encodeURIComponent(
    'Portfolio enquiry from ' + name
  );

  const body = encodeURIComponent(
    msg + '\n\n' + name + '\n' + from
  );

  location.href =
    'mailto:sriramakrishnan9486@gmail.com?subject=' +
    subject + '&body=' + body;
});