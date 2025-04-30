// Fonction pour charger un fichier CSV et le transformer en tableau d'objets, en excluant certaines colonnes
async function loadCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    let rows = text.split('\n').map(row => row.split(','));

    // Supprimer la dernière ligne si elle est vide
    if (rows.length > 1 && rows[rows.length - 1].every(cell => cell.trim() === '')) {
        rows.pop();
    }

    const headers = rows[0].map(h => h.trim());
    const excludedColumns = ["Mediane", "Note_la_plus_frequente"];
    
    // Indices des colonnes à inclure
    const includedIndices = headers
        .map((header, index) => ({ header, index }))
        .filter(h => !excludedColumns.includes(h.header))
        .map(h => h.index);

    return rows.slice(1).map(row => {
        let obj = {};
        includedIndices.forEach(index => {
            obj[headers[index]] = row[index] ? row[index].trim() : "";
        });
        return obj;
    });
}

// Fonction pour exclure les occurrences peu fréquentes (Nombre_de_notes <= 4)
function filterFrequentOccurrences(data, data_global, excludeRare) {
    if (excludeRare) {
        const filteredData = data.filter(row => parseInt(row.Nombre_de_notes) > 4);
        const filteredGlobal = data_global.filter(row => parseInt(row.Nombre_de_titres) > 4);
        return [filteredData, filteredGlobal];
    }
    return [data, data_global];
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
    const miniColors = [
        "#0000F1", "#8AFF87", "#FFFF09", "#F10700", "#AD00F1"
    ];
    if (numColors <= 3) {
        return ["#1BB8FF", "#FFFF09", "#F10700"]; // Moins de 3 couleurs
    } else if (numColors <= 5) {
        return miniColors.slice(0, numColors); // Moins de 5 mais plus que 3 couleurs
    } else if (numColors <= 12) {
        return subsetColors.slice(0, numColors); // Moins de 12 mais plus que 5 couleurs
    } else {
        return allColors; // Plus de 12 couleurs
    }
}

// Fonction pour créer un PieChart
function createPieChart(data, labels, dataset, colors) {
    const canvas = document.createElement('canvas');
    const config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Nombre de titres',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    };
    new Chart(canvas, config);
    return canvas; // On retourne le canvas
}

// Fonction pour créer un BarChart
function createBarChart(data, labels, dataset, colors) {
    const canvas = document.createElement('canvas');
    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne des notes',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => darkenColor(c)),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Moyenne des notes',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    new Chart(canvas, config);
    return canvas;
}

// Fonction pour créer un LineChart
function createLineChart(notes, global_note, labels, dataset) {
    const Couleurs = [
        "#00c5d5", // Note
        "#8a6ace"  // Moyenne globale
    ];
    const canvas = document.createElement('canvas');
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Note',
                    data: notes,
                    backgroundColor: Couleurs[0],
                    borderColor: Couleurs[0],
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Moyenne globale',
                    data: global_note,
                    backgroundColor: Couleurs[1],
                    borderColor: Couleurs[1],
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparaison Perso VS Global',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    new Chart(canvas, config);
    return canvas;
}

