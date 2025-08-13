/**
 * @julienbenac/ally-strava
 *
 * @author Julien Benac <contact@julienbenac.fr>
 * @license MIT
 */

import type { HttpContext } from '@adonisjs/core/http'

export { stubsRoot } from './stubs/main.js'
export { configure } from './configure.js'

import type { StravaDriverConfig, StravaToken } from './src/types/main.js'

import { StravaDriver } from './src/strava.js'

export function strava(config: StravaDriverConfig) {
  return (ctx: HttpContext) => new StravaDriver(ctx, config)
}

export type { StravaToken }
