# Veepdotai - Inspires and automates content creation through Voice and AI (ChatGPT)

<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-0-lp_template-resized.png?raw=true" align="right" width="25%"/>

* Contributors: veepdotai
* Donate link: https://www.veep.ai
* Tags: voice, vocal, assistant, ia, ai, website, site web, site, web, autonome, autonomous, autonomy, automatic, wordpress, content, factory
* Requires at least: 6.0.0
* Requires PHP: 8.0
* Tested up to: 6.2.0
* Stable tag: 6.0
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

Veepdotai is the plugin to create a complete autonomous virtual presence through voice and AI.

## Description

Veepdotai aims at providing thanks to voice recognition a solution to automatically create an autonomous online presence composed of a web site with one home page and 4 or 5 pages linked to it. THe usage of voice avoids the blank page syndrom. Just give some information and history through voice to inspire the plugin that will become more personalized and creative.

Autonomous means content is created on a recurring basis and can start right away. It always starts from
a voice insight to create relevant content in your situation.

## Configuration

Veepdotai plugin is based on 2 free external systems, at least to test them:

* ChatGPT, from OpenAI, to create content
* Pexels, to get public images

In order for the plugin to work, you must create a free account and get one API key for each external service:

* ChatGPT: creates a free account then go to https://platform.openai.com/account/api-keys to get a key
* Pexels: creates a free account then go to https://www.pexels.com/fr-fr/api/new/ to get a key

Once you get them, just go to the Configure section of the Veepdotai plugin and fill the corresponding form.

## Interview

Veepdotai main idea is to consider voice like the easiest way to easily enter lots of information in the AI memory to learn him the project you want it to create a website for, your ideas about articles you want it to write.

The interview consists in speaking to your computer (...) that will transcript directly your speech to text, which is easier to store and process.

This feature is only available for Chrome on desktops and Safari on iPhone through native implementation. The Chrome implementation is based on voice recognition with Google servers so, if you are concerned with confidentiality, you should not use this plugin.

For the moment, Veepdotai focus on business creation and the interview of your project is composed of 4 parts about this topic:

* Interests for your customers
* Pains you solve
* Solutions you provide
* Key advantages of your offer

When you click in each field for the interview, the plugin enables the micro and you can start to talk. You will see

Once the interview is done, you can proofread the transcription and fix it but the main idea stays the same: use you voice to express who you are and what you care about.

When you're ok with the results, just click on Save to store the information.

Click on Improve to improve your interview (adding ponctuation, minor corrections...) and extract useful information through AI.

## Prompts

From the previous interview and the resulting transcription, AI will execute the prompt you provide for each section. There are pre and post prompts so you can provide achieve complex situations.

Finally, the prompt, for each section, is a concatenation of pre_prompt, the section interview and the post_prompt:

* prompt = pre_prompt + corresponding part of the interview + post_prompt

The prompt is generally the same for each section, so to spare some time, you can tick the option to copy the first prompt to other prompts.

Click on Save to store the prompts.
Click on Transform to transform the interview content in useful informations. Transform button also saves the information.

## Site

Once the previous transformation finished, you have, for each section of your interview, the following informations that have been extracted from it through the instructions you provide to the AI:

* title
* summary
* content
* image prompt
* image href
* image alt
* CTA text
* CTA href

You can correct the information if you want.

Then, 4 actions are available:

* Save, to store the information
* Generate the home page
* Generate the pages
* Generate the images

Save button enables you to store the information

"Generate the home page" button enables you to create the home page (you must provide a template like explained below) with a section in this home page for each section of the interview. In each section, there is a CTA linked to the corresponding page.

"Generate the pages" enables you to create the pages for each section. These pages are accessible from the home page through the CTA.

"Generate the images" enables you to get the images from the Pexels database and the image prompt previously computed by AI.

## Create a template

Follow this link to see a template example for Veepdotai plugin.

The template is just a usual page with css tags that indicates parts that will be replaced when generating the content. For texts, the css tags must be put directly on the element. For images, css tag must be put outside the image (so in a group around it for example)

The following css tags are available:

* veep_section, on group
* veep_title, on paragraph
* veep_text, on paragraph
* veep_cta, on button

It may work for other elements but it has not been tested.

To start quickly, just import into wordpress the template page stored in the assets directory (/assets/veepdotai.model-page-to-import.xml) through the WP Tool / Import.

## Installation

This section describes how to install the plugin and get it working.

e.g.

1. Upload `veepdotai.zip` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

## Frequently Asked Questions

Feel free to ask questions with these different tools:

* WP developer forum for this plugin
* Discord (https://www.veep.ai/r/discord-forums-wpd)
* GitHub discussions (https://www.veep.ai/r/github-forums-wpd)

## Screenshots

### Home Page Template
<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-0-lp_template-resized.png?raw=true" width="25%"/>

### Configuration
<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-1-configuration-resized.png?raw=true" width="25%"/>

### Interview
<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-2-interview-resized.png?raw=true" width="25%"/>

### Prompts
<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-3-prompts-resized.png?raw=true" width="25%"/>

### Site and Page Generation
<img src="https://raw.githubusercontent.com/veepdotai/veepdotai/main/assets/veepdotai-4-site-resized.png?raw=true" width="25%"/>

## Upgrade notice

Not relevant for the moment.

## Changelog

### 1.1

* README improvements

### 1.0

* Initial release