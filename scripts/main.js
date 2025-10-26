// Get HTML Elements
const gameVersion = '0.1.0a';
const gameVersionHtml = document.getElementById('game-version');

// Game Scenes
const mainMenu = document.getElementById('scene-main-menu');
const chipSelectScene = document.getElementById('scene-chip-select');
const gameScene = document.getElementById('scene-game');
const gameOverScene = document.getElementById('scene-game-over');

// Main Menu Buttons
const playBtn = document.getElementById('btn-play-game');
const howToPlayBtns = document.querySelectorAll('.btn-how-to-play');
const audioToggleBtns = document.querySelectorAll('.btn-toggle-audio');

// All buttons
const allButtons = document.querySelectorAll('.btn-sound');

// Chip Select Elements
const playerPrompt = document.getElementById('chip-options').children[0];
const startGameBtn = document.getElementById('btn-start-game');

// Game controls
const controlsContainer = document.getElementById('player-move-selection');
const controlsLeftArrow = document.getElementById('left-arrow');
const controlsRightArrow = document.getElementById('right-arrow');
const controlsPlayerChip = document.getElementById('player-chip').children[0];
const controlsTurnIndicator = document.getElementById('turn-indicator');
// Game player profile panels
const profileImagePlayer1 = document.getElementById('player-1-profile-image');
const profileImagePlayer2 = document.getElementById('player-2-profile-image');

// Player turn times
const player1TurnTime = document.getElementById('player-1-turn-time');
const player2TurnTime = document.getElementById('player-2-turn-time');

// Audio files
// Soundtrack
// const soundtrack = new Audio('/DMA105-the404Collective-RainingCats/audio/soundtrack/soundtrack-1.mp3');

// Buttons
// const buttonHoverSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/hover-sound_bubble-pop.mp3');
// const buttonClickSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/button-click_select-sound.mp3');

// Controls
// const controlsMoveSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/controls-move-sound.mp3');

// Game over
// const gameOverSound = new Audio('/DMA105-the404Collective-RainingCats/audio/sfx/game-over.mp3');

// Sounds for local development & testing
const soundtrack = new Audio('../audio/soundtrack/soundtrack-1.mp3');
const buttonHoverSound = new Audio('../audio/sfx/hover-sound_bubble-pop.mp3');
const buttonClickSound = new Audio('../audio/sfx/button-click_select-sound.mp3');
const gameOverSound = new Audio('../audio/sfx/game-over.mp3');
const controlsMoveSound = new Audio('../audio/sfx/controls-move-sound.mp3');

// Functions for game logic
// Checks for column to be open
const isColumnOpen = (boardState, col) => {
	return boardState[0][col] === 0;
};

// Check for lowest available cell
const findDropRow = (boardState, col) => {
	for (let row = boardState.length - 1; row >= 0; row--) {
		if (boardState[row][col] === 0) {
			return row;
		}
	}
	return -1; // column is full
};

// Drop chip into board
const dropChip = (gameState, col) => {
	const { boardState, currentPlayer } = gameState;
	if (!isColumnOpen(boardState, col)) return null;

	const row = findDropRow(boardState, col);
	if (row === -1) return null;

	boardState[row][col] = currentPlayer;
	return row;
};

// Change player
const changePlayer = (gameState) => {
	gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
};

// Count in a direction helper
const countInDirection = (boardState, row, col, deltaRow, deltaCol, player) => {
	let count = 0;
	let r = row + deltaRow;
	let c = col + deltaCol;

	while (
		r >= 0 && r < boardState.length &&
		c >= 0 && c < boardState[0].length &&
		boardState[r][c] === player
	) {
		count++;
		r += deltaRow;
		c += deltaCol;
	}
	return count;
};

// Detect a win
const checkWin = (boardState, row, col, player) => {
	const directions = [
		[0, 1],		// horizontal
		[1, 0],		// vertical
		[1, 1],		// diagonal down-right
		[-1, 1],	// diagonal up-right
	];

	return directions.some(([dr, dc]) => {
		const total =
			1 +
			countInDirection(boardState, row, col, dr, dc, player) +
			countInDirection(boardState, row, col, -dr, -dc, player);
		return total >= 4;
	});
};

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
	player1Turn: false,
	player2Turn: false,
	currentPlayer: 0,
	player1TimeMs: 0,
	player2TimeMs: 0,
	player1TurnTime: 0,
	player2TurnTime: 0,
	boardState: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	],
};


