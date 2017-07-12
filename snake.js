const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
context.scale(15, 15);

const WIDTH = 80;
const HEIGHT = 40;

const contextColor = 'lightgreen';
const snakeColor = 'orange';
const foodColor = 'orange';

var snake = {};
var food = {x: 0, y: 0};
var playerDir = 'left';

function resetGame() {
	snake.pos = [
		{ x: WIDTH / 2, y: HEIGHT / 2}, 
		{ x: WIDTH / 2 + 1, y: HEIGHT / 2}, 
		{ x: WIDTH / 2 + 2, y: HEIGHT / 2}, 
		{ x: WIDTH / 2 + 3, y: HEIGHT / 2}, 
	],
	snake.dir = 'left';

	dropFood();
}

function dropFood() {
	food = { x: Math.floor(WIDTH * Math.random()), y: Math.floor(HEIGHT * Math.random()) };
}

function drawSnake() {
	context.fillStyle = contextColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawFood();

	context.fillStyle = snakeColor;
	snake.pos.forEach(point => {
		context.fillRect(point.x, point.y, 1, 1);			
	})
}

function drawFood() {
	context.fillStyle = foodColor;
	context.fillRect(food.x, food.y, 1, 1);	
}

function playerMove(dir) {
	playerDir = dir;
}

function changeDirection(){
	if ((playerDir === 'left' || playerDir === 'right') && (snake.dir === 'up' || snake.dir === 'down') ||
			(playerDir === 'up' || playerDir === 'down') && (snake.dir === 'left' || snake.dir === 'right'))
		snake.dir = playerDir;	
}

document.addEventListener('keydown', event => {
	if (event.keyCode === 37) {
		playerMove('left');
	} else if (event.keyCode === 38) {
		playerMove('up');
	} else if (event.keyCode === 39) {
		playerMove('right');
	} else if (event.keyCode === 40) {
		playerMove('down');
	} 
});

function moveSnake() {
	let head = snake.pos[snake.pos.length - 1];
	let dir = snake.dir;
	let newHead = {};

	if (dir === 'left') {
		newHead.x = head.x === 0 ? WIDTH - 1 : head.x - 1;
		newHead.y = head.y;
	} else if (dir === 'right') {
		newHead.x = (head.x + 1) % WIDTH;
		newHead.y = head.y;
	} else if (dir === 'up') {
		newHead.x = head.x;
		newHead.y = head.y === 0 ? HEIGHT - 1 : head.y - 1;
	} else if (dir === 'down') {
		newHead.x = head.x;
		newHead.y = (head.y + 1) % HEIGHT;
	}

	if (newHead.x === food.x && newHead.y === food.y) {
		snake.pos.push(food);
		dropFood();
		return;
	}	

	let tail = snake.pos.shift();
	if (snake.pos.some(point => point.x === newHead.x && point.y === newHead.y)) {
		console.log('collision -- game over');
		resetGame();
	}

	snake.pos.push(newHead);
}


let dropCounter = 0;
let dropInterval = 40;

let lastTime = 0;

function update(time = 0){
	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		moveSnake();
		dropCounter = 0;
	}
	changeDirection();	
	drawSnake();
	requestAnimationFrame(update);
}

resetGame();
update();
