# Prismic Sitemap Generator 
[![Node.js CI](https://github.com/ReeceM/prismic-sitemap/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/ReeceM/prismic-sitemap/actions/workflows/node.js.yml)
[![Package Deploy](https://github.com/ReeceM/prismic-sitemap/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ReeceM/prismic-sitemap/actions/workflows/npm-publish.yml)
[![GitHub license](https://img.shields.io/github/license/ReeceM/prismic-sitemap?style=flat)](https://github.com/ReeceM/prismic-sitemap/blob/master/LICENSE)
![npm](https://img.shields.io/npm/v/@reecem/prismic-sitemap)

A sitemap generator for next.js websites based on the pages in your Prismic.io backed Next.js application.

## About

This package uses the [Sitemap.js](https://github.com/ekalinin/sitemap.js) package to generate the sitemaps as it handles all the needed stuff for sitemaps. This also gives the end user flexibility in generating the sitemap

This package is also inspired by the live steam from Prismic.io where they built a sitemap generator.

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

A basic Next.js file that has the sitemap generator plugin running would like as follows:

```javascript
const withPrismicSitemap = require('@reecem/prismic-sitemap')

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

module.exports = withPrismicSitemap({
    // the sitemap object is picked up by the package.
    sitemap: {
        linkResolver: linkResolver,
        apiEndpoint: API_ENDPOINT,
        hostname: SITE_URL,
        optionsMapPerDocumentType: {
            post: { changefreq: "weekly", priority: 0.8 },
            page: { changefreq: "monthly", priority: 1 }
        },
        documentTypes: ['page', 'post']
    }
    ... other nextConfig things here... or before :)
})
```

A more complex example would be to have multiple page types and also multi-language support inside the sitemap.

This one will use a linkResolver that picks if it should use the default local pattern or the localized version and sets that as a prefix.

```javascript
const withPrismicSitemap = require('@reecem/prismic-sitemap')

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

module.exports = withPrismicSitemap({
    // the sitemap object is picked up by the package.
    sitemap: {
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
    }
    ... other nextConfig things here... or before :)
})
```


## API

The sitemap object is made up of the following:

```javascript

{
  sitemap: {
    linkResolver = Function,
    apiEndpoint = String,
    hostname = String,
    fileName = String,
    optionsMapPerDocumentType = Object, /** @see https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemap-item-options */
    documentTypes = Array,
    sitemapConfig = Object /** @see https://github.com/ekalinin/sitemap.js#options-you-can-pass */
  }
}
```

|Option|Type|eg|Description|
|------|----|--|-----------|
|linkResolver|function|`doc => {return `${doc.uid}`;}`| This is the Prismic.io link resolver, this could be custom, or used from the prismic-configuration files.|
|apiEndpoint|string|`'https://some-repository-on-prismic.cdn.prismic.io/api/v2'`| This is the URL of your Prismic repository, the API version of it.|
|hostname|string|`'http://example.com/'`| The hostname of your Vercel/Next.js application|
|fileName|string|`'sitemap.xml'`| The name of the sitemap, it is always placed inside public|
|optionsMapPerDocumentType|object|`{ page: { changefreq: "monthly", priority: 1 }, }`| The options for the documents that are indexed, this can also have other options, found at [https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemap-item-options](https://github.com/ekalinin/sitemap.js/blob/master/api.md#sitemap-item-options)|
|documentTypes|array|`['homepage', 'page', 'pricing', 'legal']`||
|sitemapConfig|object|| see [https://github.com/ekalinin/sitemap.js#options-you-can-pass](https://github.com/ekalinin/sitemap.js#options-you-can-pass)|


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
