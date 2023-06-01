namespace('snake.Snake',{},() => {
    const config = {
        cellSize: 20,
        head:{
            points:[[10,0],[2,20],[10,15],[18,20]],
            matricies:{
                up:[[1,0,0],[0,1,0]],
                down:[[1,0,0],[0,-1,20]],
                left:[[0,1,0],[1,0,0]],
                right:[[0,1,0],[-1,0,20]],
            }
        },
        colors: {
            bg: "green",
            snake: "blue",
            apple: "red"
        }
    };
    const matrixMath = function(points,[[xx,yx,px],[xy,yy,py]]) {
        return points.map(([x,y]) => {
            return [((xx * x) + (yx * y) + px),((xy * x) + (yy * y) + py)];
        })
    }
    const directions = {
        right: [-1, 0, "left"],
        left: [1, 0, "right"],
        up: [0, -1, "down"],
        down: [0, 1, "up"],
    }
    const directionKeys = {
        "ArrowUp":"up",
        "ArrowDown":"down",
        "ArrowLeft":"left",
        "ArrowRight":"right",
    }
    const coordKey = function(x,y) {
        return [x,y].join(",");
    }
    const buildCoords = function(width, height) {
        const coords = {};
        for(let x = 0; x < width; x++) {
            for(let x = 0; x < width; x++) {
                coords[coordKey(x,y)] = [x,y];
            }
        }
        return coords;
    }
    const placeApple = function(coords, snake) {
        const snakeCoords = snake.map(([x,y]) => coordKey(x,y));
        const openCoords = Object.keys(coords).filter((k) => snakeCoords.indexOf(k) === -1);
        return coords[openCoords[Math.floor(Math.random() * openCoords.length)]];
    }
    const buildSnake = function(width, height, coords, snakeLength) {
        const head = placeApple(coords,[]);
        const dirDists = {
            up:head[1],
            left:head[0],
            down:(height - head[1]),
            right:(width - head[0])
        }
        const [tailDirection, startingDirection] = Object.entries(dirDists).reduce((out,[dir,dist]) => {
            if (dist > snakeLength) {
                out.push(dir);
            }
            return out;
        }, []);
        const snake = [head];
        const [tx,ty] = directions[tailDirection];
        while(snake.length < snakeLength) {
            let [x,y] = snake[snake.length - 1];
            snake.push([ x + tx, y + ty ])
        }
        return { snake, direction: startingDirection }
    }
    const getSnakeHead = function(directionKey) {
        return matrixMath(config.head.points,config.head.matricies[directionKey]);
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            const [ width, height, snakeLength, timeDelay] = [ 10, 10, 5, 1000 ];
            const coords = buildCoords(width, height)
            const { snake, direction } = buildSnake(width, height, snakeLength);
            const apple = placeApple(coords, snake);
            this.state = {
                width,
                height,
                snakeLength,
                timeDelay,
                direction,
                snake,
                apple
            };
            document.addEventListener("keyhold",(({ detail }) => {
                const direction = directionKeys[detail.code];
                if (direction) {
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                    }
                    this.setState({ direction });
                }
            }));
        }
        componentDidUpdate() {
            this.afterRender();
        }
        componentDidMount(){
            this.afterRender();
        }
        afterRender() {
            // todo
            // enqueue direction plus peek first
            // check collision with apple
            // if apple decriment delay
            // if no apple then drop last
            // check collision with walls 
            // if walls then wrap
            // check collision with snake body
            // if collision then end game
            // else setTimeout for setState
        }
        render() {
            const halfCell = config.cellSize / 2;
            const { width, height } = this.state;
            const [fullWidth, fullHeight] = [width, height].map(n => n * config.cellSize)
            return <div className="d-flex flex-column justify-content-center">
                <h1 className="text-center">Snake</h1>
                <div className="d-flex justify-content-center">
                    <svg width="60%" height="60%" viewBox={`0 0 ${fullWidth} ${fullHeight}`}>
                        <rect width={fullWidth} height={fullHeight} fill={config.colors.bg} stroke="none"/>
                        <polyline points={this.state.snake.map(([x,y]) =>  coordKey(x + halfCell, y + halfCell )).join(" ")} stroke={config.colors.snake} stroke-width={halfCell} fill="none"/>
                        <circle cx={this.state.apple[0]} cy={this.state.apple[1]} r={halfCell} fill={config.colors.apple} stroke="none"/>
                        <polygon points={getSnakeHead(this.state.direction)} fill={config.colors.snake} stroke="none"/>
                    </svg>
                </div>
            </div>;
        }
    };
});