---
id: part-generation
title: Generation
hide_table_of_contents: false
pagination_label: Content Generation
#custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: What can I do to edit generated content
keywords:
  - app
  - generation
  - execution
tags: [generation]
#image: https://i.imgur.com/mErPwqL.png
last_update:
  date: 10/29/2024
  author: Jean-Christophe Kermagoret
---

# Generation

## Input Configuration

Once the user has selected the assistant he wants to use, he must provide input with one of the following way:
* vocal
* file
* text
* url

<div class="zoom screenshot">
![Veep Create Input](../images/veep-1.0-create-input.png)
</div>

## Generation Steps

After the user starts the generation process, a new window appears with all the elements that are going to be generated.

At each end of a generation step, a red dot appears and user can read and check generated content. By immediateley fixing erors, he avoids propagation of typo errors like with proper names, or can add, or insist, on some content that haven't been taken into account enough.  

<div class="zoom screenshot">
![Generation screen](../images/veep-1.0-create-output-L3.png)
</div>

Once errors have been fixed, user can continue generation process.