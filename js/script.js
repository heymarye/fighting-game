'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './assets/background.png'
});

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imgSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 154
    },
    imgSrc: './assets/mack/idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imgSrc: './assets/mack/idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './assets/mack/run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './assets/mack/jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './assets/mack/fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './assets/mack/attack1.png',
            framesMax: 6
        }
    }
});

const enemy = new Fighter({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 169
    },
    imgSrc: './assets/kenji/idle.png',
    scale: 2.5,
    framesMax: 4,
    sprites: {
        idle: {
            imgSrc: './assets/kenji/idle.png',
            framesMax: 4
        },
        run: {
            imgSrc: './assets/kenji/run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './assets/kenji/jump.png',
            framesMax: 2
        },
        fall: {
            imgSrc: './assets/kenji/fall.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './assets/kenji/attack1.png',
            framesMax: 4
        }
    }
});

const keys = {
    //Player Keys
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    //Enemy Keys
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case 's':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();
    player.update();
    enemy.update();

    //Player Movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') { 
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    else {
        player.switchSprite('idle');
    }

    //Enemy Movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }
    else {
        enemy.switchSprite('idle');
    }

    //Detect for Collision
    if (rectangularCollision({ firstRectangle: player, secondRectangle: enemy }) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }
    else if (rectangularCollision({ firstRectangle: enemy, secondRectangle: player }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    //End of The Game Based on Health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();
decreaseTimer();