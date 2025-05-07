// --- Các biến và thiết lập ban đầu ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// ... các element khác ...
const scoreDisplay = document.getElementById('scoreDisplay');
const comboDisplay = document.getElementById('comboDisplay');
const accuracyDisplay = document.getElementById('accuracyDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const playerNameInput = document.getElementById('playerNameInput');
const inputBox = document.getElementById('inputBox');
const menuDiv = document.getElementById('menu');
const gameContainerDiv = document.getElementById('gameContainer');
const startButton = document.getElementById('startButton');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const characterButtons = document.querySelectorAll('.character-btn');
const laserColorButtons = document.querySelectorAll('.laser-color-btn');
const languageButtons = document.querySelectorAll('.language-btn');
const currentLanguageSpan = document.getElementById('currentLanguage');
const currentDifficultySpan = document.getElementById('currentDifficulty');
const currentCharacterSpan = document.getElementById('currentCharacter');
const currentLaserColorNameSpan = document.getElementById('currentLaserColorName');
// Lấy phần tử logo
const backgroundLogo = document.querySelector('.background-logo');


// --- NEW: Pause Menu Elements ---
const pauseButton = document.getElementById('pauseButton');
const pauseMenuDiv = document.getElementById('pauseMenu');
const continueButton = document.getElementById('continueButton');
const returnToMenuButton = document.getElementById('returnToMenuButton');


// --- Game State & Variables ---
let gameState = 'menu'; // Possible states: 'menu', 'playing', 'gameOver', 'paused'
let score = 0;
let finalScore = 0;
let highScore = 0;
let playerName = "Player";
let playerLives = 3;
const maxLives = 3;
let comboCounter = 0;
let successfulHits = 0;
let enemiesReachedPlayer = 0;
let accuracy = 100;
let enemies = [];
let lasers = [];
let particles = [];
let selectedLaserColor = '#00FF00';
let selectedLaserColorName = 'Xanh lá';
let gamePausedBySystem = false; // For handling window blur/focus


// --- Responsive Scaling Variables ---
let scaleX = 1; // Tỉ lệ scale theo chiều ngang
let scaleY = 1; // Tỉ lệ scale theo chiều dọc
const originalWidth = 800; // Kích thước gốc để tính tỉ lệ
const originalHeight = 600;


// --- Bộ từ vựng cho các ngôn ngữ lập trình ---
const programmingWords = {
    c: ['int', 'float', 'char', 'void', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'sizeof', 'struct', 'typedef', 'enum', 'union', 'goto', 'const', 'volatile', 'extern', 'static', 'auto', 'register', 'printf', 'scanf', 'malloc', 'free'],
    csharp: ['class', 'public', 'private', 'protected', 'static', 'void', 'string', 'int', 'float', 'double', 'bool', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'new', 'this', 'base', 'using', 'namespace', 'Console', 'WriteLine', 'ReadLine', 'List', 'Dictionary', 'try', 'catch', 'finally', 'throw'],
    sql: ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'FROM', 'CREATE', 'TABLE', 'DATABASE', 'ALTER', 'DROP', 'INDEX', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX']
};
let selectedLanguage = 'c';
let words = programmingWords[selectedLanguage];

// --- Cài đặt độ khó ---
const difficulties = {
    easy: { speed: 0.5, rate: 2500, name: 'Dễ', targetFactor: 0.3 },
    normal: { speed: 1, rate: 2000, name: 'Bình thường', targetFactor: 0.5 },
    hard: { speed: 1.5, rate: 1500, name: 'Khó', targetFactor: 0.8 }
};
let selectedDifficulty = 'normal';
let currentEnemySpeed = difficulties[selectedDifficulty].speed;
let currentSpawnRate = difficulties[selectedDifficulty].rate;
let currentTargetFactor = difficulties[selectedDifficulty].targetFactor;

// --- Tải ảnh tàu người chơi ---
const playerImage = new Image(); let playerImageLoaded = false;
playerImage.onload = () => { playerImageLoaded = true; console.log("Ảnh tàu 1 tải xong."); };
playerImage.onerror = () => console.error("LỖI tải tau1.png");
playerImage.src = "assets/images/tau1.png";

const playerImage2 = new Image(); let playerImage2Loaded = false;
playerImage2.onload = () => { playerImage2Loaded = true; console.log("Ảnh tàu 2 tải xong."); };
playerImage2.onerror = () => console.error("LỖI tải tau2.png");
playerImage2.src = "assets/images/tau2.png";

const playerImage3 = new Image(); let playerImage3Loaded = false;
playerImage3.onload = () => { playerImage3Loaded = true; console.log("Ảnh tàu 3 tải xong."); };
playerImage3.onerror = () => console.error("LỖI tải tau3.png");
playerImage3.src = "assets/images/tau3.png";

// --- Tải ảnh thiên thạch ---
const meteoriteImage = new Image(); let meteoriteImageLoaded = false;
meteoriteImage.onload = () => { meteoriteImageLoaded = true; console.log("Ảnh thiên thạch tải xong."); };
meteoriteImage.onerror = () => console.error("LỖI tải thienthach.png");
meteoriteImage.src = "assets/images/thienthach.png";


// Nhạc nền theo độ khó
var musicTracks = {
    easy: "assets/sound/background-music/easy.mp3",
    normal: "assets/sound/background-music/normal.mp3",
    hard: "assets/sound/background-music/heroic-warrior-332055.mp3"
};

function playBackgroundMusic(difficulty) {
    var bgMusic = document.getElementById("background-music");
    if (!bgMusic) return;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    if (musicTracks[difficulty]) {
        bgMusic.src = musicTracks[difficulty];
        bgMusic.play().catch(error => console.error("Lỗi phát nhạc:", error));
        bgMusic.loop = true;
    }
}

// Định nghĩa Nhân vật
const characters = {
    default: { type: 'image', image: playerImage, name: 'Tàu Chiến Binh' },
    ship2: { type: 'image', image: playerImage2, name: 'Tàu Vinh Quang' },
    ship3: { type: 'image', image: playerImage3, name: 'Tàu 30/4' }
};
let selectedCharacter = 'default';

// Kích thước gốc của player (sẽ được scale khi vẽ)
const player = {
    x: originalWidth / 2 - 30, // Vị trí ban đầu dựa trên kích thước gốc
    y: originalHeight - 70,
    width: 60,  // Kích thước gốc
    height: 60 // Kích thước gốc
};

let spawnIntervalId = null;
let animationFrameId = null;

// --- Lớp Particle ---
class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        const baseSize = (options.baseSize || 5) * scaleY; // Scale size
        const sizeVariation = (options.sizeVariation || 2) * scaleY; // Scale size variation
        this.size = Math.random() * baseSize + sizeVariation;
        const speedMultiplier = options.speedMultiplier || 1;
        // Scale speed? Có thể không cần thiết nếu muốn hiệu ứng nổ nhanh như nhau
        this.speedX = (Math.random() * 3 - 1.5) * speedMultiplier;
        this.speedY = (Math.random() * 3 - 1.5) * speedMultiplier;
        const hueStart = options.hueStart || 20;
        const hueRange = options.hueRange || 40;
        this.color = `hsl(${Math.random() * hueRange + hueStart}, 100%, 50%)`;
        const baseLife = options.baseLife || 100;
        this.life = baseLife + Math.random() * (baseLife * 0.2);
        this.decay = options.decay || 2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.size > 0.1 * scaleY) this.size -= 0.05 * scaleY; // Scale decay size
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life / 100);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
// Hàm tạo hiệu ứng nổ
function createExplosion(x, y, type) {
    let options = {};
    let count = 15;
    if (type === 'collision') {
        count = 25 + Math.floor(Math.random() * 10);
        options = { hueStart: 0, hueRange: 60, baseSize: 6, sizeVariation: 3, speedMultiplier: 1.2, baseLife: 120, decay: 1.8 };
        flashScreen('rgba(255, 50, 0, 0.6)');
    } else if (type === 'completion') {
        count = 15 + Math.floor(Math.random() * 5);
        options = { hueStart: 40, hueRange: 40, baseSize: 4, sizeVariation: 2, speedMultiplier: 1, baseLife: 80, decay: 2.2 };
    }
    for (let i = 0; i < count; i++) {
        // Tọa độ x, y đã được truyền vào (cần đảm bảo nó đã được scale nếu cần)
        particles.push(new Particle(x, y, options));
    }
}
// Nhạc khi click
document.addEventListener("click", function () {
    var clickSound = document.getElementById("click");
    if (clickSound && clickSound.readyState >= 2) { // Check if ready
        clickSound.currentTime = 0;
        clickSound.play().catch(e => { }); // Ignore play errors if interrupted
    }
});

