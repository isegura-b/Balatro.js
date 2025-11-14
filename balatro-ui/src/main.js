import { createDeck, shuffleDeck, drawCards } from './cards.js';
import { scoreCalculation, getChipsAndMult } from './scoreCalculation.js';

const handContainer = document.getElementById('hand-container');
const playBtn = document.getElementById('play-btn');
const discardBtn = document.getElementById('discard-btn');
const scoreDisplay = document.getElementById('score');
const anteDisplay = document.getElementById('ante');

let deck = createDeck();
shuffleDeck(deck);
let hand = [];
drawCards(deck, 8, hand);
let selectedCards = [];
let totalScore = 0;
let ante = 300;
if (anteDisplay) 
    anteDisplay.textContent = ante;
// Ante level and calculation (reuse terminal algorithm)
let anteLevel = 1;
function calculateBet(level) {
    const base = 300;
    const growth = 1.4;
    let bet = base * Math.pow(growth, level - 1);
    return Math.round(bet / 100) * 100;
}
// initialize ante from level
ante = calculateBet(anteLevel);
if (anteDisplay) 
    anteDisplay.textContent = ante;
// Hands and discards counters (visible in UI)
let handsLeft = 5;
let discardsLeft = 3;
const handsLeftDisplay = document.getElementById('hands-left');
const discardsLeftDisplay = document.getElementById('discards-left');
if (handsLeftDisplay) handsLeftDisplay.textContent = String(handsLeft);
if (discardsLeftDisplay) discardsLeftDisplay.textContent = String(discardsLeft);
// Sidebar elements (small info box)
const sbScore = document.getElementById('sb-score');
const sbAnte = document.getElementById('sb-ante');
const sbHandType = document.getElementById('sb-handtype');
const sbMult = document.getElementById('sb-mult');
const sbHands = document.getElementById('sb-hands');
const sbDiscards = document.getElementById('sb-discards');
if (sbScore) sbScore.textContent = String(totalScore);
if (sbAnte) sbAnte.textContent = String(ante);
if (sbHandType) sbHandType.textContent = '—';
if (sbMult) sbMult.textContent = '—';
if (sbHands) sbHands.textContent = String(handsLeft);
if (sbDiscards) sbDiscards.textContent = String(discardsLeft);
const bottomCounter = document.getElementById('bottom-counter');
if (bottomCounter) bottomCounter.textContent = `${selectedCards.length}/5`;

// Asegurar que las cartas estén centradas y con separación
if (handContainer) {
    handContainer.style.display = 'flex';
    handContainer.style.flexWrap = 'wrap';
    handContainer.style.justifyContent = 'center';
    handContainer.style.gap = '16px';
    handContainer.style.padding = '16px';
    handContainer.style.marginTop = '580px';
}

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const exitBtn = document.getElementById('exit-btn');

// Configuración del spritesheet
const cardWidth = 150;
const cardHeight = 200;

function renderHand() {
    handContainer.innerHTML = '';
    // Ordenar mano para mostrar de A (alto) a 2 (bajo)
    const suitPriority = { '♥': 0, '♦': 1, '♣': 2, '♠': 3 };
    const displayHand = [...hand].sort((a, b) => {
        if (b.rank !== a.rank) return b.rank - a.rank; // A (14) primero
        return suitPriority[a.suit] - suitPriority[b.suit];
    });

    displayHand.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        if (selectedCards.includes(card)) cardDiv.classList.add('selected');
        // Mostrar carta en blanco por defecto; si está seleccionada, mostrar su valor
        cardDiv.style.width = `${cardWidth}px`;
        cardDiv.style.height = `${cardHeight}px`;
        cardDiv.style.border = '2px solid #444';
        cardDiv.style.borderRadius = '8px';
        cardDiv.style.background = '#ffffff';
        cardDiv.style.display = 'flex';
        cardDiv.style.alignItems = 'center';
        cardDiv.style.justifyContent = 'center';
        cardDiv.style.boxSizing = 'border-box';
        cardDiv.style.userSelect = 'none';
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.fontFamily = 'Arial, sans-serif';
        cardDiv.style.color = '#000';
        cardDiv.style.fontSize = '20px';
        cardDiv.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease';

        // Mostrar siempre el valor y el palo; colorear corazones/diamantes en rojo
        cardDiv.textContent = card.displayValue;
        // Color según palo
        if (card.suit === '♥') {
            cardDiv.style.color = '#c0392b';
        } else if (card.suit === '♦') {
            cardDiv.style.color = '#ffa600ff';
        } else if (card.suit === '♣') {
            cardDiv.style.color = '#0d00beff';
        } else {
            cardDiv.style.color = '#111';
        }
        // Si está seleccionada la resaltamos cambiando el fondo y la levantamos
        if (selectedCards.includes(card)) {
            cardDiv.style.background = '#fff9c4';
            cardDiv.style.transform = 'translateY(-16px)';
            cardDiv.style.boxShadow = '0 18px 36px rgba(0,0,0,0.32)';
            cardDiv.style.zIndex = '10';
        } else {
            cardDiv.style.transform = 'translateY(0)';
            cardDiv.style.boxShadow = 'none';
            cardDiv.style.zIndex = '1';
        }

        // Selección por objeto carta (funciona aunque la mano esté ordenada para visualización)
        cardDiv.addEventListener('click', () => toggleCardSelection(card));
        handContainer.appendChild(cardDiv);
    });
}

