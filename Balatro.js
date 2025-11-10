class Card 
{
    constructor(value, suit)
    {
        this.value = value;
        this.suit = suit;
        this.numericValue = this.calculateNumericValue();
        this.displayValue = this.toDisplay();
    }

    calculateNumericValue()
    {
        if (this.value >= 2 && this.value <= 10)
            return this.value;
        else if (this.value == 'J' || this.value == 'Q' || this.value == 'K')
            return 10;
        else
            return 11;
    }

    showCard()
    {
        return `${this.value} of ${this.suit} (numeric value: ${this.numericValue}) displays as: ${this.displayValue}`;
    }

    toDisplay()
    {
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

function createDeck()
{
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    let suitIndex = 0;
    while (suitIndex < suits.length)
    {
        let valueIndex = 0;
        while (valueIndex < values.length)
        {
            const card = new Card(values[valueIndex], suits[suitIndex]);
            deck.push(card);                     //  Agrega la carta al array baraja
            valueIndex++;
        }
        suitIndex++;
    }
    return deck;
}

function shuffleDeck(deck) 
{
    let i = deck.length - 1;
    while (i > 0) 
    {
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
    console.log("\n                 ==== Cards in hand ====");
    hand.forEach((card, index) => {
        const label = String(card.displayValue).padStart(3, ' ');
        console.log(`                      ${label} (${card.value} of ${card.suit})`);
    });
    console.log("                 =======================\n");
}

const readline = require("readline");

const rl = readline.createInterface(
{
    input: process.stdin,
    output: process.stdout
}
);

function startGame(deck, hand)
{
    console.log(`\nCards remaining in the deck: ${deck.length}`);
    rl.question("P = play hand     D = discard hand     EXIT = exit game\n", input =>
    {
        const splitInput = input.trim().split(" ");
        const command = splitInput[0];
        
        let i = 0;
        while (splitInput[i])
            i++;
        if (i > 1 && i <= 6/* && checkcards(hand, splitInput)*/)
        {
            if(command == "P")
            {
                console.log("Playing hand");
            }
            else if(command == "D")
            {
                console.log(`Discarding ${i} cards from hand...`);
                startGame(deck, hand);
            }
            else
            {
                console.log("[Command not found.]\n\n\n\n");
                showHand(hand);
                console.log("P = play hand     D = discard hand     EXIT = exit game\n");
                startGame(deck, hand);
            }
            if (deck.length == 0) // Aqui tenemos que poner la condicion de que ha superado
            {
                console.log("The deck is empty. Exiting the game...");
                rl.close();
            }
//          else if () // Se ha quedado sin manos y ha perdido
        }
        else if(command == "EXIT")
        {
            console.log("Exiting the game...");
            rl.close();
        }
        else if(i == 0)
        {
            console.log("[No command found.]\n\n\n\n");
            showHand(hand);
            console.log("P = play hand     D = discard hand     EXIT = exit game\n");
            startGame(deck, hand);
        }
        else if(i == 1)
        {
            console.log("[No cards selected.]\n\n\n\n");
            showHand(hand);
            console.log("P = play hand     D = discard hand     EXIT = exit game\n");
            startGame(deck, hand);
        }
        else if(i > 5)
        {
            console.log("[Can't grab that many cards.]\n\n\n\n");
            showHand(hand);
            console.log("P = play hand     D = discard hand     EXIT = exit game\n");
            startGame(deck, hand);
        }
        else
        {
            console.log("\n\n[One or more cards not found in hand.]\n");
            showHand(hand);
            console.log("P = play hand     D = discard hand     EXIT = exit game\n");
            startGame(deck, hand);
        }
    });
}

function main()
{
    const deck = createDeck();
    console.log(deck.length);
    console.log("\n=========Unshuffled deck:=========\n");
    for (let card of deck)
    {
        console.log(card.showCard());
    }

    shuffleDeck(deck);
    console.log("\n=========Shuffled deck:=========\n");
    for (let card of deck)
    {
        console.log(card.showCard());
    }

    console.log("\n=========Create hand:=========\n");

    const hand = [];
    console.log("\n=========Draw cards:=========\n");
    drawCards(deck, 8, hand);
    showHand(hand);
    startGame(deck, hand);
}

main();