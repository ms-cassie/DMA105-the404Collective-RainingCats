// Get HTML Elements
// Game Scenes
const mainMenu = document.getElementById('scene-main-menu');
const playerSelectScene = document.getElementById('scene-player-select');
const gameScene = document.getElementById('scene-game');
const gameOverScene = document.getElementById('scene-game-over');

// Main Menu Buttons
const playBtn = document.getElementById('btn-play-game');
const howToPlayBtn = document.getElementById('btn-how-to-play');
const audioToggleBtn = document.getElementById('btn-toggle-audio');

// Game State
let gameState = {
	numRainingCatChips: 0,
	numMaxRainingCatChips: 50,
	isGameRunning: false,
	isAudioEnabled: false,
	activeScene: 'mainMenu',
};

// Add Event Listeners
playBtn.addEventListener('click', () => {
	// Start game soundtrack if audio is enabled
	if (gameState.isAudioEnabled) {
		startSoundtrack();
	}

	// Start the game if not already running
	if (!gameState.isGameRunning) {
		gameState.isGameRunning = true;
		// mainMenu.style.display = 'none';
		// playerSelectScene.style.display = 'block';
		// gameState.activeScene = 'playerSelectScene';
	}

});

howToPlayBtn.addEventListener('click', () => {
	console.log('How to Play button clicked');
});

audioToggleBtn.addEventListener('click', () => {
	toggleAudio();
});

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
setInterval(createRainCatChips, 250);
setInterval(moveRainCatChips, 100);
setInterval(removeRainCatChips, 100);

// Audio controls
const soundtrack = new Audio('audio/soundtrack/soundtrack-1.mp3');

let toggleAudio = () => {
	// Check if audio is running
	if (gameState.isAudioEnabled) {
		soundtrack.pause();
	}

	// Check if game is running
	if (!gameState.isAudioEnabled && gameState.isGameRunning) {
		startSoundtrack();
	}

	// Toggle audio state
	gameState.isAudioEnabled = !gameState.isAudioEnabled;

	// Change button based on sound playing
	if (gameState.isAudioEnabled) {
		audioToggleBtn.innerText = 'Sound: On';
	} else {
		audioToggleBtn.innerText = 'Sound: Off';
	}
};

let startSoundtrack = (loop = true, volume = 0.1) => {
	soundtrack.loop = loop;
	soundtrack.volume = volume;
	soundtrack.play();
};