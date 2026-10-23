 const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

const root = document.documentElement;
const header = $("header");
const menuBtn = $("#menuBtn");
const links = $("#links");
const themeBtn = $("#themeBtn");
const toTop = $("#toTop");

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#yr")?.textContent;

if ($("#yr")) {
    $("#yr").textContent = new Date().getFullYear();
}

const toast = document.createElement("div");

toast.id = "portfolioToast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");

Object.assign(toast.style, {
    position: "fixed",
    bottom: "25px",
    left: "50%",
    transform: "translate(-50%, 20px)",
    padding: "12px 20px",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--gold)",
    borderRadius: "12px",
    boxShadow: "var(--shadow)",
    zIndex: "9999",
    opacity: "0",
    visibility: "hidden",
    transition: "opacity .25s, transform .25s",
    maxWidth: "90%",
    textAlign: "center",
    fontSize: "14px"
});

document.body.appendChild(toast);

let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, 0)";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%, 20px)";

        setTimeout(() => {
            toast.style.visibility = "hidden";
        }, 300);
    }, 2600);
}

function setTheme(theme) {
    root.dataset.theme = theme;

    if (themeBtn) {
        const isDark = theme === "dark";

        themeBtn.textContent = isDark ? "☀" : "☾";

        themeBtn.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeBtn.title =
            isDark ? "Switch to light mode" : "Switch to dark mode";
    }

    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
    }
}

let savedTheme = "dark";

try {
    savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark");
} catch (error) {}

setTheme(savedTheme);

themeBtn?.addEventListener("click", () => {
    const next =
        root.dataset.theme === "light" ? "dark" : "light";

    setTheme(next);

    showToast(
        next === "dark"
            ? "Dark mode enabled"
            : "Light mode enabled"
    );
});

const progressBar = document.createElement("div");

Object.assign(progressBar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "3px",
    width: "0%",
    background: "linear-gradient(90deg, var(--red), var(--gold))",
    zIndex: "9998",
    transition: "width .1s linear",
    pointerEvents: "none"
});

progressBar.setAttribute("aria-hidden", "true");

document.body.appendChild(progressBar);

function updateProgress() {
    const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        scrollable > 0
            ? (window.scrollY / scrollable) * 100
            : 0;

    progressBar.style.width = `${progress}%`;
}

function closeMenu() {
    links?.classList.remove("open");

    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", "Open menu");
}

menuBtn?.setAttribute("aria-expanded", "false");

menuBtn?.addEventListener("click", () => {
    const isOpen = links?.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(!!isOpen));

    menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
});

$$("#links a").forEach(link => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

document.addEventListener("click", event => {
    if (
        links?.classList.contains("open") &&
        !links.contains(event.target) &&
        !menuBtn?.contains(event.target)
    ) {
        closeMenu();
    }
});

const sections = $$("main section[id]");
const navLinks = $$("#links a");

function onScroll() {
    header?.classList.toggle("scrolled", window.scrollY > 20);

    toTop?.classList.toggle("show", window.scrollY > 500);

    updateProgress();

    let current = "";

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        const active =
            link.getAttribute("href") === `#${current}`;

        link.classList.toggle("active", active);

        if (active) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", onScroll, {
    passive: true
});

window.addEventListener("resize", onScroll);

onScroll();

toTop?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    showToast("Back to the top!");
});

const roles = [
    "Computer Science Student",
    "Python & C Programmer",
    "Aspiring Software Developer",
    "Frontend Web Developer"
];

const typed = $("#typed");

if (typed) {
    if (prefersReducedMotion) {
        typed.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeRole() {
            const word = roles[roleIndex];

            typed.textContent = word.slice(0, charIndex);

            if (!deleting && charIndex === word.length) {
                deleting = true;
                setTimeout(typeRole, 1500);
                return;
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            charIndex += deleting ? -1 : 1;

            setTimeout(
                typeRole,
                deleting ? 35 : 75
            );
        }

        typeRole();
    }
}

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("show");
    });
}

