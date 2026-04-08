// 🧠 LIMPIAR TEXTO
function limpiar(msg) {
    return msg.toLowerCase()
        .replace(/[¿?]/g, "")
        .replace("qué es", "")
        .replace("para que sirve", "")
        .replace("para qué sirve", "")
        .trim();
}

// 🌐 1. DUCKDUCKGO
async function buscarDuck(query) {
    try {
        let url = "https://api.duckduckgo.com/?q=" 
            + encodeURIComponent(query) 
            + "&format=json&no_html=1&skip_disambig=1";

        let res = await fetch(url);
        let data = await res.json();

        if (data.AbstractText && data.AbstractText.length > 20) {
            return `
            🧠 ${data.AbstractText}<br><br>
            🔗 <a href="${data.AbstractURL}" target="_blank">Fuente</a>
            `;
        }

        // RelatedTopics extra
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {

            let respuesta = "📚 Info:<br><br>";
            let count = 0;

            for (let item of data.RelatedTopics) {
                if (item.Text && item.FirstURL && count < 3) {
                    respuesta += `• ${item.Text}<br>`;
                    respuesta += `<a href="${item.FirstURL}" target="_blank">Ver</a><br><br>`;
                    count++;
                }
            }

            if (count > 0) return respuesta;
        }

    } catch (e) {}

    return null;
}

// 📚 2. WIKIPEDIA
async function buscarWiki(query) {
    try {
        let url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        let res = await fetch(url);
        let data = await res.json();

        if (data.extract) {
            return `
            📚 ${data.extract}<br><br>
            🔗 <a href="${data.content_urls.desktop.page}" target="_blank">Leer más</a>
            `;
        }
    } catch (e) {}

    return null;
}

// 🔎 3. GOOGLE LINKS
function linksGoogle(query) {
    let q = encodeURIComponent(query);

    return `
    🌐 Más resultados:<br><br>
    • <a href="https://www.google.com/search?q=${q}" target="_blank">Google</a><br>
    • <a href="https://es.wikipedia.org/wiki/${q}" target="_blank">Wikipedia</a><br>
    • <a href="https://www.youtube.com/results?search_query=${q}" target="_blank">YouTube</a>
    `;
}

// 🤖 4. IA FALLBACK
function iaLocal(query) {

    if (query.includes("ia")) {
        return "La inteligencia artificial permite a las máquinas aprender y tomar decisiones 😈";
    }

    if (query.includes("roblox")) {
        return "Roblox sirve para crear y jugar juegos creados por usuarios 🎮";
    }

    if (query.includes("minecraft")) {
        return "Minecraft es un juego de construcción y supervivencia ⛏️";
    }

    if (query.includes("delta")) {
    let q = encodeURIComponent(query);

    return `
    🔥 Página oficial / descarga:<br><br>
    • <a href="https://www.google.com/search?q=${q}" target="_blank">Buscar Delta Executor</a><br><br>
    ⚠️ Ten cuidado con páginas falsas 😈
    `;
    }
    return "🤖 No tengo una respuesta exacta pero puedes buscar más abajo 👇";
}

// 🧠 RESPUESTA FINAL
async function responder(msg) {

    let limpio = limpiar(msg);

    // 1️⃣ DuckDuckGo
    let duck = await buscarDuck(limpio);
    if (duck) return duck;

    // 2️⃣ Wikipedia
    let wiki = await buscarWiki(limpio);
    if (wiki) return wiki;

    // 3️⃣ IA fallback + Google links
    return `
    ${iaLocal(limpio)}<br><br>
    ${linksGoogle(limpio)}
    `;
}

// 💬 MENSAJES
function agregarMensaje(texto, tipo) {

    let chat = document.getElementById("chat");

    let div = document.createElement("div");
    div.className = "msg " + tipo;

    div.innerHTML = texto;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// 🚀 ENVIAR
async function enviar() {

    let input = document.getElementById("input");
    let msg = input.value.trim();

    if (!msg) return;

    agregarMensaje(msg, "user");

    let loading = document.createElement("div");
    loading.className = "msg bot";
    loading.innerText = "🧠 Buscando en todas las fuentes...";
    document.getElementById("chat").appendChild(loading);

    let res = await responder(msg);

    loading.remove();

    agregarMensaje(res, "bot");

    input.value = "";
}

// ENTER
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
