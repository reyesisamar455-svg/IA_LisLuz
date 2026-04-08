const API_KEY = "TU_API_KEY_AQUI";

// 🧠 MEMORIA (chat real)
let historial = [
  {
    role: "user",
    parts: [{ text: "Eres Lisluz IA 👑, una IA inteligente como ChatGPT. Responde claro, útil y como humano." }]
  }
];

// 🤖 PREGUNTAR A GEMINI
async function preguntar(msg) {

  historial.push({
    role: "user",
    parts: [{ text: msg }]
  });

  let res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: historial
      })
    }
  );

  let data = await res.json();

  // ⚠️ evitar errores
  if (!data.candidates) {
    return "❌ Error con la API 😅 revisa tu API KEY";
  }

  let texto = data.candidates[0].content.parts[0].text;

  historial.push({
    role: "model",
    parts: [{ text: texto }]
  });

  return texto;
}

// 💬 MENSAJES
function agregarMensaje(texto, tipo) {

  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + tipo;
  div.innerText = texto;

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

  let res = await preguntar(msg);

  loading.remove();

  agregarMensaje(res, "bot");

  input.value = "";
}

// ENTER
document.getElementById("input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") enviar();
});
