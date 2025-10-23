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
	// Create modal to display for rules & instructions
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.innerHTML = `
		<div class="modal-content">
			<span class="close-button">&times;</span>
			<div class="modal-header">
				<h2 style="text-align: center;">Rules & How to Play</h2>
				<p>Raining cats is a game inspired by the classic Connect Four, where players aim to connect four of their cats in a row vertically, horizontally, or diagonally.</p>
				<br>
				<p>The twist is that each player has access to 3 special abilities that can be used once per game to change the course of play.</p>
				<br>
				<h3>Special Abilities:</h3>
				<ul>
					<li><strong>Block:</strong> Drop a "block" chip onto the board that prevents either player from placing a chip in that spot. The block chip will rest on the first chip it hits, or the bottom of the board, and will stay the rest of the game.</li>
					<li><strong>Scratch:</strong> Removes 1 of your opponent's chips from the board.</li>
					<li><strong>Shake:</strong> Shakes the board, removing up to 3 chips randomly chosen on the board. Shake only removes chips that do not have other chips on top of them.</li>
				</ul>
			</div>
		</div>
	`;
	document.body.appendChild(modal);

	// Close modal when clicking on close button
	const closeButton = modal.querySelector('.close-button');
	closeButton.addEventListener('click', () => {
		modal.remove();
	});
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