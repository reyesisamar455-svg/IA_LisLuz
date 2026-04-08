async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    let respuesta = "";

    // 🧠 explicación principal
    if (data.AbstractText) {
        respuesta += "🧠 " + data.AbstractText + "\n\n";
    }

    // 🔗 link principal
    if (data.AbstractURL) {
        respuesta += "🔗 <a href='" + data.AbstractURL + "' target='_blank'>Leer más</a>\n\n";
    }

    // 📚 resultados relacionados
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        respuesta += "📚 Más resultados:\n";

        data.RelatedTopics.slice(0, 3).forEach(item => {
            if (item.Text && item.FirstURL) {
                respuesta += "• " + item.Text + "\n";
                respuesta += "<a href='" + item.FirstURL + "' target='_blank'>Abrir</a>\n\n";
            }
        });
    }

    if (!respuesta) {
        return "❌ No encontré info 😅 intenta otra pregunta";
    }

    return respuesta;
}

function agregarMensaje(texto, tipo) {

    let chat = document.getElementById("chat");

    let div = document.createElement("div");
    div.className = "msg " + tipo;

    div.innerHTML = texto.replace(/\n/g, "<br>");

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function enviar() {

    let input = document.getElementById("input");
    let msg = input.value.trim();

    if (!msg) return;

    agregarMensaje(msg, "user");

    agregarMensaje("🔍 Buscando en internet...", "bot");

    let respuesta = await buscarWeb(msg);

    document.getElementById("chat").lastChild.remove();

    agregarMensaje(respuesta, "bot");

    input.value = "";
}

// ENTER para enviar 😈
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
