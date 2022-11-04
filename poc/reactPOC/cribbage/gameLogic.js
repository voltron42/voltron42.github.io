namespace("GameLogic",() => {
    const suits = { "C": "black", "D": "red", "H": "red", "S": "black" };
    const ranks = [ ["A", 1, 1, 14], 2, 3, 4, 5, 6, 7, 8, 9, 10, ["J", 10, 11], ["Q", 10, 12], ["K", 10, 13] ];
    const getRankLabel = function(index) {
        const rank = ranks[index];
        if (Array.isArray(rank)) {
            return rank[0];
        }
        return `${rank}`;
    }
    const splitCard = function(card) {
        if (card) {
            let lastIndex = card.length-1
            let suit = card.charAt(lastIndex);
            let rank = ranks.indexOf(card.slice(0,lastIndex));
            if (Array.isArray(rank)) {
                return { rank: Array.from(rank), suit };
            } else {
                return { rank: [rank.toString(), rank, rank], suit };
            }
        }
    }
    const getCardColor = function(card) {
        const [,suit] = splitCard(card);
        return suits[suit];
    }
    const buildCard = function(rank,suit) {
        return `${rank}${suit}`;
    }
    const buildDeck = function() {
        return Object.keys(suits).reduce((out,suit) => {
            return ranks.reduce((acc,rank) => {
                return acc.concat([buildCard(getRankLabel(rank),suit)]);
            },out);
        },[]);
    }
    const shuffle = function(deck) {
        deck = Array.from(deck);
        let out = [];
        while(deck.length > 0) {
            let index = Math.floor(Math.random() * deck.length);
            out.push(deck[index]);
            deck.splice(index,1);
        }
        return out;
    }
    const dealHands = function(deck) {
        const dealerHand = [], otherHand = [];
        for ( let i = 0; i < 6; i++ ) {
            otherHand.push(deck.shift());
            dealerHand.push(deck.shift());
        }
        return { dealerHand, otherHand, topCard: deck.pop() };
    }
    const applyScoringEvent = function(score, scoreLog, points, message, ...cards) {
        return [score + points, [].concat(scoreLog,[{message, cards}])];
    }
    const calcHandScore = function(hand) {
        // todo
    }
    const submitCpuCrib = function(hand) {
        const cpuHand = Array.from(hand);
        const cpuCrib = [];
        // todo
        return { cpuHand, cpuCrib };
    }
    const scorePlay = function(played,card) {
        // todo
    };
    const cpuSelectCardToPlay = function(topCard, played, hand) {
        // todo
    }
    const isJack = function(card) {
        // todo
    }
    const buildInitState = function() {
        return {
            playerScore: 0,
            cpuScore: 0,
            isCPUDealer: false
        };
    }
    return { splitCard, getCardColor, buildDeck, shuffle, dealHands, calcHandScore, submitCpuCrib, scorePlay,
        cpuSelectCardToPlay, applyScoringEvent, isJack, buildInitState };
});