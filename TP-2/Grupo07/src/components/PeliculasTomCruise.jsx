import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g7s";
const AUTH_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

export default function PeliculasTomCruise() {
  const [peliculas, setPeliculas]         = useState([]);
  const [cargando, setCargando]           = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const chartRef         = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) Traer de Strapi y guardar sólo 10 únicas
  useEffect(() => {
    const fetchPeliculas = async () => {
      setCargando(true);
      try {
        const res = await axios.get(
          `${STRAPI_URL}?pagination[limit]=100&sort=votos:desc`,
          { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
        // Eliminar duplicados por título
        const mapUnicas = new Map();
        res.data.data.forEach(p => {
          if (!mapUnicas.has(p.titulo)) mapUnicas.set(p.titulo, p);
        });
        const top10 = Array.from(mapUnicas.values()).slice(0, 10);
        setPeliculas(top10);
        if (top10.length > 0) {
          setSelectedMovieId(top10[0].id);  // preselecciono la primera
        }
      } catch (err) {
        console.error('Error al obtener las películas:', err);
      }
      setCargando(false);
    };
    fetchPeliculas();
  }, []);

  // 2) Cada vez que cambien películas o selección, redibujo el gráfico
  useEffect(() => {
    if (cargando || !selectedMovieId || peliculas.length === 0) return;

    // Destruir instancia previa
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Ordeno por promedio de votos (descendente)
    const sorted = [...peliculas].sort(
      (a, b) => b.promedio_votos - a.promedio_votos
    );

    // Preparo labels, datos y colores
    const labels = sorted.map(p => p.titulo);
    const data   = sorted.map(p => p.promedio_votos);
    const defaultColor   = 'rgba(54, 162, 235, 0.7)';
    const highlightColor = 'rgba(255, 159, 64, 0.8)';
    const backgroundColor = sorted.map(p =>
      p.id === selectedMovieId ? highlightColor : defaultColor
    );
    const borderColor = backgroundColor.map(col =>
      col.replace('0.7', '1').replace('0.8', '1')
    );

    // Crear gráfico
    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Nota promedio',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 20,
              minRotation: 20,
              font: { size: 12 },
              padding: 5
            }
          },
          y: {
            title: { display: true, text: 'Promedio (1–10)'},
            min: 0, max: 10
          }
        },
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Películas por promedio de voto' }
        }
      }
    });
  }, [peliculas, selectedMovieId, cargando]);

  if (cargando) return <p>Cargando películas...</p>;

  // Encuentro el objeto de la película seleccionada
  const selectedMovie = peliculas.find(p => p.id === Number(selectedMovieId));

  // Ancho dinámico: 100px por barra
  const minWidth = peliculas.length * 100;

  return (
    <div>
      {/* 1) Select para elegir película */}
      <div className="mb-3">
        <label htmlFor="movie-select" className="form-label">
          <strong>Seleccione una película:</strong>
        </label>
        <select
          id="movie-select"
          className="form-select"
          value={selectedMovieId || ''}
          onChange={e => setSelectedMovieId(Number(e.target.value))}
        >
          {peliculas
            .sort((a, b) => b.promedio_votos - a.promedio_votos)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))
          }
        </select>
      </div>

      {/* 2) Contenedor scroll + canvas */}
      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ position: 'relative', width: minWidth, height: 400 }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* 3) Detalle de la película seleccionada */}
      {selectedMovie && (
        <div className="mt-4 p-3 border">
          <h2>{selectedMovie.titulo}</h2>
          <p><strong>Sinopsis:</strong> {selectedMovie.sinopsis}</p>
          <p><strong>Géneros:</strong> {selectedMovie.generos}</p>
        </div>
      )}
    </div>
  );
}