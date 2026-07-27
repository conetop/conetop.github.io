// ==========================================
// MAIN APPLICATION LOGIC
// ==========================================

window.app = {
  currentTheme: 'light',
  currentNav: 'home',
  affirmationIndex: 0,
  userAnswers: {},
  quizScore: null,
  passcode: '',
  skillsFilter: 'all',

  affirmations: [
    "You are capable of amazing things, take it one cozy step at a time ✨",
    "Remember to sip some water, relax your shoulders, and smile 🍵",
    "Your hard work and dedication will shine brighter than ever 🌟",
    "You are loved, appreciated, and infinitely cherished 🧡",
    "Every day is a fresh blank canvas for cute moments 🎨"
  ],

  quizQuestions: [
    {
      id: 1,
      question: "What's my favourite thing to eat?",
      options: ["Biriyani 🍛", "Manthi 🥘", "Ice cream 🍦", "Chips 🍟"],
      correct: 2
    },
    {
      id: 2,
      question: "What is my natural superpower?",
      options: ["Sleeping 😴", "Napping 💤", "Slumbering 🛌", "All of the above 👑"],
      correct: 3
    },
    {
      id: 3,
      question: "What makes me happy?",
      options: ["Driving a car 🚗", "Going for a skydive 🪂", "Watching a horror movie 👻", "Small things done for me 🧡"],
      correct: 3
    },
    {
      id: 4,
      question: "What's my favourite book?",
      options: ["Harry Potter 🧙", "Geronimo Stilton 🐭", "None of the above 📖"],
      correct: 2
    },
    {
      id: 5,
      question: "Favourite drink?",
      options: ["Cola 🥤", "Mirinda 🟠", "7up 🟢", "Slice 🍊"],
      correct: 3
    }
  ],

  skillsData: [
    { category: 'academic', icon: '🔬', name: 'Biology & Life Sciences', desc: 'Deep understanding of biological concepts, from cell biology to zoology and ecology.' },
    { category: 'academic', icon: '⚗️', name: 'Chemistry', desc: 'Strong grasp of organic and inorganic chemistry concepts from my Bio Science studies.' },
    { category: 'academic', icon: '📖', name: 'Quick Learner', desc: 'Able to absorb and retain new concepts rapidly — especially in science and academics.' },
    { category: 'creative', icon: '💃', name: 'Classical Dance', desc: 'Trained in classical Indian dance forms, especially Bharatanatyam, with grace and precision.' },
    { category: 'creative', icon: '🕺', name: 'Contemporary Dance', desc: 'Versatile across modern and contemporary dance styles with natural rhythm and expression.' },
    { category: 'creative', icon: '🎤', name: 'Singing', desc: 'Soulful vocalist with a warm voice suited to classical and melodic genres.' },
    { category: 'creative', icon: '✏️', name: 'Drawing & Sketching', desc: 'Skilled at fine-detail pencil sketches, portraits, and artistic illustrations.' },
    { category: 'creative', icon: '🎀', name: 'Crafting & DIY', desc: 'Loves creating handmade crafts, decorations, and aesthetic little things.' },
    { category: 'everyday', icon: '😴', name: 'Professional Napper', desc: 'Mastered the art of the perfect nap — anytime, anywhere, in any lighting condition.' },
    { category: 'everyday', icon: '🗂️', name: 'Organizing & Planning', desc: 'Keeps everything neat, tidy, and sorted — from notes to schedules to spaces.' }
  ],

  init() {
    // Set Year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Init Theme
    document.getElementById('themeToggleBtn').addEventListener('click', () => this.toggleTheme());
    
    // Init Mobile Menu
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('open');
      const isOpen = document.getElementById('mobileMenu').classList.contains('open');
      const icon = document.getElementById('menuIcon');
      // Replace menu icon with x icon if open
      icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      lucide.createIcons();
    });

    this.renderQuiz();
    this.renderSkills();

    // Initialize Lucide icons
    lucide.createIcons();
  },

  navigate(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(sec => {
      sec.classList.remove('active');
    });
    // Show active section
    document.getElementById(sectionId).classList.add('active');

    // Update Desktop Nav UI
    document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
      if(link.getAttribute('data-nav') === sectionId) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Update Mobile Nav UI
    document.querySelectorAll('.mobile-menu .mobile-nav-link').forEach(link => {
      if(link.getAttribute('data-nav-mobile') === sectionId) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Close mobile menu if open
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('menuIcon').setAttribute('data-lucide', 'menu');
    lucide.createIcons();

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentNav = sectionId;
  },

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    document.getElementById('themeLabel').textContent = this.currentTheme === 'light' ? 'Dark Theme' : 'Light Theme';
  },

  nextAffirmation() {
    this.affirmationIndex = (this.affirmationIndex + 1) % this.affirmations.length;
    document.getElementById('affirmationText').textContent = `"${this.affirmations[this.affirmationIndex]}"`;
  },

  // === QUIZ LOGIC ===
  renderQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    
    this.quizQuestions.forEach(q => {
      const item = document.createElement('div');
      item.className = 'quiz-item';
      
      const qText = document.createElement('p');
      qText.className = 'quiz-question-text cute-font';
      qText.textContent = `${q.id}. ${q.question}`;
      
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';
      
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = `quiz-option-btn ${this.userAnswers[q.id] === idx ? 'selected' : ''}`;
        btn.textContent = opt;
        btn.onclick = () => {
          this.userAnswers[q.id] = idx;
          this.renderQuiz(); // Re-render to update selected state
        };
        optionsDiv.appendChild(btn);
      });
      
      item.appendChild(qText);
      item.appendChild(optionsDiv);
      container.appendChild(item);
    });
  },

  checkQuizScore() {
    let score = 0;
    this.quizQuestions.forEach(q => {
      if (this.userAnswers[q.id] === q.correct) {
        score += 1;
      }
    });
    this.quizScore = score;
    
    const resBox = document.getElementById('quizResult');
    document.getElementById('quizScoreText').innerHTML = `Your Score: ${score} / ${this.quizQuestions.length} ✨`;
    
    let msg = "";
    if(score === this.quizQuestions.length) msg = "🎉 Wow, you really know me! You must be someone very special 🥰";
    else if(score >= 3) msg = "🧡 Not bad! Spend more time with me and you'll ace it next time!";
    else msg = "😄 We might need more ice cream dates for you to learn more about me!";
    
    document.getElementById('quizFeedbackText').textContent = msg;
    resBox.classList.add('show');
  },

  // === SKILLS LOGIC ===
  renderSkills() {
    const container = document.getElementById('skillsGrid');
    container.innerHTML = '';
    
    const filtered = this.skillsFilter === 'all' 
      ? this.skillsData 
      : this.skillsData.filter(s => s.category === this.skillsFilter);
      
    filtered.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'glass-card skill-card';
      card.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <h3 class="cute-font skill-name">${skill.name}</h3>
        <p class="skill-desc">${skill.desc}</p>
      `;
      container.appendChild(card);
    });
  },

  filterSkills(filterId) {
    this.skillsFilter = filterId;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if(btn.getAttribute('data-filter') === filterId) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    
    this.renderSkills();
  },

  // === CONTACT LOGIC ===
  handleUnlock(e) {
    e.preventDefault();
    const input = document.getElementById('passcodeInput').value;
    const clean = input.trim().toLowerCase();
    const errorPill = document.getElementById('errorPill');
    const msgText = document.getElementById('errorMsgText');
    
    if (clean === 'oranges121224') {
      // Success
      errorPill.classList.remove('show');
      document.getElementById('unlockForm').style.display = 'none';
      
      const lockIcon = document.getElementById('gatekeeperIcon');
      lockIcon.setAttribute('data-lucide', 'unlock');
      lockIcon.style.color = 'var(--accent-primary)';
      lucide.createIcons();
      
      document.getElementById('gatekeeperTitle').textContent = "Access Granted! 🧡";
      document.getElementById('unlockedDetails').classList.add('show');
      
      if(window.confetti) {
        confetti({
          particleCount: 60,
          spread: 80,
          colors: ['#FF7A38', '#FFA76B', '#FFD8B8']
        });
      }
    } else {
      // Error
      msgText.textContent = "🐱 Mochi says: 'Halt! Incorrect passcode. Only authorized friends allowed!'";
      errorPill.classList.add('show');
    }
  }
};

// Start application
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
