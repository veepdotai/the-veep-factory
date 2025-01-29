---
id: part-configuration-selection
title: Configuration/Selection (Assistants)
hide_table_of_contents: false
pagination_label: Artefact Creation with Assistants
description: 'What assistants are available? Can I create, adapt some?'
keywords:
  - app
  - veeplet
  - configuration
  - selection
  - assistant
  - catalog
tags:
  - catalog
  - assistant
last_update:
  date: 10/27/2024
  author: Jean-Christophe Kermagoret
_i18n_hash: c1ef0366e841096b14c248421dc45fc2
---
# Assistant Catalogue

An assistant is a set of instructions, broken down into prompts, that are executed one after another for the time being, taking one or more previous outputs as input and providing a new output. An assistant is a chain of prompts and can also be referred to as an agent, prompt chain, workflow...

The Assistant Catalogue is a dynamically composed set of assistants based on the categories and subcategories indicated in the assistants.

<div class="zoom screenshot">
![Veep Assistant Catalogue](../images/veep-2.0-choose-content-public-catalog.png)
</div>

An assistant is built from a form based on 3 parts:
* General information: title, name, version, creation date, as well as category and subcategory used to classify the assistant in the catalogue 
* Prompt chain: the set of prompts to be processed to obtain the output from the provided input
* Documentation: the assistant must contain documentation to explain what it does, how it works, and how it can optionally be customized

The assistant builder must be autonomous so that the user can decide whether to use it or not. The description, documentation... may contain URLs to tutorials, screenshots, videos...

<div class="zoom screenshot">
![Creation of Veep Assistant](../images/veep-2.0-create-assistant-main.png)
</div>