function animateSkillBars() {
    $$(".bar i").forEach(bar => {
        const width = Number(bar.dataset.w);

        if (Number.isFinite(width)) {
            bar.style.width =
                `${Math.max(0, Math.min(100, width))}%`;
        }
    });
}

if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                $$(".bar i", entry.target).forEach(bar => {
                    const width = Number(bar.dataset.w);

                    if (Number.isFinite(width)) {
                        bar.style.width =
                            `${Math.max(0, Math.min(100, width))}%`;
                    }
                });

                skillObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.2 }
    );

    $$(".skills-grid").forEach(element => {
        skillObserver.observe(element);
    });
} else {
    animateSkillBars();
}

function countUp(element) {
    const target = Number(element.dataset.count);

    if (!Number.isFinite(target) || target < 0) return;

    if (prefersReducedMotion) {
        element.textContent =
            target + (target > 4 ? "+" : "");
        return;
    }

    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(now) {
        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        const value = Math.floor(target * progress);

        element.textContent =
            value + (target > 4 ? "+" : "");

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                countUp(entry.target);

                counterObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    $$("[data-count]").forEach(element => {
        counterObserver.observe(element);
    });
} else {
    $$("[data-count]").forEach(countUp);
}

const emailLink = $(
    '.c-item a[href^="mailto:"]'
);

if (emailLink) {
    const copyBtn = document.createElement("button");

    copyBtn.type = "button";
    copyBtn.textContent = "Copy email";
    copyBtn.className = "btn";

    copyBtn.style.marginTop = "10px";
    copyBtn.style.padding = "7px 12px";
    copyBtn.style.fontSize = "12px";

    emailLink.parentElement.appendChild(copyBtn);

    copyBtn.addEventListener("click", async () => {
        const email = emailLink.textContent.trim();

        try {
            await navigator.clipboard.writeText(email);

            copyBtn.textContent = "Copied! ✓";

            showToast("Email address copied!");

            setTimeout(() => {
                copyBtn.textContent = "Copy email";
            }, 2000);
        } catch (error) {
            showToast(
                "Copy unavailable. Select the email address manually."
            );
        }
    });
}

const contactForm = $("#contactForm");

contactForm?.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#n")?.value.trim() || "";
    const email = $("#e")?.value.trim() || "";
    const message = $("#m")?.value.trim() || "";

    if (!name || !email || !message) {
        showToast("Please complete all fields.");
        return;
    }

    const emailInput = $("#e");

    if (emailInput && !emailInput.validity.valid) {
        emailInput.reportValidity();
        return;
    }

    const subject = encodeURIComponent(
        `Portfolio enquiry from ${name}`
    );

    const body = encodeURIComponent(
        `Hello Sri Rama Krishnan,\n\n${message}\n\n` +
        `From: ${name}\nEmail: ${email}`
    );

    const mailto =
        `mailto:sriramakrishnan9486@gmail.com` +
        `?subject=${subject}&body=${body}`;

    showToast("Opening your email application...");

    window.location.href = mailto;
});

const messageInput = $("#m");

if (messageInput) {
    const counter = document.createElement("small");

    counter.style.display = "block";
    counter.style.textAlign = "right";
    counter.style.color = "var(--muted)";
    counter.setAttribute("aria-live", "polite");

    messageInput.maxLength = 1000;

    messageInput.insertAdjacentElement("afterend", counter);

    function updateMessageCount() {
        counter.textContent =
            `${messageInput.value.length}/1000 characters`;
    }

    messageInput.addEventListener(
        "input",
        updateMessageCount
    );

    updateMessageCount();
}

contactForm?.addEventListener("reset", () => {
    showToast("Form cleared.");

    setTimeout(() => {
        const counter = messageInput?.nextElementSibling;

        if (
            counter &&
            messageInput?.maxLength === 1000
        ) {
            counter.textContent =
                `${messageInput.value.length}/1000 characters`;
        }
    }, 0);
});

window.addEventListener("load", () => {
    onScroll();
});

console.log(
    "Portfolio interactive features loaded successfully!"
);