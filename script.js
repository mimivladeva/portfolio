/* ========================================
   MIMI VLADEVA PORTFOLIO - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initChat();
    initContactForm();
    initParallax();
});

/* ========================================
   NAVBAR
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navMenu = document.getElementById('nav-menu');
                const mobileToggle = document.getElementById('mobile-toggle');
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => { entry.target.classList.add('visible'); }, delay);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-card, .project-card, .fade-in').forEach(el => {
        observer.observe(el);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.section-header, .skill-category, .contact-item').forEach(el => {
        el.classList.add('fade-in');
        sectionObserver.observe(el);
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   AI CHAT — CONECTADO A CLAUDE API
   ======================================== */
function initChat() {
    const chatForm     = document.getElementById('chat-form');
    const chatInput    = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Historial de mensajes para mantener contexto de conversación
    const messageHistory = [];

    // System prompt: quién es Mimi y cómo debe responder la IA
    const SYSTEM_PROMPT = `Eres MimiAI, el asistente personal del portfolio de Mimi Vladeva.
Tu única función es responder preguntas sobre Mimi de forma amigable, breve y directa.

Aquí está toda la información sobre Mimi:

PERFIL:
- Estudiante de último año de Tecnologías Interactivas en la UPV Gandía (España)
- Especializada en conectar software con hardware: web, apps Android y robótica
- Habla español, inglés y búlgaro

HABILIDADES TÉCNICAS:
- Web: HTML, CSS, JavaScript, React, Responsive Design
- Mobile: Android Studio
- Bases de datos: Firebase, SQLite
- Robótica: ROS2, TurtleBot3, Arduino, Raspberry Pi
- Programación: Python, C, C++, MATLAB, Unity/C#
- Herramientas: Git, GitHub, metodologías ágiles (Scrum)

PROYECTOS DESTACADOS:
1. VG Detailing (vgdetailing.com) — Web completa para empresa de detailing de coches. Diseño, frontend, sistema de citas automatizado. Stack: HTML, CSS, JavaScript.
2. TFG — Robot con ESP32 y Sensor 6DOF — TurtleBot3 conectado a ESP32 y sensor de movimiento 6DOF para detectar intención del usuario. Stack: ROS2 Jazzy, Arduino, Python.
3. Zyndra — Robot guía para invidentes — TurtleBot3 con navegación autónoma y web con IA para seguimiento. Demo de perro guía robótico. Stack: ROS2, Python, Linux.
Ha desarrollado más de 13 proyectos en total, 8 de ellos en equipo.

CONTACTO:
- Email: vladevamimi@gmail.com
- GitHub: github.com/mimivladeva
- LinkedIn: linkedin.com/in/mimi-vladeva-a17080353

INSTRUCCIONES:
- Responde en el idioma en que te escriban (español, inglés o búlgaro)
- Sé conciso: máximo 3-4 frases por respuesta salvo que pidan más detalle
- Usa emojis con moderación para dar cercanía
- Si preguntan algo que no sabes de Mimi, sugiere contactarla directamente
- No inventes información que no esté en este perfil
- No respondas sobre temas que no sean Mimi o su trabajo`;

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `
            <div class="message-avatar"><span>${isUser ? 'Tú' : 'AI'}</span></div>
            <div class="message-content"><p>${content}</p></div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><span>AI</span></div>
            <div class="typing-indicator"><span></span><span></span><span></span></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    async function askClaude(userMessage) {
        // Añadir al historial
        messageHistory.push({ role: 'user', content: userMessage });

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    system: SYSTEM_PROMPT,
                    messages: messageHistory
                })
            });

            const data = await response.json();
            const reply = data.content?.[0]?.text || 'No he podido procesar tu pregunta. Inténtalo de nuevo.';

            // Guardar respuesta en historial para mantener contexto
            messageHistory.push({ role: 'assistant', content: reply });

            return reply;
        } catch (error) {
            console.error('Error llamando a Claude:', error);
            return 'Ha ocurrido un error. Puedes contactar a Mimi directamente en vladevamimi@gmail.com 📧';
        }
    }

    async function handleQuestion(question) {
        if (!question.trim()) return;

        addMessage(question, true);
        chatInput.value = '';
        chatInput.disabled = true;

        showTyping();

        const reply = await askClaude(question);

        removeTyping();
        addMessage(reply);

        chatInput.disabled = false;
        chatInput.focus();
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleQuestion(chatInput.value);
    });
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        emailjs.send("service_iapk9kq", "template_b5w3gfb", {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        })
            .then(() => {
                showNotification('¡Mensaje enviado! Te contactaré pronto.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.log(error);
                showNotification('Error al enviar el mensaje', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'success'
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500'
    });

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: rgba(255,255,255,0.2);
                border: none; color: white;
                width: 24px; height: 24px;
                border-radius: 50%; cursor: pointer;
                font-size: 16px; display: flex;
                align-items: center; justify-content: center;
                transition: background 0.2s;
            }
            .notification-close:hover { background: rgba(255,255,255,0.3); }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* ========================================
   PARALLAX
   ======================================== */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const floatingElements = document.querySelectorAll('.float-element');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
            const parallaxValue = scrollY * 0.4;
            const opacityValue = 1 - (scrollY / heroHeight);
            heroContent.style.transform = `translateY(${parallaxValue}px)`;
            heroContent.style.opacity = Math.max(opacityValue, 0);
            floatingElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    });
}

/* ========================================
   LANGUAGE SELECTOR
   ======================================== */
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ========================================
   STATS COUNTER
   ======================================== */
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    const update = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        if (!target) return;
        const increment = target / 9;
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(update, 20);
        } else {
            counter.innerText = target + "+";
        }
    };
    update();
});

/* ========================================
   CHAT BUBBLE TOGGLE
   ======================================== */
const bubble  = document.getElementById("chat-bubble");
const popup   = document.getElementById("chat-popup");
const closeBtn = document.getElementById("close-chat");

bubble.addEventListener("click", () => { popup.style.display = "flex"; });
closeBtn.addEventListener("click", () => { popup.style.display = "none"; });