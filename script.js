// 🧠 MEMORIA (aprende sola)
let memoria = JSON.parse(localStorage.getItem("memoria")) || [];

// 🧠 GUARDAR MEMORIA
function guardar() {
    localStorage.setItem("memoria", JSON.stringify(memoria));
}

// 🧠 APRENDER
function aprender(codigo) {
    memoria.push(codigo);
    guardar();
}

// 🧠 ANALIZAR CÓDIGO
function analizarCodigo(codigo) {
    return {
        gui: codigo.includes("ScreenGui"),
        boton: codigo.includes("TextButton"),
        tool: codigo.includes("Tool"),
        jugador: codigo.includes("Players"),
        daño: codigo.includes("Humanoid")
    };
}

// 🤖 GENERAR DESDE MEMORIA
function generarDesdeMemoria(msg) {

    msg = msg.toLowerCase();

    let resultado = [];

    for (let codigo of memoria) {

        let d = analizarCodigo(codigo);

        if (msg.includes("gui") && d.gui) resultado.push(codigo);
        if (msg.includes("boton") && d.boton) resultado.push(codigo);
        if (msg.includes("tool") && d.tool) resultado.push(codigo);
        if (msg.includes("jugador") && d.jugador) resultado.push(codigo);
        if (msg.includes("daño") && d.daño) resultado.push(codigo);
    }

    if (resultado.length === 0) {
        return "// 🤖 No sé aún 😅 enséñame código";
    }

    return resultado.join("\n\n");
}

// 🧠 GENERADOR BÁSICO AUTOMÁTICO
function generarBasico(msg) {

    msg = msg.toLowerCase();

    let code = [];

    if (msg.includes("gui")) {
        code.push(`
local gui = Instance.new("ScreenGui")
gui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")
`);
    }

    if (msg.includes("boton")) {
        code.push(`
local btn = Instance.new("TextButton")
btn.Text = "Click"
btn.Parent = gui

btn.MouseButton1Click:Connect(function()
    print("Click 😈")
end)
`);
    }

    if (msg.includes("tool")) {
        code.push(`
local tool = Instance.new("Tool")
tool.Parent = game.Players.LocalPlayer:WaitForChild("Backpack")
`);
    }

    if (msg.includes("moneda")) {
        let num = (msg.match(/\d+/) || [0])[0];

        code.push(`
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)

    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = ${num}
    coins.Parent = leaderstats

end)
`);
    }

    return code.join("\n");
}

// 🧠 DEBUGGER
function corregirCodigo(code) {

    let fix = code;

    fix = fix.replace("game.Players.LocalPlayer.Backpack",
        "game.Players.LocalPlayer:WaitForChild('Backpack')");

    fix = fix.replace("FindFirstChild(", "WaitForChild(");

    return fix;
}

// 🤖 IA PRINCIPAL
function IA(msg) {

    // 👉 si es código → aprende
    if (msg.includes("local") || msg.includes("Instance.new")) {
        aprender(msg);
        return "// 🧠 Aprendido 😈";
    }

    // 👉 intenta generar desde memoria
    let res = generarDesdeMemoria(msg);

    if (!res.includes("No sé")) {
        return corregirCodigo(res);
    }

    // 👉 si no sabe → generar básico
    let auto = generarBasico(msg);

    if (auto) {
        aprender(auto);
        return corregirCodigo(auto);
    }

    return "// 🤖 No entendí 😅 intenta algo mejor";
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
function enviar() {

    let input = document.getElementById("input");
    let msg = input.value.trim();

    if (!msg) return;

    agregarMensaje(msg, "user");

    let res = IA(msg);

    agregarMensaje(res, "bot");

    input.value = "";
}

// ENTER
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") enviar();
});
