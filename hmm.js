const height = 389;

function init() {
    const ctx = document.getElementById("cv").getContext("2d");

    // 皇処
    ctx.fillStyle = "hsl(27, 54.5%, 81.1%)"
    ctx.fillRect(2 * height / 9, 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(3 * height / 9, 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(5 * height / 9, 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(6 * height / 9, 6 * height / 9, height / 9, height / 9);
    ctx.fillRect(6 * height / 9, 2 * height / 9, height / 9, height / 9);
    ctx.fillRect(5 * height / 9, 3 * height / 9, height / 9, height / 9);
    ctx.fillRect(3 * height / 9, 5 * height / 9, height / 9, height / 9);
    ctx.fillRect(2 * height / 9, 6 * height / 9, height / 9, height / 9);
    

    // 皇水
    ctx.fillStyle = "hsl(213, 33.6%, 78.9%)";
    ctx.fillRect(4 * height / 9, 2 * height / 9, height / 9, 5 * height / 9);
    ctx.fillRect(2 * height / 9, 4 * height / 9, 5 * height / 9, height / 9);

    // 皇山
    ctx.fillStyle = "hsl(129, 38.5%, 45.4%)";
    ctx.fillRect(4 * height / 9, 4 * height / 9, height / 9, height / 9);

    ctx.strokeStyle = 'rgb(99, 99, 99)';
    ctx.lineWidth = 0.05 * height / 9;
    
    for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i*height/9);
        ctx.lineTo(height, i*height/9);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i*height/9, 0);
        ctx.lineTo(i*height/9, height);
        ctx.stroke();
    }

    
    ctx.beginPath();
    ctx.moveTo(2*height/9, 2*height/9);
    ctx.lineTo(7*height/9, 7*height/9);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2*height/9, 7*height/9);
    ctx.lineTo(7*height/9, 2*height/9);
    ctx.stroke();
    
}