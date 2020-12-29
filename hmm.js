const height = 387;
const left_margin = 40;

function init() {
    const ctx = document.getElementById("cv").getContext("2d");

    // 皇処
    ctx.fillStyle = "hsl(27, 54.5%, 81.1%)"
    ctx.fillRect(left_margin + 2 * height / 9, 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 3 * height / 9, 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 5 * height / 9, 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 6 * height / 9, 6 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 6 * height / 9, 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 5 * height / 9, 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 3 * height / 9, 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(left_margin + 2 * height / 9, 6 * height / 9, height / 9, height / 9);
    

    // 皇水
    ctx.fillStyle = "hsl(213, 33.6%, 78.9%)";
    ctx.fillRect(left_margin + 4 * height / 9, 2 * height / 9, height / 9, 5 * height / 9);
    ctx.fillRect(left_margin + 2 * height / 9, 4 * height / 9, 5 * height / 9, height / 9);

    // 皇山
    ctx.fillStyle = "hsl(129, 38.5%, 45.4%)";
    ctx.fillRect(left_margin + 4 * height / 9, 4 * height / 9, height / 9, height / 9);

    ctx.strokeStyle = 'rgb(99, 99, 99)';
    ctx.lineWidth = 0.03 * height / 9;
    
    for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(left_margin + 0, i*height/9);
        ctx.lineTo(left_margin + height, i*height/9);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(left_margin + i*height/9, 0);
        ctx.lineTo(left_margin + i*height/9, height);
        ctx.stroke();
    }

    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgb(0,0,0)";
    const columns = ["A", "E", "I", "U", "O", "Y", "AI", "AU", "IA"]
    ctx.textAlign = "left";
    for (let i = 0; i < 9; i++) {
        ctx.fillText(columns[i], left_margin + height + 10, 30 + 43 * i);
    }

    ctx.save();

    ctx.rotate(Math.PI);

    ctx.textAlign = "left";
    for (let i = 0; i < 9; i++) {
        ctx.fillText(columns[i], -left_margin + 10, -(15 + 43 * i));
    }

    ctx.restore();
    
}