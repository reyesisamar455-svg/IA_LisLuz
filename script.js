// 🧠 LIMPIAR TEXTO
function limpiar(msg) {
    return msg.toLowerCase()
        .replace(/[¿?]/g, "")
        .replace("qué es", "")
        .replace("para que sirve", "")
        .replace("para qué sirve", "")
        .trim();
}

// 🌐 DUCKDUCKGO
async function buscarDuck(query) {
    try {
        let url = "https://api.duckduckgo.com/?q=" 
            + encodeURIComponent(query) 
            + "&format=json&no_html=1&skip_disambig=1";

        let res = await fetch(url);
        let data = await res.json();

        if (data.AbstractText && data.AbstractText.length > 20) {
            return data.AbstractText;
        }

        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            let textos = [];

            for (let item of data.RelatedTopics) {
                if (item.Text && textos.length < 3) {
                    textos.push(item.Text);
                }
            }

            return textos.join("\n");
        }

    } catch (e) {}

    return null;
}

// 📚 WIKIPEDIA
async function buscarWiki(query) {
    try {
        let url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        let res = await fetch(url);
        let data = await res.json();

        if (data.extract) return data.extract;

    } catch (e) {}

    return null;
}

// 🤖 ESTILO IA
function estiloIA(texto, pregunta) {

    return `
🤖 <b>Respuesta:</b><br><br>

👉 <b>${pregunta}</b><br><br>

🧠 ${texto}<br><br>

💬 ¿Quieres que lo explique mejor? 😈
`;
}

// 🔎 LINKS EXTRA
function linksGoogle(query) {
    let q = encodeURIComponent(query);

    return `
🌐 Más resultados:<br><br>
<a href="https://www.google.com/search?q=${q}" target="_blank">Google</a><br>
<a href="https://es.wikipedia.org/wiki/${q}" target="_blank">Wikipedia</a><br>
<a href="https://www.youtube.com/results?search_query=${q}" target="_blank">YouTube</a>
`;
}

// 🧠 RESPUESTA FINAL
async function responder(msg) {

    let limpio = limpiar(msg);

    let duck = await buscarDuck(limpio);
    let wiki = await buscarWiki(limpio);

    let respuesta = "";

    if (duck) {
        respuesta += duck + "<br><br>";
    }

    if (wiki) {
        respuesta += wiki + "<br><br>";
    }

    if (!respuesta) {
        return `
🤖 No encontré información exacta 😅<br><br>
${linksGoogle(limpio)}
`;
    }

    return estiloIA(respuesta, msg);
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
    loading.innerText = "🧠 Pensando...";
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