// --- Lớp Laser ---
class Laser {
    constructor(startX, startY, endX, endY, color) {
        // Tọa độ start/end cần được tính toán dựa trên canvas hiện tại khi tạo laser
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.life = 15;
        this.color = color || '#00FF00';
        this.lineWidth = 3 * scaleY; // Scale line width
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.globalAlpha = Math.max(0, this.life / 15);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5 * scaleY; // Scale shadow blur
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// --- Lớp Enemy ---
class Enemy {
    constructor() {
        this.word = words[Math.floor(Math.random() * words.length)];
        // Cần tính toán width/height gốc dựa trên font size gốc và image size gốc
        const tempFont = '16px Arial'; // Font gốc
        ctx.font = tempFont;
        const textWidth = ctx.measureText(this.word).width;
        const imageSize = 50; // Kích thước ảnh gốc
        this.originalWidth = Math.max(textWidth + 10, imageSize);
        this.originalHeight = imageSize + 25;

        // Vị trí spawn ban đầu (sẽ được ghi đè trong hàm spawnEnemy)
        this.x = Math.random() * (originalWidth - this.originalWidth);
        this.y = -this.originalHeight;

        this.speed = currentEnemySpeed * (0.8 + Math.random() * 0.4); // Tốc độ có thể cần scaleY?
        this.img = meteoriteImage;
        this.imgLoaded = meteoriteImageLoaded;
    }

    draw() {
        const imageDrawSize = 50 * scaleY; // Kích thước ảnh khi vẽ (scaled)
        const textYOffset = 20 * scaleY; // Khoảng cách chữ (scaled)
        const fontSize = 16 * scaleY; // Font size (scaled)
        const currentDrawWidth = this.originalWidth * scaleX; // Chiều rộng vẽ hiện tại
        const centerX = this.x + currentDrawWidth / 2; // Tâm X dựa trên vị trí hiện tại và width đã scale

        if (this.imgLoaded) {
            try {
                ctx.drawImage(this.img, centerX - imageDrawSize / 2, this.y, imageDrawSize, imageDrawSize);
            } catch (e) { /* fallback vẽ hình chữ nhật */
                ctx.fillStyle = 'darkorange';
                ctx.fillRect(centerX - imageDrawSize / 2, this.y, imageDrawSize, imageDrawSize);
            }
        } else { /* fallback vẽ hình chữ nhật */
            ctx.fillStyle = 'darkorange';
            ctx.fillRect(centerX - imageDrawSize / 2, this.y, imageDrawSize, imageDrawSize);
        }

        ctx.fillStyle = 'white';
        ctx.font = `${Math.max(10, Math.round(fontSize))}px Arial`; // Đặt font size đã scale
        ctx.textAlign = 'center';
        ctx.fillText(this.word, centerX, this.y + imageDrawSize + textYOffset);
        ctx.textAlign = 'left';
    }

    update() {
        // Có thể scale tốc độ: this.y += this.speed * scaleY;
        this.y += this.speed; // Giả sử không scale tốc độ di chuyển dọc

        if (gameState === 'playing') {
            const playerDrawWidth = player.width * scaleX;
            const playerCenterX = player.x + playerDrawWidth / 2;
            const enemyDrawWidth = this.originalWidth * scaleX;
            const enemyCenterX = this.x + enemyDrawWidth / 2;
            const dx = playerCenterX - enemyCenterX;
            // Tốc độ di chuyển ngang có thể scale hoặc không
            this.x += dx * 0.005 * currentTargetFactor * this.speed;
            // Giới hạn X trong canvas hiện tại
            this.x = Math.max(0, Math.min(canvas.width - enemyDrawWidth, this.x));
        }

        const isOutOfBounds = this.y > canvas.height; // Kiểm tra theo chiều cao canvas hiện tại
        if (isOutOfBounds && gameState === 'playing') {
            resetCombo();
            enemiesReachedPlayer++;
            updateInfoBar();
        }
        return isOutOfBounds;
    }
}

// --- Hàm vẽ Player ---
function drawPlayer() {
    const character = characters[selectedCharacter];
    if (character.type !== 'image' || !character.image) {
        drawFallbackShape('red'); return;
    }

    let imageIsLoaded = (character.image === playerImage && playerImageLoaded) ||
        (character.image === playerImage2 && playerImage2Loaded) ||
        (character.image === playerImage3 && playerImage3Loaded);

    // Kích thước và vị trí vẽ player đã được scale
    const drawWidth = player.width * scaleX;
    const drawHeight = player.height * scaleY;
    // Cập nhật lại vị trí X, Y trước khi vẽ để đảm bảo đúng vị trí scale
    player.x = canvas.width / 2 - drawWidth / 2;
    player.y = canvas.height - drawHeight - (10 * scaleY); // Khoảng cách đáy

    if (imageIsLoaded) {
        try {
            ctx.drawImage(character.image, player.x, player.y, drawWidth, drawHeight);
        } catch (e) { drawFallbackShape('grey'); }
    } else {
        drawFallbackShape('darkgrey');
    }
}
// Hàm vẽ hình thay thế
function drawFallbackShape(color) {
    ctx.fillStyle = color || 'grey';
    const drawWidth = player.width * scaleX;
    const drawHeight = player.height * scaleY;
    // Vị trí player.x, player.y cần được cập nhật trước đó
    ctx.fillRect(player.x, player.y, drawWidth, drawHeight);
}

// --- Vẽ mạng sống, Update Info Bar ---
function drawLives() {
    let hearts = "";
    for (let i = 0; i < maxLives; i++) {
        hearts += (i < playerLives) ? "❤️" : "🖤";
    }
    livesDisplay.innerHTML = `<span class="hearts">${hearts}</span>`;
}
function updateInfoBar() {
    scoreDisplay.textContent = `Điểm: ${score}`;
    comboDisplay.textContent = `Combo: ${comboCounter}`;
    const totalTracked = successfulHits + enemiesReachedPlayer;
    accuracy = (totalTracked > 0) ? Math.round((successfulHits / totalTracked) * 100) : 100;
    accuracyDisplay.textContent = `Chính xác: ${accuracy}%`;
    drawLives();
}

// --- Spawn Enemy ---
function spawnEnemy() {
    if (gameState !== 'playing') return; // Only spawn if actively playing

    let newEnemy = new Enemy();
    // Đặt vị trí X ngẫu nhiên dựa trên chiều rộng canvas hiện tại và chiều rộng đã scale của enemy
    const enemyDrawWidth = newEnemy.originalWidth * scaleX;
    newEnemy.x = Math.random() * (canvas.width - enemyDrawWidth);
    // Đặt vị trí Y ở trên cùng (chiều cao enemy đã scale)
    newEnemy.y = -(newEnemy.originalHeight * scaleY);
    enemies.push(newEnemy);
}

// --- Input Handling ---
inputBox.addEventListener('input', () => {
    if (gameState !== 'playing') return; // Only process input if actively playing
    const typedText = inputBox.value.trim().toLowerCase();
    if (!typedText) return;

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (typedText === enemies[i].word.toLowerCase()) {
            const enemy = enemies[i];
            const enemyDrawWidth = enemy.originalWidth * scaleX;
            const enemyDrawHeight = enemy.originalHeight * scaleY; // Tính chiều cao vẽ
            const enemyCenterX = enemy.x + enemyDrawWidth / 2;
            // Tính Y của tâm enemy dựa trên Y hiện tại và chiều cao vẽ
            const enemyCenterY = enemy.y + enemyDrawHeight / 2;

            const playerDrawWidth = player.width * scaleX;
            const playerGunX = player.x + playerDrawWidth / 2; // Vị trí súng X đã scale
            const playerGunY = player.y; // Vị trí súng Y đã scale

            shot();
            // Truyền tọa độ đã scale vào Laser và Explosion
            lasers.push(new Laser(playerGunX, playerGunY, enemyCenterX, enemyCenterY, selectedLaserColor));
            createExplosion(enemyCenterX, enemyCenterY, 'completion');
            brake();

            enemies.splice(i, 1);
            score += 10;
            successfulHits++;
            comboCounter++;

            if (comboCounter >= 10) {
                if (playerLives < maxLives) playerLives++;
                comboCounter = 0;
            }
            updateInfoBar();
            inputBox.value = '';
            return;
        }
    }
});
function shot() {
    var bgMusic = document.getElementById("shot");
    if (bgMusic) {
        bgMusic.currentTime = 0; // Đặt lại từ đầu mỗi khi gọi
        bgMusic.play();
        setTimeout(() => {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }, 250);
    }
}
function brake() {
    var bgMusic = document.getElementById("brake");
    if (bgMusic) {
        bgMusic.currentTime = 0; // Đặt lại từ đầu mỗi khi gọi
        bgMusic.play();
    }
}

// --- Reset Combo, Handle Effects ---
function resetCombo() {
    if (comboCounter > 0) {
        comboCounter = 0;
        updateInfoBar();
    }
}
function handleEffects() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update(); lasers[i].draw();
        if (lasers[i].life <= 0) lasers.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(); particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
}

