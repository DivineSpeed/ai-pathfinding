/**
 * Composant principal de l'application
 * 
 * Cette application est un visualiseur d'algorithmes de recherche de chemin
 * permettant de comparer BFS, DFS et A* sur différentes configurations de grilles.
 */

import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Metrics from './components/Metrics';
import { GRID_PRESETS, buildTerrainGrid } from './utils/mazeConfig';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { aStar } from './algorithms/aStar';
import './App.css';

/**
 * Composant racine de l'application
 * Gère l'état global et orchestre l'exécution des algorithmes
 */
function App() {
  // === ÉTATS DE CONFIGURATION ===
  const [gridSize, setGridSize] = useState('small');        // Taille de la grille ('small', 'medium', 'large')
  const [algorithm, setAlgorithm] = useState('bfs');        // Algorithme sélectionné
  const [heuristic, setHeuristic] = useState('manhattan');  // Heuristique pour A*
  const [terrainMode, setTerrainMode] = useState('simple'); // Mode terrain ('simple' ou 'weighted')

  // === ÉTATS DE LA GRILLE ===
  const [grid, setGrid] = useState([]);           // Matrice représentant le labyrinthe
  const [terrain, setTerrain] = useState(null);   // Grille de coûts de terrain (null en mode simple)
  const [start, setStart] = useState(null);       // Position de départ
  const [goal, setGoal] = useState(null);         // Position d'arrivée
  const [optimalPathLength, setOptimalPathLength] = useState(null); // Longueur/coût optimal de référence

  // === ÉTATS DE VISUALISATION ===
  const [visitedCells, setVisitedCells] = useState([]);   // Cellules visitées (pour animation)
  const [pathCells, setPathCells] = useState([]);         // Cellules du chemin final
  const [currentCell, setCurrentCell] = useState(null);   // Cellule actuellement explorée

  // === ÉTATS D'EXÉCUTION ===
  const [isRunning, setIsRunning] = useState(false);      // Algorithme en cours d'exécution ?
  const [results, setResults] = useState(null);           // Résultats de l'algorithme

  /**
   * Effet : Initialisation de la grille lors du changement de taille ou de mode terrain
   */
  useEffect(() => {
    initializeGrid();
  }, [gridSize, terrainMode]);

  /**
   * Initialise la grille avec la configuration prédéfinie sélectionnée
   * Crée la matrice, place les obstacles et configure le terrain si nécessaire
   */
  const initializeGrid = () => {
    // Récupération de la configuration prédéfinie
    const preset = GRID_PRESETS[gridSize];
    const { rows, cols, start, goal, obstacles, optimalPathLength, optimalPathCost, terrain: terrainDefs } = preset;

    // Création d'une grille vide
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill('empty'));

    // Placement des obstacles sur la grille
    obstacles.forEach(({ row, col }) => {
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        newGrid[row][col] = 'obstacle';
      }
    });

    // Construction de la grille de terrain si en mode pondéré
    let terrainData = null;
    if (terrainMode === 'weighted') {
      terrainData = buildTerrainGrid(rows, cols, obstacles, terrainDefs, start, goal);
    }

    // Mise à jour de tous les états
    setGrid(newGrid);
    setTerrain(terrainData);
    setStart(start);
    setGoal(goal);
    // En mode simple : longueur optimale en étapes
    // En mode pondéré : coût optimal du chemin
    setOptimalPathLength(terrainMode === 'simple' ? optimalPathLength : optimalPathCost);
    setVisitedCells([]);
    setPathCells([]);
    setCurrentCell(null);
    setResults(null);
  };

  /**
   * Fonction utilitaire pour créer une pause asynchrone
   * @param {number} ms - Durée de la pause en millisecondes
   * @returns {Promise} Promesse résolue après le délai
   */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Visualise l'exécution de l'algorithme de manière animée
   * Affiche d'abord l'exploration des nœuds, puis le chemin final
   * @param {Object} algorithmResults - Résultats retournés par l'algorithme
   */
  const visualizeAlgorithm = async (algorithmResults) => {
    const { visitedNodes, path } = algorithmResults;

    // Animation de l'exploration : affichage progressif des nœuds visités
    for (let i = 0; i < visitedNodes.length; i++) {
      setCurrentCell(visitedNodes[i]);  // Mise en surbrillance de la cellule courante
      setVisitedCells(visitedNodes.slice(0, i + 1));

      // Délai adapté à la taille de la grille pour une animation fluide
      const delay = gridSize === 'large' ? 20 : gridSize === 'medium' ? 35 : 50;
      await sleep(delay);
    }

    // Fin de l'exploration : suppression de la surbrillance
    setCurrentCell(null);

    // Courte pause avant l'affichage du chemin
    await sleep(300);

    // Animation du chemin final : affichage progressif
    if (path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        setPathCells(path.slice(0, i + 1));
        await sleep(80);
      }
    }
  };

  /**
   * Gestionnaire du bouton "Démarrer"
   * Lance l'algorithme sélectionné et déclenche la visualisation
   */
  const handleStart = async () => {
    // Empêcher le lancement si déjà en cours
    if (isRunning) return;

    // Réinitialisation de l'état de visualisation
    setIsRunning(true);
    setVisitedCells([]);
    setPathCells([]);
    setCurrentCell(null);
    setResults(null);

    let algorithmResults;

    try {
      // Exécution de l'algorithme sélectionné
      switch (algorithm) {
        case 'bfs':
          algorithmResults = bfs(grid, start, goal, optimalPathLength, terrain);
          break;
        case 'dfs':
          algorithmResults = dfs(grid, start, goal, optimalPathLength, terrain);
          break;
        case 'astar':
          algorithmResults = aStar(grid, start, goal, heuristic, optimalPathLength, terrain);
          break;
        default:
          algorithmResults = bfs(grid, start, goal, optimalPathLength, terrain);
      }

      // Enregistrement et visualisation des résultats
      setResults(algorithmResults);
      await visualizeAlgorithm(algorithmResults);
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'algorithme:', error);
    }

    setIsRunning(false);
  };

  /**
   * Gestionnaire du bouton "Réinitialiser"
   * Remet la grille à son état initial
   */
  const handleReset = () => {
    initializeGrid();
  };

  // === RENDU DU COMPOSANT ===
  return (
    <div className="app">
      {/* En-tête de l'application */}
      <header className="app-header">
        <h1>Algorithmes de Recherche en IA</h1>
        <p>Étude comparative : BFS, DFS et A* — TP Résolution de Problèmes</p>
      </header>

      {/* Contenu principal : panneau gauche (contrôles), centre (grille), droite (métriques) */}
      <div className="app-content">
        {/* Panneau des contrôles */}
        <div className="left-panel">
          <Controls
            gridSize={gridSize}
            setGridSize={setGridSize}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            heuristic={heuristic}
            setHeuristic={setHeuristic}
            terrainMode={terrainMode}
            setTerrainMode={setTerrainMode}
            onStart={handleStart}
            isRunning={isRunning}
            onReset={handleReset}
          />
        </div>

        {/* Panneau central : visualisation de la grille */}
        <div className="center-panel">
          {grid.length > 0 && (
            <Grid
              grid={grid}
              terrain={terrain}
              visitedCells={visitedCells}
              pathCells={pathCells}
              currentCell={currentCell}
              start={start}
              goal={goal}
            />
          )}
        </div>

        {/* Panneau des métriques de performance */}
        <div className="right-panel">
          <Metrics results={results} />
        </div>
      </div>

      {/* Pied de page */}
      <footer className="app-footer">
        <p>Module Intelligence Artificielle — FST 2024-2025</p>
      </footer>
    </div>
  );
}

export default App;
