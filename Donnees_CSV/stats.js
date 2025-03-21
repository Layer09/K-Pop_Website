import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Radar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Papa from "papaparse";

const Graphiques = () => {
  const [selectedOption, setSelectedOption] = useState("Annees");
  const [excludeLowCounts, setExcludeLowCounts] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  const csvFiles = {
    Annees: "./Donnees_CSV/Annees.csv",
    Artistes: "./Donnees_CSV/Artistes.csv",
    Compagnies: "./Donnees_CSV/Compagnies.csv",
    Episodes: "./Donnees_CSV/Episodes.csv",
    Generations: "./Donnees_CSV/Generations.csv",
    Numeros: "./Donnees_CSV/Numeros.csv",
    Sexes: "./Donnees_CSV/Sexes.csv",
    Tailles: "./Donnees_CSV/Tailles.csv",
    Titres: "./Donnees_CSV/Titres.csv",
  };

  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch(csvFiles[selectedOption]);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        complete: (result) => {
          let labels = [];
          let values = [];

          result.data.forEach((row) => {
            if (selectedOption === "Titres") {
              labels.push(row["Titre"]);
              values.push(parseInt(row["Moyenne"]));
            } else {
              const labelKey = Object.keys(row)[0];
              const valueKey = "Nombre_de_titres";
              labels.push(row[labelKey] === "/Null/" ? "Sans compagnie" : row[labelKey]);
              values.push(parseInt(row[valueKey]));
            }
          });

          if (excludeLowCounts) {
            const filtered = labels.map((label, i) => ({ label, value: values[i] }))
              .filter((item) => item.value >= 2);
            labels = filtered.map((item) => item.label);
            values = filtered.map((item) => item.value);
          }

          setChartData({ labels, values });
        },
      });
    };

    fetchCSV();
  }, [selectedOption, excludeLowCounts]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: selectedOption,
        data: chartData.values,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold mb-4">Graphiques dynamiques</h1>
      <select
        className="p-2 border rounded"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {Object.keys(csvFiles).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={excludeLowCounts}
          onChange={() => setExcludeLowCounts(!excludeLowCounts)}
        />
        Exclure les occurrences peu fréquentes
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="h-64"><Bar data={data} options={options} /></div>
        <div className="h-64"><Pie data={data} options={options} /></div>
        <div className="h-64"><Line data={data} options={options} /></div>
        <div className="h-64"><Radar data={data} options={options} /></div>
        <div className="h-64"><Doughnut data={data} options={options} /></div>
docn       </div>
    </div>
  );
};

export default Graphiques;
