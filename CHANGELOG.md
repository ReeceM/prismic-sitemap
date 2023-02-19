# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.3] - 2022-02-19

* Publish again as version error

## [0.5.2] - 2022-02-19

### Changes
* Update paginator.js by @ReeceM in https://github.com/ReeceM/prismic-sitemap/pull/22

## [0.5.1] - 2022-11-25

### Fixed
- Fixed the workfile

## [0.5.0] - 2022-11-24

### Changes
- The config usage option has changed, it must be done within the config area

### Fixed
- Fixes issue [#18](https://github.com/ReeceM/prismic-sitemap/issues/18)

## [0.4.3] - 2022-07-28
### Fixed
- Error where sometimes in NextJS duplicate entries were saved in the sitemap.

## [0.4.0] - 2021-07-24

### Feature
- Added automatic pagination for all document types defined, or all that are returned.
  - this can also be configured with a pageSize per query if you wish to control that.

## [0.3.1] - 2021-07-24

### Fixed
- Custom webpack function was not being called when running in isServer, @fattomhk, PR #11

## [0.3.0] - 2021-06-30

### Added
- Option to make use of callback in `optionsMapPerDocumentType` see Discussion [Lastmod support #8](https://github.com/ReeceM/prismic-sitemap/discussions/8)
- Added option to have a static path list of urls for normal routes that aren't dynamic

### Changed
- Made the URL result from the linkResolver take priority on results that go into the sitemap
- The `sitemapConfig` option is using the `lastmodDateOnly = true` setting to ensure all lastmod dates are `YYYY-MM-DD` only. But can be disabled to keep UTC time.

## [0.2.0] - 2021-06-14

### Changed
- Made the default `documentTypes` = `['*']` to allow all documents to fetched if none are defined.

### Fixed
- Missing access token for the API for Prismic, see #6

## [0.1.1] - 2021-03-22

### Fixed 
- fix dependencies in the package.json file, see #3 (@a-trost) and PR #4

## [0.1.0] - 2021-03-01

First kind of functional version of the package and it also has the ability to have
### Added
- Integration tests and improved unit test

### Fixed
- The `path` package was missing inside the `index.js` next config file

## [0.0.2] - 2021-03-01

### Added
- Allow the filename to be changed

### Fixed
- The public path was not resolved properly
  - Defaults to using the next dir when from the `next.config.js` file
  - Will us the a local public folder when running directly when not defined


## [0.0.1] - 2021-02-28
### Added
- Initial File
- Docs and such

[Unreleased]: https://github.com/reecem/prismic-sitemap/compare/v0.5.3...HEAD
[0.5.3]: https://github.com/ReeceM/prismic-sitemap/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/ReeceM/prismic-sitemap/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/reecem/prismic-sitemap/compare/v0.5.1...HEAD
[0.5.0]: https://github.com/reecem/prismic-sitemap/compare/v0.5.0...v0.5.1
[0.4.3]: https://github.com/reecem/prismic-sitemap/compare/v0.4.3...v0.5.0
[0.4.2]: https://github.com/reecem/prismic-sitemap/compare/v0.4.2...v0.4.3
[0.4.1]: https://github.com/reecem/prismic-sitemap/compare/v0.4.1...v0.4.2
[0.4.0]: https://github.com/reecem/prismic-sitemap/compare/v0.4.0...v0.4.1
[0.3.1]: https://github.com/reecem/prismic-sitemap/compare/v0.3.1...v0.4.0
[0.3.0]: https://github.com/reecem/prismic-sitemap/compare/v0.3.0...v0.3.1
[0.2.0]: https://github.com/reecem/prismic-sitemap/compare/v0.2.0
[0.1.1]: https://github.com/reecem/prismic-sitemap/tag/v0.1.0
[0.1.0]: https://github.com/reecem/prismic-sitemap/tag/v0.1.0
[0.0.2]: https://github.com/reecem/prismic-sitemap/tag/v0.0.2
[0.0.1]: https://github.com/reecem/prismic-sitemap/tag/v0.0.1
