// 🧠 LIMPIAR TEXTO
function limpiar(msg) {
    return msg.toLowerCase()
        .replace(/[¿?]/g, "")
        .trim();
}

// 🌐 RESPUESTA TIPO CHROME
function buscarChrome(query) {

    let q = encodeURIComponent(query);

    return `
    🔎 Resultados en Chrome:<br><br>

    🌐 <a href="https://www.google.com/search?q=${q}" target="_blank">Buscar en Google</a><br><br>

    📚 <a href="https://es.wikipedia.org/wiki/${q}" target="_blank">Wikipedia</a><br><br>

    🎥 <a href="https://www.youtube.com/results?search_query=${q}" target="_blank">YouTube</a><br><br>

    💡 Consejo: abre Google para ver resultados completos 😈
    `;
}

// 🤖 RESPONDER
function responder(msg) {

    let limpio = limpiar(msg);

    // respuestas básicas
    if (limpio.includes("hola")) {
        return "Hola 😈 soy Lisluz IA";
    }

    if (limpio.includes("quien eres")) {
        return "Soy una IA que busca como Chrome 😈";
    }

    // 🔥 búsqueda real
    return buscarChrome(limpio);
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
function enviar() {

    let input = document.getElementById("input");
    let msg = input.value.trim();

    if (!msg) return;

    agregarMensaje(msg, "user");

    let loading = document.createElement("div");
    loading.className = "msg bot";
    loading.innerText = "🌐 Buscando en Chrome...";
    document.getElementById("chat").appendChild(loading);

    setTimeout(() => {

        loading.remove();

        let res = responder(msg);
        agregarMensaje(res, "bot");

    }, 500);

    input.value = "";
}

// ENTER
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
