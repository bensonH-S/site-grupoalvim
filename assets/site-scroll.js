(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function getHeaderOffset() {
    var nav = document.querySelector("nav");
    if (nav) {
      return Math.ceil(nav.getBoundingClientRect().height) + 12;
    }
    return window.innerWidth < 768 ? 64 : 88;
  }

  function scrollToTarget(id) {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return true;
    }

    var el = document.getElementById(id);
    if (!el) return false;

    var target = el;
    if (id === "nossa-historia") {
      target = el.querySelector("h2") || el;
    }

    var offset = getHeaderOffset();
    var y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    return true;
  }

  function isAtTarget(id) {
    if (id === "top") return window.scrollY < 20;

    var el = document.getElementById(id);
    if (!el) return false;

    var target = id === "nossa-historia" ? el.querySelector("h2") || el : el;
    var top = target.getBoundingClientRect().top;
    var offset = getHeaderOffset();
    return top <= offset + 16 && top >= offset - 48;
  }

  function runScroll() {
    var id = sessionStorage.getItem("ga-scroll");
    if (!id) return;

    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      scrollToTarget(id);

      if (isAtTarget(id)) {
        sessionStorage.removeItem("ga-scroll");
        clearInterval(timer);
        return;
      }

      if (tries >= 50) {
        sessionStorage.removeItem("ga-scroll");
        clearInterval(timer);
      }
    }, 120);
  }

  window.gaRunScroll = runScroll;

  window.gaSetScroll = function (id) {
    if (id) sessionStorage.setItem("ga-scroll", id);
  };

  window.gaScrollTo = scrollToTarget;

  if (window.location.hash) {
    var legacyId = window.location.hash.replace("#", "");
    if (legacyId) sessionStorage.setItem("ga-scroll", legacyId);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(runScroll, 100);
    setTimeout(runScroll, 500);
    setTimeout(runScroll, 1200);
  });

  window.addEventListener("load", function () {
    setTimeout(runScroll, 200);
  });
})();
