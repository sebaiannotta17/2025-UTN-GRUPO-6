import { fetchAndSaveMovies, fetchSavedMovies } from "./utils/fetchMovies.js";

const { createApp, ref, nextTick } = Vue;

createApp({
  setup() {
    const movies = ref([]);
    const loading = ref(false);
    const showChartView = ref(false);
    let chartInstance = null;

    const loadMovies = async () => {
      loading.value = true;
      showChartView.value = false;
      await fetchAndSaveMovies();
      loading.value = false;
    };

    const getMovies = async () => {
      loading.value = true;
      showChartView.value = false;
      movies.value = await fetchSavedMovies();
      loading.value = false;
    };

    const showChart = async () => {
      loading.value = true;
      showChartView.value = true;

      // Obtener películas si no las tenemos
      if (movies.value.length === 0) {
        movies.value = await fetchSavedMovies();
      }

      loading.value = false;

      // Esperar a que el canvas se renderice
      await nextTick();

      // Calcular votos por género
      const genreVotes = {};
      movies.value.forEach((movie) => {
        // Separar géneros por comas y limpiar espacios
        const genres = movie.generos[0].nombre.split(",").map((g) => g.trim());

        genres.forEach((genreName) => {
          if (genreVotes[genreName]) {
            genreVotes[genreName] += movie.cantidad_votos;
          } else {
            genreVotes[genreName] = movie.cantidad_votos;
          }
        });
      });

      // Crear el gráfico
      const ctx = document.getElementById("votesByGenre").getContext("2d");

      // Destruir gráfico anterior si existe
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(genreVotes),
          datasets: [
            {
              label: "Cantidad total de votos por género",
              data: Object.values(genreVotes),
              backgroundColor: "#42a5f5",
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Géneros más votados de las películas actuales",
            },
          },
        },
      });
    };

    return { movies, loading, showChartView, loadMovies, getMovies, showChart };
  },
}).mount("#app");
