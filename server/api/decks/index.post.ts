import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../db'
import { decks } from '../../db/schema'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const body = await readBody(event)
  const { name, description, category, difficulty, language, tags, deckIcon } = body

  if (!name || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Deck name is required'
    })
  }

  const newDeck = await db.insert(decks).values({
    userId: authUser.id,
    name: name.trim(),
    description: description || '',
    category: category || null,
    difficulty: difficulty || null,
    language: language || null,
    tags: tags || [],
    deckIcon: deckIcon || null,
    isPreBuilt: false,
  }).returning()

  return {
    success: true,
    deck: newDeck[0],
  }
})
