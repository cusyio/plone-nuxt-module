---
title: The '$plone Object'
position: 103
category: 'Getting started'
---

This module globally injects a `$plone` object so you can access it anywher using `this.$plone`. For plugins, `asyncData`, `nuxtServerInit` and middlewares, you can access it from `context.$plone`.

## Methods

### extractPathAndQuery(url)

Extract the relative path and query options from a given url.

- `url`
  - Type: `String`
  - required

## Properties

### baseURL

This is the configured Plone Backend URL.


### client

The Plone JS client instance. Use it to perform queries for your custom REST-API services.
