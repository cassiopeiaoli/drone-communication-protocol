import { statusCodes } from "./statusCodes.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const droneCodeInput = document.querySelector(".drone-code");
const messageContentInput = document.querySelector(".message-content");
const statusCodeInput = document.querySelector(".status-code");
const codes = document.querySelector(".codes");
const animationOnEntry = document.querySelector('.animation');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "rgba(50, 50, 50, 0.3)";
    for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, window.innerWidth, 1);
    }
    window.requestAnimationFrame(draw);
}

animationOnEntry.addEventListener('animationend', ({ animationName }) => {
    if (animationName === "disappear") {
        animationOnEntry.remove();
    }
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

draw();

function renderStatusCode([code, value]) {
    const droneCode = droneCodeInput.value;
    const string = `${droneCode} :: Code ${code} :: ${value}`;
    const status = `
        <p>${string}</p>
        <button class='copy'>COPY</button>
    `;
    const div = document.createElement("div");
    div.className = "code";
    div.innerHTML = status;

    div.querySelector(".copy").addEventListener("click", () => {
        const statusCode = div.querySelector("p").textContent;
        navigator.clipboard.writeText(statusCode);
    });

    codes.appendChild(div);
}

function search() {
    const statusCode = statusCodeInput.value;
    const messageFilter = messageContentInput.value;
    const listifiedStatuses = Object.entries(statusCodes);

    const filteredByStatusCode = listifiedStatuses.filter(([_, value]) => {
        return (
            (value.toLowerCase().includes(statusCode.toLowerCase()) || statusCode === "All") &&
            value.includes(messageFilter)
        );
    });

    codes.innerHTML = null;
    filteredByStatusCode.forEach(renderStatusCode);
}

function updateStatusCodesWithDroneCode() {
    const droneCode = droneCodeInput.value;

    document.querySelectorAll(".code").forEach((code) => {
        const text = code.querySelector("p");
        const content = text.textContent;
        const indexOfColons = content.indexOf("::");
        const withoutCode = content.slice(indexOfColons, content.length);
        text.textContent = `${droneCode} ${withoutCode}`;
    });
}

statusCodeInput.addEventListener("change", search);
messageContentInput.addEventListener("input", search);
droneCodeInput.addEventListener("input", updateStatusCodesWithDroneCode);
search();
