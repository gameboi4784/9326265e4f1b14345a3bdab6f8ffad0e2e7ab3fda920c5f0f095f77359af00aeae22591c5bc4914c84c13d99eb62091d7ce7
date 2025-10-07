(function () {
  function simulateKeyDown(key, keyCode) {
    const e = new KeyboardEvent("keydown", { key, keyCode, bubbles: true, cancelable: true });
    document.dispatchEvent(e);
  }
  function simulateKeyUp(key, keyCode) {
    const e = new KeyboardEvent("keyup", { key, keyCode, bubbles: true, cancelable: true });
    document.dispatchEvent(e);
  }

  let currentController = "xbox"; // default
  const pressedState = {};
  const axisState = { left: false, right: false, up: false, down: false };

  // Detect controller type
  window.addEventListener("gamepadconnected", (event) => {
    const id = event.gamepad.id.toLowerCase();
    console.log("Gamepad connected:", id);

    if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense") || id.includes("054c")) {
      currentController = "ps";
    } else if (id.includes("057e") || id.includes("pro controller") || id.includes("nintendo") || id.includes("switch")) {
      currentController = "switch";
    } else if (id.includes("xbox") || id.includes("045e")) {
      currentController = "xbox";
    } else {
      currentController = "xbox"; // fallback
    }
    console.log("Detected controller type:", currentController);
  });

  // Face button mappings
  function mapButton(index) {
    if (currentController === "xbox") {
      if (index === 0) return { key: "Enter", code: 13 };   // A
      if (index === 1) return { key: "Shift", code: 16 };   // B
      if (index === 3) return { key: "Control", code: 17 }; // Y
    }
    if (currentController === "switch") {
      if (index === 1) return { key: "Enter", code: 13 };   // B
      if (index === 0) return { key: "Shift", code: 16 };   // A
      if (index === 2) return { key: "Control", code: 17 }; // X
    }
    if (currentController === "ps") {
      if (index === 0) return { key: "Enter", code: 13 };   // X
      if (index === 1) return { key: "Shift", code: 16 };   // O
      if (index === 3) return { key: "Control", code: 17 }; // Triangle
    }
    return null;
  }

  function handleAxis(gp) {
    const threshold = 0.4;
    const [lx, ly] = gp.axes;

    const dirs = {
      left: lx < -threshold,
      right: lx > threshold,
      up: ly < -threshold,
      down: ly > threshold,
    };

    Object.entries(dirs).forEach(([dir, active]) => {
      const keyMap = {
        left: { key: "ArrowLeft", code: 37 },
        right: { key: "ArrowRight", code: 39 },
        up: { key: "ArrowUp", code: 38 },
        down: { key: "ArrowDown", code: 40 },
      };
      const mapping = keyMap[dir];
      if (!mapping) return;

      if (active && !axisState[dir]) {
        axisState[dir] = true;
        simulateKeyDown(mapping.key, mapping.code);
      } else if (!active && axisState[dir]) {
        axisState[dir] = false;
        simulateKeyUp(mapping.key, mapping.code);
      }
    });
  }

  function pollGamepads() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp) continue;

      // Face buttons
      gp.buttons.forEach((btn, i) => {
        const mapping = mapButton(i);
        if (!mapping) return;

        if (btn.pressed && !pressedState[i]) {
          pressedState[i] = true;
          simulateKeyDown(mapping.key, mapping.code);
        } else if (!btn.pressed && pressedState[i]) {
          pressedState[i] = false;
          simulateKeyUp(mapping.key, mapping.code);
        }
      });

      // D-Pad
      const dpadMap = {
        12: { key: "ArrowUp", code: 38 },
        13: { key: "ArrowDown", code: 40 },
        14: { key: "ArrowLeft", code: 37 },
        15: { key: "ArrowRight", code: 39 },
      };
      for (const i in dpadMap) {
        const mapping = dpadMap[i];
        if (gp.buttons[i]?.pressed && !pressedState[i]) {
          pressedState[i] = true;
          simulateKeyDown(mapping.key, mapping.code);
        } else if (!gp.buttons[i]?.pressed && pressedState[i]) {
          pressedState[i] = false;
          simulateKeyUp(mapping.key, mapping.code);
        }
      }

      // Left stick
      handleAxis(gp);
    }
  }

  setInterval(pollGamepads, 16);
})();
