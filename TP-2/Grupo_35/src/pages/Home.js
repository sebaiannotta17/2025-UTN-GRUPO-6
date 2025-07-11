import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleBuscarPorPais = () => {
    navigate('/buscarPorPais');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-between">
      <header className="flex justify-center items-center bg-white p-3 shadow-md">
        <p className="text-md font-semibold text-gray-500 border-b border-gray-200">T.P. N°2 - Grupo 35</p>
      </header>

      <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Descrube las últimas películas de cada país.
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Busca las últimas películas del país de tu elección.
          </p>

          <button
            onClick={handleBuscarPorPais}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
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
              <span>Buscar por País</span>
            </div>
          </button>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Más de 195 países disponibles para explorar
            </p>
          </div>
        </div>
      </div>
    </div>
    <footer className="flex justify-center items-center bg-white p-3 shadow-md">
      <p className="text-sm text-gray-500 border-t border-gray-200">TyG Web - 2025</p>
    </footer>
    </div>
  );
};

export default Home;