// --- Game Loop Functions ---
function updateAndDrawEnemies() {
    // This function is called within gameLoop, which already checks gameState.
    // If more granular control is needed, uncomment the line below.
    // if (gameState !== 'playing') return;
    for (let i = enemies.length - 1; i >= 0; i--) {
        const isOutOfBounds = enemies[i].update(); // update đã xử lý out of bounds
        enemies[i].draw();
        if (isOutOfBounds) {
            enemies.splice(i, 1);
            // Reset combo/accuracy đã xử lý trong update()
        }
    }
}
function checkGameOver() {
    // This function is called within gameLoop, which already checks gameState.
    // If more granular control is needed, uncomment the line below.
    // if (gameState !== 'playing') return;

    const playerDrawWidth = player.width * scaleX;
    const playerDrawHeight = player.height * scaleY;
    const playerTop = player.y;
    const playerLeft = player.x;
    const playerRight = player.x + playerDrawWidth;

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyDrawWidth = enemy.originalWidth * scaleX;
        const enemyDrawHeight = enemy.originalHeight * scaleY;
        const enemyBottom = enemy.y + enemyDrawHeight;
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemyDrawWidth;

        // Kiểm tra va chạm dựa trên kích thước đã scale
        if (enemyBottom >= playerTop && // Enemy chạm hoặc qua đỉnh player
            enemy.y < player.y + playerDrawHeight && // Đỉnh enemy chưa qua đáy player
            enemyRight > playerLeft &&
            enemyLeft < playerRight) {
            const collisionX = enemy.x + enemyDrawWidth / 2;
            const collisionY = player.y + playerDrawHeight / 2;
            createExplosion(collisionX, collisionY, 'collision');
            brake(); // Play sound

            playerLives--;
            enemiesReachedPlayer++; // Tính vào accuracy
            resetCombo();
            updateInfoBar();
            enemies.splice(i, 1);

            if (playerLives <= 0) {
                var bgMusic = document.getElementById("background-music"); // Lấy đúng ID nhạc nền game
                if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
                var overSound = document.getElementById("over"); // Lấy đúng ID nhạc game over
                if (overSound) { overSound.play(); }
                handleGameOver();
                return; // Thoát ngay khi game over
            }
            // return; // Có thể thoát sau khi xử lý 1 va chạm/frame để tránh lỗi
        }
    }
}