// Set game version
gameVersionHtml.innerText = `(version: ${gameVersion})`;

// Audio Configuration
buttonHoverSound.volume = 0.25;
buttonClickSound.volume = 0.25;

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
			// Play button select audio
			buttonClickSound.currentTime = 0;
			buttonClickSound.play();

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
	mainMenu.classList.add('hidden');
	chipSelectScene.classList.remove('hidden');
	gameState.activeScene = 'chipSelectScene';

	// Set player 1 select to true
	gameState.player1Select = true;
});

howToPlayBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
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
					<p>To use a special ability, click the icon of the ability you wish to use for your turn.</p>
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

		// Play hover sound
		closeButton.addEventListener('mouseenter', () => {
			if (gameState.isAudioEnabled && !closeButton.classList.contains('btn-sound-disabled')) {
				buttonHoverSound.currentTime = 0;
				buttonHoverSound.play();
			}
		});

		// Play click sound
		closeButton.addEventListener('click', () => {
			if (gameState.isAudioEnabled && !closeButton.classList.contains('btn-sound-disabled')) {
				buttonClickSound.currentTime = 0;
				buttonClickSound.play();
			}

			// Remove moval
			modal.remove();
		});
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
			// Ensure that player 2 does not select the same chip as player 1, or does not select an unavailable chip
			if (chip.id === gameState.player1Chip || chip.classList.contains('unavailable')) {
				return;
			}

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

			// Remove disabled styles from Start button
			startGameBtn.classList.remove('btn-sound-disabled');
			startGameBtn.classList.remove('btn-disabled');

		}
	});
});


// Add event listener for Start Game button
startGameBtn.addEventListener('click', (e) => {
	// Only proceed if both players have selected their chips
	if (gameState.player1Select === true || gameState.player2Select === true) {
		return;
	}

	if (startGameBtn.classList.contains('btn-disabled')) {
		// Prevent button from being clicked
		e.preventDefault();
	}

	// Move to the next scene
	chipSelectScene.classList.add('hidden');
	gameScene.classList.remove('hidden');
	gameState.activeScene = 'gameScene';
	gameState.player1Turn = true;
	gameState.currentPlayer = 1;
	// Reset and initialize timers for a new game
	gameState.player1TimeMs = 0;
	gameState.player2TimeMs = 0;
	gameState.player1TurnTime = 0;
	gameState.player2TurnTime = 0;
	player1TurnTime.innerText = '0.0';
	player2TurnTime.innerText = '0.0';
	currentTurnStart = Date.now();
	controlsPlayerChip.src = `images/cat-chips/catchip-${gameState.player1Chip}.png`;
	profileImagePlayer1.src = `images/cat-chips/catchip-${gameState.player1Chip}.png`;
	profileImagePlayer2.src = `images/cat-chips/catchip-${gameState.player2Chip}.png`;
	profileImagePlayer1.classList.add('active');
	profileImagePlayer1.classList.add('animate-player-chip');
});

