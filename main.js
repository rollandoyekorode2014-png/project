/**
 * Alashbal International School – main.js
 * All interactive behavior: nav, animations, forms, gallery, theme, language
 */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  
  /* ---------- Device picker ---------- */
  function detectDevice() {
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1100) return "tablet";
    return "desktop";
  }
  function applyDevice(device) {
    document.documentElement.setAttribute("data-device", device);
    try { localStorage.setItem("ais-device", device); } catch (e) {}
  }
  function hideDevicePicker() {
    const el = document.getElementById("devicePicker");
    if (!el) return;
    el.classList.add("is-hiding");
    setTimeout(() => {
      el.hidden = true;
      el.classList.remove("is-hiding");
    }, 400);
  }
  function showDevicePicker() {
    const el = document.getElementById("devicePicker");
    if (!el) return;
    // Skip if already chosen this session/persist
    let saved = null;
    try { saved = localStorage.getItem("ais-device"); } catch (e) {}
    // Always ask once per browser session unless they chose before
    const asked = sessionStorage.getItem("ais-device-asked");
    if (saved && asked) {
      applyDevice(saved);
      return;
    }
    el.hidden = false;
    el.querySelectorAll(".device-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = btn.getAttribute("data-device");
        applyDevice(d);
        try { sessionStorage.setItem("ais-device-asked", "1"); } catch (e) {}
        hideDevicePicker();
        if (typeof playClick === "function") try { playClick(); } catch (e) {}
      });
    });
    const skip = el.querySelector(".device-skip");
    if (skip) {
      skip.addEventListener("click", () => {
        applyDevice(detectDevice());
        try { sessionStorage.setItem("ais-device-asked", "1"); } catch (e) {}
        hideDevicePicker();
      });
    }
  }

  function initPreloader() {
    const pre = $(".preloader");
    const finish = () => {
      if (pre) pre.classList.add("hidden");
      setTimeout(showDevicePicker, 350);
      document.body.classList.add("loaded");
    };
    if (!pre) {
      document.body.classList.add("loaded");
      return;
    }
    window.addEventListener("load", () => {
      setTimeout(finish, prefersReduced ? 50 : 600);
    });
    // Fallback so content never stays invisible
    setTimeout(finish, 1800);
  }

  /* ---------- Theme (light / dark) ---------- */
  function initTheme() {
    const stored = localStorage.getItem("ais-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcons(theme);

    $$(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("ais-theme", next);
        updateThemeIcons(next);
      });
    });
  }

  function updateThemeIcons(theme) {
    $$(".theme-toggle").forEach((btn) => {
      const sun = btn.querySelector(".icon-sun");
      const moon = btn.querySelector(".icon-moon");
      if (sun && moon) {
        sun.style.display = theme === "dark" ? "block" : "none";
        moon.style.display = theme === "dark" ? "none" : "block";
      }
    });
  }

  /* ---------- Multi-language: EN / FR / AR / ZH / ES ---------- */
  const LANG_META = {
    en: { code: "EN", dir: "ltr", label: "English" },
    fr: { code: "FR", dir: "ltr", label: "Français" },
    ar: { code: "AR", dir: "rtl", label: "العربية" },
    zh: { code: "中文", dir: "ltr", label: "中文" },
    es: { code: "ES", dir: "ltr", label: "Español" },
  };

  const I18N = {
    en: {
      nav_home: "Home",
      device_eyebrow: "Welcome to AIS",
      device_title: "How are you browsing?",
      device_desc: "Choose your device so we can optimise the experience for you.",
      device_mobile: "Phone",
      device_mobile_hint: "Best for touch & small screens",
      device_tablet: "Tablet",
      device_tablet_hint: "Great for reading on the go",
      device_desktop: "Computer",
      device_desktop_hint: "Full layout & animations",
      device_skip: "Detect automatically",
      nav_about: "About",
      nav_academics: "Academics",
      nav_admissions: "Admissions",
      nav_student_life: "Student Life",
      nav_team: "Our Team",
      nav_contact: "Contact",
      btn_apply: "Apply Now",
      btn_login: "Parent/Student Login",
      btn_learn: "Learn More",
      btn_tour: "Book a Tour",
      btn_get_in_touch: "Get in Touch",
      btn_directions: "Get Directions",
      btn_explore_life: "Explore Student Life",
      btn_admissions: "Admissions Process",
      hero_tag: "Home of the Cubs · Doha, Qatar",
      hero_title: "Young Achievers of Today, Global Leaders of Tomorrow",
      hero_sub: "At Alashbal International School, we empower students to ask insightful questions, explore disciplinary boundaries, and confront conventional ways of thinking.",
      stat_founded: "Founded",
      stat_students: "Students",
      stat_location: "Qatar",
      stat_programs: "Programmes",
      section_purpose: "Our Purpose",
      section_mission_vision: "Mission & Vision",
      mission_title: "Mission",
      mission_text: "ALASHBAL International School (AIS) is committed to provide premium quality education and aims to develop the skills, talents, and intellectual intelligence of students as a solid foundation for future life.",
      vision_title: "Vision",
      vision_text: "ALASHBAL International School (AIS) envisions itself to be a prominent educational institution that is dedicated to nurture our brilliant YOUNG ACHIEVERS of today to be competitive global leaders of tomorrow.",
      from_head: "From the Head of School",
      welcome_title: "Welcome to Alashbal International School",
      welcome_p1: "It is with great pleasure and pride that I extend a warm welcome to you all to our vibrant and dynamic learning community at Alashbal International School (AIS). As the founding School Administrator, I am honored to lead an institution dedicated to excellence in education.",
      welcome_p2: "At AIS, we are committed to delivering a premium quality education that nurtures the intellectual intelligence, talents and skills of each student. Our rigorous academic programs are designed to inspire curiosity, critical thinking, and a lifelong love of learning. Through innovative teaching methods, and a diverse range of extracurricular activities and school events, we strive to cultivate well-rounded individuals who are prepared to thrive in an ever-changing global society.",
      read_full: "Read Full Message",
      beyond: "Beyond the Classroom",
      student_life_title: "Student Life",
      student_life_desc: "A well-rounded education involves academic excellence and a vibrant school experience for every Cub.",
      cta_begin: "Begin Your Child's Journey",
      cta_begin_sub: "Join a community of young achievers. Applications for the new academic year are open. Schedule a tour or start your application today.",
      stay_updated: "Stay Updated",
      news_events: "News & Events",
      visit_us: "Visit Us",
      visit_sub: "We would love to welcome you to our campus.",
      footer_about: "Alashbal International School – empowering young achievers to become global leaders.",
      footer_tagline: "Young Achievers of Today, Global Leaders of Tomorrow",
      footer_quick: "Quick Links",
      footer_admissions: "Admissions",
      footer_contact: "Contact",
      footer_copy: "© 2026 Alashbal International School. All rights reserved.",
      footer_cubs: "HOME of the CUBS",
      page_about: "About",
      page_about_title: "About Alashbal International School",
      page_about_sub: "Committed to Education · Home of the Cubs",
      page_academics: "Academics",
      page_academics_sub: "A diverse and dynamic curriculum designed to foster intellectual curiosity, critical thinking, and a love for learning.",
      page_admissions: "Admissions",
      page_admissions_title: "CUB Admissions",
      page_admissions_sub: "We are delighted that you are considering Alashbal International School for your child's educational journey.",
      page_apply: "Apply",
      page_apply_title: "Online Application",
      page_apply_sub: "Complete the form below to begin your child's application to Alashbal International School.",
      page_life: "Student Life",
      page_life_sub: "At AIS, student life extends far beyond the classroom. A well-rounded education involves academic excellence and a vibrant, engaging school experience.",
      page_team: "Our Team",
      page_team_sub: "At AIS, our staff members are the cornerstone of our educational excellence.",
      page_contact: "Contact",
      page_contact_title: "Contact Us",
      page_contact_sub: "We would love to hear from you. Reach out to schedule a tour or ask any questions.",
      leadership: "Leadership",
      school_leaders: "School Leaders",
      how_to_join: "How to Join",
      admission_process: "Admission Process",
      step_enquire: "Enquire",
      step_tour: "Tour",
      step_apply: "Apply",
      step_assessment: "Assessment",
      step_offer: "Offer",
      step_enrollment: "Enrollment",
      send_message: "Send a Message",
      form_name: "Name",
      form_email: "Email",
      form_phone: "Phone",
      form_subject: "Subject",
      form_message: "Message",
      form_send: "Send Message",
      address: "Address",
      phone: "Phone",
      email: "Email",
      office_hours: "Office Hours",
      follow_us: "Follow Us",
      skip: "Skip to main content",
      scroll: "Scroll",
            achieve_label: "Proud Moments",
      achieve_title: "Our Achievements",
      achieve_desc: "Celebrating the excellence of our Cubs in interschool competitions and beyond.",
      achieve_trophies: "Championship Trophies",
      achieve_trophies_sub: "Storytelling 2024 · 2nd Position · First Place awards across year categories",
      news_admissions_title: "Admissions Open",
      news_admissions_body: "We are delighted to welcome new families. Admissions are offered on a first-come, first-served basis.",
      news_cambridge_title: "Cambridge International School",
      news_cambridge_body: "AIS is proud to announce its status as a Cambridge International School, expanding opportunities for our Cubs.",
      news_community_title: "Community & Extracurriculars",
      news_community_body: "From sports to arts and leadership programmes, student life at AIS is rich and inclusive.",
      learn_more: "Learn more →",
      view_gallery: "View Gallery →",
      ongoing: "Ongoing",
      about_intro_1: "Founded in 2009, Alashbal International School has grown to become a vibrant educational community in Doha, Qatar.",
      about_intro_2: "At AIS, we offer a diverse and dynamic curriculum designed to foster intellectual curiosity, critical thinking, and a lifelong love of learning.",
      about_intro_3: "We invite you to explore our site and discover the academics and community Alashbal International School has to offer.",
      page_about_sub: "Committed to Education · Home of the Cubs",
      our_journey: "Our Journey",
      timeline_title: "Our Story",
      kg_desc: "Our Kindergarten programme nurtures curiosity and foundational skills in a warm, stimulating environment. Young Cubs develop social, emotional and early academic competencies through play-based and structured learning.",
      primary_desc: "Primary education at AIS builds strong academic foundations while encouraging inquiry, creativity and character development.",
      prep_desc: "Our Preparatory programme challenges students to think critically, collaborate and prepare for the next stage of their education under dedicated leadership.",
      step_enquire_desc: "Contact us or visit the campus to learn more about AIS and available places for your child.",
      step_tour_desc: "Schedule a school tour to experience our learning environment and meet the team.",
      step_apply_desc: "Submit an application form with complete details of your child to our admission office.",
      step_assessment_desc: "Once we have reviewed your application, we will schedule a written assessment test and parent interview with the child.",
      step_offer_desc: "Successful applicants receive an email. Parents are requested to complete a reservation form and secure a seat with the reservation fee.",
      step_enrollment_desc: "Complete enrollment formalities. The reservation fee is non-refundable and non-transferable but posted as registration fee.",
      team_intro: "Our team consists of highly trained professionals who bring a wealth of knowledge, expertise and dedication to every Cub.",
      role_admin: "School Administrator",
      role_principal: "School Principal",
      role_prep_principal: "Preparatory Principal",
      role_primary_coord: "Primary School Coordinator",
      role_kg_coord: "Kindergarten School Coordinator",
      role_prep_head: "Preparatory School Head Teacher",
      role_primary_head: "Primary School Head Teacher",
      role_kg_head: "Kindergarten School Head Teacher",
      form_response: "We typically respond within 1–2 business days.",
      form_thanks: "Thank you. We will get back to you soon.",
      grade_range: "Grade range:",
      achieve_label: "Fiers moments",
      achieve_title: "Nos réussites",
      achieve_desc: "Célébrer l'excellence de nos Cubs dans les compétitions interscolaires et au-delà.",
      achieve_trophies: "Trophées de championnat",
      achieve_trophies_sub: "Storytelling 2024 · 2e place · Premiers prix par catégories",
      news_admissions_title: "Admissions ouvertes",
      news_admissions_body: "Nous sommes ravis d'accueillir de nouvelles familles. Les admissions se font selon le principe du premier arrivé, premier servi.",
      news_cambridge_title: "École internationale Cambridge",
      news_cambridge_body: "AIS est fière d'annoncer son statut d'école internationale Cambridge, élargissant les opportunités pour nos Cubs.",
      news_community_title: "Communauté et extrascolaire",
      news_community_body: "Du sport aux arts et aux programmes de leadership, la vie scolaire à AIS est riche et inclusive.",
      learn_more: "En savoir plus →",
      view_gallery: "Voir la galerie →",
      ongoing: "En cours",
      about_intro_1: "Fondée en 2009, Alashbal International School est devenue une communauté éducative dynamique à Doha, Qatar.",
      about_intro_2: "À AIS, nous offrons un programme diversifié et dynamique conçu pour stimuler la curiosité intellectuelle, la pensée critique et l'amour de l'apprentissage.",
      about_intro_3: "Nous vous invitons à explorer notre site et à découvrir les académies et la communauté d'Alashbal International School.",
      page_about_sub: "Engagés pour l'éducation · Home of the Cubs",
      our_journey: "Notre parcours",
      timeline_title: "Notre histoire",
      kg_desc: "Notre programme de maternelle cultive la curiosité et les compétences fondamentales dans un environnement chaleureux et stimulant.",
      primary_desc: "L'enseignement primaire à AIS construit de solides bases académiques tout en encourageant la curiosité, la créativité et le développement du caractère.",
      prep_desc: "Notre programme préparatoire pousse les élèves à penser de façon critique, à collaborer et à se préparer à l'étape suivante sous une direction dédiée.",
      step_enquire_desc: "Contactez-nous ou visitez le campus pour en savoir plus sur AIS et les places disponibles.",
      step_tour_desc: "Planifiez une visite pour découvrir notre environnement d'apprentissage et rencontrer l'équipe.",
      step_apply_desc: "Soumettez un dossier complet de votre enfant au bureau des admissions.",
      step_assessment_desc: "Après examen du dossier, nous planifierons une évaluation écrite et un entretien avec les parents.",
      step_offer_desc: "Les candidats retenus reçoivent un e-mail. Les parents doivent compléter un formulaire de réservation.",
      step_enrollment_desc: "Finalisez les formalités d'inscription. Les frais de réservation sont non remboursables et non transférables.",
      team_intro: "Notre équipe regroupe des professionnels hautement qualifiés qui apportent savoir, expertise et dévouement à chaque Cub.",
      role_admin: "Administratrice de l'école",
      role_principal: "Directrice",
      role_prep_principal: "Directeur du cycle préparatoire",
      role_primary_coord: "Coordinatrice du primaire",
      role_kg_coord: "Coordinatrice de la maternelle",
      role_prep_head: "Enseignante principale – Préparatoire",
      role_primary_head: "Enseignante principale – Primaire",
      role_kg_head: "Enseignante principale – Maternelle",
      form_response: "Nous répondons généralement sous 1 à 2 jours ouvrables.",
      form_thanks: "Merci. Nous vous recontacterons bientôt.",
      grade_range: "Niveaux :",
      achieve_label: "لحظات نفتخر بها",
      achieve_title: "إنجازاتنا",
      achieve_desc: "نحتفل بتميز أشبالنا في المسابقات بين المدارس وما بعدها.",
      achieve_trophies: "كؤوس البطولة",
      achieve_trophies_sub: "سرد القصص 2024 · المركز الثاني · جوائز المركز الأول عبر الفئات",
      news_admissions_title: "القبول مفتوح",
      news_admissions_body: "يسعدنا استقبال عائلات جديدة. القبول حسب أسبقية التقديم.",
      news_cambridge_title: "مدرسة كامبريدج الدولية",
      news_cambridge_body: "تفخر AIS بالإعلان عن وضعها كمدرسة كامبريدج الدولية، مما يوسع الفرص لأشبالنا.",
      news_community_title: "المجتمع والأنشطة",
      news_community_body: "من الرياضة إلى الفنون وبرامج القيادة، حياة الطلاب في AIS غنية وشاملة.",
      learn_more: "اعرف المزيد ←",
      view_gallery: "عرض المعرض ←",
      ongoing: "جارٍ",
      about_intro_1: "تأسست مدرسة الأشبال الدولية عام 2009 ونمت لتصبح مجتمعاً تعليمياً نابضاً في الدوحة، قطر.",
      about_intro_2: "في AIS نقدم منهجاً متنوعاً وديناميكياً يعزز الفضول الفكري والتفكير النقدي وحب التعلم.",
      about_intro_3: "ندعوكم لاستكشاف موقعنا واكتشاف الأكاديميات والمجتمع في مدرسة الأشبال الدولية.",
      page_about_sub: "ملتزمون بالتعليم · موطن الأشبال",
      our_journey: "رحلتنا",
      timeline_title: "قصتنا",
      kg_desc: "برنامج رياض الأطفال ينمي الفضول والمهارات الأساسية في بيئة دافئة ومحفزة.",
      primary_desc: "التعليم الابتدائي في AIS يبني أسساً أكاديمية قوية مع تشجيع الاستكشاف والإبداع وتنمية الشخصية.",
      prep_desc: "البرنامج الإعدادي يتحدى الطلاب للتفكير النقدي والتعاون والاستعداد للمرحلة التالية تحت قيادة متخصصة.",
      step_enquire_desc: "تواصلوا معنا أو زوروا الحرم لمعرفة المزيد عن AIS والأماكن المتاحة لطفلكم.",
      step_tour_desc: "احجزوا جولة مدرسية للتعرف على بيئة التعلم ومقابلة الفريق.",
      step_apply_desc: "قدّموا استمارة التقديم مع بيانات طفلكم الكاملة لمكتب القبول.",
      step_assessment_desc: "بعد مراجعة الطلب سنحدد موعداً لاختبار كتابي ولقاء مع أولياء الأمور.",
      step_offer_desc: "يحصل المقبولون على بريد إلكتروني. يُطلب من أولياء الأمور إكمال نموذج الحجز.",
      step_enrollment_desc: "أكملوا إجراءات التسجيل. رسوم الحجز غير قابلة للاسترداد أو التحويل.",
      team_intro: "يتألف فريقنا من محترفين مدربين على أعلى مستوى يجلبون المعرفة والخبرة والتفاني لكل شبل.",
      role_admin: "مديرة المدرسة",
      role_principal: "المديرة",
      role_prep_principal: "مدير المرحلة الإعدادية",
      role_primary_coord: "منسقة المرحلة الابتدائية",
      role_kg_coord: "منسقة رياض الأطفال",
      role_prep_head: "معلمة رئيسية – إعدادي",
      role_primary_head: "معلمة رئيسية – ابتدائي",
      role_kg_head: "معلمة رئيسية – رياض أطفال",
      form_response: "نرد عادةً خلال يوم إلى يومي عمل.",
      form_thanks: "شكراً لكم. سنتواصل معكم قريباً.",
      grade_range: "المراحل:",
      achieve_label: "荣耀时刻",
      achieve_title: "我们的成就",
      achieve_desc: "庆祝幼狮们在校际竞赛及其他领域的卓越表现。",
      achieve_trophies: "冠军奖杯",
      achieve_trophies_sub: "2024 讲故事 · 第二名 · 各年级组第一名",
      news_admissions_title: "招生进行中",
      news_admissions_body: "我们热忱欢迎新家庭加入。招生按先到先得原则办理。",
      news_cambridge_title: "剑桥国际学校",
      news_cambridge_body: "AIS 很荣幸成为剑桥国际学校，为幼狮拓展更多机会。",
      news_community_title: "社区与课外活动",
      news_community_body: "从体育到艺术与领导力课程，AIS 的学生生活丰富多彩、包容开放。",
      learn_more: "了解更多 →",
      view_gallery: "查看图库 →",
      ongoing: "进行中",
      about_intro_1: "阿莱什巴尔国际学校创立于2009年，现已成为卡塔尔多哈充满活力的教育社区。",
      about_intro_2: "在AIS，我们提供多元而充满活力的课程，旨在培养求知欲、批判性思维与终身学习的热爱。",
      about_intro_3: "欢迎探索本网站，了解阿莱什巴尔国际学校的学术与社区。",
      page_about_sub: "致力于教育 · 幼狮之家",
      our_journey: "我们的历程",
      timeline_title: "我们的故事",
      kg_desc: "幼儿园课程在温馨而富有启发的环境中培养好奇心与基础能力。",
      primary_desc: "AIS小学教育夯实学术基础，同时鼓励探究、创造力与品格发展。",
      prep_desc: "预备课程挑战学生批判思考、协作，并在专业领导下为下一阶段学习做好准备。",
      step_enquire_desc: "联系我们或参观校园，了解AIS及孩子可申请的名额。",
      step_tour_desc: "预约学校参观，体验学习环境并与团队见面。",
      step_apply_desc: "向招生办公室提交完整的孩子申请资料。",
      step_assessment_desc: "审核申请后，我们将安排笔试评估与家长面谈。",
      step_offer_desc: "录取者将收到邮件。请家长填写预留名额表格。",
      step_enrollment_desc: "完成注册手续。预留费用不可退还、不可转让。",
      team_intro: "我们的团队由训练有素的专业人士组成，为每位幼狮带来知识、专长与奉献。",
      role_admin: "学校行政主管",
      role_principal: "校长",
      role_prep_principal: "预备部校长",
      role_primary_coord: "小学协调员",
      role_kg_coord: "幼儿园协调员",
      role_prep_head: "预备部主任教师",
      role_primary_head: "小学主任教师",
      role_kg_head: "幼儿园主任教师",
      form_response: "我们通常在1–2个工作日内回复。",
      form_thanks: "谢谢。我们会尽快与您联系。",
      grade_range: "年级范围：",
      achieve_label: "Momentos de orgullo",
      achieve_title: "Nuestros logros",
      achieve_desc: "Celebramos la excelencia de nuestros Cubs en competencias interescolares y más allá.",
      achieve_trophies: "Trofeos de campeonato",
      achieve_trophies_sub: "Storytelling 2024 · 2.º puesto · Primeros puestos por categorías",
      news_admissions_title: "Admisiones abiertas",
      news_admissions_body: "Nos complace dar la bienvenida a nuevas familias. Las admisiones son por orden de llegada.",
      news_cambridge_title: "Escuela Internacional Cambridge",
      news_cambridge_body: "AIS se enorgullece de anunciar su estatus como Escuela Internacional Cambridge, ampliando oportunidades para nuestros Cubs.",
      news_community_title: "Comunidad y extracurriculares",
      news_community_body: "Desde deportes hasta artes y programas de liderazgo, la vida estudiantil en AIS es rica e inclusiva.",
      learn_more: "Saber más →",
      view_gallery: "Ver galería →",
      ongoing: "En curso",
      about_intro_1: "Fundada en 2009, Alashbal International School se ha convertido en una vibrante comunidad educativa en Doha, Qatar.",
      about_intro_2: "En AIS ofrecemos un currículo diverso y dinámico diseñado para fomentar la curiosidad intelectual, el pensamiento crítico y el amor por el aprendizaje.",
      about_intro_3: "Le invitamos a explorar nuestro sitio y descubrir lo académico y la comunidad de Alashbal International School.",
      page_about_sub: "Comprometidos con la educación · Home of the Cubs",
      our_journey: "Nuestro camino",
      timeline_title: "Nuestra historia",
      kg_desc: "Nuestro programa de jardín de infancia cultiva la curiosidad y las habilidades fundamentales en un entorno cálido y estimulante.",
      primary_desc: "La educación primaria en AIS construye bases académicas sólidas mientras fomenta la indagación, la creatividad y el desarrollo del carácter.",
      prep_desc: "Nuestro programa preparatorio desafía a los estudiantes a pensar críticamente, colaborar y prepararse para la siguiente etapa bajo un liderazgo dedicado.",
      step_enquire_desc: "Contáctenos o visite el campus para saber más sobre AIS y las plazas disponibles para su hijo.",
      step_tour_desc: "Programe una visita para conocer nuestro entorno de aprendizaje y al equipo.",
      step_apply_desc: "Envíe el formulario de solicitud con los datos completos de su hijo a la oficina de admisiones.",
      step_assessment_desc: "Tras revisar la solicitud, programaremos una evaluación escrita y una reunión con los padres.",
      step_offer_desc: "Los admitidos reciben un correo. Se pide a los padres completar un formulario de reserva.",
      step_enrollment_desc: "Complete los trámites de inscripción. La cuota de reserva no es reembolsable ni transferible.",
      team_intro: "Nuestro equipo está formado por profesionales altamente capacitados que aportan conocimiento, experiencia y dedicación a cada Cub.",
      role_admin: "Administradora escolar",
      role_principal: "Directora",
      role_prep_principal: "Director de preparatoria",
      role_primary_coord: "Coordinadora de primaria",
      role_kg_coord: "Coordinadora de jardín de infancia",
      role_prep_head: "Maestra principal – Preparatoria",
      role_primary_head: "Maestra principal – Primaria",
      role_kg_head: "Maestra principal – Jardín",
      form_response: "Normalmente respondemos en 1–2 días hábiles.",
      form_thanks: "Gracias. Nos pondremos en contacto pronto.",
      grade_range: "Niveles:",
      news_apps_title: "Applications Open for AY 2026–27",
      explore_academics: "Explore Academics →",
      news_apps_title: "Candidatures ouvertes pour 2026–27",
      explore_academics: "Découvrir les programmes →",
      news_apps_title: "التقديم مفتوح للعام 2026–27",
      explore_academics: "استكشف البرامج الأكاديمية ←",
      news_apps_title: "2026–27学年招生开放",
      explore_academics: "探索学术课程 →",
      news_apps_title: "Solicitudes abiertas para 2026–27",
      explore_academics: "Explorar académicos →",
preloader: "Home of the Cubs",
    },
    fr: {
      nav_home: "Accueil",
      nav_about: "À propos",
      nav_academics: "Scolarité",
      nav_admissions: "Admissions",
      nav_student_life: "Vie scolaire",
      nav_team: "Notre équipe",
      nav_contact: "Contact",
      btn_apply: "Postuler",
      btn_login: "Espace parents/élèves",
      btn_learn: "En savoir plus",
      btn_tour: "Réserver une visite",
      btn_get_in_touch: "Nous contacter",
      btn_directions: "Itinéraire",
      btn_explore_life: "Découvrir la vie scolaire",
      btn_admissions: "Processus d'admission",
      hero_tag: "Home of the Cubs · Doha, Qatar",
      hero_title: "Jeunes accomplis d'aujourd'hui, leaders mondiaux de demain",
      hero_sub: "À Alashbal International School, nous donnons aux élèves les moyens de poser des questions pertinentes, d'explorer les frontières disciplinaires et de remettre en question les façons de penser conventionnelles.",
      stat_founded: "Fondée",
      stat_students: "Élèves",
      stat_location: "Qatar",
      stat_programs: "Programmes",
      section_purpose: "Notre mission",
      section_mission_vision: "Mission et vision",
      mission_title: "Mission",
      mission_text: "ALASHBAL International School (AIS) s'engage à offrir une éducation de qualité premium et vise à développer les compétences, talents et intelligence intellectuelle des élèves comme base solide pour la vie future.",
      vision_title: "Vision",
      vision_text: "ALASHBAL International School (AIS) se voit comme une institution éducative de premier plan, dédiée à faire de nos brillants JEUNES ACCOMPLIS d'aujourd'hui les leaders mondiaux compétitifs de demain.",
      from_head: "Message de la direction",
      welcome_title: "Bienvenue à Alashbal International School",
      welcome_p1: "C'est avec un grand plaisir et une grande fierté que je vous souhaite la bienvenue dans notre communauté d'apprentissage dynamique à Alashbal International School (AIS).",
      welcome_p2: "À AIS, nous nous engageons à offrir une éducation de qualité qui nourrit l'intelligence, les talents et les compétences de chaque élève. Nos programmes académiques rigoureux inspirent la curiosité, la pensée critique et l'amour de l'apprentissage tout au long de la vie.",
      read_full: "Lire le message complet",
      beyond: "Au-delà de la classe",
      student_life_title: "Vie scolaire",
      student_life_desc: "Une éducation complète allie excellence académique et expérience scolaire enrichissante pour chaque Cub.",
      cta_begin: "Commencez le parcours de votre enfant",
      cta_begin_sub: "Rejoignez une communauté de jeunes accomplis. Les candidatures pour la nouvelle année scolaire sont ouvertes.",
      stay_updated: "Restez informés",
      news_events: "Actualités et événements",
      visit_us: "Nous rendre visite",
      visit_sub: "Nous serions ravis de vous accueillir sur notre campus.",
      footer_about: "Alashbal International School – former les jeunes accomplis de demain.",
      footer_tagline: "Jeunes accomplis d'aujourd'hui, leaders mondiaux de demain",
      footer_quick: "Liens rapides",
      footer_admissions: "Admissions",
      footer_contact: "Contact",
      footer_copy: "© 2026 Alashbal International School. Tous droits réservés.",
      footer_cubs: "HOME of the CUBS",
      page_about: "À propos",
      page_about_title: "À propos d'Alashbal International School",
      page_about_sub: "Engagés pour l'éducation · Home of the Cubs",
      page_academics: "Scolarité",
      page_academics_sub: "Un programme diversifié et dynamique conçu pour stimuler la curiosité intellectuelle, la pensée critique et l'amour de l'apprentissage.",
      page_admissions: "Admissions",
      page_admissions_title: "Admissions CUB",
      page_admissions_sub: "Nous sommes ravis que vous envisagiez Alashbal International School pour le parcours éducatif de votre enfant.",
      page_apply: "Postuler",
      page_apply_title: "Candidature en ligne",
      page_apply_sub: "Remplissez le formulaire ci-dessous pour commencer la candidature de votre enfant.",
      page_life: "Vie scolaire",
      page_life_sub: "À AIS, la vie scolaire va bien au-delà de la salle de classe.",
      page_team: "Notre équipe",
      page_team_sub: "À AIS, notre personnel est la pierre angulaire de notre excellence éducative.",
      page_contact: "Contact",
      page_contact_title: "Nous contacter",
      page_contact_sub: "Nous serions ravis d'avoir de vos nouvelles. Contactez-nous pour une visite ou toute question.",
      leadership: "Direction",
      school_leaders: "Dirigeants de l'école",
      how_to_join: "Comment nous rejoindre",
      admission_process: "Processus d'admission",
      step_enquire: "Renseignement",
      step_tour: "Visite",
      step_apply: "Candidature",
      step_assessment: "Évaluation",
      step_offer: "Offre",
      step_enrollment: "Inscription",
      send_message: "Envoyer un message",
      form_name: "Nom",
      form_email: "E-mail",
      form_phone: "Téléphone",
      form_subject: "Sujet",
      form_message: "Message",
      form_send: "Envoyer",
      address: "Adresse",
      phone: "Téléphone",
      email: "E-mail",
      office_hours: "Horaires",
      follow_us: "Suivez-nous",
      skip: "Aller au contenu principal",
      scroll: "Défiler",
      preloader: "Home of the Cubs",
    },
    ar: {
      nav_home: "الرئيسية",
      nav_about: "من نحن",
      nav_academics: "الأكاديميات",
      nav_admissions: "القبول",
      nav_student_life: "حياة الطلاب",
      nav_team: "فريقنا",
      nav_contact: "اتصل بنا",
      btn_apply: "قدّم الآن",
      btn_login: "دخول أولياء الأمور/الطلاب",
      btn_learn: "اعرف المزيد",
      btn_tour: "احجز جولة",
      btn_get_in_touch: "تواصل معنا",
      btn_directions: "احصل على الاتجاهات",
      btn_explore_life: "استكشف حياة الطلاب",
      btn_admissions: "إجراءات القبول",
      hero_tag: "موطن الأشبال · الدوحة، قطر",
      hero_title: "متفوقو اليوم، قادة العالم غداً",
      hero_sub: "في مدرسة الأشبال الدولية، نمكّن الطلاب من طرح أسئلة عميقة واستكشاف حدود التخصصات ومواجهة أنماط التفكير التقليدية.",
      stat_founded: "تأسست",
      stat_students: "طلاب",
      stat_location: "قطر",
      stat_programs: "البرامج",
      section_purpose: "هدفنا",
      section_mission_vision: "الرسالة والرؤية",
      mission_title: "الرسالة",
      mission_text: "تلتزم مدرسة الأشبال الدولية (AIS) بتقديم تعليم عالي الجودة وتهدف إلى تطوير مهارات ومواهب والذكاء الفكري للطلاب كأساس متين للحياة المستقبلية.",
      vision_title: "الرؤية",
      vision_text: "تتصور مدرسة الأشبال الدولية نفسها مؤسسة تعليمية رائدة مكرسة لرعاية متفوقي اليوم ليصبحوا قادة عالميين منافسين في الغد.",
      from_head: "من مديرة المدرسة",
      welcome_title: "مرحباً بكم في مدرسة الأشبال الدولية",
      welcome_p1: "يسعدني ويفخرني أن أرحب بكم جميعاً في مجتمعنا التعليمي الحيوي والديناميكي في مدرسة الأشبال الدولية.",
      welcome_p2: "في AIS نلتزم بتقديم تعليم عالي الجودة يغذي الذكاء الفكري والمواهب والمهارات لكل طالب. برامجنا الأكاديمية تلهم الفضول والتفكير النقدي وحب التعلم مدى الحياة.",
      read_full: "اقرأ الرسالة كاملة",
      beyond: "ما وراء الفصل",
      student_life_title: "حياة الطلاب",
      student_life_desc: "التعليم الشامل يجمع التميز الأكاديمي وتجربة مدرسية نابضة لكل شبل.",
      cta_begin: "ابدأ رحلة طفلك",
      cta_begin_sub: "انضم إلى مجتمع المتفوقين. التقديم للعام الدراسي الجديد مفتوح.",
      stay_updated: "ابقَ على اطلاع",
      news_events: "الأخبار والفعاليات",
      visit_us: "زرنا",
      visit_sub: "يسعدنا استقبالكم في حرمنا المدرسي.",
      footer_about: "مدرسة الأشبال الدولية – تمكين المتفوقين ليصبحوا قادة عالميين.",
      footer_tagline: "متفوقو اليوم، قادة العالم غداً",
      footer_quick: "روابط سريعة",
      footer_admissions: "القبول",
      footer_contact: "اتصل بنا",
      footer_copy: "© 2026 مدرسة الأشبال الدولية. جميع الحقوق محفوظة.",
      footer_cubs: "موطن الأشبال",
      page_about: "من نحن",
      page_about_title: "عن مدرسة الأشبال الدولية",
      page_about_sub: "ملتزمون بالتعليم · موطن الأشبال",
      page_academics: "الأكاديميات",
      page_academics_sub: "منهج متنوع وديناميكي يعزز الفضول الفكري والتفكير النقدي وحب التعلم.",
      page_admissions: "القبول",
      page_admissions_title: "قبول الأشبال",
      page_admissions_sub: "يسعدنا اهتمامكم بمدرسة الأشبال الدولية لمسيرة طفلكم التعليمية.",
      page_apply: "التقديم",
      page_apply_title: "طلب التقديم الإلكتروني",
      page_apply_sub: "أكمل النموذج أدناه لبدء طلب تقديم طفلك.",
      page_life: "حياة الطلاب",
      page_life_sub: "في AIS تمتد حياة الطلاب إلى ما هو أبعد من الفصل الدراسي.",
      page_team: "فريقنا",
      page_team_sub: "في AIS، أعضاء هيئة التدريس هم ركيزة تميزنا التعليمي.",
      page_contact: "اتصل بنا",
      page_contact_title: "تواصل معنا",
      page_contact_sub: "يسعدنا سماعكم. تواصلوا معنا لحجز جولة أو لأي استفسار.",
      leadership: "القيادة",
      school_leaders: "قادة المدرسة",
      how_to_join: "كيف تنضم",
      admission_process: "إجراءات القبول",
      step_enquire: "استفسار",
      step_tour: "جولة",
      step_apply: "تقديم",
      step_assessment: "تقييم",
      step_offer: "عرض",
      step_enrollment: "تسجيل",
      send_message: "أرسل رسالة",
      form_name: "الاسم",
      form_email: "البريد الإلكتروني",
      form_phone: "الهاتف",
      form_subject: "الموضوع",
      form_message: "الرسالة",
      form_send: "إرسال",
      address: "العنوان",
      phone: "الهاتف",
      email: "البريد",
      office_hours: "ساعات العمل",
      follow_us: "تابعنا",
      skip: "انتقل إلى المحتوى الرئيسي",
      scroll: "مرّر",
      preloader: "موطن الأشبال",
    },
    zh: {
      nav_home: "首页",
      nav_about: "关于我们",
      nav_academics: "学术",
      nav_admissions: "招生",
      nav_student_life: "学生生活",
      nav_team: "我们的团队",
      nav_contact: "联系我们",
      btn_apply: "立即申请",
      btn_login: "家长/学生登录",
      btn_learn: "了解更多",
      btn_tour: "预约参观",
      btn_get_in_touch: "联系我们",
      btn_directions: "获取路线",
      btn_explore_life: "探索学生生活",
      btn_admissions: "招生流程",
      hero_tag: "幼狮之家 · 卡塔尔多哈",
      hero_title: "今日青年才俊，明日全球领袖",
      hero_sub: "在阿莱什巴尔国际学校，我们鼓励学生提出深刻问题、跨越学科边界，并挑战传统思维方式。",
      stat_founded: "创办于",
      stat_students: "学生",
      stat_location: "卡塔尔",
      stat_programs: "课程体系",
      section_purpose: "我们的宗旨",
      section_mission_vision: "使命与愿景",
      mission_title: "使命",
      mission_text: "阿莱什巴尔国际学校（AIS）致力于提供优质教育，培养学生的技能、才能与智力，为未来人生奠定坚实基础。",
      vision_title: "愿景",
      vision_text: "阿莱什巴尔国际学校愿成为卓越的教育机构，培养今日的杰出青年成为明日具有竞争力的全球领袖。",
      from_head: "校长寄语",
      welcome_title: "欢迎来到阿莱什巴尔国际学校",
      welcome_p1: "我怀着极大的喜悦与自豪，欢迎各位加入阿莱什巴尔国际学校充满活力的学习社区。",
      welcome_p2: "在AIS，我们致力于提供优质教育，培养每位学生的智力、才能与技能。我们严谨的学术课程旨在激发好奇心、批判性思维以及对终身学习的热爱。",
      read_full: "阅读全文",
      beyond: "课堂之外",
      student_life_title: "学生生活",
      student_life_desc: "全面的教育既包含学术卓越，也为每位幼狮提供丰富的校园体验。",
      cta_begin: "开启孩子的成长之旅",
      cta_begin_sub: "加入青年才俊的社区。新学年申请现已开放。",
      stay_updated: "保持关注",
      news_events: "新闻与活动",
      visit_us: "访问我们",
      visit_sub: "我们期待在校园迎接您。",
      footer_about: "阿莱什巴尔国际学校——赋能青年才俊成为全球领袖。",
      footer_tagline: "今日青年才俊，明日全球领袖",
      footer_quick: "快速链接",
      footer_admissions: "招生",
      footer_contact: "联系",
      footer_copy: "© 2026 阿莱什巴尔国际学校。保留所有权利。",
      footer_cubs: "幼狮之家",
      page_about: "关于我们",
      page_about_title: "关于阿莱什巴尔国际学校",
      page_about_sub: "致力于教育 · 幼狮之家",
      page_academics: "学术",
      page_academics_sub: "多元而充满活力的课程，旨在培养求知欲、批判性思维与学习热爱。",
      page_admissions: "招生",
      page_admissions_title: "幼狮招生",
      page_admissions_sub: "感谢您考虑为孩子选择阿莱什巴尔国际学校。",
      page_apply: "申请",
      page_apply_title: "在线申请",
      page_apply_sub: "请填写以下表格，开始孩子的入学申请。",
      page_life: "学生生活",
      page_life_sub: "在AIS，学生生活远不止于课堂。",
      page_team: "我们的团队",
      page_team_sub: "在AIS，教职员工是教育卓越的基石。",
      page_contact: "联系我们",
      page_contact_title: "联系我们",
      page_contact_sub: "我们期待您的来信。欢迎预约参观或提出任何问题。",
      leadership: "领导层",
      school_leaders: "学校领导",
      how_to_join: "如何加入",
      admission_process: "招生流程",
      step_enquire: "咨询",
      step_tour: "参观",
      step_apply: "申请",
      step_assessment: "评估",
      step_offer: "录取",
      step_enrollment: "注册",
      send_message: "发送消息",
      form_name: "姓名",
      form_email: "邮箱",
      form_phone: "电话",
      form_subject: "主题",
      form_message: "留言",
      form_send: "发送",
      address: "地址",
      phone: "电话",
      email: "邮箱",
      office_hours: "办公时间",
      follow_us: "关注我们",
      skip: "跳到主要内容",
      scroll: "滚动",
      preloader: "幼狮之家",
    },
    es: {
      nav_home: "Inicio",
      nav_about: "Nosotros",
      nav_academics: "Académico",
      nav_admissions: "Admisiones",
      nav_student_life: "Vida estudiantil",
      nav_team: "Nuestro equipo",
      nav_contact: "Contacto",
      btn_apply: "Solicitar ahora",
      btn_login: "Acceso padres/alumnos",
      btn_learn: "Saber más",
      btn_tour: "Reservar una visita",
      btn_get_in_touch: "Contactar",
      btn_directions: "Cómo llegar",
      btn_explore_life: "Explorar vida estudiantil",
      btn_admissions: "Proceso de admisión",
      hero_tag: "Home of the Cubs · Doha, Qatar",
      hero_title: "Jóvenes logros de hoy, líderes globales del mañana",
      hero_sub: "En Alashbal International School empoderamos a los estudiantes para hacer preguntas profundas, explorar fronteras disciplinarias y cuestionar formas convencionales de pensar.",
      stat_founded: "Fundada",
      stat_students: "Estudiantes",
      stat_location: "Qatar",
      stat_programs: "Programas",
      section_purpose: "Nuestro propósito",
      section_mission_vision: "Misión y visión",
      mission_title: "Misión",
      mission_text: "ALASHBAL International School (AIS) se compromete a brindar educación de calidad premium y a desarrollar las habilidades, talentos e inteligencia intelectual de los estudiantes como base sólida para la vida futura.",
      vision_title: "Visión",
      vision_text: "ALASHBAL International School (AIS) se visualiza como una institución educativa destacada dedicada a nutrir a nuestros brillantes JÓVENES LOGRADORES de hoy para que sean líderes globales competitivos del mañana.",
      from_head: "Mensaje de la dirección",
      welcome_title: "Bienvenidos a Alashbal International School",
      welcome_p1: "Con gran placer y orgullo les doy la bienvenida a nuestra vibrante comunidad de aprendizaje en Alashbal International School (AIS).",
      welcome_p2: "En AIS nos comprometemos a ofrecer una educación de calidad que nutre la inteligencia, los talentos y las habilidades de cada estudiante. Nuestros programas académicos rigurosos inspiran la curiosidad, el pensamiento crítico y el amor por el aprendizaje de por vida.",
      read_full: "Leer mensaje completo",
      beyond: "Más allá del aula",
      student_life_title: "Vida estudiantil",
      student_life_desc: "Una educación integral combina excelencia académica y una experiencia escolar vibrante para cada Cub.",
      cta_begin: "Comience el viaje de su hijo",
      cta_begin_sub: "Únase a una comunidad de jóvenes logros. Las solicitudes para el nuevo año académico están abiertas.",
      stay_updated: "Manténgase informado",
      news_events: "Noticias y eventos",
      visit_us: "Visítenos",
      visit_sub: "Nos encantaría darle la bienvenida a nuestro campus.",
      footer_about: "Alashbal International School – empoderando a jóvenes logros para ser líderes globales.",
      footer_tagline: "Jóvenes logros de hoy, líderes globales del mañana",
      footer_quick: "Enlaces rápidos",
      footer_admissions: "Admisiones",
      footer_contact: "Contacto",
      footer_copy: "© 2026 Alashbal International School. Todos los derechos reservados.",
      footer_cubs: "HOME of the CUBS",
      page_about: "Nosotros",
      page_about_title: "Sobre Alashbal International School",
      page_about_sub: "Comprometidos con la educación · Home of the Cubs",
      page_academics: "Académico",
      page_academics_sub: "Un currículo diverso y dinámico diseñado para fomentar la curiosidad intelectual, el pensamiento crítico y el amor por el aprendizaje.",
      page_admissions: "Admisiones",
      page_admissions_title: "Admisiones CUB",
      page_admissions_sub: "Nos complace que esté considerando Alashbal International School para el viaje educativo de su hijo.",
      page_apply: "Solicitar",
      page_apply_title: "Solicitud en línea",
      page_apply_sub: "Complete el formulario a continuación para iniciar la solicitud de su hijo.",
      page_life: "Vida estudiantil",
      page_life_sub: "En AIS, la vida estudiantil va mucho más allá del aula.",
      page_team: "Nuestro equipo",
      page_team_sub: "En AIS, nuestro personal es la piedra angular de nuestra excelencia educativa.",
      page_contact: "Contacto",
      page_contact_title: "Contáctenos",
      page_contact_sub: "Nos encantaría saber de usted. Contáctenos para programar una visita o cualquier consulta.",
      leadership: "Liderazgo",
      school_leaders: "Líderes escolares",
      how_to_join: "Cómo unirse",
      admission_process: "Proceso de admisión",
      step_enquire: "Consulta",
      step_tour: "Visita",
      step_apply: "Solicitud",
      step_assessment: "Evaluación",
      step_offer: "Oferta",
      step_enrollment: "Inscripción",
      send_message: "Enviar mensaje",
      form_name: "Nombre",
      form_email: "Correo",
      form_phone: "Teléfono",
      form_subject: "Asunto",
      form_message: "Mensaje",
      form_send: "Enviar",
      address: "Dirección",
      phone: "Teléfono",
      email: "Correo",
      office_hours: "Horario",
      follow_us: "Síguenos",
      skip: "Saltar al contenido principal",
      scroll: "Desplazar",
      preloader: "Home of the Cubs",
    },
  };

  function initLanguage() {
    const stored = localStorage.getItem("ais-lang") || "en";
    applyLang(stored);
    // second pass after layout (ensures all nodes exist)
    requestAnimationFrame(() => applyLang(stored));

    document.addEventListener("click", (e) => {
      const toggle = e.target.closest(".lang-toggle");
      const option = e.target.closest(".lang-menu [data-lang]");
      const switcher = e.target.closest(".lang-switcher");

      if (toggle) {
        e.stopPropagation();
        const menu = toggle.parentElement.querySelector(".lang-menu");
        const open = menu && !menu.hasAttribute("hidden");
        $$(".lang-menu").forEach((m) => m.setAttribute("hidden", ""));
        $$(".lang-toggle").forEach((b) => b.setAttribute("aria-expanded", "false"));
        if (menu && !open) {
          menu.removeAttribute("hidden");
          toggle.setAttribute("aria-expanded", "true");
        }
        return;
      }

      if (option) {
        const lang = option.getAttribute("data-lang");
        localStorage.setItem("ais-lang", lang);
        applyLang(lang);
        $$(".lang-menu").forEach((m) => m.setAttribute("hidden", ""));
        return;
      }

      if (!switcher) {
        $$(".lang-menu").forEach((m) => m.setAttribute("hidden", ""));
        $$(".lang-toggle").forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });
  }


  /* Full-page phrase book: exact English source -> translations */
  const PHRASES = {
    "Alashbal International": { fr: "Alashbal International", ar: "الأشبال الدولية", zh: "阿莱什巴尔国际学校", es: "Alashbal International" },
    "Home of the Cubs": { fr: "Home of the Cubs", ar: "موطن الأشبال", zh: "幼狮之家", es: "Home of the Cubs" },
    "Kindergarten": { fr: "Maternelle", ar: "رياض الأطفال", zh: "幼儿园", es: "Jardín de infancia" },
    "Primary": { fr: "Primaire", ar: "الابتدائي", zh: "小学", es: "Primaria" },
    "Preparatory": { fr: "Préparatoire", ar: "الإعدادي", zh: "预备部", es: "Preparatoria" },
    "Our Purpose": { fr: "Notre mission", ar: "هدفنا", zh: "我们的宗旨", es: "Nuestro propósito" },
    "Our Journey": { fr: "Notre parcours", ar: "رحلتنا", zh: "我们的历程", es: "Nuestro camino" },
    "Our Story": { fr: "Notre histoire", ar: "قصتنا", zh: "我们的故事", es: "Nuestra historia" },
    "How to Join": { fr: "Comment nous rejoindre", ar: "كيف تنضم", zh: "如何加入", es: "Cómo unirse" },
    "Admission Process": { fr: "Processus d'admission", ar: "إجراءات القبول", zh: "招生流程", es: "Proceso de admisión" },
    "What You Need": { fr: "Ce qu'il faut", ar: "ما تحتاجه", zh: "所需材料", es: "Lo que necesita" },
    "Required Documents": { fr: "Documents requis", ar: "المستندات المطلوبة", zh: "所需文件", es: "Documentos requeridos" },
    "Recent passport-sized photo of your child": { fr: "Photo récente format passeport de votre enfant", ar: "صورة حديثة بحجم جواز السفر لطفلك", zh: "孩子近期护照尺寸照片", es: "Foto reciente tamaño pasaporte de su hijo" },
    "Copy of child's passport / QID": { fr: "Copie du passeport / QID de l'enfant", ar: "نسخة من جواز سفر الطفل / البطاقة الشخصية", zh: "孩子护照/QID复印件", es: "Copia del pasaporte / QID del niño" },
    "Copy of parents' passports / QIDs": { fr: "Copie des passeports / QID des parents", ar: "نسخة من جوازات سفر الوالدين / البطاقات الشخصية", zh: "父母护照/QID复印件", es: "Copia de pasaportes / QID de los padres" },
    "Previous school reports (if applicable)": { fr: "Bulletins scolaires précédents (le cas échéant)", ar: "تقارير المدرسة السابقة (إن وجدت)", zh: "以往学校成绩单（如适用）", es: "Informes escolares previos (si aplica)" },
    "Immunization / health records": { fr: "Carnet de vaccination / dossier de santé", ar: "سجلات التطعيم / الصحة", zh: "疫苗接种/健康记录", es: "Registros de vacunación / salud" },
    "Completed application form": { fr: "Formulaire de candidature rempli", ar: "استمارة التقديم مكتملة", zh: "已填妥的申请表", es: "Formulario de solicitud completado" },
    "Student Information": { fr: "Informations sur l'élève", ar: "معلومات الطالب", zh: "学生信息", es: "Información del estudiante" },
    "Parent / Guardian Information": { fr: "Informations parent / tuteur", ar: "معلومات ولي الأمر", zh: "家长/监护人信息", es: "Información del padre/tutor" },
    "Additional Details": { fr: "Détails supplémentaires", ar: "تفاصيل إضافية", zh: "其他详情", es: "Detalles adicionales" },
    "Review & Submit": { fr: "Vérifier et envoyer", ar: "مراجعة وإرسال", zh: "确认并提交", es: "Revisar y enviar" },
    "Student full name": { fr: "Nom complet de l'élève", ar: "الاسم الكامل للطالب", zh: "学生全名", es: "Nombre completo del estudiante" },
    "Date of birth": { fr: "Date de naissance", ar: "تاريخ الميلاد", zh: "出生日期", es: "Fecha de nacimiento" },
    "Nationality": { fr: "Nationalité", ar: "الجنسية", zh: "国籍", es: "Nacionalidad" },
    "Gender": { fr: "Genre", ar: "الجنس", zh: "性别", es: "Género" },
    "Applying for grade / year": { fr: "Niveau demandé", ar: "الصف / السنة المطلوبة", zh: "申请年级", es: "Grado / año solicitado" },
    "Previous school (if any)": { fr: "École précédente (le cas échéant)", ar: "المدرسة السابقة (إن وجدت)", zh: "原就读学校（如有）", es: "Escuela anterior (si aplica)" },
    "Parent / Guardian full name": { fr: "Nom complet du parent / tuteur", ar: "اسم ولي الأمر الكامل", zh: "家长/监护人全名", es: "Nombre completo del padre/tutor" },
    "Relationship to student": { fr: "Lien avec l'élève", ar: "صلة القرابة", zh: "与学生关系", es: "Relación con el estudiante" },
    "Email address": { fr: "Adresse e-mail", ar: "البريد الإلكتروني", zh: "电子邮箱", es: "Correo electrónico" },
    "Phone number": { fr: "Numéro de téléphone", ar: "رقم الهاتف", zh: "电话号码", es: "Número de teléfono" },
    "Home address in Qatar": { fr: "Adresse au Qatar", ar: "عنوان المنزل في قطر", zh: "卡塔尔住址", es: "Dirección en Qatar" },
    "How did you hear about AIS?": { fr: "Comment avez-vous connu AIS ?", ar: "كيف سمعت عن AIS؟", zh: "您如何得知AIS？", es: "¿Cómo conoció AIS?" },
    "Any special educational needs or medical notes": { fr: "Besoins éducatifs particuliers ou notes médicales", ar: "احتياجات تعليمية خاصة أو ملاحظات طبية", zh: "特殊教育需求或医疗说明", es: "Necesidades educativas especiales o notas médicas" },
    "Additional comments": { fr: "Commentaires supplémentaires", ar: "تعليقات إضافية", zh: "其他备注", es: "Comentarios adicionales" },
    "Next": { fr: "Suivant", ar: "التالي", zh: "下一步", es: "Siguiente" },
    "Previous": { fr: "Précédent", ar: "السابق", zh: "上一步", es: "Anterior" },
    "Submit Application": { fr: "Envoyer la candidature", ar: "إرسال الطلب", zh: "提交申请", es: "Enviar solicitud" },
    "Book a school tour": { fr: "Réserver une visite", ar: "احجز جولة مدرسية", zh: "预约学校参观", es: "Reservar una visita" },
    "Office Hours": { fr: "Horaires", ar: "ساعات العمل", zh: "办公时间", es: "Horario" },
    "Sunday – Thursday": { fr: "Dimanche – Jeudi", ar: "الأحد – الخميس", zh: "周日 – 周四", es: "Domingo – Jueves" },
    "Send Message": { fr: "Envoyer", ar: "إرسال", zh: "发送", es: "Enviar" },
    "Your name": { fr: "Votre nom", ar: "اسمك", zh: "您的姓名", es: "Su nombre" },
    "Your email": { fr: "Votre e-mail", ar: "بريدك الإلكتروني", zh: "您的邮箱", es: "Su correo" },
    "Your phone": { fr: "Votre téléphone", ar: "هاتفك", zh: "您的电话", es: "Su teléfono" },
    "Subject": { fr: "Sujet", ar: "الموضوع", zh: "主题", es: "Asunto" },
    "Message": { fr: "Message", ar: "الرسالة", zh: "留言", es: "Mensaje" },
    "Name": { fr: "Nom", ar: "الاسم", zh: "姓名", es: "Nombre" },
    "Email": { fr: "E-mail", ar: "البريد", zh: "邮箱", es: "Correo" },
    "Phone": { fr: "Téléphone", ar: "الهاتف", zh: "电话", es: "Teléfono" },
    "Address": { fr: "Adresse", ar: "العنوان", zh: "地址", es: "Dirección" },
    "Follow Us": { fr: "Suivez-nous", ar: "تابعنا", zh: "关注我们", es: "Síguenos" },
    "Privacy": { fr: "Confidentialité", ar: "الخصوصية", zh: "隐私", es: "Privacidad" },
    "Terms": { fr: "Conditions", ar: "الشروط", zh: "条款", es: "Términos" },
    "School Activities": { fr: "Activités scolaires", ar: "أنشطة مدرسية", zh: "学校活动", es: "Actividades escolares" },
    "School Events": { fr: "Événements scolaires", ar: "فعاليات مدرسية", zh: "学校活动", es: "Eventos escolares" },
    "All": { fr: "Tout", ar: "الكل", zh: "全部", es: "Todos" },
    "Activities": { fr: "Activités", ar: "أنشطة", zh: "活动", es: "Actividades" },
    "Events": { fr: "Événements", ar: "فعاليات", zh: "活动", es: "Eventos" },
    "Sports": { fr: "Sports", ar: "رياضة", zh: "体育", es: "Deportes" },
    "Proud Moments": { fr: "Fiers moments", ar: "لحظات نفتخر بها", zh: "荣耀时刻", es: "Momentos de orgullo" },
    "Our Achievements": { fr: "Nos réussites", ar: "إنجازاتنا", zh: "我们的成就", es: "Nuestros logros" },
    "Leadership": { fr: "Direction", ar: "القيادة", zh: "领导层", es: "Liderazgo" },
    "School Leaders": { fr: "Dirigeants de l'école", ar: "قادة المدرسة", zh: "学校领导", es: "Líderes escolares" },
    "Programme levels": { fr: "Niveaux de programme", ar: "مستويات البرامج", zh: "课程阶段", es: "Niveles del programa" },
    "Grade range:": { fr: "Niveaux :", ar: "المراحل:", zh: "年级范围：", es: "Niveles:" },
    "Mostly made by Rolland": { fr: "Réalisé principalement par Rolland", ar: "أُنجز بشكل أساسي بواسطة Rolland", zh: "主要由 Rolland 制作", es: "Hecho principalmente por Rolland" },
    "Main Coder": { fr: "Développeur principal", ar: "المبرمج الرئيسي", zh: "主程序员", es: "Programador principal" },
    "Photographer": { fr: "Photographe", ar: "المصور", zh: "摄影师", es: "Fotógrafo" },
    "Interviewee": { fr: "Interviewé", ar: "مُقابَل", zh: "受访者", es: "Entrevistado" },
    "Bug Fixer": { fr: "Correcteur de bugs", ar: "مصلح الأخطاء", zh: "漏洞修复", es: "Corrector de errores" },
    "Rolland": { fr: "Rolland", ar: "Rolland", zh: "Rolland", es: "Rolland" },
    "Samuel": { fr: "Samuel", ar: "Samuel", zh: "Samuel", es: "Samuel" },
    "Daniel": { fr: "Daniel", ar: "Daniel", zh: "Daniel", es: "Daniel" },
    "Miguel": { fr: "Miguel", ar: "Miguel", zh: "Miguel", es: "Miguel" },
    "Grok AI": { fr: "Grok AI", ar: "Grok AI", zh: "Grok AI", es: "Grok AI" },
    "Old Airport Area along E-Ring Road, Doha, Qatar": { fr: "Old Airport Area, E-Ring Road, Doha, Qatar", ar: "منطقة المطار القديم على طريق الدائري الشرقي، الدوحة، قطر", zh: "多哈哈旧机场区域，东环路", es: "Old Airport Area, E-Ring Road, Doha, Qatar" },
    "Cambridge International School": { fr: "École internationale Cambridge", ar: "مدرسة كامبريدج الدولية", zh: "剑桥国际学校", es: "Escuela Internacional Cambridge" },
    "Community & Extracurriculars": { fr: "Communauté et extrascolaire", ar: "المجتمع والأنشطة", zh: "社区与课外活动", es: "Comunidad y extracurriculares" },
    "Admissions Open": { fr: "Admissions ouvertes", ar: "القبول مفتوح", zh: "招生进行中", es: "Admisiones abiertas" },
    "Championship Trophies": { fr: "Trophées de championnat", ar: "كؤوس البطولة", zh: "冠军奖杯", es: "Trofeos de campeonato" },
    "Math Quiz Bee 1st Place": { fr: "Quiz de maths – 1re place", ar: "مسابقة الرياضيات – المركز الأول", zh: "数学竞赛第一名", es: "Quiz de matemáticas – 1.er puesto" },
    "Year 3 · 2nd Place": { fr: "Année 3 · 2e place", ar: "السنة 3 · المركز الثاني", zh: "三年级 · 第二名", es: "Año 3 · 2.º puesto" },
    "Storytelling 2024": { fr: "Storytelling 2024", ar: "سرد القصص 2024", zh: "2024 讲故事", es: "Storytelling 2024" },
    "AY 2025–2026": { fr: "Année scolaire 2025–2026", ar: "العام الدراسي 2025–2026", zh: "2025–2026学年", es: "Año escolar 2025–2026" },
    "Send a Message": { fr: "Envoyer un message", ar: "أرسل رسالة", zh: "发送消息", es: "Enviar mensaje" },
    "Get in Touch": { fr: "Nous contacter", ar: "تواصل معنا", zh: "联系我们", es: "Contactar" },
    "Schedule a Tour": { fr: "Réserver une visite", ar: "احجز جولة", zh: "预约参观", es: "Reservar una visita" },
    "Male": { fr: "Garçon", ar: "ذكر", zh: "男", es: "Masculino" },
    "Female": { fr: "Fille", ar: "أنثى", zh: "女", es: "Femenino" },
    "Prefer not to say": { fr: "Préfère ne pas dire", ar: "يفضل عدم الإفصاح", zh: "不愿说明", es: "Prefiero no decir" },
    "Select grade": { fr: "Choisir le niveau", ar: "اختر الصف", zh: "选择年级", es: "Seleccionar grado" },
    "KG": { fr: "Maternelle", ar: "رياض الأطفال", zh: "幼儿园", es: "Jardín" },
    "Year 1": { fr: "Année 1", ar: "السنة 1", zh: "一年级", es: "Año 1" },
    "Year 2": { fr: "Année 2", ar: "السنة 2", zh: "二年级", es: "Año 2" },
    "Year 3": { fr: "Année 3", ar: "السنة 3", zh: "三年级", es: "Año 3" },
    "Year 4": { fr: "Année 4", ar: "السنة 4", zh: "四年级", es: "Año 4" },
    "Year 5": { fr: "Année 5", ar: "السنة 5", zh: "五年级", es: "Año 5" },
    "Year 6": { fr: "Année 6", ar: "السنة 6", zh: "六年级", es: "Año 6" },
    "Founded as a Pre-school with 37 pupils. The beginning of the AIS story – building a space where young learners could thrive.": {
      fr: "Fondée en tant que pré-scolaire avec 37 élèves. Le début de l'histoire d'AIS.",
      ar: "تأسست كروضة بـ 37 تلميذاً. بداية قصة AIS.",
      zh: "作为学前班创办，共有37名学生。AIS故事的开端。",
      es: "Fundada como preescolar con 37 alumnos. El comienzo de la historia de AIS."
    },
    "Primary school opened, expanding programmes from Nursery through Year 6.": {
      fr: "Ouverture de l'école primaire, programmes de la maternelle à l'année 6.",
      ar: "افتتاح المرحلة الابتدائية، من الحضانة إلى السنة 6.",
      zh: "小学部开放，课程从托班延伸至六年级。",
      es: "Se abrió la primaria, ampliando programas desde Nursery hasta Año 6."
    },
  };

  function translateTextTree(lang) {
    // Placeholders & titles
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((el) => {
      if (!el.hasAttribute("data-ph-src")) {
        el.setAttribute("data-ph-src", el.getAttribute("placeholder") || "");
      }
      const src = el.getAttribute("data-ph-src");
      if (lang === "en") {
        el.setAttribute("placeholder", src);
      } else if (PHRASES[src] && PHRASES[src][lang]) {
        el.setAttribute("placeholder", PHRASES[src][lang]);
      }
    });

    if (lang === "en") {
      document.querySelectorAll("[data-i18n-src]").forEach((el) => {
        // only restore if element is text-primary (no nested i18n spans conflict)
        if (!el.querySelector("[data-i18n]")) {
          el.textContent = el.getAttribute("data-i18n-src");
        }
      });
      return;
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "TEXTAREA", "INPUT"].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (p.closest(".lang-menu")) return NodeFilter.FILTER_REJECT;
        if (p.closest("[data-i18n]") || p.hasAttribute("data-i18n")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed) return;
      const parent = node.parentElement;
      if (parent && !parent.hasAttribute("data-i18n-src") && !parent.hasAttribute("data-i18n")) {
        // store original once on parent if single text child
        if (parent.childNodes.length === 1) {
          parent.setAttribute("data-i18n-src", trimmed);
        }
      }
      let translated = null;
      if (PHRASES[trimmed] && PHRASES[trimmed][lang]) {
        translated = PHRASES[trimmed][lang];
      } else {
        // try data-i18n-src restore path already handled
        const src = parent && parent.getAttribute("data-i18n-src");
        if (src && PHRASES[src] && PHRASES[src][lang]) {
          translated = PHRASES[src][lang];
        }
      }
      if (translated != null) {
        // preserve surrounding whitespace
        const lead = raw.match(/^\s*/)[0];
        const trail = raw.match(/\s*$/)[0];
        node.nodeValue = lead + translated + trail;
      }
    });
  }

  function applyLang(lang) {
    if (!I18N[lang]) lang = "en";
    const meta = LANG_META[lang];
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", meta.dir);

    $$(".lang-toggle .lang-code").forEach((el) => {
      el.textContent = meta.code;
    });
    $$(".lang-menu [data-lang]").forEach((li) => {
      li.classList.toggle("active", li.getAttribute("data-lang") === lang);
    });

    const dict = I18N[lang];
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!el.hasAttribute("data-i18n-en") && el.textContent.trim()) {
        el.setAttribute("data-i18n-en", el.textContent.trim());
      }
      if (dict[key] != null) {
        el.textContent = dict[key];
      } else if (lang === "en" && el.hasAttribute("data-i18n-en")) {
        el.textContent = el.getAttribute("data-i18n-en");
      }
    });
    $$("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    $$("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });

    translateTextTree(lang);
    /* lang toggle label */
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      const code = (lang || "en").toUpperCase();
      // keep icon if any, set text
      const label = btn.querySelector(".lang-code") || btn;
      if (btn.querySelector(".lang-code")) {
        btn.querySelector(".lang-code").textContent = code;
      } else {
        // button may be text-only
        const hasSvg = btn.querySelector("svg");
        if (!hasSvg) btn.textContent = code;
        else {
          // replace text nodes only
          btn.childNodes.forEach((n) => {
            if (n.nodeType === 3 && n.nodeValue.trim()) n.nodeValue = " " + code + " ";
          });
        }
      }
    });
    document.querySelectorAll(".lang-menu li").forEach((li) => {
      li.classList.toggle("active", li.getAttribute("data-lang") === lang);
    });



    // Hero title special case (word animation)
    const heroTitle = $(".hero-title");
    if (heroTitle && dict.hero_title) {
      heroTitle.setAttribute("data-text", dict.hero_title);
      if (!prefersReduced) {
        // re-run word reveal only if already processed
        const words = dict.hero_title.trim().split(/\s+/);
        heroTitle.innerHTML = "";
        words.forEach((word, i) => {
          const wrap = document.createElement("span");
          wrap.className = "word";
          const span = document.createElement("span");
          span.textContent = word;
          span.style.animationDelay = "0s";
          span.style.transform = "none";
          wrap.appendChild(span);
          heroTitle.appendChild(wrap);
          heroTitle.appendChild(document.createTextNode(" "));
        });
      } else {
        heroTitle.textContent = dict.hero_title;
      }
    }
  }

  /* ---------- Header scroll ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const bar = $(".scroll-progress");
    if (!bar) return;
    window.addEventListener(
      "scroll",
      () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = $(".menu-toggle");
    const menu = $(".mobile-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    $$("a", menu).forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 3D Tilt cards ---------- */
  function initTilt() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    $$(".tilt-card").forEach((card) => {
      const inner = card.querySelector(".tilt-inner") || card;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 12;
        const rotY = (x - 0.5) * 12;
        inner.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        inner.style.transform = "";
      });
    });
  }

  /* ---------- IntersectionObserver reveals ---------- */
  function initReveals() {
    if (prefersReduced) {
      $$(".reveal, .stagger, .section-title").forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal, .stagger, .section-title").forEach((el) => io.observe(el));
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = 1800;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);
            el.textContent = prefix + val.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + target.toLocaleString() + suffix;
          }
          if (prefersReduced) {
            el.textContent = prefix + target.toLocaleString() + suffix;
          } else {
            requestAnimationFrame(tick);
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Hero word reveal ---------- */
  function initHeroWords() {
    const title = $(".hero-title");
    if (!title) return;
    const text = (title.getAttribute("data-text") || title.textContent || "").trim();
    if (!text) return;
    if (prefersReduced) {
      title.textContent = text;
      return;
    }
    title.innerHTML = "";
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      const wrap = document.createElement("span");
      wrap.className = "word";
      const span = document.createElement("span");
      span.textContent = word;
      span.style.animationDelay = 0.35 + i * 0.07 + "s";
      // Failsafe: force visible after animation window
      span.addEventListener("animationend", () => {
        span.style.transform = "none";
        span.style.opacity = "1";
      });
      wrap.appendChild(span);
      title.appendChild(wrap);
      title.appendChild(document.createTextNode(" "));
    });
    // Global failsafe if animations blocked
    setTimeout(() => {
      title.querySelectorAll(".word span").forEach((s) => {
        s.style.transform = "none";
        s.style.opacity = "1";
      });
    }, 2500);
  }

  /* ---------- Parallax / mouse blobs ---------- */
  function initParallax() {
    if (prefersReduced) return;
    const hero = $(".hero");
    if (!hero) return;
    const blobs = $$(".blob", hero);
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((b, i) => {
        const speed = (i + 1) * 8;
        b.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  /* ---------- Floating Apply button ---------- */
  function initFloatApply() {
    const btn = $(".float-apply");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 600) btn.classList.add("visible");
        else btn.classList.remove("visible");
      },
      { passive: true }
    );
  }

  /* ---------- Tabs (Academics) ---------- */
  function initTabs() {
    const tabs = $$(".tab-btn");
    if (!tabs.length) return;
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        $$(".tab-panel").forEach((p) => {
          p.classList.toggle("active", p.id === target);
        });
      });
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    $$(".accordion-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const open = item.classList.contains("open");
        // Close others in same accordion
        const parent = item.closest(".accordion");
        if (parent) {
          $$(".accordion-item", parent).forEach((i) => {
            i.classList.remove("open");
            const b = i.querySelector(".accordion-btn");
            if (b) b.setAttribute("aria-expanded", "false");
          });
        }
        if (!open) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Gallery filter + lightbox ---------- */
  function initGallery() {
    const filters = $$(".filter-btn");
    const items = $$(".gallery-item");
    if (!items.length) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        items.forEach((item) => {
          const match = cat === "all" || item.getAttribute("data-category") === cat;
          item.classList.toggle("hide", !match);
        });
      });
    });

    // Lightbox
    const lb = $(".lightbox");
    if (!lb) return;
    const lbImg = $(".lightbox-img", lb);
    const lbCap = $(".lightbox-caption", lb);
    let currentIndex = 0;
    let visibleItems = [];

    function openLightbox(index) {
      visibleItems = items.filter((i) => !i.classList.contains("hide"));
      currentIndex = index;
      const item = visibleItems[currentIndex];
      if (!item) return;
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = img.alt || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    function navLightbox(dir) {
      currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = img.alt || "";
    }

    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        const visible = items.filter((it) => !it.classList.contains("hide"));
        const idx = visible.indexOf(item);
        openLightbox(idx >= 0 ? idx : i);
      });
    });

    $(".lightbox-close", lb)?.addEventListener("click", closeLightbox);
    $(".lightbox-prev", lb)?.addEventListener("click", () => navLightbox(-1));
    $(".lightbox-next", lb)?.addEventListener("click", () => navLightbox(1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    });
  }

  /* ---------- Multi-step form (Apply) ---------- */
  function initMultiStepForm() {
    const form = $("#apply-form");
    if (!form) return;

    const steps = $$(".form-step", form);
    const progressBar = $(".form-progress-bar");
    const progressSteps = $$(".progress-step");
    let current = 0;

    function showStep(n) {
      steps.forEach((s, i) => s.classList.toggle("active", i === n));
      progressSteps.forEach((ps, i) => {
        ps.classList.toggle("active", i === n);
        ps.classList.toggle("done", i < n);
      });
      if (progressBar) {
        progressBar.style.width = (n / (steps.length - 1)) * 100 + "%";
      }
      current = n;
      window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
    }

    function validateStep(n) {
      const step = steps[n];
      let valid = true;
      $$("[required]", step).forEach((input) => {
        const err = input.classList.contains("error");
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
        if (input.type === "email" && input.value) {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
          if (!ok) {
            input.classList.add("error");
            valid = false;
          }
        }
      });
      return valid;
    }

    $$(".form-next", form).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (validateStep(current) && current < steps.length - 1) {
          showStep(current + 1);
        }
      });
    });

    $$(".form-prev", form).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (current > 0) showStep(current - 1);
      });
    });

    // File upload UI
    const fileInput = $("#doc-upload");
    const fileZone = $(".file-upload");
    const fileName = $(".file-name");
    if (fileInput && fileZone) {
      fileZone.addEventListener("click", () => fileInput.click());
      fileZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileZone.classList.add("dragover");
      });
      fileZone.addEventListener("dragleave", () => fileZone.classList.remove("dragover"));
      fileZone.addEventListener("drop", (e) => {
        e.preventDefault();
        fileZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          if (fileName) fileName.textContent = e.dataTransfer.files[0].name;
        }
      });
      fileInput.addEventListener("change", () => {
        if (fileName && fileInput.files.length) {
          fileName.textContent = fileInput.files[0].name;
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Honeypot check
      const hp = form.querySelector(".honeypot input");
      if (hp && hp.value) return;

      if (!validateStep(current)) return;

      // Success state
      form.style.display = "none";
      const success = $(".form-success");
      if (success) success.classList.add("show");

      // Optional: mailto fallback
      // In production, replace with real endpoint
      const formData = new FormData(form);
      console.log("Application submitted (placeholder):", Object.fromEntries(formData));
    });

    showStep(0);
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const hp = form.querySelector(".honeypot input");
      if (hp && hp.value) return;

      let valid = true;
      $$("[required]", form).forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
      });
      if (!valid) return;

      const success = form.querySelector(".form-success") || $(".form-success");
      form.style.display = "none";
      if (success) {
        success.classList.add("show");
        success.style.display = "block";
      }
      console.log("Contact form submitted (placeholder)");
    });
  }

  /* ---------- Timeline draw on scroll ---------- */
  function initTimeline() {
    const line = $(".timeline-line");
    const timeline = $(".timeline");
    if (!line || !timeline) return;

    const items = $$(".timeline-item", timeline);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.3 }
    );
    items.forEach((item) => io.observe(item));

    window.addEventListener(
      "scroll",
      () => {
        const rect = timeline.getBoundingClientRect();
        const winH = window.innerHeight;
        const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH * 0.3), 0), 1);
        line.style.height = progress * 100 + "%";
      },
      { passive: true }
    );
  }

  /* ---------- Page transitions ---------- */
  function initPageTransitions() {
    if (prefersReduced) return;
    const overlay = $(".page-transition");
    if (!overlay) return;

    $$("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        link.target === "_blank"
      )
        return;

      link.addEventListener("click", (e) => {
        // Same page
        if (href === window.location.pathname.split("/").pop() || href === "./" || href === "index.html")
          return;
        e.preventDefault();
        overlay.classList.add("active");
        setTimeout(() => {
          window.location.href = href;
        }, 450);
      });
    });
  }

  /* ---------- Active nav link ---------- */
  function initActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    $$(".nav-desktop a, .mobile-menu a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Subtle SFX (optional) ---------- */
  let audioCtx = null;
  let soundEnabled = localStorage.getItem("ais-sound") === "on";

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function playTone(freqStart, freqEnd, duration, type, volume) {
    if (!soundEnabled || prefersReduced) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2400;
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freqStart, t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 40), t0 + duration);
      gain.gain.setValueAtTime(volume || 0.045, t0);
      gain.gain.exponentialRampToValueAtTime(0.0008, t0 + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (e) {}
  }

  function playClick() {
    // soft high tick + gentle body
    playTone(920, 640, 0.05, "sine", 0.035);
    setTimeout(() => playTone(380, 220, 0.07, "triangle", 0.02), 12);
  }

  function playPop() {
    playTone(660, 280, 0.1, "sine", 0.04);
    setTimeout(() => playTone(990, 700, 0.05, "triangle", 0.018), 20);
  }

  function playHoverSoft() {
    playTone(720, 560, 0.04, "sine", 0.012);
  }

  function initSound() {
    if (soundEnabled) document.body.classList.remove("sound-muted");
    else document.body.classList.add("sound-muted");

    $$(".sound-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem("ais-sound", soundEnabled ? "on" : "off");
        document.body.classList.toggle("sound-muted", !soundEnabled);
        if (soundEnabled) {
          ensureAudio();
          playPop();
        }
      });
    });

    document.addEventListener(
      "click",
      (e) => {
        const el = e.target.closest(
          "a.btn, button.btn, .tab-btn, .filter-btn, .accordion-btn, .nav-desktop a, .form-next, .form-prev, .magnetic, .lang-menu li"
        );
        if (el && !el.classList.contains("sound-toggle")) playClick();
      },
      true
    );

    // very soft hover tick on primary CTAs only
    $$("a.btn, button.btn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => playHoverSoft());
    });
  }

  /* ---------- Lightweight particle / grid background ---------- */
  function initParticles() {
    // Particle/grid background removed by request
    const canvas = $(".particle-canvas");
    if (canvas) canvas.style.display = "none";
    return;
    if (!canvas || prefersReduced) {
      if (canvas) canvas.style.display = "none";
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const particles = [];
    const COUNT = window.innerWidth < 700 ? 18 : 32;
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function spawn() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      const dot = dark ? "rgba(232,168,23,0.22)" : "rgba(30,58,95,0.16)";
      const line = dark ? "rgba(232,168,23,0.05)" : "rgba(30,58,95,0.04)";

      const step = 96;
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0 || pt.x > w) pt.vx *= -1;
        if (pt.y < 0 || pt.y > h) pt.vy *= -1;

        const dx = mouse.x - pt.x;
        const dy = mouse.y - pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 1) {
          pt.vx += dx * 0.00015;
          pt.vy += dy * 0.00015;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = pt.x - q.x;
          const ddy = pt.y - q.y;
          const d = ddx * ddx + ddy * ddy;
          if (d < 110 * 110) {
            ctx.beginPath();
            ctx.strokeStyle = line;
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();
    window.addEventListener("resize", () => {
      resize();
      spawn();
    });
    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );
  }

  /* ---------- Init all ---------- */
  function init() {
    initPreloader();
    initTheme();
    initLanguage();
    initHeader();
    initScrollProgress();
    initMobileMenu();
    initCursor();
    initMagnetic();
    initTilt();
    initReveals();
    initCounters();
    initHeroWords();
    initParallax();
    initFloatApply();
    initTabs();
    initAccordion();
    initGallery();
    initMultiStepForm();
    initContactForm();
    initTimeline();
    initPageTransitions();
    initActiveNav();
    initSound();
    initParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
