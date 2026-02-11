/* ============================================
   DiwaliTravel.com — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile Navigation --- */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navOverlay = document.querySelector('.nav__overlay');

  function toggleMobileNav() {
    const isOpen = navLinks.classList.contains('nav__links--open');

    if (isOpen) {
      navLinks.classList.remove('nav__links--open');
      navToggle.classList.remove('nav__toggle--active');
      navOverlay.classList.remove('nav__overlay--visible');
      document.body.style.overflow = '';
    } else {
      navLinks.classList.add('nav__links--open');
      navToggle.classList.add('nav__toggle--active');
      navOverlay.classList.add('nav__overlay--visible');
      document.body.style.overflow = 'hidden';
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('nav__links--open')) {
          toggleMobileNav();
        }
      });
    });
  }

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('nav__links--open')) {
      toggleMobileNav();
    }
  });

  /* --- Sticky Navigation on Scroll --- */
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* --- FAQ Accordion --- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('faq-item--open');
          otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('faq-item--open');
      question.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* --- Scroll Fade-In Animations (Intersection Observer) --- */
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('fade-in--visible');
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#0') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Newsletter Form (prevent default, show thank you) --- */
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      const btn = newsletterForm.querySelector('.btn');
      if (input && input.value) {
        btn.textContent = 'Thank you!';
        btn.style.pointerEvents = 'none';
        input.value = '';
        input.placeholder = 'You\'re on the list!';
        input.disabled = true;
      }
    });
  }

  /* --- Lazy Loading Images (native + fallback) --- */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback with Intersection Observer
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
      });
    }
  }

  /* --- Active nav link highlighting on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  function highlightNavLink() {
    const scrollY = window.pageYOffset;
    const navHeight = nav ? nav.offsetHeight : 70;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector('.nav__links a[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.style.color = 'var(--gold)';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

});
