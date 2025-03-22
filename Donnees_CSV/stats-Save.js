// Fonction pour charger un fichier CSV et le transformer en tableau d'objets
async function loadCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    const rows = text.split('\n').map(row => row.split(','));
    const headers = rows[0];
    return rows.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, index) => {
            obj[headers[index].trim()] = cell.trim();
        });
        return obj;
    });
}

// Fonction pour exclure les occurrences peu fréquentes (Nombre_de_titres <= 4)
function filterFrequentOccurrences(data, excludeRare) {
    if (excludeRare) {
        return data.filter(row => parseInt(row.Nombre_de_titres) > 4);
    }
    return data;
}

// Fonction pour afficher un graphique en camembert
function createPieChart(data, labels, title) {
    const ctx = document.createElement('canvas');
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: ['#ff9999','#66b3ff','#99ff99','#ffcc99','#c2c2f0'],
            hoverBackgroundColor: ['#ff6666','#3399ff','#66ff66','#ff9966','#9999ff'],
        }]
    };
    new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' titres';
                        }
                    }
                }
            }
        }
    });
    return ctx;
}

// Fonction pour afficher un graphique en barres
function createBarChart(data, labels, title) {
    const ctx = document.createElement('canvas');
    const chartData = {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            backgroundColor: '#4e73df',
            borderColor: '#2e59d9',
            borderWidth: 1
        }]
    };
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' titres';
                        }
                    }
                }
            }
        }
    });
    return ctx;
}

// Fonction pour créer un tableau HTML
function createTable(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        th.onclick = () => sortTableByColumn(table, key);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    return table;
}

// Fonction pour trier un tableau HTML
function sortTableByColumn(table, columnKey) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('th');
    let columnIndex = -1;

    headers.forEach((header, index) => {
        if (header.textContent.trim() === columnKey) {
            columnIndex = index;
        }
    });
    if (columnIndex === -1) return;

    const currentSortOrder = headers[columnIndex].getAttribute('data-sort-order') || 'asc';
    const sortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    headers.forEach(header => header.removeAttribute('data-sort-order'));
    headers[columnIndex].setAttribute('data-sort-order', sortOrder);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex]?.textContent.trim();
        const cellB = b.cells[columnIndex]?.textContent.trim();

        if (isNaN(cellA) || isNaN(cellB)) {
            return sortOrder === 'asc'
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        } else {
            return sortOrder === 'asc'
                ? parseFloat(cellA) - parseFloat(cellB)
                : parseFloat(cellB) - parseFloat(cellA);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

// Gestion des événements
const select = document.getElementById('datasetSelect');
const checkbox = document.getElementById('excludeRare');
const chartsContainer = document.getElementById('charts-container');
const tableContainer = document.getElementById('table-container');

// Fonction principale pour charger et afficher les données
async function updateDisplay() {
    const dataset = select.value;
    const exclude = checkbox.checked;

    const data = await loadCSV(`./Donnees_CSV/${dataset}.csv`);
    const filteredData = filterFrequentOccurrences(data, exclude);

    // Reset containers
    chartsContainer.innerHTML = '';
    tableContainer.innerHTML = '';

    const labels = filteredData.map(row => row[dataset.slice(0, -1)]);
    const counts = filteredData.map(row => parseInt(row.Nombre_de_titres));

    if (dataset === "Annees" || dataset === "Numeros" || dataset === "Episodes") {
        chartsContainer.appendChild(createBarChart(counts, labels, dataset));
    } else {
        chartsContainer.appendChild(createPieChart(counts, labels, dataset));
    }

    const table = createTable(filteredData);
    tableContainer.appendChild(table);
}

// Event listeners
select.addEventListener('change', updateDisplay);
checkbox.addEventListener('change', updateDisplay);

// Initialisation
updateDisplay();
