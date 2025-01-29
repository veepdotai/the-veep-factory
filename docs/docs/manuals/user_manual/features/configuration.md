---
id: configuration
title: Configuration
hide_table_of_contents: false
#custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: Is there a list of all the features?
keywords:
  - veepdotai
  - features
tags: [features]
#image: https://i.imgur.com/mErPwqL.png
last_update:
  date: 01/27/2025
  author: Jean-Christophe Kermagoret
---

# Configuration

L'application permet de configurer les éléments nécessaires à son bon fonctionnement. 

## General

L'application permet de configurer les éléments relatifs au projet d'entreprise, aux valeurs afin de constituer la mémoire de l'IA sur laquelle elle se basera pour générer des éléments pertinents.

Selon que vous utilisez l'application en tant que société, individu ou avatar, l'application vous permet de saisir les informations suivantes :
* Valeurs
* Ligne éditoriale
  * Présentation (pitch)
  * Cible marketing (audience, personae)
  * Contenus (thèmes que vous traitez, langue préférée...)
  * Style

## Valeurs de marque, d'individu ou d'avatar

Cette partie permet de dire qui vous êtes en détaillant les valeurs de la marque, de l'individu ou de l'avatar que vous souhaitez mettre en avant :
* valeurs
* histoire
* anecdotes

Remplir le formulaire est un peu rébarbatif mais nécessaire pour permettre à l'IA de disposer du contexte le plus riche possible afin de générer du texte aligné avec ces valeurs. Il sera possible dans une prochaine version de remplir ces éléments à l'aide de la voix afin de faciliter leur saisie.

Il ne faut pas se contenter de mettre quelques mots, mais plutôt donner des exemples détaillés que l'IA réutilisera peut-être. Choisissez-les avec soi, sachant qu'il faut faire évoluer ces éléments en fonction de l'évolution du positionnement de la marque, de l'individu ou de l'avatar.

Dans les réseaux sociaux, le capital de la marque est basé sur les interactions des prospects et clients avec les collaborateurs de l'entreprise, ce qui pose problème lorsque ceux-ci quittent l'entreprise. Afin de ne pas perdre ce capital, il est nécessaire que les interactions aient lieu avec un collaborateur permanent, géré par la marque. C'est un intermédiaire (ou proxy en anglais), qui va "faire office de". Ainsi, les principaux collaborateurs de l'entreprise vont être amenés à avoir un "proxy" interagissant avec la communauté, ce qui n'empêche en rien le collaborateur d'avoir évidemment son propre compte avec ses propres interactions. Mais les interactions globales (via des campagnes de communication par exemple) doivent se faire avec le compte de l'intermédiaire géré par l'entreprise afin que cette dernière capitalise sur les contacts qu'elle va gagner. En outre, en étant piloté par l'IA, on peut faire attention à n'oublier personne. 

Ce concept d'avatar apparaît aujourd'hui dans Facebook et est amené à se généraliser.

### Présentation (pitch)

Pour une entreprise, le pitch synthétise l'offre au sens large de l'entreprise, sa raison d'être. On trouve le trouve généralement dans un business plan :
* les bénéfices pour les utilisateurs 
* leurs douleurs
* les solutions (produits et services) que vous proposez
* les avantages de vos solutions par rapport à vos concurrents

En tant qu'individu ou avatar, vous pouvez faire une correspondance et indiquer :
* les gains pour votre interlocuteur
* les problèmes de votre interlocuteur (par exemple votre employeur)
* les solutions (compétences) que vous apportez à ses problèmes
* les petits plus qui vous démarquent des autres

### Contenu

Cette partie est constituée des rubriques suivantes :
* thèmes
* rôle
* genre
* langue
* signature

#### Thèmes

Ils correspondent aux thèmes sur lesquels l'entreprise ou l'individu ou l'avatar est spécialisé. Cela correspond aux pages piliers d'une stratégie de contenu SEO. Ils ne doivent pas être trop nombreux, on conseille d'en choisir 2, afin de rester concentré sur la cible définie précédemment.

#### Rôle

Ils correspondent aux différents rôles qui peuvent être donnés à l'IA lors de l'exécution des instructions qu'on lui demande de suivre. Par exemple, dans le cadre de la création de contenu, vous pouvez imaginer créer les rôles d'auteur, relecteur, correcteur, responsable éditorial. Chacun de ces rôle étudiera le texte créé par l'auteur et fera des commentaires, le responsable éditorial décidant si on les applique ou pas.

