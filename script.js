async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    let respuesta = "";

    // 🧠 EXPLICACIÓN PRINCIPAL
    if (data.AbstractText) {
        respuesta += "🧠 " + data.AbstractText + "\n\n";
    }

    // 🔗 LINK PRINCIPAL
    if (data.AbstractURL) {
        respuesta += "🔗 Leer más: " + data.AbstractURL + "\n\n";
    }

    // 📚 RESULTADOS RELACIONADOS
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        respuesta += "📚 Más resultados:\n";

        data.RelatedTopics.slice(0, 3).forEach(item => {
            if (item.Text && item.FirstURL) {
                respuesta += "• " + item.Text + "\n";
                respuesta += item.FirstURL + "\n\n";
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

    // permitir links clicables
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
