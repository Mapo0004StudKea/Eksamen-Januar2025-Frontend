// main.js
import { loadHome } from './home.js';
import { loadDeliveries } from './loadDeliveries.js';
import { loadRooms } from './rooms.js';

// Function to parse hash and extract route
function parseHash(hash) {
    const [route, queryString] = hash.split('?');
    return { route };
}

// Function to handle navigation
function navigate() {
    const hash = window.location.hash.substring(1) || 'home';
    const { route } = parseHash(hash);

    switch (route) {
        case 'home':
            loadHome();
            break;
        case 'deliveries':
            loadDeliveries();
            break;
        default:
            loadHome();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navigate(); // Load the initial route
    window.addEventListener('hashchange', navigate); // Listen for hash changes
});