function flashScreen(bgColor) {
    const flashDiv = document.createElement('div');
    flashDiv.style.position = 'absolute';
    flashDiv.style.top = '0';
    flashDiv.style.left = '0';
    flashDiv.style.width = '100%';
    flashDiv.style.height = '100%';
    flashDiv.style.backgroundColor = bgColor;
    flashDiv.style.opacity = '0.6'; // Độ mờ ban đầu
    flashDiv.style.zIndex = '100'; // Đảm bảo nó nằm trên cùng
    flashDiv.style.pointerEvents = 'none'; // Không chặn click
    document.body.appendChild(flashDiv);

    // Tạo hiệu ứng mờ dần
    setTimeout(() => {
        flashDiv.style.transition = 'opacity 0.3s ease-out';
        flashDiv.style.opacity = '0';
        // Xóa div sau khi hiệu ứng kết thúc
        setTimeout(() => { if (document.body.contains(flashDiv)) document.body.removeChild(flashDiv); }, 300); // Thời gian trùng với transition
    }, 50); // Độ trễ nhỏ trước khi bắt đầu mờ dần
}

function handleGameOver() {
    if (gameState !== 'playing' && gameState !== 'paused') return; // Allow game over from paused state (e.g. if last life lost then paused)
    gameState = 'gameOver';
    finalScore = score;
    if (finalScore > highScore) {
        highScore = finalScore;
        saveHighScore();
    }
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = null;
    // animationFrameId will be managed by gameLoop based on 'gameOver' state

    canvas.classList.add('clickable'); // Cho phép click/touch trên canvas
    inputBox.disabled = true;
    inputBox.value = '';
    resizeGameOverButtons(); // Tính toán lại vị trí nút lần cuối
    console.log("Game Over!");
}

