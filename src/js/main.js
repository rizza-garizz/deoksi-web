import '../css/style.css';
import { initContent } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize dynamic content
  await initContent();

  // Fallback video optimized (720p/f_auto,q_auto) - Previously 4K
  const fallbackVideoSrc = "https://res.cloudinary.com/dwarsapox/video/upload/q_auto,f_auto,w_1280/v1776465403/4264880-uhd_3840_2160_30fps_f3bhai.mp4";

  // Hard fallback: ensure video treatment card is always visible.
  const videoGrid = document.getElementById('video-grid');
  if (videoGrid && !videoGrid.querySelector('.video-card')) {
    videoGrid.classList.add('video-grid--single');
    videoGrid.innerHTML = `
      <article class="video-card video-card--featured" tabindex="0" aria-label="Video edukasi Prosedur Facial Treatment">
        <video poster="/assets/images/service_aging.png" preload="metadata" muted loop playsinline autoplay controls>
          <source src="${fallbackVideoSrc}" type="video/mp4">
        </video>
        <div class="video-play-overlay">
          <button type="button" class="play-icon-circle video-play-toggle" aria-label="Putar video edukasi Prosedur Facial Treatment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div class="video-info-bottom">
          <h3 class="video-card-title">Prosedur Facial Treatment</h3>
          <p class="video-card-meta">Edukasi proses treatment langsung di klinik dengan prosedur higienis.</p>
          <a href="https://wa.me/6282333344919?text=Halo%20saya%20mau%20tanya" class="video-cta-btn" target="_blank">
            Konsultasi Sekarang
          </a>
        </div>
      </article>
    `;
  }

  // === Performance Utility: Throttle ===
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return callback(...args);
    };
  };

  // === Navbar Scroll Effect ===
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.style.top = '0';
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', throttle(handleNavScroll, 100), { passive: true });
  handleNavScroll();

  // === Mobile Menu Toggle ===
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // === Smart Active Nav Link Logic (Global Audit Update) ===
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  const updateActiveLink = () => {
    const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      
      if (isHomePage) {
        // On home page, use Scroll Spy for section links
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          if (scrollPos >= top && scrollPos < top + height) {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            }
          }
        });
        
        // Fallback for home link
        if (href === '/' || href === '/index.html') {
          const firstSection = sections[0];
          if (window.scrollY < (firstSection ? firstSection.offsetTop : 100)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        }
      } else {
        // On subpages, match the href filename
        const pageName = currentPath.split('/').pop() || 'index.html';
        const linkName = href.split('/').pop();
        if (pageName === linkName) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      }
    });
  };

  window.addEventListener('scroll', throttle(updateActiveLink, 150), { passive: true });
  updateActiveLink(); // Initial check

  // === Scroll Animations (Intersection Observer) ===
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // === Counter Animation ===
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

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

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }
    });
  });

  // === Optimized Parallax Effect (using rAF) ===
  const heroVisual = document.querySelector('.hero-bg img') || document.querySelector('.hero-video');
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight && heroVisual) {
      const parallax = scrollY * 0.3;
      heroVisual.style.transform = `scale(1.05) translateY(${parallax}px) translateZ(0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // === Back to Top Button ===
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Certificate Carousel (Swiper) ===
  if (typeof Swiper !== 'undefined' && document.querySelector('.cert-swiper')) {
    new Swiper('.cert-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      },
      breakpoints: {
        320: { slidesPerView: 1.1, spaceBetween: 15 },
        768: { slidesPerView: 2, spaceBetween: 25 },
        1024: { slidesPerView: 2.5, spaceBetween: 35 }
      },
      navigation: {
        nextEl: '.cert-navigation .swiper-button-next',
        prevEl: '.cert-navigation .swiper-button-prev',
      },
      pagination: {
        el: '.cert-navigation .swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 1000,
      on: {
        init: function () {
          // Refresh scroll animations for new elements
          if (typeof observer !== 'undefined') {
            document.querySelectorAll('.cert-swiper').forEach(el => observer.observe(el));
          }
        },
      }
    });
  }

  // === Certificate Lightbox ===
  const certLightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (certLightbox && lightboxImg && lightboxCaption) {
    const openLightbox = (imageSrc, title) => {
      lightboxImg.src = imageSrc;
      lightboxCaption.textContent = title;
      certLightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      certLightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear after transiton
    };

    // Card click events
    document.querySelectorAll('.cert-card').forEach(card => {
      card.addEventListener('click', () => {
        const fullImg = card.getAttribute('data-image');
        const title = card.getAttribute('data-title');
        openLightbox(fullImg, title);
      });
    });

    // Close events
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certLightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
