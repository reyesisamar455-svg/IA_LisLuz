async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    // 🧠 NIVEL 1: RESPUESTA PRINCIPAL
    if (data.AbstractText && data.AbstractText.length > 20) {
        return `
        🧠 ${data.AbstractText}<br><br>
        🔗 <a href="${data.AbstractURL}" target="_blank">Abrir fuente</a>
        `;
    }

    // 📚 NIVEL 2: TEMAS RELACIONADOS
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {

        let respuesta = "📚 Información encontrada:<br><br>";
        let count = 0;

        for (let item of data.RelatedTopics) {

            if (item.Text && item.FirstURL) {

                respuesta += `• ${item.Text}<br>`;
                respuesta += `<a href="${item.FirstURL}" target="_blank">Ver</a><br><br>`;

                count++;

                if (count >= 3) break;
            }
        }

        if (count > 0) return respuesta;
    }

    // 🔎 NIVEL 3: LINKS GENERALES
    return `
    🤖 No encontré explicación directa 😅<br><br>
    🔎 Busca aquí:<br>
    • <a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank">Google</a><br>
    • <a href="https://es.wikipedia.org/wiki/${encodeURIComponent(query)}" target="_blank">Wikipedia</a><br>
    • <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank">YouTube</a>
    `;
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

    let loading = document.createElement("div");
    loading.className = "msg bot";
    loading.innerText = "🔍 Buscando...";
    document.getElementById("chat").appendChild(loading);

    let respuesta = await buscarWeb(msg);

    loading.remove();

    agregarMensaje(respuesta, "bot");

    input.value = "";
}

// ENTER
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
