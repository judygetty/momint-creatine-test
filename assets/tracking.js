/* ==========================================================================
   MoMint — shared tracking + form handler (both pages load this).
   Each page sets window.PAGE_VARIANT ("momint_sugar" or "momint_sugar_free")
   before this file loads.

   TODO before going live:
   - Swap FORMSPREE_ENDPOINT for your real form endpoint
   - Swap the GA4 / Meta Pixel / Bing UET IDs in the <head> of each page
   ========================================================================== */
(function () {
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // TODO: replace per README

  var params = new URLSearchParams(window.location.search);
  var utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var utm = {};
  utmKeys.forEach(function (key) {
    var fromUrl = params.get(key);
    if (fromUrl) sessionStorage.setItem(key, fromUrl);
    utm[key] = fromUrl || sessionStorage.getItem(key) || "(direct)";
  });

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form.reserve");
    if (!form) return;

    var hiddenFields = Object.assign({ page_variant: window.PAGE_VARIANT || "unknown" }, utm);
    Object.keys(hiddenFields).forEach(function (key) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = hiddenFields[key];
      form.appendChild(input);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var button = form.querySelector("button");
      var msg = form.parentElement.querySelector(".form-msg");
      if (!emailInput || !emailInput.value) return;

      button.disabled = true;
      button.textContent = "Sending…";

      var eventPayload = {
        event: "reserve_spot",
        page_variant: window.PAGE_VARIANT || "unknown",
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(eventPayload);
      if (typeof fbq === "function") fbq("track", "Lead", { content_name: window.PAGE_VARIANT || "unknown" });
      if (typeof uetq !== "undefined" && uetq.push) uetq.push("event", "reserve_spot", { event_category: "lead", event_label: window.PAGE_VARIANT || "unknown" });

      fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (res) {
          if (res.ok) {
            form.style.display = "none";
            if (msg) {
              msg.textContent = "You're on the list — we'll email you the moment the first run ships.";
              msg.className = "form-msg success";
              msg.style.display = "block";
            }
          } else {
            throw new Error("submit failed");
          }
        })
        .catch(function () {
          button.disabled = false;
          button.textContent = "Reserve my spot →";
          if (msg) {
            msg.textContent = "Something went wrong — please try again in a moment.";
            msg.className = "form-msg error";
            msg.style.display = "block";
          }
        });
    });
  });

  document.addEventListener("click", function (e) {
    var target = e.target.closest('a[href^="#"]');
    if (!target) return;
    var el = document.querySelector(target.getAttribute("href"));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function (i) { i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });
  });
})();
