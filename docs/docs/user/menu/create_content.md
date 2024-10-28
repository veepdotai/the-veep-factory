---
id: user-creation
title: Content Creation & Assistants
hide_table_of_contents: false
pagination_label: Content Creation Through Assistants
#custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: How do I use an assistant?
keywords:
  - menu
  - assistant
tags: [assistant]
#image: https://i.imgur.com/mErPwqL.png
#slug: /myDoc
last_update:
  date: 10/27/2024
  author: Jean-Christophe Kermagoret
---

# Création de contenu

Veep.AI prend un contenu en entrée et produit, en fonction de la veeplet choisie, le contenu attendu.

Le contenu en entrée peut être :
* un vocal, c'est à dire un audio que vous faites en direct dans Veep. Pour le moment, le vocal ne peut pas dépasser 40 minutes.
* un fichier audio, pdf, ms office (.docx, .xlsx, .pptx...), *office (.odt, .ods, .odp), texte... Seuls 50Ko seront pris en compte (ce qui fait déjà un livre de 100 pages).
* un texte fourni dans la zone de saisie par copier/coller. Seuls 50Ko seront pris en compte (ce qui fait toujours un libre de 100 pages).
* un url. Attention, seuls les sites non Javascript sont pris en compte.

Les veeplets sont, au moment où ces lignes sont écrites :
* Catégorie Comm/marketing :
  * 3 posts LI : pour créer 3 posts LI avec un ton différent
  * LI + FB + Insta : pour créer un post LI, un post FB, un post Insta
  * LI pour la semaine : pour créer 5 posts LI, soit un pour chaque jour de la semaine
* Catégorie Transverse :
  * Fiche de synthèse : pour créer un document de synthèse de 5 pages (intro, développement sur 3 paragraphes, conclusion)

Lorsque vous cliquez sur Go !, selon la veeplet choisie, plusieurs contenus intermédiaires vont être générés :
* Transcription : c'est le texte obtenu à partir de l'audio, du fichier, du texte, de l'url fourni.

:::danger[Attention]
A l'issue de la transcription, le processus s'arrête car vous pouvez modifier le contenu correspondant pour, par exemple, corriger un nom propre ou un mot mal compris par l'IA.
:::

:::tip[Cliquez sur Continuer]
Cliquez sur Continuer pour que la génération reprenne. Globalement, à chaque panneau stop, représenté par l'icône correspondante, le processus de génération s'arrête. Il faut alors cliquer sur Continuer pour que le processus reprenne.
:::

La veeplet est préconfigurée avec un certain nombre d'étapes. Vous pouvez créer votre propre veeplet et mettre autant d'étapes que vous souhaitez (par exemple 30 pour générer 30 posts LinkedIn pour le mois en cours ? On verra ça plus tard.)

En fonction de la veeplet choisie, le contenu peut être :
* 3 posts LinkedIn, générés avec un ton différent, afin de vous permettre de comparer les posts et choisir celui qui vous intéresse
* 3 posts dont un post LinkedIn, un post Insta, un post Facebook
* une fiche de synthèse de 5 pages, détaillant les informations fournies en entrée. Cette fiche est composée d'un plan, d'une introduction, de 3 paragraphes et d'une conclusion.

A l'issue de l'exécution de la veeplet, les éléments sont accessibles par le menu "Mes contenus" où ils peuvent être modifiées et sauvegardées pour être réutilisés ultérieurement.
