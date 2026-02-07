# Occ TSCad

Typescript CSG library leveraging Opencascade.js for rendering
[Live Editor](https://richardwa.github.io/occ-tscad-live/#/live-editor/)

# Local editor

the live editor is good for a trial, but the main point of having code based CAD
is to leverage coding tool chain

- autocomplete with any typescript supported IDE
- git
- import/export shapes
- utility functions / repeated patterns
- parameterized models

## Getting Started

bun required (mainly for faster install and typescript run) - https://bun.com/docs/installation
trust is required for postinstall script to run (this will build the ui bundle to be served by express)

```sh
bun add -D github:richardwa/occ-tscad
bun pm trust occ-tscad
bun x tscad-server <my files folder>
```
