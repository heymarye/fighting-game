'use strict';

class Sprite {
    constructor({ position, imgSrc }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imgSrc;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.draw();
    }
}

class Fighter {
    constructor({ position, velocity, color = 'orange', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.color = color;
        this.lastKey = '';
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        //Attack Box
        if (this.isAttacking) {
            context.fillStyle = 'green';
            context.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
            );
        }
    }

    update() {
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
        } 
        else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}