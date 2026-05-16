document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll('.site-nav-island a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];
const videoWrapper = document.querySelector(".video-wrapper");
const animatedSections = document.querySelectorAll("[data-animate-section]");
const flipCards = document.querySelectorAll("[data-flip-card]");

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

const setFlipCardState = (card, isFlipped) => {
  const frontFace = card.querySelector(".host-card__face--front");
  const backFace = card.querySelector(".host-card__face--back");

  card.classList.toggle("is-flipped", isFlipped);
  card.setAttribute("aria-pressed", String(isFlipped));
  card.setAttribute("aria-label", isFlipped ? card.dataset.backLabel : card.dataset.frontLabel);

  if (frontFace) {
    frontFace.setAttribute("aria-hidden", String(isFlipped));
  }

  if (backFace) {
    backFace.setAttribute("aria-hidden", String(!isFlipped));
  }
};

flipCards.forEach((card) => {
  setFlipCardState(card, false);

  card.addEventListener("click", () => {
    setFlipCardState(card, !card.classList.contains("is-flipped"));
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    setFlipCardState(card, !card.classList.contains("is-flipped"));
  });
});

if (animatedSections.length) {
  const revealSection = (section) => {
    section.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealSection(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.24 });

    animatedSections.forEach((section) => sectionObserver.observe(section));
  } else {
    animatedSections.forEach(revealSection);
  }
}

if (videoWrapper) {
  const playerScript = document.createElement("script");
  playerScript.src = "https://www.youtube.com/iframe_api";
  document.head.append(playerScript);

  videoWrapper.addEventListener("touchstart", () => {
    videoWrapper.classList.add("is-video-peeking");
  }, { passive: true });

  window.onYouTubeIframeAPIReady = () => {
    const iframe = document.querySelector("#highlight-reel-player");

    if (!iframe || !window.YT || !window.YT.Player) {
      return;
    }

    new window.YT.Player(iframe, {
      events: {
        onStateChange: (event) => {
          const isActive = event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.BUFFERING;
          videoWrapper.classList.toggle("is-video-active", isActive);
          videoWrapper.classList.toggle("is-video-peeking", isActive);
        },
      },
    });
  };
}

window.addEventListener("scroll", () => {
  window.requestAnimationFrame(() => {
    setActiveNavItem();
    setHeaderState();
  });
}, { passive: true });

window.addEventListener("resize", setActiveNavItem);

setActiveNavItem();
setHeaderState();
