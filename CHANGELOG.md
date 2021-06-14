# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/reecem/prismic-sitemap/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/reecem/prismic-sitemap/compare/v0.2.0...HEAD
[0.1.1]: https://github.com/reecem/prismic-sitemap/tag/v0.1.0
[0.1.0]: https://github.com/reecem/prismic-sitemap/tag/v0.1.0
[0.0.2]: https://github.com/reecem/prismic-sitemap/tag/v0.0.2
[0.0.1]: https://github.com/reecem/prismic-sitemap/tag/v0.0.1
