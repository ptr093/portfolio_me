// Czekamy na załadowanie config.js i EmailJS
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicjalizacja EmailJS z config
    emailjs.init(CONFIG.publicKey);

    // Scroll animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, observerOptions);
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Modal functions
    const modal = document.getElementById('contactModal');
    window.openModal = function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
    };
    window.closeModal = function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(()=> modal.style.display = 'none', 300);
    };
    window.onclick = function(e) { 
        if(e.target == modal) closeModal(); 
    };

    // 🎯 ZAAWANSOWANY PARSER EMAIL + WALIDACJA
    const emailInput = document.querySelector('input[name="reply_to"]');
    const validateEmail = (email) => {
        // Polski regex dla domen .pl + popularne providerzy
        const polishEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/;
        
        if (!polishEmailRegex.test(email)) {
            alert('Proszę podać poprawny email (np. jan@o2.pl, test@gmail.com)');
            emailInput.focus();
            return false;
        }
        
        // Dodatkowa walidacja dla polskich domen
        const polishDomains = ['o2.pl', 'wp.pl', 'interia.pl', 'onet.pl', 'gmail.com', 'yahoo.com'];
        const domain = email.split('@')[1];
        if (!polishDomains.includes(domain) && !domain.endsWith('.pl')) {
            alert('Email musi być z polskiej domeny (.pl) lub Gmail/Yahoo');
            emailInput.focus();
            return false;
        }
        
        return true;
    };

    // Wysyłanie maila z WALIDACJĄ
    document.getElementById('contactForm').onsubmit = function(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const formData = new FormData(e.target);
        
        // 🚀 WALIDACJA EMAIL PRZED WYSŁANIEM
        const userEmail = e.target.querySelector('input[name="reply_to"]').value;
        if (!validateEmail(userEmail)) {
            btn.textContent = 'Wyślij wiadomość';
            btn.disabled = false;
            return;
        }

        btn.textContent = 'Wysyłanie...';
        btn.disabled = true;

        // DODAJEMY TWOJĄ DOMENĘ DO PARAMETRÓW
        const params = {
            from_name: e.target.querySelector('input[name="from_name"]').value,
            reply_to: userEmail,
            message: e.target.querySelector('textarea[name="message"]').value,
            website: 'patryk-rab.pl'  // ← TWOJA Domena (zmień na swoją!)
        };

        emailjs.send('service_7vw0n3r', 'template_8qvbvnc', params)
            .then((result) => {
                alert('✅ Dzięki za wiadomość! Odpiszę w ciągu 24h na: ' + userEmail);
                e.target.reset();
                closeModal();
            }, (error) => {
                console.error('EmailJS error:', error);
                alert('❌ Błąd wysyłania. Sprawdź email lub napisz bezpośrednio: patryk@example.com');
            })
            .finally(() => {
                btn.textContent = 'Wyślij wiadomość';
                btn.disabled = false;
            });
    };

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
