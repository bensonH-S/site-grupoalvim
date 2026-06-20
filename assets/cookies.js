(function () {
  var KEY = "grupoalvim_cookie_consent";
  if (localStorage.getItem(KEY) === "accepted") return;

  var banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Consentimento de cookies");
  banner.innerHTML =
    '<div class="cookie-banner__inner">' +
    '<p class="cookie-banner__text">Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Ao continuar navegando, você concorda com nossa <a href="/privacidade">Política de Privacidade</a>.</p>' +
    '<div class="cookie-banner__actions">' +
    '<button type="button" class="cookie-banner__btn cookie-banner__btn--primary" id="cookie-accept">Aceitar</button>' +
    '<a href="/privacidade" class="cookie-banner__btn cookie-banner__btn--ghost">Saiba mais</a>' +
    "</div></div>";

  document.body.appendChild(banner);

  document.getElementById("cookie-accept").addEventListener("click", function () {
    localStorage.setItem(KEY, "accepted");
    banner.classList.add("cookie-banner--hide");
    setTimeout(function () {
      banner.remove();
    }, 350);
  });
})();
