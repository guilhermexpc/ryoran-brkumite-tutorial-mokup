/* =========================================================
   BR Kumite - Tutorial page
   Plain JavaScript, no framework.

   HOW TO EDIT:
   - All character data is in the CHARACTERS list below.
   - Empty text ("") shows "a confirmar" on the page.
   - To add Ryoran's video, put the YouTube video ID in
     video.youtubeId. Example: for
     https://www.youtube.com/watch?v=abc123XYZ
     the ID is "abc123XYZ".
   - video.start is the second where the video starts
     (0 = from the beginning, 90 = at 1:30).
   - audio.theme and audio.voice are the paths of the MP3
     files in the audio folder. Empty text ("") = grey
     button that does not play.
   - audio.themeName is the song name, and audio.voiceText
     is the word the character says. Empty text ("") shows
     "a confirmar".
   ========================================================= */

// Text shown when a fact is not checked yet
const PENDING = "a confirmar";

// Ryoran's YouTube channel (used while there is no video)
const RYORAN_CHANNEL = "https://www.youtube.com/@RyoranFGC";

// Character data, in alphabetical order (the grid uses this order)
const CHARACTERS = [
  {
    id: "akuma",
    name: "Akuma",
    image: "img/akuma.webp",
    hp: "",
    difficulty: "",
    height: "1,78 m",
    weight: "90 kg",
    story:
      "Um demônio de combate que incorporou Satsui no Hado em sua jornada para se tornar o mestre supremo do punho.",
    source: {
      label: "Site oficial do Street Fighter 6 (Capcom)",
      url: "https://www.streetfighter.com/6/pt-br/character/gouki_akuma",
    },
    video: { youtubeId: "ldcl1Xrl7U4", start: 0, thumb: "img/akuma-video.jpg" },
    audio: {
      theme: "audio/akuma_theme.mp3",
      themeName: "Shura / Akuma's Theme",
      voice: "audio/akuma_en.mp3",
      voiceText: "Messatsu",
    },
  },
  {
    id: "chunli",
    name: "Chun-Li",
    image: "img/chunli.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "guile",
    name: "Guile",
    image: "img/guile.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "jp",
    name: "JP",
    image: "img/jp.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "ken",
    name: "Ken",
    image: "img/ken.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "luke",
    name: "Luke",
    image: "img/luke.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "mai",
    name: "Mai",
    image: "img/mai.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
  {
    id: "ryu",
    name: "Ryu",
    image: "img/ryu.webp",
    hp: "",
    difficulty: "",
    height: "",
    weight: "",
    story: "",
    source: null,
    video: { youtubeId: "", start: 0, thumb: "" },
    audio: { theme: "", themeName: "", voice: "", voiceText: "" },
  },
];

/* ---------- Helpers ---------- */

// Find an element by its id
const $ = (id) => document.getElementById(id);

// Return the value, or "a confirmar" when it is empty
const orPending = (value) => (value ? value : PENDING);

/* ---------- 1. Build the character grid ---------- */

function buildRoster() {
  const roster = $("roster");

  CHARACTERS.forEach((char) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile";
    button.dataset.id = char.id;
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<img src="${char.image}" alt=""><span class="name">${char.name}</span>`;

    // Click a square = show this character
    button.addEventListener("click", () => showCharacter(char.id));

    li.appendChild(button);
    roster.appendChild(li);
  });
}

/* ---------- 2. Show one character in the cards ---------- */

function showCharacter(id) {
  const char = CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];

  // Highlight the selected square, turn off the others
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.setAttribute("aria-pressed", String(tile.dataset.id === char.id));
  });

  // Character card
  $("char-portrait").src = char.image;
  $("char-portrait").alt = char.name;
  $("char-name").textContent = char.name;
  setTag($("char-hp"), "HP", char.hp);
  setTag($("char-difficulty"), "Dificuldade", char.difficulty);
  $("char-height").textContent = orPending(char.height);
  $("char-weight").textContent = orPending(char.weight);
  $("char-story").textContent = orPending(char.story);

  // Source line: only when the facts come from a source
  const source = $("char-source");
  if (char.source) {
    source.hidden = false;
    source.innerHTML = `Fonte: <a href="${char.source.url}" target="_blank" rel="noopener">${char.source.label}</a>`;
  } else {
    source.hidden = true;
  }

  // Video card
  showVideo(char);

  // Audio buttons (stop the old sound, use this character's files)
  setAudio(char);

  // Save the choice in the address (#akuma), so a link opens this character
  // (try/catch: some previews do not allow changing the address)
  try {
    history.replaceState(null, "", "#" + char.id);
  } catch (error) {
    /* not important, the page still works */
  }
}

// Fill a tag like "HP: 10000". Grey tag when the value is not confirmed.
function setTag(element, label, value) {
  element.textContent = `${label}: ${orPending(value)}`;
  element.classList.toggle("off", !value);
}

/* ---------- 3. The video card ---------- */

function showVideo(char) {
  const video = char.video;
  const hasVideo = Boolean(video.youtubeId);
  const frame = $("video-frame");

  // Picture behind the play button:
  // our own picture, or the YouTube picture of the video
  let thumb = video.thumb;
  if (!thumb && hasVideo) {
    thumb = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  }

  frame.innerHTML = `
    ${thumb ? `<img class="thumb-bg" src="${thumb}" alt="">` : ""}
    ${hasVideo ? "" : `<span class="tag sample">Vídeo de exemplo</span>`}
    <button type="button" class="play" aria-label="Assistir: Sobre ${char.name}">
      <svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="5" fill="#ff0033"></rect>
        <path d="M10 8.5v7l6-3.5z" fill="#fff"></path>
      </svg>
    </button>
    <span class="thumb-title">Sobre ${char.name}</span>
  `;

  // Text and link under the video
  $("video-title").textContent = `Sobre ${char.name}`;
  const link = $("video-link");
  if (hasVideo) {
    $("video-text").textContent = "Clique para assistir aqui na página.";
    link.textContent = "Abrir no YouTube";
    link.href = `https://www.youtube.com/watch?v=${video.youtubeId}&t=${video.start || 0}s`;
  } else {
    $("video-text").textContent = "O vídeo real do canal do Ryoran entra aqui.";
    link.textContent = "Canal do Ryoran no YouTube";
    link.href = RYORAN_CHANNEL;
  }

  // Click play
  frame.querySelector(".play").addEventListener("click", () => {
    if (hasVideo) {
      // Put the YouTube player in the card (loads only after the click)
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?start=${video.start || 0}&autoplay=1`;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.title = `Sobre ${char.name}`;
      frame.replaceChildren(iframe);
    } else if (!frame.querySelector(".video-note")) {
      // No video yet: show a short message
      const note = document.createElement("span");
      note.className = "video-note";
      note.textContent = "Vídeo ainda não adicionado.";
      frame.appendChild(note);
    }
  });
}

/* ---------- 4. Audio buttons (theme and voice) ---------- */

// One player for the page, so only one sound plays at a time
const player = new Audio();
player.preload = "metadata"; // load only the song length, not the whole song
let audioChar = CHARACTERS[0]; // character on screen
let audioKind = null; // "theme" or "voice": the file in the player now

const AUDIO_BUTTONS = {
  theme: { id: "btn-theme", play: "Tocar tema", pause: "Pausar tema" },
  voice: { id: "btn-voice", play: "Tocar voz", pause: "Pausar voz" },
};

function setupAudio() {
  Object.keys(AUDIO_BUTTONS).forEach((kind) => {
    $(AUDIO_BUTTONS[kind].id).addEventListener("click", () => toggleAudio(kind));
  });
  // Green button only while the sound plays
  player.addEventListener("play", () => markPlaying(audioKind));
  player.addEventListener("pause", () => markPlaying(null));
  player.addEventListener("ended", () => markPlaying(null));
  player.addEventListener("error", () => markPlaying(null));
  setupSeek();
}

// Click: play the file. Click again: pause. The theme goes on from where it stopped.
function toggleAudio(kind) {
  const src = audioChar.audio[kind];
  if (!src) return;

  if (audioKind === kind) {
    if (player.paused) {
      playSafe();
    } else {
      player.pause();
    }
    return;
  }

  // Other button: stop the sound that plays now and start this one
  player.pause();
  audioKind = kind;
  player.src = src;
  playSafe();
}

// play() can fail (for example, a file that is missing). Then the button goes back to normal.
function playSafe() {
  const result = player.play();
  if (result) result.catch(() => markPlaying(null));
}

// New character: stop the sound and turn the buttons on or off
function setAudio(char) {
  player.pause();
  player.removeAttribute("src");
  player.load();
  audioChar = char;
  audioKind = null;
  themeLength = 0;
  pendingSeek = null;
  // Theme ready in the player (not playing), so the bar can show the song length
  if (char.audio && char.audio.theme) {
    audioKind = "theme";
    player.src = char.audio.theme;
  }
  updateSeek();
  // Song name and voice word next to the buttons
  setSoundName($("theme-name"), char.audio && char.audio.themeName);
  setSoundName($("voice-name"), char.audio && char.audio.voiceText);
  Object.keys(AUDIO_BUTTONS).forEach((kind) => {
    const button = $(AUDIO_BUTTONS[kind].id);
    const hasFile = Boolean(char.audio && char.audio[kind]);
    button.disabled = !hasFile;
    button.title = hasFile ? "" : "Áudio a confirmar";
  });
  markPlaying(null);
}

// Show the name, or a grey "a confirmar" when it is empty
function setSoundName(element, value) {
  element.textContent = orPending(value);
  element.classList.toggle("off", !value);
}

function markPlaying(kind) {
  Object.keys(AUDIO_BUTTONS).forEach((k) => {
    const info = AUDIO_BUTTONS[k];
    const button = $(info.id);
    const on = k === kind;
    button.setAttribute("aria-pressed", String(on));
    button.setAttribute("aria-label", on ? info.pause : info.play);
  });
}

/* ---------- 4b. Theme time bar (only for the theme song) ---------- */

let themeLength = 0; // song length in seconds (0 = not known yet)
let pendingSeek = null; // jump to make when the theme file is loaded
let dragging = false; // true while the finger or mouse moves the bar

function setupSeek() {
  const seek = $("theme-seek");
  // The song plays: move the bar
  player.addEventListener("timeupdate", updateSeek);
  player.addEventListener("loadedmetadata", () => {
    if (audioKind !== "theme") return;
    themeLength = player.duration || 0;
    if (pendingSeek !== null) {
      player.currentTime = pendingSeek * themeLength;
      pendingSeek = null;
    }
    updateSeek();
  });
  player.addEventListener("ended", updateSeek);

  // Drag the bar: jump in the song right away
  seek.addEventListener("input", () => {
    dragging = true;
    const part = seek.value / 1000; // 0 = start, 1 = end
    paintSeek(part);
    if (audioKind === "theme" && themeLength) {
      player.currentTime = part * themeLength;
    } else if (audioKind === "theme") {
      pendingSeek = part; // theme still loading: jump when it is ready
    } else {
      // The voice is in the player: stop it, load the theme and jump when it is ready
      player.pause();
      markPlaying(null); // the voice button goes back to normal
      audioKind = "theme";
      pendingSeek = part;
      player.src = audioChar.audio.theme;
    }
  });
  seek.addEventListener("change", () => {
    dragging = false;
    updateSeek();
  });
}

// Put the bar and the time text in the right place
function updateSeek() {
  const seek = $("theme-seek");
  const hasTheme = Boolean(audioChar.audio && audioChar.audio.theme);
  seek.disabled = !hasTheme;
  if (!hasTheme) {
    seek.value = 0;
    paintSeek(0);
    $("theme-time").textContent = "--:-- / --:--";
    return;
  }
  if (dragging) return;
  const now = audioKind === "theme" ? player.currentTime : 0;
  const part = themeLength ? Math.min(now / themeLength, 1) : 0;
  seek.value = Math.round(part * 1000);
  paintSeek(part);
}

// Green part of the line and the time text, like "1:05 / 4:20"
function paintSeek(part) {
  $("theme-seek").style.setProperty("--pct", part * 100 + "%");
  const total = themeLength ? formatTime(themeLength) : "--:--";
  $("theme-time").textContent = `${formatTime(part * themeLength)} / ${total}`;
}

// 65 seconds -> "1:05"
function formatTime(seconds) {
  const s = Math.floor(seconds || 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- 5. Mobile menu button (same as the site) ---------- */

function setupMenu() {
  const button = document.querySelector(".menu-btn");
  const menu = $("menu");
  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------- Start ---------- */

buildRoster();
setupMenu();
setupAudio();
// Open the character from the address (#ken), or the first one (Akuma)
showCharacter(location.hash.slice(1) || CHARACTERS[0].id);
