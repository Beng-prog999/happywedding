const RSVP_WHATSAPP = "6281234567890";
const weddingDate = new Date(
  document.querySelector("#countdown").dataset.date,
).getTime();
const guestGreeting = document.querySelector("#guest-greeting");
const guestName = new URLSearchParams(window.location.search).get("to");
const toast = document.querySelector("#toast");
let toastTimer;

if (guestName) {
  document.querySelector("#guest-name").textContent = guestName.trim();
  guestGreeting.hidden = false;
}

function updateCountdown() {
  const remaining = Math.max(0, weddingDate - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };

  Object.entries(values).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(
      id === "days" ? 3 : 2,
      "0",
    );
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const calendarDate = "20261212T080000";
const calendarEnd = "20261212T140000";
const calendarTitle = encodeURIComponent("Pernikahan Okta & Fidie");
const calendarLocation = encodeURIComponent(
  "The Glasshouse, Jl. Kemang Raya No. 12, Jakarta Selatan",
);
document.querySelector("#calendar-link").href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDate}/${calendarEnd}&details=${encodeURIComponent("Akad nikah dan resepsi Okta & Fidie.")}&location=${calendarLocation}`;

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  button.setAttribute(
    "aria-label",
    isOpen ? "Buka navigasi" : "Tutup navigasi",
  );
  document.querySelector("#site-nav").classList.toggle("is-open", !isOpen);
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document
      .querySelector(".menu-toggle")
      .setAttribute("aria-expanded", "false");
    document
      .querySelector(".menu-toggle")
      .setAttribute("aria-label", "Buka navigasi");
    document.querySelector("#site-nav").classList.remove("is-open");
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => toast.classList.remove("is-visible"),
    3200,
  );
}

const musicButton = document.querySelector("#music-toggle");
const weddingMusic = document.querySelector("#wedding-music");
weddingMusic.volume = 0.75;

musicButton.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
    } catch {
      showToast("Musik tidak bisa diputar. Pastikan file MP4 tersedia.");
    }
  } else {
    weddingMusic.pause();
  }
});

weddingMusic.addEventListener("play", () => {
  musicButton.classList.add("is-playing");
  musicButton.setAttribute("aria-pressed", "true");
  musicButton.setAttribute("aria-label", "Jeda musik");
  musicButton.title = "Jeda musik";
});

weddingMusic.addEventListener("pause", () => {
  musicButton.classList.remove("is-playing");
  musicButton.setAttribute("aria-pressed", "false");
  musicButton.setAttribute("aria-label", "Putar musik");
  musicButton.title = "Putar musik";
});

weddingMusic.addEventListener("error", () => {
  showToast("File musik gagal dimuat. Periksa nama dan lokasi file MP4.");
});

document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#rsvp-name").value.trim();
  const attendance = document.querySelector("#attendance").value;
  const guestCount = document.querySelector("#guest-count").value;
  const wishes = document.querySelector("#wishes").value.trim();
  const message = [
    "Assalamu'alaikum, saya ingin mengonfirmasi undangan pernikahan Okta & Fidie.",
    `Nama: ${name}`,
    `Konfirmasi: ${attendance}`,
    ...(attendance === "Hadir" ? [`Jumlah tamu: ${guestCount} orang`] : []),
    ...(wishes ? [`Ucapan dan doa: ${wishes}`] : []),
  ].join("\n");

  if (!RSVP_WHATSAPP || RSVP_WHATSAPP === "6281234567890") {
    showToast("Ganti nomor RSVP di script.js dengan nomor WhatsApp keluarga.");
    return;
  }

  window.open(
    `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
});

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".story-copy, .event-card, .gallery-item")
    .forEach((item) => {
      observer.observe(item);
    });
}
