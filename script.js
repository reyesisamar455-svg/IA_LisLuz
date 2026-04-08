async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1&skip_disambig=1";

    let res = await fetch(url);
    let data = await res.json();

    let respuesta = "";

    // 🧠 1. EXPLICACIÓN PRINCIPAL
    if (data.AbstractText && data.AbstractText.length > 10) {
        respuesta += "🧠 " + data.AbstractText + "<br><br>";
    }

    // 🔗 2. LINK PRINCIPAL
    if (data.AbstractURL) {
        respuesta += "🔗 <a href='" + data.AbstractURL + "' target='_blank'>Abrir fuente</a><br><br>";
    }

    // 📚 3. RESULTADOS RELACIONADOS (MEJORADO)
    let encontrados = 0;

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {

        respuesta += "📚 Más info:<br><br>";

        data.RelatedTopics.forEach(item => {

            if (item.Text && item.FirstURL && encontrados < 5) {

                respuesta += "• " + item.Text + "<br>";
                respuesta += "<a href='" + item.FirstURL + "' target='_blank'>Ver</a><br><br>";

                encontrados++;
            }

        });
    }

    // 🧠 4. SI NO ENCUENTRA NADA → RESPUESTA INTELIGENTE
    if (!respuesta || respuesta.length < 20) {
        return "🤖 No encontré info directa 😅<br><br>👉 Intenta escribir más específico como:<br>• qué es Roblox<br>• para qué sirve la IA<br>• historia de Minecraft";
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

    let loading = document.createElement("div");
    loading.className = "msg bot";
    loading.innerText = "🔍 Buscando mejor info...";
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
