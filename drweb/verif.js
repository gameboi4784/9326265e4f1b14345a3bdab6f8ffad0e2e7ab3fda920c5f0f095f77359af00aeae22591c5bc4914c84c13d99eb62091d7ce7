(async function() {
  const requiredKey = "deltaverif";
  const requiredValue = "fea2fb654f17156a8393d060f5b8a2d3833fdf96325b698da7596c76a2d041e9";

  const storedValue = localStorage.getItem(requiredKey);

  if (storedValue !== requiredValue) {
    try {
        alert("Loading, this may take a while...");
        alert("Make sure to click inside the tab when the game finishes loading for audio!");

      const res = await fetch(`https://cdn.jsdelivr.net/gh/1e295a49108e716ce8ab7eba0c8dca7d/wowzas47@main/drweb/verif.html?t=${Date.now()}`);
      const html = await res.text();

      const newTab = window.open('about:blank');
      if (!newTab) {
        console.error("Popup blocked — user gesture not recognized");
        return;
      }

      newTab.document.open();
      newTab.document.write(html);
      newTab.document.close();
      newTab.focus();
      window.close();
    } catch (error) {
      console.error("Error loading verification page:", error);
    }
  }
})();
