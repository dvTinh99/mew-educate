<template>
  <div class="food-inventory">
    <div class="inventory-header">
      <h3 class="text-lg font-bold text-gray-900">Food Inventory</h3>
      <span class="text-sm text-gray-600">
        {{ totalFood }} / {{ maxCapacity }}
      </span>
    </div>

    <div class="food-grid">
      <button
        v-for="food in foodTypes"
        :key="food.type"
        type="button"
        class="food-item"
        :class="{ 
          'food-empty': inventory[food.type] === 0, 
          'food-selected': selectedType === food.type,
          'food-interactive': interactive
        }"
        :disabled="inventory[food.type] === 0 || disabled"
        @click="handleClick(food.type)"
      >
        <div class="food-icon" :class="food.type">
          <component :is="food.icon" class="w-8 h-8" />
        </div>
        <div class="food-info">
          <span class="food-name">{{ food.name }}</span>
          <span class="food-count">{{ inventory[food.type] }}</span>
        </div>
        <div class="food-xp">
          +{{ food.xpValue }} XP
        </div>
        <div v-if="interactive && inventory[food.type] > 0" class="food-feed-hint">
          Click to feed
        </div>
      </button>
    </div>

    <div class="inventory-capacity">
      <div class="capacity-bar-bg">
        <div 
          class="capacity-bar-fill" 
          :style="{ width: capacityPercent + '%' }"
          :class="{ 'capacity-full': isFull }"
        ></div>
      </div>
      <span v-if="isFull" class="capacity-warning">
        Inventory full!
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { FoodType, FoodInventory } from '~/types/pet'
import { FOOD_TYPES } from '~/types/pet'

interface Props {
  inventory: FoodInventory
  maxCapacity: number
  selectedType?: FoodType | null
  disabled?: boolean
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedType: null,
  disabled: false,
  interactive: false
})

const emit = defineEmits<{
  (e: 'select', type: FoodType): void
  (e: 'feed', type: FoodType): void
}>()

const handleClick = (type: FoodType) => {
  if (props.interactive) {
    emit('feed', type)
  } else {
    emit('select', type)
  }
}

const totalFood = computed(() => {
  return props.inventory.basic + props.inventory.premium + props.inventory.rare
})

const capacityPercent = computed(() => {
  return Math.round((totalFood.value / props.maxCapacity) * 100)
})

const isFull = computed(() => totalFood.value >= props.maxCapacity)

const KibbleIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M3 12l3-9h8l3 9-3 9H6l-3-9z' })
])

const FishIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z', 'clip-rule': 'evenodd' })
])

const TunaIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h1V3a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2H4a1 1 0 110-2h1V7a1 1 0 00-1-1H3V3a1 1 0 00-1-1H1V2a1 1 0 011-1h3zm0 10a1 1 0 011 1v1h1v-1a1 1 0 112 0v1h1v-1a1 1 0 112 0v1h1a2 2 0 002-2v-2h1a1 1 0 110 2H4a1 1 0 110-2h1V7a1 1 0 00-1-1H3v1a1 1 0 00-1 1H1v-1a1 1 0 00-1-1H5v2a2 2 0 002 2h1a1 1 0 010 2H4a1 1 0 110-2h1V9a1 1 0 00-1-1H3v1a1 1 0 01-1 1H1v-1a1 1 0 011-1h3z', 'clip-rule': 'evenodd' })
])

const foodTypes = computed(() => [
  {
    type: 'basic' as FoodType,
    name: 'Basic Kibble',
    xpValue: FOOD_TYPES.basic.xpValue,
    icon: KibbleIcon
  },
  {
    type: 'premium' as FoodType,
    name: 'Premium Fish',
    xpValue: FOOD_TYPES.premium.xpValue,
    icon: FishIcon
  },
  {
    type: 'rare' as FoodType,
    name: 'Legendary Tuna',
    xpValue: FOOD_TYPES.rare.xpValue,
    icon: TunaIcon
  }
])
</script>

<style scoped>
.food-inventory {
  @apply space-y-4;
}

.inventory-header {
  @apply flex items-center justify-between;
}

.food-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-3;
}

.food-item {
  @apply flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.food-item:not(.food-empty):hover {
  @apply transform scale-105;
}

.food-interactive:not(.food-empty) {
  @apply cursor-pointer;
}

.food-interactive:not(.food-empty):hover {
  @apply border-primary-400 bg-primary-50;
}

.food-feed-hint {
  @apply text-xs text-primary-600 font-medium mt-2 opacity-0 transition-opacity;
}

.food-interactive:not(.food-empty):hover .food-feed-hint {
  @apply opacity-100;
}

.food-selected {
  @apply border-primary-500 bg-primary-50 ring-2 ring-primary-200;
}

.food-empty {
  @apply opacity-40;
}

.food-icon {
  @apply w-14 h-14 rounded-full flex items-center justify-center mb-2;
}

.food-icon.basic {
  @apply bg-amber-100 text-amber-600;
}

.food-icon.premium {
  @apply bg-blue-100 text-blue-600;
}

.food-icon.rare {
  @apply bg-purple-100 text-purple-600;
}

.food-info {
  @apply text-center;
}

.food-name {
  @apply block font-semibold text-gray-900 text-sm;
}

.food-count {
  @apply block text-lg font-bold text-gray-700;
}

.food-xp {
  @apply text-xs font-medium text-success-600 mt-1;
}

.inventory-capacity {
  @apply space-y-2;
}

.capacity-bar-bg {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.capacity-bar-fill {
  @apply h-full bg-gradient-to-r from-success-400 to-success-600 rounded-full transition-all duration-500;
}

.capacity-full {
  @apply bg-gradient-to-r from-warning-400 to-warning-600;
}

.capacity-warning {
  @apply text-sm font-medium text-warning-600 text-center block;
}
</style>
