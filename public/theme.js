// Inline theme init - runs before page renders to avoid flash
(function() {
  var storageKey = "md_theme";
  var systemQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  var sunSvg = '<svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.4"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="8" y1="1" x2="8" y2="2.5"/><line x1="8" y1="13.5" x2="8" y2="15"/><line x1="1" y1="8" x2="2.5" y2="8"/><line x1="13.5" y1="8" x2="15" y2="8"/><line x1="3.05" y1="3.05" x2="4.1" y2="4.1"/><line x1="11.9" y1="11.9" x2="12.95" y2="12.95"/><line x1="3.05" y1="12.95" x2="4.1" y2="11.9"/><line x1="11.9" y1="4.1" x2="12.95" y2="3.05"/></g></svg>';
  var moonSvg = '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M14 9.2A5.8 5.8 0 0 1 6.8 2 6.5 6.5 0 1 0 14 9.2Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var systemSvg = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.5" width="11.5" height="8" rx="1.75"/><path d="M6 13h4"/><path d="M8 10.5V13"/></svg>';

  function readPreference() {
    try {
      var stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {}
    return "system";
  }

  function writePreference(preference) {
    try {
      localStorage.setItem(storageKey, preference);
    } catch {}
  }

  function getSystemTheme() {
    return systemQuery && systemQuery.matches ? "dark" : "light";
  }

  function resolveTheme(preference) {
    return preference === "system" ? getSystemTheme() : preference;
  }

  function getThemePreference() {
    return document.documentElement.getAttribute("data-theme-preference") || readPreference();
  }

  function syncThemeButtons() {
    var preference = getThemePreference();
    var label = "Cycle theme (current: " + preference + ")";
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].innerHTML = window.__themeIcon(preference);
      buttons[i].setAttribute("aria-label", label);
      buttons[i].setAttribute("title", label);
    }
  }

  function rerenderMermaid(theme) {
    if (!window.__mermaid) {
      return;
    }

    window.__mermaid.initialize({ startOnLoad: false, theme: theme === "light" ? "default" : "dark" });

    var container = document.getElementById("previewContent");
    if (!container) {
      return;
    }

    container.querySelectorAll(".mermaid-wrap").forEach(function(wrap) {
      var pre = wrap.querySelector("pre.mermaid");
      if (pre) {
        pre.textContent = pre.getAttribute("data-original-code") || "";
        wrap.replaceWith(pre);
      } else {
        wrap.remove();
      }
    });

    if (window.__clearMermaidCache) {
      window.__clearMermaidCache();
    }
    if (window.__renderMermaid) {
      window.__renderMermaid(container);
    }
  }

  function applyTheme(theme, preference) {
    var root = document.documentElement;
    var previousTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-preference", preference);
    root.style.colorScheme = theme;
    syncThemeButtons();
    if (theme !== previousTheme) {
      rerenderMermaid(theme);
    }
  }

  function setPreference(preference) {
    writePreference(preference);
    applyTheme(resolveTheme(preference), preference);
  }

  window.__themeIcon = function(preference) {
    if (preference === "light") {
      return sunSvg;
    }
    if (preference === "dark") {
      return moonSvg;
    }
    return systemSvg;
  };

  window.__getThemePreference = getThemePreference;
  window.__getTheme = function() {
    return document.documentElement.getAttribute("data-theme") || resolveTheme(getThemePreference());
  };
  window.__setThemePreference = setPreference;

  window.__toggleTheme = function() {
    var current = getThemePreference();
    var next = current === "system" ? "light" : current === "light" ? "dark" : "system";
    setPreference(next);
    return next;
  };

  applyTheme(resolveTheme(readPreference()), readPreference());

  function handleSystemThemeChange() {
    if (getThemePreference() === "system") {
      applyTheme(resolveTheme("system"), "system");
    }
  }

  if (systemQuery) {
    if (typeof systemQuery.addEventListener === "function") {
      systemQuery.addEventListener("change", handleSystemThemeChange);
    } else if (typeof systemQuery.addListener === "function") {
      systemQuery.addListener(handleSystemThemeChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncThemeButtons, { once: true });
  } else {
    syncThemeButtons();
  }

  document.addEventListener("click", function(event) {
    if (event.target.closest && event.target.closest(".theme-toggle")) {
      window.__toggleTheme();
    }
  });
})();
