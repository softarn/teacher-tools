(() => {
  const STORAGE_KEY = "ordplopp.settings";
  const IDLE_AFTER_MS = 2500;
  const COUNTDOWN_MS = 650;
  // Steps used by the −/+ buttons on the stage, finer at the fast end.
  const VISIBLE_STEPS = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
  const PRESETS = [
    { name: "Lugnt", visible: 1.5, between: 2 },
    { name: "Lagom", visible: 0.75, between: 1.5 },
    { name: "Snabbt", visible: 0.4, between: 1 },
    { name: "Blixt", visible: 0.2, between: 1 },
  ];

  const defaults = { visible: 0.75, between: 1.5, listIds: ["lista-1"], uppercase: false };

  const settings = loadSettings();
  let running = false;
  let timer = null;
  let idleTimer = null;
  let toastTimer = null;
  let bag = [];
  let lastWord = null;
  let shownCount = 0;

  const $ = id => document.getElementById(id);
  const el = {
    readingLists: $("readingLists"),
    wordCount: $("wordCount"),
    presets: $("presets"),
    visibleSlider: $("visibleSlider"),
    betweenSlider: $("betweenSlider"),
    visibleValue: $("visibleValue"),
    betweenValue: $("betweenValue"),
    start: $("startButton"),
    stage: $("stage"),
    word: $("word"),
    status: $("status"),
    toast: $("toast"),
    dock: $("dock"),
    play: $("playButton"),
    repeat: $("repeatButton"),
    dockTempo: $("dockTempo"),
  };

  buildSetup();
  bindEvents();
  renderSetup();

  // ---------- Setup ----------

  function buildSetup() {
    for (const list of READING_LISTS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reading-list";
      button.dataset.listId = list.id;
      button.setAttribute("aria-label", `${list.name}: ${list.description}, ${list.words.length} ord`);
      button.innerHTML = `<strong>${list.name}</strong><span>${list.description}</span><small>${list.words.length} ord</small>`;
      button.addEventListener("click", () => toggleList(list.id));
      el.readingLists.append(button);
    }

    for (const preset of PRESETS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "segment preset";
      button.textContent = preset.name;
      button.addEventListener("click", () => {
        settings.visible = preset.visible;
        settings.between = preset.between;
        saveSettings();
        renderSetup();
      });
      el.presets.append(button);
    }
  }

  function toggleList(listId) {
    const index = settings.listIds.indexOf(listId);
    index >= 0 ? settings.listIds.splice(index, 1) : settings.listIds.push(listId);
    bag = [];
    saveSettings();
    renderSetup();
  }

  function renderSetup() {
    el.readingLists.querySelectorAll(".reading-list").forEach(button => {
      button.setAttribute("aria-pressed", settings.listIds.includes(button.dataset.listId));
    });

    const count = availableWords().length;
    const listCount = settings.listIds.length;
    el.wordCount.textContent = count
      ? `${count} ord · ${listCount} ${listCount === 1 ? "lista" : "listor"}`
      : "Välj minst en lista";
    el.wordCount.classList.toggle("warn", !count);
    el.start.disabled = !count;

    el.presets.querySelectorAll(".preset").forEach((button, i) => {
      const preset = PRESETS[i];
      button.setAttribute("aria-pressed", preset.visible === settings.visible && preset.between === settings.between);
    });

    setSlider(el.visibleSlider, el.visibleValue, settings.visible);
    setSlider(el.betweenSlider, el.betweenValue, settings.between);

    document.querySelectorAll(".case").forEach(button => {
      button.setAttribute("aria-pressed", String(settings.uppercase) === button.dataset.uppercase);
    });
  }

  function setSlider(slider, output, value) {
    slider.value = value;
    output.textContent = formatSeconds(value);
    const fill = (value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty("--fill", `${fill}%`);
  }

  // ---------- Stage ----------

  function enterStage() {
    if (!availableWords().length) return;
    document.body.dataset.view = "stage";
    shownCount = 0;
    lastWord = null;
    bag = [];
    running = true;
    renderStage();
    countdown(3);
  }

  function leaveStage() {
    running = false;
    clearTimeout(timer);
    clearTimeout(idleTimer);
    document.body.classList.remove("paused", "idle");
    document.body.dataset.view = "setup";
    renderSetup();
    el.start.focus();
  }

  function countdown(n) {
    if (n === 0) {
      showNextWord();
      return;
    }
    display(String(n), "countdown");
    timer = setTimeout(() => countdown(n - 1), COUNTDOWN_MS);
  }

  function showNextWord() {
    lastWord = nextWord();
    shownCount++;
    showWord(lastWord);
  }

  function showWord(word) {
    display(settings.uppercase ? word.toLocaleUpperCase("sv") : word);
    timer = setTimeout(hideWord, settings.visible * 1000);
  }

  function hideWord() {
    display("");
    if (running) {
      timer = setTimeout(showNextWord, settings.between * 1000);
    }
  }

  function display(text, variant = "") {
    el.word.className = `word ${variant}`;
    el.word.textContent = text;
    if (!text) return;
    fitWord();
    // Restart the pop-in animation.
    void el.word.offsetWidth;
    el.word.classList.add("plopp");
  }

  // Shrink long words so they never overflow the screen.
  function fitWord() {
    el.word.style.fontSize = "";
    const available = el.stage.clientWidth * 0.9;
    const width = el.word.scrollWidth;
    if (width > available) {
      const size = parseFloat(getComputedStyle(el.word).fontSize);
      el.word.style.fontSize = `${size * available / width}px`;
    }
  }

  function pause() {
    running = false;
    clearTimeout(timer);
    display("");
    renderStage();
  }

  function resume() {
    clearTimeout(timer);
    running = true;
    renderStage();
    showNextWord();
  }

  function togglePause() {
    running ? pause() : resume();
  }

  function repeatLast() {
    if (!lastWord) return;
    if (running) pause();
    clearTimeout(timer);
    showWord(lastWord);
  }

  function changeTempo(direction) {
    const index = VISIBLE_STEPS.findIndex(step => step >= settings.visible - 0.001);
    const current = index === -1 ? VISIBLE_STEPS.length - 1 : index;
    const next = Math.min(VISIBLE_STEPS.length - 1, Math.max(0, current + direction));
    settings.visible = VISIBLE_STEPS[next];
    saveSettings();
    renderStage();
    toast(`Ordet visas ${formatSeconds(settings.visible)}`);
  }

  function renderStage() {
    document.body.classList.toggle("paused", !running);
    el.play.setAttribute("aria-label", running ? "Pausa" : "Fortsätt");
    el.repeat.disabled = !lastWord;
    el.dockTempo.textContent = formatSeconds(settings.visible);
    el.status.textContent = shownCount
      ? `Pausad · ${shownCount} ord visade`
      : "Pausad";
    wake();
  }

  // Hide the dock and cursor while words are running and nobody touches anything.
  function wake() {
    document.body.classList.remove("idle");
    clearTimeout(idleTimer);
    if (running && !el.dock.matches(":hover")) {
      idleTimer = setTimeout(() => document.body.classList.add("idle"), IDLE_AFTER_MS);
    }
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1400);
  }

  // ---------- Events ----------

  function bindEvents() {
    el.visibleSlider.addEventListener("input", () => {
      settings.visible = Number(el.visibleSlider.value);
      saveSettings();
      renderSetup();
    });

    el.betweenSlider.addEventListener("input", () => {
      settings.between = Number(el.betweenSlider.value);
      saveSettings();
      renderSetup();
    });

    document.querySelectorAll(".case").forEach(button => {
      button.addEventListener("click", () => {
        settings.uppercase = button.dataset.uppercase === "true";
        saveSettings();
        renderSetup();
      });
    });

    el.start.addEventListener("click", enterStage);
    el.play.addEventListener("click", togglePause);
    el.repeat.addEventListener("click", repeatLast);
    $("settingsButton").addEventListener("click", leaveStage);
    $("fasterButton").addEventListener("click", () => changeTempo(1));
    $("slowerButton").addEventListener("click", () => changeTempo(-1));
    $("fullscreenButton").addEventListener("click", toggleFullscreen);

    // Tapping anywhere on the stage (outside the dock) pauses or resumes.
    el.stage.addEventListener("click", event => {
      if (!event.target.closest(".dock")) togglePause();
    });

    el.stage.addEventListener("pointermove", wake);
    el.dock.addEventListener("pointerleave", wake);

    document.addEventListener("keydown", event => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const onStage = document.body.dataset.view === "stage";
      const onButton = event.target.closest("button");

      if (event.key === " ") {
        if (onButton) return;
        event.preventDefault();
        onStage ? togglePause() : enterStage();
      } else if (event.key === "f" || event.key === "F") {
        toggleFullscreen();
      } else if (!onStage) {
        return;
      } else if (event.key === "Escape") {
        leaveStage();
      } else if (event.key === "r" || event.key === "R") {
        repeatLast();
      } else if (event.key === "+" || event.key === "ArrowUp") {
        event.preventDefault();
        changeTempo(1);
      } else if (event.key === "-" || event.key === "ArrowDown") {
        event.preventDefault();
        changeTempo(-1);
      }
    });

    window.addEventListener("resize", () => {
      if (el.word.textContent) fitWord();
    });
  }

  // ---------- Helpers ----------

  function availableWords() {
    const selected = new Set(settings.listIds);
    return [...new Set(
      READING_LISTS
        .filter(list => selected.has(list.id))
        .flatMap(list => list.words)
    )];
  }

  // Draw from a shuffled bag so every word is shown once before any repeats.
  function nextWord() {
    if (!bag.length) {
      bag = shuffle(availableWords());
      if (bag.length > 1 && bag[bag.length - 1] === lastWord) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    return bag.pop();
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function formatSeconds(value) {
    return value.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " s";
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
      const validIds = new Set(READING_LISTS.map(list => list.id));
      const listIds = Array.isArray(saved?.listIds)
        ? saved.listIds.filter(id => validIds.has(id))
        : [...defaults.listIds];
      return { ...defaults, ...saved, listIds };
    } catch {
      return { ...defaults, listIds: [...defaults.listIds] };
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
