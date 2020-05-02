![Github Action](https://github.com/duocun/duocun-mall/workflows/build/badge.svg)
[![Node version](https://img.shields.io/badge/npm-v6.9.0-green)](http://nodejs.org/download/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![HitCount](http://hits.dwyl.com/duocun/duocun-mall.svg)](http://hits.dwyl.com/duocun/duocun-mall)
# duocun-mall

**duocun-mall** is a shopping mall frontend using [duocun-api](https://github.com/duocun/duocun-api) as its backend

# Technology Stack

- [Ionic Framework v4](https://ionicframework.com/docs)
- [Angular v8](https://angular.io/)

# Installation

```console
git clone https://github.com/duocun/duocun-mall.git
cd duocun-mall
npm i
npm i -g ionic
```

## Serve

```console
npm run start
```

You can set a different port:

```console
ionic serve --port 5008
```

## Test

```console
ng test
```

## Prettier Lint Check & Fix

### Install prettier

```console
npm i g prettier@2.0.5
```

### Lint Check

```console
prettier --check src/**/*.ts
```

### Lint Fix

```console
prettier --write src/**/*.ts
```

# Deployment

```console
ionic build --prod
```