// --- Định nghĩa nút Game Over (Kích thước gốc) ---
const gameOverButtonRetry = { x: 0, y: 0, width: 120, height: 50, text: "Chơi lại" };
const gameOverButtonMenu = { x: 0, y: 0, width: 120, height: 50, text: "Menu" };


// --- Hàm vẽ màn hình Game Over (Sử dụng scale) ---
function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Tính toán font size và vị trí Y dựa trên scaleY và canvas.height
    const fontScaleBase = Math.min(scaleX, scaleY); // Dùng tỉ lệ nhỏ hơn để tránh chữ quá to
    const largeFontSize = Math.max(18, Math.round(60 * fontScaleBase));
    const mediumFontSize = Math.max(14, Math.round(30 * fontScaleBase));
    const smallFontSize = Math.max(12, Math.round(24 * fontScaleBase));
    const smallerFontSize = Math.max(10, Math.round(20 * fontScaleBase));


    const line1Y = canvas.height / 2 - (120 * scaleY);
    const line2Y = canvas.height / 2 - (50 * scaleY);
    const line3Y = canvas.height / 2 + (0 * scaleY);
    const line4Y = canvas.height / 2 + (35 * scaleY); // Tăng khoảng cách
    const line5Y = canvas.height / 2 + (70 * scaleY); // Tăng khoảng cách

    ctx.font = `${smallFontSize}px Arial`;
    ctx.fillText(`Người chơi: ${playerName}`, canvas.width / 2, line1Y);

    ctx.fillStyle = 'red';
    ctx.font = `bold ${largeFontSize}px Arial`;
    ctx.fillText("KẾT THÚC!", canvas.width / 2, line2Y);

    ctx.fillStyle = 'white';
    ctx.font = `${mediumFontSize}px Arial`;
    ctx.fillText(`Điểm: ${finalScore}`, canvas.width / 2, line3Y);

    ctx.font = `${smallerFontSize}px Arial`;
    ctx.fillText(`Điểm cao nhất: ${highScore}`, canvas.width / 2, line4Y);
    ctx.fillText(`Độ chính xác: ${accuracy}%`, canvas.width / 2, line5Y);


    // Vẽ nút (vị trí và kích thước lấy từ biến đã được resize trong resizeGameOverButtons)
    const buttonFontSize = Math.max(12, Math.round(20 * fontScaleBase));
    ctx.font = `${buttonFontSize}px Arial`;

    // Nút Chơi lại
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(gameOverButtonRetry.x, gameOverButtonRetry.y, gameOverButtonRetry.width, gameOverButtonRetry.height);
    ctx.fillStyle = 'white';
    ctx.fillText(gameOverButtonRetry.text, gameOverButtonRetry.x + gameOverButtonRetry.width / 2, gameOverButtonRetry.y + gameOverButtonRetry.height / 2 + (buttonFontSize * 0.35)); // Căn giữa chữ

    // Nút Menu
    ctx.fillStyle = '#007bff';
    ctx.fillRect(gameOverButtonMenu.x, gameOverButtonMenu.y, gameOverButtonMenu.width, gameOverButtonMenu.height);
    ctx.fillStyle = 'white';
    ctx.fillText(gameOverButtonMenu.text, gameOverButtonMenu.x + gameOverButtonMenu.width / 2, gameOverButtonMenu.y + gameOverButtonMenu.height / 2 + (buttonFontSize * 0.35)); // Căn giữa chữ

    ctx.textAlign = 'left';
}

