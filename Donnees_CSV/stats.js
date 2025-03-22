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

// Fonction pour afficher un graphique en camembert (pie chart)
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
                legend: {
                    position: 'top',
                },
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

// Fonction pour afficher un graphique en barres (bar chart)
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
            scales: {
                y: {
                    beginAtZero: true
                }
            },
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

// Fonction pour générer un tableau HTML à partir des données CSV
function createTable(data) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Créer les en-têtes du tableau
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;

        // Ajouter un gestionnaire de clic pour trier la colonne
        th.onclick = () => sortTableByColumn(table, key);

        // Ajouter l’en-tête au tableau
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Créer un élément <tbody> pour ajouter les lignes de données
    const tbody = document.createElement('tbody');

    // Ajouter les données
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);  // Ajouter la ligne au <tbody>
    });

    // Ajouter le <tbody> à la table
    table.appendChild(tbody);

    return table;
}

// Fonction pour trier un tableau HTML par colonne
function sortTableByColumn(table, columnKey) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));  // Récupérer toutes les lignes du tbody
    const columnIndex = Object.keys(data[0]).indexOf(columnKey);  // Trouver l'index de la colonne en fonction du nom

    // Alternance entre tri ascendant et descendant
    let sortOrder = table.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';
    table.setAttribute('data-sort-order', sortOrder);  // Changer l'ordre de tri pour la prochaine fois

    // Trier les lignes en fonction de la colonne
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();  // Récupérer la valeur de la cellule de la colonne
        const cellB = b.cells[columnIndex].textContent.trim();  // Récupérer la valeur de la cellule de la colonne

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

    // Vider le tbody existant
    tbody.innerHTML = '';

    // Réinsérer les lignes triées dans le tbody
    rows.forEach(row => tbody.appendChild(row));

    // Gérer l'affichage des flèches de tri
    updateSortingArrows(table, columnKey, sortOrder);
}

// Fonction pour mettre à jour les flèches de tri
function updateSortingArrows(table, columnKey, sortOrder) {
    const headers = table.querySelectorAll('th');
    
    // Supprimer les flèches existantes
    headers.forEach(header => {
        const arrow = header.querySelector('.sort-arrow');
        if (arrow) {
            header.removeChild(arrow);
        }
    });

    // Ajouter la flèche pour la colonne triée
    const th = Array.from(headers).find(header => header.textContent.trim() === columnKey);
    const arrow = document.createElement('span');
    arrow.classList.add('sort-arrow');
    arrow.textContent = sortOrder === 'asc' ? '▲' : '▼';  // Flèche ascendant ou descendant
    th.appendChild(arrow);
}

// Fonction principale pour gérer les différentes options
async function handleDatasetChange(event) {
    const datasetSelect = document.getElementById('datasetSelect');
    const selectedDataset = datasetSelect.value;
    const excludeRare = document.getElementById('excludeRare').checked;
    let data;

    // Charger les données du CSV approprié
    switch (selectedDataset) {
        case 'Annees':
            data = await loadCSV('./Donnees_CSV/Annees.csv');
            break;
        case 'Artistes':
            data = await loadCSV('./Donnees_CSV/Artistes.csv');
            break;
        case 'Compagnies':
            data = await loadCSV('./Donnees_CSV/Compagnies.csv');
            break;
        case 'Episodes':
            data = await loadCSV('./Donnees_CSV/Episodes.csv');
            break;
        case 'Generations':
            data = await loadCSV('./Donnees_CSV/Generations.csv');
            break;
        case 'Numeros':
            data = await loadCSV('./Donnees_CSV/Numeros.csv');
            break;
        case 'Sexes':
            data = await loadCSV('./Donnees_CSV/Sexes.csv');
            break;
        case 'Tailles':
            data = await loadCSV('./Donnees_CSV/Tailles.csv');
            break;
        case 'Titres':
            data = await loadCSV('./Donnees_CSV/Titres.csv');
            break;
    }

    // Appliquer le filtre pour exclure les occurrences peu fréquentes
    data = filterFrequentOccurrences(data, excludeRare);

    // Créer les graphiques et tableaux en fonction des données
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = '';  // Effacer les anciens graphiques et tableaux

    let chartContainer;
    if (selectedDataset === 'Episodes') {
        // Ajouter une image pour les épisodes
        const image = document.createElement('img');
        image.src = './images/episode-image.jpg';  // Remplace par le nom de ton image
        chartsContainer.appendChild(image);
    }

    // Créer un graphique en camembert pour les options avec moins de 50 lignes
    if (['Annees', 'Artistes', 'Compagnies', 'Episodes', 'Generations', 'Numeros', 'Sexes', 'Tailles'].includes(selectedDataset)) {
        const labels = data.map(row => row[Object.keys(row)[0]]);
        const values = data.map(row => parseInt(row.Nombre_de_titres));
        chartContainer = createPieChart(values, labels, 'Nombre de titres');
        chartsContainer.appendChild(chartContainer);
    }

    // Créer un graphique en barres pour MOYENNE_TOTALE
    const moyenneLabels = data.map(row => row[Object.keys(row)[0]]);
    const moyenneValues = data.map(row => parseFloat(row.MOYENNE_TOTALE));
    chartContainer = createBarChart(moyenneValues, moyenneLabels, 'Moyenne totale');
    chartsContainer.appendChild(chartContainer);

    // Créer un tableau
    const table = createTable(data);
    chartsContainer.appendChild(table);
}

// Initialiser les événements et charger les données au chargement de la page
document.getElementById('datasetSelect').addEventListener('change', handleDatasetChange);

// Initialisation
window.onload = async () => {
    await handleDatasetChange({ target: { value: 'Annees' } });  // Charge les données de départ (ex: Annees)
};
