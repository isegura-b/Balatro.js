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
        else if (this.value == 'J' || this.value == 'Q' || this.value == 'K')
            return 10;
        else
            return 11;
    }

    calculateRank() {
        if (this.value >= 2 && this.value <= 10)
            return Number(this.value);
        else if (this.value == 'J')
            return 11;
        else if (this.value == 'Q')
            return 12;
        else if (this.value == 'K')
            return 13;
        else // A
            return 14;
    }

    showCard() {
        return `${this.value} of ${this.suit} (numeric value: ${this.numericValue}) displays as: ${this.displayValue}`;
    }

    toDisplay() {
        if (this.suit == "♥")
            return this.value + "H";
        else if (this.suit == "♦")
            return this.value + "D";
        else if (this.suit == "♣")
            return this.value + "C";
        else if (this.suit == "♠")
            return this.value + "S";
        else
            return this.value + "?";
    }
}

function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    let suitIndex = 0;
    while (suitIndex < suits.length) {
        let valueIndex = 0;
        while (valueIndex < values.length) {
            const card = new Card(values[valueIndex], suits[suitIndex]);
            deck.push(card);
            valueIndex++;
        }
        suitIndex++;
    }
    return deck;
}

function shuffleDeck(deck) {
    let i = deck.length - 1;
    while (i > 0) {
        const j = Math.floor(Math.random() * (i + 1));

        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;

        i--;
    }
}

function drawCards(deck, count, hand) 
{
    while (count > 0 && deck.length > 0) 
    {
        const drawnCard = deck.pop();
        hand.push(drawnCard);
        count--;
    }
    if (deck.length == 0) 
    {
        console.log("The deck is empty.");
    }
}

function showHand(hand) {
    const valueOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const suitOrder = ['♥', '♠', '♦', '♣'];

    const sortedHand = [...hand].sort((a, b) => {
        const valueCompare = valueOrder.indexOf(a.value) - valueOrder.indexOf(b.value);
        if (valueCompare !== 0)
            return valueCompare;

        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
    });

    console.log("\n                 ==== Cards in hand ====");
    sortedHand.forEach((card) => {
        const label = String(card.displayValue).padStart(3, ' ');
        console.log(`                        ${label} (${card.value}${card.suit})`);
    });
    console.log("                 =======================\n");
}

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function checkCards(hand, selectedCards) {
    let i = 0;
    let j = 1;

    while (selectedCards[j]) {
        if (i >= hand.length)
            return 0;

        if (selectedCards[j] == hand[i].displayValue) {
            j++;
            i = 0;
        } else {
            i++;
        }
    }

    return 1;
}

function discardCards(hand, selectedCards, deck) 
{
    let i = 0;
    let j = 1;

    while (selectedCards[j]) 
    {
        if (i >= hand.length)
            return 0;

        if (selectedCards[j] == hand[i].displayValue) 
        {
            j++;
            hand.splice(i, 1);
            drawCards(deck, 1, hand);
            i = 0;
        } 
        else 
        {
            i++;
        }
    }

    return 1;
}

const {
    scoreCalculation
} = require("./scoreCalculation");



async function startBlind(hand, deck, hands, discards, ante, score) 
{
    while (score < ante && hands > 0) 
    {
        console.log(`\n\nDeck has ${deck.length} cards left.`);
        console.log(`Ante : ${ante}`);
        console.log(`Current score : ${score}`);
        showHand(hand);
        console.log(`Hands left: ${hands}\nDiscards left: ${discards}`);
 
        // Espera al input del jugador
        const input = await askQuestion("P = play hand     D = discard hand     EXIT = exit game\n");
        const selectedCards = input.trim().split(" ");
        const command = selectedCards[0];
        let i = 0;
        while (selectedCards[i])
            i++;

        if (command === "EXIT") {
            console.log("Exiting the game...");
            rl.close();
            return -1;
        }

        if (i > 1 && i <= 6 && checkCards(hand, selectedCards))    
        {
                if (command == "P") 
                {
                    hands--;
                    const cardsOnly = selectedCards.slice(1);
                    score += scoreCalculation(cardsOnly, hand);
                    discardCards(hand, selectedCards, deck);
                } 
            else if (command == "D") 
            {
                if (discards <= 0) 
                {
                    console.log("No discards left.\n");
                } 
                else 
                {
                    discards--;
                    console.log(`Discarding ${i - 1} cards from hand...`);
                    discardCards(hand, selectedCards, deck);
                }
            }
        }
        else if (i == 0 || command != "P" && command != "D" && command != "EXIT")
            console.log("[Command not found.]\n");
        else if (i == 1) 
            console.log("[No cards selected.]\n");
        else if (i > 6) 
            console.log("[Can't grab that many cards.]\n");
        else
            console.log("[One or more cards not found in hand.]\n");

        if (deck.length === 0) 
        {
            console.log("The deck is empty. Exiting the game...");
            rl.close();
            return -1;
        }
    }

    if (score >= ante) 
    {
        console.log("\n🎉🎉🎉 Congratulations! 🎉🎉🎉");
        console.log("╔════════════════════════╗");
        console.log("║    LEVEL CLEARED!      ║");
        console.log("╚════════════════════════╝");
        console.log(`You scored ${score} points and surpassed the ante of ${ante}!\n`);
        console.log("✨ On to the next challenge! ✨\n");
        return 1;
    }   
    else 
    {
        console.log("\n💀💀💀 GAME OVER 💀💀💀");
        console.log("╔════════════════════════╗");
        console.log("║      YOU LOST!         ║");
        console.log("╚════════════════════════╝");
        console.log(`You scored only ${score} points. The ante was ${ante}.\n`);
        console.log("☠️ Better luck next time! ☠️\n");
    return -1;
    }
}



function calculateBet(level) 
{
    const base = 300;
    const growth = 1.4; 

    let bet = base * Math.pow(growth, level - 1);

    return Math.round(bet / 100) * 100;
}


async function startState(hand, deck, bet) 
{
    let ante = 0;
    let playing = 1;

    while (ante <= 8) 
    {
        const deck = createDeck();
//        shuffleDeck(deck);
        const hand = [];
        let score = 0;
        drawCards(deck, 8, hand);
        playing = await startBlind(hand, deck, 5, 3, calculateBet(ante), score);
        if (playing == -1)
            break;
        //        shop();
        ante++;
    }
}

async function main() {
    const deck = createDeck();
    //    console.log(deck.length);
    /*    console.log("\n=========Unshuffled deck:=========\n");
        for (let card of deck)
        {
            console.log(card.showCard());
        }*/

    shuffleDeck(deck);
    /*    console.log("\n=========Shuffled deck:=========\n");
        for (let card of deck)
        {
            console.log(card.showCard());
        }*/

    //    console.log("\n=========Create hand:=========\n");

    const hand = [];
    let bet = 300;
    await startState(hand, deck, bet);
    rl.close();
}

main();