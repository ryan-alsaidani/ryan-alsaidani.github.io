let rawData = [];
let filtered = [];
let pointer = 0; // For infinite scroll
let currentMode = "home";

const container = document.getElementById("cardsContainer");
const searchBox = document.getElementById("searchBox");

// ===== LOAD JSON =====
fetch("data.json")
    .then(r => r.json())
    .then(d => {
        rawData = d;
        showHome();
        setupInfiniteScroll();
    });

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function showHome() {
    currentMode = "home";
    filtered = shuffle([...rawData]);
    pointer = 0;
    container.innerHTML = "";
    renderBatch();
}

function filterByType(type) {
    currentMode = type;
    filtered = rawData.filter(x => x.type === type);
    pointer = 0;
    container.innerHTML = "";
    renderBatch();
}

// ===== SEARCH FUNCTION =====
searchBox.oninput = () => {
    let q = searchBox.value.trim().toLowerCase();
    if (q === "") return showHome();

    filtered = rawData.filter(card =>
        JSON.stringify(card).toLowerCase().includes(q)
    );

    pointer = 0;
    container.innerHTML = "";
    renderBatch(true); // highlight ON
};

// ===== RENDERING =====
function renderBatch(highlight=false) {
    for (let i = 0; i < 8; i++) {
        if (pointer >= filtered.length) pointer = 0;

        const card = filtered[pointer];
        container.appendChild(createCard(card, highlight));
        pointer++;
    }
}

function createCard(card, highlight) {
    const div = document.createElement("div");
    div.className = "card";

    if (card.type === "ads") div.classList.add("ads");
    if (card.type === "uads") div.classList.add("uads");
    if (highlight) div.classList.add("highlight-search");

    if (card.img) {
        const img = document.createElement("img");
        img.src = card.img;
        div.appendChild(img);
    }

    if (card.title) {
        const t = document.createElement("div");
        t.className = "card-title";
        t.textContent = card.title;
        div.appendChild(t);
    }

    if (card.subtext) {
        const s = document.createElement("div");
        s.className = "card-sub";
        s.textContent = card.subtext;
        div.appendChild(s);
    }

    const link = document.createElement("a");
    link.href = card.url;
    link.textContent = "Get";
    link.className = "card-button";
    div.appendChild(link);

    return div;
}

// ===== Infinite scroll =====
function setupInfiniteScroll() {
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            renderBatch(currentMode === "search");
        }
    };
}

// ===== Sidebar Buttons =====
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.onclick = () => {
        let type = btn.dataset.type;
        if (type === "home") showHome();
        else filterByType(type);
    };
});