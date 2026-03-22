import { defineEventHandler, getQuery, setCookie, createError, sendRedirect } from 'h3'
import { OAuth2Client } from 'google-auth-library'
import { db } from '../../../db'
import { users, accounts, userStats, foodInventory } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string
  const error = query.error as string

  const savedState = getCookie(event, 'oauth_state')

  if (error) {
    return sendRedirect(event, '/?error=oauth_error')
  }

  if (!state || state !== savedState) {
    throw createError({
      statusCode: 400,
      message: 'Invalid state parameter'
    })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      message: 'Google OAuth not configured'
    })
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: clientId,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw createError({ statusCode: 400, message: 'Invalid Google token' })
    }

    const googleEmail = payload.email!
    const googleName = payload.name || googleEmail.split('@')[0]
    const googleId = payload.sub

    let existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.providerAccountId, googleId))
      .limit(1)

    let user

    if (existingAccount.length > 0) {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, existingAccount[0].userId))
        .limit(1)

      if (userResult.length === 0) {
        throw createError({ statusCode: 404, message: 'User not found' })
      }
      user = userResult[0]
    } else {
      const existingUserByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, googleEmail))
        .limit(1)

      if (existingUserByEmail.length > 0) {
        user = existingUserByEmail[0]

        await db.insert(accounts).values({
          id: googleId,
          userId: user.id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: googleId,
          access_token: tokens.access_token || null,
          refresh_token: tokens.refresh_token || null,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
          token_type: tokens.token_type || null,
          scope: tokens.scope || null,
          id_token: tokens.id_token || null,
        })
      } else {
        const newUser = await db.insert(users).values({
          email: googleEmail,
          name: googleName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).returning()

        user = newUser[0]

        if (!user) {
          throw createError({ statusCode: 500, message: 'Failed to create user' })
        }

        await db.insert(userStats).values({
          userId: user.id,
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalStudyTime: 0,
          totalCardsStudied: 0,
          totalExamsTaken: 0,
          perfectExams: 0,
          dailyChallengesCompleted: 0,
          weeklyChallengesCompleted: 0,
          onboardingCompleted: false,
        })

        await db.insert(foodInventory).values({
          userId: user.id,
          basic: 10,
          premium: 2,
          rare: 0,
          maxCapacity: 100,
        })

        await db.insert(accounts).values({
          id: googleId,
          userId: user.id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: googleId,
          access_token: tokens.access_token || null,
          refresh_token: tokens.refresh_token || null,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
          token_type: tokens.token_type || null,
          scope: tokens.scope || null,
          id_token: tokens.id_token || null,
        })
      }
    }

    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64')

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    setCookie(event, 'oauth_state', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    })

    return sendRedirect(event, '/profile')
  } catch (error: any) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/?error=oauth_failed')
  }
})
