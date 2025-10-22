// Get HTML Elements
const playBtn = document.getElementById('btn-play-game');
const howToPlayBtn = document.getElementById('btn-how-to-play');

// Add Event Listeners
playBtn.addEventListener('click', () => {
	console.log('Play Game button clicked');
});

howToPlayBtn.addEventListener('click', () => {
	console.log('How to Play button clicked');
});