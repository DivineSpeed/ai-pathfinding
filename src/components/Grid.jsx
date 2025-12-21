import React from 'react';
import './Grid.css';

const Grid = ({ grid, terrain, visitedCells, pathCells, currentCell, start, goal }) => {
  const getCellClass = (row, col) => {
    const classes = ['cell'];

    // Add terrain type class if in weighted mode
    if (terrain && grid[row][col] !== 'obstacle') {
      const terrainType = terrain[row][col].type;
      classes.push(`terrain-${terrainType}`);
    }

    // Check if it's the current cell being explored
    if (currentCell && currentCell.row === row && currentCell.col === col) {
      classes.push('current');
      return classes.join(' ');
    }

    // Check if it's the start or goal
    if (start.row === row && start.col === col) {
      classes.push('start');
      return classes.join(' ');
    }
    if (goal.row === row && goal.col === col) {
      classes.push('goal');
      return classes.join(' ');
    }

    // Check if it's part of the final path
    const isPath = pathCells.some(cell => cell.row === row && cell.col === col);
    if (isPath) {
      classes.push('path');
      return classes.join(' ');
    }

    // Check if it's visited
    const isVisited = visitedCells.some(cell => cell.row === row && cell.col === col);
    if (isVisited) {
      classes.push('visited');
      return classes.join(' ');
    }

    // Check if it's an obstacle
    if (grid[row][col] === 'obstacle') {
      classes.push('obstacle');
      return classes.join(' ');
    }

    return classes.join(' ');
  };

  const cellSize = grid.length <= 15 ? '30px' : grid.length <= 25 ? '20px' : '15px';

  return (
    <div className="grid-container">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize})`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize})`
        }}
      >
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
