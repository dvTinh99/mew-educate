import { ref, computed } from 'vue'
import { usePetStore } from '~/stores/pet'
import { useDeckStore } from '~/stores/deck'
import type { Pet, BattleOpponent, BattleQuestion, BattleLogEntry, FoodType, BattleResult } from '~/types/pet'

export function useBattleSession() {
  const petStore = usePetStore()
  const deckStore = useDeckStore()

  const isActive = ref(false)
  const currentTurn = ref(1)
  const maxTurns = ref(10)
  const playerHP = ref(0)
  const enemyHP = ref(0)
  const criticalStreak = ref(0)
  const isPlayerTurn = ref(true)
  const battleComplete = ref(false)
  const battleResult = ref<BattleResult | null>(null)
  const battleLog = ref<BattleLogEntry[]>([])
  
  const playerPet = ref<Pet | null>(null)
  const enemyPet = ref<BattleOpponent | null>(null)
  const currentQuestion = ref<BattleQuestion | null>(null)
  const questionAnswered = ref(false)
  const lastAnswerCorrect = ref(false)

  const playerHPPercent = computed(() => {
    if (!playerPet.value) return 0
    return Math.round((playerHP.value / playerPet.value.stats.maxHealth) * 100)
  })

  const enemyHPPercent = computed(() => {
    if (!enemyPet.value) return 0
    return Math.round((enemyHP.value / enemyPet.value.stats.maxHealth) * 100)
  })

  const canUseSpecial = computed(() => {
    return playerPet.value && playerPet.value.evolutionStage >= 2 && criticalStreak.value >= 3
  })

  function startBattle(opponent: BattleOpponent) {
    if (!petStore.pet) return false

    isActive.value = true
    playerPet.value = { ...petStore.pet }
    enemyPet.value = opponent
    currentTurn.value = 1
    playerHP.value = playerPet.value.stats.maxHealth
    enemyHP.value = enemyPet.value.stats.maxHealth
    criticalStreak.value = 0
    isPlayerTurn.value = true
    battleComplete.value = false
    battleResult.value = null
    battleLog.value = []
    questionAnswered.value = false

    generateQuestion()
    return true
  }

  function generateQuestion(): BattleQuestion | null {
    const decks = deckStore.decks.filter(d => d.cards.length > 0)
    if (decks.length === 0) {
      currentQuestion.value = {
        deckId: 'default',
        cardId: '1',
        question: 'What is 2 + 2?',
        correctAnswer: '4',
        options: ['2', '3', '4', '5']
      }
      return currentQuestion.value
    }

    const randomDeck = decks[Math.floor(Math.random() * decks.length)]
    const randomCard = randomDeck.cards[Math.floor(Math.random() * randomDeck.cards.length)]

    const options = [randomCard.back]
    const otherCards = randomDeck.cards.filter(c => c.id !== randomCard.id)
    
    while (options.length < 4 && otherCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherCards.length)
      const option = otherCards.splice(randomIndex, 1)[0]
      if (!options.includes(option.back)) {
        options.push(option.back)
      }
    }

    while (options.length < 4) {
      const fakeOption = `Option ${options.length + 1}`
      if (!options.includes(fakeOption)) {
        options.push(fakeOption)
      }
    }

    options.sort(() => Math.random() - 0.5)

    currentQuestion.value = {
      deckId: randomDeck.id,
      cardId: randomCard.id,
      question: randomCard.front,
      correctAnswer: randomCard.back,
      options
    }
    
    questionAnswered.value = false
    return currentQuestion.value
  }

  function submitAnswer(answer: string): boolean {
    if (!currentQuestion.value || questionAnswered.value) return false

    const isCorrect = answer.toLowerCase().trim() === 
                      currentQuestion.value.correctAnswer.toLowerCase().trim()
    
    lastAnswerCorrect.value = isCorrect
    questionAnswered.value = true

    if (isCorrect) {
      criticalStreak.value++
    } else {
      criticalStreak.value = 0
    }

    return isCorrect
  }

  function executePlayerAttack() {
    if (!playerPet.value || !enemyPet.value || !questionAnswered.value) return

    const isCritical = lastAnswerCorrect.value && criticalStreak.value >= 2
    const baseDamage = playerPet.value.stats.attack
    const criticalBonus = isCritical ? baseDamage * (criticalStreak.value * 0.15) : 0
    const variance = baseDamage * 0.1 * (Math.random() - 0.5)
    
    let damage = Math.max(1, Math.round(baseDamage + criticalBonus + variance))
    
    const isMiss = !lastAnswerCorrect.value && Math.random() < 0.2
    
    if (isMiss) {
      damage = 0
    }

    enemyHP.value = Math.max(0, enemyHP.value - damage)

    const logEntry: BattleLogEntry = {
      turn: currentTurn.value,
      action: 'attack',
      attacker: 'player',
      damage,
      isCritical,
      isMiss,
      description: isMiss 
        ? `${playerPet.value.name} missed!` 
        : isCritical 
          ? `Critical hit! ${playerPet.value.name} dealt ${damage} damage!`
          : `${playerPet.value.name} dealt ${damage} damage!`
    }
    
    battleLog.value.push(logEntry)

    if (enemyHP.value <= 0) {
      endBattle('win')
    } else {
      isPlayerTurn.value = false
      setTimeout(executeEnemyTurn, 1500)
    }
  }

  function executeEnemyTurn() {
    if (!playerPet.value || !enemyPet.value || battleComplete.value) return

    const isCritical = Math.random() < (0.1 + currentTurn.value * 0.02)
    const baseDamage = enemyPet.value.stats.attack
    const variance = baseDamage * 0.1 * (Math.random() - 0.5)
    
    let damage = Math.max(1, Math.round(baseDamage + variance))
    
    const isMiss = Math.random() < 0.15
    
    if (isMiss) {
      damage = 0
    }

    playerHP.value = Math.max(0, playerHP.value - damage)

    const logEntry: BattleLogEntry = {
      turn: currentTurn.value,
      action: 'attack',
      attacker: 'enemy',
      damage,
      isCritical,
      isMiss,
      description: isMiss 
        ? `${enemyPet.value.name} missed!` 
        : isCritical 
          ? `Critical hit! ${enemyPet.value.name} dealt ${damage} damage!`
          : `${enemyPet.value.name} dealt ${damage} damage!`
    }
    
    battleLog.value.push(logEntry)

    if (playerHP.value <= 0) {
      endBattle('lose')
    } else {
      currentTurn.value++
      
      if (currentTurn.value > maxTurns.value) {
        if (enemyHP.value < playerHP.value) {
          endBattle('win')
        } else if (enemyHP.value > playerHP.value) {
          endBattle('lose')
        } else {
          endBattle('draw')
        }
      } else {
        isPlayerTurn.value = true
        generateQuestion()
      }
    }
  }

  function endBattle(result: BattleResult) {
    battleComplete.value = true
    battleResult.value = result

    let xpEarned = 0
    let foodReward: { type: FoodType; amount: number } | undefined

    if (result === 'win') {
      xpEarned = 50 + (enemyPet.value?.level ?? 1) * 10
      
      if (enemyPet.value?.difficulty === 'medium') {
        xpEarned *= 1.5
        foodReward = { type: 'premium', amount: 3 }
      } else if (enemyPet.value?.difficulty === 'hard') {
        xpEarned *= 2
        foodReward = { type: 'rare', amount: 2 }
      } else {
        foodReward = { type: 'basic', amount: 5 }
      }
    } else if (result === 'draw') {
      xpEarned = 20
      foodReward = { type: 'basic', amount: 2 }
    }

    xpEarned = Math.round(xpEarned)

    if (enemyPet.value) {
      petStore.recordBattle(
        enemyPet.value,
        result,
        currentTurn.value,
        xpEarned,
        foodReward
      )
    }
  }

  function resetBattle() {
    isActive.value = false
    currentTurn.value = 1
    playerHP.value = 0
    enemyHP.value = 0
    criticalStreak.value = 0
    isPlayerTurn.value = true
    battleComplete.value = false
    battleResult.value = null
    battleLog.value = []
    playerPet.value = null
    enemyPet.value = null
    currentQuestion.value = null
    questionAnswered.value = false
  }

  return {
    isActive,
    currentTurn,
    maxTurns,
    playerHP,
    enemyHP,
    criticalStreak,
    isPlayerTurn,
    battleComplete,
    battleResult,
    battleLog,
    playerPet,
    enemyPet,
    currentQuestion,
    questionAnswered,
    lastAnswerCorrect,
    playerHPPercent,
    enemyHPPercent,
    canUseSpecial,
    startBattle,
    submitAnswer,
    executePlayerAttack,
    generateQuestion,
    resetBattle
  }
}
