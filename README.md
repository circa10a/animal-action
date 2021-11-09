# animal-action

![Build Status](https://github.com/circa10a/animal-action/workflows/tag/badge.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/circa10a/animal-action?style=plastic)

A github action to add smiles to pull requests

test

## Inputs

## `github_token`

**Required** A GitHub token

## `animals`

A comma-delimated string of types of animals pictures to comment with.

Default:`"cats,dogs,foxes"`.

## `pull_request_comment`

Comment to post along with animal picture.

Default:`"Thank you for your contribution. While we review, please enjoy this cute animal picture :cat:"`.

## Outputs

None

## Example usage

```yaml
name: comment
on:
  pull_request:
    types: [opened]
jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: circa10a/animal-action@v0.1.0
        with:
          github_token: ${{ secrets.github_token }}
          animals: 'cats,dogs' # cats,dogs,foxes currently supported
          pull_request_comment: 'Thank you for the contribution! Here's a cute animal picture to say thank you!'
```
