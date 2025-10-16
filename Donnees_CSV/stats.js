// stats.js (version unique CSV : _Table_XXL.csv)
// -------------------------------------------------
// Lecture du CSV et regroupement dynamique.
// Calcul des moyennes selon ta définition.
// Couleurs : bleu (#00C5D5), violet (#8A6ACE), rose (#FF67F1)
// -------------------------------------------------

// Fonction pour charger un fichier CSV et le transformer en tableau d'objets
async function loadCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    let rows = text.split('\n').map(row => row.split(','));
    // Supprimer la dernière ligne si elle est vide
    if (rows.length > 1 && rows[rows.length - 1].every(cell => cell.trim() === '')) {
        rows.pop();
    }
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, index) => {
            obj[headers[index]] = cell === undefined ? '' : cell.trim();
        });
        return obj;
    });
}

// Fonction utilitaire : convertit en nombre si possible, sinon retourne null
function toNumberOrNull(value) {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'null') return null;
    const n = parseFloat(trimmed.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
}

// Fonction pour exclure les occurrences peu fréquentes (Nombre_de_titres <= 4)
function filterFrequentOccurrences(groupedData, excludeRare) {
    if (!excludeRare) return groupedData;
    return groupedData.filter(item => item.Nombre_de_titres > 4);
}

// Palette de couleurs (inchangée pour les charts généraux)
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
    if (numColors < 3) {
        return ["#1BB8FF", "#FFFF09", "#F10700"];
    } else if (numColors <= 5) {
        return miniColors.slice(0, numColors);
    } else if (numColors <= 12) {
        return subsetColors.slice(0, numColors);
    } else {
        return allColors.slice(0, numColors);
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
                    font: { size: 18 }
                },
                legend: { display: true, position: 'top' }
            }
        }
    };
    new Chart(canvas, config);
    return canvas;
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
                    font: { size: 18 }
                },
                legend: { display: false }
            },
            scales: { y: { beginAtZero: true } }
        }
    };
    new Chart(canvas, config);
    return canvas;
}

// Fonction pour créer un LineChart avec 3 courbes : totale (violet), anciens (rose), nouveaux (bleu)
function createLineChart(moyenneTotale, moyenneAnciens, moyenneNouveaux, labels, dataset) {
    const couleurs = {
        bleu: "#00C5D5",      // nouveaux fans
        violet: "#8A6ACE",    // moyenne totale
        rose: "#FF67F1"       // anciens fans
    };
    const canvas = document.createElement('canvas');
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Moyenne totale',
                    data: moyenneTotale,
                    backgroundColor: couleurs.violet,
                    borderColor: couleurs.violet,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Moyenne - Anciens fans',
                    data: moyenneAnciens,
                    backgroundColor: couleurs.rose,
                    borderColor: couleurs.rose,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Moyenne - Nouveaux fans',
                    data: moyenneNouveaux,
                    backgroundColor: couleurs.bleu,
                    borderColor: couleurs.bleu,
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
                    text: 'Moyenne des notes (Totale / Anciens / Nouveaux)',
                    font: { size: 18 }
                },
                legend: { display: true, position: 'top' }
            },
            scales: { y: { beginAtZero: true } }
        }
    };
    new Chart(canvas, config);
    return canvas;
}

