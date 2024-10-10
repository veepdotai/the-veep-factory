## Stratégie éditoriale

La stratégie éditoriale permet de créer un ensemble de questions à partir d'un nombre réduit de mots-clés ou expressions (2 ou 3) séparés par des ",". Ces éléments sont analysés par l'IA via un prompt qui construit un glossaire de 50 questions à partir de ces informations.

A titre d'exemple, le prompt disponible par défaut (et uniquement visible en mode expert) peut être (car on le change régulièrement pour faire des tests) est le suivant (les variables *$keywords* et *$context* sont respectivement remplacés par les mots-clés saisis dans le champ correspondant et par l'interview que vous avez éventuellement fait - issu de votre vocal) :

<div class="pre">
$context

Aide-toi de ce contexte pour me donner une liste de 4 questions (Pourquoi, Comment, Quand, Quoi) pour chacun des mots-clés suivants ($keywords) au format csv, sans aucun texte ni avant ni après, avec le format suivant, et sans oublier la première ligne :
"Mot-clé", "Préposition", "Question"
</div>

Autre exemple de prompt : Glossaire 

<div class="pre">
$context

Aide-toi de ce contexte pour construire un glossaire de 50 mots à propos de : "$keywords"
</div>

Dans le cadre de la stratégie éditoriale, Vous pouvez modifier le prompt mais vous devez obtenir une liste de questions ou de mots, ligne par ligne. Dans le cadre de ce test, une date sera simplement rajoutée devant chaque ligne. Vous imaginez bien qu'on pourrait construire des stratégies beaucoup plus complexes basées sur de multiples critéres (format du contenu - question ou libre blanc ou dossier, rôle du répondant - directeur ou dir. commercial ou dir. marketing ou dir. technique ou collaborateur, framework de réponse - TOFU/MOFU/BOFU ou AIDA ou PAS, nombre de participants - 1 ou 4 ou 50).

C'est pour cela que la stratégie éditoriale est un champ texte, dans lequel vous pouvez simplement copier/coller un fichier csv...)

Si cela ne fonctionne plus, c'est que votre prompt ne respecte pas les règles que Veep comprend. Effacez TOUT votre prompt, il sera alors remplacé par le prompt initial.
