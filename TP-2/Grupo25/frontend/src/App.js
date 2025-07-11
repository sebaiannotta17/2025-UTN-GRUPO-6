import React, { useState } from 'react';
// Asegúrate de que la ruta a tu apiService sea correcta.
import { fetchTrailersFromTMDB, saveTrailerToStrapi, fetchTrailersFromStrapi } from './services/apiService';
import './App.css';

function App() {
    // --- Lógica y estado del App.js original ---
    const [activeView, setActiveView] = useState('cargar'); // 'cargar' o 'visualizar'
    const [movieId, setMovieId] = useState('603'); // ID de "The Matrix" como ejemplo
    const [trailers, setTrailers] = useState([]);
    const [message, setMessage] = useState('Ingresa un ID de película y presiona "Buscar y Guardar".');
    const [isLoading, setIsLoading] = useState(false);

    const handleCargarDatos = async () => {
        if (!movieId) {
            alert('Ingresa un ID de película.');
            return;
        }
        setIsLoading(true);
        setMessage(`Buscando trailers para el ID ${movieId}...`);
        try {
            const { movieTitle, trailers: fetchedTrailers } = await fetchTrailersFromTMDB(movieId);
            if (fetchedTrailers.length === 0) {
                setMessage(`No se encontraron trailers para "${movieTitle}".`);
                setIsLoading(false);
                return;
            }

            setMessage(`Se encontraron ${fetchedTrailers.length} trailers de "${movieTitle}". Intentando guardar en Strapi...`);
            for (const trailer of fetchedTrailers) {
                await saveTrailerToStrapi(parseInt(movieId), movieTitle, trailer);
            }

            setMessage('¡Proceso de guardado finalizado! (O fallido si los permisos no están configurados en Strapi)');
        } catch (error) {
            console.error(error);
            setMessage(`Error: ${error.message}. Este error es esperado si los permisos de escritura en Strapi no están habilitados.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVisualizarDatos = async () => {
        setIsLoading(true);
        setMessage('Cargando trailers desde Strapi...');
        setTrailers([]);
        try {
            const data = await fetchTrailersFromStrapi();
            setTrailers(data);
            setMessage(data.length > 0 ? `Se encontraron ${data.length} trailers guardados.` : 'No hay trailers guardados. Agrega algunos desde la pestaña "Cargar Datos" o manualmente en Strapi.');
        } catch (error) {
            console.error(error);
            setMessage(`Error al cargar desde Strapi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Renderizado con la nueva estructura visual ---
    return (
        <div id="app-container">
            <header id="header">
                <a href="#!" id="header-logo-link" onClick={() => window.location.reload()}>
                    Biblioteca de Trailers
                </a>
                <div id="titulo">
                    <h1>TP N°2 - Grupo 25</h1>
                </div>
            </header>

            <div id="contenido">
                <aside id="sidebar">
                    <ul>
                        <li><a href="#!" onClick={() => setActiveView('cargar')} className={activeView === 'cargar' ? 'active' : ''}>Cargar Datos de APIs</a></li>
                        <li><a href="#!" onClick={() => setActiveView('visualizar')} className={activeView === 'visualizar' ? 'active' : ''}>Visualizar Datos</a></li>
                    </ul>
                </aside>

                <main id="contenido-principal">
                    {activeView === 'cargar' && (
                        <div className="content-container">
                            <h2 className="content-title">Cargar Datos desde TMDB a Strapi</h2>
                            <p className="content-description">Esta sección busca trailers de una película por su ID en TMDB y los intenta guardar en tu base de datos de Strapi.</p>
                            
                            <div className="form-container">
                                <label htmlFor="movie-id-input">ID de Película de TMDB:</label>
                                <input
                                    id="movie-id-input"
                                    type="text"
                                    value={movieId}
                                    onChange={(e) => setMovieId(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Ej: 603"
                                />
                                <button onClick={handleCargarDatos} disabled={isLoading}>
                                    {isLoading ? 'Buscando...' : 'Buscar y Guardar en Strapi'}
                                </button>
                            </div>
                            <div className="status-message">
                                <strong>Estado:</strong> {message}
                            </div>
                        </div>
                    )}

                    {activeView === 'visualizar' && (
                        <div className="content-container">
                            <h2 className="content-title">Visualizar Datos Guardados en Strapi</h2>
                            <p className="content-description">Esta sección muestra los trailers que han sido guardados en Strapi. Presiona el botón para cargar los datos.</p>
                            
                            <div className="form-container">
                                <button onClick={handleVisualizarDatos} disabled={isLoading}>
                                    {isLoading ? 'Cargando...' : 'Cargar Trailers Guardados'}
                                </button>
                            </div>

                             <div className="status-message">
                                <strong>Estado:</strong> {message}
                            </div>

                            {trailers.length > 0 && (
                                <div className="trailers-list">
                                    <h3>Trailers Encontrados:</h3>
                                    <ul>
                                        {trailers.map(item => (
                                            <li key={item.id}>
                                                <a 
                                                  href={`http://googleusercontent.com/youtube.com/6${item.attributes.youtube_key}`} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                >
                                                    {item.attributes.titulo_pelicula} - <em>{item.attributes.nombre_trailer}</em>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <footer id="footer">
                <p>Cátedra de Tecnología y Gestión Web - 2025</p>
            </footer>
        </div>
    );
}

export default App;