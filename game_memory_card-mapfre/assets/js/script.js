// --- Seleção de Elementos HTML ---
const memoryGame = document.getElementById('memory-game');
const movesCountElement = document.getElementById('moves-count');
const restartButton = document.getElementById('restart-button');

// --- Variáveis de Controle do Jogo ---
let cardsArray = [];
// MODIFICAÇÃO 1: Define o número de pares para 9.
// Isso significa que teremos 18 cartas no total (9 pares).
const numPairs = 9; 

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;
let moves = 0;

// --- Imagens das Cartas ---
// Lista de URLs das imagens que serão usadas nas cartas.
const cardImages = [
    './assets/img/img1.png', './assets/img/img2.png', './assets/img/img3.png', './assets/img/img4.png',
    './assets/img/img5.png', './assets/img/img6.png', './assets/img/img7.png', './assets/img/img8.png',
    './assets/img/img9.png', './assets/img/img10.png', './assets/img/img11.png', './assets/img/img12.png',
    './assets/img/img13.png', './assets/img/img14.png', './assets/img/img15.png', './assets/img/img16.png',
    './assets/img/img17.png', './assets/img/img18.png'
];

// --- Função Principal: Inicializa o Jogo ---
function initializeGame() {
    cardsArray = []; 
    matchesFound = 0;
    moves = 0;
    movesCountElement.textContent = moves;
    memoryGame.innerHTML = ''; 

    // --- Cria os Pares de Cartas ---
    // O loop agora só roda 9 vezes (numPairs), usando apenas as 9 primeiras imagens da lista.
    for (let i = 0; i < numPairs; i++) {
        cardsArray.push({ id: i, image: cardImages[i] }); 
        cardsArray.push({ id: i, image: cardImages[i] }); 
    }

    shuffleCards(cardsArray); 

    // --- Cria os Elementos HTML das Cartas no DOM ---
    cardsArray.forEach(card => {
        const memoryCard = document.createElement('div');
        memoryCard.classList.add('memory-card');
        memoryCard.dataset.id = card.id;

        const frontFace = document.createElement('img');
        frontFace.classList.add('front-face');
        frontFace.src = card.image;
        frontFace.alt = 'Card Front';

        const backFace = document.createElement('img');
        backFace.classList.add('back-face');
        backFace.src = './assets/img/card_back.png';
        backFace.alt = 'Card Back';

        memoryCard.appendChild(frontFace);
        memoryCard.appendChild(backFace);

        memoryCard.classList.remove('flip', 'match');
        memoryCard.addEventListener('click', flipCard);
        memoryGame.appendChild(memoryCard);
    });
}

// --- Função para Embaralhar as Cartas (Algoritmo de Fisher-Yates) ---
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Função para Virar a Carta (Chamada ao Clicar) ---
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesCountElement.textContent = moves;

    checkForMatch();
}

// --- Função para Verificar se as Cartas Formam um Par ---
function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// --- Função para Desativar Cartas que Formaram um Par ---
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchesFound++;
    // O jogo termina quando 9 pares são encontrados
    if (matchesFound === numPairs) {
        setTimeout(() => {
            alert(`Parabéns! Você encontrou todos os pares em ${moves} movimentos!`);
        }, 500);
    }

    resetBoard();
}

// --- Função para Virar as Cartas de Volta (se não for um par) ---
function unflipCards() {
    lockBoard = true; 

    setTimeout(() => {
        firstCard.classList.remove('flip'); 
        secondCard.classList.remove('flip');
        resetBoard(); 
    }, 1000);
}

// --- Função para Resetar as Variáveis de Controle do Tabuleiro ---
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- Event Listener para o Botão de Reiniciar ---
restartButton.addEventListener('click', initializeGame);

// --- Início do Jogo ---
initializeGame();