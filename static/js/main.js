
  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // ============================================
  // MODERN FLOATING NAVBAR CONTROLLER
  // ============================================
  const nav = document.getElementById('nav');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  const activePill = document.getElementById('nav-active-pill');
  const navHamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // 1. Sliding Active Pill Indicator
  function updateActivePill(targetLink) {
    if (!activePill || !targetLink || !navLinksContainer) return;
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();
    const offsetLeft = linkRect.left - containerRect.left;
    const width = linkRect.width;

    activePill.style.transform = `translateX(${offsetLeft}px)`;
    activePill.style.width = `${width}px`;
    activePill.style.opacity = '1';
  }

  // Update pill position for currently active link
  function refreshActivePill() {
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
      updateActivePill(activeLink);
    }
  }

  // Refresh pill on resize
  window.addEventListener('resize', () => {
    refreshActivePill();
  });

  // 2. Scroll Morphing & Smart Direction Hide/Show
  let isMobileMenuOpen = false;
  let lastScrollY = window.scrollY;
  const scrollThreshold = 8;

  window.addEventListener('scroll', () => {
    if (!nav) return;
    const currentScrollY = window.scrollY;

    // Morph state: transparent & wider at top, compact & solid when scrolled
    nav.classList.toggle('scrolled', currentScrollY > 40);

    // Hide/Show on scroll: smooth hide when scrolling down, show when scrolling up
    const scrollDelta = currentScrollY - lastScrollY;

    if (!isMobileMenuOpen) {
      if (currentScrollY <= 40) {
        // Near top of page: always visible
        nav.classList.remove('nav-hidden');
      } else if (scrollDelta > scrollThreshold && currentScrollY > 120) {
        // Scrolling down past header: hide
        nav.classList.add('nav-hidden');
      } else if (scrollDelta < -scrollThreshold) {
        // Scrolling up: reveal smoothly
        nav.classList.remove('nav-hidden');
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // 3. Active Section Tracking (Scroll Spy with IntersectionObserver)
  const navSections = [
    document.getElementById('hero'),
    document.getElementById('about'),
    document.getElementById('projects'),
    document.getElementById('lab'),
    document.getElementById('contact')
  ].filter(Boolean);

  function setActiveNavLink(sectionId) {
    let matchedLink = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      const isMatch = (href === sectionId) || (sectionId === 'hero' && (href === '' || href === 'hero'));
      link.classList.toggle('active', isMatch);
      if (isMatch) matchedLink = link;
    });

    mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      const isMatch = (href === sectionId) || (sectionId === 'hero' && (href === '' || href === 'hero'));
      link.classList.toggle('active', isMatch);
    });

    if (matchedLink) {
      updateActivePill(matchedLink);
    }
  }

  // Observer for active section detection
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          setActiveNavLink(id);
        }
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-80px 0px -40% 0px'
  });

  navSections.forEach(sec => sectionObserver.observe(sec));

  // 4. Smooth Scrolling with Navbar Offset
  function smoothScrollToTarget(targetId) {
    if (!targetId || targetId === '#' || targetId === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navOffset = (nav ? nav.offsetHeight : 60) + 24;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Intercept nav clicks
  document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollToTarget(href);

        // Close mobile menu if open
        if (isMobileMenuOpen) {
          toggleMobileMenu(false);
        }
      }
    });
  });

  // 5. Mobile Hamburger Menu Toggle
  function toggleMobileMenu(forceState) {
    if (!navHamburger || !mobileMenu) return;
    const nextState = (typeof forceState === 'boolean') ? forceState : !isMobileMenuOpen;
    isMobileMenuOpen = nextState;

    navHamburger.classList.toggle('active', isMobileMenuOpen);
    navHamburger.setAttribute('aria-expanded', isMobileMenuOpen ? 'true' : 'false');
    mobileMenu.classList.toggle('active', isMobileMenuOpen);
  }

  if (navHamburger) {
    navHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && nav && !nav.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      toggleMobileMenu(false);
    }
  });

  // Initial pill alignment
  setTimeout(refreshActivePill, 400);
  window.addEventListener('load', refreshActivePill);


  // SCROLL REVEAL (UPGRADED)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // If inline style has animationDelay, transfer it to transitionDelay for smooth stagger
        if (e.target.style.animationDelay && !e.target.style.transitionDelay) {
          e.target.style.transitionDelay = e.target.style.animationDelay;
        }
        e.target.classList.add('visible');
        e.target.classList.add('in-view');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .anim-reveal').forEach(el => revealObserver.observe(el));

  // 3D TILT EFFECT & DYNAMIC GLARE FOR PROFILE IMAGE
  const frame = document.querySelector('.about-image-frame');
  const glare = document.querySelector('.about-image-glare');
  if (frame && glare) {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      const rx = -(dy / yc) * 12; 
      const ry = (dx / xc) * 12;
      
      frame.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      
      const percentageX = (x / rect.width) * 100;
      const percentageY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.15) 0%, transparent 60%, rgba(200,255,0,0.08) 100%)`;
    });
    
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      glare.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(200,255,0,0.05) 100%)';
    });
  }


  // TYPEWRITER EFFECT
  const typewriterText = document.getElementById('typewriter-text');
  const phrases = [
    'sistem web yang efisien dan skalabel.',
    'infrastruktur data berskala besar.',
    'pola tersembunyi dari data yang kompleks.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    if (!typewriterText) return;
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
  });

  // INTERACTIVE GRID PARTICLES ON HERO CANVAS
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let mouse = { x: null, y: null, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.active = false;
      });
    }

    const gridSize = 80;

    function animateGrid() {
      ctx.clearRect(0, 0, width, height);
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          let distance = 9999;
          if (mouse.active && mouse.x !== null) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            distance = Math.sqrt(dx * dx + dy * dy);
          }

          const isDark = document.body.classList.contains('dark-theme');
          if (distance < 200) {
            const alpha = (1 - distance / 200) * 0.7;
            ctx.fillStyle = isDark ? `rgba(255, 230, 0, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = isDark ? `rgba(255, 230, 0, ${alpha * 0.5})` : `rgba(0, 0, 0, ${alpha * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, 6 + (1 - distance / 200) * 12, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      requestAnimationFrame(animateGrid);
    }
    animateGrid();
  }

  // TERMINAL CLI CONTROLLER
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  let streamInterval = null;

  if (terminalInput && terminalBody) {
    // Keep input focused when clicking anywhere inside terminal body
    terminalBody.addEventListener('click', () => {
      terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = terminalInput.value.trim();
        terminalInput.value = '';
        if (inputVal === '') return;

        // Print entered command
        printLine(`guest@unimed:~$ ${inputVal}`, 'accent-color3');

        // Execute command
        executeCommand(inputVal);
      }
    });

    function printLine(text, className = '') {
      const line = document.createElement('div');
      line.className = 'terminal-line ' + className;
      line.innerHTML = text;
      
      // Insert before the input line
      const inputLine = terminalBody.querySelector('.input-line');
      terminalBody.insertBefore(line, inputLine);
      
      // Auto scroll
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(cmd) {
      const command = cmd.toLowerCase().trim();

      // If active stream is running, stop it upon any new command
      if (streamInterval) {
        clearInterval(streamInterval);
        streamInterval = null;
        printLine('Data streaming connection closed.', 'accent-color2');
      }

      if (command === '/help') {
        printLine('Available Commands:', 'accent-color');
        printLine('  <span class="accent-color">/about</span>    - Display profile metadata');
        printLine('  <span class="accent-color">/skills</span>   - Check detailed system skill-levels');
        printLine('  <span class="accent-color">/contact</span>  - Get connection channels');
        printLine('  <span class="accent-color">/stream</span>   - Open active real-time data log stream');
        printLine('  <span class="accent-color">/clear</span>    - Wipe the terminal display');
      } else if (command === '/about') {
        printLine('--------------------------------------------');
        printLine('NAME: Bryant Tinambunan');
        printLine('ROLE: Web Architect & Data Engineer');
        printLine('EDU: Computer Science at UNIMED');
        printLine('INFO: Dual stack specialist specializing in high-load Laravel architecture & distributed Spark data pipelines.');
        printLine('--------------------------------------------');
      } else if (command === '/skills') {
        printLine('System Skill Core Diagnostics:', 'accent-color');
        printLine('PHP/Laravel      [====================] 95%');
        printLine('Python/Spark     [==================--] 90%');
        printLine('Data Engineering [==================--] 90%');
        printLine('SQL Optimization [=================---] 85%');
      } else if (command === '/contact') {
        printLine('Connection Channels Opened:', 'accent-color');
        printLine('  Email    - <a href="mailto:bryanttinambunan12@gmail.com" class="accent-color3">bryanttinambunan12@gmail.com</a>');
        printLine('  GitHub   - <a href="https://github.com/" target="_blank" class="accent-color3">github.com</a>');
        printLine('  LinkedIn - <a href="https://linkedin.com/" target="_blank" class="accent-color3">linkedin.com</a>');
      } else if (command === '/stream') {
        printLine('Opening connection to Spark cluster & Solana nodes...', 'accent-color');
        printLine('Streaming live pipeline log diagnostics... Run any other command to halt the stream.', 'accent-color');
        
        const streamLogs = [
          '<span class="accent-color">[SPARK]</span> SparkSession initialized in 1.42s.',
          '<span class="accent-color3">[YOUTUBE]</span> Fetching comment thread ID: UcwXoGg...',
          '<span class="accent-color3">[YOUTUBE]</span> Scraping active: 1,500 comments extracted.',
          '<span class="accent-color2">[MODEL]</span> Sentiment classification: Tokenizing comment text...',
          '<span class="accent-color2">[MODEL]</span> Sentiment analyzer: Positive 68% | Negative 32%.',
          '<span class="accent-color">[SPARK]</span> Distributed partition write to HDFS format: Parquet.',
          '<span class="accent-color3">[BIGQUERY]</span> Syncing Parquet tables to Google Cloud BigQuery.',
          '<span class="accent-color2">[SOLANA]</span> Monitoring block #2890142 | 2,142 active wallets.',
          '<span class="accent-color2">[SOLANA]</span> K-Means Segment: 12 bots, 82 long-term holders identified.',
          '<span class="accent-color">[SUCCESS]</span> Pipeline orchestration completed successfully (0 errors).'
        ];

        let logIndex = 0;
        streamInterval = setInterval(() => {
          printLine(streamLogs[logIndex % streamLogs.length]);
          logIndex++;
        }, 600);
      } else if (command === '/clear') {
        // Clear all except initial message and input
        const lines = terminalBody.querySelectorAll('.terminal-line:not(.input-line)');
        lines.forEach(l => l.remove());
        printLine('Console display wiped.');
      } else {
        printLine(`Command not found: "${cmd}". Type <span class="accent-color">/help</span> for commands.`, 'accent-color2');
      }
    }
  }

  // CYBER DECRYPT / CODE SCRAMBLE EFFECT FOR PROJECT INDEX NUMBERS
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    const indexEl = item.querySelector('.project-index');
    if (!indexEl) return;
    const originalText = indexEl.textContent;
    const chars = '0123456789%@$#&?*';
    let scrambleInterval = null;

    item.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(scrambleInterval);
      
      scrambleInterval = setInterval(() => {
        indexEl.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(scrambleInterval);
        }
        
        iteration += 1 / 3;
      }, 45);
    });

    item.addEventListener('mouseleave', () => {
      clearInterval(scrambleInterval);
      indexEl.textContent = originalText;
    });
  });

  // ============================================
  // PREMIUM 3D TILT & LIGHT GLARE FOR PROJECT CARDS
  // ============================================
  const isTouchDevice = () => window.matchMedia('(hover: none) or (pointer: coarse)').matches;
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isTouchDevice() && !isReducedMotion()) {
    const MAX_ROTATE_X = 5.0; // Maksimal rotateX ±5deg (elegan & tidak berlebihan)
    const MAX_ROTATE_Y = 5.0; // Maksimal rotateY ±5deg (elegan & tidak berlebihan)
    const MAX_TRANSLATE_Y = -6.0; // Card terangkat 6px
    const MAX_TRANSLATE_Z = 8.0; // Depth pop 8px
    const LERP_FACTOR = 0.085; // Interpolasi physics yang sangat halus dan smooth

    document.querySelectorAll('.project-item').forEach(card => {
      let glare = card.querySelector('.project-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'project-glare';
        card.insertBefore(glare, card.firstChild);
      }

      let targetRx = 0;
      let targetRy = 0;
      let targetTy = 0;
      let targetTz = 0;

      let currentRx = 0;
      let currentRy = 0;
      let currentTy = 0;
      let currentTz = 0;

      let glareX = 0;
      let glareY = 0;
      let isHovered = false;
      let rafId = null;

      function updateTilt() {
        // LERP interpolation untuk pergerakan yang halus dan tidak kaku
        currentRx += (targetRx - currentRx) * LERP_FACTOR;
        currentRy += (targetRy - currentRy) * LERP_FACTOR;
        currentTy += (targetTy - currentTy) * LERP_FACTOR;
        currentTz += (targetTz - currentTz) * LERP_FACTOR;

        // Terapkan transform 3D
        card.style.transform = `perspective(1000px) translateY(${currentTy.toFixed(2)}px) rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg) translateZ(${currentTz.toFixed(2)}px)`;

        // Update pantulan cahaya / glare mengikuti posisi kursor secara subtle
        if (glare && isHovered) {
          glare.style.background = `radial-gradient(600px circle at ${glareX}px ${glareY}px, rgba(255, 255, 255, 0.065) 0%, rgba(200, 255, 0, 0.02) 22%, transparent 65%)`;
        }

        // Animasi exit: saat kursor keluar, tunggu sampai posisi kembali ke 0
        if (!isHovered) {
          const diffRx = Math.abs(targetRx - currentRx);
          const diffRy = Math.abs(targetRy - currentRy);
          const diffTy = Math.abs(targetTy - currentTy);
          const diffTz = Math.abs(targetTz - currentTz);

          if (diffRx < 0.02 && diffRy < 0.02 && diffTy < 0.02 && diffTz < 0.02) {
            // Kembali sempurna ke posisi awal tanpa sisa inline transform
            card.style.transform = '';
            currentRx = 0;
            currentRy = 0;
            currentTy = 0;
            currentTz = 0;
            rafId = null;
            return; // Hentikan loop animasi
          }
        }

        rafId = requestAnimationFrame(updateTilt);
      }

      card.addEventListener('mouseenter', (e) => {
        isHovered = true;
        targetTy = MAX_TRANSLATE_Y;
        targetTz = MAX_TRANSLATE_Z;

        const rect = card.getBoundingClientRect();
        glareX = e.clientX - rect.left;
        glareY = e.clientY - rect.top;

        if (glare) glare.style.opacity = '1';

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) isHovered = true;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Posisi kursor relatif terhadap tengah card (-1 s/d +1)
        const nx = ((x / rect.width) - 0.5) * 2;
        const ny = ((y / rect.height) - 0.5) * 2;

        // Formula natural sesuai permintaan:
        // cursor di kiri (nx < 0) -> rotateY negatif
        // cursor di kanan (nx > 0) -> rotateY positif
        // cursor di atas (ny < 0) -> rotateX positif
        // cursor di bawah (ny > 0) -> rotateX negatif
        targetRy = Math.max(-MAX_ROTATE_Y, Math.min(MAX_ROTATE_Y, nx * MAX_ROTATE_Y));
        targetRx = Math.max(-MAX_ROTATE_X, Math.min(MAX_ROTATE_X, -ny * MAX_ROTATE_X));

        targetTy = MAX_TRANSLATE_Y;
        targetTz = MAX_TRANSLATE_Z;

        glareX = x;
        glareY = y;

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRx = 0;
        targetRy = 0;
        targetTy = 0;
        targetTz = 0;

        if (glare) glare.style.opacity = '0';

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      });
    });
  }

  // THEME ACCENT SWITCHER
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      document.documentElement.style.setProperty('--accent', color);
      
      // Update active state
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // PROJECT DETAIL MODAL DATA
  const projectDetails = {
    '1': {
      title: '"Ask Me" — Forum Platform',
      year: '2024',
      tag: 'Web Dev',
      tagClass: 'tag-web',
      architecture: 'Menerapkan arsitektur <strong>Model-View-Controller (MVC)</strong> dengan <strong>Laravel 10</strong>. Alur request dioptimasi dari routing middleware ke Eloquent ORM dengan teknik Eager Loading untuk menghilangkan query redundan.',
      metrics: [
        'Eradikasi N+1 Query pada relasi thread-comment menggunakan eager loading.',
        'Implementasi custom autoloading optimasi composer classmap.',
        'Waktu respon server rata-rata terpangkas hingga 42% (diuji dengan benchmarking Apache).'
      ],
      github: 'https://github.com/bryanttinambunan/ask-me',
      demo: '#'
    },
    '2': {
      title: 'YouTube Sentiment Analysis',
      year: '2024',
      tag: 'Data Analytics',
      tagClass: 'tag-data',
      architecture: 'Membangun pipeline ekstraksi data komentar otomatis menggunakan <strong>Python BeautifulSoup & Selenium</strong> untuk memotong infinite scroll. Analisis data dilakukan dengan model NLP berbasis lexicon.',
      metrics: [
        'Scraping otomatis 10,000+ data komentar dari channel YouTube teraktif.',
        'Normalisasi text-processing tingkat lanjut (slang words, emoji, mixed languages).',
        'Visualisasi cluster sentimen menggunakan Pandas & Matplotlib secara langsung.'
      ],
      github: 'https://github.com/bryanttinambunan/youtube-sentiment',
      demo: '#'
    },
    '3': {
      title: 'Solana Wallet Analytics',
      year: '2024',
      tag: 'Blockchain Analytics',
      tagClass: 'tag-blockchain',
      architecture: 'Menghubungkan program analitik ke node Solana via RPC API untuk menarik data transaksi dompet on-chain. Algoritma <strong>K-Means Clustering</strong> dikonfigurasi menggunakan Scikit-learn.',
      metrics: [
        'Segmentasi 5,000+ dompet kripto aktif Solana berdasarkan profil transaksi.',
        'Optimasi jumlah klaster (K) terbaik lewat validasi silang Elbow Method & Silhouette Score.',
        'Identifikasi akurat 98% akun bot arbitrase dengan transaksi bervolume tinggi.'
      ],
      github: 'https://github.com/bryanttinambunan/solana-wallet-analytics',
      demo: '#'
    },
    '4': {
      title: 'Distributed Data Engineering',
      year: '2024',
      tag: 'Big Data Infrastructure',
      tagClass: 'tag-infra',
      architecture: 'Konfigurasi lingkungan Spark terdistribusi dengan HDFS sebagai shared storage. Aliran data didefinisikan dengan skema format <strong>Parquet kolumnar</strong> untuk efisiensi penyimpanan maksimal sebelum di-stream ke Google BigQuery.',
      metrics: [
        'Konfigurasi klaster Spark 3-node untuk membagi beban komputasi data terdistribusi.',
        'Efisiensi penyimpanan file terkompresi Parquet hingga 70% dibanding CSV standar.',
        'Schema validation terotomatisasi mencegah error mismatch data streaming Google BigQuery.'
      ],
      github: 'https://github.com/bryanttinambunan/bigdata-pipeline',
      demo: '#'
    }
  };

  // PROJECT DETAIL MODAL CONTROLLER
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  const mTitle = document.getElementById('modal-title');
  const mYear = document.getElementById('modal-year');
  const mTag = document.getElementById('modal-tag');
  const mArch = document.getElementById('modal-architecture');
  const mMetrics = document.getElementById('modal-metrics');

  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Prevent default navigation since it's a link to #
      e.preventDefault();
      
      const indexEl = item.querySelector('.project-index');
      if (!indexEl) return;
      const index = parseInt(indexEl.textContent.replace('0', '')); // '01' -> 1
      const data = projectDetails[index];
      
      if (data) {
        // Populate modal data
        mTitle.textContent = data.title;
        mYear.textContent = data.year;
        mTag.textContent = data.tag;
        mTag.className = 'modal-tag ' + data.tagClass;
        mArch.innerHTML = data.architecture;
        
        // Clear and add metrics
        mMetrics.innerHTML = '';
        data.metrics.forEach(m => {
          const li = document.createElement('li');
          li.innerHTML = m;
          mMetrics.appendChild(li);
        });
        
        // Open modal
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };
  
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // CHATBOT WIDGET CONTROLLER
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatBody = document.getElementById('chat-body');
  const bubblePing = chatBubble ? chatBubble.querySelector('.bubble-ping') : null;

  if (chatBubble && chatWindow && chatCloseBtn && chatInput && chatSendBtn && chatBody) {
    // Toggle Chat Window
    chatBubble.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
        // Hide red ping notification when opened
        if (bubblePing) {
          bubblePing.style.display = 'none';
        }
      }
    });

    // Close Chat Window
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });

    // Send Message function
    const sendMessage = () => {
      const userText = chatInput.value.trim();
      if (!userText) return;

      // Clear input
      chatInput.value = '';

      // Append User message to Chat Body safely
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'chat-msg user';
      
      const userMsgText = document.createElement('div');
      userMsgText.className = 'msg-text';
      userMsgText.textContent = userText; // safe text content
      
      userMsgDiv.appendChild(userMsgText);
      chatBody.appendChild(userMsgDiv);
      
      // Auto Scroll
      chatBody.scrollTop = chatBody.scrollHeight;

      // Show typing indicator
      const typingIndicatorDiv = document.createElement('div');
      typingIndicatorDiv.className = 'chat-msg bot';
      typingIndicatorDiv.id = 'chat-typing-indicator';
      
      const typingMsgText = document.createElement('div');
      typingMsgText.className = 'msg-text';
      
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      
      typingMsgText.appendChild(typingIndicator);
      typingIndicatorDiv.appendChild(typingMsgText);
      chatBody.appendChild(typingIndicatorDiv);
      
      // Auto Scroll
      chatBody.scrollTop = chatBody.scrollHeight;

      // Fetch from API
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Remove typing indicator
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();

        // Append Bot response safely (supports HTML returned by bot/fallback)
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'chat-msg bot';
        
        const botMsgText = document.createElement('div');
        botMsgText.className = 'msg-text';
        botMsgText.innerHTML = data.response; // Allow innerHTML for linebreaks and bold styles from API
        
        botMsgDiv.appendChild(botMsgText);
        chatBody.appendChild(botMsgDiv);
        
        // Auto Scroll
        chatBody.scrollTop = chatBody.scrollHeight;
      })
      .catch(err => {
        console.error('Error fetching chat response:', err);
        // Remove typing indicator
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();

        // Append error fallback message
        const errMsgDiv = document.createElement('div');
        errMsgDiv.className = 'chat-msg bot';
        
        const errMsgText = document.createElement('div');
        errMsgText.className = 'msg-text';
        errMsgText.textContent = 'Maaf, sepertinya ada kendala koneksi. Coba lagi dalam beberapa saat ya!';
        
        errMsgDiv.appendChild(errMsgText);
        chatBody.appendChild(errMsgDiv);
        
        // Auto Scroll
        chatBody.scrollTop = chatBody.scrollHeight;
      });
    };

    // Trigger on Send button click
    chatSendBtn.addEventListener('click', sendMessage);

    // Trigger on Enter keypress
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // LIGHT/DARK THEME TOGGLE CONTROLLER (Default: Light Neo-Brutalism)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('.toggle-icon');
    
    // Check saved local storage preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (icon) icon.textContent = '☀️'; // Display sun to switch back to light
    } else {
      document.body.classList.remove('dark-theme');
      if (icon) icon.textContent = '🌙'; // Display moon to switch to dark
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        if (icon) icon.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        if (icon) icon.textContent = '🌙';
      }
    });
  }

  // ============================================
  // CINEMATIC MINIMALIST PRELOADER CONTROLLER
  // ============================================
  const preloader = document.getElementById('preloader');
  const preloaderWord = document.getElementById('preloader-word');
  const heroEl = document.querySelector('.hero');
  const navElement = document.getElementById('nav');
  const lanyardCardEl = document.getElementById('lanyard-card');

  function triggerHeroEntrance() {
    // 1. Reveal hero container: smooth scale (0.96 -> 1) & translateY (24px -> 0)
    if (heroEl) {
      heroEl.classList.remove('hero-loading');
      heroEl.classList.add('hero-revealed');
    }

    // 2. Reveal navbar smoothly
    if (navElement) {
      setTimeout(() => {
        navElement.classList.add('nav-visible');
      }, 180);
    }

    // 3. Staggered hero entrance elements
    const heroElements = document.querySelectorAll('.hero-entrance');
    heroElements.forEach(el => {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        el.classList.add('in');
      }, delay);
    });

    // 4. Lanyard card entrance
    if (lanyardCardEl) {
      setTimeout(() => {
        lanyardCardEl.classList.add('in');
      }, 950);
    }
  }

  // Check for prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    if (preloader) preloader.style.display = 'none';
    triggerHeroEntrance();
    if (navElement) navElement.classList.add('nav-visible');
  } else if (preloader && preloaderWord) {
    // Word sequence: 5 greetings, total loading experience ~5.0 seconds
    const greetings = ["Hello.", "Bonjour.", "こんにちは.", "Hola.", "Halo."];
    
    function setWord(text) {
      preloaderWord.style.transition = 'none';
      preloaderWord.className = 'preloader-word';
      preloaderWord.textContent = text;
      // Force reflow
      void preloaderWord.offsetHeight;
      // Animate in: fade in + scale 0.95->1 + blur 8px->0
      preloaderWord.style.transition = '';
      preloaderWord.classList.add('enter');
    }

    function fadeOutWord() {
      // Animate out: fade out + scale 1->1.05 + blur 0->6px
      preloaderWord.classList.remove('enter');
      preloaderWord.classList.add('leave');
    }

    // SEQUENCE SCHEDULE (Total ~5.0 seconds):
    // 0.0s – 0.8s: "Hello." appears
    // 0.8s – 1.1s: "Hello." fades out
    setWord(greetings[0]);
    setTimeout(fadeOutWord, 780);

    // 1.1s – 1.9s: "Bonjour." appears
    // 1.9s – 2.2s: "Bonjour." fades out
    setTimeout(() => {
      setWord(greetings[1]);
      setTimeout(fadeOutWord, 780);
    }, 1100);

    // 2.2s – 3.0s: "こんにちは." appears
    // 3.0s – 3.3s: "こんにちは." fades out
    setTimeout(() => {
      setWord(greetings[2]);
      setTimeout(fadeOutWord, 780);
    }, 2200);

    // 3.3s – 4.0s: "Hola." appears
    // 4.0s – 4.3s: "Hola." fades out
    setTimeout(() => {
      setWord(greetings[3]);
      setTimeout(fadeOutWord, 700);
    }, 3300);

    // 4.3s – 5.0s: "Halo." appears
    setTimeout(() => {
      setWord(greetings[4]);
    }, 4300);

    // 5.0s: Cinematic Reveal Transition!
    // Loading Screen pulls up smoothly to translateY(-100%)
    setTimeout(() => {
      // Start curtain reveal
      preloader.classList.add('preloader-exit');

      // Hero & Landing Page begin entrance animation as curtain pulls up
      triggerHeroEntrance();

      // Cleanly remove preloader after 1.1s curtain pull completes
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1150);
    }, 5000);

  } else {
    triggerHeroEntrance();
    if (navElement) navElement.classList.add('nav-visible');
  }

  // SCROLL PROGRESS & BACK TO TOP CONTROLLER
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolledPercentage = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = scrolledPercentage + '%';
    }

    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // EMAIL CLICK TO COPY CONTROLLER
  const emailLinks = document.querySelectorAll('a[href^="mailto:bryanttinambunan12"]');
  const toast = document.getElementById('toast');

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent opening default mail client
      
      const emailAddress = 'bryanttinambunan12@gmail.com';
      navigator.clipboard.writeText(emailAddress).then(() => {
        if (toast) {
          toast.classList.add('active');
          // Auto hide after 3 seconds
          setTimeout(() => {
            toast.classList.remove('active');
          }, 3000);
        }
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

  // PROJECT FILTER CONTROLLER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0 && pItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button style
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        pItems.forEach(item => {
          const tag = item.querySelector('.project-tag');
          if (!tag) return;

          let show = false;
          if (category === 'all') {
            show = true;
          } else {
            show = tag.classList.contains(category);
          }

          if (show) {
            item.classList.add('filtering');
            item.style.display = 'grid';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
              setTimeout(() => {
                item.style.transform = '';
                item.classList.remove('filtering');
              }, 420);
            }, 50);
          } else {
            item.classList.add('filtering');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
              item.classList.remove('filtering');
            }, 400); // Match CSS transition duration
          }
        });
      });
    });
  }

  // 1. CHERRY MX MECHANICAL KEYBOARD SOUND GENERATOR
  function playMechanicalClick(isEnterOrSpace = false) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Noise buffer for mechanical spring clack
      const bufferSize = ctx.sampleRate * 0.035; // 35ms clack
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = isEnterOrSpace ? 900 : 1800; // pitch shift space/enter down
      noiseFilter.Q.value = 4;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isEnterOrSpace ? 0.04 : 0.025, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      
      // Triangle body tone oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'triangle';
      const baseFreq = isEnterOrSpace ? 140 : 320;
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 40, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.035);
      
      oscGain.gain.setValueAtTime(isEnterOrSpace ? 0.05 : 0.03, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      
      // Connect nodes
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      
      // Execute sound waves
      noise.start();
      noise.stop(ctx.currentTime + 0.035);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {
      // Catch policy block
    }
  }

  // Bind mechanical clicking sound to terminal input and chatbot input
  const inputsToSound = [document.getElementById('terminal-input'), document.getElementById('chat-input')];
  inputsToSound.forEach(inp => {
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        const isSpOrEnt = (e.key === ' ' || e.key === 'Enter');
        playMechanicalClick(isSpOrEnt);
      });
    }
  });

  // 2. INFINITE HSL COLOR SPECTRUM SWITCHER
  const hueSlider = document.getElementById('color-hue-slider');
  if (hueSlider) {
    hueSlider.addEventListener('input', (e) => {
      const hue = e.target.value;
      const newColor = `hsl(${hue}, 100%, 50%)`;
      document.documentElement.style.setProperty('--accent', newColor);
      
      // Remove presets active states if they custom customize
      document.querySelectorAll('.theme-presets .theme-btn').forEach(b => {
        b.classList.remove('active');
      });
    });
  }

  // THEME SWITCHER POPUP TOGGLE CONTROLLER
  const themeSwitcherToggle = document.getElementById('theme-switcher-toggle');
  const themeSwitcher = document.getElementById('theme-switcher');
  
  if (themeSwitcherToggle && themeSwitcher) {
    themeSwitcherToggle.addEventListener('click', () => {
      themeSwitcher.classList.toggle('active');
    });
    
    // Close the popup when clicking anywhere outside of it
    document.addEventListener('click', (e) => {
      if (!themeSwitcher.contains(e.target) && !themeSwitcherToggle.contains(e.target)) {
        themeSwitcher.classList.remove('active');
      }
    });
  }

  // 3. ACADEMIC LAB DETAIL DRAWER CONTROLLER
  const labDrawer = document.getElementById('lab-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close');
  
  const dTitle = document.getElementById('drawer-title');
  const dNum = document.getElementById('drawer-num');
  const dDiag = document.getElementById('drawer-diagnostics');
  const dCode = document.getElementById('drawer-code-block');

  const labDiagDetails = {
    '01': {
      title: 'Database Systems Lab',
      diagnostics: 'Eksplorasi mendalam normalisasi skema, indexing strategy, dan query plan optimization di MySQL. Menganalisis execution plan (EXPLAIN) untuk mendeteksi bottleneck dan mengubah full table scan menjadi index range scan.',
      code: `-- EXPLAIN & OPTIMIZE MYSQL QUERIES
