# Occ TSCad

Typescript CSG library leveraging Opencascade.js for rendering
[Live Editor](https://richardwa.github.io/occ-tscad-live/#/live-editor/)

## Getting Started
bun required (mainly for faster install and typescript run) - https://bun.com/docs/installation
trust is required for postinstall script to run (this will build the ui bundle to be served by express)
```sh
bun add -D github:richardwa/occ-tscad
bun pm trust occ-tscad
bun x tscad-server <my files folder>
```

