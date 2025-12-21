/**
 * Composant Grid - Affichage de la grille de visualisation
 * 
 * Ce composant est responsable du rendu visuel du labyrinthe,
 * incluant les cellules, obstacles, terrain, et l'animation de la recherche.
 */

import React from 'react';
import './Grid.css';

/**
 * Composant de grille pour la visualisation des algorithmes
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array<Array<string>>} props.grid - Matrice représentant le labyrinthe
 * @param {Array<Array<Object>>|null} props.terrain - Grille de terrain avec types et coûts
 * @param {Array<Object>} props.visitedCells - Liste des cellules visitées
 * @param {Array<Object>} props.pathCells - Liste des cellules du chemin final
 * @param {Object|null} props.currentCell - Cellule actuellement en cours d'exploration
 * @param {Object} props.start - Position de départ {row, col}
 * @param {Object} props.goal - Position d'arrivée {row, col}
 */
const Grid = ({ grid, terrain, visitedCells, pathCells, currentCell, start, goal }) => {

  /**
   * Détermine les classes CSS à appliquer à une cellule
   * L'ordre de priorité est important pour l'affichage correct :
   * 1. Cellule courante (en exploration)
   * 2. Départ / Arrivée
   * 3. Chemin final
   * 4. Cellules visitées
   * 5. Obstacles
   * 6. Terrain de base
   * 
   * @param {number} row - Index de la ligne
   * @param {number} col - Index de la colonne
   * @returns {string} Classes CSS concaténées
   */
  const getCellClass = (row, col) => {
    const classes = ['cell'];

    // Ajout de la classe de terrain si en mode pondéré et pas un obstacle
    if (terrain && grid[row][col] !== 'obstacle') {
      const terrainType = terrain[row][col].type;
      classes.push(`terrain-${terrainType}`);
    }

    // Vérification : cellule actuellement explorée (priorité maximale)
    if (currentCell && currentCell.row === row && currentCell.col === col) {
      classes.push('current');
      return classes.join(' ');
    }

    // Vérification : position de départ
    if (start.row === row && start.col === col) {
      classes.push('start');
      return classes.join(' ');
    }

    // Vérification : position d'arrivée
    if (goal.row === row && goal.col === col) {
      classes.push('goal');
      return classes.join(' ');
    }

    // Vérification : fait partie du chemin final
    const isPath = pathCells.some(cell => cell.row === row && cell.col === col);
    if (isPath) {
      classes.push('path');
      return classes.join(' ');
    }

    // Vérification : cellule visitée pendant l'exploration
    const isVisited = visitedCells.some(cell => cell.row === row && cell.col === col);
    if (isVisited) {
      classes.push('visited');
      return classes.join(' ');
    }

    // Vérification : obstacle
    if (grid[row][col] === 'obstacle') {
      classes.push('obstacle');
      return classes.join(' ');
    }

    // Cellule normale (vide ou terrain de base)
    return classes.join(' ');
  };

  // Calcul dynamique de la taille des cellules selon la taille de la grille
  // Petite grille : 30px, Moyenne : 20px, Grande : 15px
  const cellSize = grid.length <= 15 ? '30px' : grid.length <= 25 ? '20px' : '15px';

  return (
    <div className="grid-container">
      {/* Grille CSS avec colonnes et lignes dynamiques */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize})`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize})`
        }}
      >
        {/* Rendu de chaque cellule de la grille */}
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
