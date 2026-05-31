// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    // Screens
    const screenBrowse = document.getElementById('browse-screen');
    const screenAdoption = document.getElementById('adoption-screen');
    const screenSuccess = document.getElementById('success-screen');
    
    // Browse States
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const petCard = document.getElementById('pet-card');
    
    // Pet Card Data
    const elImage = document.getElementById('pet-image');
    const elName = document.getElementById('pet-name');
    const elBio = document.getElementById('pet-bio');
    const elPreload = document.getElementById('preload-image');
    
    // Buttons
    const btnPass = document.getElementById('btn-pass');
    const btnLike = document.getElementById('btn-like');
    const btnBackBrowse = document.getElementById('btn-back-browse');
    const btnConfirmVisit = document.getElementById('btn-confirm-visit');
    const btnContinue = document.getElementById('btn-continue');
    
    // Adoption / Success dynamic elements
    const adoptPetName = document.getElementById('adopt-pet-name');
    const adoptPetImage = document.getElementById('adopt-pet-image');
    const successPetName = document.getElementById('success-pet-name');

    // 2. Application State
    let currentLikedPet = null;
    const petStack = new PetStackManager();

    // 3. Navigation Helpers
    function showScreen(screenId) {
        [screenBrowse, screenAdoption, screenSuccess].forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    }

    // 4. State UI Updater (Equivalent to React render)
    petStack.subscribe((state) => {
        // Reset view states
        loadingState.classList.add('hidden');
        emptyState.classList.add('hidden');
        petCard.classList.add('hidden');

        if (state.isLoading) {
            loadingState.classList.remove('hidden');
        } else if (state.currentPet) {
            // Update Card info
            elImage.src = state.currentPet.imageUrl;
            elName.textContent = `${state.currentPet.name}, ${state.currentPet.age}`;
            elBio.textContent = state.currentPet.description;
            
            // Re-trigger CSS animation for smooth transition
            petCard.classList.remove('slide-in');
            void petCard.offsetWidth; // Force DOM reflow
            petCard.classList.add('slide-in');
            petCard.classList.remove('hidden');

            // Pre-fetch next image
            if (state.nextPet) {
                elPreload.src = state.nextPet.imageUrl;
            }
        } else {
            emptyState.classList.remove('hidden');
        }
    });

    // 5. Event Listeners
    btnPass.addEventListener('click', () => {
        petStack.advance();
    });

    btnLike.addEventListener('click', () => {
        const pet = petStack.stack[0];
        if (pet) {
            currentLikedPet = pet;
            adoptPetName.textContent = pet.name;
            adoptPetImage.src = pet.imageUrl;
            showScreen('adoption-screen');
        }
    });

    btnBackBrowse.addEventListener('click', () => {
        petStack.advance();
        currentLikedPet = null;
        showScreen('browse-screen');
    });

    btnConfirmVisit.addEventListener('click', () => {
        successPetName.textContent = currentLikedPet.name;
        showScreen('success-screen');
        lucide.createIcons(); // Re-render icons for new screen
    });

    btnContinue.addEventListener('click', () => {
        petStack.advance();
        currentLikedPet = null;
        showScreen('browse-screen');
    });

    // 6. Start the App
    petStack.init();
});