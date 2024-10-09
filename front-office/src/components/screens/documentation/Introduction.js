import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Container } from 'react-bootstrap';

import { t } from 'i18next';

export default function Introduction() {

    
    const markdown = `
### Grâce à la voix, alimentez facilement votre communication et vos applications métiers.

Grâce à la voix, Veep collecte (compte-rendus, témoignages, discussions, interviews...) facilement de nombreuses informations permettant de produire des contenus authentiques rapidement (posts, articles, livres blancs) pour alimenter votre communication et vos applications métier.

A partir de ce contenu vocal, Veep :
* extrait les métadonnées (informations) : titre, mots-clés, hashtags, catégories, image
* propose une image pour illustrer le contenu (en cours de développement)
* produit un ou plusieurs contenus courts pour animer vos communautés (posts pour votre RSE - intranet, ou les réseaux sociaux - Linkedin, Instagram, Facebook...)
* produit un ou plusieurs contenus plus ou moins détaillés pour montrer votre expertise (études de cas, livres blancs, dossiers de synthèses...), améliorer votre référencement naturel et augmenter votre nombre de leads. Les contenus longs peuvent aller de quelques pages à quelques dizaines de pages.
`
    return (
        <Container>
            <Container className="ps-0" as="h2">{t("Introduction")}</Container>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </Container>
    )
}