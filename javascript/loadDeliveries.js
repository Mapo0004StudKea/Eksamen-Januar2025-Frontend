export function loadDeliveries() {
    console.log('loadDeliveries function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Leveringer</h1>
       
        <div class="container mt-5">
            <!-- Form for adding new Deliveries -->
            <h2>Tilføj en ny levering</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Input</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pizza ID</td>
                        <td><input type="number" id="pizzaId" placeholder="Indtast Pizza ID (1-5)" /></td>
                    </tr>
                    <tr>
                        <td>Adresse</td>
                        <td><input type="text" id="address" placeholder="Indtast adresse" /></td>
                    </tr>
                </tbody>
            </table>
            <button id="add-delivery-btn">Tilføj levering</button>
            <button id="clear-delivery-form-btn">Ryd formular</button>
        </div>
        
        <h2>Liste over leveringer</h2>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Pizza</th>
                    <th>Beskrivelse</th>
                    <th>Adresse</th>
                    <th>Status</th>
                    <th>Drone</th>
                    <th>Handlinger</th>
                </tr>
            </thead>
            <tbody id="deliveries-tbl-rows">
            </tbody>
        </table>
    `;

    // Initialize listeners
    document.getElementById('add-delivery-btn').addEventListener('click', handleCreateDelivery);
    document.getElementById('clear-delivery-form-btn').addEventListener('click', clearDeliveryForm);

    fetchDeliveries();
    setInterval(fetchDeliveries, 60000); // Opdater listen hvert 60. sekund
}

function fetchDeliveries() {
    fetch('http://localhost:8080/api/v1/deliveries')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('deliveries-tbl-rows');
            tbody.innerHTML = ''; // Ryd eksisterende rækker

            // Tilføj hver levering til tabellen
            data.forEach(delivery => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${delivery.id}</td>
                    <td>${delivery.pizza ? delivery.pizza.title : 'Ikke specificeret'}</td>
                    <td>${delivery.pizza ? delivery.pizza.description : 'Ikke specificeret'}</td>
                    <td>${delivery.address}</td>
                    <td>${delivery.actualDeliveryTime ? 'Afsluttet' : 'Ikke afsluttet'}</td>
                    <td>${delivery.drone ? delivery.drone.uuid : 'Ingen drone'}</td>
                    <td>
                        <button class="assign-drone-btn" data-id="${delivery.id}" ${delivery.drone ? 'disabled' : ''}>Tildel drone</button>
                        <button class="complete-delivery-btn" data-id="${delivery.id}" ${!delivery.drone || delivery.actualDeliveryTime ? 'disabled' : ''}>Afslut levering</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            addDeliveryActionListeners();
        })
        .catch(error => console.error('Error fetching deliveries:', error));
}

function addDeliveryActionListeners() {
    document.querySelectorAll('.assign-drone-btn').forEach(btn => {
        btn.addEventListener('click', () => assignDroneToDelivery(btn.dataset.id));
    });

    document.querySelectorAll('.complete-delivery-btn').forEach(btn => {
        btn.addEventListener('click', () => completeDelivery(btn.dataset.id));
    });
}

function handleCreateDelivery() {
    const pizzaId = document.getElementById('pizzaId').value;
    const address = document.getElementById('address').value;

    fetch(`http://localhost:8080/api/v1/deliveries/add?pizzaId=${pizzaId}&address=${encodeURIComponent(address)}`, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                fetchDeliveries();
                clearDeliveryForm();
                console.log('Delivery created successfully');
            } else {
                throw new Error('Failed to create delivery');
            }
        })
        .catch(error => console.error('Error creating delivery:', error));
}

function assignDroneToDelivery(deliveryId) {
    fetch(`http://localhost:8080/api/v1/deliveries/schedule?deliveryId=${deliveryId}`, {
        method: 'POST'
    })
        .then(() => fetchDeliveries())
        .catch(err => console.error('Error assigning drone:', err));
}

function completeDelivery(deliveryId) {
    fetch(`http://localhost:8080/api/v1/deliveries/finish?deliveryId=${deliveryId}`, {
        method: 'POST'
    })
        .then(() => fetchDeliveries())
        .catch(err => console.error('Error completing delivery:', err));
}

function clearDeliveryForm() {
    document.getElementById('pizzaId').value = '';
    document.getElementById('address').value = '';
}
