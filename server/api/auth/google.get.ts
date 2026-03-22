import { defineEventHandler, getQuery, setCookie, sendRedirect, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`

  if (!clientId) {
    throw createError({
      statusCode: 500,
      message: 'Google OAuth not configured'
    })
  }

  const state = Math.random().toString(36).substring(2, 15)

  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ]

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', scopes.join(' '))
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  return sendRedirect(event, authUrl.toString())
})
