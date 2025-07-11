import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import traerPeli from '../controllers/traerPeliStrapi';
import subirPeli from '../controllers/subirPeli';
import fetchPeliculas from '../controllers/traerPeliApi';

function BuscarPorPais() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_KEY_TMDBSTRAPI_API_URL;
    const apiToken = process.env.REACT_APP_API_TOKEN;
    const [pais, setPais] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [movies, setMovies] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [success, setSuccess] = useState(false);


    const handleBuscarYGuardar = async () => {
        const fetchedMovies = await fetchPeliculas(pais, setCargando, setMensaje, setPeliculas);
    
        if (fetchedMovies) {
            console.log("Películas obtenidas:", fetchedMovies);
            subirPeli(fetchedMovies, pais, apiUrl, apiToken, setSuccess);
        } else {
            console.log("No se pudieron obtener películas para subir.");
        }
    }


    const handleTraerPeli = (pais) => {
        traerPeli(apiUrl, apiToken, setMovies, pais);
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-500">TyG - Grupo 35</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none text-lg"
                    >
                        Volver
                    </button>
                </div>
            </nav>
            
            <div className="flex-1 p-4 md:p-8">
                <div className="container mx-auto">

            
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-6">
                Buscar Películas por País de Origen
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p className="text-gray-700 mb-4">
                    Ingresa el código de país, por ejemplo: ES para españa, US para estados unidos, etc. Te mostraremos las peliculas lanzadas en el último mes de ese país.
                </p>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="Código de País (ej. US)"
                        value={pais}
                        onChange={(e) => setPais(e.target.value.toUpperCase())}
                        aria-label="Código de País"
                    />
                    <button
                        onClick={handleBuscarYGuardar}
                        disabled={cargando}
                        className="w-full md:w-auto cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none text-lg"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                            <span>{cargando ? 'Cargando...' : 'Buscar y Guardar'}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => handleTraerPeli(pais)}
                        disabled={cargando}
                        className="w-full md:w-auto cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none text-lg"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                />
                            </svg>
                            <span>{cargando ? 'Cargando...' : 'Mostrar Películas'}</span>
                        </div>
                    </button>
                </div>
                {mensaje && (
                    <p className="mt-4 text-center text-gray-600 font-medium">
                        {mensaje}
                    </p>
                )}
            </div>
            <div>
                {movies.map((pelicula) => (
                    <div key={pelicula.id} className="flex flex-row bg-gray-300 rounded-md p-3 m-2 shadow-md justify-between items-center">
                        <div className='flex flex-col align-left'>
                            <h2 className="font-bold text-lg">{pelicula.titulo}</h2>
                            <div className='flex flex-col justify-between'>
                                <p className='text-sm text-gray-500'>Fecha de estreno: {pelicula.fechaEstreno}</p>
                                <p className='text-sm text-gray-500'>Lenguaje de Origen: {pelicula.lenguajeOrigen}</p>
                            </div>
                        </div>
                        <div className='object-fit w-24'>
                            <img src={`https://image.tmdb.org/t/p/w500${pelicula.imagen}`} alt={pelicula.title} className='w-full object-cover' />
                        </div>
                    </div>
                ))}
            </div>
                </div>
            </div>
        </div>
    );
}

export default BuscarPorPais;