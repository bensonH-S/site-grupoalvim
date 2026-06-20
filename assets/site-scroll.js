(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  var HEADER_OFFSET = 88;

  function scrollToTarget(id) {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return true;
    }

    var el = document.getElementById(id);
    if (!el) return false;

    var y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    return true;
  }

  function isAtTarget(id) {
    if (id === "top") return window.scrollY < 20;
    var el = document.getElementById(id);
    if (!el) return false;
    var top = el.getBoundingClientRect().top;
    return top <= HEADER_OFFSET + 12 && top >= HEADER_OFFSET - 36;
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

      if (tries >= 30) {
        sessionStorage.removeItem("ga-scroll");
        clearInterval(timer);
      }
    }, 150);
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
    setTimeout(runScroll, 80);
  });
})();
