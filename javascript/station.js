export function loadStations() {
    console.log('loadStations function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Station Liste</h1>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Længdegrad</th>
                        <th>Breddegrad</th>
                    </tr>
                </thead>
                <tbody id="station-tbl-rows">
                </tbody>
            </table>
        </div>
    `;

    fetchAndRenderStations();
}

async function fetchAndRenderStations() {
    try {
        // Hent stationer fra backend
        const stations = await fetchStations();
        const tbody = document.getElementById('station-tbl-rows');
        tbody.innerHTML = '';

        // Tilføj hver station til tabellen
        stations.forEach(station => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${station.id}</td>
                <td>${station.latitude}</td>
                <td>${station.longitude}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching stations:', error);
        const app = document.getElementById('app');
        app.innerHTML += `<p>Kunne ikke hente stationer. Prøv igen senere.</p>`;
    }
}

async function fetchStations() {
    const response = await fetch('http://localhost:8080/api/v1/station/getAll');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}