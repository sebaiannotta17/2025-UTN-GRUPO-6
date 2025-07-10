import React from 'react';
import '../assets/Layout.css'
import TomCruiseLoader from './TomCruiseLoader';
import PeliculasTomCruise from './PeliculasTomCruise';
import { useState } from 'react';


function Layout({children}){
    const [verPeliculas, setVerPeliculas] = useState(false);
    return (
        <div className="layout-container">
            <header className="layout-header text-white d-flex align-items-center justify-content-center">
                <h1 className="m-0">TP N°2 - Grupo 07 💻</h1>
            </header>

            <div className="layout-body d-flex">
                <aside className="layout-sidebar d-flex flex-column align-items-center py-4">
                    <TomCruiseLoader></TomCruiseLoader>
                    <button className="btn btn-white layout-button" onClick={() => setVerPeliculas(true)}>
                        Visualizar datos 📊
                    </button>
                </aside>

                <main className="layout-main p-4">   
                    {verPeliculas ? <PeliculasTomCruise /> : children}
                </main>
            </div>

            <footer className="layout-footer"><p><i>TyGWeb 2025</i></p></footer>
            </div>
    );
};

export default Layout;