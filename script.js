let memoria = JSON.parse(localStorage.getItem("memoria")) || {};

function responder(msg) {

    msg = msg.toLowerCase();

    if (memoria[msg]) return memoria[msg];

    if (msg.includes("hola")) return "Hola 😈 soy Lisluz";

    if (msg.includes("kit")) return "Usa /kit minero";

    return "No sé 😅 enséñame";
}

function enviar() {

    let input = document.getElementById("input");
    let chat = document.getElementById("chat");

    let msg = input.value;

    chat.innerHTML += "<p>👤: " + msg + "</p>";

    let res = responder(msg);

    chat.innerHTML += "<p>🤖: " + res + "</p>";

    if (res === "No sé 😅 enséñame") {
        let nueva = prompt("¿Qué debo responder?");
        if (nueva) {
            memoria[msg.toLowerCase()] = nueva;
            localStorage.setItem("memoria", JSON.stringify(memoria));
        }
    }

    input.value = "";
}
