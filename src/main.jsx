/**
 * Point d'entrée de l'application React
 * 
 * Ce fichier initialise l'application React et monte le composant
 * racine App dans l'élément DOM avec l'id 'root'.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Création de la racine React et rendu du composant App
// StrictMode active des vérifications supplémentaires en développement
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
