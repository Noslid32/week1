class PetStackManager {
    constructor(bufferSize = 3) {
        this.stack = [];
        this.isLoading = true;
        this.bufferSize = bufferSize;
        this.onStateChange = null; // Callback to notify app.js
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.onStateChange = callback;
    }

    notify() {
        if (this.onStateChange) {
            this.onStateChange({
                currentPet: this.stack[0] || null,
                nextPet: this.stack[1] || null,
                isLoading: this.isLoading && this.stack.length === 0
            });
        }
    }

    // Initialize the buffer
    async init() {
        this.isLoading = true;
        this.notify();

        try {
            const promises = Array.from({ length: this.bufferSize }, () => fetchRandomPetProfile());
            this.stack = await Promise.all(promises);
        } catch (error) {
            console.error("Failed to init stack:", error);
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    // Swipe / Pass logic
    advance() {
        if (this.stack.length === 0) return;

        // Remove the first item (FIFO)
        this.stack.shift();
        this.notify();

        // Background fetch to replenish
        fetchRandomPetProfile().then((newPet) => {
            this.stack.push(newPet);
            // We notify again in case the queue was empty and we just added one
            if (this.stack.length === 1) this.notify(); 
        });
    }
}