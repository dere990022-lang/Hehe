// Inisialisasi Poin (Ambil dari storage atau set default 1000)
let points = parseInt(localStorage.getItem("points")) || 1000;
const pointsDisplay = document.getElementById("user-points");
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const message = document.getElementById("message");

pointsDisplay.innerText = points;

spinBtn.addEventListener("click", () => {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    const betChoice = document.getElementById("bet-choice").value;

    // Validasi Taruhan
    if (isNaN(betAmount) || betAmount <= 0) {
        return alert("Masukkan jumlah taruhan yang valid!");
    }
    if (betAmount > points) {
        return alert("Poin tidak cukup!");
    }

    // Kurangi poin saat mulai spin
    points -= betAmount;
    updatePoints();
    
    spinBtn.disabled = true;
    message.innerText = "Memutar...";

    // Logika Putaran (Acak derajat)
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = 1800 + extraDegree; // Berputar 5 kali dulu baru ke hasil
    
    wheel.style.transform = `rotate(${totalDegree}deg) `;

    setTimeout(() => {
        // Tentukan hasil berdasarkan derajat (Sederhana)
        let resultColor = "";
        const finalDegree = extraDegree % 360;

        if (finalDegree >= 0 && finalDegree < 30) {
            resultColor = "green"; // Hijau (0)
        } else if (finalDegree >= 30 && finalDegree < 180) {
            resultColor = "red";   // Merah
        } else {
            resultColor = "black"; // Hitam
        }

        // Cek Kemenangan
        if (betChoice === resultColor) {
            let winMultiplier = resultColor === "green" ? 14 : 2;
            let winAmount = betAmount * winMultiplier;
            points += winAmount;
            message.innerText = `MENANG! Hasilnya ${resultColor}. Anda dapat ${winAmount} poin!`;
        } else {
            message.innerText = `KALAH! Hasilnya ${resultColor}. Coba lagi!`;
        }

        updatePoints();
        spinBtn.disabled = false;
        // Reset rotasi agar bisa diputar lagi tanpa glitch visual
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${finalDegree}deg)`;
        setTimeout(() => wheel.style.transition = "transform 4s cubic-bezier(0.1, 0, 0.2, 1)", 50);

    }, 4000);
});

function updatePoints() {
    pointsDisplay.innerText = points;
    localStorage.setItem("points", points);
}

