(() => {
  const container = document.getElementById("lists");
  const summary = document.getElementById("summary");

  const uniqueWords = new Set(READING_LISTS.flatMap(list => list.words));
  summary.textContent = `${READING_LISTS.length} listor · ${uniqueWords.size} unika ord`;

  for (const list of READING_LISTS) {
    const article = document.createElement("article");
    article.className = "list-card";

    const header = document.createElement("header");
    header.className = "list-card-header";

    const heading = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = list.name;
    const description = document.createElement("p");
    description.textContent = list.description;
    heading.append(title, description);

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = `${list.words.length} ord`;

    header.append(heading, meta);

    const words = document.createElement("div");
    words.className = "words";
    words.setAttribute("aria-label", `Ord i ${list.name}`);

    for (const word of list.words) {
      const chip = document.createElement("span");
      chip.className = "word-chip";
      chip.textContent = word;
      words.append(chip);
    }

    article.append(header, words);
    container.append(article);
  }
})();
