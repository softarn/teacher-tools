(() => {
  const STEP = 0.25;
  const MIN_TIME = 0.25;
  const MAX_TIME = 10;
  const LENGTHS = [2, 3, 4, 5, 6, 7, 8, 9];
  const STORAGE_KEY = "ordplopp.settings";

  const defaults = { visible: 0.75, between: 1.5, lengths: [3, 4], uppercase: false };

  const wordsByLength = {};
  for (const word of WORDS) {
    const length = [...word].length;
    (wordsByLength[length] ||= []).push(word);
  }

  const settings = loadSettings();
  let running = false;
  let timer = null;
  let bag = [];
  let lastWord = null;

  const el = {
    play: document.getElementById("playButton"),
    playLabel: document.querySelector(".play-label"),
    visible: document.getElementById("visibleValue"),
    between: document.getElementById("betweenValue"),
    lengths: document.getElementById("lengths"),
    caseButton: document.getElementById("caseButton"),
    fullscreen: document.getElementById("fullscreenButton"),
    word: document.getElementById("word"),
  };

  for (const length of LENGTHS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = length;
    chip.dataset.length = length;
    chip.addEventListener("click", () => toggleLength(length));
    el.lengths.append(chip);
  }

  el.play.addEventListener("click", toggleRunning);
  el.caseButton.addEventListener("click", () => {
    settings.uppercase = !settings.uppercase;
    saveSettings();
    render();
  });
  el.fullscreen.addEventListener("click", toggleFullscreen);

  document.querySelectorAll("[data-step]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.step;
      const next = settings[key] + STEP * Number(button.dataset.dir);
      settings[key] = Math.min(MAX_TIME, Math.max(MIN_TIME, next));
      saveSettings();
      render();
    });
  });

  document.addEventListener("keydown", event => {
    if (event.target.closest("button") && (event.key === " " || event.key === "Enter")) return;
    if (event.key === " ") {
      event.preventDefault();
      toggleRunning();
    } else if (event.key === "f" || event.key === "F") {
      toggleFullscreen();
    } else if (event.key === "Escape" && running) {
      stop();
    }
  });

  render();

  function toggleLength(length) {
    const index = settings.lengths.indexOf(length);
    if (index >= 0) {
      settings.lengths.splice(index, 1);
    } else {
      settings.lengths.push(length);
    }
    bag = [];
    saveSettings();
    render();
  }

  function toggleRunning() {
    running ? stop() : start();
  }

  function start() {
    if (!settings.lengths.length) {
      el.word.className = "word error";
      el.word.textContent = "Välj minst en ordlängd";
      return;
    }
    running = true;
    render();
    showWord();
  }

  function stop() {
    running = false;
    clearTimeout(timer);
    el.word.textContent = "";
    render();
  }

  function showWord() {
    const word = nextWord();
    el.word.className = "word";
    el.word.textContent = settings.uppercase ? word.toLocaleUpperCase("sv") : word;
    fitWord();
    // Restart the pop-in animation on every word.
    void el.word.offsetWidth;
    el.word.classList.add("plopp");
    timer = setTimeout(hideWord, settings.visible * 1000);
  }

  // Shrink long words so they never overflow the screen.
  function fitWord() {
    el.word.style.fontSize = "";
    const available = el.word.parentElement.clientWidth * 0.92;
    const width = el.word.scrollWidth;
    if (width > available) {
      const size = parseFloat(getComputedStyle(el.word).fontSize);
      el.word.style.fontSize = `${size * available / width}px`;
    }
  }

  function hideWord() {
    el.word.textContent = "";
    timer = setTimeout(showWord, settings.between * 1000);
  }

  // Draw from a shuffled bag so every word is shown once before any repeats.
  function nextWord() {
    if (!bag.length) {
      bag = shuffle(settings.lengths.flatMap(length => wordsByLength[length] || []));
      if (bag.length > 1 && bag[bag.length - 1] === lastWord) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    lastWord = bag.pop();
    return lastWord;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function render() {
    document.body.classList.toggle("running", running);
    el.play.setAttribute("aria-pressed", running);
    el.playLabel.textContent = running ? "Pausa" : "Starta";
    el.visible.textContent = formatSeconds(settings.visible);
    el.between.textContent = formatSeconds(settings.between);
    el.caseButton.setAttribute("aria-pressed", settings.uppercase);
    el.lengths.querySelectorAll(".chip").forEach(chip => {
      chip.setAttribute("aria-pressed", settings.lengths.includes(Number(chip.dataset.length)));
    });
  }

  function formatSeconds(value) {
    return value.toLocaleString("sv-SE", { minimumFractionDigits: 2 }) + " s";
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaults, ...saved, lengths: [...(saved?.lengths ?? defaults.lengths)] };
    } catch {
      return { ...defaults, lengths: [...defaults.lengths] };
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable (private mode etc.) – settings just won't persist.
    }
  }
})();