function toggleCardSelection(cardOrIndex) {
    // acepta índice (compatibilidad) o objeto carta
    let card;
    if (typeof cardOrIndex === 'number') card = hand[cardOrIndex];
    else card = cardOrIndex;

    if (!card) return;
    if (selectedCards.includes(card)) {
        selectedCards = selectedCards.filter(c => c !== card);
    } else {
        if (selectedCards.length >= 5) {
            alert('You can select up to 5 cards only.');
            return;
        }
        selectedCards.push(card);
    }
    renderHand();
    // actualizar multiplicación en la sidebar
    if (sbMult) {
        if (selectedCards.length === 0) {
            if (sbHandType) sbHandType.textContent = '—';
            sbMult.textContent = '—';
        } else {
            const sel = selectedCards.map(c => c.displayValue);
            const { chips, mult, handType } = getChipsAndMult(sel, hand);
            const total = chips * mult;
            if (sbHandType) sbHandType.textContent = handType;
            sbMult.textContent = `${chips} × ${mult} = ${total}`;
        }
    }
    if (bottomCounter) bottomCounter.textContent = `${selectedCards.length}/5`;
}

// start a new round: reset deck/hand/counters. keepAnte=false resets level to 1
function startNewRound(options = { keepAnte: true }) {
    deck = createDeck();
    shuffleDeck(deck);
    hand = [];
    drawCards(deck, 8, hand);
    selectedCards = [];
    totalScore = 0;
    if (scoreDisplay) scoreDisplay.textContent = totalScore;
    handsLeft = 5;
    discardsLeft = 3;
    if (handsLeftDisplay) 
        handsLeftDisplay.textContent = String(handsLeft);
    if (discardsLeftDisplay) 
        discardsLeftDisplay.textContent = String(discardsLeft);
    if (!options.keepAnte) {
        anteLevel = 1;
    }
    ante = calculateBet(anteLevel);
    if (anteDisplay) 
        anteDisplay.textContent = ante;
    if (sbAnte) 
        sbAnte.textContent = String(ante);
    if (sbHandType) 
        sbHandType.textContent = '—';
    if (sbScore) 
        sbScore.textContent = String(totalScore);
    if (sbDiscards) 
        sbDiscards.textContent = String(discardsLeft);
    if (sbHandType) 
        sbHandType.textContent = '—';
    if (sbMult) 
        sbMult.textContent = '—';
    if (playBtn) 
        playBtn.disabled = false;
    if (discardBtn) 
        discardBtn.disabled = false;
    renderHand();
}

