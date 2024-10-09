import React from 'react';
import Mermaid from 'react-mermaid2';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Schema({chart}) {
  let process = [
    {
      title: "Processus de création d'un contenu avec une Content Factory",
      prompt: "J'ai 5 acteurs : un éditeur, un copywriter, un graphiste, un social expert et un expert SEO. Dessine-moi avec MermaidJS le processus de création d'un contenu dans une usine à contenus avec ces acteurs.",
      pre: `Pour illustrer le processus de création de contenu dans une usine à contenus impliquant un éditeur, un copywriter, un graphiste, un expert en médias sociaux (social expert) et un expert SEO, voici comment vous pourriez structurer le flux de travail avec MermaidJS. Ce script MermaidJS dépeint une séquence typique dans laquelle le contenu est développé, de l'idéation à la publication, en passant par l'optimisation pour les moteurs de recherche et les médias sociaux.`,
      post: `
Ce diagramme commence par l'éditeur qui définit le sujet du contenu. Ensuite, le copywriter crée le texte, suivi par le graphiste qui ajoute des éléments visuels au contenu. Parallèlement, le copywriter et l'expert SEO travaillent sur l'optimisation du texte pour les moteurs de recherche. Une fois optimisé, le contenu est adapté par l'expert en médias sociaux pour une diffusion efficace sur les réseaux sociaux, avant sa publication finale sur le site web et les différentes plateformes sociales.

Pour utiliser ce script dans MermaidJS, vous pouvez l'insérer dans un environnement qui supporte Mermaid (comme un éditeur Markdown qui l'interprète, ou directement sur des sites web qui permettent l'intégration de MermaidJS) pour générer visuellement le diagramme du processus.
      `,
      workflow: `
      %%{init: { "logLevel": 1 } }%%
      flowchart TD
      A[Éditeur] -->|Définit le sujet| B[Copywriter]
      B -->|Crée le contenu| C[Graphiste]
      C -->|Ajoute des visuels| D[Expert SEO]
      B -->|Optimisation du texte| D
      D -->|Optimise pour SEO| E[Social Expert]
      E -->|Adapte pour les réseaux sociaux| F[Publication sur le site web et réseaux sociaux]  
      `
    },
    {
      title: "Stratégie à suivre pour créer de la notoriété",
      prompt: "Je veux créer de la notoriété autour de la société Veep, solution SaaS en marque blanche de content factory. Que me conseillerais-tu de faire ?",
      pre: `Créer de la notoriété autour de Veep, votre solution SaaS en marque blanche de content factory, nécessite une stratégie bien pensée qui met en avant votre proposition de valeur unique et engage efficacement votre public cible. Voici plusieurs axes à développer pour atteindre cet objectif :`,
      post: `
Dans ce diagramme, nous commençons par le développement d'une stratégie de contenu qui inclut la création de blogs, d'articles de fond, d'études de cas, de webinaires et de tutoriels. Ensuite, nous déployons une stratégie sur les médias sociaux avec des publications engageantes et des campagnes publicitaires ciblées. Parallèlement, nous travaillons sur le référencement (SEO) du contenu publié sur le blog et le site web, en se concentrant sur la recherche et l'implémentation de mots-clés stratégiques.

Les partenariats et la publicité jouent également un rôle clé, avec la recherche de collaborations avec des influenceurs et des partenaires, ainsi que la mise en place de publicité en ligne via Google Ads et d'autres plateformes spécialisées.

Enfin, l'analyse et l'optimisation sont cruciales pour mesurer les performances de toutes ces actions à l'aide d'outils comme Google Analytics et les outils des réseaux sociaux, en plus de réaliser des tests A/B pour optimiser les campagnes en cours.

Ce graphique Mermaid vous donne une vue d'ensemble de la stratégie recommandée pour créer de la notoriété autour de Veep, et souligne l'importance de l'analyse continue et de l'optimisation pour maximiser l'efficacité de vos efforts marketing.
      `,
      workflow: `
      graph TD
      A[Stratégie de Contenu] -->|Créer du contenu pertinent| B[Blog & Articles de fond]
      A -->|Études de cas & Témoignages| C[Études de cas]
      A -->|Webinaires & Tutoriels| D[Webinaires]
      
      E[Médias Sociaux] -->|Posts & Stories engageants| F[LinkedIn, Twitter]
      E -->|Campagnes ciblées| G[Publicité sur Réseaux Sociaux]
      
      H[SEO] -->|Optimisation du contenu| I[Blog & Site Web]
      H -->|Mots-clés stratégiques| J[Recherche de Mots-clés]
      
      K[Partenariats & Publicité] -->|Collaborations| L[Influenceurs & Partenaires]
      K -->|Publicité en ligne| M[Google Ads & Plateformes spécialisées]
      
      N[Analyse & Optimisation] -->|Suivi des performances| O[Google Analytics & Outils Réseaux Sociaux]
      N -->|A/B Testing| P[Optimisation des Campagnes]
      
      B --> N
      C --> N
      D --> N
      F --> N
      G --> N
      I --> N
      L --> N
      M --> N
      `
    },
    {
      title: "Processus de création d'un contenu avec une Content Factory",
      prompt: "Organise toute cette stratégie avec les 5 acteurs définis initialement et réalise un diagramme de flux mermaid pour l'illustrer",
      pre: `Pour organiser la stratégie de création de notoriété autour de Veep, intégrant les cinq acteurs initialement définis (Éditeur, Copywriter, Graphiste, Social Expert, Expert SEO), nous allons élaborer un diagramme de flux qui illustre comment ces rôles interagissent dans le cadre de cette stratégie marketing.`,
      post: `
Ce diagramme commence par l'éditeur, qui définit la stratégie globale de contenu et planifie les sujets. L'éditeur dirige ensuite le copywriter pour la rédaction du contenu, tandis que l'expert SEO s'occupe de la recherche de mots-clés et de l'optimisation SEO. Le graphiste crée les visuels nécessaires tant pour le contenu que pour les réseaux sociaux. Le social expert prend le relais pour gérer les publications sur les réseaux sociaux et créer les campagnes publicitaires. L'expert SEO, le copywriter, et le graphiste collaborent sur la création de webinaires et tutoriels, qui sont également promus par le social expert. Finalement, l'analyse des performances et l'optimisation sont effectuées, alimentant un cycle d'itération continue pour améliorer constamment la stratégie.

Cette organisation reflète une approche collaborative où chaque acteur joue un rôle clé à différentes étapes du processus de création et de promotion du contenu, avec un fort accent sur l'analyse et l'optimisation pour guider les ajustements stratégiques.`,
      workflow: `
      graph TD
      Start[Start] --> A[Éditeur]
      A -->|Définit la stratégie de contenu| B[Copywriter]
      A -->|Planifie les sujets| C[Expert SEO]
      B -->|Rédige contenu pour Blog & Articles| D[Graphiste]
      B -->|Rédige études de cas| D
      C -->|Recherche de mots-clés pour SEO| B
      C -->|Optimisation SEO des contenus| B
      D -->|Crée visuels pour contenu & Réseaux sociaux| E[Social Expert]
      E -->|Gère les publications sur les réseaux sociaux| F[Analyse & Optimisation]
      E -->|Crée campagnes publicitaires sur réseaux sociaux| F
      A -->|Supervise création de Webinaires & Tutoriels| G[Webinaires & Tutoriels]
      G --> D
      G --> E
      F -->|Analyse performances & Optimise| A
      F --> End[Continue iterating]  
      `
    },
    {
      title: "Diagramme de séquences illustrant la stratégie de création de notoriété pour Veep.",
      prompt: "Crée finalement plutôt un diagramme de séquence pour l'illustrer",
      pre: `Pour illustrer la stratégie de création de notoriété autour de Veep avec les cinq acteurs définis (Éditeur, Copywriter, Graphiste, Social Expert, Expert SEO) sous forme de diagramme de séquence MermaidJS, nous allons détailler les interactions entre ces acteurs tout au long du processus de création et de promotion du contenu. Ce format met en lumière la séquence d'actions et les interactions spécifiques entre les différents rôles.`,
      post: `
Ce diagramme de séquence commence par l'éditeur qui définit la stratégie de contenu et communique avec le copywriter pour la création du contenu. Le copywriter travaille ensuite avec l'expert SEO pour l'optimisation du contenu en termes de SEO, et avec le graphiste pour la création des visuels nécessaires. Une fois le contenu prêt et optimisé, il est transmis au social expert pour la préparation et l'exécution du plan de publication et des campagnes publicitaires sur les réseaux sociaux. L'expert SEO fournit également des suggestions sur les mots-clés et les stratégies SEO à l'éditeur. Le social expert propose ensuite un plan de publication et des campagnes publicitaires à l'éditeur, qui doit les valider. Après l'exécution du plan, le social expert rapporte les performances à l'éditeur, qui ajuste la stratégie globale en fonction des résultats obtenus.

Ce diagramme illustre la séquence d'interactions et le flux de travail collaboratif entre les différents acteurs impliqués dans le processus de création de notoriété pour Veep, soulignant l'importance de l'optimisation continue et de l'adaptation basée sur les performances.`,
      workflow: `
      %%{
        init: {
          "theme": "dark",
          "fontFamily": "monospace",
          "logLevel": "info",
          "sequenceDiagram": {
            "htmlLabels": true,
            "curve": "linear"
          },
          "sequence": {
            "mirrorActors": true
          }
        }
      }%%
      sequenceDiagram
      participant Éditeur
      participant Copywriter
      participant Graphiste
      participant SocialExpert as Social Expert
      participant ExpertSEO as Expert SEO
  
      Éditeur->>+Copywriter: Définit la stratégie de contenu
      Copywriter->>+ExpertSEO: Soumet contenu pour optimisation SEO
      ExpertSEO->>-Copywriter: Retourne contenu optimisé
      Copywriter->>+Graphiste: Demande création visuels
      Graphiste->>-Copywriter: Livre visuels
      Copywriter->>+SocialExpert: Fournit contenu & visuels pour réseaux sociaux
      ExpertSEO->>+Éditeur: Suggère mots-clés & stratégies SEO
      SocialExpert->>+Éditeur: Propose plan publication & campagnes publicitaires
      Éditeur->>SocialExpert: Valide plan publication & campagnes
      SocialExpert->>+SocialExpert: Exécute plan publication & campagnes
      SocialExpert->>Éditeur: Rapporte sur les performances
      Éditeur->>Éditeur: Ajuste la stratégie globale basée sur les performances  
      `
    },
  ]

  return (
    <>
      {
        process.map((row) => {
          return (
            <>
              <h1>{row.title}</h1>
              <p>{row.prompt}</p>
              <Markdown remarkPlugins={[remarkGfm]}>{row.pre}</Markdown>
              <Mermaid chart={`${row.workflow}`} />
              <Markdown remarkPlugins={[remarkGfm]}>{row.post}</Markdown>
            </>
          )
        })
      }
    </>
  )
}

