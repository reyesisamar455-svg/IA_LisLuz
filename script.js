async function buscarWeb(query) {

    let url = "https://api.duckduckgo.com/?q=" 
        + encodeURIComponent(query) 
        + "&format=json&no_html=1";

    let res = await fetch(url);
    let data = await res.json();

    // respuesta inteligente
    if (data.AbstractText) return data.AbstractText;

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        return data.RelatedTopics[0].Text;
    }

    return "No encontré nada 😅";
}

async function enviar() {

    let input = document.getElementById("input");
    let chat = document.getElementById("chat");

    let msg = input.value.trim();
    if (!msg) return;

    agregarMensaje(msg, "user");

    agregarMensaje("Buscando... 🔍", "bot");

    let respuesta = await buscarWeb(msg);

    // quitar "Buscando..."
    chat.lastChild.remove();

    agregarMensaje(respuesta, "bot");

    input.value = "";
}
