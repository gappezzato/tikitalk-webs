const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll('.site-nav-island a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const setActiveNavItem = () => {
  const scrollPosition = window.scrollY + 150;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    const isCurrent = currentSection && link.getAttribute("href") === `#${currentSection.id}`;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("site-header--scrolled", window.scrollY > 24);
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.querySelector('input[type="email"]');
  const feedback = form.querySelector(".form-feedback");
  const formName = form.dataset.formName === "club" ? "Club request" : "Newsletter signup";

  if (!input || !feedback) {
    return;
  }

  feedback.textContent = `${formName} saved for ${input.value}. You are on the list for the next drop.`;
  input.value = "";
};

document.querySelectorAll("form[data-form-name]").forEach((form) => {
  form.addEventListener("submit", handleFormSubmit);
});

window.addEventListener("scroll", () => {
  window.requestAnimationFrame(() => {
    setActiveNavItem();
    setHeaderState();
  });
}, { passive: true });

window.addEventListener("resize", setActiveNavItem);

setActiveNavItem();
setHeaderState();
