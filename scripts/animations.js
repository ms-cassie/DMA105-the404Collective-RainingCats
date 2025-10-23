// Global variables for animation intervals
let intervalIdCreateCatRain;
let intervalIdMoveCatRain;
let intervalIdRemoveCatRain;
let intervalIdMenuAnimation;

// Add check for game state, only play during main menu & player select scenes
let checkGameStateForAnimations = () => {
	if (gameState.activeScene === 'game' || gameState.activeScene === 'gameOver') {
		// Stop animations if not in main menu or player select
		clearInterval(intervalIdCreateCatRain);
		clearInterval(intervalIdMenuAnimation);
	}

	if (gameState.activeScene !== 'mainMenu' && gameState.numRainingCatChips === 0) {
		// Also clear move/remove intervals if no cat chips are left
		clearInterval(intervalIdMoveCatRain);
		clearInterval(intervalIdRemoveCatRain);
	}
};

setInterval(checkGameStateForAnimations, 1000);

// Rain Cat Chips in background (Main Menu only)
const createRainCatChips = () => {
	// Limit the number of cat chips on screen
	if (gameState.numRainingCatChips >= gameState.numMaxRainingCatChips) {
		return;
	}

	// Create raining cat chips & add to the DOM
	const catChip = document.createElement('div');
	catChip.classList.add('raining-cat-chip');

	// Randomize which cat chip image to use
	const chipType = Math.floor(Math.random() * 12) + 1;
	if (chipType < 6) {
		catChip.style.backgroundImage = `url("./images/cat-chips/catchip-blue-${chipType}.png")`;
	} else if (chipType > 6) {
		let num = Math.ceil(chipType / 2);
		catChip.style.backgroundImage = `url("./images/cat-chips/catchip-red-${num}.png")`;
	}

	document.body.appendChild(catChip);
	gameState.numRainingCatChips += 1;

	// Randomize starting position
	catChip.style.left = Math.random() * 100 + 'vw';

	// Initialize vertical position for transform-based movement
	catChip.dataset.y = '-50';

	// Give each chip a random rotation and persist it
	const rotation = (Math.random() * 60) - 60; // -60deg to +60deg
	catChip.dataset.rot = rotation.toFixed(1);
	catChip.style.transform = `translateY(${catChip.dataset.y}px) rotate(${catChip.dataset.rot}deg)`;
};

const moveRainCatChips = () => {
	// Move cat chips down the screen
	const catChips = document.querySelectorAll('.raining-cat-chip');
	catChips.forEach((chip) => {
		// Use our tracked value rather than offsetTop (which ignores transforms)
		const currentY = parseFloat(chip.dataset.y || '-50');
		const nextY = currentY + 100; // fall speed per tick
		chip.dataset.y = String(nextY);

		// Rotation
		const rot = parseFloat(chip.dataset.rot || '0');
		chip.style.transform = `translateY(${nextY}px) rotate(${rot}deg)`;
	});
};

const removeRainCatChips = () => {
	// Remove cat chips that have fallen off the screen
	const catChips = document.querySelectorAll('.raining-cat-chip');
	catChips.forEach((chip) => {
		const chipRect = chip.getBoundingClientRect();
		if (chipRect.top > window.innerHeight) {
			chip.remove();
			gameState.numRainingCatChips -= 1;
		}
	});
};

// Start the background rain on the main menu
intervalIdCreateCatRain = setInterval(createRainCatChips, 250);
intervalIdMoveCatRain = setInterval(moveRainCatChips, 100);
intervalIdRemoveCatRain = setInterval(removeRainCatChips, 100);

// Timers to add/remove the animate-menu class to the main menu
const mainMenuContent = document.querySelector('#menu-content');
const chipSelectContent = document.querySelector('#chip-select-content');

let animateMenu = () => {

	if (mainMenuContent.classList.contains('animate-menu')) {
		mainMenuContent.classList.remove('animate-menu');
	} else {
		mainMenuContent.classList.add('animate-menu');
	}

	if (chipSelectContent.classList.contains('animate-menu')) {
		chipSelectContent.classList.remove('animate-menu');
	} else {
		chipSelectContent.classList.add('animate-menu');
	}
};

intervalIdMenuAnimation = setInterval(animateMenu, 500);