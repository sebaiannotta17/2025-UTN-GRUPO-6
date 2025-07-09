import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g7s";
const AUTH_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

// Funcion para generar una distribucion de votos simulada y realista
const generateVoteDistribution = (average, totalVotes) => {
  const distribution = Array(10).fill(0);
  // Limita el total de votos a un maximo de 5000 para el grafico para que no tarde tanto en generar
  const totalVotesForGraph = Math.min(totalVotes, 5000); 

  for (let i = 0; i < totalVotesForGraph; i++) {
    const vote = Math.round(Math.random() * 4 + (average - 2));
    const finalVote = Math.max(1, Math.min(10, vote));
    distribution[finalVote - 1]++;
  }
  const currentTotal = distribution.reduce((sum, val) => sum + val, 0);
  if (currentTotal === 0) return distribution; // Evita division por cero
  return distribution.map(val => Math.round((val / currentTotal) * totalVotesForGraph));
};

const PeliculasTomCruise = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      setCargando(true);
      try {
        // Pedimos mas peliculas de las necesarias para tener de donde filtrar
        const res = await axios.get(`${STRAPI_URL}?pagination[limit]=100&sort=votos:desc`, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const peliculasConDuplicados = res.data.data;

        //Logica para filtrar duplicados
        const peliculasUnicasMap = new Map();
        peliculasConDuplicados.forEach(peli => {
          if (!peliculasUnicasMap.has(peli.titulo)) {
            peliculasUnicasMap.set(peli.titulo, peli);
          }
        });
        const peliculasUnicas = Array.from(peliculasUnicasMap.values()); 

        const peliculasTop10 = peliculasUnicas.slice(0, 10); // Nos quedamos con las primeras 10 únicas
        
        setPeliculas(peliculasTop10);

        if (peliculasTop10.length > 0) {
          setPeliculaSeleccionada(peliculasTop10[0]);
        }
      } catch (err) {
        console.error('Error al obtener las películas:', err.response?.data || err.message);
      }
      setCargando(false);
    };
    fetchPeliculas();
  }, []);

  useEffect(() => {
    if (peliculaSeleccionada && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      const distributionData = generateVoteDistribution(peliculaSeleccionada.promedio_votos, peliculaSeleccionada.votos);
      const ctx = chartRef.current.getContext('2d');

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          datasets: [{
            label: `Distribución de Votos`,
            data: distributionData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { title: { display: true, text: 'Cantidad de Votos' } },
            x: { title: { display: true, text: 'Puntuación del Usuario' } }
          },
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: `Distribución de Votos por Película` }
          }
        }
      });
    }
  }, [peliculaSeleccionada]);

  const handleSelectChange = (e) => {
    const peliId = parseInt(e.target.value, 10);
    setPeliculaSeleccionada(peliculas.find(p => p.id === peliId));
  };

  if (cargando) return <p>Cargando películas...</p>;

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="pelicula-select" className="form-label"><strong>Película:</strong></label>
        <select id="pelicula-select" className="form-select" onChange={handleSelectChange} value={peliculaSeleccionada?.id || ''}>
          {peliculas.map(p => (
            <option key={p.id} value={p.id}>{p.titulo}</option>
          ))}
        </select>
      </div>

      {peliculaSeleccionada && (
        <div className="chart-container mb-4" style={{ maxWidth: '700px', margin: '2rem auto' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}
    </div>
  );
};

export default PeliculasTomCruise;