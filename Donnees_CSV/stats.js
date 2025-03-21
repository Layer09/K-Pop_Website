document.addEventListener("DOMContentLoaded", function () {
    const datasetSelect = document.getElementById('datasetSelect');
    const excludeRareCheckbox = document.getElementById('excludeRare');
    const chartsContainer = document.getElementById('charts-container');

    const datasetFiles = {
        Annees: "Annees.csv",
        Artistes: "Artistes.csv",
        Compagnies: "Compagnies.csv",
        Episodes: "Episodes.csv",
        Generations: "Generations.csv",
        Numeros: "Numeros.csv",
        Sexes: "Sexes.csv",
        Tailles: "Tailles.csv",
        Titres: "Titres.csv"
    };

    datasetSelect.addEventListener('change', () => {
        loadCSV(datasetSelect.value);
        excludeRareCheckbox.disabled = datasetSelect.value !== "Artistes" && datasetSelect.value !== "Titres";
    });

    excludeRareCheckbox.addEventListener('change', () => {
        loadCSV(datasetSelect.value);
    });

    async function loadCSV(selectedDataset) {
        const fileName = datasetFiles[selectedDataset];
        const response = await fetch(`./Donnees_CSV/${fileName}`);
        const csvText = await response.text();
        const data = Papa.parse(csvText, { header: true }).data;

        const filteredData = excludeRareCheckbox.checked
            ? data.filter(row => parseInt(row.count) >= 3)
            : data;

        renderChart(filteredData, selectedDataset);
    }

    function renderChart(data, datasetName) {
        chartsContainer.innerHTML = ''; // Clear existing chart
        const canvas = document.createElement('canvas');
        chartsContainer.appendChild(canvas);

        const labels = data.map(row => row.label);
        const counts = data.map(row => parseInt(row.count));

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: datasetName,
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Chargement initial
    loadCSV(datasetSelect.value);
});
