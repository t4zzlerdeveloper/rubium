## 1.0.2 (2023-12-28)

### Bug fixes

Tag comments and strings as isolating for the purpose of bidirectional text.

## 1.0.1 (2023-01-18)

### Bug fixes

Fix an issue where the grammar didn't handle less-than characters at the end of the document correctly.

Remove use of `require` as an identifier in the build output, which could break CommonJS builds.

## 1.0.0 (2022-06-06)

### New features

First stable version.

## 0.16.0 (2022-04-20)

### Breaking changes

Move to 0.16 serialized parser format.

### Bug fixes

Allow `class` to be an identifier in constructs like `A::class`. Add highlighting information

### New features

The parser now includes syntax highlighting information in its node types.

## 0.15.0 (2021-09-03)

### New features

First numbered release.
