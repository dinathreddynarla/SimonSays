const sounds = {
    red: new Audio("red.wav"),
    blue: new Audio("blue.wav"),
    green: new Audio("green.wav"),
    yellow: new Audio("yellow.wav"),
    loseLife: new Audio("lifelost.wav"),
    gameLost: new Audio("gamelost.wav")
};

const colors = ["red", "blue", "green", "yellow"];
let gameSequence = [];
let playerSequence = [];
let score = 0;
let lives = 0;
let playerTurn = false;
let isTouching = false;

function flashBulb(color) {
    const bulb = document.getElementById(color);
    bulb.classList.add("glow");
    sounds[color].currentTime = 0;
    sounds[color].play();
    setTimeout(() => {
        bulb.classList.remove("glow");
    }, 500);
}

async function playSequence() {
    playerTurn = false;
    document.getElementById("message").classList.add("hidden");
    for (let color of gameSequence) {
        flashBulb(color);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    playerTurn = true;
    playerSequence = [];
    document.getElementById("message").classList.remove("hidden");
}

function addNewColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
}

function updateLivesDisplay() {
    const livesDisplay = document.getElementById("lives");
    livesDisplay.textContent = lives;
    let heartsHtml = '';
    for (let i = 0; i < lives; i++) {
        heartsHtml += '<i class="fa-solid fa-heart heart"></i>';
    }
    livesDisplay.innerHTML = heartsHtml;
}

function startGame() {
    score = 0;
    lives = 3;
    gameSequence = [];
    document.getElementById("score").textContent = score;
    document.getElementById("restart-button").classList.remove("hidden");
    updateLivesDisplay();
    addNewColor();
    playSequence();
}

function restartGame() {
    document.getElementById("messagelost").classList.add("hidden");
    startGame();
}

function playerInput(color) {
    if (!playerTurn || isTouching) return;
    isTouching = true;
    playerSequence.push(color);
    flashBulb(color);
    document.getElementById("message").classList.add("hidden");
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== gameSequence[index]) {
        if (lives > 0) {
            lives--;
            updateLivesDisplay();
            sounds.loseLife.currentTime = 0;
            sounds.loseLife.play();
            playerSequence = [];
            playerTurn = false;
            setTimeout(playSequence, 2000);
        } else {
            sounds.gameLost.currentTime = 0;
            sounds.gameLost.play();
            document.getElementById("messagelost").textContent = "Game Lost! Final Score: " + score;
            document.getElementById("messagelost").classList.remove("hidden");
            // document.getElementById("restart-button").classList.remove("hidden");
            playerTurn = false;
            return;
        }
    } else {
        if (playerSequence.length === gameSequence.length) {
            score++;
            document.getElementById("score").textContent = score;
            if (score % 5 === 0) {
                lives++;
                updateLivesDisplay();
            }
            setTimeout(() => {
                addNewColor();
                playSequence();
            }, 2000);
        }
    }
    setTimeout(() => {
        isTouching = false;
    }, 300);
}

document.querySelectorAll(".bulb").forEach(bulb => {
    bulb.addEventListener("click", () => playerInput(bulb.id));
    bulb.addEventListener("touchstart", () => playerInput(bulb.id));
});
const instructionButton = document.getElementById("instruction-button");
instructionButton.addEventListener("click",()=> toggleInstructions);
instructionButton.addEventListener("touchstart",()=> toggleInstructions); 

function toggleInstructions() {
    const instructionCard = document.getElementById("instruction-card");
    instructionCard.classList.toggle("hidden");
}
