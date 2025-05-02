let veeplet = {
    "metadata": {
      "schema": 1,
      "name": "veepdotai",
      "summary": "Cette Veeplet permet de générer un dossier de synthèse à partir d'un contenu initial, ici sous la forme d'un vocal.\n",
      "reviews": 5,
      "version": 1,
      "publication": {
        "status": "active",
        "scope": "public"
      },
      "classification": {
        "group": "Business",
        "category": "Marketing",
        "subCategory": "Social_Network"
      }
    },
    "owner": {
      "creationDate": "20231219",
      "authorId": "JCK",
      "orgId": "kermaprojects"
    },
    "details": {
      "presentation": {
        "heading": "Métadonnées",
        "icon": "Heading",
        "image": "/assets/images/linkedin.jpg",
        "tips1": "Idéalement, c'est le même contexte que pour un post ou un article de blog",
        "tips2": "Nope",
        "description": "Présentation au format markdown\n"
      },
      "usermanual": {
        "description": "Manuel utilisateur au format markdown\n"
      },
      "adminmanual": {
        "description": "Manuel administrateur au format markdown\n"
      },
      "faq": {
        "faq1": {
          "q": "Question au format markdown\n",
          "a": "Réponse au format markdown\n"
        }
      },
      "changelog": {
        "description": "Changelog au format Markdown\n"
      },
      "screenshots": {
        "screenshot1": {
          "title": "",
          "href": ""
        },
        "screenshot2": {
          "title": "",
          "href": ""
        },
        "screenshot3": {
          "title": "",
          "href": ""
        }
      }
    },
    "prompts": {
      "chain": [
        "g0",
        "g1",
        "g2",
        "g3",
        "g4",
        "g5"
      ],
      "g0": {
        "label": "Plan",
        "prompt": "{{inspiration}}\n\nA partir du texte ci-dessus, extrais un plan détaillé du contenu en 3 parties, en ajoutant une introduction et une conclusion.\n"
      },
      "g1": {
        "label": "Intro",
        "prompt": "Source:\n{{inspiration}}\n\nPlan:\n{{g0}}\n\nA partir de la source et du plan, rédige l'introduction.\n"
      },
      "g2": {
        "label": "P.1",
        "prompt": "Source:\n{{inspiration}}\n\nPlan:\n{{g0}}\n\nA partir de la source, rédige la partie 1 du plan.\n"
      },
      "g3": {
        "label": "P.2",
        "prompt": "Source:\n{{inspiration}}\n\nPlan:\n{{g0}}\n\nA partir de la source, rédige la partie 2 du plan.\n"
      },
      "g4": {
        "label": "P.3",
        "prompt": "Source:\n{{inspiration}}\n\nPlan:\n{{g0}}\n\nA partir de la source et du plan, rédige la partie 3 du plan.\n"
      },
      "g5": {
        "label": "Conclusion",
        "prompt": "Source:\n{{inspiration}}\n\nPlan:\n{{g0}}\n\nIntroduction:\n{{g1}}\n\nA partir de la source, du plan et de l'introduction, rédige la conclusion.\n"
      }
    }
  }


class Veeplet {
    constructor (definition) {
        //this.log = Logger.of(Veeplet.name);
        this.log = {
            trace: function(msg) {
                //console.log(msg);
            },
            info: function(msg) {
                console.log(msg);
            },
        }
        this.log.trace("Definition: Constructor.");
        this.log.trace("typeof definition: " + typeof definition);
        if (typeof definition === "string") {
            this.log.trace("Definition is a string. Parse it.");
            this.definition = JSON.parse(definition);
        } else {
            this.log.trace("Definition isn't a string, maybe an object. Don't parse it.");
            this.definition = definition;
        }
        this.prefix = "ai-section-edcal1-";
        this.log.trace("Definition: ", this.definition);
    }

    getDefinition() {
        return this.definition;
    }

    setDefinition(definition) {
        if (typeof definition === "string") {
            this.definition = JSON.parse(definition);
        } else {
            this.definition = definition;
        }
    }

    getSections() {
        let prompts = this.getDefinition().prompts;
        let chains = prompts.chain;

        let defaultTranscriptionPhase = {
            name: "transcription",
            title: "Transcription",
            topic: "_TRANSCRIPTION_FINISHED_",
            option: "ai-section-edcal0-transcription",
            contentListeners: "_TRANSCRIPTION_"
        };

        let i = 0;
        let result = chains.map((prompt_id) => {
            let prompt = prompts[prompt_id];
            //let _topic = (prompt.topic || "_" + prompt.name.toUpperCase());
            let _topic = (prompt.topic || "_PHASE" + i + "_GENERATION_");
            let key = "phase" + i;
            i++;
            return {
                name: prompt.label,
                title: prompt.label,
                topic: _topic + "FINISHED_",
                option: this.prefix + key,
                contentListeners: _topic
            }
        });

        return [
            defaultTranscriptionPhase,
            ...result
        ];
    }

    /**
     *     {
        "status": "active",
        "authorId": "jck",
        "organizationId": "kermaprojects",
        "category": "Marketing",
        "subCategory": "Social_Network",
        "name": "metadata",
        "heading": "Métadonnées",
        "reviews": "5",
        "title": "Titre, hashtags, keywords",
        "icon": "Heading",
        "image": "/assets/images/linkedin.jpg",
        "description": "Les titres, mots-clés, hastags permettent d'attirer le regard des visiteurs et d'améliorer le référencement de vos contenus.",
        "tips1": "Idéalement, c'est le même contexte que pour un post ou un article de blog",
        "tips2": ""
    },
    */
    getExtractForCatalog() {
        return {
            status: this.getDefinition().metadata.publication.status,
            authorId: this.getDefinition().owner.authorId,
            organizationId: this.getDefinition().owner.orgId,
            group: this.getDefinition().metadata.classification.group,
            category: this.getDefinition().metadata.classification.category,
            subCategory: this.getDefinition().metadata.classification.subCategory,
            name: this.getDefinition().metadata.name,
            heading: this.getDefinition().details.presentation.heading,
            reviews: this.getDefinition().metadata.reviews,
            version: this.getDefinition().metadata.version,
            title: this.getDefinition().details.presentation.heading,
            icon: this.getDefinition().details.presentation.icon,
            image: this.getDefinition().details.presentation.image,
            description: this.getDefinition().details.presentation.description,
            tips1: this.getDefinition().details.presentation.tips1,
            tips2: this.getDefinition().details.presentation.tips2,
        }
    }
}

let x = new Veeplet(veeplet);

console.log(x.getExtractForCatalog());