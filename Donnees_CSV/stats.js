document.addEventListener("DOMContentLoaded", () => {
    const datasetSelect = document.getElementById("datasetSelect");
    const excludeRareCheckbox = document.getElementById("excludeRare");
    const chartsContainer = document.getElementById("charts-container");

    // Données CSV mockées pour l'exemple
    const mockData = {
        Annees: { "2018": 12, "2019": 8, "2020": 15, "2021": 20 },
        Artistes: { "BTS": 10, "Blackpink": 7, "Twice": 5, "ITZY": 3 },
        Compagnies: { "SM": 12, "YG": 8, "JYP": 10 },
        Episodes: { "1": 4, "2": 5, "3": 8, "4": 3 },
        Generations: { "2nd Gen": 6, "3rd Gen": 12, "4th Gen": 10 },
        Numeros: { "1": 6, "2": 2, "3": 5, "4": 7 },
        Sexes: { "Féminin": 20, "Masculin": 15 },
        Tailles: { "Solo": 10, "Duo": 5, "Groupe": 12 },
        Titres: { "Dynamite": 4, "LALISA": 3, "Feel Special": 2, "Next Level": 1 }
    };

    const disableCheckboxFor = ["Sexes", "Titres", "Episodes", "Numeros"];

    datasetSelect.addEventListener("change", () => {
        const selected = datasetSelect.value;
        // Activation ou non de la case à cocher
        if (disableCheckboxFor.includes(selected)) {
            excludeRareCheckbox.disabled = true;
            excludeRareCheckbox.checked = false;
        } else {
            excludeRareCheckbox.disabled = false;
        }
        renderCharts(selected);
    });

    excludeRareCheckbox.addEventListener("change", () => {
        renderCharts(datasetSelect.value);
    });

    function renderCharts(dataset) {
        chartsContainer.innerHTML = ""; // On nettoie avant d'afficher de nouveaux graphiques
        let data = { ...mockData[dataset] };

        if (excludeRareCheckbox.checked) {
            // Filtrage des occurrences < 3 pour l'exemple
            data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v >= 3));
        }

        const labels = Object.keys(data);
        const values = Object.values(data);

        // Création de plusieurs types de graphiques
        createChart("bar", labels, values, "Graphique en barres");
        createChart("pie", labels, values, "Camembert");
        createChart("line", labels, values, "Courbe");
        createChart("radar", labels, values, "Radar");
        createChart("polarArea", labels, values, "Aire polaire");
    }

    function createChart(type, labels, data, title) {
        const canvas = document.createElement("canvas");
        chartsContainer.appendChild(canvas);

        new Chart(canvas, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#C9CBCF', '#B7E778', '#FFA1B5', '#6EDBFF'
                    ],
                    borderColor: '#333',
                    borderWidth: 1,
                    fill: type === "line" ? false : true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: type !== "bar" && type !== "line"
                    }
                },
                scales: (type === "bar" || type === "line") ? {
                    y: { beginAtZero: true }
                } : {}
            }
        });
    }

    // Génération initiale
    renderCharts(datasetSelect.value);
});
