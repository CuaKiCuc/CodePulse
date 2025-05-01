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

// --- Element cho ngôn ngữ (MỚI) ---
const languageButtons = document.querySelectorAll('.language-btn');
const currentLanguageSpan = document.getElementById('currentLanguage');

const currentDifficultySpan = document.getElementById('currentDifficulty');
const currentCharacterSpan = document.getElementById('currentCharacter');
const currentLaserColorNameSpan = document.getElementById('currentLaserColorName');

// --- Game State & Variables ---
// ... các biến game state khác ...
let gameState = 'menu';
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

// --- Bộ từ vựng cho các ngôn ngữ lập trình (MỚI) ---
const programmingWords = {
    c: ['int', 'float', 'char', 'void', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'sizeof', 'struct', 'typedef', 'enum', 'union', 'goto', 'const', 'volatile', 'extern', 'static', 'auto', 'register', 'printf', 'scanf', 'malloc', 'free'],
    csharp: ['class', 'public', 'private', 'protected', 'static', 'void', 'string', 'int', 'float', 'double', 'bool', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'new', 'this', 'base', 'using', 'namespace', 'Console', 'WriteLine', 'ReadLine', 'List', 'Dictionary', 'try', 'catch', 'finally', 'throw'],
    sql: ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'FROM', 'CREATE', 'TABLE', 'DATABASE', 'ALTER', 'DROP', 'INDEX', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX']
};
let selectedLanguage = 'c'; // Ngôn ngữ mặc định
let words = programmingWords[selectedLanguage]; // Danh sách từ hiện tại

// --- Cài đặt độ khó (ĐÃ CẬP NHẬT Tốc độ) ---
const difficulties = {
    easy: {
        speed: 0.5, // Giảm tốc độ
        rate: 2500,
        name: 'Dễ',
        targetFactor: 0.3
    },
    normal: {
        speed: 0.7, // Giảm tốc độ
        rate: 2000,
        name: 'Bình thường',
        targetFactor: 0.5
    },
    hard: {
        speed: 1, // Giảm tốc độ
        rate: 1500,
        name: 'Khó',
        targetFactor: 0.8
    }
};
let selectedDifficulty = 'normal';
let currentEnemySpeed = difficulties[selectedDifficulty].speed;
let currentSpawnRate = difficulties[selectedDifficulty].rate;
let currentTargetFactor = difficulties[selectedDifficulty].targetFactor;


// --- Tải ảnh tàu người chơi ---
const playerImage = new Image();
let playerImageLoaded = false;
playerImage.onload = () => {
    playerImageLoaded = true;
    console.log("Ảnh tàu 1 (tau1.png) đã tải.");
};
playerImage.onerror = () => {
    console.error("LỖI: Không thể tải ảnh 'tau1.png'.");
};
playerImage.src = "assets/images/tau1.png";


const playerImage2 = new Image();
let playerImage2Loaded = false;
playerImage2.onload = () => {
    playerImage2Loaded = true;
    console.log("Ảnh tàu 2 (tau2.png) đã tải.");
};
playerImage2.onerror = () => {
    console.error("LỖI: Không thể tải ảnh 'tau2.png'.");
};
playerImage2.src = "assets/images/tau2.png";

const playerImage3 = new Image();
let playerImage3Loaded = false;
playerImage3.onload = () => {
    playerImage3Loaded = true;
    console.log("Ảnh tàu 3 (tau3.png) đã tải.");
};
playerImage3.onerror = () => {
    console.error("LỖI: Không thể tải ảnh 'tau3.png'.");
};
playerImage3.src = "assets/images/tau3.png";

// Nhạc nền theo độ khó (ĐÃ CÓ)
var musicTracks = {
    easy: "assets/sound/background-music/easy.mp3",
    normal: "assets/sound/background-music/normal.mp3",
    hard: "assets/sound/background-music/heroic-warrior-332055.mp3"
};

// Hàm phát nhạc theo độ khó đã chọn (ĐÃ CÓ)
function playBackgroundMusic(difficulty) {
    var bgMusic = document.getElementById("background-music");

    if (!bgMusic) {
        console.error("Không tìm thấy phần tử audio!");
        return;
    }

    bgMusic.pause(); // Dừng nhạc hiện tại
    bgMusic.currentTime = 0; // Đặt lại từ đầu

    if (musicTracks[difficulty]) {
        bgMusic.src = musicTracks[difficulty]; // Cập nhật bài nhạc
        bgMusic.play().catch(error => console.error("Lỗi phát nhạc:", error)); // Xử lý lỗi nếu có
        bgMusic.loop = true; // Lặp lại vô hạn
    } else {
        console.error("Không tìm thấy nhạc nền cho độ khó:", difficulty);
    }
}

