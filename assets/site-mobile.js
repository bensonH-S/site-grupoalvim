(function () {
  var MOBILE = window.matchMedia("(max-width: 767px)");

  function pinHeader() {
    if (!MOBILE.matches) return;
    var nav = document.querySelector("nav");
    if (!nav) return;
    nav.style.setProperty("position", "fixed", "important");
    nav.style.setProperty("top", "0", "important");
    nav.style.setProperty("left", "0", "important");
    nav.style.setProperty("right", "0", "important");
    nav.style.setProperty("width", "100%", "important");
    nav.style.setProperty("transform", "translate3d(0,0,0)", "important");
    nav.style.setProperty("-webkit-transform", "translate3d(0,0,0)", "important");
  }

  function init() {
    pinHeader();
    window.addEventListener("scroll", pinHeader, { passive: true });
    window.addEventListener("resize", pinHeader, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
