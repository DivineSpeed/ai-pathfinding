// Breadth-First Search Algorithm
export function bfs(grid, start, goal, optimalPathLength, terrain = null) {
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
  
  const queue = [{ ...start, path: [start], cost: 0 }];
  const visited = new Set([`${start.row},${start.col}`]);
  const visitedNodes = [];
  let nodesExpanded = 0;
  let totalSuccessors = 0;
  const isWeighted = terrain !== null;
  
  // Directions: up, right, down, left
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 }
  ];
  
  while (queue.length > 0) {
    const current = queue.shift();
    nodesExpanded++;
    
    visitedNodes.push({ row: current.row, col: current.col });
    
    // Check if we reached the goal
    if (current.row === goal.row && current.col === goal.col) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      const pathLength = current.path.length;
      const pathCost = current.cost;
      
      // Calculate additional metrics
      const branchingFactor = totalSuccessors / nodesExpanded;
      const pathOptimalityRatio = optimalPathLength / pathLength;
      const searchEfficiencyRate = (pathLength / nodesExpanded) * 100;
      const penetrance = pathLength / nodesExpanded;
      const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100;
      const nodesPerSecond = nodesExpanded / (executionTime / 1000);
      
      return {
        success: true,
        path: current.path,
        visitedNodes,
        nodesExpanded,
        executionTime,
        pathLength,
        pathCost,
        branchingFactor,
        pathOptimalityRatio,
        searchEfficiencyRate,
        penetrance,
        completionPercentage,
        nodesPerSecond,
        totalFreeSpaces,
        optimalPathLength,
        isWeighted
      };
    }
    
    // Explore neighbors
    let successorsGenerated = 0;
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;
      const key = `${newRow},${newCol}`;
      
      // Check if valid position
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        grid[newRow][newCol] !== 'obstacle' &&
        !visited.has(key)
      ) {
        visited.add(key);
        successorsGenerated++;
        const moveCost = getTerrainCost(newRow, newCol);
        queue.push({
          row: newRow,
          col: newCol,
          path: [...current.path, { row: newRow, col: newCol }],
          cost: current.cost + moveCost
        });
      }
    }
    totalSuccessors += successorsGenerated;
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const branchingFactor = nodesExpanded > 0 ? totalSuccessors / nodesExpanded : 0;
  const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100;
  const nodesPerSecond = nodesExpanded / (executionTime / 1000);
  
  return {
    success: false,
    path: [],
    visitedNodes,
    nodesExpanded,
    executionTime,
    pathLength: 0,
    branchingFactor,
    completionPercentage,
    nodesPerSecond,
    totalFreeSpaces,
    isWeighted
  };
}