// Game controls
let controlsXPosition = 0; // Initial horizontal position
let controlsCol = 0;
let movementFactor = 8.30; // Amount to move
// Listen for keydown events for game controls
document.addEventListener('keyup', (e) => {
	// Only allow controls if in game scene
	if (gameState.activeScene !== 'gameScene') {
		return;
	}


	switch (e.key) {


		case 'ArrowLeft':
			// Move player left
			if (controlsCol <= 0) {
				return; // Prevent moving left out of bounds
			} else if (controlsCol <= 1) {
				controlsLeftArrow.classList.add('hide');
			}

			// Show right arrow
			if (controlsRightArrow.classList.contains('hide')) {
				controlsRightArrow.classList.remove('hide');
			}

			controlsXPosition -= movementFactor;
			controlsCol -= 1;
			controlsContainer.style.transform = `translateX(${controlsXPosition}rem)`;
			controlsLeftArrow.classList.add('animate-controls-arrow');

			// Play audio
			if (gameState.isAudioEnabled) {
				controlsMoveSound.currentTime = 0;
				controlsMoveSound.play();
			}

			break;

		case 'ArrowRight':
			// Move player right
			if (controlsCol >= 6) {
				return; // Prevent moving right out of bounds
			} else if (controlsCol >= 5) {
				controlsRightArrow.classList.add('hide');
			}

			// Show left arrow
			if (controlsLeftArrow.classList.contains('hide')) {
				controlsLeftArrow.classList.remove('hide');
			}

			controlsXPosition += movementFactor;
			controlsCol += 1;
			controlsContainer.style.transform = `translateX(${controlsXPosition}rem)`;
			controlsLeftArrow.classList.add('animate-controls-arrow');

			// Play audio
			if (gameState.isAudioEnabled) {
				controlsMoveSound.currentTime = 0;
				controlsMoveSound.play();
			}

			break;

		case ' ':
			e.preventDefault(); // Prevents default browser action

			// Game board logic here
			const row = dropChip(gameState, controlsCol);
			if (row != null) {
				const player = gameState.currentPlayer;

				if (checkWin(gameState.boardState, row, controlsCol, player)) {
					console.log(`Player ${player} wins!`);
				}
			} else {
				// Column full unable to drop chip
				return;
			}

			// Finalize time for the player whose turn is ending
			const now = Date.now();
			if (gameState.player1Turn === true) {
				gameState.player1TimeMs += now - currentTurnStart;
			} else if (gameState.player2Turn === true) {
				gameState.player2TimeMs += now - currentTurnStart;
			}
			// Start timing the next player's turn
			currentTurnStart = now;

			// Play audio
			if (gameState.isAudioEnabled) {
				buttonClickSound.currentTime = 0;
				buttonClickSound.play();
			}

			if (gameState.player1Turn === true) {
				changePlayer(gameState);
				gameState.player1Turn = false;
				gameState.player2Turn = true;
				controlsTurnIndicator.innerText = 'Player 2 Turn';
				controlsPlayerChip.src = `images/cat-chips/catchip-${gameState.player2Chip}.png`;
				// Add/Remove yellow highlight for active
				profileImagePlayer1.classList.remove('active');
				profileImagePlayer2.classList.add('active');
				// Add/Remove chip animation
				profileImagePlayer1.classList.remove('animate-player-chip');
				profileImagePlayer2.classList.add('animate-player-chip');

			} else {
				changePlayer(gameState);
				gameState.player1Turn = true;
				gameState.player2Turn = false;
				controlsTurnIndicator.innerText = 'Player 1 Turn';
				controlsPlayerChip.src = `images/cat-chips/catchip-${gameState.player1Chip}.png`;
				// Add/Remove yellow highlight for active
				profileImagePlayer1.classList.add('active');
				profileImagePlayer2.classList.remove('active');
				// Add/Remove chip animation
				profileImagePlayer1.classList.add('animate-player-chip');
				profileImagePlayer2.classList.remove('animate-player-chip');
			}

	}
});

// Timers for player turn time (cumulative per player)
let currentTurnStart = null;
let countPlayerTurnTime = () => {
	const nowTick = Date.now();

	// Update only the active player's displayed time as base total + current run segment
	if (gameState.player1Turn === true && currentTurnStart !== null) {
		const totalMs = gameState.player1TimeMs + (nowTick - currentTurnStart);
		gameState.player1TurnTime = (totalMs / 1000).toFixed(1);
		player1TurnTime.innerText = gameState.player1TurnTime;
	} else if (gameState.player2Turn === true && currentTurnStart !== null) {
		const totalMs = gameState.player2TimeMs + (nowTick - currentTurnStart);
		gameState.player2TurnTime = (totalMs / 1000).toFixed(1);
		player2TurnTime.innerText = gameState.player2TurnTime;
	}
};
setInterval(countPlayerTurnTime, 100);