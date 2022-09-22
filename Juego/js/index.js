const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'assets/FONDO.png'
})


const shop = new Sprite({
    position: {
        x: 100,
        y: 162,
    },
    imageSrc: 'assets/shop.png',
    scale: 2.75,
    framesMax: 6
})


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
        x: 0,
        y: 0
    },
    imageSrc: 'assets/jugador/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 150,
        y: 120
    },
    sprites: {
        idle: {
            imageSrc: 'assets/jugador/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: 'assets/jugador/Run.png',
            framesMax: 8
            
        },
        jump: {
            imageSrc: 'assets/jugador/Jump.png',
            framesMax: 2
            
        },
        fall: {
            imageSrc: 'assets/jugador/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: 'assets/jugador/Attack1.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset:{
            x: 59,
            y:50,
        },
        width: 110,
        height: 50
    }

})



const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: 'assets/enemigo/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 150,
        y: 174
    },
    sprites: {
        idle: {
            imageSrc: 'assets/enemigo/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: 'assets/enemigo/Run.png',
            framesMax: 8
            
        },
        jump: {
            imageSrc: 'assets/enemigo/Jump.png',
            framesMax: 2
            
        },
        fall: {
            imageSrc: 'assets/enemigo/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: 'assets/enemigo/Attack1.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset:{
            x: -100,
            y:50,
        },
        width: 140,
        height: 50
    }   
})



console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()

    shop.update()

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player MOVEMENT
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0 ){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy MOVEMENT
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }
    if (enemy.velocity.y < 0 ){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    

    // DETECTAR COLISION
    if (ColisionRectangular({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // IF PLAYER MISSES

    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false
    }

    if (ColisionRectangular({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('enemy hit')
    }

    // IF PLAYER MISSES

    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // TERMINAR EL JUEGO BASADO EN VIDA
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break

        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break

        case 'ArrowUp':
            enemy.velocity.y = -20
            break

        case 'ArrowDown':
            enemy.attack()
            break

    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }

})