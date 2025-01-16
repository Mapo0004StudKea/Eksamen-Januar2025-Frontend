// main.js
import { loadHome } from './home.js';
import { loadDeliveries } from './loadDeliveries.js';
import { loadDrones } from './drones.js';
import { loadPizzas } from './pizza.js';
import { loadStations } from './station.js';

// Function to parse hash and extract route
function parseHash(hash) {
    const [route] = hash.split('?');
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
        case 'drones':
            loadDrones();
            break;
        case 'pizza':
            loadPizzas();
            break;
        case 'stations':
            loadStations();
            break;
        default:
            loadHome();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navigate(); // Load the initial route
    window.addEventListener('hashchange', navigate); // Listen for hash changes
});