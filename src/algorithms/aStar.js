/**
 * Algorithme de recherche A* avec différentes heuristiques
 * 
 * A* est un algorithme de recherche informée qui utilise une fonction
 * d'évaluation f(n) = g(n) + h(n) où :
 * - g(n) : coût réel du chemin depuis le départ jusqu'au nœud n
 * - h(n) : estimation heuristique du coût jusqu'à l'objectif
 */

/**
 * Calcule la distance de Manhattan entre deux points
 * Heuristique admissible pour les mouvements à 4 directions
 * @param {Object} a - Premier point avec propriétés row et col
 * @param {Object} b - Second point avec propriétés row et col
 * @returns {number} Distance de Manhattan
 */
function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Calcule la distance Euclidienne entre deux points
 * Distance en ligne droite (vol d'oiseau)
 * @param {Object} a - Premier point avec propriétés row et col
 * @param {Object} b - Second point avec propriétés row et col
 * @returns {number} Distance Euclidienne
 */
function euclideanDistance(a, b) {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

/**
 * Calcule la distance de Chebyshev entre deux points
 * Aussi appelée distance de l'échiquier (mouvements diagonaux autorisés)
 * @param {Object} a - Premier point avec propriétés row et col
 * @param {Object} b - Second point avec propriétés row et col
 * @returns {number} Distance de Chebyshev
 */
function chebyshevDistance(a, b) {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

/**
 * Dictionnaire des heuristiques disponibles
 * Chaque heuristique a un nom d'affichage et une fonction de calcul
 */
const HEURISTICS = {
  manhattan: { name: 'Manhattan', func: manhattanDistance },
  euclidean: { name: 'Euclidean', func: euclideanDistance },
  chebyshev: { name: 'Chebyshev', func: chebyshevDistance }
};

/**
 * Implémentation d'une file de priorité pour l'algorithme A*
 * Les éléments avec la plus petite priorité sont retirés en premier
 */
class PriorityQueue {
  constructor() {
    this.items = []; // Tableau stockant les éléments avec leur priorité
  }

  /**
   * Ajoute un élément à la file avec sa priorité
   * @param {any} item - L'élément à ajouter
   * @param {number} priority - La priorité de l'élément (plus petit = plus prioritaire)
   */
  enqueue(item, priority) {
    this.items.push({ item, priority });
    // Tri par ordre croissant de priorité
    this.items.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Retire et retourne l'élément avec la plus haute priorité (plus petite valeur)
   * @returns {any} L'élément avec la plus petite priorité
   */
  dequeue() {
    return this.items.shift().item;
  }

  /**
   * Vérifie si la file est vide
   * @returns {boolean} Vrai si la file est vide
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Retourne le nombre d'éléments dans la file
   * @returns {number} Taille de la file
   */
  size() {
    return this.items.length;
  }
}

/**
 * Algorithme A* - Recherche du chemin le plus court avec heuristique
 * 
 * @param {Array<Array<string>>} grid - La grille représentant le labyrinthe
 * @param {Object} start - Position de départ {row, col}
 * @param {Object} goal - Position d'arrivée {row, col}
 * @param {string} heuristicName - Nom de l'heuristique à utiliser ('manhattan', 'euclidean', 'chebyshev')
 * @param {number} optimalPathLength - Longueur du chemin optimal pour comparaison
 * @param {Array<Array<Object>>|null} terrain - Grille de terrain avec coûts (null = coût uniforme)
 * @returns {Object} Résultats incluant le chemin, les métriques et les statistiques
 */
export function aStar(grid, start, goal, heuristicName = 'manhattan', optimalPathLength, terrain = null) {
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

  // Sélection de la fonction heuristique
  const heuristic = HEURISTICS[heuristicName].func;

  // Initialisation de la file de priorité (open set)
  // On commence avec le nœud de départ, priorité = h(départ)
  const openSet = new PriorityQueue();
  openSet.enqueue({ ...start, path: [start], g: 0 }, heuristic(start, goal));

  // Ensemble des nœuds déjà visités (closed set)
  const visited = new Set();

  // Dictionnaire des meilleurs scores g connus pour chaque nœud
  const gScore = { [`${start.row},${start.col}`]: 0 };

  // Liste ordonnée des nœuds visités (pour la visualisation)
  const visitedNodes = [];

  // Compteurs pour les métriques
  let nodesExpanded = 0;      // Nombre de nœuds développés
  let totalSuccessors = 0;    // Nombre total de successeurs générés
  let totalHeuristic = 0;     // Somme des valeurs heuristiques
  let totalFValue = 0;        // Somme des valeurs f
  const isWeighted = terrain !== null; // Mode pondéré actif ?

  // Définition des directions de mouvement (haut, droite, bas, gauche)
  const directions = [
    { row: -1, col: 0 },  // Haut
    { row: 0, col: 1 },   // Droite
    { row: 1, col: 0 },   // Bas
    { row: 0, col: -1 }   // Gauche
  ];

  // Boucle principale de l'algorithme A*
  while (!openSet.isEmpty()) {
    // Extraction du nœud avec la plus petite valeur f
    const current = openSet.dequeue();
    const currentKey = `${current.row},${current.col}`;

    // Ignorer si déjà visité (peut arriver avec des chemins alternatifs)
    if (visited.has(currentKey)) continue;

    // Marquer comme visité et enregistrer pour la visualisation
    visited.add(currentKey);
    nodesExpanded++;
    visitedNodes.push({ row: current.row, col: current.col });

    // Calcul des valeurs h et f pour les statistiques
    const h = heuristic({ row: current.row, col: current.col }, goal);
    const f = current.g + h;
    totalHeuristic += h;
    totalFValue += f;

    // Test d'arrivée : avons-nous atteint l'objectif ?
    if (current.row === goal.row && current.col === goal.col) {
      // Succès ! Calcul des métriques finales
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      const pathLength = current.path.length;
      const pathCost = current.g;

      // Calcul des métriques d'efficacité
      const branchingFactor = totalSuccessors / nodesExpanded;           // Facteur de branchement moyen
      const pathOptimalityRatio = optimalPathLength / pathLength;        // Ratio d'optimalité
      const searchEfficiencyRate = (pathLength / nodesExpanded) * 100;   // Taux d'efficacité de recherche
      const penetrance = pathLength / nodesExpanded;                     // Pénétrance
      const completionPercentage = (nodesExpanded / totalFreeSpaces) * 100; // Pourcentage de couverture
      const nodesPerSecond = nodesExpanded / (executionTime / 1000);     // Vitesse de traitement
      const avgHeuristic = totalHeuristic / nodesExpanded;               // Heuristique moyenne
      const avgFValue = totalFValue / nodesExpanded;                     // Valeur f moyenne

      return {
        success: true,
        path: current.path,
        visitedNodes,
        nodesExpanded,
        totalSuccessors,
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

    // Exploration des voisins (génération des successeurs)
    let successorsGenerated = 0;
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;
      const neighborKey = `${newRow},${newCol}`;

      // Vérification de la validité de la position
      if (
        newRow >= 0 && newRow < rows &&     // Dans les limites verticales
        newCol >= 0 && newCol < cols &&     // Dans les limites horizontales
        grid[newRow][newCol] !== 'obstacle' && // Pas un obstacle
        !visited.has(neighborKey)           // Pas encore visité
      ) {
        // Calcul du nouveau score g (coût réel jusqu'à ce voisin)
        const moveCost = getTerrainCost(newRow, newCol);
        const newG = current.g + moveCost;

        // Mise à jour si c'est un meilleur chemin vers ce nœud
        if (!gScore[neighborKey] || newG < gScore[neighborKey]) {
          gScore[neighborKey] = newG;
          const neighbor = { row: newRow, col: newCol };
          const f = newG + heuristic(neighbor, goal); // f = g + h
          successorsGenerated++;

          // Ajout à la file de priorité avec la valeur f
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

  // Échec : aucun chemin trouvé
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
    totalSuccessors,
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
