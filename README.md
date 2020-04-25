![Github Action](https://github.com/duocun/duocun-mall/workflows/Github%20Action/badge.svg)
[![Node version](https://img.shields.io/badge/npm-v6.9.0-green)](http://nodejs.org/download/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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
ionic serve
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
