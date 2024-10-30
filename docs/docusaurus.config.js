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
  url: 'https://docs.veep.ai',
  baseUrl: '/',
  //trailingSlash: true,  
  organizationName: 'veepdotai',
  projectName: 'the-veep-factory',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  deploymentBranch: 'gh-pages',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      ({
        //debug: true,
        docs: {
          routeBasePath: '/',
          breadcrumbs: true,
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    'docusaurus-plugin-matomo',
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // taille maximale de l'image redimensionnée.
        min: 640, // taille minimale de l'image redimensionnée. si l'originale est plus petite, utiliser cette taille.
        steps: 2, // le nombre maximum d'images générées entre min et max (inclus)
        disableInDev: false,
      }
    ],
    'docusaurus-plugin-image-zoom'
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
      zoom: {
        selector: '.markdown img, .mdx-pages img, img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
      },
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
            title: 'Support',
            items: [
              {
                label: 'Forums',
                to: 'https://github.com/veepdotai/the-veep-factory/discussions',
              },
              {
                label: 'Issues',
                to: 'https://github.com/veepdotai/the-veep-factory/issues',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              /*
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              */
              {
                label: 'LinkedIn (Veep.AI)',
                href: 'https://www.linkedin.com/company/veepdotai/',
              },
              {
                label: 'LinkedIn (Jean-Christophe)',
                href: 'https://www.linkedin.com/in/jean-christophe-kermagoret/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/veepdotai',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/veepdotai',
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
