const symbols = ['🀄', '🀅', '🀆', '🀐', '🀙', '🀛', '🀃'];
let points = 1000;
let isSpinning = false;

// Munculkan grid kosong saat pertama kali buka
function initGame() {
    const grid = document.getElementById('slot-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const div = document.createElement('div');
        div.className = 'tile';
        div.innerText = '?';
        grid.appendChild(div);
    }
}

async function handleSpin() {
    if (isSpinning || points < 10) return;

    isSpinning = true;
    points -= 10;
    updateUI();
    
    document.getElementById('status-msg').innerText = "Memutar...";
    const grid = document.getElementById('slot-grid');
    grid.innerHTML = '';

    // Data grid (5 kolom x 4 baris)
    const gridData = [];

    // Mengacak data
    for (let r = 0; r < 4; r++) {
        gridData[r] = [];
        for (let c = 0; c < 5; c++) {
            gridData[r][c] = {
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                isGold: Math.random() > 0.8 // 20% peluang emas
            };
        }
    }

    // Render ke layar
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 4; r++) {
            const item = gridData[r][c];
            const div = document.createElement('div');
            div.className = `tile ${item.isGold ? 'gold' : ''}`;
            div.id = `t-${r}-${c}`;
            div.innerText = item.symbol;
            grid.appendChild(div);
        }
    }

    // Cek Kemenangan (Logic sederhana: 3 kolom pertama sama)
    checkWins(gridData);
    
    isSpinning = false;
}

function checkWins(data) {
    let winCount = 0;
    
    // Cek simbol dari baris kolom 0
    for (let r = 0; r < 4; r++) {
        const matchSymbol = data[r][0].symbol;
        let matches = [ {r, c: 0} ];

        // Cek kolom 1, 2, dst
        for (let c = 1; c < 5; c++) {
            let found = false;
            for (let r2 = 0; r2 < 4; r2++) {
                if (data[r2][c].symbol === matchSymbol) {
                    matches.push({r: r2, c});
                    found = true;
                }
            }
            if (!found) break;
        }

        // Jika minimal 3 kolom berurutan ada simbol yang sama
        if (matches.length >= 3) {
            matches.forEach(pos => {
                document.getElementById(`t-${pos.r}-${pos.c}`).classList.add('win-glow');
            });
            winCount += matches.length * 10;
        }
    }

    if (winCount > 0) {
        points += winCount;
        document.getElementById('status-msg').innerText = `MENANG +${winCount}!`;
        updateUI();
    } else {
        document.getElementById('status-msg').innerText = "Coba Lagi";
    }
}

function updateUI() {
    document.getElementById('balance').innerText = points;
}

initGame();
