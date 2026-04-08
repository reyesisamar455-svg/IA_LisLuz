async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    let respuesta = "";

    // 🧠 explicación principal
    if (data.AbstractText) {
        respuesta += "🧠 " + data.AbstractText + "<br><br>";
    }

    // 🔗 link principal
    if (data.AbstractURL) {
        respuesta += "🔗 <a href='" + data.AbstractURL + "' target='_blank'>Abrir fuente</a><br><br>";
    }

    // 📚 más resultados
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {

        respuesta += "📚 Más info:<br><br>";

        let count = 0;

        data.RelatedTopics.forEach(item => {

            if (item.Text && item.FirstURL && count < 5) {

                respuesta += "• " + item.Text + "<br>";
                respuesta += "<a href='" + item.FirstURL + "' target='_blank'>Ver</a><br><br>";

                count++;
            }

        });
    }

    if (!respuesta) {
        return "❌ No encontré info 😅 intenta algo más específico";
    }

    return respuesta;
}

function agregarMensaje(texto, tipo) {

    let chat = document.getElementById("chat");

    let div = document.createElement("div");
    div.className = "msg " + tipo;

    div.innerHTML = texto;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function enviar() {

    let input = document.getElementById("input");
    let msg = input.value.trim();

    if (!msg) return;

    agregarMensaje(msg, "user");

    // mensaje de carga
    let loading = document.createElement("div");
    loading.className = "msg bot";
    loading.innerText = "🔍 Buscando en internet...";
    document.getElementById("chat").appendChild(loading);

    let respuesta = await buscarWeb(msg);

    loading.remove();

    agregarMensaje(respuesta, "bot");

    input.value = "";
}

// ENTER para enviar
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
