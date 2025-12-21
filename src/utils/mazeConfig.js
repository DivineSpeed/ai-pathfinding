/**
 * Configuration des labyrinthes prédéfinis
 * 
 * Ce fichier contient les configurations de grilles pour différents
 * niveaux de difficulté, conçues pour démontrer les différences
 * entre les algorithmes BFS, DFS et A*.
 */

/**
 * Configurations prédéfinies des grilles
 * Chaque configuration inclut :
 * - Dimensions (rows, cols)
 * - Positions de départ et d'arrivée
 * - Obstacles placés stratégiquement
 * - Définitions de terrain pour le mode pondéré
 * - Valeurs optimales de référence
 */
export const GRID_PRESETS = {
  /**
   * Grille petite (15x15)
   * Idéale pour comprendre le comportement de base des algorithmes
   */
  small: {
    rows: 15,
    cols: 15,
    start: { row: 1, col: 1 },
    goal: { row: 13, col: 13 },
    optimalPathLength: 25,  // Longueur optimale en mode simple
    optimalPathCost: 25,    // Coût optimal en mode pondéré
    obstacles: [
      // === PIÈGE DFS : Long couloir sinueux en haut à gauche ===
      // DFS explorera cette impasse entièrement avant de revenir en arrière
      ...Array.from({ length: 10 }, (_, i) => ({ row: 0, col: 3 + i })), // Mur supérieur
      ...Array.from({ length: 5 }, (_, i) => ({ row: 1 + i, col: 3 })),  // Côté gauche du piège
      ...Array.from({ length: 4 }, (_, i) => ({ row: 5, col: 4 + i })),  // Bas du piège
      { row: 1, col: 12 }, { row: 2, col: 12 }, { row: 3, col: 12 },     // Extension droite du piège

      // === STRUCTURE CENTRALE DU LABYRINTHE ===
      // Mur vertical forçant un détour
      ...Array.from({ length: 6 }, (_, i) => ({ row: 6 + i, col: 6 })),
      // Barrières horizontales
      ...Array.from({ length: 4 }, (_, i) => ({ row: 8, col: 8 + i })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 11, col: 3 + i })),

      // === ZONE DE BRANCHEMENT (montre l'exploration BFS) ===
      { row: 4, col: 10 }, { row: 5, col: 11 },
      { row: 9, col: 4 }, { row: 10, col: 5 },
      { row: 12, col: 8 }, { row: 12, col: 9 }
    ],
    terrain: [
      // === CHEMIN DIRECT COÛTEUX (A* l'évitera) ===
      // Eau sur la route apparemment la plus courte
      { row: 7, col: 7, type: 'water' },
      { row: 8, col: 7, type: 'water' },
      { row: 9, col: 8, type: 'water' },
      { row: 10, col: 9, type: 'water' },
      { row: 11, col: 10, type: 'water' },

      // Boue près de l'approche de l'objectif
      { row: 12, col: 11, type: 'mud' },
      { row: 12, col: 12, type: 'mud' },
      { row: 11, col: 12, type: 'mud' },

      // === ALTERNATIVE PEU COÛTEUSE (route optimale A*) ===
      // Chemin d'herbe contournant
      ...Array.from({ length: 4 }, (_, i) => ({ row: 10 + i, col: 7, type: 'grass' }))
    ]
  },

  /**
   * Grille moyenne (25x25)
   * Complexité accrue avec plusieurs pièges et chemins
   */
  medium: {
    rows: 25,
    cols: 25,
    start: { row: 1, col: 1 },
    goal: { row: 23, col: 23 },
    optimalPathLength: 45,
    optimalPathCost: 44,
    obstacles: [
      // === PIÈGE DFS MAJEUR : Couloir en spirale en haut à droite ===
      // Gaspillera 30+ nœuds pour DFS
      ...Array.from({ length: 12 }, (_, i) => ({ row: 0, col: 10 + i })),   // Haut
      ...Array.from({ length: 8 }, (_, i) => ({ row: 1 + i, col: 10 })),    // Côté gauche
      ...Array.from({ length: 8 }, (_, i) => ({ row: 8, col: 11 + i })),    // Bas intérieur
      ...Array.from({ length: 6 }, (_, i) => ({ row: 2 + i, col: 18 })),    // Droite intérieure
      { row: 2, col: 19 }, { row: 2, col: 20 }, { row: 2, col: 21 },        // Extension impasse

      // === PIÈGE DFS SECONDAIRE : Couloir en bas à gauche ===
      ...Array.from({ length: 6 }, (_, i) => ({ row: 15 + i, col: 2 })),
      ...Array.from({ length: 4 }, (_, i) => ({ row: 20, col: 3 + i })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 17 + i, col: 6 })),

      // === LABYRINTHE CENTRAL ===
      // Murs verticaux
      ...Array.from({ length: 8 }, (_, i) => ({ row: 8 + i, col: 8 })),
      ...Array.from({ length: 10 }, (_, i) => ({ row: 6 + i, col: 15 })),
      // Murs horizontaux
      ...Array.from({ length: 5 }, (_, i) => ({ row: 12, col: 9 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 18, col: 10 + i })),

      // === COMPLEXITÉ DE BRANCHEMENT ===
      { row: 5, col: 5 }, { row: 6, col: 6 },
      { row: 10, col: 20 }, { row: 11, col: 21 },
      { row: 15, col: 18 }, { row: 16, col: 19 },
      { row: 21, col: 10 }, { row: 22, col: 11 }
    ],
    terrain: [
      // === BARRIÈRE D'EAU bloquant la diagonale directe ===
      ...Array.from({ length: 8 }, (_, i) => ({ row: 10 + i, col: 10 + i, type: 'water' })),
      { row: 18, col: 18, type: 'water' },
      { row: 19, col: 19, type: 'water' },

      // === ZONES DE BOUE ===
      ...Array.from({ length: 4 }, (_, i) => ({ row: 9 + i, col: 17, type: 'mud' })),
      ...Array.from({ length: 3 }, (_, i) => ({ row: 20, col: 17 + i, type: 'mud' })),
      { row: 21, col: 20, type: 'mud' },
      { row: 22, col: 21, type: 'mud' },

      // === CHEMIN D'HERBE PEU COÛTEUX (optimal A*) ===
      ...Array.from({ length: 6 }, (_, i) => ({ row: 16 + i, col: 8, type: 'grass' })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 22, col: 9 + i, type: 'grass' }))
    ]
  },

  /**
   * Grille grande (40x40)
   * Configuration complexe avec multiples pièges et terrains variés
   */
  large: {
    rows: 40,
    cols: 40,
    start: { row: 2, col: 2 },
    goal: { row: 37, col: 37 },
    optimalPathLength: 71,
    optimalPathCost: 73,
    obstacles: [
      // === PIÈGE DFS MASSIF #1 : Spirale supérieure (50+ nœuds gaspillés) ===
      ...Array.from({ length: 20 }, (_, i) => ({ row: 0, col: 8 + i })),     // Mur supérieur
      ...Array.from({ length: 12 }, (_, i) => ({ row: 1 + i, col: 8 })),     // Descente gauche
      ...Array.from({ length: 15 }, (_, i) => ({ row: 12, col: 9 + i })),    // Bas
      ...Array.from({ length: 10 }, (_, i) => ({ row: 2 + i, col: 23 })),    // Descente droite
      ...Array.from({ length: 8 }, (_, i) => ({ row: 2, col: 24 + i })),     // Impasse

      // === PIÈGE DFS #2 : Couloir gauche ===
      ...Array.from({ length: 15 }, (_, i) => ({ row: 18 + i, col: 3 })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 32, col: 4 + i })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 25 + i, col: 8 })),

      // === LABYRINTHE CENTRAL COMPLEXE ===
      // Barrières verticales majeures
      ...Array.from({ length: 15 }, (_, i) => ({ row: 15 + i, col: 15 })),
      ...Array.from({ length: 12 }, (_, i) => ({ row: 10 + i, col: 25 })),
      ...Array.from({ length: 10 }, (_, i) => ({ row: 20 + i, col: 32 })),

      // Barrières horizontales
      ...Array.from({ length: 10 }, (_, i) => ({ row: 20, col: 16 + i })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 28, col: 18 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 35, col: 20 + i })),

      ...Array.from({ length: 7 }, (_, i) => ({ row: 25, col: 33 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 20, col: 26 + i })),

      // === OBSTACLES ÉPARPILLÉS pour le branchement ===
      { row: 8, col: 35 }, { row: 9, col: 35 }, { row: 10, col: 36 },
      { row: 26, col: 36 },
      { row: 33, col: 28 }, { row: 34, col: 29 },
      { row: 15, col: 35 }, { row: 16, col: 36 }, { row: 17, col: 37 }
    ],
    terrain: [
      // === DIAGONALE D'EAU MAJEURE (chemin direct coûteux) ===
      ...Array.from({ length: 15 }, (_, i) => ({ row: 18 + i, col: 18 + i, type: 'water' })),

      // === ZONES DE BOUE autour de l'eau ===
      ...Array.from({ length: 10 }, (_, i) => ({ row: 17 + i, col: 17 + i, type: 'mud' })),
      ...Array.from({ length: 5 }, (_, i) => ({ row: 33 + i, col: 33 + i, type: 'mud' })),

      // === COULOIRS D'HERBE (chemins optimaux A*) ===
      // Route supérieure
      ...Array.from({ length: 10 }, (_, i) => ({ row: 14, col: 26 + i, type: 'grass' })),
      ...Array.from({ length: 8 }, (_, i) => ({ row: 15 + i, col: 35, type: 'grass' })),
      // Route inférieure
      ...Array.from({ length: 8 }, (_, i) => ({ row: 30 + i, col: 16, type: 'grass' })),
      ...Array.from({ length: 6 }, (_, i) => ({ row: 37, col: 17 + i, type: 'grass' }))
    ]
  }
};

