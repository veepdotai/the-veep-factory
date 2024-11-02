---
id: part-overview
title: Overview
hide_table_of_contents: false
pagination_label: App Overview
#custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: How do I find you when I cannot solve this problem
keywords:
  - app
  - veepdotai
tags: [app]
#image: https://i.imgur.com/mErPwqL.png
last_update:
  date: 11/02/2024
  author: Jean-Christophe Kermagoret
comment:
---

<div class="zoom">

import Image from '@theme/IdealImage'

<Image alt="Veep Architecture Overview" img={require('../images/veep-schema-architecture-2.0-en.png')} />

</div>

Veep aims at helping users to create artefacts (contents and documents). To achieve this goal, it structures creation in 6 main phases:
* Specification: to give context and make generation more relevant
* Configuration/Selection: to configure or use assistants catalog according your role
* Execution: to process the assistant and generate draft
* Edition: to read, fix and finalize the artefact
* Export/Publication: to export (in PDF) and publish the artefact
<!-- Monitoring2: some elements drive your bill and need to be managed (AI usage, storage, bandwith...) -->