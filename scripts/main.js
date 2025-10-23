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

	// Start game soundtrack if audio is enabled
	if (gameState.isAudioEnabled) {
		startSoundtrack();
	}
});

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