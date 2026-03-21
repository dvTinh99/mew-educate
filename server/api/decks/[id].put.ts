import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../db'
import { decks, cards } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const deckId = event.context.params?.id
  const body = await readBody(event)
  const { name, description, category, difficulty, language, tags, deckIcon } = body

  if (!deckId) {
    throw createError({
      statusCode: 400,
      message: 'Deck ID is required'
    })
  }

  const deckResults = await db
    .select()
    .from(decks)
    .where(eq(decks.id, deckId))
    .limit(1)

  if (deckResults.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Deck not found'
    })
  }

  const deck = deckResults[0]

  if (deck.userId !== authUser.id) {
    throw createError({
      statusCode: 403,
      message: 'Not authorized to update this deck'
    })
  }

  const updateData: any = {}
  if (name !== undefined) updateData.name = name.trim()
  if (description !== undefined) updateData.description = description
  if (category !== undefined) updateData.category = category
  if (difficulty !== undefined) updateData.difficulty = difficulty
  if (language !== undefined) updateData.language = language
  if (tags !== undefined) updateData.tags = tags
  if (deckIcon !== undefined) updateData.deckIcon = deckIcon

  const updatedDeck = await db.update(decks)
    .set(updateData)
    .where(eq(decks.id, deckId))
    .returning()

  return {
    success: true,
    deck: updatedDeck[0],
  }
})
