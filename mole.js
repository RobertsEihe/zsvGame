let currMoleTile;
let currPlantTiles = []; // Track multiple plant tiles
let score = 0;
let gameOver = false;
let moleTimer;
let gameTimer;
let timeLeft = 30;
let selectedCharacter = null;
let maxPlants = 1; // Start with one plant
let currentIndex = 0; // Index of the active character
let egaTrue = true;
let proMode = false;

window.onload = function () {
    setupNavigation();
    setupGallery(); // Initialize gallery
};

function setupNavigation() {
    document.querySelectorAll(".character").forEach((character) => {
        character.addEventListener("click", function () {
            document.querySelectorAll(".character").forEach((c) =>
                c.classList.remove("selected")
            );
            this.classList.add("selected");
            selectedCharacter = this.dataset.character;
        });
    });

    document.getElementById("toRules").addEventListener("click", function () {
        if (selectedCharacter) {
            navigateToPage("page2");
        } else {
            alert("Please select a character first!");
        }
    });

    document.getElementById("startGame").addEventListener("click", function () {
        navigateToPage("page3");
        setGame();
    });

    document.getElementById("playAgain").addEventListener("click", function () {
        resetGame();
        navigateToPage("page3");
        setGame();
    });

    document.getElementById("backToStart").addEventListener("click", function () {
        resetGame();
        navigateToPage("page1");
    });

    document.getElementById('modeSwitch').addEventListener('change', function () {
        const modeLabel = document.getElementById('modeLabel');
        if (this.checked) {
            modeLabel.textContent = 'Pro Mode';
            proMode = true;
        } else {
            modeLabel.textContent = 'Mammas režīms';
            proMode = false;
        }
    });
}

function navigateToPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

function resetGame() {
    score = 0;
    timeLeft = 30; 
    gameOver = false;
    maxPlants = 1;
    clearTimeout(moleTimer);
    clearInterval(gameTimer);
    document.getElementById("score").innerText = `Score: ${score} | Time: ${timeLeft}`;
}

function setGame() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear existing tiles
    for (let i = 0; i < 15; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }

    startGameTimer();
    startMoleTimer();
}

