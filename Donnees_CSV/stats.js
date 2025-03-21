document.addEventListener('DOMContentLoaded', () => {
    const excludeRareCheckbox = document.getElementById('excludeRare');
    const datasetSelect = document.getElementById('datasetSelect');
    const chartsContainer = document.getElementById('charts-container');
    const tableContainer = document.getElementById('table-container');

    let dataset = null; // To store data for the selected dataset

    // Fonction pour charger un fichier CSV
    function loadCSV(filePath) {
        return fetch(filePath)
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n').map(row => row.split(','));
                const header = rows[0];
                const data = rows.slice(1).map(row => {
                    let obj = {};
                    header.forEach((col, index) => {
                        obj[col.trim()] = row[index].trim();
                    });
                    return obj;
                });
                return data;
            });
    }

    // Fonction pour exclure les occurrences peu fréquentes
    function filterData(data) {
        return data.filter(row => parseInt(row.Nombre_de_titres) > 4);
    }

    // Fonction pour afficher les graphiques
    function displayCharts(data, type) {
        chartsContainer.innerHTML = ''; // Clear previous charts

        if (type === 'Annees' || type === 'Episodes' || type === 'Generations' || type === 'Numeros' || type === 'Sexes' || type === 'Titres') {
            const titlesData = data.map(row => parseInt(row.Nombre_de_titres));
            const labels = data.map(row => row[type]);

            // Camembert
            const pieCanvas = document.createElement('canvas');
            const pieChart = new Chart(pieCanvas, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: titlesData,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66b3ff', '#99ff99'],
                    }]
                },
                options: {
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
            chartsContainer.appendChild(pieCanvas);

            // Diagramme en barre
            const barCanvas = document.createElement('canvas');
            const barChart = new Chart(barCanvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'MOYENNE_TOTALE',
                        data: data.map(row => parseFloat(row.MOYENNE_TOTALE)),
                        backgroundColor: '#42A5F5',
                    }]
                },
                options: {
                    scales: {
                        x: { title: { display: true, text: type } },
                        y: { title: { display: true, text: 'MOYENNE_TOTALE' } }
                    },
                    responsive: true,
                }
            });
            chartsContainer.appendChild(barCanvas);

            // Si l'option est "Episodes", ajouter une image
            if (type === 'Episodes') {
                const image = document.createElement('img');
                image.src = './path/to/your/image.jpg'; // Remplace par le chemin de ton image
                chartsContainer.appendChild(image);
            }
        }
    }

    // Fonction pour afficher un tableau
    function displayTable(data) {
        tableContainer.innerHTML = ''; // Clear previous table
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = Object.keys(data[0]);

        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header;
            th.addEventListener('click', () => sortTable(header));
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(row => {
            const rowElement = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.innerText = row[header];
                rowElement.appendChild(td);
            });
            table.appendChild(rowElement);
        });

        tableContainer.appendChild(table);
    }

    // Fonction pour trier le tableau
    function sortTable(column) {
        dataset.sort((a, b) => {
            return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
        });
        displayTable(dataset);
    }

    // Lorsque l'utilisateur choisit un nouveau dataset
    datasetSelect.addEventListener('change', async () => {
        const selectedOption = datasetSelect.value;
        let filePath = `./Donnees_CSV/${selectedOption}.csv`;

        dataset = await loadCSV(filePath);
        if (excludeRareCheckbox.checked) {
            dataset = filterData(dataset);
        }

        displayCharts(dataset, selectedOption);
        displayTable(dataset);
    });

    // Initialisation
    datasetSelect.dispatchEvent(new Event('change'));
});