// Fonction pour assombrir une couleur (utile pour les bordures)
function darkenColor(color) {
    let c = color.substring(1);
    let rgb = parseInt(c, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;
    r = Math.max(0, r - 30);
    g = Math.max(0, g - 30);
    b = Math.max(0, b - 30);
    return `#${(1 << 24) + (r << 16) + (g << 8) + b}`.toString(16).slice(1);
}

// Object de remplacement pour les noms de colonnes
const columnNameReplacements = {
    'Nombre_de_titres': 'Nombre de titres',
    'Nombre_de_notes': 'Nombre de titres',
    'Note': 'Note /10',
    'Moyenne_Totale': 'Moyenne totale /10',
    'Video_Youtube': 'Vidéo Youtube',
    'Moyenne': 'Moyenne /10',
    'Minimum': 'Minimum /10',
    'Maximum': 'Maximum /10',
    'Annee': 'Année',
    'Generation': 'Génération',
    'Episode': 'Épisode',
    'Numero': 'Numéro',
    'Sous_unite': 'Sous-unité ?',
    'Featuring': 'Featuring ?'
};

// Fonction pour remplacer les noms de colonnes
function getColumnName(originalColumnName) {
    return columnNameReplacements[originalColumnName] || originalColumnName;
}

// Fonction pour créer un tableau HTML
function createTable(data, data_global, youtube, dataset) {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Ajouter les colonnes de "data"
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = getColumnName(key);
        th.onclick = () => sortTableByColumn(table, key);
        headerRow.appendChild(th);
    });

    // Ajouter la colonne "Moyenne_totale" de "data_global"
    const moyenneTotaleTh = document.createElement('th');
    moyenneTotaleTh.textContent = "Moyenne Totale";
    headerRow.appendChild(moyenneTotaleTh);

    if (dataset === "Episode") {
        // Ajouter la colonne "Video_Youtube" de "youtube"
        const videoYoutubeTh = document.createElement('th');
        videoYoutubeTh.textContent = "Vidéo YouTube";
        headerRow.appendChild(videoYoutubeTh);
    
        table.appendChild(headerRow);
    
        const tbody = document.createElement('tbody');
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
    
            // Ajouter la colonne "Moyenne_totale" de "data_global"
            const tdMoyenneTotale = document.createElement('td');
            tdMoyenneTotale.textContent = data_global[index].Moyenne_totale;
            tr.appendChild(tdMoyenneTotale);
    
            // Ajouter la colonne "Video_Youtube" de "youtube"
            const tdVideoYoutube = document.createElement('td');
            const youtubeVideoUrl = youtube[index] ? youtube[index].Video_Youtube : "";
            if (youtubeVideoUrl.startsWith("http")) {
                const a = document.createElement('a');
                a.href = youtubeVideoUrl;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                // Création de l'élément image avec le logo YouTube
                const img = document.createElement('img');
                img.src = "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"; // URL du logo YouTube
                img.alt = "YouTube";
                img.style.width = "21px"; // Taille du logo (ajustable)
                img.style.height = "15px"; // Taille du logo (ajustable)
                img.style.cursor = "pointer"; // Changer le curseur pour une meilleure expérience utilisateur
                a.appendChild(img); // Ajouter l'image au lien
                tdVideoYoutube.appendChild(a); // Ajouter le lien (contenant l'image) à la cellule
            } else {
                tdVideoYoutube.textContent = "Aucun lien vidéo"; // Cas où il n'y a pas de vidéo
            }
            tr.appendChild(tdVideoYoutube);
    
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }
        return table;
}



