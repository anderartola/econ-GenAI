/* Economics of Generative AI — NeurIPS 2026
   Two small enhancements. The page works without either of them. */

(function () {
  "use strict";

  /* 1. Highlight the section currently in view in the sticky nav. */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.subnav a[href^="#"]')
  );
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var current = null;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (current === entry.target.id) return;
          current = entry.target.id;
          links.forEach(function (a) {
            var active = a.getAttribute("href") === "#" + current;
            if (active) { a.setAttribute("aria-current", "true"); }
            else { a.removeAttribute("aria-current"); }
          });
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* 2. SMIL ignores prefers-reduced-motion, so take the travelling token out
        of the diagram for readers who have asked for less movement. */
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var mover = document.querySelector(".lc-mover");
      if (mover) { mover.remove(); }
    }
  } catch (e) { /* matchMedia unavailable; leave the animation running */ }

  /* 3. If a portrait has not been added yet, show initials instead of a
        broken image. Drop a JPEG into assets/photos/ and this stops firing. */
  document.querySelectorAll("img[data-initials]").forEach(function (img) {
    img.addEventListener("error", function () {
      var fallback = document.createElement("div");
      fallback.className = "person__initials";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", img.alt);
      fallback.textContent = img.dataset.initials;
      img.replaceWith(fallback);
    });
  });
})();