playBtn.addEventListener('click', () => {
    try {
        console.log('Play button clicked. Selected cards:', selectedCards);
        console.log('DOM refs presence:', {
            scoreDisplay: !!scoreDisplay,
            sbScore: !!sbScore,
            sbHandType: !!sbHandType,
            sbMult: !!sbMult,
            bottomCounter: !!bottomCounter,
            handsLeftDisplay: !!handsLeftDisplay,
            discardsLeftDisplay: !!discardsLeftDisplay,
            anteDisplay: !!anteDisplay,
            sbAnte: !!sbAnte,
            sbHands: !!sbHands,
            sbDiscards: !!sbDiscards
        });
        if (handsLeft <= 0) 
            return alert('No hands left.');
        if (selectedCards.length === 0)
            return alert("Select cards to play!");

        // defensiva: aceptar tanto objetos carta como strings
        const selStrings = selectedCards.map(c => (typeof c === 'string') ? c : (c && c.displayValue) ? c.displayValue : String(c));

        totalScore += scoreCalculation(selStrings, hand);
        if (scoreDisplay) scoreDisplay.textContent = totalScore;
        if (sbScore) sbScore.textContent = String(totalScore);

        hand = hand.filter(c => !selectedCards.includes(c));
        drawCards(deck, selectedCards.length, hand);
        selectedCards = [];
        renderHand();
        if (sbHandType) sbHandType.textContent = '—';
        if (sbMult) sbMult.textContent = '—';
        if (bottomCounter) bottomCounter.textContent = `${selectedCards.length}/5`;
        // consumir una mano
        handsLeft = Math.max(0, handsLeft - 1);
        if (handsLeftDisplay) handsLeftDisplay.textContent = String(handsLeft);
        if (sbHands) sbHands.textContent = String(handsLeft);
        if (handsLeft <= 0 && playBtn) playBtn.disabled = true;

        // comprobar si superaste el ante -> subir nivel y reiniciar ronda
        if (totalScore >= ante) {
            alert(`¡Has superado el ante (${ante})! Avanzando al siguiente nivel.`);
            anteLevel++;
            ante = calculateBet(anteLevel);
            if (anteDisplay) anteDisplay.textContent = ante;
            if (sbAnte) sbAnte.textContent = String(ante);
            startNewRound({ keepAnte: true });
            return;
        }

        // si no quedan manos y no llegaste al ante -> perder la ronda
        if (handsLeft <= 0 && totalScore < ante) {
            alert(`Game over. Obtuviste ${totalScore} puntos. El ante era ${ante}. Reiniciando al nivel 1.`);
            startNewRound({ keepAnte: false });
            gameScreen.style.display = 'none';
            startScreen.style.display = 'flex';
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.style.display = 'none';
            return;
        }
    } catch (err) {
        console.error('Error in play handler:', err);
        alert('Error al jugar la mano: ' + (err && err.message ? err.message : String(err)));
    }
});

discardBtn.addEventListener('click', () => {
    if (discardsLeft <= 0) 
        return alert('No discards left.');
    if (selectedCards.length === 0)
        return alert("Select cards to discard!");
    hand = hand.filter(c => !selectedCards.includes(c));
    drawCards(deck, selectedCards.length, hand);
    selectedCards = [];
    renderHand();
    if (sbHandType) sbHandType.textContent = '—';
    if (sbMult) sbMult.textContent = '—';
    if (bottomCounter) bottomCounter.textContent = `${selectedCards.length}/5`;
    // consumir un descarte al usar el botón
    discardsLeft = Math.max(0, discardsLeft - 1);
    if (discardsLeftDisplay) discardsLeftDisplay.textContent = String(discardsLeft);
    if (sbDiscards) 
        sbDiscards.textContent = String(discardsLeft);
    if (discardsLeft <= 0 && discardBtn) 
        discardBtn.disabled = true;
});

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    renderHand();
    // show sidebar when game starts
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'block';
    if (sbMult) sbMult.textContent = '—';
});

exitBtn.addEventListener('click', () => {
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    deck = createDeck();
    shuffleDeck(deck);
    hand = [];
    drawCards(deck, 8, hand);
    selectedCards = [];
    totalScore = 0;
    if (scoreDisplay) scoreDisplay.textContent = totalScore;
    anteLevel = 1;
    ante = calculateBet(anteLevel);
    if (anteDisplay) 
        anteDisplay.textContent = ante;
    if (sbHandType) sbHandType.textContent = '—';
    if (sbMult) sbMult.textContent = '—';
    if (sbScore) 
        sbScore.textContent = String(totalScore);
    if (sbAnte) 
        sbAnte.textContent = String(ante);
    if (sbMult) sbMult.textContent = '—';
    if (sbHands) 
        sbHands.textContent = String(handsLeft);
    if (sbDiscards) 
        sbDiscards.textContent = String(discardsLeft);
    // reset hands/discards
    handsLeft = 5;
    discardsLeft = 3;
    if (handsLeftDisplay) 
        handsLeftDisplay.textContent = String(handsLeft);
    if (discardsLeftDisplay) 
        discardsLeftDisplay.textContent = String(discardsLeft);
    if (playBtn) 
        playBtn.disabled = false;
    if (discardBtn) 
        discardBtn.disabled = false;
    // hide sidebar when exiting to start screen
    const sidebar = document.getElementById('sidebar');
    if (sidebar) 
        sidebar.style.display = 'none';
});
