// Initialize the admin page with pagination
export function loadHotels() {
    console.log('loadHotels function called');
    const app = document.getElementById('app');
    app.innerHTML = `
<h1>Hotel side</h1>
        <p>Her kan CRUD funktioner bruges!</p>
            <div class="container mt-5">
            <!-- Form for adding new Hotels -->
            <h2>Tilføj et nyt hotel</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Input</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Navn</td>
                        <td><input type="text" id="name" placeholder="Skriv her..." /></td>
                    </tr>
                    <tr>
                        <td>Gade</td>
                        <td><input type="text" id="street" placeholder="Skriv her..." /></td>
                    </tr>
                    <tr>
                        <td>By</td>
                        <td><input type="text" id="city" placeholder="Skriv her..." /></td>
                    </tr>
                    <tr>
                        <td>Postnummer</td>
                        <td><input type="text" id="zip" placeholder="Skriv her..." /></td>
                    </tr>
                    <tr>
                        <td>Land</td>
                        <td><input type="text" id="country" placeholder="Skriv her..." /></td>
                    </tr>
                </tbody>
            </table>
            <button id="add-hotel-btn">Tilføj Hotel</button>
            <button id="update-hotel-btn" disabled>Opdater Hotel</button>
            <button id="clear-data-btn">Ryd Data</button>
        <h2>Se fuld liste af Hoteller</h2>
        <div>
            <table>
               <thead>
                   <tr>
                       <th>Id</th>
                       <th>Navn</th> 
                       <th>Gade</th>
                       <th>By</th>
                       <th>Postnummer</th>
                       <th>Land</th>
                       <th>Antal værelser</th>
                       <th>Handlinger</th>
                   </tr>
               </thead>
               <tbody id="tbl-rows">
               </tbody>
            </table>
        </div>
    `;
    document.getElementById('add-hotel-btn').addEventListener('click', addHotel);
    document.getElementById('clear-data-btn').addEventListener('click', clearForm);
    fetchHotels()
}

// Tilføj event listeners efter at hoteller er hentet
function addEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editHotel(button.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteHotel(button.dataset.id));
    });
}

// Fetch data from backend
function fetchHotels() {
    fetch("http://localhost:8080/api/hotels/getAll")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('tbl-rows');
            tbody.innerHTML = ''; // Clear existing rows

            // Populate table rows with fetched data
            data.forEach(hotel => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hotel.id}</td>
                    <td>${hotel.name}</td>
                    <td>${hotel.street}</td>
                    <td>${hotel.city}</td>
                    <td>${hotel.zip}</td>
                    <td>${hotel.country}</td>
                    <td>${hotel.rooms ? hotel.rooms.length : 0}</td>
                    <td>
                        <button class="edit-btn" data-id="${hotel.id}">Rediger</button>
                        <button class="delete-btn" data-id="${hotel.id}">Slet</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            addEventListeners(); // Tilføj event listeners efter rendering
        })
        .catch(error => {
            console.error("Error fetching hotels:", error);
        });
}

function addHotel() {
    const name = document.getElementById('name').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;

    const hotelDTO = {
        name: name,
        street: street,
        city: city,
        zip: zip,
        country: country
    };

    fetch("http://localhost:8080/api/hotels/createHotel", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelDTO)
    })
        .then(response => {
            if (!response.ok) {
                fetchHotels()
                clearForm()
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Hotel added:", data);
            fetchHotels(); // Reload the list of hotels
        })
        .catch(error => {
            console.error("Error adding hotel:", error);
        });
}

function editHotel(id) {
    fetch(`http://localhost:8080/api/hotels/${id}`)
        .then(response => response.json())
        .then(hotel => {
            document.getElementById('name').value = hotel.name;
            document.getElementById('street').value = hotel.street;
            document.getElementById('city').value = hotel.city;
            document.getElementById('zip').value = hotel.zip;
            document.getElementById('country').value = hotel.country;

            // Vis opdater-knappen
            const updateButton = document.getElementById('update-hotel-btn');
            updateButton.disabled = false;

            // Tilføj event listener til opdatering
            updateButton.onclick = () => updateHotel(id);
        })
        .catch(error => console.error("Error fetching hotel for edit:", error));
}

function deleteHotel(id) {
    if (!confirm("Er du sikker på, at du vil slette dette hotel?")) {
        return;
    }

    fetch(`http://localhost:8080/api/hotels/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Hotel deleted");
            fetchHotels(); // Opdater listen
        })
        .catch(error => console.error("Error deleting hotel:", error));
}

function updateHotel(id) {
    const hotelDTO = {
        name: document.getElementById('name').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value
    };

    fetch(`http://localhost:8080/api/hotels/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelDTO)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Hotel updated:", data);
            fetchHotels(); // Opdater listen
        })
        .catch(error => console.error("Error updating hotel:", error));
}

// Clear the form
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('street').value = '';
    document.getElementById('city').value = '';
    document.getElementById('zip').value = '';
    document.getElementById('country').value = '';
}