/**
 * @julienbenac/ally-strava
 *
 * @author Julien Benac <contact@julienbenac.fr>
 * @license MIT
 */

import type {
  AllyDriverContract,
  LiteralStringUnion,
  Oauth2DriverConfig,
} from '@adonisjs/ally/types'

export interface StravaDriverContract extends AllyDriverContract<StravaToken, StravaScopes> {
  version: 'oauth2'
}

export interface StravaDriverConfig extends Oauth2DriverConfig {
  scopes?: LiteralStringUnion<StravaScopes>[]
}

export type StravaToken = {
  /** The token value. */
  token: string

  /** The token type. */
  type: 'bearer'

  /** The refresh token. */
  refreshToken: string

  /** The static time in seconds when the token will expire. */
  expiresIn: number

  /** The timestamp at which the token expires. */
  expiresAt: Date
} & Record<string, any>

export type StravaScopes =
  | 'read'
  | 'read_all'
  | 'profile:read_all'
  | 'profile:write'
  | 'activity:read'
  | 'activity:read_all'
  | 'activity:write'
