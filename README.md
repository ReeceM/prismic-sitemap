# Prismic Sitemap Generator 
[![Node.js CI](https://github.com/ReeceM/prismic-sitemap/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/ReeceM/prismic-sitemap/actions/workflows/node.js.yml)
[![Package Deploy](https://github.com/ReeceM/prismic-sitemap/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ReeceM/prismic-sitemap/actions/workflows/npm-publish.yml)
[![GitHub license](https://img.shields.io/github/license/ReeceM/prismic-sitemap?style=flat)](https://github.com/ReeceM/prismic-sitemap/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@reecem/prismic-sitemap)](https://www.npmjs.com/package/@reecem/prismic-sitemap)
[![npm](https://img.shields.io/npm/dt/@reecem/prismic-sitemap)](https://www.npmjs.com/package/@reecem/prismic-sitemap)

An easy to configure sitemap generator for Next.js websites based on the pages in your [Prismic.io](https://prismic.io) CMS.

## About

This package uses the [Sitemap.js](https://github.com/ekalinin/sitemap.js) package to generate the sitemaps as it handles all the needed stuff for sitemaps. This also gives the end user flexibility in generating the sitemap.

It aims to simplify the configuration required to create the sitemap, and also include it in the build process of your Next.js site by extending the `next.config.js` file.

> This package is also inspired by the live steam from Prismic.io where they built a sitemap generator. But wanting to make it better like.

## Installation

You can use either `npm` or `yarn` to install the package:

### NPM
```bash
npm install --save-dev @reecem/prismic-sitemap
```

### Yarn
```bash
yarn add -D @reecem/prismic-sitemap
```

## Usage

The package is configured and used inside the `next.config.js` file. 

It works in a similar way to most Next.js plugins, it will also call the top-level `webpack()` function in the `next.config.js` file.

### Basic usage
A basic Next.js file that has the sitemap generator plugin running would like as follows:

```javascript

// The Prismic API endpoint
const API_ENDPOINT = `https://${process.env.REPOSITORY_NAME}.cdn.prismic.io/api/v2`;

// The hostname of the website, for example it would be https://example.com
const SITE_URL = process.env.VERCEL_ENV;

// this is the link resolver for the documents that are fetched.
const linkResolver = doc => {
  
  if (doc.type == 'post') {
    return `blog/${doc.uid}`;
  } 

  return `${doc.uid}`;
};

const withPrismicSitemap = require('@reecem/prismic-sitemap')({
  linkResolver: linkResolver,
  apiEndpoint: API_ENDPOINT,
  hostname: SITE_URL,
  optionsMapPerDocumentType: {
    // setting the update date of the article.
    post: (document) => {
      return { 
        // get the last time the document was published in Prismic
        lastmod: document.last_publication_date,
        changefreq: "weekly", 
        priority: 0.8 
      }
    }
    page: { changefreq: "monthly", priority: 1 }
  },
  documentTypes: ['page', 'post']
});

module.exports = withPrismicSitemap({
    ... other nextConfig things here... or before :)
})
```

### Multiple Page usage / Multilang too 
A more complex example would be to have multiple page types and also multi-language support inside the sitemap.

This one will use a linkResolver that picks if it should use the default local pattern or the localized version and sets that as a prefix.

```javascript
// The Prismic API endpoint
const API_ENDPOINT = `https://${process.env.REPOSITORY_NAME}.cdn.prismic.io/api/v2`;

// The hostname of the website, for example it would be https://example.com
const SITE_URL = process.env.VERCEL_ENV;

const linkResolver = doc => {
  const prefix = doc.lang !== "en-za" ? `/${doc.lang}` : "";

  switch (doc.type) {
    case "homepage":
    case "pricing":
    case "page":
      return `${prefix}/${doc.uid ? doc.uid : ''}`;

    case "post":
      return `${prefix}/blog/${doc.uid}`;

    case "legal":
      return `${prefix}/legal/${doc.uid}`;

    case "product":
      return `${prefix}/product/${doc.uid}`;

    default:
      throw new Error(`Unknown doc.type: "${doc.type}"`);
  }
};

const withPrismicSitemap = require('@reecem/prismic-sitemap')({
    linkResolver: linkResolver,
    apiEndpoint: API_ENDPOINT,
    hostname: SITE_URL,
    optionsMapPerDocumentType: {
      page: { changefreq: "monthly", priority: 1 },
      // homepage: { changefreq: "monthly", priority: 1 }, Homepage would default to this as it isn't found
      // legal: { changefreq: "monthly", priority: 1 }, Legal types would default to this as it isn't found
      post: { changefreq: "weekly", priority: 0.8 },
      pricing: { changefreq: "monthly", priority: 1 }
    },
  documentTypes: ['homepage', 'page', 'pricing', 'legal']
})

module.exports = withPrismicSitemap({
    ... other nextConfig things here... or before :)
})
```

### Private Prismic Repo Usage

If you are using a closed or private prismic repository, you may need to use the API token to get published documents. From version 0.2.0 you can add the token.

Below is an example, you need to add the `sitemap.accessToken` to the config.

```javascript

// The Prismic API endpoint
const API_ENDPOINT = `https://${process.env.REPOSITORY_NAME}.cdn.prismic.io/api/v2`;

// The hostname of the website, for example it would be https://example.com
const SITE_URL = process.env.VERCEL_ENV;

// this is the link resolver for the documents that are fetched.
const linkResolver = doc => {
  
  if (doc.type == 'post') {
    return `blog/${doc.uid}`;
  } 

  return `${doc.uid}`;
};

const withPrismicSitemap = require('@reecem/prismic-sitemap')(sitemap: {
  linkResolver: linkResolver,
  apiEndpoint: API_ENDPOINT,
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  hostname: SITE_URL,
  optionsMapPerDocumentType: {
      post: { changefreq: "weekly", priority: 0.8 },
      page: { changefreq: "monthly", priority: 1 }
  },
  documentTypes: ['page', 'post']
})

module.exports = withPrismicSitemap({
    ... other nextConfig things here..
})
```

### `<lastmod>` support

The package makes use of lastmod support for the sitemap, this would need to be set by the user if you would want the date to come through at the current version of `0.3.0`.

Because the Sitemap file is written using a separate package, it supports parsing the date straight to the `YYYY-MM-DD` format, if you would like it to have the time as well, you will need to override the setting in the config:

```javascript
  sitemap: {

    sitemapConfig: {
      lastmodDateOnly: false,
    },

  }
```

## API

The sitemap object is made up of the following:

```javascript

{
  sitemap: {
    linkResolver = Function,
    apiEndpoint = String,
    accessToken = String|null,
    hostname = String,
    fileName = String,
    optionsMapPerDocumentType = Object|Object<Function>,
    defaultEntryOption = Object,
    staticPaths = Array<Object>,
    pagination = {
      pageSize: Number,
    },
    documentTypes = Array,
    sitemapConfig = Object
  }
}
```

|Option|Type|eg|Description|
|------|----|--|-----------|
|linkResolver|function|```doc => {return `/path/${doc.uid}`;}```| This is the Prismic.io link resolver, this could be custom, or used from the prismic-configuration files.|
|apiEndpoint|string|`'https://some-repository-on-prismic.cdn.prismic.io/api/v2'`| This is the URL of your Prismic repository, the API version of it.|
|accessToken|string(optional)|`'random_api_string_that_you_get'`| This is the Access token used to access private Prismic Repositories|
|hostname|string|`'http://example.com/'`| The hostname of your Vercel/Next.js application|
|fileName|string|`'sitemap.xml'`| The name of the sitemap, it is always placed inside public|
|optionsMapPerDocumentType|object|`{ page: { changefreq: "monthly", priority: 1 }, post: (doc) => {lastmod: doc.last_publication_date}}`| The options for the documents that are indexed, this can also have other options, found at [https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemap-item-options](https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemap-item-options)|
|documentTypes|array|`['homepage', 'page', 'pricing', 'legal']`||
|defaultEntryOption|object (optional)| `{ changefreq: "monthly", priority: 1, }`| This is the default to add when nothing exists for the type or callback for entries|
|staticPaths|array|`[{ url: '/static/path', changefreq: "yearly", priority: 1, lastmod: '2000-01-01'}]`| Use this if you would like to define a custom path for the Sitemap that doesn't come from the CMS |
|pagination.pageSize|number|`{pagination: {pageSize: 30}}`|This sets the number of pages per request on the automatic pagination. Defaults to 20 per request|
|sitemapConfig|object|| see [https://github.com/ekalinin/sitemap.js#options-you-can-pass](https://github.com/ekalinin/sitemap.js#options-you-can-pass)|


### `optionsMapPerDocumentType`

The `optionsMapPerDocumentType` setting for the sitemap value allows you to configure the object result for the sitemap entry for the specific document

This accepts a object with keys to the document type from Prismic, the value can be a object, or a callback.

**Using the Callback**

This option allows you to determine extra data about the document and return a object to be written to the Sitemap, there isn't a need to return the URL value, and this will be purged from the result anyway in favour of the `linkResolver` result. This is for consistency reasons.

The primary reason to add this is because of using the `<lastmod>` XML attribute in the Sitemap to improve indexing by Google or other search engines.

To make use of this, you can do the following logic:

```javascript
const withPrismicSitemap = require('@reecem/prismic-sitemap')({
  sitemap: {
    // ... other cofing
    optionsMapPerDocumentType: {
      post: (document) => {
        return {
          lastmod: document.last_publication_date ? document.last_publication_date : (new Date()).toJSON(),
          changefreq: 'monthly'
        };
      }
    },
  }
})
```

---

## Testing

```bash
npm run test
```

```bash
yarn test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [ReeceM](https://github.com/ReeceM)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
