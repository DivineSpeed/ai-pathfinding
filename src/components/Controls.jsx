/**
 * Composant Controls - Panneau de contrôle de l'application
 */

import React from 'react';
import './Controls.css';

/**
 * Panneau de contrôle pour la configuration des algorithmes
 */
const Controls = ({
  gridSize,
  setGridSize,
  algorithm,
  setAlgorithm,
  heuristic,
  setHeuristic,
  terrainMode,
  setTerrainMode,
  onStart,
  isRunning,
  onReset
}) => {
  return (
    <div className="controls-panel">
      <h2>Contrôles de Visualisation</h2>

      {/* Sélection du mode de terrain */}
      <div className="control-group">
        <label>Mode de Terrain :</label>
        <div className="radio-group">
          {/* Mode simple : coût uniforme */}
          <label className="radio-label">
            <input
              type="radio"
              value="simple"
              checked={terrainMode === 'simple'}
              onChange={(e) => setTerrainMode(e.target.value)}
              disabled={isRunning}
            />
            <span>Simple (coût uniforme)</span>
          </label>
          {/* Mode pondéré : coûts variés */}
          <label className="radio-label">
            <input
              type="radio"
              value="weighted"
              checked={terrainMode === 'weighted'}
              onChange={(e) => setTerrainMode(e.target.value)}
              disabled={isRunning}
            />
            <span>Terrain Pondéré (coûts variés)</span>
          </label>
        </div>
      </div>

      {/* Sélection de la taille de grille */}
      <div className="control-group">
        <label>Taille de la Grille :</label>
        <select
          value={gridSize}
          onChange={(e) => setGridSize(e.target.value)}
          disabled={isRunning}
        >
          <option value="small">Petite (15×15)</option>
          <option value="medium">Moyenne (25×25)</option>
          <option value="large">Grande (40×40)</option>
        </select>
      </div>

      {/* Sélection de l'algorithme */}
      <div className="control-group">
        <label>Algorithme :</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isRunning}
        >
          <option value="bfs">Recherche en Largeur (BFS)</option>
          <option value="dfs">Recherche en Profondeur (DFS)</option>
          <option value="astar">Algorithme A*</option>
        </select>
      </div>

      {/* Sélection de l'heuristique (A* uniquement) */}
      {algorithm === 'astar' && (
        <div className="control-group">
          <label>Heuristique :</label>
          <select
            value={heuristic}
            onChange={(e) => setHeuristic(e.target.value)}
            disabled={isRunning}
          >
            <option value="manhattan">Distance de Manhattan</option>
            <option value="euclidean">Distance Euclidienne</option>
            <option value="chebyshev">Distance de Chebyshev</option>
          </select>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="button-group">
        <button onClick={onStart} disabled={isRunning} className="btn btn-primary">
          {isRunning ? 'En cours...' : 'Démarrer'}
        </button>
        <button onClick={onReset} disabled={isRunning} className="btn btn-secondary">
          Réinitialiser
        </button>
      </div>

      {/* Légende des couleurs */}
      <div className="legend">
        <h3>Légende</h3>
        <div className="legend-item">
          <div className="legend-color start"></div>
          <span>Position de Départ</span>
        </div>
        <div className="legend-item">
          <div className="legend-color goal"></div>
          <span>Position d'Arrivée</span>
        </div>
        <div className="legend-item">
          <div className="legend-color obstacle"></div>
          <span>Obstacles</span>
        </div>
        {/* Légende terrain (mode pondéré uniquement) */}
        {terrainMode === 'weighted' && (
          <>
            <div className="legend-item">
              <div className="legend-color terrain-road"></div>
              <span>Route (coût: 1)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color terrain-grass"></div>
              <span>Herbe (coût: 2)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color terrain-mud"></div>
              <span>Boue (coût: 3)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color terrain-water"></div>
              <span>Eau (coût: 5)</span>
            </div>
          </>
        )}
        <div className="legend-item">
          <div className="legend-color visited"></div>
          <span>Nœuds Visités</span>
        </div>
        <div className="legend-item">
          <div className="legend-color path"></div>
          <span>Chemin Final</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
