/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'overview',
    {
      'Getting started': [
        'getting_started/getting-started',
        'getting_started/gs-user-creates-content',
        'getting_started/gs-user-edits-content',
        'getting_started/gs-user-fills-context',
        'getting_started/gs-user-publishes-content',
        'getting_started/gs-expert-creates-assistant',
        'getting_started/gs-expert-creates-catalog',
        'getting_started/gs-expert-defines-context',
        'getting_started/gs-expert-configures-AI',
      ]
    },
    {
      'What is Veep?': [
        'app/overview',
        'app/part-context',
        'app/part-assistant',
        'app/part-edition',
        'app/part-publication',
      ]
    },
    {
      'User Documentation': [
        {
          'Menu': [
            'user/menu/user-dashboard',
            'user/menu/user-mycontents',
            'user/menu/user-mycontents-details',
            'user/menu/user-assistant-creation',
            'user/menu/user-catalog',
            'user/menu/user-creation'  
          ]
        }
      ]
    },
    'features',
    {
      type: 'html',
      value: '<hr />'
    },
    {
      'Resources': [
        'marketing/mktg-presentation',
        'marketing/mktg-screenshots',
        'marketing/mktg-videos'
      ]
    },

    //{type: 'autogenerated', dirName: './documentation'}
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;