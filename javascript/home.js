export function loadHome() {
    console.log('loadHome function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Leveringsoversigt</h1>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pizza</th>
                        <th>Beskrivelse</th>
                        <th>Adresse</th>
                        <th>Forventet leveringstid</th>
                        <th>Faktisk leveringstid</th>
                        <th>Drone</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="delivery-tbl-rows">
                </tbody>
            </table>
        </div>
    `;

    fetchDeliveries();
}

function fetchDeliveries() {
    fetch('http://localhost:8080/api/v1/deliveries/getAll')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('delivery-tbl-rows');
            tbody.innerHTML = '';

            // Tilføj hver levering til tabellen
            data.forEach(delivery => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${delivery.id}</td>
                    <td>${delivery.pizza ? delivery.pizza.title : 'Ikke specificeret'}</td>
                    <td>${delivery.pizza ? delivery.pizza.description : 'Ikke specificeret'}</td>
                    <td>${delivery.address}</td>
                    <td>${delivery.expectedDeliveryTime ? formatDateTime(delivery.expectedDeliveryTime) : 'Ikke angivet'}</td>
                    <td>${delivery.actualDeliveryTime ? formatDateTime(delivery.actualDeliveryTime) : 'Ikke leveret'}</td>
                    <td>${delivery.drone ? delivery.drone.uuid : 'Ingen drone'}</td>
                    <td>${delivery.actualDeliveryTime ? 'Afsluttet' : 'Undervejs'}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching deliveries:', error));
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString();
}