// Get HTML Elements
// Game Scenes
const mainMenu = document.getElementById('scene-main-menu');
const chipSelectScene = document.getElementById('scene-chip-select');
const gameScene = document.getElementById('scene-game');
const gameOverScene = document.getElementById('scene-game-over');

// Main Menu Buttons
const playBtn = document.getElementById('btn-play-game');
const howToPlayBtn = document.getElementById('btn-how-to-play');
const audioToggleBtns = document.querySelectorAll('.btn-toggle-audio');

// All buttons
const allButtons = document.querySelectorAll('.btn-sound');

// Chip Select Elements
const playerPrompt = document.getElementById('chip-options').children[0];
const startGameBtn = document.getElementById('btn-start-game');

// Game State
let gameState = {
	numRainingCatChips: 0,
	numMaxRainingCatChips: 50,
	isGameRunning: false,
	isAudioEnabled: false,
	activeScene: 'mainMenu',
	player1Select: false,
	player2Select: false,
	player1Chip: null,
	player2Chip: null,
};

// Audio Soundtrack controls
const soundtrack = new Audio('/DMA105-the404Collective-RainingCats/audio/soundtrack/soundtrack-1.mp3');

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
	for (let audioToggleBtn of audioToggleBtns) {
		if (gameState.isAudioEnabled) {
			audioToggleBtn.innerText = 'Sound: On';
		} else {
			audioToggleBtn.innerText = 'Sound: Off';
		}
	}
};

let startSoundtrack = (loop = true, volume = 0.1) => {
	soundtrack.loop = loop;
	soundtrack.volume = volume;
	soundtrack.play();
};

// Add Event Listeners
playBtn.addEventListener('click', () => {
	// Start game soundtrack if audio is enabled
	if (gameState.isAudioEnabled) {
		startSoundtrack();
	}

	// Move to the next scene
	mainMenu.style.display = 'none';
	chipSelectScene.style.display = 'block';
	gameState.activeScene = 'chipSelectScene';

	// Set player 1 select to true
	gameState.player1Select = true;
});

howToPlayBtn.addEventListener('click', () => {
	// Create modal to display for rules & instructions
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.innerHTML = `
		<div class="modal-content">
			<span class="close-button">&times;</span>
			<div class="modal-header">
				<h2 style="text-align: center;">Rules & How to Play</h2>
				<p>Raining cats is a game inspired by the classic Connect Four, where players aim to connect four of their cats in a row vertically, horizontally, or diagonally.</p>
				<p>The twist is that each player has access to 3 special abilities that can be used once per game to change the course of play.</p>
				<h3>Controls:</h3>
				<p>Use the arrow keys ← and → to move the chip to the left or right, and spacebar  to drop the chip.</p>
				<h3>Special Abilities:</h3>
				<ul>
					<li><strong>Block:</strong> Drop a "block" chip onto the board that prevents either player from placing a chip in that spot. The block chip will rest on the first chip it hits, or the bottom of the board, and will stay the rest of the game.</li>
					<li><strong>Scratch:</strong> Removes 1 of your opponent's chips from the board.</li>
					<li><strong>Shake:</strong> Shakes the board, removing up to 3 chips randomly chosen on the board. Shake only removes chips that do not have other chips on top of them.</li>
				</ul>
				<h3>Winning the Game:</h3>
				<p>The first player to connect four of their cats in a row wins! If the board fills up without any player connecting four, the player with the least amount of total time over all of their turns is the winner.</p>
				<p>Enjoy the game and may the best cat win!</p>
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

// Audio Toggle Buttons
audioToggleBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		toggleAudio();

		// Start game soundtrack if audio is enabled
		if (gameState.isAudioEnabled) {
			startSoundtrack();
		}
	});
});

// Button sounds
const buttonHoverSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/hover-sound_bubble-pop.mp3');
const buttonClickSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/button-click_select-sound.mp3');

// Configurations
buttonHoverSound.volume = 0.5;
buttonClickSound.volume = 0.5;

allButtons.forEach((button) => {
	// HOVER
	button.addEventListener('mouseenter', () => {
		if (gameState.isAudioEnabled && !button.classList.contains('btn-sound-disabled')) {
			buttonHoverSound.currentTime = 0;
			buttonHoverSound.play();
		}
	});

	// CLICK
	button.addEventListener('click', () => {
		if (gameState.isAudioEnabled && !button.classList.contains('btn-sound-disabled')) {
			buttonClickSound.currentTime = 0;
			buttonClickSound.play();
		}
	});
});

// Add event listeners and functions for the cat chip selection
const catChips = document.querySelectorAll('.cat-chip');

catChips.forEach((chip) => {
	chip.addEventListener('click', () => {
		if (gameState.player1Select === true) {
			// Set game state
			gameState.player1Chip = chip.id;
			gameState.player1Select = false;
			gameState.player2Select = true;

			// Update player prompt
			playerPrompt.innerText = "Player 2 - Select Your Cat Chip!";

			// Update selection menu
			// Gray out chips and disable button sounds
			const parentSiblings = chip.parentNode.parentNode.children;
			for (let sibling of parentSiblings) {
				for (let child of sibling.children) {
					if (child !== chip) {
						child.classList.add('unavailable');
					} else {
						child.classList.add('selected');
					}
					child.classList.add('btn-sound-disabled');
				}
			}

			// Show player 1 selection text
			chip.parentElement.children[1].classList.remove('hide');


		} else if (gameState.player2Select === true) {
			// Set game state
			gameState.player2Chip = chip.id;
			gameState.player1Select = false;
			gameState.player2Select = false;

			// Update player prompt
			playerPrompt.innerText = "Selections Complete! Click 'Start' to Begin the Game.";

			// Update selection menu
			// Gray out chips and disable button sounds
			const parentSiblings = chip.parentNode.parentNode.children;
			for (let sibling of parentSiblings) {
				for (let child of sibling.children) {
					if (child !== chip) {
						child.classList.add('unavailable');
					} else {
						child.classList.add('selected');
					}
					child.classList.add('btn-sound-disabled');
				}
			}

			// Show player 2 selection text
			chip.parentElement.children[1].innerText = 'Player 2';
			chip.parentElement.children[1].classList.remove('hide');

		}
	});
});


// Add event listener for Start Game button
startGameBtn.addEventListener('click', () => {
	// Only proceed if both players have selected their chips
	if (gameState.player1Select === true || gameState.player2Select === true) {
		return;
	}

	// Move to the next scene
	chipSelectScene.style.display = 'none';
	gameScene.style.display = 'block';
	gameState.activeScene = 'gameScene';
});