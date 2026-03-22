import { defineEventHandler, createError, getQuery } from 'h3'
import { db } from '../../db'
import { decks, cards } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const query = getQuery(event) || {}

  const isPreBuilt = query.prebuilt == 'true'
  const userDecks = await db
    .select()
    .from(decks)
    .where(eq(decks.userId, authUser.id))

  const preBuiltDecks = isPreBuilt ? await db
    .select()
    .from(decks)
    .where(eq(decks.isPreBuilt, true)) : []

  const allDecks = [...userDecks, ...preBuiltDecks]

  const decksWithCards = await Promise.all(
    allDecks.map(async (deck) => {
      const deckCards = await db
        .select()
        .from(cards)
        .where(eq(cards.deckId, deck.id))
      return {
        ...deck,
        cards: deckCards,
        cardCount: deckCards.length,
      }
    })
  )

  console.log('decksWithCards', decksWithCards);
  

  return {
    decks: decksWithCards,
  }
})
