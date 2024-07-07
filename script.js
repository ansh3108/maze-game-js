function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}



function shuffleArray(array)
 {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



function adjustBrightness(factor, image)
 {
    const virtualCanvas = document.createElement("canvas");
    virtualCanvas.width = 500;
    virtualCanvas.height = 500;
    const context = virtualCanvas.getContext("2d");
    context.drawImage(image, 0, 0, 500, 500);

    const imageData = context.getImageData(0, 0, 500, 500);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * factor;
        data[i + 1] = data[i + 1] * factor;
        data[i + 2] = data[i + 2] * factor;
    }
    context.putImageData(imageData, 0, 0);

    const brightenedImage = new Image();
    brightenedImage.src = virtualCanvas.toDataURL();
    return brightenedImage;
}



function showVictoryMessage(moves) 
{
    document.getElementById("moves").innerText = `You Moved ${moves} Steps.`;
    toggleVisibility("Message-Container");
}


function toggleVisibility(id) 
{
    const element = document.getElementById(id);
    element.style.visibility = element.style.visibility === "visible" ? "hidden" : "visible";
}



function Maze(width, height)
 {
    let mazeMap;
    const startCoord = {};
    const endCoord = {};
    const directions = ["n", "s", "e", "w"];
    const modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };

    this.map = function() {
        return mazeMap;
    };
    this.startCoord = function() {
        return startCoord;
    };
    this.endCoord = function() {
        return endCoord;
    };

    function generateMap() {
        mazeMap = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
            n: false,
            s: false,
            e: false,
            w: false,
            visited: false,
            priorPos: null
        })));
    }



    function carveMaze() 
    {
        let completed = false;
        let moved = false;
        let cellsVisited = 1;
        let pos = { x: 0, y: 0 };
        const totalCells = width * height;
        let loopCount = 0;
        let maxLoops = 0;

        while (!completed) {
            moved = false;
            mazeMap[pos.x][pos.y].visited = true;

            if (loopCount >= maxLoops) {
                shuffleArray(directions);
                maxLoops = Math.round(getRandomInt(height / 8));
                loopCount = 0;
            }
            loopCount++;
            
            for (const direction of directions) {
                const nx = pos.x + modDir[direction].x;
                const ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !mazeMap[nx][ny].visited) {
                    mazeMap[pos.x][pos.y][direction] = true;
                    mazeMap[nx][ny][modDir[direction].o] = true;
                    mazeMap[nx][ny].priorPos = pos;
                    pos = { x: nx, y: ny };
                    cellsVisited++;
                    moved = true;
                    break;
                }
            }

            if (!moved) {
                pos = mazeMap[pos.x][pos.y].priorPos;
            }

            if (cellsVisited === totalCells) {
                completed = true;
            }
        }
    }



    function setStartAndEnd() 
    {
        const options = [
            { start: { x: 0, y: 0 }, end: { x: height - 1, y: width - 1 } },
            { start: { x: 0, y: width - 1 }, end: { x: height - 1, y: 0 } },
            { start: { x: height - 1, y: 0 }, end: { x: 0, y: width - 1 } },
            { start: { x: height - 1, y: width - 1 }, end: { x: 0, y: 0 } }
        ];

        const choice = options[getRandomInt(4)];
        Object.assign(startCoord, choice.start);
        Object.assign(endCoord, choice.end);
    }

    generateMap();
    setStartAndEnd();
    carveMaze();
}
