
function straightFlush(selectedCards)
{

}

function fourKind(selectedCards)
{

}

function fullHouse(selectedCards)
{

}

function flush(selectedCards)
{

}

function straight(selectedCards)
{

}

function threeKind(selectedCards)
{

}

function twoPair(selectedCards)
{

}

function onePair(selectedCards)
{

}

function highCard(selectedCards)
{
    let maxValue = 0;
    let i = 1;

    console.log(`Card Value: ${selectedCards[i].numericValue}`);
    while(selectedCards[i])
    {
        if (selectedCards[i].numericValue > maxValue)
        {
            maxValue = selectedCards[i].numericValue;
        }
        i++;
    }
    return maxValue;
}

module.exports =
{
    straightFlush,
    fourKind,
    fullHouse,
    flush,
    straight,
    threeKind,
    twoPair,
    onePair,
    highCard
}