// Fonction pour assombrir une couleur (utile pour les bordures)
function darkenColor(color) {
    let c = color.startsWith('#') ? color.substring(1) : color;
    let rgb = parseInt(c, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;
    r = Math.max(0, r - 30);
    g = Math.max(0, g - 30);
    b = Math.max(0, b - 30);
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${hex}`;
}

// Remplacements lisibles pour les noms de colonnes
const columnNameReplacements = {
    'Nombre_de_titres': 'Nombre de titres',
    'Moyenne_totale': 'Moyenne totale /10',
    'Moyenne_anciens_fans': 'Moyenne (Anciens fans) /10',
    'Moyenne_nouveaux_fans': 'Moyenne (Nouveaux fans) /10',
    'Annee': 'Année',
    'Generation': 'Génération',
    'Episode': 'Épisode',
    'Numero': 'Numéro',
    'Sous_unite': 'Sous-unité ?',
    'Featuring': 'Featuring ?',
    'key': 'Nom'
};

// Retourne le nom lisible d'une colonne
function getColumnName(originalColumnName) {
    return columnNameReplacements[originalColumnName] || originalColumnName;
}

// Crée un tableau HTML à partir des données groupées (tableau d'objets)
function createTable(data) {
    if (!data || data.length === 0) {
        const div = document.createElement('div');
        div.textContent = "Aucune donnée à afficher.";
        div.style.color = 'white';
        return div;
    }

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Colonnes que l'on veut afficher dans l'ordre
    const columns = ['key', 'Nombre_de_titres', 'Moyenne_totale', 'Moyenne_anciens_fans', 'Moyenne_nouveaux_fans'];

    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = getColumnName(col);
        th.onclick = () => sortTableByColumn(table, col);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    const tbody = document.createElement('tbody');

    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            let value = row[col];
            if (col === 'key') {
                td.textContent = value;
            } else if (value === null || value === undefined) {
                td.textContent = '';
            } else if (typeof value === 'number' && !Number.isInteger(value)) {
                td.textContent = value.toFixed(2);
            } else {
                td.textContent = value;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

// Fonction pour trier un tableau HTML (avec le mapping des en-têtes)
function sortTableByColumn(table, columnKey) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('th');
    let columnIndex = -1;
    headers.forEach((header, index) => {
        if (getColumnName(columnKey) === header.textContent.trim()) {
            columnIndex = index;
        }
    });
    if (columnIndex === -1) {
        // alternative : find by order (fallback)
        columnIndex = Array.from(headers).findIndex(h => h.textContent.trim() === getColumnName(columnKey));
        if (columnIndex === -1) return;
    }
    const currentSortOrder = headers[columnIndex].getAttribute('data-sort-order') || 'asc';
    const sortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    headers.forEach(header => header.removeAttribute('data-sort-order'));
    headers[columnIndex].setAttribute('data-sort-order', sortOrder);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex]?.textContent.trim();
        const cellB = b.cells[columnIndex]?.textContent.trim();
        const numA = parseFloat(cellA.replace(',', '.'));
        const numB = parseFloat(cellB.replace(',', '.'));
        const isNumA = !isNaN(numA) && cellA !== '';
        const isNumB = !isNaN(numB) && cellB !== '';
        if (!isNumA || !isNumB) {
            return sortOrder === 'asc'
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        } else {
            return sortOrder === 'asc'
                ? numA - numB
                : numB - numA;
        }
    });
    rows.forEach(row => tbody.appendChild(row));
}

// Mapping des valeurs du select vers les noms de colonnes réelles du CSV
const datasetToColumn = {
    'Annees': 'Annee',
    'Artistes': 'Artiste',
    'Compagnies': 'Compagnie',
    'Episodes': 'Episode',
    'Generations': 'Generation',
    'Numeros': 'Numero',
    'Sexes': 'Sexe',
    'Tailles': 'Taille',
    'Titres': 'Titre',
    'Types': 'Type'
};

// Fonction utilitaire : calcule la moyenne d'un tableau de nombres en ignorant les nulls
function average(values) {
    const valid = values.filter(v => v !== null && v !== undefined);
    if (valid.length === 0) return null;
    const sum = valid.reduce((a, b) => a + b, 0);
    return sum / valid.length;
}

// Fonction principale : regroupe les données par une colonne donnée et calcule métriques
function groupDataByColumn(rawData, columnName) {
    // rawData : tableau d'objets (lignes csv)
    // columnName : le nom réel de la colonne dans le CSV (ex: 'Annee', 'Artiste', ...)
    const groups = new Map();

    rawData.forEach(row => {
        const keyRaw = row[columnName];
        const key = (keyRaw === undefined || keyRaw === null || keyRaw === '') ? '(Vide)' : keyRaw;

        if (!groups.has(key)) {
            groups.set(key, {
                uniqueIds: new Set(), // pour compter le nombre de titres distincts (par 'Nombre')
                sumTotalNotes: [],    // tableau pour calc moyenne totale (on stocke valeurs, average() plus tard)
                sumAnciens: [],
                sumNouveaux: [],
                // éventuellement garder des infos brutes pour le tableau si besoin
            });
        }
        const g = groups.get(key);

        // compter l'identifiant unique du titre (colonne 'Nombre')
        const id = row['Nombre'];
        if (id !== undefined && id !== null && String(id).trim() !== '') {
            g.uniqueIds.add(String(id).trim());
        } else {
            // si pas d'id, on peut tenter avec le titre
            if (row['Titre'] !== undefined && String(row['Titre']).trim() !== '') {
                g.uniqueIds.add('titre:' + String(row['Titre']).trim());
            }
        }

        // Extraire les notes demandées : on suit strictement les colonnes de la vue
        const n2_andy = toNumberOrNull(row['Note_2_Andy']);
        const n1_anna = toNumberOrNull(row['Note_1_Anna']);
        const n1_gwen = toNumberOrNull(row['Note_1_Gwenola']);
        const n1_laurana = toNumberOrNull(row['Note_1_Laurana']);
        const n2_laurana = toNumberOrNull(row['Note_2_Laurana']);
        const n1_melyssa = toNumberOrNull(row['Note_1_Melyssa']);
        const n2_melyssa = toNumberOrNull(row['Note_2_Melyssa']); // non utilisé mais présent

        // Moyenne totale = Note_2_Andy, Note_1_Anna, Note_1_Gwenola, Note_2_Laurana, Note_1_Melyssa
        [n2_andy, n1_anna, n1_gwen, n2_laurana, n1_melyssa].forEach(v => {
            if (v !== null) g.sumTotalNotes.push(v);
        });

        // Moyenne anciens fans = Note_1_Anna, Note_1_Gwenola, Note_1_Melyssa
        [n1_anna, n1_gwen, n1_melyssa].forEach(v => {
            if (v !== null) g.sumAnciens.push(v);
        });

        // Moyenne nouveaux fans = Note_2_Andy, Note_2_Laurana
        [n2_andy, n2_laurana].forEach(v => {
            if (v !== null) g.sumNouveaux.push(v);
        });
    });

    // Construire le tableau final
    const result = [];
    groups.forEach((value, key) => {
        const nombreTitres = value.uniqueIds.size;
        const moyenneTotale = value.sumTotalNotes.length > 0 ? average(value.sumTotalNotes) : null;
        const moyenneAnciens = value.sumAnciens.length > 0 ? average(value.sumAnciens) : null;
        const moyenneNouveaux = value.sumNouveaux.length > 0 ? average(value.sumNouveaux) : null;

        result.push({
            key: key,
            Nombre_de_titres: nombreTitres,
            Moyenne_totale: moyenneTotale,
            Moyenne_anciens_fans: moyenneAnciens,
            Moyenne_nouveaux_fans: moyenneNouveaux
        });
    });

    // Trier le résultat par Nombre_de_titres descendant par défaut (pour affichage)
    result.sort((a, b) => b.Nombre_de_titres - a.Nombre_de_titres);
    return result;
}

// Gestion des éléments DOM existants
const select = document.getElementById('datasetSelect');
const checkbox = document.getElementById('excludeRare');
const chartsContainer = document.getElementById('charts-container');
const tableContainer = document.getElementById('table-container');

// Fonction principale unique pour charger et afficher les données
async function updateDisplay() {
    const dataset = select.value;
    const exclude = checkbox.checked;

    // S'il y a l'option "Titres", on garde le comportement : checkbox désactivée
    if (dataset === "Titres") {
        if (checkbox.checked) {
            checkbox.checked = false;
        }
        checkbox.disabled = true;
    } else {
        checkbox.disabled = false;
    }

    // Chargement du CSV unique
    const rawData = await loadCSV(`./Donnees_CSV/_Table_XXL.csv`);

    // Trouver la colonne réelle correspondant au dataset
    const columnName = datasetToColumn[dataset];
    if (!columnName) {
        chartsContainer.innerHTML = '';
        tableContainer.innerHTML = '';
        const msg = document.createElement('div');
        msg.textContent = `Dataset inconnu : ${dataset}`;
        msg.style.color = 'white';
        tableContainer.appendChild(msg);
        return;
    }

    // Regrouper et calculer
    let grouped = groupDataByColumn(rawData, columnName);

    // Si on veut exclure les occurrences peu fréquentes (seuil > 4)
    grouped = filterFrequentOccurrences(grouped, exclude);

    // Préparer les labels et séries
    const labels = grouped.map(row => row.key);
    const counts = grouped.map(row => row.Nombre_de_titres);
    const moyennesTotales = grouped.map(row => row.Moyenne_totale !== null ? parseFloat(row.Moyenne_totale) : null);
    const moyennesAnciens = grouped.map(row => row.Moyenne_anciens_fans !== null ? parseFloat(row.Moyenne_anciens_fans) : null);
    const moyennesNouveaux = grouped.map(row => row.Moyenne_nouveaux_fans !== null ? parseFloat(row.Moyenne_nouveaux_fans) : null);

    // Choix des couleurs
    let chartColors;
    if (dataset === "Sexes") {
        chartColors = ['#F100BF', '#1BB8FF'];
    } else {
        chartColors = getChartColors(Math.max(3, grouped.length));
    }

    // Vider les containers
    chartsContainer.innerHTML = '';
    tableContainer.innerHTML = '';

    // Décider des graphiques à afficher en fonction du dataset
    const datasetsWithPie = ["Annees", "Generations", "Sexes", "Tailles", "Compagnies", "Types"];
    if (datasetsWithPie.includes(dataset)) {
        const pieChart = createPieChart(counts, labels, dataset, chartColors);
        chartsContainer.appendChild(pieChart);

        const barChart = createBarChart(moyennesTotales.map(v => v === null ? 0 : v), labels, dataset, chartColors);
        chartsContainer.appendChild(barChart);

        const lineChart = createLineChart(
            moyennesTotales.map(v => v === null ? null : v),
            moyennesAnciens.map(v => v === null ? null : v),
            moyennesNouveaux.map(v => v === null ? null : v),
            labels,
            dataset
        );
        chartsContainer.appendChild(lineChart);
    } else if (["Episodes", "Numeros"].includes(dataset)) {
        const barChart = createBarChart(moyennesTotales.map(v => v === null ? 0 : v), labels, dataset, chartColors);
        const lineChart = createLineChart(
            moyennesTotales.map(v => v === null ? null : v),
            moyennesAnciens.map(v => v === null ? null : v),
            moyennesNouveaux.map(v => v === null ? null : v),
            labels,
            dataset
        );
        chartsContainer.appendChild(barChart);
        chartsContainer.appendChild(lineChart);
    } else if (dataset === "Titres") {
        // Pour 'Titres' : on va afficher le barChart / lineChart éventuellement
        const barChart = createBarChart(moyennesTotales.map(v => v === null ? 0 : v), labels, dataset, chartColors);
        chartsContainer.appendChild(barChart);
        const lineChart = createLineChart(
            moyennesTotales.map(v => v === null ? null : v),
            moyennesAnciens.map(v => v === null ? null : v),
            moyennesNouveaux.map(v => v === null ? null : v),
            labels,
            dataset
        );
        chartsContainer.appendChild(lineChart);
    } else {
        // Fallback : affiche bar + line
        const barChart = createBarChart(moyennesTotales.map(v => v === null ? 0 : v), labels, dataset, chartColors);
        chartsContainer.appendChild(barChart);
        const lineChart = createLineChart(
            moyennesTotales.map(v => v === null ? null : v),
            moyennesAnciens.map(v => v === null ? null : v),
            moyennesNouveaux.map(v => v === null ? null : v),
            labels,
            dataset
        );
        chartsContainer.appendChild(lineChart);
    }

    // Ajouter la heatmap uniquement pour "Episodes" (inchangé)
    if (dataset === "Episodes") {
        const heatmapImage = document.createElement('img');
        heatmapImage.src = './Donnees_CSV/HeatMap-Ep1a20.png';
        heatmapImage.alt = 'Heatmap Episodes';
        heatmapImage.style.width = '100%';
        heatmapImage.style.margin = '20px 0';
        chartsContainer.appendChild(heatmapImage);
    }

    // Créer et afficher le tableau, triable
    const table = createTable(grouped);
    tableContainer.appendChild(table);
}

// Écouteurs d'événements
select.addEventListener('change', updateDisplay);
checkbox.addEventListener('change', updateDisplay);

// Chargement initial
updateDisplay();
