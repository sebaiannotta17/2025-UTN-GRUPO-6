import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuscarPorPais from './pages/BuscarPorPais';
import Home from './pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscarPorPais" element={<BuscarPorPais />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
