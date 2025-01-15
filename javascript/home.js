export function loadHome() {
    console.log('loadHome function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Home Page</h1>
        <p>Eksamen Januar 2025</p>
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Navn:</td>
                        <td>Martin Poulsen</td>
                    </tr>
                    <tr>
                        <td>KEA Mail:</td>
                        <td>mapo0004@stud.kea.dk</td>
                    </tr>
                    <tr>
                        <td>Link til github:</td>
                        <td><a href="https://github.com/Mapo0004StudKea/Eksamen-Januar2025-Frontend">Frontend Link</a></td>
                    </tr>
                    <tr>
                        <td>Link til github:</td>
                        <td><a href="https://github.com/Mapo0004StudKea/Eksamen-Januar2025-Backend">Backend Link</a></td>
                    </tr>
                    <tr>    
                        <td>Link til opgave:</td>
                        <td><a href="https://kea-fronter.itslearning.com/ContentArea/ContentArea.aspx?LocationType=1&LocationID=6842&FromNotification=true">Opgave Beskrivelse</a></td>
                    </tr>
                    <tr>
                        <td>Beskrivelse:</td>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}