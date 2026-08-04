// Obfuscated email: assembled at click time so scrapers reading the HTML
// never see an address.
for (const el of document.querySelectorAll("a.mailto")) {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const user = ["inquiries", "tokosi"].join(".");
    const host = ["gmail", "com"].join(".");
    location.href = "mailto:" + user + "@" + host;
  });
}

// Gentle fade-up as sections enter the viewport.
const observer = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); }
  }),
  { threshold: 0.08 }
);
document.querySelectorAll(".fade").forEach((el) => observer.observe(el));

// Live line on the home page, fed by the agent's public audit log.
(async () => {
  const target = document.getElementById("live-line");
  if (!target) return;
  try {
    const res = await fetch("https://raw.githubusercontent.com/wale-eth/ai-jobs-agent/data/data/open_jobs.json?t=" + Date.now());
    if (!res.ok) return;
    const jobs = await res.json();
    const lats = jobs.filter(j => !j.is_backfill && j.detection_latency_s != null)
                     .map(j => j.detection_latency_s).sort((a, b) => a - b);
    let latText = "under an hour";
    if (lats.length >= 5) {
      const med = lats[lats.length >> 1];
      latText = med < 5400 ? "about " + Math.round(med / 60) + " minutes" : (med / 3600).toFixed(1) + " hours";
    }
    target.innerHTML =
      "Right now, an agent I built is tracking <b>" + jobs.length.toLocaleString() +
      " open roles</b> across 88 companies, spotting new ones a median of <b>" +
      latText + "</b> after they're posted. That number is live; it updated when you loaded this page.";
  } catch (e) { /* static copy stays */ }
})();
