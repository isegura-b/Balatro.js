

function strValue(cardStr, hand)
{
    for(let card of hand)
    {
        if (card.displayValue == cardStr)
            return card;
    }
    return null;
}

function counter(selectedCards, hand) //miro cuales se reiten tanto en valor como en palo
{
    const values = {};
    const suits = {};

    for (let stringCard of selectedCards)
    {
        let card = strValue(stringCard, hand);
        if (!card)
            continue;
        if (values[card.value])
            values[card.value]++;
        else
            values[card.value] = 1;

        if (suits[card.suit])
            suits[card.suit]++;
        else
            suits[card.suit] = 1;

    }
    return {
        values: values, 
        suits: suits
    }
}

function findCardByValue(value, hand) 
{
    for (let card of hand) 
    {
        if (card.value === value) 
            return card;
    }
    return null;
}

function getSortedNumericValues(selectedCards, hand) 
{
    let numbers = [];
    let i = 0;
    while (selectedCards[i]) 
    {
        let card = strValue(selectedCards[i], hand);
        if (card) numbers.push(card.numericValue);
        i++;
    }
    numbers.sort((a, b) => a - b);
    return numbers;
}


// Straight Flush
function straightFlush(selectedCards, hand) 
{
    const { suits } = counter(selectedCards, hand);

    for (let s in suits) 
    {
        if (suits[s] >= 5) 
        {
            let suitedCards = selectedCards.filter(c => strValue(c, hand).suit === s);
            if (straight(suitedCards, hand)) 
                return true;
        }
    }
    return false;
}
function straightFlushChips(selectedCards, hand) 
{
    const { suits } = counter(selectedCards, hand);
    let sKeys = Object.keys(suits);
    let i = 0;

    while (i < sKeys.length) 
    {
        let s = sKeys[i];
        if (suits[s] === 5)  // exacto, las 5 cartas del mismo palo
        {
            let sum = 0;
            let j = 0;
            while (j < selectedCards.length)
            {
                let card = strValue(selectedCards[j], hand);
                sum += card.numericValue;
                j++;
            }

            console.log(`chips : 100 + ${selectedCards.map(c => strValue(c, hand).numericValue).join(" + ")}`);
            return 100 + sum;
        }
        i++;
    }

    return 0;
}
function straightFlushMult(selectedCards)
{
    let mult = 8;
    console.log(`mult : ${mult}`);
    return mult;
}


// Four of a Kind
function fourKind(selectedCards, hand)
{
    const {values, suits} = counter(selectedCards, hand); //como devuelve un objeto, con dos propiedades, uso destructuring
    for (let v in values)
    {
        if (values[v] == 4)
            return v;
    }
    return null;
}
function fourKindChips(selectedCards, hand)
{
    const f = fourKind(selectedCards, hand);
    let card = findCardByValue(f, hand);
    console.log(`chips : 140 + ${card.numericValue} * 4`);
    return card.numericValue * 4 + 140;
}
function fourKindMult(selectedCards)
{
    let mult = 7;
    console.log(`mult : ${mult}`);
    return mult;
}


// Full House
function fullHouse(selectedCards, hand) {
    const { values } = counter(selectedCards, hand);

    let three = null;
    let pair = null;

    for (let v in values) 
    {
        if (values[v] >= 3) 
        {
            three = v;
            break;
        }
    }

    if (!three) 
    return null;


    for (let v in values) 
    {
        if (v !== three && values[v] >= 2) 
        {
            pair = v;
            break;
        }
    }

    if (!pair) 
        return null;

    return { three, pair };
}
function fullHouseChips(selectedCards, hand) 
{
    const fh = fullHouse(selectedCards, hand);

    let total = 40;
    const threeCard = findCardByValue(fh.three, hand);
    const pairCard = findCardByValue(fh.pair, hand);

    total += threeCard.numericValue * 3;
    total += pairCard.numericValue * 2;

    console.log(`chips : 40 + ${pairCard.numericValue}*2 + ${threeCard.numericValue}*3`);
    return total;
}
function fullHouseMult(selectedCards)
{
    let mult = 4;
    console.log(`mult : ${mult}`);
    return mult;
}


// Flush
function flush(selectedCards, hand)
{
    const {suits} = counter(selectedCards, hand);
    for (let s in suits)
    {
        if(suits[s] >= 5)
            return true;
    }
    return false;
}
function flushChips(selectedCards, hand)
{
    let total = 0;
    let output = "chips : 35";

    for (let flushCard of selectedCards)
    {
        let card = strValue(flushCard, hand);
        if (card)
        {
            output += ` + ${card.numericValue}`;
            total += card.numericValue;
        }
    }

    console.log(output);
    return total + 35;
}
function flushMult(selectedCards)
{
    let mult = 4;
    console.log(`mult : ${mult}`);
    return mult;
}

// Straight
function straight(selectedCards, hand) 
{
    let numbers = getSortedNumericValues(selectedCards, hand);

    if (numbers.includes(14) && numbers.includes(2)) 
    {
        numbers.push(1);
        numbers.sort((a, b) => a - b);
    }

    let i = 0;
    while (i <= numbers.length - 5) 
    {
        let isStraight = true;
        let j = 0;
        while (j < 4) 
        {
            if (numbers[i + j] + 1 !== numbers[i + j + 1]) 
            {
                isStraight = false;
                break;
            }
            j++;
        }
        if (isStraight) 
            return true;
        i++;
    }

    return false;
}