EXPLAIN SELECT * FROM users 
WHERE email = 'bryant@unimed.ac.id' AND status = 'active';

-- COVERING INDEX TO ERADICATE SLOW SCANNING
CREATE INDEX idx_users_email_status 
ON users(email, status);`
    },
    '02': {
      title: 'Operating Systems Lab',
      diagnostics: 'Simulasi penjadwalan proses CPU menggunakan algoritma Round Robin, Shortest Job First (SJF), First-Come First-Served (FCFS), dan studi deadlock algoritma Banker pada platform Linux.',
      code: `// ROUND ROBIN SCHEDULER IMPLEMENTATION (C++)
#include <iostream>
using namespace std;

void roundRobinScheduling(int processes[], int n, int bt[], int quantum) {
    int rem_bt[n];
    for (int i = 0 ; i < n ; i++) rem_bt[i] = bt[i];
    int t = 0;
    while (true) {
        bool done = true;
        for (int i = 0 ; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = false;
                if (rem_bt[i] > quantum) {
                    t += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    t = t + rem_bt[i];
                    rem_bt[i] = 0;
                }
            }
        }
        if (done) break;
    }
}`
    },
    '03': {
      title: 'Algorithm Optimization',
      diagnostics: 'Studi mendalam perbandingan kompleksitas waktu (Big-O) dan ruang, graf traversal (BFS & DFS), serta pohon pencarian biner (Binary Search Tree) untuk optimalisasi efisiensi pencarian data skala besar.',
      code: `# BINARY SEARCH TREE RETRIEVAL & INSERT (PYTHON)
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if root.val == key:
            return root
        elif root.val < key:
            root.right = insert(root.right, key)
        else:
            root.left = insert(root.left, key)
    return root`
    }
  };

  document.querySelectorAll('.lab-card').forEach(card => {
    card.addEventListener('click', () => {
      const num = card.getAttribute('data-num');
      const details = labDiagDetails[num];
      
      if (details && labDrawer && dTitle && dNum && dDiag && dCode) {
        dNum.textContent = num;
        dTitle.textContent = details.title;
        dDiag.innerHTML = details.diagnostics;
        dCode.textContent = details.code;
        
        labDrawer.classList.add('active');
      }
    });
  });

  const closeLabDrawer = () => {
    if (labDrawer) labDrawer.classList.remove('active');
  };

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeLabDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeLabDrawer);


  // ==========================================
  // 4. INTERACTIVE RETRACTABLE LANYARD PHYSICS
  // ==========================================
  const lanyardCard = document.getElementById('lanyard-card');
  const lanyardReel = document.getElementById('lanyard-reel');
  const strapPath = document.getElementById('lanyard-strap-path');
  const heroSection = document.querySelector('.hero');

  if (lanyardCard && lanyardReel && strapPath && heroSection) {
    const CARD_WIDTH = 230;
    
    // Position of card center-top relative to heroSection
    let cardX = 0;
    let cardY = 0;
    
    // Physics Velocity
    let vx = 0;
    let vy = 0;
    
    // Throw momentum tracking
    let prevMouseX = 0;
    let prevMouseY = 0;
    let isDragging = false;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    
    // 3D rotation angles
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    // Helper to calculate Reel pin center in hero coordinates
    function getReelPosInHero() {
      const heroRect = heroSection.getBoundingClientRect();
      const reelRect = lanyardReel.getBoundingClientRect();
      return {
        x: (reelRect.left + reelRect.width / 2) - heroRect.left,
        y: (reelRect.top + reelRect.height / 2) - heroRect.top
      };
    }

    // Set initial position
    const reelInit = getReelPosInHero();
    cardX = reelInit.x;
    cardY = reelInit.y + 140;

    // Mouse drag start
    lanyardCard.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 1024) return;
      isDragging = true;
      
      const heroRect = heroSection.getBoundingClientRect();
      const currentMouseHeroX = e.clientX - heroRect.left;
      const currentMouseHeroY = e.clientY - heroRect.top;
      
      grabOffsetX = currentMouseHeroX - cardX;
      grabOffsetY = currentMouseHeroY - cardY;
      
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      vx = 0;
      vy = 0;
      
      if (cursor && ring) {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      }
      e.preventDefault();
    });

    // Window mouse move
    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const heroRect = heroSection.getBoundingClientRect();
        const currentMouseHeroX = e.clientX - heroRect.left;
        const currentMouseHeroY = e.clientY - heroRect.top;
        
        const newCardX = currentMouseHeroX - grabOffsetX;
        const newCardY = currentMouseHeroY - grabOffsetY;
        
        // Track fluid throw velocity
        vx = (e.clientX - prevMouseX) * 0.75;
        vy = (e.clientY - prevMouseY) * 0.75;
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        
        cardX = newCardX;
        cardY = newCardY;
      }
    });

    // Release fling
    const stopDrag = () => {
      if (isDragging) {
        isDragging = false;
        // Clamp maximum initial fling velocity so it doesn't overshoot unreasonably
        const maxV = 26;
        vx = Math.max(-maxV, Math.min(maxV, vx));
        vy = Math.max(-maxV, Math.min(maxV, vy));
        
        if (cursor && ring) {
          cursor.classList.remove('hover');
          ring.classList.remove('hover');
        }
      }
    };

    window.addEventListener('mouseup', stopDrag);

    // Touch support for tablets
    lanyardCard.addEventListener('touchstart', (e) => {
      if (window.innerWidth <= 1024) return;
      isDragging = true;
      const touch = e.touches[0];
      const heroRect = heroSection.getBoundingClientRect();
      grabOffsetX = (touch.clientX - heroRect.left) - cardX;
      grabOffsetY = (touch.clientY - heroRect.top) - cardY;
      prevMouseX = touch.clientX;
      prevMouseY = touch.clientY;
      vx = 0;
      vy = 0;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        const heroRect = heroSection.getBoundingClientRect();
        cardX = (touch.clientX - heroRect.left) - grabOffsetX;
        cardY = (touch.clientY - heroRect.top) - grabOffsetY;
        vx = (touch.clientX - prevMouseX) * 0.75;
        vy = (touch.clientY - prevMouseY) * 0.75;
        prevMouseX = touch.clientX;
        prevMouseY = touch.clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', stopDrag);

    lanyardCard.addEventListener('mouseenter', () => {
      if (window.innerWidth > 1024 && cursor && ring) {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      }
    });

    lanyardCard.addEventListener('mouseleave', () => {
      if (!isDragging && cursor && ring) {
        cursor.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });

    // Main Physics Animation Loop
    function updateLanyardPhysics() {
      if (window.innerWidth <= 1024) {
        lanyardCard.style.position = '';
        lanyardCard.style.left = '';
        lanyardCard.style.top = '';
        lanyardCard.style.transform = '';
        lanyardCard.style.opacity = '';
        lanyardCard.style.visibility = '';
        lanyardCard.style.pointerEvents = '';
        strapPath.setAttribute('d', 'M 0 0');
        requestAnimationFrame(updateLanyardPhysics);
        return;
      }

      const reel = getReelPosInHero();
      const naturalRestY = reel.y + 145;
      const targetX = reel.x;
      const targetY = naturalRestY;

      if (!isDragging) {
        // High quality spring-mass-damper physics
        const dx = targetX - cardX;
        const dy = targetY - cardY;
        
        // Elastic spring tension and fluid damping
        const tension = 0.048;
        const damping = 0.88;
        const gravity = 0.32;
        
        const ax = dx * tension;
        const ay = dy * tension + gravity;
        
        vx = (vx + ax) * damping;
        vy = (vy + ay) * damping;
        
        cardX += vx;
        cardY += vy;
      }

      // Retractable line limit constraint (cord max stretch ~540px)
      const distFromReelX = cardX - reel.x;
      const distFromReelY = cardY - reel.y;
      const currentDist = Math.hypot(distFromReelX, distFromReelY);
      const MAX_LINE_LENGTH = 540;
      
      if (currentDist > MAX_LINE_LENGTH) {
        const angle = Math.atan2(distFromReelY, distFromReelX);
        cardX = reel.x + Math.cos(angle) * MAX_LINE_LENGTH;
        cardY = reel.y + Math.sin(angle) * MAX_LINE_LENGTH;
        vx *= 0.5;
        vy *= 0.5;
      }

      // Soft ceiling constraint so card doesn't cross above reel pin
      if (cardY < reel.y + 12) {
        cardY = reel.y + 12;
        vy = Math.abs(vy) * 0.3;
      }

      // Calculate dynamic 3D tilt & pendulum swing
      const stringAngle = Math.atan2(cardX - reel.x, Math.max(1, cardY - reel.y));
      const targetRotZ = (stringAngle * (180 / Math.PI)) * 0.75 + (vx * 0.4);
      const targetRotX = Math.max(-20, Math.min(20, -vy * 0.7));
      const targetRotY = Math.max(-25, Math.min(25, vx * 0.8));
      
      rotZ += (targetRotZ - rotZ) * 0.15;
      rotX += (targetRotX - rotX) * 0.15;
      rotY += (targetRotY - rotY) * 0.15;

      // Opacity fade when scrolling past hero section
      const heroRect = heroSection.getBoundingClientRect();
      const scrollY = window.scrollY;
      let opacity = 1;
      const heroHeight = heroRect.height || 700;
      if (scrollY > heroHeight * 0.45) {
        opacity = Math.max(0, 1 - (scrollY - heroHeight * 0.45) / (heroHeight * 0.45));
      }

      lanyardCard.style.position = 'absolute';
      lanyardCard.style.left = '0px';
      lanyardCard.style.top = '0px';
      lanyardCard.style.opacity = opacity;
      
      if (opacity <= 0.02) {
        lanyardCard.style.pointerEvents = 'none';
        lanyardCard.style.visibility = 'hidden';
      } else {
        lanyardCard.style.pointerEvents = 'auto';
        lanyardCard.style.visibility = 'visible';
      }

      // Render 3D transform without jitter
      lanyardCard.style.transform = `translate3d(${(cardX - CARD_WIDTH / 2).toFixed(2)}px, ${cardY.toFixed(2)}px, 0) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      // Draw the dynamic retractable strap path in viewport coordinates
      if (opacity > 0.02) {
        strapPath.style.opacity = opacity;
        
        const currentReelRect = lanyardReel.getBoundingClientRect();
        const startX = currentReelRect.left + currentReelRect.width / 2;
        const startY = currentReelRect.top + currentReelRect.height / 2;
        
        const endX = heroRect.left + cardX;
        const endY = heroRect.top + cardY;
        
        const lineDx = endX - startX;
        const lineDy = endY - startY;
        const lineDist = Math.hypot(lineDx, lineDy);
        
        const naturalLength = 145;
        let sag = 0;
        if (lineDist < naturalLength) {
          sag = (naturalLength - lineDist) * 0.45;
        }
        
        const midX = (startX + endX) / 2 + (vx * 1.5);
        const midY = (startY + endY) / 2 + sag;
        
        strapPath.setAttribute('d', `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
      } else {
        strapPath.style.opacity = '0';
        strapPath.setAttribute('d', 'M 0 0');
      }

      requestAnimationFrame(updateLanyardPhysics);
    }

    requestAnimationFrame(updateLanyardPhysics);
  }

  // ==========================================
  // 5. LABORATORY SHOWCASE PROJECT SWITCHER
  // ==========================================
  const labTabs = document.querySelectorAll('.lab-tab-btn');
  const labCards = document.querySelectorAll('.lab-project-card');
  const labPrevBtn = document.getElementById('lab-prev-btn');
  const labNextBtn = document.getElementById('lab-next-btn');
  const labCurrNum = document.getElementById('lab-curr-num');
  let currentLabIndex = 0;
  const totalLabProjects = labCards.length;

  function switchLabProject(index) {
    if (totalLabProjects === 0) return;
    if (index < 0) index = totalLabProjects - 1
    if (index >= totalLabProjects) index = 0;
    currentLabIndex = index;

    // Update tabs
    labTabs.forEach(tab => {
      const tabIdx = parseInt(tab.getAttribute('data-index'), 10);
      const isActive = tabIdx === currentLabIndex;
      tab.classList.toggle('active', isActive);
      if (isActive && window.innerWidth <= 768) {
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update cards
    labCards.forEach(card => {
      const cardIdx = parseInt(card.getAttribute('data-card'), 10);
      card.classList.toggle('active', cardIdx === currentLabIndex);
    });

    // Update counter display
    if (labCurrNum) {
      labCurrNum.textContent = `0${currentLabIndex + 1}`;
    }
  }

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-index'), 10);
      switchLabProject(idx);
    });
  });

  if (labPrevBtn) {
    labPrevBtn.addEventListener('click', () => {
      switchLabProject(currentLabIndex - 1);
    });
  }

  if (labNextBtn) {
    labNextBtn.addEventListener('click', () => {
      switchLabProject(currentLabIndex + 1);
    });
  }