Les prompts font explicitement référence aux rôles et permettent à l'IA de rentrer dans la peau d'un personnage, ce qui évite de préciser tout le contexte correspondant à celui-ci.

### Genre

Le genre correspond au genre qu'on veut utiliser par défaut pour la création des contenus. Selon les contenus, on peut utiliser un genre différent.

### Langue

La langue correspond à la langue principale de la communication.

### Signature

La signature indique les éléments qu'on veut voir apparaître lors de la création des contenus. Elle doit s'adapter au canal utilisé. Une signature est ainsi différente selon qu'on rédige un mail, un article de blog, un post linkedin, insta ou facebook... 

### Style

Cette partie est constituée des rubriques suivantes :
* le style en lui-même
* les émojis

Le style est constitué des éléments suivants :
* le vocabulaire
* la syntaxe
* le point de vue
* le ton
* la structure

Losrqu'on fournit un contenu à l'IA, Veep analyse le style correspondant à ces 5 critères afin de pouvoir lui demander de créer des contenus respectant ces critères, ce qui permet de donner du caractère aux contenus.

#### Vocabulaire

L'utilisation de mots spécifiques, leur complexité, l'étendue du lexique et l'usage de jargon ou d'argot contribuent grandement à définir un style d'écriture. Certains auteurs peuvent préférer un langage simple et direct, tandis que d'autres optent pour des termes plus recherchés ou techniques.

Le vocabulaire peut prendre les valeurs suivantes :
* limité
* étendu
* argotique
* évolué
* commun
* technique

#### Syntaxe

La syntaxe peut prendre les valeurs suivantes :
* simple
* fluide
* complexe

Cela inclut la longueur des phrases, la complexité de la construction des phrases, l'utilisation de phrases courtes et incisives ou, au contraire, de phrases longues et fluides. La syntaxe influence également le rythme de la lecture et la façon dont les idées sont assemblées.

#### Point de vue

Le point de vue (ou perspective) à partir duquel une histoire est racontée influence le style d'écriture. Le choix entre la première personne, la deuxième personne ou la troisième personne, omnisciente ou limitée, change la façon dont l'histoire est présentée et reçue.

Le point de vue peut prendre les valeurs suivantes :
* Je
* Tu
* Il
* Elle
* Iel
* Nous
* Vous
* Ils
* Elles
* Iels

#### Ton

Le ton reflète l'attitude de l'auteur envers le sujet et les lecteurs. Il peut être formel, informel, humoristique, grave, sarcastique, etc. Le ton donne une couleur émotionnelle au texte et aide à établir une connexion avec le lecteur.

Le ton peut prendre les valeurs suivantes :
* Chaud
* Froid
* Formel
* Informel
* Humoristique
* Sérieux
* Solennel
* Sarcastique

#### Structure

La façon dont un texte est organisé peut définir un style d'écriture. Cela inclut non seulement la structure générale d'une œuvre (par exemple, chronologique, non linéaire, en flashback) mais aussi la structure des paragraphes et des chapitres. La cohérence et la clarté de la structure contribuent à la signature stylistique de l'auteur.

La structure peut prendre les valeurs suivantes :
* Expositif

### Divers

D'autres éléments peuvent être configurés :
* structure des contenus et documents
* menus de navigation

#### Structure des contenus et des documents

Certains éléments créés comme les documents PDF ou les carousels présentent une structure identique :
* page de garde/première couverture
* pages intermédiaires
  * pages de titre
  * pages de contenus
* dernière page/quatrième de couverture

Ce type de structure permet de créer :
* des documents pdf (étude de cas, rapport...)
* des carousels

La page de garde est constituée des éléments suivants :
* titre
* sous-titre
* métadonnées
  * auteur
  * organisation
  * date
  * numéro de version
* fond de page (couleur ou image)
* logo
* photo de profil 

La dernière page ou quatrième de page est constituée des éléments suivants :
* TBD

##### Document(avec export PDF)

La mise en page du document permet de configurer les éléments suivants :
* en-tête
* pied de page
* mise en page à l'aide de paramètres css (couleurs, marges, cadres, fontes...)

#### Carousel

La mise en page du document permet de configurer les éléments suivants :
* en-tête
* pied de page
* mise en page à l'aide de paramètres css (couleurs, marges, cadres, fontes...)

Les pages de carousel sont cons
#### Navigation

#### Default side navigation


#### Custom side navigation

