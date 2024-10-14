// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Veep.AI',
  tagline: 'Authentic. Automatic. Contents. AI Based.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://app.veep.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/support/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'veepdotai', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['en', 'fr'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    'docusaurus-plugin-matomo',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      matomo: {
        matomoUrl: 'https://r.veep.ai/',
        siteId: '5',
        phpLoader: 'matomo.php',
        jsLoader: 'matomo.js',
      },
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Veep.AI Doc Site',
        logo: {
          alt: 'Veep.AI documentation',
          src: 'img/veep.ai-wnb.png',
        },
        items: [
          {
            label: 'Docs',
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Blog',
            //href: 'https://www.veep.ai/blog',
            position: 'left'},
          {
            label: 'App',
            href: 'https://app.veep.ai',
            position: 'left',
            //position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/veepdotai',
              },
              /*
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              */
              {
                label: 'Twitter',
                href: 'https://twitter.com/veepdotai',
              },
            ],
          },
          {
            title: 'More',
            items: [
              /*
              {
                label: 'Blog',
                to: '/blog',
              },
              */
              {
                label: 'App',
                href: 'https://app.veep.ai',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Kerma Projects SAS.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
