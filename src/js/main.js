import '../css/style.css';
import { initContent } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initContent();

  const currentPage = document.body.dataset.page || 'home';
  const isHomePage = currentPage === 'home';
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  const handleNavScroll = () => {
    if (!navbar) return;

    if (!isHomePage || window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.style.top = '0';
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const normalizePath = (value) => {
    const url = new URL(value, window.location.origin);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    return pathname.replace(/\/+$/, '') || '/index.html';
  };

  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.classList.contains('nav-cta')) {
      return;
    }

    link.classList.toggle('active', normalizePath(href) === currentPath);
  });

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 1500;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, stepTime);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    });
  });

  const heroVisual = document.querySelector('.hero-bg img') || document.querySelector('.hero-video');
  if (isHomePage && heroVisual) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        const parallax = window.scrollY * 0.3;
        heroVisual.style.transform = `scale(1.05) translateY(${parallax}px) translateZ(0)`;
      }
    }, { passive: true });
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-overlay span')?.textContent || '';
      if (!img) return;

      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.9); display: flex;
        align-items: center; justify-content: center;
        flex-direction: column; gap: 16px;
        opacity: 0; transition: opacity 0.3s ease;
        cursor: pointer; padding: 40px;
      `;

      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 90%; max-height: 80vh;
        object-fit: contain; border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        transform: scale(0.9); transition: transform 0.3s ease;
      `;

      const lightboxLabel = document.createElement('p');
      lightboxLabel.textContent = label;
      lightboxLabel.style.cssText = `
        color: white; font-size: 1rem; font-weight: 500;
        opacity: 0.8;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        position: absolute; top: 20px; right: 30px;
        background: none; border: none; color: white;
        font-size: 1.5rem; cursor: pointer; opacity: 0.7;
        transition: opacity 0.3s;
      `;
      closeBtn.onmouseover = () => { closeBtn.style.opacity = '1'; };
      closeBtn.onmouseout = () => { closeBtn.style.opacity = '0.7'; };

      lightbox.appendChild(closeBtn);
      lightbox.appendChild(lightboxImg);
      lightbox.appendChild(lightboxLabel);
      document.body.appendChild(lightbox);

      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });

      const closeLightbox = () => {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        setTimeout(() => lightbox.remove(), 300);
      };

      lightbox.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', closeLightbox);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      }, { once: true });
    });
  });
});