// Khi người chơi chọn độ khó mới (ĐÃ CÓ)
function changeDifficulty(newDifficulty) {
    selectedDifficulty = newDifficulty; // Cập nhật độ khó
    playBackgroundMusic(selectedDifficulty); // Phát nhạc nền tương ứng
}
// --- Tải ảnh thiên thạch --- // MỚI
const meteoriteImage = new Image();
let meteoriteImageLoaded = false;
meteoriteImage.onload = () => {
    meteoriteImageLoaded = true;
    console.log("Ảnh thiên thạch (thienthach.png) đã tải.");
};
meteoriteImage.onerror = () => {
    console.error("LỖI: Không thể tải ảnh 'thienthach.png'.");
};
// Đảm bảo ảnh này nằm trong thư mục assets hoặc điều chỉnh đường dẫn
meteoriteImage.src = "assets/images/thienthach.png";


// --- Định nghĩa Nhân vật (chỉ 3 tàu ảnh) ---
const characters = {
    default: {
        type: 'image',
        image: playerImage,
        name: 'Tàu Chiến Binh'
    }, // tau1.png
    ship2: {
        type: 'image',
        image: playerImage2,
        name: 'Tàu Vinh Quang'
    }, // tau2.png
    ship3: {
        type: 'image',
        image: playerImage3,
        name: 'Tàu 30/4'
    } // tau3.png
};
let selectedCharacter = 'default'; // Mặc định là tàu ảnh đầu tiên
// Kích thước tàu (giữ nguyên hoặc điều chỉnh nếu cần)
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 70,
    width: 60,
    height: 60
};

let spawnIntervalId = null;
let animationFrameId = null;

// --- Lớp Particle (Giữ nguyên) ---
class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        const baseSize = options.baseSize || 5;
        const sizeVariation = options.sizeVariation || 2;
        this.size = Math.random() * baseSize + sizeVariation;
        const speedMultiplier = options.speedMultiplier || 1;
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
        if (this.size > 0.1) this.size -= 0.05;
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
// --- Hàm tạo hiệu ứng nổ (Giữ nguyên) ---
function createExplosion(x, y, type) {
    let options = {};
    let count = 15;
    if (type === 'collision') {
        count = 25 + Math.floor(Math.random() * 10);
        options = {
            hueStart: 0,
            hueRange: 60,
            baseSize: 6,
            sizeVariation: 3,
            speedMultiplier: 1.2,
            baseLife: 120,
            decay: 1.8
        };
        flashScreen('rgba(255, 50, 0, 0.6)');
    } else if (type === 'completion') {
        count = 15 + Math.floor(Math.random() * 5);
        options = {
            hueStart: 40,
            hueRange: 40,
            baseSize: 4,
            sizeVariation: 2,
            speedMultiplier: 1,
            baseLife: 80,
            decay: 2.2
        };
    }
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, options));
    }
}
//nhac khi click
document.addEventListener("click", function () {
    var over = document.getElementById("click");
    if (over) {
        over.play();
    }
});

// --- Lớp Laser (Giữ nguyên) ---
class Laser {
    constructor(startX, startY, endX, endY, color) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.life = 15;
        this.color = color || '#00FF00';
        this.lineWidth = 3;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.globalAlpha = Math.max(0, this.life / 15);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// --- Lớp Enemy (ĐÃ CẬP NHẬT để dùng ảnh thiên thạch và từ vựng) ---
class Enemy {
    constructor() {
        // Sử dụng danh sách từ vựng của ngôn ngữ đã chọn
        this.word = words[Math.floor(Math.random() * words.length)];
        ctx.font = '16px Arial';
        // Kích thước của enemy sẽ dựa vào kích thước ảnh và chữ
        const textWidth = ctx.measureText(this.word).width;
        const imageSize = 50; // Kích thước ảnh thiên thạch, có thể điều chỉnh
        this.width = Math.max(textWidth + 10, imageSize); // Lấy kích thước lớn hơn giữa chữ và ảnh
        this.height = imageSize + 25; // Chiều cao bao gồm ảnh và khoảng trống cho chữ

        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height; // Bắt đầu từ trên màn hình

        this.speed = currentEnemySpeed * (0.8 + Math.random() * 0.4);
        this.targetX = this.x;

        // Sử dụng ảnh thiên thạch mới
        this.img = meteoriteImage;
        this.imgLoaded = meteoriteImageLoaded; // Kiểm tra trạng thái tải ảnh thiên thạch
    }

