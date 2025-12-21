import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Metrics from './components/Metrics';
import { GRID_PRESETS, buildTerrainGrid } from './utils/mazeConfig';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { aStar } from './algorithms/aStar';
import './App.css';

function App() {
  const [gridSize, setGridSize] = useState('small');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [heuristic, setHeuristic] = useState('manhattan');
  const [terrainMode, setTerrainMode] = useState('simple');
  const [grid, setGrid] = useState([]);
  const [terrain, setTerrain] = useState(null);
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [optimalPathLength, setOptimalPathLength] = useState(null);
  const [visitedCells, setVisitedCells] = useState([]);
  const [pathCells, setPathCells] = useState([]);
  const [currentCell, setCurrentCell] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  // Initialize grid when size or terrain mode changes
  useEffect(() => {
    initializeGrid();
  }, [gridSize, terrainMode]);

  const initializeGrid = () => {
    const preset = GRID_PRESETS[gridSize];
    const { rows, cols, start, goal, obstacles, optimalPathLength, optimalPathCost, terrain: terrainDefs } = preset;

    // Create empty grid
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill('empty'));

    // Add obstacles
    obstacles.forEach(({ row, col }) => {
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        newGrid[row][col] = 'obstacle';
      }
    });

    // Build terrain grid if in weighted mode
    let terrainData = null;
    if (terrainMode === 'weighted') {
      terrainData = buildTerrainGrid(rows, cols, obstacles, terrainDefs, start, goal);
    }

    setGrid(newGrid);
    setTerrain(terrainData);
    setStart(start);
    setGoal(goal);
    setOptimalPathLength(terrainMode === 'simple' ? optimalPathLength : optimalPathCost);
    setVisitedCells([]);
    setPathCells([]);
    setCurrentCell(null);
    setResults(null);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const visualizeAlgorithm = async (algorithmResults) => {
    const { visitedNodes, path } = algorithmResults;

    // Visualize visited nodes with current cell highlighting
    for (let i = 0; i < visitedNodes.length; i++) {
      setCurrentCell(visitedNodes[i]);
      setVisitedCells(visitedNodes.slice(0, i + 1));

      // Adjust speed based on grid size for smooth but visible animation
      const delay = gridSize === 'large' ? 20 : gridSize === 'medium' ? 35 : 50;
      await sleep(delay);
    }

    setCurrentCell(null);

    // Small pause before showing path
    await sleep(300);

    // Visualize final path with animation
    if (path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        setPathCells(path.slice(0, i + 1));
        await sleep(80);
      }
    }
  };

  const handleStart = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setVisitedCells([]);
    setPathCells([]);
    setCurrentCell(null);
    setResults(null);

    let algorithmResults;

    try {
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

      setResults(algorithmResults);
      await visualizeAlgorithm(algorithmResults);
    } catch (error) {
      console.error('Algorithm error:', error);
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    initializeGrid();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Algorithmes de Recherche en IA</h1>
        <p>Étude comparative : BFS, DFS et A* — TP Résolution de Problèmes</p>
      </header>

      <div className="app-content">
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

        <div className="right-panel">
          <Metrics results={results} />
        </div>
      </div>

      <footer className="app-footer">
        <p>Module Intelligence Artificielle — FST 2024-2025</p>
      </footer>
    </div>
  );
}

export default App;
