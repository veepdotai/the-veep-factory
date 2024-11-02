---
id: part-configuration-selection
title: Configuration/Selection (Assistants)
hide_table_of_contents: false
pagination_label: Artefact Creation with Assistants
#custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: What assistants are available? Can I create, adapt some?
keywords:
  - app
  - veeplet
  - configuration
  - selection
  - assistant
  - catalog
tags: [catalog, assistant]
#image: https://i.imgur.com/mErPwqL.png
last_update:
  date: 10/27/2024
  author: Jean-Christophe Kermagoret
---

# Assistants Catalog

An assistant is a set of instructions, decomposed in prompts, that are played, for the moment, one after the other, taking input from one or more previous outputs and providing itself a new output. An assistant is a chain of prompts and can be called an agent, a prompt chain, a workflow too...

Assistants Catalog are a set of assistants composed dynamically from categories and sucategories indicated in assistants.

<div class="zoom screenshot">
![Veep Assistants Catalog](../images/veep-2.0-choose-content-public-catalog.png)
</div>

An assistant is built from a form based on 3 parts:
* General information: title, name, version, creation date, but also category and sub-category used to file the assistant in the catalog 
* Chain of prompts: the set of prompts to process to get the output from the provided input
* Documentation: the assistant must contain some documentation to explain what it does, how it works, how it may be customized optionally

The assistant builder must be self contained so user can decide to use it or not. The description, documentation... can contains url to tutorials, screenshots, videos...

<div class="zoom screenshot">
![Veep Assistant Creation](../images/veep-2.0-create-assistant-main.png)
</div>
