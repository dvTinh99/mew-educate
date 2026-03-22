import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import { db } from '../../db'
import { inquiries, users } from '../../db/schema'
import { eq } from 'drizzle-orm'

interface TokenPayload {
  id: string
  email: string
  exp: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, category, subject, message } = body

  if (!email || !category || !subject || !message) {
    throw createError({
      statusCode: 400,
      message: 'All fields are required'
    })
  }

  if (!['bug', 'feature', 'question', 'other'].includes(category)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid category'
    })
  }

  if (subject.length < 3) {
    throw createError({
      statusCode: 400,
      message: 'Subject must be at least 3 characters'
    })
  }

  if (message.length < 10) {
    throw createError({
      statusCode: 400,
      message: 'Message must be at least 10 characters'
    })
  }

  let userId: string | undefined

  const token = getCookie(event, 'auth_token')
  if (token) {
    try {
      const payload: TokenPayload = JSON.parse(Buffer.from(token, 'base64').toString())
      if (payload.exp > Date.now()) {
        userId = payload.id
      }
    } catch (e) {
      // Token invalid, continue without userId
    }
  }

  const newInquiry = await db.insert(inquiries).values({
    userId: userId || null,
    email,
    category,
    subject,
    message,
    status: 'pending',
  }).returning()

  return {
    success: true,
    inquiry: newInquiry[0]
  }
})
