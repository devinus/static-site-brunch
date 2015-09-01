# static-site-brunch

[![Build Status](https://travis-ci.org/devinus/static-site-brunch.svg?branch=master)](https://travis-ci.org/devinus/static-site-brunch)

Static site support for [Brunch](http://brunch.io/).

## Install

```
npm install --save static-site-brunch
```

## Usage

Add Handlebars templates to `app/templates` and they will be automatically
compiled and placed in your `public` directory.

Partials are automatically registered if they begin with an underscore, e.g.
`_hello.hbs`.

YAML front matter allows you to control the context passed to the template
during render.

## Example

```
---
people:
  - name: Devin
  - name: Kevin
---
{{#each people}}
  Hello {{name}}
{{/each}}
```
