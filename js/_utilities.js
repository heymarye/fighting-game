'use strict';

function rectangularCollision({ firstRectangle, secondRectangle }) {
    return (firstRectangle.attackBox.position.x + firstRectangle.attackBox.width >= secondRectangle.position.x && 
        firstRectangle.attackBox.position.x <= secondRectangle.position.x + secondRectangle.width &&
        firstRectangle.attackBox.position.y + firstRectangle.attackBox.height >= secondRectangle.position.y && 
        firstRectangle.attackBox.position.y <= secondRectangle.position.y + secondRectangle.height);
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Mack Wins!';
    }
    else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Kenji Wins!';
    }
    else {
        document.querySelector('#displayText').innerHTML = 'Tie!';
    }
}