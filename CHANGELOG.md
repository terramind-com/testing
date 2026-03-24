# Changelog

All notable changes to this project will be documented in this file.

## [2026-03-24]

### Added
- Utility functions with input validation, including `groupBy`, `chunk`, `flatten`, and `debounce`.
- Memoize utility with LRU eviction.
- Throttle and debounce utility functions with tests.
- Deep merge and shallow merge utility functions.
- Retry utility with exponential backoff.
- Clamp utility.

### Changed
- CI workflow failure fixed in the testing pipeline.

### Fixed
- Clamp now handles `NaN` input by returning the minimum value.

### Removed
- None.
