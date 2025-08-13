/**
 * @julienbenac/ally-strava
 *
 * @author Julien Benac <contact@julienbenac.fr>
 * @license MIT
 */

import type {
  AllyUserContract,
  ApiRequestContract,
  RedirectRequestContract,
} from '@adonisjs/ally/types'
import type { HttpContext } from '@adonisjs/core/http'

import { Oauth2Driver } from '@adonisjs/ally'

import { StravaDriverConfig, StravaScopes, StravaToken } from './types/main.js'

/**
 * Strava driver to login user via Strava.
 */
export class StravaDriver extends Oauth2Driver<StravaToken, StravaScopes> {
  /**
   * The authorization URL for the OAuth provider.
   * The user will be redirected to this page to authorize the request.
   */
  protected authorizeUrl = 'https://www.strava.com/api/v3/oauth/authorize'

  /** The URL to hit to get an access token. */
  protected accessTokenUrl = 'https://www.strava.com/api/v3/oauth/token'

  /** The URL to hit to get user details. */
  protected userInfoUrl = 'https://www.strava.com/api/v3/athlete'

  /** The cookie name for storing the CSRF token. */
  protected stateCookieName = 'strava_oauth_state'

  /**
   * The parameter name in which to send the state to the OAuth provider.
   * The same input is used to retrieve the state post redirect as well.
   */
  protected stateParamName = 'state'

  /** The parameter name from which to fetch the authorization code. */
  protected codeParamName = 'code'

  /** The parameter name from which to fetch the error message post redirect. */
  protected errorParamName = 'error'

  /** The parameter name for defining the authorization scopes. */
  protected scopeParamName = 'scope'

  /** The identifier for joining multiple scopes. */
  protected scopesSeparator = ','

  constructor(
    ctx: HttpContext,
    public config: StravaDriverConfig
  ) {
    super(ctx, config)

    this.loadState()
  }

  /**
   * Persists the state inside the cookie.
   */
  #persistState(): string | undefined {
    if (this.isStateless) return

    const state = this.getState()
    this.ctx.response.encryptedCookie(this.stateCookieName, state, {
      sameSite: false,
      httpOnly: true,
    })

    return state
  }

  /**
   * Configuring the redirect request with defaults.
   */
  protected configureRedirectRequest(request: RedirectRequestContract<StravaScopes>) {
    // Define user defined scopes or the default one's
    request.scopes(this.config.scopes || ['read'])

    // Set "state" param except if stateless authentication
    const state = this.#persistState()
    state && request.param(this.stateParamName, state)

    // Set "response_type" param
    request.param('response_type', 'code')
  }

  /**
   * Redirects user for authentication.
   */
  async redirect(
    callback?: (request: RedirectRequestContract<StravaScopes>) => void
  ): Promise<void> {
    const url = await this.redirectUrl((request) => {
      if (typeof callback === 'function') {
        callback(request)
      }
    })

    this.ctx.response.redirect(url)
  }

  /**
   * Returns the HTTP request with the authorization header set.
   */
  protected getAuthenticatedRequest(url: string, token: string) {
    const request = this.httpClient(url)

    request.header('Authorization', `Bearer ${token}`)
    request.header('Accept', 'application/json')
    request.parseAs('json')

    return request
  }

  /**
   * Fetches the user details.
   */
  protected async getUserInfo(
    token: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<Omit<AllyUserContract<StravaToken>, 'token'>> {
    const request = this.getAuthenticatedRequest(this.userInfoUrl, token)

    if (typeof callback === 'function') {
      callback(request)
    }

    const body = await request.get()

    return {
      id: body.id,
      nickName: body.firstname,
      name: body.lastname,
      email: null,
      emailVerificationState: 'unsupported',
      avatarUrl: null,
      original: body,
    }
  }

  /**
   * Find if the current error message is access denied.
   */
  accessDenied(): boolean {
    const error = this.getError()

    if (!error) return false

    return error === 'access_denied'
  }

  /**
   * Returns details of the authorized user.
   */
  async user(
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<StravaToken>> {
    const token = await this.accessToken(callback)
    const user = await this.getUserInfo(token.token, callback)

    return { ...user, token }
  }

  /**
   * Finds the user from access token.
   */
  async userFromToken(
    token: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<{ token: string; type: 'bearer' }>> {
    const user = await this.getUserInfo(token, callback)

    return {
      ...user,
      token: { token, type: 'bearer' as const },
    }
  }
}