// --- Hàm vòng lặp game chính ---
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'menu') {
        // Menu is handled by HTML/CSS.
        // If the loop is running in menu state, cancel it.
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        return; // Explicitly stop further execution in menu state
    } else if (gameState === 'playing') {
        drawPlayer();
        updateAndDrawEnemies();
        handleEffects();
        checkGameOver();
    } else if (gameState === 'paused') {
        // Draw the current state of the game but don't update logic
        drawPlayer();
        for (let i = enemies.length - 1; i >= 0; i--) { enemies[i].draw(); }
        handleEffects(); // Draw existing lasers/particles
        // Pause menu is an HTML overlay
    } else if (gameState === 'gameOver') {
        drawPlayer();
        for (let i = enemies.length - 1; i >= 0; i--) { enemies[i].draw(); }
        handleEffects();
        drawGameOverScreen();
    }

    // Continue animation if not in menu
    if (gameState !== 'menu') {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}


// --- Local Storage Functions ---
function saveHighScore() { try { localStorage.setItem('typingAttackHighScore', highScore.toString()); } catch (e) { console.error("Lỗi lưu điểm cao:", e); } }
function loadHighScore() { try { const s = localStorage.getItem('typingAttackHighScore'); if (s !== null) highScore = parseInt(s, 10) || 0; } catch (e) { highScore = 0; } highScoreDisplay.textContent = highScore; }
function savePlayerName() { try { localStorage.setItem('typingAttackPlayerName', playerName); } catch (e) { } }
function loadPlayerName() { try { const s = localStorage.getItem('typingAttackPlayerName'); if (s) playerName = s; } catch (e) { playerName = "Player"; } playerNameInput.value = playerName; }
function saveLaserColor() { try { localStorage.setItem('typingAttackLaserColor', selectedLaserColor); localStorage.setItem('typingAttackLaserColorName', selectedLaserColorName); } catch (e) { } }
function loadLaserColor() {
    try {
        const storedColor = localStorage.getItem('typingAttackLaserColor');
        const storedName = localStorage.getItem('typingAttackLaserColorName');
        if (storedColor && storedName) {
            selectedLaserColor = storedColor;
            selectedLaserColorName = storedName;
        } else {
            selectedLaserColor = '#00FF00'; selectedLaserColorName = 'Xanh lá';
        }
    } catch (e) {
        selectedLaserColor = '#00FF00'; selectedLaserColorName = 'Xanh lá';
    }
    currentLaserColorNameSpan.textContent = selectedLaserColorName;
    laserColorButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === selectedLaserColor);
    });
}
function saveLanguage() { try { localStorage.setItem('typingAttackLanguage', selectedLanguage); } catch (e) { } }
function loadLanguage() { try { const s = localStorage.getItem('typingAttackLanguage'); if (s && programmingWords[s]) selectedLanguage = s; else selectedLanguage = 'c'; } catch (e) { selectedLanguage = 'c'; } words = programmingWords[selectedLanguage]; currentLanguageSpan.textContent = selectedLanguage.toUpperCase(); selectOption(languageButtons, selectedLanguage, null); }

// --- Menu Functions ---
playerNameInput.addEventListener('change', () => { playerName = playerNameInput.value.trim() || "Player"; savePlayerName(); });

function showMenu() {
    gameState = 'menu';
    menuDiv.style.display = 'block';
    gameContainerDiv.style.display = 'none';
    pauseMenuDiv.classList.add('hidden');
    canvas.classList.remove('clickable');
    inputBox.disabled = true;

    // Hiển thị logo khi về menu
    if (backgroundLogo) {
        backgroundLogo.style.display = 'block';
    }

    var bgMusic = document.getElementById("background-music");
    if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }

    if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    if (spawnIntervalId) { clearInterval(spawnIntervalId); spawnIntervalId = null; }

    loadHighScore();
    loadPlayerName();
    loadLaserColor();
    loadLanguage(); // This will call selectOption internally

    // Update display texts for options
    currentDifficultySpan.textContent = difficulties[selectedDifficulty].name;
    selectOption(difficultyButtons, selectedDifficulty, null); // Ensure correct button is visually selected

    currentCharacterSpan.textContent = characters[selectedCharacter]?.name || 'Không xác định';
    selectOption(characterButtons, selectedCharacter, null); // Ensure correct button is visually selected


    // Close all option containers when showing menu
    document.querySelectorAll('.options-container').forEach(container => {
        if (!container.classList.contains('hidden')) {
            container.style.maxHeight = "0px";
            container.style.opacity = "0";
            container.classList.add('hidden'); // Add hidden after ensuring it's visually collapsed
        }
    });


    enemies = []; lasers = []; particles = [];
    console.log("Switched to Menu state");
}

function hideMenu() {
    menuDiv.style.display = 'none';
    gameContainerDiv.style.display = 'block';

    // Ẩn logo khi chuyển sang màn hình game
    if (backgroundLogo) {
        backgroundLogo.style.display = 'none';
    }
}

