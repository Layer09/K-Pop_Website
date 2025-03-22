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

// Fonction pour définir les couleurs en fonction du nombre d'éléments nécessaires
function getChartColors(numColors) {
    const allColors = [
        "#0000F1", "#1BB8FF", "#40FFD2", "#8AFF87", "#D2FF40", "#FFFF09", 
        "#FFC400", "#FF6C00", "#F10700", "#F10371", "#F100BF", "#AD00F1"
    ];

    const subsetColors = [
        "#0000F1", "#40FFD2", "#8AFF87", "#FFFF09", "#FFC400", 
        "#F10700", "#F100BF", "#AD00F1"
    ];

    if (numColors < 3) {
        return ["#1BB8FF", "#FFFF09", "#F10700"]; // Moins de 3 couleurs
    } else if (numColors <= 12) {
        return subsetColors.slice(0, numColors); // Moins de 12 mais plus que 3 couleurs
    } else {
        return allColors; // Plus de 12 couleurs
    }
}

// Fonction principale pour charger et afficher les données
async function updateDisplay() {
    const dataset = select.value;
    const exclude = checkbox.checked;

    const data = await loadCSV(`./Donnees_CSV/${dataset}.csv`);
    const filteredData = filterFrequentOccurrences(data, exclude);

    // Vérifier si filteredData contient des données
    if (!filteredData || filteredData.length === 0) {
        console.error("Aucune donnée filtrée disponible.");
        return;
    }

    // Reset containers
    chartsContainer.innerHTML = '';
    tableContainer.innerHTML = '';

    // Vérification que les données sont bien définies avant de les mapper
    const labels = filteredData.map(row => row[dataset.slice(0, -1)]);
    const counts = filteredData.map(row => parseInt(row.Nombre_de_titres));
    const averages = filteredData.map(row => parseFloat(row.MOYENNE_TOTALE));

    // Vérification supplémentaire pour s'assurer que les données nécessaires sont présentes
    if (!labels || !counts || !averages || labels.length === 0 || counts.length === 0 || averages.length === 0) {
        console.error("Données manquantes ou invalides.");
        return;
    }

    const chartColors = getChartColors(filteredData.length); // Détermine les couleurs à utiliser

    // Conditions selon le dataset sélectionné
    if (dataset === "Annees" || dataset === "Generations" || dataset === "Compagnies" || dataset === "Sexes" || dataset === "Tailles") {
        // PieChart pour "Nombre_de_titres"
        const pieChart = createPieChart(counts, labels, dataset, chartColors);
        pieChart.title = "Nombre de titres"; // Titre du PieChart
        chartsContainer.appendChild(pieChart);

        // BarChart pour "MOYENNE_TOTALE"
        const barChart = createBarChart(averages, labels, dataset, chartColors);
        barChart.title = "Moyenne des notes"; // Titre du BarChart
        chartsContainer.appendChild(barChart);
    } else if (dataset === "Episodes" || dataset === "Numeros") {
        // BarChart uniquement pour "MOYENNE_TOTALE"
        const barChart = createBarChart(averages, labels, dataset, chartColors);
        barChart.title = "Moyenne des notes"; // Titre du BarChart
        chartsContainer.appendChild(barChart);
    }

    const table = createTable(filteredData);
    tableContainer.appendChild(table);
}

// Fonction pour créer un PieChart
function createPieChart(data, labels, dataset, colors) {
    const chart = new Chart(document.createElement('canvas'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => darkenColor(color)), // Optionnel pour ajouter une couleur de bordure
                borderWidth: 1
            }]
        }
    });
    chart.canvas.title = "Nombre de titres";
    return chart;
}

// Fonction pour créer un BarChart
function createBarChart(data, labels, dataset, colors) {
    const chart = new Chart(document.createElement('canvas'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne des notes',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => darkenColor(color)), // Optionnel pour ajouter une couleur de bordure
                borderWidth: 1
            }]
        }
    });
    chart.canvas.title = "Moyenne des notes";
    return chart;
}

// Fonction pour assombrir une couleur (utile pour les bordures)
function darkenColor(color) {
    let c = color.substring(1); // Retirer le "#"
    let rgb = parseInt(c, 16); // Convertir en nombre
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff;

    r = Math.max(0, r - 30); // Assombrir de manière uniforme
    g = Math.max(0, g - 30);
    b = Math.max(0, b - 30);

    return `#${(1 << 24) + (r << 16) + (g << 8) + b}.toString(16).slice(1)}`;
}

// Object de remplacement pour les noms de colonnes
const columnNameReplacements = {
    'Nombre_de_titres': 'Nombre de titres',
    'MOYENNE_TOTALE': 'Moyenne',
    // Ajoute d'autres remplacements si nécessaire
};

// Fonction pour remplacer les noms de colonnes
function getColumnName(originalColumnName) {
    return columnNameReplacements[originalColumnName] || originalColumnName;
}

// Fonction pour créer un tableau HTML
function createTable(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Remplacer les noms de colonnes dans l'en-tête
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = getColumnName(key);  // Remplace le nom de la colonne
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

// Fonction corrigée pour trier un tableau HTML
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

    // Vérifier si filteredData contient des données
    if (filteredData.length === 0) {
        console.error("Aucune donnée filtrée disponible.");
        return;
    }

    // Reset containers
    chartsContainer.innerHTML = '';
    tableContainer.innerHTML = '';

    const labels = filteredData.map(row => row[dataset.slice(0, -1)]);
    const counts = filteredData.map(row => parseInt(row.Nombre_de_titres));
    const averages = filteredData.map(row => parseFloat(row.MOYENNE_TOTALE));

    // Conditions selon le dataset sélectionné
    if (dataset === "Annees" || dataset === "Generations" || dataset === "Compagnies" || dataset === "Sexes" || dataset === "Tailles") {
        chartsContainer.appendChild(createPieChart(counts, labels, dataset)); // PieChart pour "Nombre_de_titres"
        chartsContainer.appendChild(createBarChart(averages, labels, dataset)); // BarChart pour "MOYENNE_TOTALE"
    } else if (dataset === "Episodes" || dataset === "Numeros") {
        chartsContainer.appendChild(createBarChart(averages, labels, dataset)); // BarChart uniquement pour "MOYENNE_TOTALE"
    }

    const table = createTable(filteredData);
    tableContainer.appendChild(table);
}

// Event listeners
select.addEventListener('change', updateDisplay);
checkbox.addEventListener('change', updateDisplay);

// Initialisation
updateDisplay();
