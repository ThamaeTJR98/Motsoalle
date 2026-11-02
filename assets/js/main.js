/* Motsoalle website script */

/* ---- Settings you can change ------------------------------------------ */
var CONFIG = {
  // Free access key from https://web3forms.com (sent to your email).
  // Leave empty and the partner form offers "send by email" / "send on WhatsApp" instead.
  WEB3FORMS_KEY: "",
  // Where partner enquiries go if the form service is not set up.
  PARTNER_EMAIL: "motsoalle@trwebsolutions.com",
  // WhatsApp number for partner enquiries (country code, no + or spaces).
  PARTNER_WHATSAPP: "26650027392"
};
/* ------------------------------------------------------------------------ */

(function () {
  "use strict";

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Hero chat: plays the real Motsoalle opening once
  var phone = document.querySelector("[data-chat]");
  if (phone) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = Array.prototype.slice.call(phone.querySelectorAll(".chat > li:not(.typing)"));
    var typing = phone.querySelector(".typing");
    if (!reduce && items.length) {
      phone.classList.add("js-chat");
      var i = 0;
      var next = function () {
        if (i >= items.length) { if (typing) typing.classList.remove("is-shown"); return; }
        var item = items[i];
        var fromBot = item.classList.contains("msg--in") || item.classList.contains("chat-buttons");
        var wait = item.classList.contains("chat-buttons") ? 350 : fromBot ? 1100 : 900;
        if (fromBot && typing && !item.classList.contains("chat-buttons")) {
          item.parentNode.insertBefore(typing, item);
          typing.classList.add("is-shown");
        }
        setTimeout(function () {
          if (typing) typing.classList.remove("is-shown");
          item.classList.add("is-shown");
          i += 1;
          next();
        }, wait);
      };
      setTimeout(next, 400);
    }
  }

  // Partner form
  var form = document.getElementById("partner-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function show(kind, html) {
    status.className = "form-status form-status--" + kind + " is-shown";
    status.innerHTML = html;
    status.setAttribute("tabindex", "-1");
    status.focus();
  }

  function summary(data) {
    var lines = [
      "New Motsoalle partner enquiry",
      "Organisation: " + data.organisation,
      "Name: " + data.name,
      "Role: " + (data.role || "-"),
      "Email: " + data.email,
      "Phone/WhatsApp: " + (data.phone || "-"),
      "Partner type: " + data.partner_type,
      "Interested in: " + (data.interests || "-"),
      "Message: " + (data.message || "-")
    ];
    return lines.join("\n");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fallback(data, intro) {
    var text = summary(data);
    var mail = "mailto:" + CONFIG.PARTNER_EMAIL +
      "?subject=" + encodeURIComponent("Motsoalle partner enquiry: " + data.organisation) +
      "&body=" + encodeURIComponent(text);
    var wa = "https://wa.me/" + CONFIG.PARTNER_WHATSAPP + "?text=" + encodeURIComponent(text);
    show("fallback",
      "<p><strong>" + escapeHtml(intro) + "</strong></p>" +
      "<p>Your details are ready. Choose how to send them:</p>" +
      '<div class="btn-row"><a class="btn btn--teal btn--sm" href="' + mail + '">Send by email</a>' +
      '<a class="btn btn--wa btn--sm" href="' + wa + '" target="_blank" rel="noopener">Send on WhatsApp</a></div>');
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var fd = new FormData(form);
    if (fd.get("botcheck")) return; // spam trap

    var interests = fd.getAll("interests").join(", ");
    var data = {
      organisation: fd.get("organisation") || "",
      name: fd.get("name") || "",
      role: fd.get("role") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      partner_type: fd.get("partner_type") || "",
      interests: interests,
      message: fd.get("message") || ""
    };

    if (!CONFIG.WEB3FORMS_KEY) {
      fallback(data, "One more step to send your enquiry.");
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Sending…";

    var payload = Object.assign({
      access_key: CONFIG.WEB3FORMS_KEY,
      subject: "Motsoalle partner enquiry: " + data.organisation,
      from_name: "Motsoalle website"
    }, data);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success) {
          form.reset();
          show("ok", "<p><strong>Enquiry sent.</strong> Thank you, " + escapeHtml(data.name) +
            ". We’ll reply to " + escapeHtml(data.email) + " to set up an introductory call.</p>");
        } else {
          fallback(data, "The form service didn’t accept the enquiry.");
        }
      })
      .catch(function () {
        fallback(data, "We couldn’t reach the form service. Check your connection, or send your details directly.");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = "Send enquiry";
      });
  });
})();
