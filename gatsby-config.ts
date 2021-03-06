import { config } from 'dotenv'

config()

export const plugins = [
  'gatsby-plugin-typescript',
  'gatsby-plugin-react-helmet',
  {
    resolve: 'gatsby-source-graphql',
    options: {
      typeName: 'GitHub',
      fieldName: 'github',
      url: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    }
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'NEAR Examples',
      short_name: 'NEAR',
      start_url: '/',
      background_color: '#D1CCBD',
      theme_color: '#6AD1E3',
      display: 'minimal-ui',
      icon: 'src/images/near-icon-grey.svg' // This path is relative to the root of the site.
    }
  },
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      // The property ID; the tracking code won't be generated without it
      trackingId: 'UA-100373569-19',

      // Defines where to place the tracking script - `true` in the head and `false` in the body
      head: false,

      // Setting this parameter is optional
      anonymize: true,

      // Setting this parameter is also optional
      respectDNT: true

      // Avoids sending pageview hits from custom paths
      // exclude: ["/preview/**", "/do-not-track/me/too/"],

      // Delays sending pageview hits on route update (in milliseconds)
      // pageTransitionDelay: 0,

      // Enables Google Optimize using your container Id
      // optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",

      // Enables Google Optimize Experiment ID
      // experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",

      // Set Variation ID. 0 for original 1,2,3....
      // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",

      // Any additional optional fields
      // sampleRate: 5,
      // siteSpeedSampleRate: 10,
      // cookieDomain: "example.com",
    }
  },
  {
    resolve: 'gatsby-plugin-mixpanel',
    options: {
      apiToken: 'df164f13212cbb0dfdae991da60e87f2',
      pageViews: 'all',
      mixpanelConfig: null, // you can override default config for mixpanel library https://github.com/mixpanel/mixpanel-js/blob/8b2e1f7b/src/mixpanel-core.js#L87-L110
    },
  }
]
