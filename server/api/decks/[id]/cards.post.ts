import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../../db'
import { cards } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const deckId = event.context.params?.id
  const body = await readBody(event)
  const { front, back, hint } = body

  if (!deckId) {
    throw createError({
      statusCode: 400,
      message: 'Deck ID is required'
    })
  }

  if (!front || !back) {
    throw createError({
      statusCode: 400,
      message: 'Card front and back are required'
    })
  }

  const newCard = await db.insert(cards).values({
    deckId,
    front: front.trim(),
    back: back.trim(),
    hint: hint?.trim() || null,
    reviewCount: 0,
  }).returning()

  return {
    success: true,
    card: newCard[0],
  }
})