/**
 * Types de terrain et leurs caractéristiques
 * Chaque type a un nom, un coût de traversée et une couleur d'affichage
 */
export const TERRAIN_TYPES = {
  ROAD: { name: 'road', cost: 1, color: '#f8f9fa' },      // Route : coût minimal
  GRASS: { name: 'grass', cost: 2, color: '#a3e635' },    // Herbe : coût léger
  MUD: { name: 'mud', cost: 3, color: '#92400e' },        // Boue : coût moyen
  WATER: { name: 'water', cost: 5, color: '#3b82f6' },    // Eau : coût élevé
  OBSTACLE: { name: 'obstacle', cost: Infinity, color: '#1f2937' } // Obstacle : infranchissable
};

/**
 * Construit une grille de terrain à partir des définitions prédéfinies
 * 
 * @param {number} rows - Nombre de lignes
 * @param {number} cols - Nombre de colonnes
 * @param {Array<Object>} obstacles - Liste des positions d'obstacles
 * @param {Array<Object>} terrainDefs - Définitions de terrain spécifiques
 * @param {Object} start - Position de départ (non utilisé ici mais passé pour cohérence)
 * @param {Object} goal - Position d'arrivée (non utilisé ici mais passé pour cohérence)
 * @returns {Array<Array<Object>>} Grille de terrain avec type et coût pour chaque cellule
 */
export function buildTerrainGrid(rows, cols, obstacles, terrainDefs, start, goal) {
  // Création d'une grille par défaut avec des routes (coût 1)
  const terrain = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      type: 'road',
      cost: 1
    }))
  );

  // Placement des obstacles (coût infini = infranchissable)
  obstacles.forEach(({ row, col }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      terrain[row][col] = { type: 'obstacle', cost: Infinity };
    }
  });

  // Application des définitions de terrain spécifiques
  terrainDefs.forEach(({ row, col, type }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      // Ne pas écraser les obstacles
      if (terrain[row][col].type !== 'obstacle') {
        const cost = TERRAIN_TYPES[type.toUpperCase()].cost;
        terrain[row][col] = { type, cost };
      }
    }
  });

  return terrain;
}
