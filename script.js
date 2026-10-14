// Global variable to store the selected theme (boy or girl)
let selectedTheme = 'general'; 

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const mainHeader = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const authPage = document.getElementById('auth-page');
    const gamesPage = document.getElementById('games-page');
    const gamesContent = document.getElementById('games-content');
    const regForm = document.getElementById('registration-form');
    const boyButton = document.getElementById('select-boy');
    const girlButton = document.getElementById('select-girl');
    // Ensure avatarDisplay is correctly scoped inside the form
    const avatarDisplay = regForm.querySelector('.avatar-display'); 
    const aboutUsLink = document.getElementById('about-us-link');
    const aboutSection = document.getElementById('about-us');
    // Reference the container for the gender selection
    const genderSelection = document.getElementById('gender-selection');
    
    // --- Core Functions: Theme and Page Switching ---

    /**
     * Applies the chosen theme (boy or girl) to the body and updates the avatar.
     * This is the function that ensures the gender choice only happens once.
     * @param {string} gender 'boy' or 'girl'.
     */
    function applyTheme(gender) {
        selectedTheme = gender; // Store the theme
        document.body.className = '';
        if (gender === 'boy') {
            document.body.classList.add('boy-theme');
            avatarDisplay.innerHTML = '👦'; 
        } else if (gender === 'girl') {
            document.body.classList.add('girl-theme');
            avatarDisplay.innerHTML = '👧';
        }
        
        // FIX 1: Hide the gender selection buttons immediately after selection
        // This ensures the "I'm a boy" or "I'm a girl" only shows once before the form.
        if (genderSelection) {
            genderSelection.classList.add('hidden');
        }
        
        // Show the registration form once a gender is selected
        regForm.classList.remove('hidden');
    }

    /** Shows the main game selection cards and hides the info section. */
    window.showMainGames = function() {
        gamesContent.classList.remove('hidden-section');
        aboutSection.classList.add('hidden-section');
        menuOverlay.classList.add('hidden'); // Close menu
        
        // Ensure scrolling is active for the content wrapper
        const contentWrapper = gamesPage.querySelector('.content-wrapper');
        if(contentWrapper) {
            contentWrapper.style.overflowY = 'auto'; 
        }
    }

    /** Shows the About Us information section. */
    window.showAboutUs = function() {
        gamesContent.classList.add('hidden-section');
        aboutSection.classList.remove('hidden-section');
        menuOverlay.classList.add('hidden'); // Close menu
        
        // Ensure scrolling is active for the content wrapper
        const contentWrapper = gamesPage.querySelector('.content-wrapper');
        if(contentWrapper) {
            contentWrapper.style.overflowY = 'auto'; 
        }
    }
    
    /** * Starts a specific game by showing its full-screen overlay and applying 
     * the gender-specific light background.
     * @param {number} gameNumber 1, 2, or 3.
     */
    window.startGame = function(gameNumber) {
        const gameArea = document.getElementById(`game-${gameNumber}-area`);

        // Apply dynamic theme background to the game area (light blue or light pink)
        gameArea.classList.remove('hidden', 'boy-theme-bg', 'girl-theme-bg');
        if (selectedTheme === 'boy') {
            gameArea.classList.add('boy-theme-bg');
        } else if (selectedTheme === 'girl') {
            gameArea.classList.add('girl-theme-bg');
        }

        mainHeader.classList.add('hidden'); // Hide header during gameplay
        menuOverlay.classList.add('hidden'); // Ensure menu is closed
        gamesPage.classList.add('hidden'); // Temporarily hide games page content
        
        // Initialize the game logic
        if (gameNumber === 1) initializeGame1();
        else if (gameNumber === 2) initializeGame2();
        else if (gameNumber === 3) initializeGame3();
    }

    /** * Hides the current game and returns to the main menu view.
     * @param {number} gameNumber 1, 2, or 3.
     */
    window.hideGame = function(gameNumber) {
        document.getElementById(`game-${gameNumber}-area`).classList.add('hidden');
        mainHeader.classList.remove('hidden'); // Show header back
        gamesPage.classList.remove('hidden'); // Show games page content
        showMainGames(); // Show game cards by default and enable scrolling
    }

    // --- Event Listeners ---

    // Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuOverlay.classList.toggle('hidden');
    });

    // About Us link event
    aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAboutUs();
    });
    
    // Theme Selection
    if (boyButton) {
        boyButton.addEventListener('click', (e) => {
            e.preventDefault();
            applyTheme('boy');
        });
    }

    if (girlButton) {
        girlButton.addEventListener('click', (e) => {
            e.preventDefault();
            applyTheme('girl');
        });
    }

    // Registration Form Submission
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        authPage.classList.add('hidden');
        gamesPage.classList.remove('hidden');
        mainHeader.classList.remove('hidden'); // Show header after sign-in
        showMainGames(); // Show game cards by default and enable scrolling
        regForm.reset(); 
    });

    /** Simulates logging out by resetting the application state (reloading the page). */
    window.logOut = function() {
        // In a real app, this would clear user sessions/data.
        // For this simple HTML app, we reload to go back to the auth page.
        window.location.reload(); 
    }

    // --- GAME 1: Tap to Sort Logic ---
    let currentItem1 = null;
    let score1 = 0;
    const itemDisplay1 = document.getElementById('item-to-sort');
    const scoreDisplay1 = document.getElementById('score-1');
    const feedbackMessage1 = document.getElementById('feedback-message-1');
    const sortButtons = document.querySelectorAll('.sort-btn');

    const trashItems1 = [
        { emoji: '🥤', category: 'recycle', correct_answer: 'Recycle glass, plastic, and metal.' },
        { emoji: '🍎', category: 'compost', correct_answer: 'Compost food scraps and organic waste.' },
        { emoji: '📰', category: 'recycle', correct_answer: 'Recycle paper and cardboard.' },
        { emoji: '🔋', category: 'trash', correct_answer: 'Throw away batteries (or special disposal).' },
        { emoji: '📦', category: 'recycle', correct_answer: 'Recycle cardboard boxes.' },
        { emoji: '🍌', category: 'compost', correct_answer: 'Compost banana peels.' },
        { emoji: '🍬', category: 'trash', correct_answer: 'Throw away wrappers.' }
    ];

    function initializeGame1() {
        score1 = 0;
        scoreDisplay1.textContent = score1;
        feedbackMessage1.textContent = '';
        nextItem1();
    }

    function nextItem1() {
        const randomIndex = Math.floor(Math.random() * trashItems1.length);
        currentItem1 = trashItems1[randomIndex];
        itemDisplay1.textContent = currentItem1.emoji;
        feedbackMessage1.textContent = '';
        feedbackMessage1.className = 'feedback';
        sortButtons.forEach(button => button.disabled = false);
    }

    function checkAnswer1(userCategory) {
        sortButtons.forEach(button => button.disabled = true); 

        if (userCategory === currentItem1.category) {
            score1++;
            scoreDisplay1.textContent = score1;
            feedbackMessage1.textContent = 'Correct! Great job! 🎉';
            feedbackMessage1.classList.add('correct');
        } else {
            let correctIcon = '';
            if (currentItem1.category === 'recycle') correctIcon = '♻️';
            else if (currentItem1.category === 'compost') correctIcon = '🌿';
            else correctIcon = '🗑️';
            
            feedbackMessage1.textContent = `Oops! It belongs in the ${correctIcon} category. ${currentItem1.correct_answer}`;
            feedbackMessage1.classList.add('wrong');
        }
        setTimeout(nextItem1, 2000); 
    }

    sortButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            if (!button.disabled) {
                checkAnswer1(category);
            }
        });
    });

    // --- GAME 2: Clean the Park Logic ---
    const parkScene = document.getElementById('park-scene');
    const scoreDisplay2 = document.getElementById('score-2');
    const parkMessage = document.getElementById('park-message');
    const trashEmojis = ['🥤', '📰', '🍬', '🧻', '🍌', '📦', '🍂', '🍁', '🧋', '🦴'];
    let trashCount = 0;

    function initializeGame2() {
        parkScene.innerHTML = ''; 
        parkMessage.textContent = '';
        trashCount = 10; 
        scoreDisplay2.textContent = trashCount;
        parkMessage.classList.remove('complete');

        for (let i = 0; i < trashCount; i++) {
            const trash = document.createElement('div');
            trash.classList.add('trash-item');
            trash.textContent = trashEmojis[Math.floor(Math.random() * trashEmojis.length)];
            
            // Random position within the park bounds (5% to 90%)
            const x = Math.random() * 85 + 5; 
            const y = Math.random() * 85 + 5; 
            
            trash.style.left = `${x}%`;
            trash.style.top = `${y}%`;

            trash.addEventListener('click', removeTrash);
            parkScene.appendChild(trash);
        }
    }

    function removeTrash(event) {
        if (trashCount > 0) {
            event.currentTarget.remove(); 
            trashCount--;
            scoreDisplay2.textContent = trashCount;
            parkMessage.textContent = 'Good job! Keep cleaning!';

            if (trashCount === 0) {
                parkMessage.textContent = 'Awesome! The park is clean! 🎉';
                parkMessage.classList.add('complete');
            }
        }
    }

    // --- GAME 3: Recyclable or Not? Logic ---
    let currentItem3 = null;
    let score3 = 0;
    const itemDisplay3 = document.getElementById('recycle-item-display');
    const scoreDisplay3 = document.getElementById('score-3');
    const feedbackMessage3 = document.getElementById('feedback-message-3');
    const explanationBox = document.getElementById('explanation-box');
    const choiceButtons = document.querySelectorAll('.choice-btn');

    const recycleItems3 = [
        { emoji: '📰', recyclable: true, explanation: 'Paper is recyclable! Make sure it\'s clean and dry.' },
        { emoji: '🍕', recyclable: false, explanation: 'Food residue, like a greasy pizza box, makes recycling impossible. This goes in the trash.' },
        { emoji: '🥫', recyclable: true, explanation: 'Metal cans are highly recyclable. Give them a quick rinse first!' },
        { emoji: '💡', recyclable: false, explanation: 'Regular light bulbs must be thrown away. Special bulbs require dedicated recycling points.' },
        { emoji: '🍾', recyclable: true, explanation: 'Glass bottles and jars are recyclable, but they need to be separated by color sometimes.' },
        { emoji: '☕', recyclable: false, explanation: 'Coffee cups are often lined with plastic and are NOT recyclable in most places. Use a reusable cup!' },
        { emoji: '💻', recyclable: false, explanation: 'Electronics are *not* for the regular bin! They need special e-waste recycling.' }
    ];

    function initializeGame3() {
        score3 = 0;
        scoreDisplay3.textContent = score3;
        explanationBox.textContent = '';
        feedbackMessage3.textContent = '';
        nextItem3();
    }

    function nextItem3() {
        const randomIndex = Math.floor(Math.random() * recycleItems3.length);
        currentItem3 = recycleItems3[randomIndex];
        
        itemDisplay3.textContent = currentItem3.emoji;
        explanationBox.textContent = '';
        feedbackMessage3.textContent = '';
        feedbackMessage3.className = 'feedback';
        choiceButtons.forEach(button => button.disabled = false);
    }

    function checkAnswer3(userChoice) {
        choiceButtons.forEach(button => button.disabled = true);
        
        const isRecyclable = currentItem3.recyclable;
        const correctChoice = isRecyclable ? 'yes' : 'no';
        
        explanationBox.textContent = currentItem3.explanation;
        
        if (userChoice === correctChoice) {
            score3++;
            scoreDisplay3.textContent = score3;
            feedbackMessage3.textContent = 'Bravo! You got it right! 🥳';
            feedbackMessage3.classList.add('correct');
        } else {
            feedbackMessage3.textContent = `Incorrect. Read the explanation above to learn why! 🧠`;
            feedbackMessage3.classList.add('wrong');
        }

        setTimeout(nextItem3, 4000); 
    }

    choiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const choice = e.currentTarget.getAttribute('data-choice');
            if (!button.disabled) {
                checkAnswer3(choice);
            }
        });
    });
});