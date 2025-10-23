## Calendrier éditorial

Le calendrier éditorial est l'écran que vous utiliserez le plus fréquemment. Il permet de créer des contenus en répondant à la question du jour et de publier votre réponse. Votre réponse, initialement orale, est retranscrite puis analysée par l'IA qui extrait un ensemble d'informations et génère un article de blog et un post pour LinkedIn.

Votre article de blog contient un lien sur votre vocal afin d'avoir un contenu authentique. Le lecteur peut donc vérifier que le post n'a pas été créé à partir de rien mais à partir d'un vrai contenu. L'Intelligence Artificielle a simplement assisté l'humain dans son écriture mais ne l'a pas remplacé. C'est ce qu'on appelle un contenu authentique chez VEEP.

Certains d'entre vous trouveront peut-être que l'enrichissement par l'IA n'est pas suffisant. Je vous invite à consulter le mode avancé ci-dessous pour voir comment pallier cela. Vous pourrez améliorer votre contenu mais au prix de l'authenticité. Ça dépend de ce que vous recherchez...

### Mode d'emploi

Choisissez la question dans la liste déroulante. Vous répondez à la question du jour (votre équipe de communication/marketing ayant créé une stratégie de communication alignée avec la stratégie de la société afin que n'ayez justement pas à vous en soucier).

Cliquez sur le bouton vert "Record". Autorisez l'utilisation du micro si la question vous est posée. Vous pouvez alors répondre à la question. La question doit normalement vous paraître très simple, elle aborde un sujet que vous traitez au quotidien. Votre réponse est donc naturelle comme si c'était une discussion avec un.e membre de votre famille, un.e ami.e, un.e collègue, un.e client.

Lorsque la réponse est terminée, cliquez sur "Stop". Vous pouvez alors :
* écouter votre message (je vous le déconseille - réécoutez-vous vos conversations avec votre famille, vos collègues ?),
* supprimer votre message (et donc recommencer),
* retranscrire votre vocal,
* publier votre réponse.

Cliquer sur "Publier" si vous êtes satisfait. Une fenêtre s'affiche. Le traitement peut prendre entre 1 et 2 minutes. Lorsque celui-ci est terminé, vous êtes redirigé.e sur la page de blog qui a été produite. Cette page est faite sous Wordpress, vous pouvez donc la modifier.

Pour faire un post LinkedIn à partir de cette page, cliquez sur l'icône de LinkedIn. Une fenêtre LinkedIn s'ouvre alors. Elle référence votre page en cours. Cliquez sur "Publier un post". Vous pouvez alors ajouter un texte, par exemple celui produit en même temps que l'article de blog. Il a été copié automatiquement dans votre presse papier, vous n'avez plus qu'à le coller dans votre écran.

### Mode avancé

Initialement en mode débutant, en cliquant sur Beginner/Expert en haut de l'écran, vous passez en mode expert, ce qui a pour effet de présenter tous les champs et toutes les actions possibles. En cliquant à nouveau sur ce bouton, vous basculez dans le mode inverse, etc...

En cliquant en haut de l'écran sur 'Article', situé à côté de Vocal, lui-même situé sous la liste des questions, vous basculez sur un formulaire qui présente toutes les informations qui caractérisent un article de blog et un post LinkedIn.

Si les champs sont vides, c'est que vous n'avez pas encore répondu à une question, ni généré de contenu.

Répondez à une question si vous ne l'avez pas encore fait.

### Prompt

A titre d'exemple, le prompt disponible par défaut (et uniquement visible en mode expert) est le suivant (la variable **$inspiration** est remplacée par la transcription de votre vocal) :

<div class="pre">
Voici un entretien :

$inspiration

Fin de l'entretien

Rédige, à partir de cet entretien un long article de blog de 500 mots en français au format markdown, avec des retours à la ligne, en agissant comme un copywriter spécialisé dans le SEO, dans un style journalistique et professionnel. Tu mettras en gras les mots déjà présents dans l'entretien.

La réponse doit être formatée en json strict en respectant la structure suivante, sans ajouter d'éléments en dehors de cette structure :
{
    "title": mets le titre ici,
    "description": mets la description SEO ici,
    "content": mets le contenu de l'article de blog au format markdown et entre guillemets ici,
    "linkedin": mets ici une reformulation du contenu de l'article de blog sous la forme d'un post linkedin de 300 mots, constitué de 4 paragraphes, avec des emojis et des retours à la ligne,
    "hashtags": mets les hashtags ici,
    "themes": extrais les 5 thèmes principaux du texte et mets-les ici,
    "keywords": extrais les 5 mots clés SEO du texte et mets-les ici,
    "image": mets ici un prompt permettant de générer une image pour cet article
}
</div>

La partie du prompt située avant 'La réponse doit être formatée...' peut être modifiée afin de produire un contenu plus adapté par rapport à votre contexte. Attention, la partie suivante concernant le format ne doit ABSOLUMENT PAS être modifiée car elle permet de produire des informations respectant des règles que VEEP comprend.

Comme première modification, pour voir comment réagit l'IA, vous pouvez, par exemple, changer le mot 'Rédige' en 'Reformule'. Le contenu sera alors modifié de manière assez importante. Ajoutez 'complètement' pour voir l'importance de l'adjectif.

Si cela ne fonctionne plus, c'est que votre prompt ne respecte pas les règles ci-dessus (concernant le format). Effacez TOUT votre prompt, il sera alors remplacé par le prompt initial.
