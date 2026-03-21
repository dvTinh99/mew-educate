<template>
  <div class="stats-page">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <button 
          @click="router.push('/')"
          class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Decks
        </button>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p class="text-xl text-gray-600">Track your learning journey</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="card p-6">
          <XpBar />
        </div>
        <div class="card p-6">
          <StreakBadge />
        </div>
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total XP</p>
              <p class="text-3xl font-bold text-gray-900">{{ deckStore.userStats.totalXP.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-6 text-center">
          <p class="text-4xl font-bold text-primary-600">{{ deckStore.userStats.totalCardsStudied }}</p>
          <p class="text-gray-600 mt-1">Cards Studied</p>
        </div>
        <div class="card p-6 text-center">
          <p class="text-4xl font-bold text-success-600">{{ deckStore.userStats.totalExamsTaken }}</p>
          <p class="text-gray-600 mt-1">Exams Taken</p>
        </div>
        <div class="card p-6 text-center">
          <p class="text-4xl font-bold text-warning-600">{{ deckStore.userStats.perfectExams }}</p>
          <p class="text-gray-600 mt-1">Perfect Scores</p>
        </div>
        <div class="card p-6 text-center">
          <p class="text-4xl font-bold text-purple-600">{{ deckStore.unlockedBadgesList.length }}</p>
          <p class="text-gray-600 mt-1">Badges Earned</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="card p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Weekly Progress</h2>
          <div class="chart-container">
            <Bar :data="weeklyChartData" :options="chartOptions" />
          </div>
        </div>
        <div class="card p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Study Activity</h2>
          <div class="chart-container">
            <Doughnut :data="activityChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <div class="card p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Badge Collection</h2>
          <span class="text-lg text-gray-600">
            {{ deckStore.unlockedBadgesList.length }} / {{ ALL_BADGES.length }}
          </span>
        </div>
        <BadgeGrid />
      </div>

      <div class="card p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Exam History</h2>
        <div v-if="allExamResults.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No exams yet</h3>
          <p class="text-lg text-gray-600">Complete your first exam to see your history</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-4 font-bold text-gray-700">Deck</th>
                <th class="text-center py-4 px-4 font-bold text-gray-700">Score</th>
                <th class="text-center py-4 px-4 font-bold text-gray-700">Grade</th>
                <th class="text-center py-4 px-4 font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in allExamResults" :key="result.id" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-4 px-4 font-medium text-gray-900">{{ getDeckName(result.deckId) }}</td>
                <td class="text-center py-4 px-4">
                  <span class="text-lg font-bold" :class="getScoreColor(result.score)">
                    {{ result.score }}%
                  </span>
                </td>
                <td class="text-center py-4 px-4">
                  <span class="px-3 py-1 rounded-full text-sm font-bold" :class="getGradeClass(result.grade)">
                    {{ result.grade }}
                  </span>
                </td>
                <td class="text-center py-4 px-4 text-gray-600">
                  {{ formatDate(result.completedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <AppButton variant="danger" size="lg" @click="confirmReset">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Progress
          </span>
        </AppButton>
      </div>

      <Modal
        v-model="showResetModal"
        title="Reset All Progress?"
        size="sm"
      >
        <div class="text-lg">
          <p class="mb-4">
            This will permanently delete all your progress, including:
          </p>
          <ul class="list-disc list-inside mb-4 text-gray-700">
            <li>All XP and level</li>
            <li>All badges and achievements</li>
            <li>All exam history and leaderboard scores</li>
            <li>Your streak</li>
          </ul>
          <p class="text-warning-600 font-medium">
            Your custom decks and cards will NOT be deleted.
          </p>
        </div>
        
        <template #footer>
          <AppButton variant="outline" size="lg" @click="showResetModal = false">
            Cancel
          </AppButton>
          <AppButton variant="danger" size="lg" @click="resetProgress">
            Reset Everything
          </AppButton>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '~/stores/deck'
import { ALL_BADGES } from '~/types/gamification'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import type { ExamResult } from '~/types/exam'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const router = useRouter()
const deckStore = useDeckStore()
const showResetModal = ref(false)

const allExamResults = computed(() => {
  const results: ExamResult[] = []
  Object.values(deckStore.examResults).forEach(deckResults => {
    results.push(...deckResults)
  })
  return results.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  ).slice(0, 10)
})

const getDeckName = (deckId: string) => {
  const deck = deckStore.getDeckById(deckId)
  return deck?.name || 'Unknown Deck'
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-success-600'
  if (score >= 70) return 'text-warning-600'
  return 'text-danger-600'
}

const getGradeClass = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-success-100 text-success-700'
    case 'B': return 'bg-primary-100 text-primary-700'
    case 'C': return 'bg-warning-100 text-warning-700'
    case 'D': return 'bg-orange-100 text-orange-700'
    default: return 'bg-danger-100 text-danger-700'
  }
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const confirmReset = () => {
  showResetModal.value = true
}

const resetProgress = () => {
  deckStore.resetProgress()
  showResetModal.value = false
  router.push('/')
}

const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
  }
  return days
}

const weeklyChartData = computed(() => ({
  labels: getLast7Days(),
  datasets: [
    {
      label: 'Cards Studied',
      data: [12, 19, 8, 15, 22, 30, 18],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    },
    {
      label: 'Exams Taken',
      data: [0, 1, 0, 2, 1, 0, 1],
      backgroundColor: 'rgba(168, 85, 247, 0.5)',
      borderColor: 'rgb(168, 85, 247)',
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5
      }
    }
  }
}

const activityChartData = computed(() => ({
  labels: ['Cards Studied', 'Exams Taken', 'Challenges Completed'],
  datasets: [
    {
      data: [
        deckStore.userStats.totalCardsStudied,
        deckStore.userStats.totalExamsTaken * 10,
        deckStore.userStats.dailyChallengesCompleted
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderWidth: 0
    }
  ]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

useHead({
  title: 'Profile - Learn by Game'
})
</script>

<style scoped>
.stats-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}

.chart-container {
  height: 300px;
}
</style>
