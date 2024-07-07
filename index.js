const player = document.getElementById('player');
const goal = document.getElementById('goal');
const obstacles = Array.from(document.getElementsByClassName('obstacle'));
const container = document.getElementById('gameContainer');


let playerPos = { top: 10, left: 10 };


document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': movePlayer(-10, 0); break;
        case 'ArrowDown': movePlayer(10, 0); break;
        case 'ArrowLeft': movePlayer(0, -10); break;
        case 'ArrowRight': movePlayer(0, 10); break;
    }

    if (checkCollision(player, goal)) {
        alert('You Win!');
        resetGame();
    }

    obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            alert('Game Over!');
            resetGame();
        }
    });
});



function movePlayer(topChange, leftChange) {
    playerPos.top += topChange;
    playerPos.left += leftChange;
    player.style.top = playerPos.top + 'px';
    player.style.left = playerPos.left + 'px';
    keepInBounds();
}



function keepInBounds() {
    if (playerPos.top < 0) playerPos.top = 0;
    if (playerPos.left < 0) playerPos.left = 0;
    if (playerPos.top > container.clientHeight - player.clientHeight) 
        playerPos.top = container.clientHeight - player.clientHeight;
    if (playerPos.left > container.clientWidth - player.clientWidth) 
        playerPos.left = container.clientWidth - player.clientWidth;
    player.style.top = playerPos.top + 'px';
    player.style.left = playerPos.left + 'px';
}



function checkCollision(rect1, rect2) {
    const r1 = rect1.getBoundingClientRect();
    const r2 = rect2.getBoundingClientRect();
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}



function resetGame() {
    playerPos = { top: 10, left: 10 };
    player.style.top = playerPos.top + 'px';
    player.style.left = playerPos.left + 'px';
    randomizeObstacles();
}



function randomizeObstacles() {
    obstacles.forEach(obstacle => {
        const top = Math.floor(Math.random() * (container.clientHeight - obstacle.clientHeight));
        const left = Math.floor(Math.random() * (container.clientWidth - obstacle.clientWidth));
        obstacle.style.top = top + 'px';
        obstacle.style.left = left + 'px';
    });
}




randomizeObstacles();
