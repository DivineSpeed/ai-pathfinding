/**
 * Algorithme de Recherche en Largeur (BFS - Breadth-First Search)
 * 
 * BFS explore tous les nœuds à une distance donnée avant de passer
 * aux nœuds plus éloignés. Il garantit de trouver le chemin le plus
 * court en nombre d'étapes dans un graphe non pondéré.
 * 
 * Caractéristiques :
 * - Complet : trouve toujours une solution si elle existe
 * - Optimal : trouve le chemin le plus court (en coût uniforme)
 * - Complexité temporelle : O(b^d) où b = facteur de branchement, d = profondeur
 * - Complexité spatiale : O(b^d) - mémorise tous les nœuds du niveau courant
 */

/**
 * Exécute l'algorithme BFS pour trouver un chemin
 * 
 * @param {Array<Array<string>>} grid - La grille représentant le labyrinthe
 * @param {Object} start - Position de départ {row, col}
 * @param {Object} goal - Position d'arrivée {row, col}
 * @param {number} optimalPathLength - Longueur optimale pour comparaison
 * @param {Array<Array<Object>>|null} terrain - Grille de terrain avec coûts (null = coût uniforme)
 * @returns {Object} Résultats incluant le chemin, les métriques et les statistiques
 */
export function bfs(grid, start, goal, optimalPathLength, terrain = null) {
  // Démarrage du chronomètre pour mesurer le temps d'exécution
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;

  /**
   * Fonction auxiliaire pour obtenir le coût de déplacement vers une cellule
   * @param {number} row - Ligne de la cellule
   * @param {number} col - Colonne de la cellule
   * @returns {number} Coût du terrain (1 si pas de terrain pondéré)
   */
  const getTerrainCost = (row, col) => {
    if (!terrain) return 1; // Coût uniforme si pas de terrain
    return terrain[row][col].cost;
  };

  // Comptage des espaces libres pour calculer le pourcentage de couverture
  let totalFreeSpaces = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 'obstacle') totalFreeSpaces++;
    }
  }

  // Initialisation de la file FIFO (First In, First Out)
  // Chaque élément contient : position, chemin parcouru, et coût accumulé
  const queue = [{ ...start, path: [start], cost: 0 }];

  // Ensemble des positions déjà visitées (évite les boucles infinies)
  const visited = new Set([`${start.row},${start.col}`]);

  // Liste ordonnée des nœuds visités (pour la visualisation)
  const visitedNodes = [];

  // Compteurs pour les métriques
  let nodesExpanded = 0;      // Nombre de nœuds développés
  let totalSuccessors = 0;    // Nombre total de successeurs générés
  const isWeighted = terrain !== null; // Mode pondéré actif ?

  // Définition des directions de mouvement (haut, droite, bas, gauche)
  const directions = [
    { row: -1, col: 0 },  // Haut
    { row: 0, col: 1 },   // Droite
    { row: 1, col: 0 },   // Bas
    { row: 0, col: -1 }   // Gauche
  ];

  // Boucle principale de BFS
  while (queue.length > 0) {
    // Extraction du premier élément de la file (FIFO)
    const current = queue.shift();
    nodesExpanded++;

    // Enregistrement pour la visualisation
    visitedNodes.push({ row: current.row, col: current.col });

    // Test d'arrivée : avons-nous atteint l'objectif ?
    if (current.row === goal.row && current.col === goal.col) {
      // Succès ! Calcul des métriques finales
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      const pathLength = current.path.length;
      const pathCost = current.cost;

      // Calcul des métriques d'efficacité
      const branchingFactor = totalSuccessors / nodesExpanded;           // Facteur de branchement moyen
      const pathOptimalityRatio = optimalPathLength / pathLength;        // Ratio d'optimalité
      const searchEfficiencyRate = (pathLength / nodesExpanded) * 100;   // Taux d'efficacité de recherche
      const penetrance = pathLength / nodesExpanded;                     // Pénétrance
      const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100; // Pourcentage de couverture
      const nodesPerSecond = nodesExpanded / (executionTime / 1000);     // Vitesse de traitement

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

    // Exploration des voisins (génération des successeurs)
    let successorsGenerated = 0;
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;
      const key = `${newRow},${newCol}`;

      // Vérification de la validité de la position
      if (
        newRow >= 0 && newRow < rows &&     // Dans les limites verticales
        newCol >= 0 && newCol < cols &&     // Dans les limites horizontales
        grid[newRow][newCol] !== 'obstacle' && // Pas un obstacle
        !visited.has(key)                   // Pas encore visité
      ) {
        // Marquer comme visité immédiatement (avant l'ajout à la file)
        visited.add(key);
        successorsGenerated++;

        // Calcul du coût pour cette cellule
        const moveCost = getTerrainCost(newRow, newCol);

        // Ajout à la fin de la file (FIFO)
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

  // Échec : aucun chemin trouvé (file vidée sans atteindre l'objectif)
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
