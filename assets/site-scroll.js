(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function resolveScrollId(id) {
    if (!id) return id;
    if (id === "nossa-historia") {
      return "top";
    }
    return id;
  }

  function getHeaderOffset() {
    var nav = document.querySelector("nav");
    if (nav) {
      return Math.ceil(nav.getBoundingClientRect().height) + 12;
    }
    return window.innerWidth < 768 ? 64 : 88;
  }

  function scrollToTarget(id) {
    id = resolveScrollId(id);

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
    id = resolveScrollId(id);

    if (id === "top") return window.scrollY < 20;

    var el = document.getElementById(id);
    if (!el) return false;

    var target = id === "nossa-historia" ? el.querySelector("h2") || el : el;
    var top = target.getBoundingClientRect().top;
    var offset = getHeaderOffset();
    return top <= offset + 16 && top >= offset - 48;
  }

  function runScroll() {
    var id = resolveScrollId(sessionStorage.getItem("ga-scroll"));
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

  window.gaResolveScrollId = resolveScrollId;

  window.gaScrollTo = scrollToTarget;

  /* Nossa História — coluna de imagens = altura do texto (até "próximos anos") */
  var historyResizeObserver = null;
  var historyResizeListener = false;

  function syncHistoryMediaHeight() {
    var section = document.querySelector(".nossa-historia-section");
    if (!section) return;

    var textCol = section.querySelector(".history-text-col");
    var media = section.querySelector(".site-history-media");
    if (!textCol || !media) return;

    if (window.innerWidth < 768) {
      media.style.height = "";
      media.style.maxHeight = "";
      return;
    }

    var height = Math.ceil(textCol.getBoundingClientRect().height);
    media.style.height = height + "px";
    media.style.maxHeight = height + "px";
  }

  function bindHistoryMediaSync() {
    var section = document.querySelector(".nossa-historia-section");
    if (!section) return;

    var textCol = section.querySelector(".history-text-col");
    if (!textCol) return;

    syncHistoryMediaHeight();

    if (typeof ResizeObserver !== "undefined") {
      if (!historyResizeObserver) {
        historyResizeObserver = new ResizeObserver(function () {
          syncHistoryMediaHeight();
        });
      }
      historyResizeObserver.disconnect();
      historyResizeObserver.observe(textCol);
    }

    if (!historyResizeListener) {
      historyResizeListener = true;
      window.addEventListener(
        "resize",
        function () {
          clearTimeout(window._gaHistorySyncT);
          window._gaHistorySyncT = setTimeout(syncHistoryMediaHeight, 100);
        },
        { passive: true }
      );
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncHistoryMediaHeight);
      }
    }
  }

  var historyMutationObserved = false;

  function watchHistorySection() {
    bindHistoryMediaSync();

    if (historyMutationObserved) return;

    var root = document.getElementById("root");
    if (!root || typeof MutationObserver === "undefined") return;

    historyMutationObserved = true;
    var obs = new MutationObserver(function () {
      if (document.querySelector(".nossa-historia-section")) {
        bindHistoryMediaSync();
      }
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  window.gaSyncHistoryMedia = syncHistoryMediaHeight;

  if (window.location.hash) {
    var legacyId = window.location.hash.replace("#", "");
    if (legacyId) {
      sessionStorage.setItem("ga-scroll", legacyId);
    }
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  document.addEventListener("DOMContentLoaded", function () {
    watchHistorySection();
    setTimeout(watchHistorySection, 300);
    setTimeout(runScroll, 100);
    setTimeout(runScroll, 500);
    setTimeout(runScroll, 1200);
  });

  window.addEventListener("load", function () {
    bindHistoryMediaSync();
    setTimeout(runScroll, 200);
  });
})();
