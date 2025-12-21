// A* Search Algorithm with different heuristics

// Manhattan distance heuristic
function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Euclidean distance heuristic
function euclideanDistance(a, b) {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

// Chebyshev distance heuristic (diagonal distance)
function chebyshevDistance(a, b) {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

const HEURISTICS = {
  manhattan: { name: 'Manhattan', func: manhattanDistance },
  euclidean: { name: 'Euclidean', func: euclideanDistance },
  chebyshev: { name: 'Chebyshev', func: chebyshevDistance }
};

// Priority Queue implementation for A*
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift().item;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// A* Algorithm
export function aStar(grid, start, goal, heuristicName = 'manhattan', optimalPathLength, terrain = null) {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;

  // Helper to get terrain cost
  const getTerrainCost = (row, col) => {
    if (!terrain) return 1;
    return terrain[row][col].cost;
  };

  // Count total free spaces for completion percentage
  let totalFreeSpaces = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 'obstacle') totalFreeSpaces++;
    }
  }

  const heuristic = HEURISTICS[heuristicName].func;

  const openSet = new PriorityQueue();
  openSet.enqueue({ ...start, path: [start], g: 0 }, heuristic(start, goal));

  const visited = new Set();
  const gScore = { [`${start.row},${start.col}`]: 0 };
  const visitedNodes = [];
  let nodesExpanded = 0;
  let totalSuccessors = 0;
  let totalHeuristic = 0;
  let totalFValue = 0;
  const isWeighted = terrain !== null;

  // Directions: up, right, down, left
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 }
  ];

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) continue;

    visited.add(currentKey);
    nodesExpanded++;
    visitedNodes.push({ row: current.row, col: current.col });

    // Track heuristic and f-values
    const h = heuristic({ row: current.row, col: current.col }, goal);
    const f = current.g + h;
    totalHeuristic += h;
    totalFValue += f;

    // Check if we reached the goal
    if (current.row === goal.row && current.col === goal.col) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      const pathLength = current.path.length;
      const pathCost = current.g;

      // Calculate additional metrics
      const branchingFactor = totalSuccessors / nodesExpanded;
      const pathOptimalityRatio = optimalPathLength / pathLength;
      const searchEfficiencyRate = (pathLength / nodesExpanded) * 100;
      const penetrance = pathLength / nodesExpanded;
      const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100;
      const nodesPerSecond = nodesExpanded / (executionTime / 1000);
      const avgHeuristic = totalHeuristic / nodesExpanded;
      const avgFValue = totalFValue / nodesExpanded;

      return {
        success: true,
        path: current.path,
        visitedNodes,
        nodesExpanded,
        executionTime,
        pathLength,
        pathCost,
        heuristic: heuristicName,
        branchingFactor,
        pathOptimalityRatio,
        searchEfficiencyRate,
        penetrance,
        completionPercentage,
        nodesPerSecond,
        totalFreeSpaces,
        finalPathCost: current.g,
        avgHeuristic,
        avgFValue,
        optimalPathLength,
        isWeighted
      };
    }

    // Explore neighbors
    let successorsGenerated = 0;
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;
      const neighborKey = `${newRow},${newCol}`;

      // Check if valid position
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] !== 'obstacle' &&
        !visited.has(neighborKey)
      ) {
        const moveCost = getTerrainCost(newRow, newCol);
        const newG = current.g + moveCost;

        if (!gScore[neighborKey] || newG < gScore[neighborKey]) {
          gScore[neighborKey] = newG;
          const neighbor = { row: newRow, col: newCol };
          const f = newG + heuristic(neighbor, goal);
          successorsGenerated++;

          openSet.enqueue({
            row: newRow,
            col: newCol,
            path: [...current.path, neighbor],
            g: newG
          }, f);
        }
      }
    }
    totalSuccessors += successorsGenerated;
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const branchingFactor = nodesExpanded > 0 ? totalSuccessors / nodesExpanded : 0;
  const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100;
  const nodesPerSecond = nodesExpanded / (executionTime / 1000);
  const avgHeuristic = nodesExpanded > 0 ? totalHeuristic / nodesExpanded : 0;
  const avgFValue = nodesExpanded > 0 ? totalFValue / nodesExpanded : 0;

  return {
    success: false,
    path: [],
    visitedNodes,
    nodesExpanded,
    executionTime,
    pathLength: 0,
    heuristic: heuristicName,
    branchingFactor,
    completionPercentage,
    nodesPerSecond,
    totalFreeSpaces,
    avgHeuristic,
    avgFValue,
    isWeighted
  };
}