    draw() {
        const imageSize = 50; // Kích thước ảnh thiên thạch khi vẽ
        const textYOffset = 20; // Khoảng cách từ dưới ảnh đến chữ
        const centerX = this.x + this.width / 2;

        // Vẽ ảnh thiên thạch
        if (this.imgLoaded) {
            try {
                // Vẽ ảnh centered theo chiều ngang của enemy
                ctx.drawImage(this.img, centerX - imageSize / 2, this.y, imageSize, imageSize);
            } catch (e) {
                console.error("Lỗi vẽ ảnh thiên thạch:", e);
                // Vẽ hình thay thế nếu lỗi
                ctx.fillStyle = 'orange';
                ctx.fillRect(centerX - imageSize / 2, this.y, imageSize, imageSize);
            }
        } else {
            // Vẽ hình thay thế nếu ảnh chưa tải
            ctx.fillStyle = 'darkorange';
            ctx.fillRect(centerX - imageSize / 2, this.y, imageSize, imageSize);
        }

        // Vẽ chữ (từ) bên dưới ảnh thiên thạch
        ctx.fillStyle = 'white'; // Màu chữ
        ctx.font = '16px Arial'; // Font chữ
        ctx.textAlign = 'center'; // Căn giữa chữ
        ctx.fillText(this.word, centerX, this.y + imageSize + textYOffset);

        ctx.textAlign = 'left'; // Trả về căn lề mặc định
    }

