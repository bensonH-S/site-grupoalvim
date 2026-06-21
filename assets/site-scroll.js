(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  var activeScrollTimer = null;
  var activeScrollCleanup = null;

  function resolveScrollId(id) {
    if (!id) return id;
    if (id === "nossa-historia") return "top";
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

  function abortActiveScroll() {
    if (activeScrollTimer) {
      clearTimeout(activeScrollTimer);
      activeScrollTimer = null;
    }
    if (activeScrollCleanup) {
      activeScrollCleanup();
      activeScrollCleanup = null;
    }
  }

  function runScroll() {
    var id = resolveScrollId(sessionStorage.getItem("ga-scroll"));
    if (!id) return;

    abortActiveScroll();

    var tries = 0;
    var maxTries = 12;
    var elementFound = false;
    var userInterrupted = false;

    function cleanup() {
      activeScrollTimer = null;
      activeScrollCleanup = null;
      window.removeEventListener("wheel", onUserIntent, listenerOpts);
      window.removeEventListener("touchstart", onUserIntent, listenerOpts);
      window.removeEventListener("keydown", onUserIntent, listenerOpts);
    }

    var listenerOpts = { passive: true, capture: true };

    function onUserIntent() {
      if (tries > 0) {
        userInterrupted = true;
        sessionStorage.removeItem("ga-scroll");
        cleanup();
      }
    }

    function finish() {
      sessionStorage.removeItem("ga-scroll");
      cleanup();
    }

    function attempt() {
      if (userInterrupted) return;

      tries++;
      var found = scrollToTarget(id);
      if (found) elementFound = true;

      if (isAtTarget(id)) {
        finish();
        return;
      }

      if (!elementFound && tries < maxTries) {
        activeScrollTimer = setTimeout(attempt, tries <= 3 ? 40 : 100);
        return;
      }

      if (elementFound && tries >= 2) {
        finish();
        return;
      }

      if (tries >= maxTries) {
        finish();
        return;
      }

      activeScrollTimer = setTimeout(attempt, 100);
    }

    activeScrollCleanup = cleanup;
    window.addEventListener("wheel", onUserIntent, listenerOpts);
    window.addEventListener("touchstart", onUserIntent, listenerOpts);
    window.addEventListener("keydown", onUserIntent, listenerOpts);

    attempt();
  }

  function scheduleScrollAfterRoute() {
    clearTimeout(window._gaRouteScrollT);
    window._gaRouteScrollT = setTimeout(runScroll, 20);
  }

  window.gaRunScroll = runScroll;

  window.gaSetScroll = function (id) {
    if (id) sessionStorage.setItem("ga-scroll", id);
  };

  window.gaResolveScrollId = resolveScrollId;
  window.gaScrollTo = scrollToTarget;

  document.addEventListener(
    "click",
    function (ev) {
      var link = ev.target.closest(
        "nav a.site-nav-link, nav .site-mobile-nav a, .site-footer a[href]"
      );
      if (!link) return;

      var href = link.getAttribute("href") || "";
      if (!href || href.indexOf("http") === 0 || href.indexOf("mailto:") === 0) return;

      var path = href.split("#")[0] || href;
      if (path !== "/" && path !== "/sobre" && path !== "/franqueado") return;

      setTimeout(function () {
        var target = resolveScrollId(sessionStorage.getItem("ga-scroll"));
        if (target === "top") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }, 0);
    },
    true
  );

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
      if (sessionStorage.getItem("ga-scroll")) {
        scheduleScrollAfterRoute();
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
    if (sessionStorage.getItem("ga-scroll")) {
      scheduleScrollAfterRoute();
    }
  });

  window.addEventListener("load", function () {
    bindHistoryMediaSync();
    if (sessionStorage.getItem("ga-scroll")) {
      scheduleScrollAfterRoute();
    }
  });
})();
