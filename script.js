// 🧠 MEMORIA (IA aprende sola)
let memoria = JSON.parse(localStorage.getItem("memoria")) || [];

// 🧠 GUARDAR
function guardar() {
    localStorage.setItem("memoria", JSON.stringify(memoria));
}

// 🧠 APRENDER
function aprender(codigo) {
    if (!memoria.includes(codigo)) {
        memoria.push(codigo);
        guardar();
    }
}

// 🧠 ANALIZAR CÓDIGO
function analizarCodigo(codigo) {
    return {
        gui: codigo.includes("ScreenGui"),
        boton: codigo.includes("TextButton"),
        tool: codigo.includes("Tool"),
        jugador: codigo.includes("Players")
    };
}

// 🤖 BUSCAR EN MEMORIA
function generarDesdeMemoria(msg) {

    msg = msg.toLowerCase();
    let resultado = [];

    for (let codigo of memoria) {
        let d = analizarCodigo(codigo);

        if (msg.includes("gui") && d.gui) resultado.push(codigo);
        if (msg.includes("boton") && d.boton) resultado.push(codigo);
        if (msg.includes("tool") && d.tool) resultado.push(codigo);
        if (msg.includes("jugador") && d.jugador) resultado.push(codigo);
    }

    return resultado.join("\n\n");
}

// 🧠 GENERADOR PRO
function generarBasico(msg) {

    msg = msg.toLowerCase();

    // 📱💻 UI COMPLETA RESPONSIVA
    if (msg.includes("ui") || msg.includes("gui")) {

        return `
-- 📱💻 UI RESPONSIVA (PC + CELULAR)

local player = game.Players.LocalPlayer
local gui = Instance.new("ScreenGui")
gui.Name = "MainUI"
gui.Parent = player:WaitForChild("PlayerGui")

local frame = Instance.new("Frame")
frame.Size = UDim2.new(0.3,0,0.3,0)
frame.Position = UDim2.new(0.35,0,0.35,0)
frame.BackgroundColor3 = Color3.fromRGB(30,30,30)
frame.Parent = gui

local label = Instance.new("TextLabel")
label.Size = UDim2.new(1,0,0.3,0)
label.Text = "👑 Lisluz UI"
label.TextScaled = true
label.BackgroundTransparency = 1
label.Parent = frame

local btn = Instance.new("TextButton")
btn.Size = UDim2.new(0.8,0,0.3,0)
btn.Position = UDim2.new(0.1,0,0.5,0)
btn.Text = "Click 😈"
btn.TextScaled = true
btn.BackgroundColor3 = Color3.fromRGB(50,50,50)
btn.Parent = frame

btn.MouseButton1Click:Connect(function()
    print("Funciona en PC y celular 😈")
end)
`;
    }

    // 💰 MONEDAS
    if (msg.includes("moneda")) {
        let num = (msg.match(/\d+/) || [0])[0];

        return `
-- 💰 SISTEMA DE MONEDAS

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
`;
    }

    // 🔧 TOOL
    if (msg.includes("tool")) {
        return `
-- 🔧 TOOL

local tool = Instance.new("Tool")
tool.Parent = game.Players.LocalPlayer:WaitForChild("Backpack")
`;
    }

    return "";
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

    // 👉 buscar en memoria
    let mem = generarDesdeMemoria(msg);

    if (mem) {
        return corregirCodigo(mem);
    }

    // 👉 generar nuevo
    let gen = generarBasico(msg);

    if (gen) {
        aprender(gen);
        return corregirCodigo(gen);
    }

    return "// 🤖 No entendí 😅 intenta: ui, monedas, tool";
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