// Fonction pour trier un tableau HTML
function sortTableByColumn(table, columnKey) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('th');
    let columnIndex = -1;
    headers.forEach((header, index) => {
        if (getColumnName(columnKey) === header.textContent.trim()) {
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

// Fonction principale unique pour charger et afficher les données
async function updateDisplay() {
    const dataset = select.value;
    const exclude = checkbox.checked;
    /*
    const usernameDisplay = document.getElementById("username-display");
    const username = usernameDisplay.textContent;
    */
    const username = "Laurana";
    let data;
    const data_global = await loadCSV(`./Donnees_CSV/${dataset}.csv`);
    const youtube = await loadCSV(`./Donnees_CSV/Youtube.csv`);
    if (username === "Laurana") {
        data = await loadCSV(`./Donnees_CSV/Laurana/Laurana_Stats_${dataset}.csv`);
    } else {
        data = await loadCSV(`./Donnees_CSV/_${username}/${username}_Stats_${dataset}.csv`);
    }
    const [filteredData, filteredDataGlobal] = filterFrequentOccurrences(data, data_global, exclude);
    // Désactive ou active la checkbox en fonction du dataset sélectionné
    if (dataset === "Titres") {
        if (checkbox.checked) {
            checkbox.checked = false;
            checkbox.disabled = true;
            updateDisplay(); // Relance l'affichage en "mode Titres" sans la case cochée
            return; 
        } else {
            checkbox.disabled = true;
        }
    } else {
        checkbox.disabled = false;
    }
    chartsContainer.innerHTML = '';
    tableContainer.innerHTML = '';
    const labels = filteredData.map(row => row[dataset.slice(0, -1)]);
    const counts = filteredData.map(row => parseInt(row.Nombre_de_notes));
    const averages = filteredData.map(row => parseFloat(row.Moyenne));
    const notes = filteredData.map(row => parseFloat(row.Note));
    const global_data = filteredDataGlobal.map(row => parseFloat(row.Moyenne_Totale));
    let chartColors;
    if (dataset === "Sexes") {
        chartColors = ['#F100BF', '#1BB8FF'];
    } else {
        chartColors = getChartColors(filteredData.length);
    }
    // Changement des titres et légendes selon le dataset
    if (
        ["Annees", "Generations", "Sexes", "Tailles"].includes(dataset) ||
        (dataset === "Compagnies" && exclude)
    ) {
        const pieChart = createPieChart(counts, labels, dataset, chartColors);
        if (dataset === "Sexes") {
            pieChart.title = "Répartition du nombre de titres par sexe";
        } else if (dataset === "Annees") {
            pieChart.title = "Répartition du nombre de titres par année";
        } else if (dataset === "Generations") {
            pieChart.title = "Répartition du nombre de titres par génération";
        } else if (dataset === "Tailles") {
            pieChart.title = "Répartition du nombre de titres par taille de groupe";
        } else if (dataset === "Compagnies") {
            pieChart.title = "Répartition du nombre de titres par compagnie";
        }
        chartsContainer.appendChild(pieChart);
        const barChart = createBarChart(averages, labels, dataset, chartColors);
        if (dataset === "Sexes") {
            barChart.title = "Moyenne des notes par sexe";
        } else if (dataset === "Annees") {
            barChart.title = "Moyenne des notes par année";
        } else if (dataset === "Generations") {
            barChart.title = "Moyenne des notes par génération";
        } else if (dataset === "Tailles") {
            barChart.title = "Moyenne des notes par taille de groupe";
        } else if (dataset === "Compagnies") {
            barChart.title = "Moyenne des notes par compagnie";
        }
        chartsContainer.appendChild(barChart);
        const lineChart = createLineChart(averages, global_data, labels, dataset);
        if (dataset === "Sexes") {
            lineChart.title = "Moyenne des notes par sexe";
        } else if (dataset === "Annees") {
            lineChart.title = "Moyenne des notes par année";
        } else if (dataset === "Generations") {
            lineChart.title = "Moyenne des notes par génération";
        } else if (dataset === "Tailles") {
            lineChart.title = "Moyenne des notes par taille de groupe";
        } else if (dataset === "Compagnies") {
            lineChart.title = "Moyenne des notes par compagnie";
        }
        chartsContainer.appendChild(lineChart);
    } else if (["Episodes", "Numeros"].includes(dataset)) {
        const barChart = createBarChart(averages, labels, dataset, chartColors);
        const lineChart = createLineChart(averages, global_data, labels, dataset);
        if (dataset === "Episodes") {
            barChart.title = "Moyenne des notes par épisode";
            lineChart.title = "Moyenne des notes par épisode";
        } else if (dataset === "Numeros") {
            barChart.title = "Moyenne des notes par numéro";
            lineChart.title = "Moyenne des notes par numéro";
        }
        chartsContainer.appendChild(barChart);
        chartsContainer.appendChild(lineChart);
    }
    // Ajouter l'image uniquement pour "Episodes"
    if (dataset === "Episodes") {
        const heatmapImage = document.createElement('img');
        heatmapImage.src = './Donnees_CSV/HeatMap-Ep1a20.png';
        heatmapImage.alt = 'Heatmap Episodes';
        heatmapImage.style.width = '100%';
        heatmapImage.style.margin = '20px 0';
        chartsContainer.appendChild(heatmapImage);
    }
    const table = createTable(filteredData, filteredDataGlobal, youtube, dataset);
    tableContainer.appendChild(table);
}
select.addEventListener('change', updateDisplay);
checkbox.addEventListener('change', updateDisplay);

// Chargement initial
updateDisplay();
