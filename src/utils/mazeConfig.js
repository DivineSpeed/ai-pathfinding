// Maze preset configurations for different difficulty levels
// Designed to demonstrate differences between BFS, DFS, and A* algorithms

export const GRID_PRESETS = {
  small: {
    rows: 15,
    cols: 15,
    start: { row: 1, col: 1 },
    goal: { row: 13, col: 13 },
    optimalPathLength: 25,
    optimalPathCost: 25,
    obstacles: [
      // === DFS TRAP: Long winding corridor at top-left ===
      // DFS will explore this entire dead-end before backtracking
      ...Array.from({ length: 10 }, (_, i) => ({ row: 0, col: 3 + i })), // Top wall
      ...Array.from({ length: 5 }, (_, i) => ({ row: 1 + i, col: 3 })),  // Left side of trap
      ...Array.from({ length: 4 }, (_, i) => ({ row: 5, col: 4 + i })),  // Bottom of trap
      { row: 1, col: 12 }, { row: 2, col: 12 }, { row: 3, col: 12 },     // Trap extension right

      // === CENTRAL MAZE STRUCTURE ===
      // Vertical wall forcing detour
      ...Array.from({ length: 6 }, (_, i) => ({ row: 6 + i, col: 6 })),
      // Horizontal barriers
      ...Array.from({ length: 4 }, (_, i) => ({ row: 8, col: 8 + i })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 11, col: 3 + i })),

      // === BRANCHING AREA (shows BFS exploration) ===
      { row: 4, col: 10 }, { row: 5, col: 11 },
      { row: 9, col: 4 }, { row: 10, col: 5 },
      { row: 12, col: 8 }, { row: 12, col: 9 }
    ],
    terrain: [
      // === EXPENSIVE DIRECT PATH (A* will avoid) ===
      // Water on the seemingly shortest route
      { row: 7, col: 7, type: 'water' },
      { row: 8, col: 7, type: 'water' },
      { row: 9, col: 8, type: 'water' },
      { row: 10, col: 9, type: 'water' },
      { row: 11, col: 10, type: 'water' },

      // Mud near goal approach
      { row: 12, col: 11, type: 'mud' },
      { row: 12, col: 12, type: 'mud' },
      { row: 11, col: 12, type: 'mud' },

      // === CHEAP ALTERNATIVE (A* optimal route) ===
      // Grass path going around
      ...Array.from({ length: 4 }, (_, i) => ({ row: 10 + i, col: 7, type: 'grass' }))
    ]
  },

  medium: {
    rows: 25,
    cols: 25,
    start: { row: 1, col: 1 },
    goal: { row: 23, col: 23 },
    optimalPathLength: 45,
    optimalPathCost: 44,
    obstacles: [
      // === MAJOR DFS TRAP: Spiral corridor in top-right ===
      // This will waste 30+ nodes for DFS
      ...Array.from({ length: 12 }, (_, i) => ({ row: 0, col: 10 + i })),   // Top
      ...Array.from({ length: 8 }, (_, i) => ({ row: 1 + i, col: 10 })),    // Left side
      ...Array.from({ length: 8 }, (_, i) => ({ row: 8, col: 11 + i })),    // Inner bottom
      ...Array.from({ length: 6 }, (_, i) => ({ row: 2 + i, col: 18 })),    // Inner right
      { row: 2, col: 19 }, { row: 2, col: 20 }, { row: 2, col: 21 },        // Dead end extension

      // === SECONDARY DFS TRAP: Bottom-left corridor ===
      ...Array.from({ length: 6 }, (_, i) => ({ row: 15 + i, col: 2 })),
      ...Array.from({ length: 4 }, (_, i) => ({ row: 20, col: 3 + i })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 17 + i, col: 6 })),

      // === CENTRAL LABYRINTH ===
      // Vertical walls
      ...Array.from({ length: 8 }, (_, i) => ({ row: 8 + i, col: 8 })),
      ...Array.from({ length: 10 }, (_, i) => ({ row: 6 + i, col: 15 })),
      // Horizontal walls
      ...Array.from({ length: 5 }, (_, i) => ({ row: 12, col: 9 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 18, col: 10 + i })),

      // === BRANCHING COMPLEXITY ===
      { row: 5, col: 5 }, { row: 6, col: 6 },
      { row: 10, col: 20 }, { row: 11, col: 21 },
      { row: 15, col: 18 }, { row: 16, col: 19 },
      { row: 21, col: 10 }, { row: 22, col: 11 }
    ],
    terrain: [
      // === WATER BARRIER blocking direct diagonal ===
      ...Array.from({ length: 8 }, (_, i) => ({ row: 10 + i, col: 10 + i, type: 'water' })),
      { row: 18, col: 18, type: 'water' },
      { row: 19, col: 19, type: 'water' },

      // === MUD ZONES ===
      ...Array.from({ length: 4 }, (_, i) => ({ row: 9 + i, col: 17, type: 'mud' })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 20, col: 17 + i, type: 'mud' })),
      { row: 21, col: 20, type: 'mud' },
      { row: 22, col: 21, type: 'mud' },

      // === CHEAP GRASS PATH (A* optimal) ===
      ...Array.from({ length: 6 }, (_, i) => ({ row: 16 + i, col: 8, type: 'grass' })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 22, col: 9 + i, type: 'grass' }))
    ]
  },

  large: {
    rows: 40,
    cols: 40,
    start: { row: 2, col: 2 },
    goal: { row: 37, col: 37 },
    optimalPathLength: 71,
    optimalPathCost: 73,
    obstacles: [
      // === MASSIVE DFS TRAP #1: Top spiral (50+ wasted nodes) ===
      ...Array.from({ length: 20 }, (_, i) => ({ row: 0, col: 8 + i })),     // Top wall
      ...Array.from({ length: 12 }, (_, i) => ({ row: 1 + i, col: 8 })),     // Left descent
      ...Array.from({ length: 15 }, (_, i) => ({ row: 12, col: 9 + i })),    // Bottom
      ...Array.from({ length: 10 }, (_, i) => ({ row: 2 + i, col: 23 })),    // Right descent
      ...Array.from({ length: 8 }, (_, i) => ({ row: 2, col: 24 + i })),     // Dead end

      // === DFS TRAP #2: Left corridor ===
      ...Array.from({ length: 15 }, (_, i) => ({ row: 18 + i, col: 3 })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 32, col: 4 + i })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 25 + i, col: 8 })),

      // === COMPLEX CENTRAL MAZE ===
      // Major vertical barriers
      ...Array.from({ length: 15 }, (_, i) => ({ row: 15 + i, col: 15 })),
      ...Array.from({ length: 12 }, (_, i) => ({ row: 10 + i, col: 25 })),
      ...Array.from({ length: 10 }, (_, i) => ({ row: 20 + i, col: 32 })),

      // Horizontal barriers
      ...Array.from({ length: 10 }, (_, i) => ({ row: 20, col: 16 + i })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 28, col: 18 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 35, col: 20 + i })),

      // === SCATTERED OBSTACLES for branching ===
      { row: 8, col: 35 }, { row: 9, col: 35 }, { row: 10, col: 36 },
      { row: 25, col: 35 }, { row: 26, col: 36 },
      { row: 33, col: 28 }, { row: 34, col: 29 },
      { row: 15, col: 35 }, { row: 16, col: 36 }, { row: 17, col: 37 }
    ],
    terrain: [
      // === MAJOR WATER DIAGONAL (expensive direct path) ===
      ...Array.from({ length: 15 }, (_, i) => ({ row: 18 + i, col: 18 + i, type: 'water' })),

      // === MUD ZONES around water ===
      ...Array.from({ length: 10 }, (_, i) => ({ row: 17 + i, col: 17 + i, type: 'mud' })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 33 + i, col: 33 + i, type: 'mud' })),

      // === GRASS CORRIDORS (A* optimal paths) ===
      // Upper route
      ...Array.from({ length: 10 }, (_, i) => ({ row: 14, col: 26 + i, type: 'grass' })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 15 + i, col: 35, type: 'grass' })),
      // Lower route
      ...Array.from({ length: 8 }, (_, i) => ({ row: 30 + i, col: 16, type: 'grass' })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 37, col: 17 + i, type: 'grass' }))
    ]
  }
};

// Terrain types and their costs
export const TERRAIN_TYPES = {
  ROAD: { name: 'road', cost: 1, color: '#f8f9fa' },
  GRASS: { name: 'grass', cost: 2, color: '#a3e635' },
  MUD: { name: 'mud', cost: 3, color: '#92400e' },
  WATER: { name: 'water', cost: 5, color: '#3b82f6' },
  OBSTACLE: { name: 'obstacle', cost: Infinity, color: '#1f2937' }
};

// Build terrain grid from preset terrain definitions
export function buildTerrainGrid(rows, cols, obstacles, terrainDefs, start, goal) {
  const terrain = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      type: 'road',
      cost: 1
    }))
  );

  // Add obstacles
  obstacles.forEach(({ row, col }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      terrain[row][col] = { type: 'obstacle', cost: Infinity };
    }
  });

  // Apply terrain definitions
  terrainDefs.forEach(({ row, col, type }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      if (terrain[row][col].type !== 'obstacle') {
        const cost = TERRAIN_TYPES[type.toUpperCase()].cost;
        terrain[row][col] = { type, cost };
      }
    }
  });

  return terrain;
}
