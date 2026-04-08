// 🧠 LIMPIAR MENSAJE
function limpiar(msg) {
    return msg.toLowerCase()
        .replace(/[¿?]/g, "")
        .replace("qué es", "")
        .replace("para que sirve", "")
        .replace("para qué sirve", "")
        .trim();
}

// 🌐 BUSCAR EN INTERNET (3 NIVELES)
async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    // 🧠 NIVEL 1: RESPUESTA DIRECTA
    if (data.AbstractText && data.AbstractText.length > 20) {
        return `
        🧠 ${data.AbstractText}<br><br>
        🔗 <a href="${data.AbstractURL}" target="_blank">Abrir fuente</a>
        `;
    }

    // 📚 NIVEL 2: RESULTADOS RELACIONADOS
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {

        let respuesta = "📚 Información:<br><br>";
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

    // 🔎 NIVEL 3: BÚSQUEDA EXTERNA
    return `
    🤖 No encontré exacto 😅<br><br>
    🔎 Buscar en:<br>
    • <a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank">Google</a><br>
    • <a href="https://es.wikipedia.org/wiki/${encodeURIComponent(query)}" target="_blank">Wikipedia</a><br>
    • <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank">YouTube</a>
    `;
}

// 🤖 RESPONDER
async function responder(msg) {

    let limpio = limpiar(msg);

    // respuestas rápidas (tipo IA básica)
    if (limpio.includes("hola")) {
        return "Hola 😈 soy Lisluz IA";
    }

    if (limpio.includes("quien eres")) {
        return "Soy una IA que busca en internet y responde 😈";
    }

    // 🌐 WEB
    return await buscarWeb(limpio);
}

// 💬 MOSTRAR MENSAJES
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
