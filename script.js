// ==========================================
// 1. OVERLAY & NAVIGATION LOGIC
// ==========================================
const overlay = document.getElementById('content-overlay');
const sections = document.querySelectorAll('.overlay .section');
const logo = document.querySelector('.logo');

const triggerLinks = document.querySelectorAll('a[href^="#"]');

triggerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
       if (targetSection) {
    overlay.classList.add('active');

    sections.forEach(sec => {
        sec.classList.remove('active-panel');
    });

    targetSection.classList.add('active-panel');
    overlay.scrollTo(0, 0);

    if (targetId === 'projects') {
        requestAnimationFrame(() => {
            initProjectScrollTriggers();
        });
    }
}
    });
});

if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            sections.forEach(sec => sec.classList.remove('active-panel'));
        }, 500);
    });
}

// ==========================================
// 2. TYPEWRITER EFFECT
// ==========================================
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    "MENTOR TECH", 
    "A Full-Stack Developer", 
    "A Mobile App Developer"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

// ==========================================
// 3. FADED MATRIX BACKGROUND 
// ==========================================
function initMatrix() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.15'; 
    canvas.style.pointerEvents = 'none';
    
    hero.insertBefore(canvas, hero.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]/\\'.split('');
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff73'; 
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            if (Math.random() > 0.6) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            }

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// ==========================================
// 4. CONTACT FORM HANDLING
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('FormSubmit requires an HTTP web server to send emails. Make sure you run via Live Server or npx serve.');
            }
        })
        .catch(error => {
            console.error('Submission Error:', error);
            alert('Could not submit form. Please verify your internet connection or server host.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}


/* ==========================================
   5. PROJECT FRAME ANIMATION ENGINE
   ========================================== */


/* ==========================================
   5. GSAP PINNED PROJECT STORYTELLING
   ========================================== */

function initProjectScrollTriggers() {
    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") {
        console.error("GSAP or ScrollTrigger is missing.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const overlay = document.getElementById("content-overlay");

    if (!overlay) return;

    const tracks = document.querySelectorAll(
        "#projects .project-scroll-track"
    );

    tracks.forEach((track, projectIndex) => {
        const wrapper = track.querySelector(
            ".sticky-viewport-wrapper"
        );

        const card = track.querySelector(".graphic-overview-card");

        const frames = Array.from(
            track.querySelectorAll(".project-frame")
        );

        if (!wrapper || !card || frames.length === 0) return;

        // Clean up only this project's previous timeline.
        if (track._projectTimeline) {
            if (track._projectTimeline.scrollTrigger) {
                track._projectTimeline.scrollTrigger.kill();
            }

            track._projectTimeline.kill();
            track._projectTimeline = null;
        }

        const triggerId = `portfolio-project-${projectIndex}`;

        const oldTrigger = ScrollTrigger.getById(triggerId);
        if (oldTrigger) oldTrigger.kill();

        // Reset every frame before creating a new timeline.
        frames.forEach((frame, index) => {
            frame.classList.toggle(
                "frame-active",
                index === 0
            );

            gsap.set(frame, {
                autoAlpha: index === 0 ? 1 : 0,
                y: index === 0 ? 0 : 35,
                pointerEvents: index === 0 ? "auto" : "none"
            });
        });

        // Four transitions for five frames.
        const timeline = gsap.timeline({
            defaults: {
                ease: "none"
            },
            scrollTrigger: {
                id: triggerId,
                trigger: track,
                scroller: overlay,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true
            }
        });

        frames.forEach((frame, index) => {
            if (index === 0) return;

            const previousFrame = frames[index - 1];
            const transitionStart = index - 1;

            // The incoming frame enters while the previous exits.
            timeline.set(frame, {
                pointerEvents: "auto"
            }, transitionStart);

            timeline.to(previousFrame, {
                autoAlpha: 0,
                y: -30,
                duration: 0.35
            }, transitionStart);

            timeline.fromTo(frame, {
                autoAlpha: 0,
                y: 35
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                immediateRender: false
            }, transitionStart + 0.15);

            // Hide the outgoing frame from mouse and keyboard interaction.
            timeline.set(previousFrame, {
                pointerEvents: "none"
            }, transitionStart + 0.5);
        });

        track._projectTimeline = timeline;
    });

    // Recalculate positions after the active panel becomes visible.
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });
}


        /*function changeFrame(direction) {
            const next = current + direction;

            // Never access a frame outside the valid range.
            if (next < 0 || next >= frames.length || locked) {
                return false;
            }

            locked = true;

            const outgoing = frames[current];
            const incoming = frames[next];

            current = next;

            incoming.classList.add("frame-active");

            gsap.set(incoming, {
                autoAlpha: 0,
                y: direction > 0 ? 45 : -45,
                pointerEvents: "none"
            });

            gsap.timeline({
                onComplete: () => {
                    locked = false;
                }
            })
            .to(outgoing, {
                autoAlpha: 0,
                y: direction > 0 ? -45 : 45,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    outgoing.classList.remove("frame-active");

                    gsap.set(outgoing, {
                        y: 0,
                        pointerEvents: "none"
                    });
                }
            }, 0)
            .to(incoming, {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
                onStart: () => {
                    incoming.style.pointerEvents = "auto";
                }
            }, 0.12);

            return true;
        }

        track._projectWheelHandler = event => {
            if (Math.abs(event.deltaY) < 8) return;

            const direction = event.deltaY > 0 ? 1 : -1;
            const next = current + direction;

            // At either end, let the overlay scroll naturally.
            if (next < 0 || next >= frames.length) return;

            // Prevent page scrolling only when changing frames.
            event.preventDefault();

            changeFrame(direction);
        };

        track.addEventListener(
            "wheel",
            track._projectWheelHandler,
            { passive: false }
        );
    });
}*/


function nextProject(button) {
    const track = button.closest(".project-scroll-track");
    const container = document.getElementById("projects-container");

    if (!track || !container) return;

    const tracks = Array.from(
        container.querySelectorAll(".project-scroll-track")
    );

    const index = tracks.indexOf(track);
    const next = tracks[(index + 1) % tracks.length];

    if (next) {
        next.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ==========================================
// 6. INTERSECTION OBSERVER CO-ORDINATORS
// ==========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    root: overlay, 
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
});

function resetReveals() {
    const reveals = document.querySelectorAll('.project-slide.active .reveal-item');
    
    reveals.forEach(el => {
        el.classList.remove('visible'); 
        revealObserver.observe(el);
    });

    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('visible');
            }
        });
    }, 200);
}

// ==========================================
// HAMBURGER MOBILE MENU TOGGLE
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links'); // Update this selector if your links container has a different class name

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu automatically when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}


// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    typeWriter();
    initMatrix();
});
