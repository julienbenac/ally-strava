# @julienbenac/ally-strava

<div align="center">

![Version](https://img.shields.io/npm/v/@julienbenac/ally-strava?style=for-the-badge&colorA=4c566a&colorB=5382a1&logo=npm&logoColor=white)
![Code Size](https://img.shields.io/github/languages/code-size/julienbenac/ally-strava?style=for-the-badge&colorA=4c566a&colorB=ebcb8b&logo=github&logoColor=white)
![License](https://img.shields.io/github/license/julienbenac/ally-strava?style=for-the-badge&colorA=4c566a&colorB=a3be8c)

</div>

`@julienbenac/ally-strava` is a [Strava](https://www.strava.com) driver for [AdonisJS Ally](https://docs.adonisjs.com/guides/authentication/social-authentication).

## Getting started

### Installation

First of all, if you haven't already done so, you need to install and configure the [`@adonisjs/ally`](https://www.npmjs.com/package/@adonisjs/ally) package to implement social authentication in your AdonisJS application.

```bash
node ace add @adonisjs/ally
```

After going through the first step, you can now download the `@julienbenac/ally-strava` package.

```bash
npm install @julienbenac/ally-strava
```

### Usage

Next, configure the package by running the following command. This command will update the `.env` and `start/env.ts` files with the environment variables.

```bash
node ace configure @julienbenac/ally-strava
```

Then register the service inside the configuration file `config/ally.ts`.

```ts
// config/ally.ts

import env from '#start/env'
import { defineConfig } from '@adonisjs/ally'
import { strava } from '@julienbenac/ally-strava'

const allyConfig = defineConfig({
  strava: strava({
    clientId: env.get('STRAVA_CLIENT_ID'),
    clientSecret: env.get('STRAVA_CLIENT_SECRET'),
    callbackUrl: env.get('STRAVA_CALLBACK_URL'),
  }),
})
```

Finally, you can use the Strava driver in your AdonisJS application as below.

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'

router.get('/strava', ({ response }) => {
  return response.send('<a href="/strava/redirect"> Login with Strava </a>')
})

router.get('/strava/redirect', ({ ally }) => {
  // You can use or override default scopes
  return ally.use('strava').redirect()
})

router.get('/strava/callback', async ({ ally }) => {
  const strava = ally.use('strava')

  if (strava.accessDenied()) {
    return 'Access was denied.'
  }

  if (strava.hasError()) {
    return strava.getError()
  }

  if (strava.stateMisMatch()) {
    return 'State mismatch.'
  }

  return await strava.user()
})
```

## Development

This section provides instructions for setting up the development environment and contributing to the package. The project uses Git hooks managed by [Husky](https://typicode.github.io/husky) to automate parts of the development workflow, helping maintain code quality and consistency.

### Install dependencies

To set up the development environment, install the project dependencies as follows.

```bash
npm install
```

### Update dependencies with Taze

Taze is a modern CLI tool that helps you keep your dependencies up to date by checking for newer versions and updating them according to your configuration. The project's `taze.config.js` file configures Taze with the following settings:

- Enables interactive mode, allowing you to select which dependencies to update.
- Automatically writes the updated versions to the `package.json`.
- Automatically installs the updated dependencies after updating.
- Checks and updates peer dependencies along with regular dependencies.

```bash
npm run taze
```

### Release package

To publish a new version of the package, run the following command which automates the entire release process. The script handles incrementing the version number, building the production-ready code, publishing the package, and creating a Git tag for the release, ensuring a consistent and error-free workflow.

```bash
npm run release
```
