export function renderGrafico(promedios) {
  const canvas = document.getElementById("grafico-promedios");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  // Ordenar las películas por promedio de votos (de mayor a menor)
  const peliculasOrdenadas = [...promedios].sort((a, b) => b.promedioVotos - a.promedioVotos);
  
  const labels = peliculasOrdenadas.map(p => p.titulo);
  const data = peliculasOrdenadas.map(p => p.promedioVotos * 10);

  // Debug: mostrar los valores originales y amplificados
  console.log('📊 Valores originales:', peliculasOrdenadas.map(p => p.promedioVotos));
  console.log('📊 Valores amplificados para el gráfico:', data);
  console.log('📊 Títulos:', labels);
  console.log('📊 Total de películas para el gráfico:', labels.length);

  if (window.miTorta) window.miTorta.destroy();

  window.miTorta = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Promedio de votos",
          data,
          backgroundColor: [
            "#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
            "#4bc0c0", "#9966ff", "#ff9f40", "#ffcd56",
            "#c9cbcf", "#4dc9f6"
          ],
          hoverOffset: 20,
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 50,
          right: 100,
          bottom: 50,
          left: 50
        }
      },
      plugins: {
        legend: {
          position: 'left',
          align: 'start',
          labels: {
            color: '#ffffff',
            font: {
              size: 12,
              weight: 'bold'
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 15,
            boxHeight: 15
          },
          display: true
        },
        tooltip: {
          position: 'nearest',
          callbacks: {
            title: function (context) {
              return context[0].label;
            },
            label: function (context) {
              // Obtener el valor original (no amplificado) para mostrar en el tooltip
              const originalValue = peliculasOrdenadas[context.dataIndex].promedioVotos;
              const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
              return `${originalValue.toFixed(1)}/10 (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}
