/**
 * Composant Metrics - Affichage des métriques de performance
 * 
 * Ce composant affiche les statistiques et métriques calculées
 * après l'exécution d'un algorithme de recherche.
 */

import React from 'react';
import './Metrics.css';

/**
 * Panneau d'affichage des métriques de performance
 * @param {Object} props.results - Résultats de l'algorithme (null si pas encore exécuté)
 */
const Metrics = ({ results }) => {
  // Affichage par défaut si aucun résultat
  if (!results) {
    return (
      <div className="metrics-panel">
        <h2>Métriques de Performance</h2>
        <p className="no-results">Exécutez un algorithme pour voir les métriques</p>
      </div>
    );
  }

  // Calcul du ratio d'optimalité selon le mode (coût ou étapes)
  const foundValue = results.isWeighted ? results.pathCost : results.pathLength;
  const optimalValue = results.optimalPathLength;
  const optimalityRatio = optimalValue / foundValue;

  return (
    <div className="metrics-panel">
      <h2>Métriques de Performance</h2>

      {/* Résultats principaux */}
      <div className="metric-grid">
        {/* Statut de la recherche */}
        <div className="metric-card">
          <div className="metric-label">Statut</div>
          <div className={`metric-value ${results.success ? 'success' : 'failure'}`}>
            {results.success ? '✓ Chemin Trouvé' : '✗ Aucun Chemin'}
          </div>
        </div>

        {/* Nombre de nœuds générés (successeurs) */}
        <div className="metric-card">
          <div className="metric-label">Nœuds Générés</div>
          <div className="metric-value">{results.totalSuccessors.toLocaleString()}</div>
        </div>

        {/* Nombre de nœuds explorés */}
        <div className="metric-card">
          <div className="metric-label">Nœuds Explorés</div>
          <div className="metric-value">{results.nodesExpanded.toLocaleString()}</div>
        </div>

        {/* Temps d'exécution */}
        <div className="metric-card">
          <div className="metric-label">Temps d'Exécution</div>
          <div className="metric-value">{results.executionTime.toFixed(2)} ms</div>
        </div>

        {/* Longueur du chemin */}
        <div className="metric-card">
          <div className="metric-label">Longueur du Chemin</div>
          <div className="metric-value">
            {results.pathLength > 0 ? results.pathLength : 'N/A'}
          </div>
        </div>

        {/* Coût total (mode pondéré uniquement) */}
        {results.isWeighted && (
          <div className="metric-card">
            <div className="metric-label">Coût Total du Chemin</div>
            <div className="metric-value">
              {results.pathCost > 0 ? results.pathCost.toFixed(0) : 'N/A'}
            </div>
          </div>
        )}

        {/* Heuristique utilisée (A* uniquement) */}
        {results.heuristic && (
          <div className="metric-card">
            <div className="metric-label">Heuristique Utilisée</div>
            <div className="metric-value">{results.heuristic}</div>
          </div>
        )}
      </div>

      {/* Métriques détaillées si chemin trouvé */}
      {results.success && (
        <>
          {/* Section efficacité d'exploration */}
          <div className="efficiency-score">
            <h3>📊 Efficacité d'Exploration</h3>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Facteur de Branchement :</span>
                <strong>{results.branchingFactor.toFixed(2)}</strong>
              </div>
              <span className="metric-hint">Moyenne de successeurs générés par nœud</span>
            </div>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Pénétrance :</span>
                <strong>{(results.penetrance * 100).toFixed(2)}%</strong>
              </div>
              <span className="metric-hint">Ratio chemin/nœuds explorés — plus élevé = plus efficace</span>
            </div>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Couverture de l'Espace :</span>
                <strong>{results.completionPercentage.toFixed(1)}%</strong>
              </div>
              <span className="metric-hint">{results.nodesExpanded}/{results.totalFreeSpaces} cellules explorées</span>
            </div>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Vitesse de Traitement :</span>
                <strong>{results.nodesPerSecond.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} n/s</strong>
              </div>
              <span className="metric-hint">{(results.executionTime / results.nodesExpanded).toFixed(4)} ms par nœud</span>
            </div>
          </div>

          {/* Section qualité du chemin */}
          <div className="efficiency-score">
            <h3>🎯 Qualité du Chemin</h3>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Mode de Comparaison :</span>
                <strong>{results.isWeighted ? 'Coût' : 'Étapes'}</strong>
              </div>
              <span className="metric-hint">{results.isWeighted ? 'Terrain pondéré actif' : 'Coût uniforme (1 par pas)'}</span>
            </div>

            <div className="efficiency-item">
              <div className="item-main">
                <span>{results.isWeighted ? 'Coût' : 'Longueur'} Optimal{results.isWeighted ? '' : 'e'} :</span>
                <strong>{optimalValue}</strong>
              </div>
              <span className="metric-hint">Valeur de référence (chemin idéal)</span>
            </div>

            <div className="efficiency-item">
              <div className="item-main">
                <span>Ratio d'Optimalité :</span>
                <strong>{optimalityRatio.toFixed(3)}</strong>
              </div>
              <span className={`metric-hint ${optimalityRatio >= 0.99 ? 'optimal' : optimalityRatio >= 0.95 ? 'near-optimal' : 'suboptimal'}`}>
                {optimalityRatio >= 0.99
                  ? '✓ Chemin optimal trouvé'
                  : optimalityRatio >= 0.95
                    ? '≈ Quasi-optimal'
                    : `${((1 - optimalityRatio) * 100).toFixed(1)}% au-dessus de l'optimal`}
              </span>
            </div>
          </div>

          {/* Métriques spécifiques A* */}
          {results.avgHeuristic !== undefined && (
            <div className="efficiency-score">
              <h3>⭐ Métriques Spécifiques A*</h3>

              <div className="efficiency-item">
                <div className="item-main">
                  <span>Heuristique Moyenne (h) :</span>
                  <strong>{results.avgHeuristic.toFixed(2)}</strong>
                </div>
                <span className="metric-hint">Distance estimée moyenne vers le but</span>
              </div>

              <div className="efficiency-item">
                <div className="item-main">
                  <span>Valeur f Moyenne :</span>
                  <strong>{results.avgFValue.toFixed(2)}</strong>
                </div>
                <span className="metric-hint">f = g + h (coût total estimé moyen)</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Statistiques si échec */}
      {!results.success && (
        <div className="efficiency-score">
          <h3>🗺️ Statistiques d'Exploration</h3>

          <div className="efficiency-item">
            <div className="item-main">
              <span>Facteur de Branchement :</span>
              <strong>{results.branchingFactor.toFixed(2)}</strong>
            </div>
            <span className="metric-hint">Successeurs moyens par nœud</span>
          </div>

          <div className="efficiency-item">
            <div className="item-main">
              <span>Couverture de l'Espace :</span>
              <strong>{results.completionPercentage.toFixed(1)}%</strong>
            </div>
            <span className="metric-hint">Exploration exhaustive effectuée</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
