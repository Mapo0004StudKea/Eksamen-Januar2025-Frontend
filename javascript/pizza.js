export function loadPizzas() {
    console.log('loadPizzas function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Pizza Liste</h1>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Navn</th>
                        <th>Beskrivelse</th>
                        <th>Pris</th>
                    </tr>
                </thead>
                <tbody id="pizza-tbl-rows">
                </tbody>
            </table>
        </div>
    `;

    fetchPizzas();
}

function fetchPizzas(page = 0, size = 5) {
    fetch(`http://localhost:8080/api/v1/pizza/getAll?page=${page}&size=${size}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('pizza-tbl-rows');
            tbody.innerHTML = '';

            // Tilføj hver pizza til tabellen
            data.content.forEach(pizza => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pizza.id}</td>
                    <td>${pizza.title}</td>
                    <td>${pizza.description}</td>
                    <td>${pizza.price}</td>
                `;
                tbody.appendChild(row);
            });

            setupPagination(data);
        })
        .catch(error => console.error('Error fetching pizzas:', error));
}

function setupPagination(data) {
    // Fjern eksisterende pagination-controls, hvis de findes
    let existingPagination = document.getElementById('pagination-controls');
    if (existingPagination) {
        existingPagination.remove();
    }

    const app = document.getElementById('app');
    const paginationDiv = document.createElement('div');
    paginationDiv.id = 'pagination-controls';

    paginationDiv.innerHTML = `
        <button id="prev-page" ${data.pageable.pageNumber === 0 ? 'disabled' : ''}>Forrige</button>
        <span>Side ${data.pageable.pageNumber + 1} af ${data.totalPages}</span>
        <button id="next-page" ${data.pageable.pageNumber + 1 === data.totalPages ? 'disabled' : ''}>Næste</button>
    `;

    app.appendChild(paginationDiv);

    document.getElementById('prev-page').addEventListener('click', () => {
        fetchPizzas(data.pageable.pageNumber - 1, data.pageable.pageSize);
    });

    document.getElementById('next-page').addEventListener('click', () => {
        fetchPizzas(data.pageable.pageNumber + 1, data.pageable.pageSize);
    });
}