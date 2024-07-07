function DrawMaze(maze, ctx, cellSize, endSprite = null) {
    const map = maze.map();
    let drawEndMethod;

    ctx.lineWidth = cellSize / 40;

    function redrawMaze(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    }

    function drawCell(xCord, yCord, cell) {
        const x = xCord * cellSize;
        const y = yCord * cellSize;

        if (!cell.n) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (!cell.s) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (!cell.e) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (!cell.w) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndFlag() {
        const coord = maze.endCoord();
        const gridSize = 4;
        const fraction = cellSize / gridSize - 2;
        let colorSwap = true;

        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 === 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                }
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    function drawEndSprite() {
        const offsetLeft = cellSize / 50;
        const offsetRight = cellSize / 25;
        const coord = maze.endCoord();

        ctx.drawImage(
            endSprite,
            2,
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function clear() {
        const canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    drawEndMethod = endSprite ? drawEndSprite : drawEndFlag;
    clear();
    drawMap();
    drawEndMethod();

    return {
        redrawMaze
    };
}

function Player(maze, canvas, cellSize, onComplete, sprite = null) {
    const ctx = canvas.getContext("2d");
    let drawSprite;
    let moves = 0;

    drawSprite = drawSpriteCircle;

    if (sprite) {
        drawSprite = drawSpriteImg;
    }

    const map = maze.map();
    let cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    const halfCellSize = cellSize / 2;

    function redrawPlayer(newCellSize) {
        cellSize = newCellSize;
        drawSpriteImg(cellCoords);
    }

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();

        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            unbindKeyDown();
        }
    }

    function drawSpriteImg(coord) {
        const offsetLeft = cellSize / 50;
        const offsetRight = cellSize / 25;

        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );

        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            unbindKeyDown();
        }
    }

    function removeSprite(coord) {
        const offsetLeft = cellSize / 50;
        const offsetRight = cellSize / 25;

        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function checkMove(e) {
        const cell = map[cellCoords.x][cellCoords.y];
        moves++;

        switch (e.keyCode) {
            case 65:
            case 37: // west
                if (cell.w) {
                    removeSprite(cellCoords);
                    cellCoords = { x: cellCoords.x - 1, y: cellCoords.y };
                    drawSprite(cellCoords);
                }
                break;
            case 87:
            case 38: // north
                if (cell.n) {
                    removeSprite(cellCoords);
                    cellCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
                    drawSprite(cellCoords);
                }
                break;
            case 68:
            case 39: // east
                if (cell.e) {
                    removeSprite(cellCoords);
                    cellCoords = { x: cellCoords.x + 1, y: cellCoords.y };
                    drawSprite(cellCoords);
                }
                break;
            case 83:
            case 40: // south
                if (cell.s) {
                    removeSprite(cellCoords);
                    cellCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
                    drawSprite(cellCoords);
                }
                break;
        }
    }

    function bindKeyDown() 
    {
        window.addEventListener("keydown", checkMove);
    }

    function unbindKeyDown()
        {
        window.removeEventListener("keydown", checkMove);
    }

    bindKeyDown();

    return {
        redrawPlayer,
        unbindKeyDown
    };
}
