/**
 * @julienbenac/ally-strava
 *
 * @author Julien Benac <contact@julienbenac.fr>
 * @license MIT
 */

import Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.defineEnvVariables({
    STRAVA_CLIENT_ID: '',
    STRAVA_CLIENT_SECRET: '',
    STRAVA_CALLBACK_URL: '',
  })

  await codemods.defineEnvValidations({
    variables: {
      STRAVA_CLIENT_ID: 'Env.schema.string()',
      STRAVA_CLIENT_SECRET: 'Env.schema.string()',
      STRAVA_CALLBACK_URL: 'Env.schema.string()',
    },
    leadingComment: 'Variables for configuring @julienbenac/ally-strava',
  })
}
