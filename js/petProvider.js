// Local mock data
const localPets = [
    { id: '1', name: 'Max', age: '2 años', description: 'Un chico enérgico que ama atrapar la pelota.' },
    { id: '2', name: 'Luna', age: '1 año', description: 'Dulce, cariñosa y excelente para abrazar.' },
    { id: '3', name: 'Rocky', age: '3 años', description: 'Protector, leal y siempre alerta.' },
    { id: '4', name: 'Bella', age: '6 meses', description: 'Pequeña, traviesa y muy curiosa.' },
    { id: '5', name: 'Charlie', age: '4 años', description: 'Tranquilo, le encanta dormir en el sofá.' }
];

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
const FALLBACK_IMAGE = 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg';

/**
 * Fetches a random pet combining local bio and remote image
 */
async function fetchRandomPetProfile() {
    // 1. Select random local data
    const randomIndex = Math.floor(Math.random() * localPets.length);
    const randomPet = localPets[randomIndex];
    
    let imageUrl = FALLBACK_IMAGE;

    try {
        // 2. Fetch image from API
        const response = await fetch(DOG_API_URL);
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        if (data.status === 'success' && data.message) {
            imageUrl = data.message;
        }
    } catch (error) {
        console.error('Failed to fetch dog image, using fallback:', error);
    }

    // 4. Merge and return (Generate a unique ID based on timestamp to avoid duplicates in buffer)
    return {
        ...randomPet,
        id: `${randomPet.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl
    };
}