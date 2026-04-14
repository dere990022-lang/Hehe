const symbols = ['🀄', '🀅', '🀆', '🀐', '🀙', '🀛', '🀃'];
let points = 1000;
let isSpinning = false;

const gridEl = document.getElementById('slot-grid');
const balanceEl = document.getElementById('balance');
const lastWinEl = document.getElementById('last-win');
const infoText = document.getElementById('info-text');

// Inisialisasi Grid Awal
function init() {
    gridEl.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const div = document.createElement('div');
        div.className = 'tile';
        div.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        gridEl.appendChild(div);
    }
}

async function startSpin() {
    if (isSpinning || points < 10) return;

    isSpinning = true;
    points -= 10;
    updateUI();
    
    infoText.innerText = "Memutar...";
    lastWinEl.innerText = "0";

    // Beri efek spinning ke semua tile
    const allTiles = document.querySelectorAll('.tile');
    allTiles.forEach(t => t.classList.add('spinning'));

    // Delay untuk efek putar
    setTimeout(() => {
        generateResults();
    }, 800);
}

function generateResults() {
    gridEl.innerHTML = '';
    const matrix = [];

    // Buat data matrix 4 baris x 5 kolom
    for (let r = 0; r < 4; r++) {
        matrix[r] = [];
        for (let c = 0; c < 5; c++) {
            matrix[r][c] = {
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                isGold: Math.random() > 0.85
            };
        }
    }

    // Render ke HTML (Penting: urutan baris-kolom harus pas)
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
            const data = matrix[r][c];
            const div = document.createElement('div');
            div.className = `tile ${data.isGold ? 'gold' : ''}`;
            div.id = `tile-${r}-${c}`;
            div.innerText = data.symbol;
            gridEl.appendChild(div);
        }
    }

    checkWins(matrix);
    isSpinning = false;
}

function checkWins(matrix) {
    let totalWin = 0;
    let winPositions = new Set();

    // Logika Ways: Cek simbol dari kolom 0 ke kanan
    for (let r = 0; r < 4; r++) {
        const startSymbol = matrix[r][0].symbol;
        let matches = [{r, c: 0}];

        for (let c = 1; c < 5; c++) {
            let columnMatches = [];
            for (let r2 = 0; r2 < 4; r2++) {
                if (matrix[r2][c].symbol === startSymbol) {
                    columnMatches.push({r: r2, c});
                }
            }
            if (columnMatches.length > 0) {
                matches.push(...columnMatches);
            } else {
                break;
            }
        }

        // Minimal 3 kolom berurutan
        const uniqueCols = new Set(matches.map(m => m.c));
        if (uniqueCols.size >= 3) {
            matches.forEach(m => winPositions.add(`${m.r}-${m.c}`));
            totalWin += uniqueCols.size * 15;
        }
    }

    if (totalWin > 0) {
        winPositions.forEach(pos => {
            document.getElementById(`tile-${pos}`).classList.add('win-animate');
        });
        points += totalWin;
        lastWinEl.innerText = totalWin;
        infoText.innerText = "BIG WIN!";
    } else {
        infoText.innerText = "Coba lagi...";
    }
    updateUI();
}

function updateUI() {
    balanceEl.innerText = points;
}

init();