function startGameTimer() {
    document.getElementById("score").innerText = `Score: ${score} | Time: ${timeLeft}`;
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("score").innerText = `Score ${score} | Time: ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            endGame(score >= 100 ? "Mission Passed!" : "Game Over");
        }
    }, 1000);
}

function startMoleTimer() {
    clearTimeout(moleTimer);

    if (proMode == false) {
        if (score < 30) moleTimer = setTimeout(setMole, 2000);
    if (score >= 30 && score < 50) moleTimer = setTimeout(setMole, 1950);
    if (score >= 50 && score < 60) moleTimer = setTimeout(setMole, 1900);
    if (score >= 60 && score < 80) moleTimer = setTimeout(setMole, 1850);
    if (score >= 80 && score < 90) moleTimer = setTimeout(setMole, 1800);
    if (score >= 90) moleTimer = setTimeout(setMole, 1700);
    } else {
    if (score < 30) moleTimer = setTimeout(setMole, 2000);
    if (score >= 30 && score < 50) moleTimer = setTimeout(setMole, 1450);
    if (score >= 50 && score < 60) moleTimer = setTimeout(setMole, 950);
    if (score >= 60 && score < 80) moleTimer = setTimeout(setMole, 900);
    if (score >= 80 && score < 90) moleTimer = setTimeout(setMole, 850);
    if (score >= 90) moleTimer = setTimeout(setMole, 700);
    }

    
}

function setMole() {
    if (gameOver) return;

    // Remove the mole from the previous tile, if any
    if (currMoleTile) {
        currMoleTile.classList.remove("flipped");
        currMoleTile.style.backgroundImage = ""; // Remove background image
    }

    let num = getRandomTile();
    // Ensure mole doesn't overlap with plant tiles
    while (currPlantTiles.some(tile => tile.id === num)) {
        num = getRandomTile();
    }

    currMoleTile = document.getElementById(num);

    // Set the mole as the background image
    currMoleTile.style.backgroundImage = `url('./players/${getCharacterImage(selectedCharacter)}')`;
    currMoleTile.style.backgroundSize = "cover";
    currMoleTile.style.backgroundPosition = "center";
    currMoleTile.classList.add("flipped");

    setPlants(); // Update plants whenever a mole is placed
    startMoleTimer();
}


function setPlants() {
    if (gameOver) return;

    // Clear previous plant tiles
    currPlantTiles.forEach(tile => {
        tile.classList.remove("flipped");
        tile.style.backgroundImage = ""; // Remove the background image
    });
    currPlantTiles = [];

    // Place plants on the board
    for (let i = 0; i < maxPlants; i++) {
        let plantCharacter = getRandomPlantCharacter();

        let num = getRandomTile();
        while (
            (currMoleTile && currMoleTile.id === num) || // Avoid mole tile
            currPlantTiles.some(tile => tile.id === num) // Avoid overlapping plants
        ) {
            num = getRandomTile();
        }

        let plantTile = document.getElementById(num);

        // Set the plant as the background image
        plantTile.style.backgroundImage = `url('./players/${getCharacterImage(plantCharacter)}')`;
        plantTile.style.backgroundSize = "cover";
        plantTile.style.backgroundPosition = "center";
        plantTile.classList.add("flipped");

        currPlantTiles.push(plantTile);
    }

    // Adjust the maximum number of plants as the score progresses
    if (score >= 30 && maxPlants < 2) maxPlants = 2;
    else if (score >= 40 && maxPlants < 3) maxPlants = 3;
    else if (score >= 50 && maxPlants < 4) maxPlants = 4;
    else if (score >= 60 && maxPlants < 5) maxPlants = 5;
    else if (score >= 70 && maxPlants < 6) maxPlants = 6;
    else if (score >= 80 && maxPlants < 7) maxPlants = 7;
    else if (score >= 90 && maxPlants < 8) maxPlants = 8;
}


function getCharacterImage(characterId) {
    const characterMap = {
        "1": "tetis.png",
        "2": "mamma.png",
        "3": "ega.png",
        "4": "roberts.png",
        "5": "estere.png",
        "6": "janis.png",
    };
    return characterMap[characterId];
}

function getRandomPlantCharacter() {
    const allCharacters = ["1", "2", "3", "4", "5", "6"];
    const plantCharacters = allCharacters.filter((char) => char !== selectedCharacter);
    return plantCharacters[Math.floor(Math.random() * plantCharacters.length)];
}

function getRandomTile() {
    return Math.floor(Math.random() * 15).toString();
}

function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = `Score: ${score} | Time: ${timeLeft}`;
        setMole();
    } else if (currPlantTiles.includes(this)) {
        score -= 10;
        document.getElementById("score").innerText = `Score: ${score} | Time: ${timeLeft}`;
        setMole();
    }

    // if (score >= 100) {
    //     endGame("Mission Passed!");
    // }
}

function endGame(message) {
    gameOver = true;
    clearTimeout(moleTimer);
    clearInterval(gameTimer);

    document.getElementById("endMessage").innerText = message;
    document.getElementById("endScore").innerText = `Score: ${score}`;

    const santaPic = document.querySelector(".santa-pic img");
    if (message === "Mission Passed!") {
        santaPic.src = "./santa/dab-santa-remove.png";
        santaPic.alt = "santa-dab";
    } else {
        santaPic.src = "./santa/sad-santa-remove.png";
        santaPic.alt = "santa-sad";
    }

    if (message === "Mission Passed!" && selectedCharacter == 3 && egaTrue) {
        alert("Mission Passed! Aizej pie eglītes, ej 12 soļus galda virzienā, tad 6 pa labi un tad, tad 6 pa labi, atver noslēpumainās durtiņas...");
    }
    
    navigateToPage("endScreen");
    
}


function setupGallery() {
    const wrapper = document.querySelector(".gallery-wrapper");
    const items = document.querySelectorAll(".gallery-item");

    function updateActiveItem(index) {
        items.forEach((item, idx) => {
            item.classList.remove("active", "swiping-left", "swiping-right");
            if (idx === index) {
                item.classList.add("active");
                // Automatically set the selectedCharacter based on the active item
                selectedCharacter = item.dataset.character;
            } else if (idx < index) {
                item.classList.add("swiping-left");
            } else {
                item.classList.add("swiping-right");
            }
        });
    }

    // Initial setup
    updateActiveItem(currentIndex);

    // Swipe logic
    let startX = 0;
    wrapper.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    wrapper.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        if (endX < startX - 50 && currentIndex < items.length - 1) {
            // Swipe left
            currentIndex++;
        } else if (endX > startX + 50 && currentIndex > 0) {
            // Swipe right
            currentIndex--;
        }
        updateActiveItem(currentIndex);
        wrapper.style.transform = `translateX(${-currentIndex * 100}%)`;
    });

    // Highlight selected character when clicked
    items.forEach((item) => {
        item.addEventListener("click", () => {
            items.forEach((i) => i.classList.remove("selected"));
            item.classList.add("selected");
            selectedCharacter = item.dataset.character;
        });
    });
}
