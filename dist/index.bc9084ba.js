let ctx;
const width = 400;
const height = 400;
const main = ()=>{
    const canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    requestAnimationFrame(gameLoop);
};
let x = width / 2 - 20;
const gameLoop = ()=>{
    x += 1;
    clearScreen();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, height / 2 - 20, 40, 40);
    requestAnimationFrame(gameLoop);
};
const clearScreen = ()=>{
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
};
const update = (dt)=>{};
const draw = ()=>{};
document.addEventListener("DOMContentLoaded", main);

//# sourceMappingURL=index.bc9084ba.js.map
