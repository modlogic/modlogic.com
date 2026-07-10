// modlogic.com — small progressive-enhancement script (no framework, no build step)

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("hidden") === false;
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Sticky header shadow on scroll
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("shadow-lg", window.scrollY > 8);
      header.classList.toggle("bg-slate-950/90", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Contact form — submits to Formspree via fetch so the page never navigates away
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (form && formStatus) {
    const submitButton = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      submitButton.disabled = true;
      formStatus.textContent = "Sending…";
      formStatus.className = "text-sm text-slate-400";
      formStatus.classList.remove("hidden");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          formStatus.textContent = "Thanks — your message has been sent. We'll be in touch shortly.";
          formStatus.className = "text-sm text-emerald-400";
          form.reset();
        } else {
          const data = await response.json().catch(() => null);
          const message = data?.errors?.map((err) => err.message).join(", ");
          formStatus.textContent = message || "Something went wrong. Please try emailing us directly.";
          formStatus.className = "text-sm text-red-400";
        }
      } catch (err) {
        formStatus.textContent = "Something went wrong. Please try emailing us directly.";
        formStatus.className = "text-sm text-red-400";
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
