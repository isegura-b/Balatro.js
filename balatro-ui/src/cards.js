// cards.js
class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.numericValue = this.calculateNumericValue();
        this.rank = this.calculateRank();
        this.displayValue = this.toDisplay();
    }

    calculateNumericValue() {
        if (this.value >= 2 && this.value <= 10)
            return Number(this.value);
        else if (this.value === 'J' || this.value === 'Q' || this.value === 'K')
            return 10;
        else
            return 11; // A
    }

    calculateRank() {
        if (this.value >= 2 && this.value <= 10)
            return Number(this.value);
        else if (this.value === 'J')
            return 11;
        else if (this.value === 'Q')
            return 12;
        else if (this.value === 'K')
            return 13;
        else 
            return 14; // A
    }

    toDisplay() {
        return this.value + this.suit[0]; // Ej: "AH", "10D"
    }
}

function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    let index = 0;
    for (let suit of suits) {
        for (let value of values) {
            const card = new Card(value, suit);
            card.index = index;
            card.row = Math.floor(index / 13); // 4 filas de 13 cartas
            card.col = index % 13;
            deck.push(card);
            index++;
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCards(deck, count, hand) {
    while (count > 0 && deck.length > 0) {
        hand.push(deck.pop());
        count--;
    }
    if (deck.length === 0) console.log("The deck is empty.");
}

export { Card, createDeck, shuffleDeck, drawCards };