    update() {
        this.y += this.speed;
        // Giữ nguyên phần di chuyển theo tàu người chơi nếu gameState là 'playing'
        if (gameState === 'playing') {
            const playerCenterX = player.x + player.width / 2;
            const enemyCenterX = this.x + this.width / 2;
            const dx = playerCenterX - enemyCenterX;
            // Điều chỉnh hệ số 0.005 nếu cần cho cảm giác di chuyển
            this.x += dx * 0.005 * currentTargetFactor * this.speed;
            // Giới hạn vị trí X trong canvas
            this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        }

        // Kiểm tra xem enemy đã ra khỏi màn hình chưa
        const isOutOfBounds = this.y > canvas.height + this.height;
        if (isOutOfBounds && gameState === 'playing') {
            // Nếu ra khỏi màn hình khi đang chơi, reset combo
            resetCombo();
            // Thêm đếm số enemy đã trượt
            enemiesReachedPlayer++;
            updateInfoBar(); // Cập nhật accuracy
        }
        return isOutOfBounds;
    }
}


// --- Player Drawing (Cập nhật kiểm tra ảnh + bỏ vẽ hình dạng) ---
function drawPlayer() {
    const character = characters[selectedCharacter];

    // Chỉ xử lý nếu type là 'image'
    if (character.type === 'image' && character.image) {
        let imageIsLoaded = false;
        // Kiểm tra đúng ảnh đã được tải chưa
        if (character.image === playerImage && playerImageLoaded) {
            imageIsLoaded = true;
        } else if (character.image === playerImage2 && playerImage2Loaded) {
            imageIsLoaded = true;
        } else if (character.image === playerImage3 && playerImage3Loaded) { // Thêm kiểm tra ảnh 3
            imageIsLoaded = true;
        }

        if (imageIsLoaded) {
            try {
                ctx.drawImage(character.image, player.x, player.y, player.width, player.height);
            } catch (e) {
                console.error("Lỗi vẽ ảnh tàu:", e);
                drawFallbackShape('grey'); // Vẽ hình thay thế nếu lỗi
            }
        } else {
            drawFallbackShape('darkgrey'); // Ảnh chưa tải, vẽ hình thay thế
        }
    } else {
        // Trường hợp không xác định hoặc lỗi cấu hình characters
        drawFallbackShape('red'); // Vẽ màu đỏ để báo lỗi cấu hình
        console.error(`Nhân vật '${selectedCharacter}' không phải loại 'image' hoặc thiếu thông tin ảnh.`);
    }
}
// Hàm vẽ hình thay thế (Giữ nguyên)
function drawFallbackShape(color) {
    ctx.fillStyle = color || 'grey';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// --- Vẽ mạng sống, Update Info Bar, Spawn Enemy (Giữ nguyên) ---
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
function spawnEnemy() {
    if (gameState === 'playing') {
        // Enemy constructor sẽ sử dụng danh sách `words` hiện tại
        enemies.push(new Enemy());
    }
}
// --- Input Handling (Giữ nguyên) ---
inputBox.addEventListener('input', () => {
    if (gameState !== 'playing')
        return;
    const typedText = inputBox.value.trim().toLowerCase();
    if (!typedText) return;
    for (let i = enemies.length - 1; i >= 0; i--) {
        // Kiểm tra xem từ gõ vào có khớp với từ của bất kỳ enemy nào không
        if (typedText === enemies[i].word.toLowerCase()) { // So sánh không phân biệt hoa thường
            const enemy = enemies[i];
            // Tính toán vị trí trung tâm của enemy để bắn laser và tạo hiệu ứng
            const enemyCenterX = enemy.x + enemy.width / 2;
            const enemyCenterY = enemy.y + enemy.height / 2; // Sử dụng chiều cao enemy mới

            const playerGunX = player.x + player.width / 2;
            const playerGunY = player.y; // Bắn từ vị trí của tàu người chơi
            shot();
            lasers.push(new Laser(playerGunX, playerGunY, enemyCenterX, enemyCenterY, selectedLaserColor));
            createExplosion(enemyCenterX, enemyCenterY, 'completion'); // Tạo hiệu ứng nổ khi tiêu diệt
            brake();
            enemies.splice(i, 1); // Xóa enemy

            score += 10; // Tăng điểm
            successfulHits++; // Tăng số lần bắn trúng
            comboCounter++; // Tăng combo

            // Nếu đạt combo 10, tăng mạng và reset combo
            if (comboCounter >= 10) {
                if (playerLives < maxLives) {
                    playerLives++;
                }
                comboCounter = 0; // Reset combo sau khi nhận mạng
            }

            updateInfoBar(); // Cập nhật hiển thị thông tin
            inputBox.value = ''; // Xóa nội dung input
            return; // Thoát khỏi vòng lặp vì đã tìm thấy và xử lý enemy
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
// --- Reset Combo, Handle Effects (Giữ nguyên) ---
function resetCombo() {
    if (comboCounter > 0) {
        console.log("Combo Reset!");
        comboCounter = 0;
        updateInfoBar();
    }
}
function handleEffects() {
    // Cập nhật và vẽ lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        lasers[i].draw();
        if (lasers[i].life <= 0) lasers.splice(i, 1);
    }
    // Cập nhật và vẽ particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
}
// --- Game Loop Functions (Giữ nguyên) ---
function updateAndDrawEnemies() {
    // Duyệt ngược để xóa phần tử khi đang lặp
    for (let i = enemies.length - 1; i >= 0; i--) {
        const isOutOfBounds = enemies[i].update(); // Cập nhật vị trí enemy
        enemies[i].draw(); // Vẽ enemy

        // Nếu enemy ra khỏi màn hình
        if (isOutOfBounds) {
            // Xóa enemy khỏi mảng
            enemies.splice(i, 1);
            // Việc reset combo và tăng enemiesReachedPlayer đã được thêm vào Enemy.update()
        }
    }
}
function checkGameOver() {
    if (gameState !== 'playing') return;

    // Vòng lặp kiểm tra va chạm giữa enemies và player
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyBottom = enemy.y + enemy.height; // Đáy của enemy
        const playerTop = player.y; // Đỉnh của người chơi
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        const playerLeft = player.x;
        const playerRight = player.x + player.width;

        // Kiểm tra va chạm (hình chữ nhật của enemy và player chồng lấn)
        if (enemyBottom >= playerTop &&
            enemyRight > playerLeft &&
            enemyLeft < playerRight) {

            // Tính toán vị trí va chạm để tạo hiệu ứng nổ
            const collisionX = enemy.x + enemy.width / 2;
            const collisionY = player.y + player.height / 2; // Vị trí va chạm gần giữa tàu

            createExplosion(collisionX, collisionY, 'collision'); // Tạo hiệu ứng nổ va chạm
            var bgMusic = document.getElementById("brake");
            if (bgMusic) {
                bgMusic.currentTime = 0; // Đặt lại từ đầu mỗi khi gọi
                bgMusic.play();
            }
            playerLives--; // Giảm mạng người chơi
            enemiesReachedPlayer++; // Tăng số enemy đã va chạm (cho tính accuracy)
            resetCombo(); // Reset combo khi bị va chạm
            updateInfoBar(); // Cập nhật hiển thị thông tin

            enemies.splice(i, 1); // Xóa enemy đã va chạm

            // Kiểm tra nếu hết mạng
            if (playerLives <= 0) {
                var bgMusic = document.getElementById("start1");
                if (bgMusic) {
                    bgMusic.pause(); // Dừng nhạc
                    bgMusic.currentTime = 0; // Đưa thời gian về đầu
                }
                //chay nhac khi thua
                var over = document.querySelector("#over");
                if (over) { // Thêm kiểm tra null
                    over.play();
                }
                handleGameOver(); // Gọi hàm kết thúc game
                return; // Thoát khỏi hàm để tránh xử lý thêm sau khi game over
            }
            return; // Thoát khỏi vòng lặp sau khi xử lý va chạm để tránh lỗi
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
        setTimeout(() => document.body.removeChild(flashDiv), 300); // Thời gian trùng với transition
    }, 50); // Độ trễ nhỏ trước khi bắt đầu mờ dần
}

function handleGameOver() {
    if (gameState !== 'playing') return;
    gameState = 'gameOver'; // Đặt trạng thái game là kết thúc
    finalScore = score; // Lưu điểm cuối cùng
    if (finalScore > highScore) {
        highScore = finalScore; // Cập nhật điểm cao nhất nếu cần
        saveHighScore(); // Lưu điểm cao nhất vào Local Storage
    }
    // Dừng việc sinh enemy mới
    clearInterval(spawnIntervalId);
    spawnIntervalId = null;
    // Cho phép click vào canvas (để tương tác với nút Restart/Menu)
    canvas.classList.add('clickable');
    // Vô hiệu hóa ô input
    inputBox.disabled = true;
    inputBox.value = ''; // Xóa nội dung ô input
    console.log("Game Over!");
}
// Định nghĩa các nút trên màn hình game over
const gameOverButtonRetry = {
    x: canvas.width / 2 - 150,
    y: canvas.height / 2 + 100,
    width: 120,
    height: 50,
    text: "Chơi lại"
};
const gameOverButtonMenu = {
    x: canvas.width / 2 + 30,
    y: canvas.height / 2 + 100,
    width: 120,
    height: 50,
    text: "Menu"
};

function drawGameOverScreen() {
    // Vẽ lớp phủ tối
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ thông tin game over
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '24px Arial';
    ctx.fillText(`Người chơi: ${playerName}`, canvas.width / 2, canvas.height / 2 - 120);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 60px Arial';
    ctx.fillText("KẾT THÚC!", canvas.width / 2, canvas.height / 2 - 50);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(`Điểm: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 0);

    ctx.font = '20px Arial';
    ctx.fillText(`Điểm cao nhất: ${highScore}`, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText(`Độ chính xác: ${accuracy}%`, canvas.width / 2, canvas.height / 2 + 60);


    // Vẽ nút "Chơi lại"
    ctx.fillStyle = '#4CAF50'; // Màu xanh lá
    ctx.fillRect(gameOverButtonRetry.x, gameOverButtonRetry.y, gameOverButtonRetry.width, gameOverButtonRetry.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    // Vẽ chữ căn giữa nút
    ctx.fillText(gameOverButtonRetry.text, gameOverButtonRetry.x + gameOverButtonRetry.width / 2, gameOverButtonRetry.y + 32); // 32 để căn chỉnh theo chiều dọc

    // Vẽ nút "Menu"
    ctx.fillStyle = '#007bff'; // Màu xanh dương
    ctx.fillRect(gameOverButtonMenu.x, gameOverButtonMenu.y, gameOverButtonMenu.width, gameOverButtonMenu.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    // Vẽ chữ căn giữa nút
    ctx.fillText(gameOverButtonMenu.text, gameOverButtonMenu.x + gameOverButtonMenu.width / 2, gameOverButtonMenu.y + 32); // 32 để căn chỉnh theo chiều dọc

    ctx.textAlign = 'left'; // Trả về căn lề mặc định
}

// Hàm vòng lặp game chính
function gameLoop() {
    // Xóa toàn bộ canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
        // Nếu đang chơi
        drawPlayer(); // Vẽ tàu người chơi
        updateAndDrawEnemies(); // Cập nhật vị trí và vẽ enemies
        handleEffects(); // Cập nhật và vẽ lasers, particles
        checkGameOver(); // Kiểm tra điều kiện game over
    } else if (gameState === 'gameOver') {
        // Nếu game over
        // Vẫn vẽ enemy và hiệu ứng để hiển thị trạng thái cuối cùng
        drawPlayer();
        updateAndDrawEnemies();
        handleEffects();
        drawGameOverScreen(); // Vẽ màn hình game over
    } else if (gameState === 'menu') {
        // Nếu đang ở menu, không vẽ gì trên canvas (menu là div HTML)
    }

    // Yêu cầu trình duyệt vẽ lại khung hình tiếp theo
    animationFrameId = requestAnimationFrame(gameLoop);
}
// --- Local Storage Functions (Giữ nguyên) ---
function saveHighScore() {
    try {
        localStorage.setItem('typingAttackHighScore', highScore.toString());
    } catch (e) {
        console.error("Lỗi lưu điểm cao:", e);
    }
}

function loadHighScore() {
    try {
        const storedScore = localStorage.getItem('typingAttackHighScore');
        if (storedScore !== null)
            highScore = parseInt(storedScore, 10) || 0; // Chuyển đổi sang số, mặc định 0 nếu lỗi
    } catch (e) {
        console.error("Lỗi tải điểm cao:", e);
        highScore = 0; // Đặt về 0 nếu có lỗi
    }
    highScoreDisplay.textContent = highScore; // Cập nhật hiển thị điểm cao nhất
}

function savePlayerName() {
    try {
        localStorage.setItem('typingAttackPlayerName', playerName);
    } catch (e) {
        console.error("Lỗi lưu tên:", e);
    }
}

function loadPlayerName() {
    try {
        const storedName = localStorage.getItem('typingAttackPlayerName');
        if (storedName)
            playerName = storedName;
    } catch (e) {
        console.error("Lỗi tải tên:", e);
        playerName = "Player"; // Đặt tên mặc định nếu lỗi
    }
    playerNameInput.value = playerName; // Cập nhật ô input tên
}

function saveLaserColor() {
    try {
        localStorage.setItem('typingAttackLaserColor', selectedLaserColor);
        localStorage.setItem('typingAttackLaserColorName', selectedLaserColorName);
    } catch (e) {
        console.error("Lỗi lưu màu laser:", e);
    }
}

function loadLaserColor() {
    try {
        const storedColor = localStorage.getItem('typingAttackLaserColor');
        const storedName = localStorage.getItem('typingAttackLaserColorName');
        if (storedColor && storedName) {
            selectedLaserColor = storedColor;
            selectedLaserColorName = storedName;
        } else {
            // Giá trị mặc định nếu chưa có trong storage
            selectedLaserColor = '#00FF00';
            selectedLaserColorName = 'Xanh lá';
        }
    } catch (e) {
        console.error("Lỗi tải màu laser:", e);
        // Giá trị mặc định nếu lỗi
        selectedLaserColor = '#00FF00';
        selectedLaserColorName = 'Xanh lá';
    }
    currentLaserColorNameSpan.textContent = selectedLaserColorName; // Cập nhật hiển thị tên màu
    // Đánh dấu nút màu laser đã chọn trên menu
    laserColorButtons.forEach(btn => {
        if (btn.dataset.color === selectedLaserColor) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// --- Lưu và tải ngôn ngữ đã chọn (MỚI) ---
function saveLanguage() {
    try {
        localStorage.setItem('typingAttackLanguage', selectedLanguage);
    } catch (e) {
        console.error("Lỗi lưu ngôn ngữ:", e);
    }
}

function loadLanguage() {
    try {
        const storedLanguage = localStorage.getItem('typingAttackLanguage');
        if (storedLanguage && programmingWords[storedLanguage]) { // Kiểm tra ngôn ngữ lưu có tồn tại không
            selectedLanguage = storedLanguage;
        } else {
            selectedLanguage = 'c'; // Mặc định là C
        }
    } catch (e) {
        console.error("Lỗi tải ngôn ngữ:", e);
        selectedLanguage = 'c'; // Mặc định là C nếu lỗi
    }
    words = programmingWords[selectedLanguage]; // Cập nhật danh sách từ
    currentLanguageSpan.textContent = selectedLanguage.toUpperCase(); // Cập nhật hiển thị
    // Đánh dấu nút ngôn ngữ đã chọn trên menu
    languageButtons.forEach(btn => {
        if (btn.dataset.language === selectedLanguage) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// --- Menu Functions (ĐÃ CẬP NHẬT) ---
playerNameInput.addEventListener('change', () => {
    playerName = playerNameInput.value.trim() || "Player"; // Lấy tên từ input, mặc định "Player" nếu rỗng
    savePlayerName(); // Lưu tên
});

laserColorButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedLaserColor = button.dataset.color; // Lấy màu từ data-color
        selectedLaserColorName = button.dataset.name; // Lấy tên màu từ data-name
        saveLaserColor(); // Lưu màu đã chọn
        currentLaserColorNameSpan.textContent = selectedLaserColorName; // Cập nhật hiển thị
        selectOption(laserColorButtons, selectedLaserColor, null); // Cập nhật trạng thái nút selected
        console.log("Selected Laser Color:", selectedLaserColorName, selectedLaserColor);
    });
});

// Listener cho các nút ngôn ngữ (MỚI)
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedLanguage = button.dataset.language; // Cập nhật ngôn ngữ
        words = programmingWords[selectedLanguage]; // Cập nhật danh sách từ
        saveLanguage(); // Lưu ngôn ngữ đã chọn
        selectOption(languageButtons, selectedLanguage, (val) => {
            // Cập nhật hiển thị tên ngôn ngữ trên nút chính
            currentLanguageSpan.textContent = val.toUpperCase();
        });
        console.log("Selected Language:", selectedLanguage);
    });
});


function showMenu() {
    gameState = 'menu';
    menuDiv.style.display = 'block'; // Hiển thị menu

    gameContainerDiv.style.display = 'none'; // Ẩn container game
    canvas.classList.remove('clickable'); // Bỏ lớp clickable trên canvas
    inputBox.disabled = false; // Kích hoạt lại ô input (dù nó bị ẩn, đề phòng)

    loadHighScore(); // Tải điểm cao nhất khi vào menu
    loadPlayerName(); // Tải tên người chơi
    loadLaserColor(); // Tải màu laser đã chọn
    loadLanguage(); // Tải ngôn ngữ đã chọn (MỚI)


    // Cập nhật hiển thị các lựa chọn đã chọn
    currentDifficultySpan.textContent = difficulties[selectedDifficulty].name;
    // Cập nhật hiển thị nhân vật đã chọn, kiểm tra key tồn tại
    if (characters[selectedCharacter]) {
        currentCharacterSpan.textContent = characters[selectedCharacter].name;
    } else {
        currentCharacterSpan.textContent = 'Không xác định'; // Hoặc tên mặc định
    }
    currentLanguageSpan.textContent = selectedLanguage.toUpperCase(); // Cập nhật hiển thị ngôn ngữ (MỚI)


}

function hideMenu() {
    menuDiv.style.display = 'none'; // Ẩn menu
    gameContainerDiv.style.display = 'block'; // Hiển thị container game


}

// Hàm ẩn/hiện các nhóm tùy chọn
function toggleOptions(elementId) {
    document.getElementById(elementId).classList.toggle('hidden');
}

// Hàm đánh dấu nút đã chọn trong một nhóm
function selectOption(buttonGroup, selectedValue, updateFunction) {
    buttonGroup.forEach(btn => {
        // Lấy key đầu tiên trong dataset (ví dụ: 'difficulty', 'character', 'color', 'language')
        const dataKey = Object.keys(btn.dataset)[0];
        if (btn.dataset[dataKey] === selectedValue) {
            btn.classList.add('selected'); // Thêm lớp 'selected'
        } else {
            btn.classList.remove('selected'); // Xóa lớp 'selected'
        }
    });
    if (updateFunction) {
        // Truyền giá trị đã chọn vào hàm cập nhật
        const selectedBtn = Array.from(buttonGroup).find(btn => {
            const dataKey = Object.keys(btn.dataset)[0];
            return btn.dataset[dataKey] === selectedValue;
        });
        if (selectedBtn) {
            updateFunction(selectedBtn.dataset[Object.keys(selectedBtn.dataset)[0]]);
        }
    }
}


// --- Event Listeners for Menu ---
startButton.addEventListener('click', startGame);


// Listener cho các nút độ khó
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDifficulty = button.dataset.difficulty; // Cập nhật độ khó
        selectOption(difficultyButtons, selectedDifficulty, (val) => {
            // Cập nhật hiển thị tên độ khó trên nút chính
            currentDifficultySpan.textContent = difficulties[val].name;
        });
        console.log("Selected Difficulty:", selectedDifficulty);
    });
});

// Listener cho các nút nhân vật
const allCharacterButtons = document.querySelectorAll('.character-btn'); // Query lại sau khi sửa HTML
allCharacterButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedCharacter = button.dataset.character; // Cập nhật nhân vật
        // Cập nhật tên hiển thị trên nút chính
        selectOption(allCharacterButtons, selectedCharacter, (val) => {
            // Kiểm tra xem key có tồn tại trong characters không trước khi lấy name
            if (characters[val]) {
                currentCharacterSpan.textContent = characters[val].name;
            }
        });
        console.log("Selected Character:", selectedCharacter);
    });
});

// --- Game Initialization (ĐÃ CẬP NHẬT) ---
function startGame() {
    if (gameState === 'playing') return; // Ngăn chặn start game nếu đang chơi

    canvas.classList.remove('clickable'); // Bỏ clickable
    inputBox.disabled = false; // Kích hoạt input box

    // Dừng interval sinh enemy cũ nếu có
    if (spawnIntervalId) {
        clearInterval(spawnIntervalId);
    }

    // Reset các biến game
    score = 0;
    playerLives = 3;
    comboCounter = 0;
    successfulHits = 0;
    enemiesReachedPlayer = 0;
    accuracy = 100;
    enemies = [];
    lasers = [];
    particles = [];

    // Cập nhật hiển thị ban đầu
    updateInfoBar();

    // Áp dụng cài đặt độ khó đã chọn (sử dụng tốc độ đã giảm)
    currentEnemySpeed = difficulties[selectedDifficulty].speed;
    currentSpawnRate = difficulties[selectedDifficulty].rate;
    currentTargetFactor = difficulties[selectedDifficulty].targetFactor;

    gameState = 'playing'; // Đặt trạng thái game thành đang chơi
    hideMenu(); // Ẩn menu

    // Bắt đầu sinh enemy theo interval
    spawnIntervalId = setInterval(spawnEnemy, currentSpawnRate);

    // Tự động focus vào input box sau một khoảng thời gian ngắn
    setTimeout(() => inputBox.focus(), 100);

    // Phát nhạc nền game (ĐÃ CẬP NHẬT: Chỉ phát nhạc game, không còn dừng nhạc menu)
    playBackgroundMusic(selectedDifficulty);

}
// Logic nhạc nền menu khi tải trang (ĐÃ XÓA)
// window.onload = function () {
//     var result = confirm("Bạn có muốn bật nhạc không?"); // Hiện hộp thoại xác nhận
//     if (result) { // Nếu người dùng chọn OK
//         var music = document.getElementById("back");

//         if (music) {
//             music.play(); // Phát nhạc mặc định menu
//         }
//     }
// };


// --- Input Focus Handling (Giữ nguyên) ---
inputBox.addEventListener('blur', () => {
    // Nếu input box mất focus khi game đang chạy, cố gắng focus lại
    if (gameState === 'playing') {
        setTimeout(() => {
            // Kiểm tra lại trạng thái game trước khi focus
            if (gameState === 'playing') {
                inputBox.focus();
            }
        }, 100); // Độ trễ nhỏ để tránh loop focus/blur
    }
});
// --- Canvas Click Listener (Giữ nguyên) ---
canvas.addEventListener('click', (event) => {
    // Chỉ xử lý click trên canvas khi game over
    if (gameState !== 'gameOver') return;

    const rect = canvas.getBoundingClientRect(); // Lấy vị trí và kích thước canvas
    const clickX = event.clientX - rect.left; // Tọa độ X của click so với canvas
    const clickY = event.clientY - rect.top; // Tọa độ Y của click so với canvas

    // Kiểm tra click vào nút "Chơi lại"
    if (clickX >= gameOverButtonRetry.x && clickX <= gameOverButtonRetry.x + gameOverButtonRetry.width &&
        clickY >= gameOverButtonRetry.y && clickY <= gameOverButtonRetry.y + gameOverButtonRetry.height) {
        startGame(); // Bắt đầu game mới
    }
    // Kiểm tra click vào nút "Menu"
    else if (clickX >= gameOverButtonMenu.x && clickX <= gameOverButtonMenu.x + gameOverButtonMenu.width &&
        clickY >= gameOverButtonMenu.y && clickY <= gameOverButtonMenu.y + gameOverButtonMenu.height) {
        showMenu(); // Hiển thị menu
    }
});


// --- Initial Setup (ĐÃ CẬP NHẬT) ---
loadLanguage(); // Tải ngôn ngữ đã chọn khi tải trang (MỚI)
showMenu(); // Hiển thị menu khi tải trang lần đầu
gameLoop(); // Bắt đầu vòng lặp game (sẽ chỉ vẽ màn hình menu hoặc game over ban đầu)