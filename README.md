# 🧠 Algorithmes de Recherche en IA

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-blue?style=flat)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)

Application web React pour visualiser et comparer les algorithmes de recherche (BFS, DFS, A*) sur des problèmes de labyrinthe.

**Projet réalisé dans le cadre du module Intelligence Artificielle, FST 2024-2025**

---

## 🌐 Live Demo

🔗 **[Voir l'application en ligne](https://ai-pathfinding.vercel.app/)**

---

## 📸 Aperçu

![Demo](./demo.gif)

---

## 📋 Description

Ce projet implémente une étude comparative de trois algorithmes fondamentaux de recherche en IA :
- **BFS** (Breadth-First Search) — Recherche en largeur
- **DFS** (Depth-First Search) — Recherche en profondeur  
- **A*** — Algorithme de recherche informée avec heuristiques

L'application permet de visualiser en temps réel le comportement de chaque algorithme et de comparer leurs performances.

---

## ✨ Fonctionnalités

### Algorithmes
- **Recherche en Largeur (BFS)** : Garantit le chemin optimal en nombre d'étapes
- **Recherche en Profondeur (DFS)** : Exploration en profondeur avec backtracking
- **Algorithme A*** : Recherche informée avec 3 heuristiques au choix
  - Distance de Manhattan
  - Distance Euclidienne
  - Distance de Chebyshev

### Modes de Terrain
- **Mode Simple** : Coût uniforme (toutes les cases = 1)
- **Mode Pondéré** : Coûts variables selon le terrain (route, herbe, boue, eau)

### Tailles de Grille
- Petite (15×15)
- Moyenne (25×25)
- Grande (40×40)

### Métriques Affichées
- Nœuds explorés
- Temps d'exécution
- Longueur du chemin
- Coût total (mode pondéré)
- Pénétrance
- Facteur de branchement

---

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/DivineSpeed/ai-pathfinding.git
cd ai-pathfinding

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

---

## 📁 Structure du Projet

```
src/
├── algorithms/
│   ├── bfs.js          # Implémentation BFS
│   ├── dfs.js          # Implémentation DFS
│   └── aStar.js        # Implémentation A* avec heuristiques
├── components/
│   ├── Grid.jsx        # Visualisation de la grille
│   ├── Controls.jsx    # Panneau de contrôle
│   └── Metrics.jsx     # Affichage des métriques
├── utils/
│   └── mazeConfig.js   # Configuration des labyrinthes
├── App.jsx             # Composant principal
└── main.jsx            # Point d'entrée
```

---

## 🎮 Utilisation

1. **Sélectionner** la taille de la grille
2. **Choisir** l'algorithme (BFS, DFS ou A*)
3. **Si A***, sélectionner l'heuristique
4. **Optionnel** : Activer le mode terrain pondéré
5. **Cliquer** sur "Démarrer" pour lancer la visualisation
6. **Observer** les métriques de performance

---

## 📊 Résultats Attendus

| Algorithme | Optimalité (Simple) | Optimalité (Pondéré) | Efficacité | Mémoire |
|------------|---------------------|----------------------|------------|---------|
| BFS | ✅ Oui | ❌ Non | Moyenne | Élevée |
| DFS | ❌ Non | ❌ Non | Faible* | Faible |
| A* | ✅ Oui | ✅ Oui | Élevée | Moyenne |

*\*DFS peut être rapide sur de grands espaces mais la qualité du chemin est faible.*

---

## 🛠️ Technologies

- **React 18** — Framework UI
- **Vite** — Build tool
- **JavaScript ES6+** — Langage
- **CSS3** — Stylisation et animations

---

## 👤 Auteur

**Mohamed Said Chbinou**  

**Encadré par** : Dr. Narjes Doggaz

---

## 📄 Licence

Ce projet est réalisé dans un cadre académique.