function straightChips(selectedCards, hand) 
{
    let numbers = getSortedNumericValues(selectedCards, hand);

    if (numbers.includes(14) && numbers.includes(2)) 
    {
        numbers.push(1);
        numbers.sort((a, b) => a - b);
    }

    let i = 0;
    while (i <= numbers.length - 5) 
    {
        let j = 0;
        let isStraight = true;
        while (j < 4) 
        {
            if (numbers[i + j] + 1 !== numbers[i + j + 1]) 
            {
                isStraight = false;
                break;
            }
            j++;
        }

        if (isStraight) 
        {
            let total = 0;
            let k = 0;
            while (k < 5) 
            {
                total += numbers[i + k];
                k++;
            }
            console.log(`chips : 30 + ${numbers.slice(i, i + 5).join(" + ")}`);
            return total + 30;
        }
        i++;
    }

    return 0;
}

function straightMult(selectedCards)
{
    let mult = 4;
    console.log(`mult : ${mult}`);
    return mult;
}

// Three of a Kind
function threeKind(selectedCards, hand)
{
    const {values} = counter(selectedCards, hand);
    for (let v in values)
    {
        if (values[v] == 3)
            return v;
    }
    return null;
}

function threeKindChips(selectedCards, hand)
{
    const t = threeKind(selectedCards, hand);
    let card = findCardByValue(t, hand);
    console.log(`chips : 30 + ${card.numericValue} * 3`);
    return card.numericValue * 3 + 30;
}

function threeKindMult(selectedCards)
{
    let mult = 3;
    console.log(`mult : ${mult}`);
    return mult;
}

// Two Pair
function twoPair(selectedCards, hand)
{
    const {values} = counter(selectedCards, hand);
    let pairCount = [];
    for (let v in values)
    {
        if (values[v] == 2)
            pairCount.push(v);
    }
    if (pairCount.length >= 2)
        return pairCount;
    else
        return null;
}
function twoPairChips(selectedCards, hand)
{
    const pairs = twoPair(selectedCards, hand);
    let total = 0;
    let output = "chips : 20";

    for (let val of pairs) 
    {
        const card = findCardByValue(val, hand);
        if (card)
        {
            total += card.numericValue * 2;
            output += ` + ${card.numericValue} * 2`;
        }
    }
    console.log(output);
    return total + 20;
}
function twoPairMult(selectedCards)
{
    let mult = 2;
    console.log(`mult : ${mult}`);
    return mult;
}


// One Pair
function onePair(selectedCards, hand)
{
    const {values} = counter(selectedCards, hand);
    for (let v in values)
    {
        if (values[v] == 2)
            return v;
    }
    return null;
}
function onePairChips(selectedCards, hand)
{
    const p = onePair(selectedCards, hand);
    let card = findCardByValue(p, hand);
    console.log(`chips : 10 + ${card.numericValue} * 2`);
    return card.numericValue * 2 + 10;
}
function onePairMult(selectedCards)
{
    let mult = 2;
    console.log(`mult : ${mult}`);
    return mult;
}

// High Card
function highCardChips(selectedCards, hand)
{
    let maxValue = 0;
    let i = 0;

    while(selectedCards[i])
    {
        let card = strValue(selectedCards[i], hand);
        if (card.numericValue > maxValue)
        {
            maxValue = card.numericValue;
        }
        i++;
    }
    return maxValue;
}

function scoreCalculation(selectedCards, hand) 
{
    let score = 0;
    let chips = 0;
    let mult = 0;


    if (straightFlush(selectedCards, hand))
    {
        chips = straightFlushChips(selectedCards, hand);
        mult = straightFlushMult(selectedCards);
        console.log("Straight Flush!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (fourKind(selectedCards, hand))
    {
        chips = fourKindChips(selectedCards, hand);
        mult = fourKindMult(selectedCards);
        console.log("Four of a Kind!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (fullHouse(selectedCards, hand))
    {
        chips = fullHouseChips(selectedCards, hand);
        mult = fullHouseMult(selectedCards);
        console.log("Full House!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (flush(selectedCards, hand))
    {
        chips = flushChips(selectedCards, hand);
        mult = flushMult(selectedCards);
        console.log("Flush!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (straight(selectedCards, hand))
    {
        chips = straightChips(selectedCards, hand);
        mult = straightMult(selectedCards);
        console.log("Straight!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (fullHouse(selectedCards, hand))
    {
        chips = fullHouseChips(selectedCards, hand);
        mult = fullHouseMult(selectedCards);
        console.log("Full House!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (threeKind(selectedCards, hand))
    {
        chips = threeKindChips(selectedCards, hand);
        mult = threeKindMult(selectedCards);
        console.log("Three of a Kind!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (twoPair(selectedCards, hand))
    {
        chips = twoPairChips(selectedCards, hand);
        mult = twoPairMult(selectedCards);
        console.log("Two Pair!");
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else if (onePair(selectedCards, hand))
    {
        chips = onePairChips(selectedCards, hand);
        mult = onePairMult(selectedCards);
        console.log("One Pair!"); 
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`+${score} points`);
        return score;
    }
    else// (highCard)
    {
        chips = highCardChips(selectedCards, hand);
        mult = 1;
        console.log("High Card!"); 
        console.log(`${chips} * ${mult}`);
        score = chips * mult;
        console.log(`High Card! +${score} points`);
        return score;
    }
}

module.exports =
{
    scoreCalculation
}