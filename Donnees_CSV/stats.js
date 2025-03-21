document.addEventListener("DOMContentLoaded", function () {
    const csvFiles = {
        Annees: "./Donnees_CSV/Annees.csv",
        Artistes: "./Donnees_CSV/Artistes.csv",
        Compagnies: "./Donnees_CSV/Compagnies.csv",
        Episodes: "./Donnees_CSV/Episodes.csv",
        Generations: "./Donnees_CSV/Generations.csv",
        Numeros: "./Donnees_CSV/Numeros.csv",
        Sexes: "./Donnees_CSV/Sexes.csv",
        Tailles: "./Donnees_CSV/Tailles.csv",
        Titres: "./Donnees_CSV/Titres.csv"
    };

    function fetchCSV(file, callback) {
        Papa.parse(file, {
            download: true,
            header: true,
            complete: function (results) {
                callback(results.data);
            }
        });
    }

    function createBar(label, value, total) {
        const percentage = total ? Math.round((value / total) * 100) : 0;
        return `
            <div class="bar">
                <div class="label">${label} (${value})</div>
                <div class="progress">
                    <div class="progress-bar" style="width: ${percentage}%;">
                        ${percentage}%
                    </div>
                </div>
            </div>
        `;
    }

    function renderSection(title, data, keyField, valueField) {
        let total = 0;
        data.forEach(row => {
            total += parseInt(row[valueField]) || 0;
        });

        let bars = "";
        data.forEach(row => {
            const label = row[keyField] || "Sans nom";
            const value = parseInt(row[valueField]) || 0;
            bars += createBar(label, value, total);
        });

        return `
            <section>
                <h2>${title}</h2>
                ${bars}
            </section>
        `;
    }

    function loadAllCSVs() {
        const promises = Object.keys(csvFiles).map(key => {
            return new Promise((resolve) => {
                fetchCSV(csvFiles[key], data => resolve({ key, data }));
            });
        });

        Promise.all(promises).then(results => {
            const container = document.getElementById("stats-container");
            let html = "";

            results.forEach(({ key, data }) => {
                switch (key) {
                    case "Annees":
                        html += renderSection("Années", data, "Annee", "Nombre_de_titres");
                        break;
                    case "Artistes":
                        html += renderSection("Artistes", data, "Artiste", "Nombre_de_titres");
                        break;
                    case "Compagnies":
                        html += renderSection("Compagnies", data, "Compagnie", "Nombre_de_titres");
                        break;
                    case "Episodes":
                        html += renderSection("Épisodes", data, "Episode", "Nombre_de_titres");
                        break;
                    case "Generations":
                        html += renderSection("Générations", data, "Generation", "Nombre_de_titres");
                        break;
                    case "Numeros":
                        html += renderSection("Numéros", data, "Numero", "Nombre_de_titres");
                        break;
                    case "Sexes":
                        html += renderSection("Sexes", data, "Sexe", "Nombre_de_titres");
                        break;
                    case "Tailles":
                        html += renderSection("Tailles", data, "Taille", "Nombre_de_titres");
                        break;
                    case "Titres":
                        html += renderSection("Titres", data, "Titre", "Moyenne");
                        break;
                }
            });

            container.innerHTML = html;
        });
    }

    loadAllCSVs();
});
