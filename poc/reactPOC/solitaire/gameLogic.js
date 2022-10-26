namespace("GameLogic",() => {
    const suits = { "C": "black", "D": "red", "H": "red", "S": "black" };
    const ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
    const oppositeColors = { "black": "red", "red": "black" };
    const splitCard = function(card) {
        if (card) {
            let lastIndex = card.length-1
            let suit = card.charAt(lastIndex);
            return [ranks.indexOf(card.slice(0,lastIndex)),suit];
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
                return acc.concat([buildCard(rank,suit)]);
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
    const buildInitState = function(drawCount) {
        return {
            drawCount,
            playing:false,
            winState:undefined,
            drawPile:[],
            hand:[],
            discard:[],
            goals:Object.keys(suits).reduce((out,suit) => {
                out[suit] = -1;
                return out;
            }, {}),
            columns:Array(7).fill("").map(() => {
                return { stack:[], chain:[] };
            }),
            from:undefined
        }
    }
    const cloneState = function(state) {
        const out = {};
        ['playing','winState','from'].forEach(k => {
            out[k] = state[k];
        });
        ['drawPile','hand','discard'].forEach(k => {
            out[k] = Array.from(state[k]);
        })
        out.goals = Object.entries(state.goals).reduce((goals,[k,v]) => {
            goals[k] = v;
            return goals;
        }, {});
        out.columns = state.columns.map(({ stack, chain }) => {
            return {
                stack: Array.from(stack),
                chain: Array.from(chain)
            }
        });
        return out;
    }
    const getFromToType = function(gameState, moveIndex,allowHand) {
        if ((typeof moveIndex) === "string" && (typeof gameState.goals[moveIndex]) === 'number') {
            return "goals";
        } else if ((typeof moveIndex) === "number") {
            if (gameState.columns[moveIndex]) {
                return "chain";
            } else if (moveIndex === -1 && allowHand) {
                return "hand";
            }
        }
        throw { moveIndex };
    }
    const getMoveType = function(fromType,toType) {
        if (fromType === toType) {
            if (fromType === "goals") {
                throw { fromType, toType };
            } else {
                return "chain";
            }
        }
        return "single";
    }
    const peek = {
        chain:function(gameState, columnIndex) {
            let chain = gameState.columns[columnIndex].chain;
            return splitCard(chain[chain.length - 1]);
        },
        hand:function(gameState, ) {
            if (gameState.hand.length > 0) {
                return splitCard(gameState.hand[gameState.hand.length - 1]);
            } else if (gameState.discard.length > 0) {
                return splitCard(gameState.discard[gameState.discard.length - 1]);
            } else {
                throw { empty: true };
            }
        },
        goals:function(gameState, suit) {
            return [gameState.goals[suit], suit];
        },
    };
    const isValidMove = {
        chain:function([fromRankIndex,fromSuit],toCard) {
            if (toCard) {
                let [toRankIndex,toSuit] = toCard;
                return fromRankIndex + 1 === toRankIndex && suits[fromSuit] === oppositeColors[suits[toSuit]];
            } else {
                return ranks[fromRankIndex] === 'K';
            }
        },
        goals:function([fromRankIndex,fromSuit],[toRankIndex,toSuit]) {
            return fromSuit === toSuit && fromRankIndex === 1 + toRankIndex;
        }
    };
    const push = {
        chain:function(gameState, [rankIndex, suit], columnIndex) {
            gameState.columns[columnIndex].chain.push(buildCard(ranks[rankIndex],suit));
        },
        goals:function(gameState, card, suit) {
            gameState.goals[suit]++;
        }
    };
    const pop = {
        chain:function(gameState) {
            gameState.columns[gameState.from].chain.pop();
        },
        hand:function(gameState) {
            if (gameState.hand.length > 0) {
                gameState.hand.pop();
            } else if (gameState.discard.length > 0) {
                gameState.discard.pop();
            } else {
                throw { empty: true };
            }
        },
        goals:function(gameState) {
            gameState.goals[gameState.from]--;
        }
    };
    const drawForChain = function(gameState) {
        let column = gameState.columns[gameState.from];
        if (column.chain.length === 0 && column.stack.length > 0) {
            column.chain.push(column.stack.pop());
        }
    }
    const updateWinState = function(gameState) {
        if (Object.values(gameState.goals).filter((i) => (i !== 12)).length === 0) {
            gameState.winState = "won";
        } else if (gameState.columns.filter(col => col.stack.length > 0).length === 0 && ['drawPile','discard','hand'].reduce((out,obj) => out && gameState[obj].length === 0 , true)) {
            gameState.winState = "auto";
        }
    }
    const move = function(gameState,to) {
        let fromType = getFromToType(gameState, gameState.from,true);
        let toType = getFromToType(gameState, to);
        let moveType = getMoveType(fromType, toType);
        let toCard = peek[toType](gameState, to);
        switch(moveType) {
            case "chain":
                let fromChain = gameState.columns[gameState.from].chain;
                let chainIndex = fromChain.length - 1;
                while(!isValidMove.chain(splitCard(fromChain[chainIndex]),toCard)) {
                    chainIndex--;
                }
                if (chainIndex < 0) {
                    throw { chainIndex };
                }
                let moveCount = fromChain.length - chainIndex;
                gameState.columns[to].chain = gameState.columns[to].chain.concat(gameState.columns[gameState.from].chain.splice(chainIndex,moveCount));
                break;
            default:
                let fromCard = peek[fromType](gameState, gameState.from);
                if (isValidMove[toType](fromCard,toCard)) {
                    pop[fromType](gameState);
                    push[toType](gameState,fromCard, to);
                } else {
                    throw {fromCard,toCard,toType}
                }
        }
        if (fromType === "chain") {
            drawForChain(gameState);
        }
        updateWinState(gameState);
        return gameState;
    }
    return { ranks, suits, getCardColor, buildDeck, shuffle, buildInitState, cloneState, move};
});