function toggleOptions(elementId) {
    const optionsDiv = document.getElementById(elementId);
    if (optionsDiv) {
        const isCurrentlyHiddenOrCollapsing = optionsDiv.classList.contains('hidden') || optionsDiv.style.maxHeight === "0px";

        if (isCurrentlyHiddenOrCollapsing) { // Needs to be shown
            optionsDiv.classList.remove('hidden'); // Allow it to take space
            // Force repaint/reflow before applying styles for transition
            void optionsDiv.offsetWidth;
            optionsDiv.style.maxHeight = optionsDiv.scrollHeight + "px";
            optionsDiv.style.opacity = "1";
        } else { // Needs to be hidden
            optionsDiv.style.maxHeight = "0px";
            optionsDiv.style.opacity = "0";
            // Add .hidden class after transition for semantics and accessibility
            optionsDiv.addEventListener('transitionend', function handler(event) {
                // Ensure the event is for maxHeight or opacity to avoid premature hiding on other transitions
                if (event.propertyName === 'max-height' || event.propertyName === 'opacity') {
                    if (optionsDiv.style.maxHeight === '0px') { // Check if it was meant to be hidden
                        optionsDiv.classList.add('hidden');
                    }
                    optionsDiv.removeEventListener('transitionend', handler);
                }
            }, { once: true }); // Use {once: true} for cleaner event removal
        }
    }
}


function selectOption(buttonGroup, selectedValue, updateFunction, optionsContainerIdToCollapse = null) {
    buttonGroup.forEach(btn => {
        const dataKey = Object.keys(btn.dataset)[0];
        btn.classList.toggle('selected', btn.dataset[dataKey] === selectedValue);
    });
    if (updateFunction) {
        const selectedBtn = Array.from(buttonGroup).find(btn => btn.classList.contains('selected'));
        if (selectedBtn) {
            updateFunction(selectedBtn.dataset[Object.keys(selectedBtn.dataset)[0]]);
        }
    }
    if (optionsContainerIdToCollapse) {
        const container = document.getElementById(optionsContainerIdToCollapse);
        if (container && !container.classList.contains('hidden') && container.style.maxHeight !== '0px') {
            toggleOptions(optionsContainerIdToCollapse);
        }
    }
}

// --- Event Listeners for Menu Options (modified for auto-collapse) ---
startButton.addEventListener('click', startGame);

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDifficulty = button.dataset.difficulty;
        selectOption(difficultyButtons, selectedDifficulty, (val) => {
            currentDifficultySpan.textContent = difficulties[val].name;
        }, 'difficultyOptions');
    });
});

characterButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedCharacter = button.dataset.character;
        selectOption(characterButtons, selectedCharacter, (val) => {
            currentCharacterSpan.textContent = characters[val]?.name || 'Không xác định';
        }, 'characterOptions');
    });
});

laserColorButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedLaserColor = button.dataset.color;
        selectedLaserColorName = button.dataset.name;
        saveLaserColor();
        currentLaserColorNameSpan.textContent = selectedLaserColorName;
        selectOption(laserColorButtons, selectedLaserColor, null, 'laserColorOptions');
    });
});

languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedLanguage = button.dataset.language;
        words = programmingWords[selectedLanguage];
        saveLanguage(); // Saves the language
        // Update the display text and then collapse.
        selectOption(languageButtons, selectedLanguage, (val) => {
            currentLanguageSpan.textContent = val.toUpperCase();
        }, 'languageOptions');
    });
});


// --- Responsive: Hàm resizeCanvas và resizeGameOverButtons ---
function resizeCanvas() {
    const containerWidth = gameContainerDiv.clientWidth;
    const newWidth = Math.max(300, containerWidth);
    const newHeight = newWidth * (originalHeight / originalWidth);

    canvas.width = newWidth;
    canvas.height = newHeight;

    scaleX = newWidth / originalWidth;
    scaleY = newHeight / originalHeight;

    if (gameState === 'gameOver') {
        resizeGameOverButtons();
    }
}

function resizeGameOverButtons() {
    const fontScaleBase = Math.min(scaleX, scaleY);
    const buttonWidth = Math.max(80, 120 * scaleX);
    const buttonHeight = Math.max(35, 50 * scaleY);
    const buttonY = canvas.height / 2 + Math.max(60, 100 * scaleY);
    const retryButtonX = canvas.width / 2 - Math.max(50, 150 * scaleX) - buttonWidth / 2 + Math.max(30, 75 * scaleX);
    const menuButtonX = canvas.width / 2 + Math.max(50, 30 * scaleX);

    gameOverButtonRetry.x = retryButtonX;
    gameOverButtonRetry.y = buttonY;
    gameOverButtonRetry.width = buttonWidth;
    gameOverButtonRetry.height = buttonHeight;

    gameOverButtonMenu.x = menuButtonX;
    gameOverButtonMenu.y = buttonY;
    gameOverButtonMenu.width = buttonWidth;
    gameOverButtonMenu.height = buttonHeight;
}

