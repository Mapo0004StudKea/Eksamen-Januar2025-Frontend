export function loadDrones() {
    console.log('loadDrones function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Droner</h1>
       
        <div class="container mt-5">
            <!-- Form for adding new Drones -->
            <h2>Opret en ny drone</h2>
            <button id="add-drone-btn">Opret ny drone</button>
        </div>
        
        <h2>Liste over droner</h2>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>UUID</th>
                    <th>Status</th>
                    <th>Handlinger</th>
                </tr>
            </thead>
            <tbody id="drones-tbl-rows">
            </tbody>
        </table>
    `;

    // Initialize listeners
    document.getElementById('add-drone-btn').addEventListener('click', handleCreateDrone);

    fetchDrones();
}

function fetchDrones() {
    fetch('http://localhost:8080/api/v1/drones')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('drones-tbl-rows');
            tbody.innerHTML = ''; // Ryd eksisterende rækker

            // Tilføj hver drone til tabellen
            data.forEach(drone => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${drone.id}</td>
                    <td>${drone.uuid}</td>
                    <td>${drone.status}</td>
                    <td>
                        <button class="enable-drone-btn" data-id="${drone.id}" ${drone.status === 'IN_SERVICE' ? 'disabled' : ''}>Aktiver</button>
                        <button class="disable-drone-btn" data-id="${drone.id}" ${drone.status === 'OUT_OF_SERVICE' ? 'disabled' : ''}>Deaktiver</button>
                        <button class="retire-drone-btn" data-id="${drone.id}" ${drone.status === 'PHASED_OUT' ? 'disabled' : ''}>Udfas</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            addDroneActionListeners();
        })
        .catch(error => console.error('Error fetching drones:', error));
}

function addDroneActionListeners() {
    document.querySelectorAll('.enable-drone-btn').forEach(btn => {
        btn.addEventListener('click', () => updateDroneStatus(btn.dataset.id, 'IN_SERVICE'));
    });

    document.querySelectorAll('.disable-drone-btn').forEach(btn => {
        btn.addEventListener('click', () => updateDroneStatus(btn.dataset.id, 'OUT_OF_SERVICE'));
    });

    document.querySelectorAll('.retire-drone-btn').forEach(btn => {
        btn.addEventListener('click', () => updateDroneStatus(btn.dataset.id, 'PHASED_OUT'));
    });
}

function handleCreateDrone() {
    fetch('http://localhost:8080/api/v1/drones/add', {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                fetchDrones();
                console.log('Drone created successfully');
            } else {
                throw new Error('Failed to create drone');
            }
        })
        .catch(error => console.error('Error creating drone:', error));
}

function updateDroneStatus(droneId, status) {
    let endpoint;
    if (status === 'IN_SERVICE') endpoint = 'enable';
    if (status === 'OUT_OF_SERVICE') endpoint = 'disable';
    if (status === 'PHASED_OUT') endpoint = 'retire';

    fetch(`http://localhost:8080/api/v1/drones/${endpoint}?droneId=${droneId}`, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                fetchDrones(); // Opdater listen
                console.log(`Drone status updated to ${status}`);
            } else {
                throw new Error(`Failed to update drone status to ${status}`);
            }
        })
        .catch(error => console.error(`Error updating drone status to ${status}:`, error));
}