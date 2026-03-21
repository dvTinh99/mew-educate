import { defineEventHandler, createError } from 'h3'
import { db } from '../../db'
import { decks, cards } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const deckId = event.context.params?.id

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

  if (deck.userId !== authUser.id && !deck.isPreBuilt) {
    throw createError({
      statusCode: 403,
      message: 'Not authorized to view this deck'
    })
  }

  const deckCards = await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, deckId))

  return {
    deck: {
      ...deck,
      cards: deckCards,
    },
  }
})