// --- Pause Game Functionality ---
function showPauseMenu() {
    if (gameState !== 'playing') return;

    gameState = 'paused';
    pauseMenuDiv.classList.remove('hidden');
    inputBox.disabled = true;

    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = null;
    // animationFrameId is handled by gameLoop checking gameState

    // Optional: Pause music
    // var bgMusic = document.getElementById("background-music");
    // if (bgMusic && !bgMusic.paused) { bgMusic.pause(); }
    console.log("Game Paused");
}

function hidePauseMenu() {
    pauseMenuDiv.classList.add('hidden');
    if (gameState === 'playing' || (gameState === 'paused' && !gamePausedBySystem)) { // Only re-enable if it should be active
        inputBox.disabled = false;
    }
}

function resumeGame() {
    if (gameState !== 'paused') return;

    gameState = 'playing';
    hidePauseMenu();
    gamePausedBySystem = false; // Reset system pause flag

    if (!spawnIntervalId) {
        spawnIntervalId = setInterval(spawnEnemy, currentSpawnRate);
    }
    if (!animationFrameId) { // Restart game loop if it was stopped
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    setTimeout(() => { if (inputBox) inputBox.focus(); }, 100);

    // Optional: Resume music
    // var bgMusic = document.getElementById("background-music");
    // if (bgMusic && bgMusic.paused) { bgMusic.play().catch(e => {}); }
    console.log("Game Resumed");
}

// --- Event Listeners for Pause Functionality ---
if (pauseButton) {
    pauseButton.addEventListener('click', () => {
        if (gameState === 'playing') {
            showPauseMenu();
        } else if (gameState === 'paused') {
            resumeGame();
        }
    });
}
if (continueButton) continueButton.addEventListener('click', resumeGame);
if (returnToMenuButton) {
    returnToMenuButton.addEventListener('click', () => {
        hidePauseMenu();
        showMenu();
    });
}


// --- Game Initialization ---
function startGame() {
    hideMenu();
    pauseMenuDiv.classList.add('hidden');
    resizeCanvas();

    canvas.classList.remove('clickable');
    inputBox.disabled = false;

    if (spawnIntervalId) { clearInterval(spawnIntervalId); spawnIntervalId = null; }
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }

    score = 0; playerLives = maxLives; comboCounter = 0; successfulHits = 0;
    enemiesReachedPlayer = 0; accuracy = 100;
    enemies = []; lasers = []; particles = [];

    updateInfoBar();

    currentEnemySpeed = difficulties[selectedDifficulty].speed;
    currentSpawnRate = difficulties[selectedDifficulty].rate;
    currentTargetFactor = difficulties[selectedDifficulty].targetFactor;

    gameState = 'playing';

    spawnIntervalId = setInterval(spawnEnemy, currentSpawnRate);
    setTimeout(() => { if (inputBox) inputBox.focus(); }, 100);
    playBackgroundMusic(selectedDifficulty);

    if (!animationFrameId) {
        console.log("Starting gameLoop from startGame");
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    console.log("Game Started with difficulty:", selectedDifficulty);
}

// --- Input Focus Handling & Window Blur/Focus ---
inputBox.addEventListener('blur', () => {
    if (gameState === 'playing' && !gamePausedBySystem && !document.activeElement === inputBox) {
        // Consider if auto-focus is desired, especially on mobile
        // setTimeout(() => { if (gameState === 'playing') inputBox.focus(); }, 100);
    }
});

window.addEventListener('blur', () => {
    if (gameState === 'playing') {
        gamePausedBySystem = true;
        showPauseMenu();
        console.log("Game auto-paused due to window blur");
    }
});

window.addEventListener('focus', () => {
    if (gameState === 'paused' && gamePausedBySystem) {
        // User must click "Continue" to resume.
        // If auto-resume is desired:
        // resumeGame();
        // But ensure inputBox is focused after resume if auto-resuming.
        console.log("Game window focused, user can resume from pause menu.");
    }
});


// --- Canvas Click/Touch Listeners for Game Over ---
canvas.addEventListener('click', handleCanvasInteraction);
canvas.addEventListener('touchstart', handleCanvasInteraction, { passive: false });

function handleCanvasInteraction(event) {
    if (gameState !== 'gameOver') return; // Only for game over screen

    let clientX, clientY;
    if (event.type === 'touchstart') {
        event.preventDefault();
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const interactX = clientX - rect.left;
    const interactY = clientY - rect.top;

    if (interactX >= gameOverButtonRetry.x && interactX <= gameOverButtonRetry.x + gameOverButtonRetry.width &&
        interactY >= gameOverButtonRetry.y && interactY <= gameOverButtonRetry.y + gameOverButtonRetry.height) {
        startGame();
    }
    else if (interactX >= gameOverButtonMenu.x && interactX <= gameOverButtonMenu.x + gameOverButtonMenu.width &&
        interactY >= gameOverButtonMenu.y && interactY <= gameOverButtonMenu.y + gameOverButtonMenu.height) {
        showMenu();
    }
}


// --- Responsive: Debounced Resize Listener ---
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (gameState !== 'menu') {
            resizeCanvas();
        }
    }, 150);
});


// --- Initial Setup ---
loadLanguage();
showMenu(); // Gọi showMenu lần đầu để hiển thị menu và logo
// gameLoop() is initiated by startGame()