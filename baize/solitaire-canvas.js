(function (){
    window.SolitaireCanvas = function(canvasId,deck) {
        let canvas = document.getElementById(canvasId);
        let canvasState = {};
        let applyAttrs = function(xml,attrs,linkAttrs) {
            Object.entries(attrs).forEach(([k,v]) => {
                xml[1][k] = v;
            })
            if (linkAttrs) {
                return applyAttrs(['a',{href:"#"},xml],linkAttrs);
            } else {
                return xml;
            }
        }
        let applyCoordinates = function(x,y,cardXml) {
            cardXml[1].x = x;
            cardXml[1].y = y;
            return cardXml;
        }
        let applyLinkAndCoordinates = function(x,y,onclick,xml) {
            xml[1].x = x;
            xml[1].y = y;
            xml[1].onclick = onclick
            return xml;
        }
        let redraw = function() {
            let board = [];
            board.push('g');
            let padding = 6;
            let [ cardWidth, cardHeight ] = [57,88];
            let [ width, height ] = [461,614];
            let stepX = cardWidth + padding;
            let boardOffsetY = cardHeight + 2 * padding;
            let stackOffsetY = 4;
            let chainOffsetY = 32;
            let goalOffsetX = padding + 3 * stepX;
            let handOffsetX = padding + cardWidth + padding;
            let cardOffsetX = 22
            board.push(applyAttrs((canvasState.game.canDraw() ? deck.useCardBack() : deck.useEmptyPile()),{x:padding,y:padding}, {onclick:'draw(event)'}));
            let hand = canvasState.game.getHand();
            let discard = canvasState.game.getLastDiscard();
            if (hand.length > 0) {
                hand.forEach((card,index) => {
                    board.push(applyAttrs(deck.useCard(card),{
                        x:(handOffsetX + (index * cardOffsetX)),
                        y:padding
                    }, {onclick:'selectHand(this,event)'}));
                });
            } else if (discard) {
                board.push(applyAttrs(deck.useCard(discard),{x:handOffsetX,y:padding}, {onclick:'selectHand(this,event)'}));
            }
            deck.getSuits().forEach((suit,index) => {
                let rank = deck.getRanks()[canvasState.game.getGoals()[suit]];
                board.push(applyAttrs((rank?deck.useCard(rank+suit):deck.useGhostCard(suit)),{
                    x:(goalOffsetX + index * stepX),y:padding
                }, {
                    onclick:`selectGoal('${suit}',this,event)`
                }))
            });
            canvasState.game.getBoard().forEach((column, columnIndex) => {
                let x = (padding + (columnIndex * stepX));
                let y = boardOffsetY;
                let onclick = `selectColumn(${columnIndex},this,event)`;
                if (column.stackSize > 0 || column.chain.length > 0) {
                    for (let i = 0; i < column.stackSize; i++) {
                        board.push(applyAttrs(deck.useCardBack(),{x,y}, {onclick}));
                        y += stackOffsetY;
                    }
                    column.chain.forEach((chainLink) => {
                        board.push(applyAttrs(deck.useCard(chainLink),{x,y}, {onclick}));
                        y += chainOffsetY;
                    });
                } else {
                    board.push(applyAttrs(deck.useEmptyPile(),{x,y}, {onclick}));
                }
            });
            canvas.innerHTML = new jHiccup([
                "svg",
                { width: "100%", height: "200%", viewBox: `0 0 ${width} ${height}`},
                ["rect", {width,height,fill:"none",stroke:"black","stroke-width":"4"}],
                board
            ]).toString();
        }
        this.newGame = function(draw1Q) {
            canvasState.game = new Solitaire(draw1Q);
            canvasState.game.initGame();
            redraw();
        }
        this.draw = function() {
            canvasState.game.drawHand();
            redraw();
        }
        let selectOrMove = function(selection,target) {
            if (canvasState.from) {
                try {
                    canvasState.game.move(canvasState.from.selection,selection);
                } catch (e) {
                    console.log(e);
                } finally {
                    delete canvasState.from;
                }
            } else {
                canvasState.from = {selection,target};
            }
            redraw();
        }
        this.selectHand = function(target) {
            selectOrMove(-1,target);
        }
        this.selectColumn = function(columnIndex,target) {
            selectOrMove(columnIndex,target);
        }
        this.selectGoal = function(suit,target) {
            selectOrMove(suit,target);
        }
    }
    SolitaireCanvas.init = function(canvasId,deck,initDraw1Q) {
        let solitaireCanvas = new SolitaireCanvas(canvasId,deck);
        window.newGame = function(draw1Q,e) {
            if (e) e.preventDefault();
            solitaireCanvas.newGame(draw1Q);
        }
        window.draw = function(e) {
            if (e) e.preventDefault();
            solitaireCanvas.draw();
        }
        window.selectHand = function(target,e) {
            if (e) e.preventDefault();
            solitaireCanvas.selectHand(target);
        }
        window.selectColumn = function(columnIndex,target,e) {
            if (e) e.preventDefault();
            solitaireCanvas.selectColumn(columnIndex,target);
        }
        window.selectGoal = function(suit,target,e) {
            if (e) e.preventDefault();
            solitaireCanvas.selectGoal(suit,target);
        }
        solitaireCanvas.newGame(initDraw1Q);
    }
})();