document.addEventListener('DOMContentLoaded', function () {

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked (mobile)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
      });
    });
  }

  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('technova-theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('technova-theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const carousel = document.querySelector('.carousel');

  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach(function (dot, i) {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 4000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      stopAutoPlay();
      goToSlide(currentIndex + 1);
      startAutoPlay();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () {
      stopAutoPlay();
      goToSlide(currentIndex - 1);
      startAutoPlay();
    });

    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          stopAutoPlay();
          goToSlide(i);
          startAutoPlay();
        });
      });
    }

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    goToSlide(0);
    startAutoPlay();
  }

  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal when clicking outside the box, or pressing Escape
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');

      // Close all other accordion items in the same group (single-open behavior)
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.accordion-content').style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  const counters = document.querySelectorAll('.counter-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  const tabGroups = document.querySelectorAll('.tabs-wrapper');

  tabGroups.forEach(function (wrapper) {
    const tabButtons = wrapper.querySelectorAll('.tab-btn');
    const tabPanels = wrapper.querySelectorAll('.tab-panel');

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });

        btn.classList.add('active');
        const targetPanel = wrapper.querySelector('[data-tab-panel="' + targetId + '"]');
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });

  const tooltipElements = document.querySelectorAll('.has-tooltip');

  tooltipElements.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      el.classList.add('tooltip-visible');
    });
    el.addEventListener('mouseleave', function () {
      el.classList.remove('tooltip-visible');
    });
    // Also support touch / keyboard focus for accessibility
    el.addEventListener('focus', function () {
      el.classList.add('tooltip-visible');
    });
    el.addEventListener('blur', function () {
      el.classList.remove('tooltip-visible');
    });
  });

  const validatedForm = document.querySelector('.js-validate-form');

  if (validatedForm) {
    const nameField = validatedForm.querySelector('#qc-name');
    const emailField = validatedForm.querySelector('#qc-email');
    const phoneField = validatedForm.querySelector('#qc-phone');
    const passwordField = validatedForm.querySelector('#qc-password');
    const successMessage = validatedForm.querySelector('.form-success-message');

    function setFieldState(field, isValid) {
      const group = field.closest('.form-group');
      if (!group) return;
      group.classList.remove('valid', 'invalid');
      group.classList.add(isValid ? 'valid' : 'invalid');
    }

    function validateName() {
      if (!nameField) return true;
      const isValid = nameField.value.trim().length >= 2;
      setFieldState(nameField, isValid);
      return isValid;
    }

    function validateEmail() {
      if (!emailField) return true;
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = pattern.test(emailField.value.trim());
      setFieldState(emailField, isValid);
      return isValid;
    }

    function validatePhone() {
      if (!phoneField) return true;
      const digits = phoneField.value.replace(/\D/g, '');
      const isValid = digits.length >= 10;
      setFieldState(phoneField, isValid);
      return isValid;
    }

    function getPasswordStrength(value) {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score; // 0 to 4
    }

    function validatePassword() {
      if (!passwordField) return true;
      const score = getPasswordStrength(passwordField.value);
      const isValid = score >= 3;
      setFieldState(passwordField, isValid);

      const bar = validatedForm.querySelector('.password-strength-bar');
      if (bar) {
        const percent = (score / 4) * 100;
        bar.style.width = percent + '%';
        if (score <= 1) bar.style.background = 'var(--color-danger)';
        else if (score <= 2) bar.style.background = 'var(--color-warning)';
        else bar.style.background = 'var(--color-success)';
      }
      return isValid;
    }

    if (nameField) nameField.addEventListener('input', validateName);
    if (emailField) emailField.addEventListener('input', validateEmail);
    if (phoneField) phoneField.addEventListener('input', validatePhone);
    if (passwordField) passwordField.addEventListener('input', validatePassword);

    validatedForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameOk = validateName();
      const emailOk = validateEmail();
      const phoneOk = validatePhone();
      const passwordOk = validatePassword();

      if (nameOk && emailOk && phoneOk && passwordOk) {
        if (successMessage) {
          successMessage.classList.add('show');
          successMessage.textContent = 'Thanks! Your message has been received. We will reach out soon.';
        }
        validatedForm.reset();
        validatedForm.querySelectorAll('.form-group').forEach(function (group) {
          group.classList.remove('valid', 'invalid');
        });
        const bar = validatedForm.querySelector('.password-strength-bar');
        if (bar) bar.style.width = '0%';
      } else {
        if (successMessage) successMessage.classList.remove('show');
      }
    });
  }

});
