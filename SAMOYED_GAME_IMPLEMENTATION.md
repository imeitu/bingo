# Samoyed Game Pet Logic Implementation

## Overview

This document describes the implementation of the pet logic system for the Samoyed virtual pet game, including the `useSamoyedGame` hook, interaction reducers, passive stat decay, and comprehensive testing.

## Files Created/Modified

### New Files

1. **src/lib/hooks/use-samoyed-game.ts**
   - Main hook that composes all game atoms into a unified interface
   - Provides readable/writable selectors for pet stats, scene, and derived mood state
   - Implements passive stat decay with configurable rates and automatic pause during sleep
   - Returns organized API with stats, thresholds, actions, and setters

2. **src/state/samoyed-game/derived-atoms.ts**
   - Threshold atoms: `isHungryAtom`, `isDirtyAtom`, `isSleepyAtom`, `isUnhappyAtom`
   - Critical threshold atoms for each stat
   - `isSleepingAtom` to track sleep state
   - `decayStatsAtom` for applying stat decay with configurable rates

3. **src/state/samoyed-game/interactions.ts**
   - Comprehensive effect definitions for all interactions
   - **Food effects**: kibble, treat, premium-food, healthy-meal
   - **Toy effects**: ball, chew-toy, frisbee, plush-toy
   - **Cleaning steps**: bath, groom, quick-clean, full-spa
   - **Rest cycles**: nap, sleep, power-nap
   - State transition guards with TypeScript guards
   - Helper functions: `applyFoodEffect`, `applyToyEffect`, `applyCleaningEffect`, `applyRestEffect`
   - Validation functions: `isValidStateTransition`, `getTransitionError`

4. **src/state/samoyed-game/__tests__/interactions.test.ts**
   - 23 comprehensive tests for interaction effects
   - Tests food, toy, cleaning, and rest effects
   - Tests stat clamping (0-100 range)
   - Tests state transition validation

5. **src/state/samoyed-game/__tests__/decay.test.ts**
   - 13 comprehensive tests for stat decay
   - Tests single and multiple stat decay
   - Tests configurable decay rates
   - Tests stat clamping during decay
   - Tests realistic decay scenarios

6. **vitest.config.ts**
   - Vitest configuration for running unit tests
   - Path alias configuration for imports

7. **src/state/samoyed-game/README.md**
   - Comprehensive documentation for the state management system
   - Usage examples for the hook and atoms
   - Effect tables for all interactions
   - Testing instructions

### Modified Files

1. **src/state/samoyed-game/types.ts**
   - Added `isSleeping?: boolean` to `GameFlags` interface

2. **src/state/samoyed-game/atoms.ts**
   - Enhanced `feedPetAtom` to use `applyFoodEffect` and state validation
   - Enhanced `playWithPetAtom` to use `applyToyEffect` and state validation
   - Enhanced `cleanPetAtom` to use `applyCleaningEffect` with cleaning type parameter
   - Enhanced `restPetAtom` to use `applyRestEffect` with rest type parameter and sleep state management
   - Removed `unstable_getOnInit` option to fix TypeScript issues

3. **src/state/samoyed-game/index.ts**
   - Exported derived-atoms and interactions modules

4. **src/components/samoyed-game/StatusPanel.tsx**
   - Enhanced stat bar colors (more vibrant)
   - Added pulse animation for critical stats
   - Improved transition duration (300ms → 500ms)

5. **src/components/samoyed-game/ActionPanel.tsx**
   - Added validation for play and clean actions
   - Added toast notifications for validation errors
   - Integrated `getTransitionError` for user feedback

6. **package.json**
   - Added `vitest` as dev dependency
   - Added `test` and `test:watch` scripts

## Core Features Implemented

### 1. useSamoyedGame Hook

The hook provides a unified interface to the game state:

```typescript
const {
  stats,          // Current pet stats (hunger, happiness, cleanliness, energy)
  mood,           // Derived mood based on stats
  scene,          // Current scene
  dayPhase,       // Current day phase
  inventory,      // Inventory items
  flags,          // Game flags
  thresholds,     // { isHungry, isDirty, isSleepy, isUnhappy, isSleeping }
  actions,        // { feed, play, clean, rest, updateStat }
  setters,        // { setStats, setScene, setInventory, setFlags }
  decay,          // { start, stop }
} = useSamoyedGame(config)
```

### 2. Interaction Reducers

Each interaction has been enhanced with:
- **Multiple options**: Different food items, toys, cleaning types, and rest cycles
- **Varied effects**: Each option has unique stat adjustments
- **State validation**: Guards prevent invalid actions (e.g., playing when too tired)
- **Stat capping**: All stats are clamped between 0-100

#### Food Effects
- **kibble**: +20 hunger, +5 happiness
- **treat**: +10 hunger, +15 happiness
- **premium-food**: +30 hunger, +10 happiness, +5 energy
- **healthy-meal**: +25 hunger, +8 happiness, +10 energy

#### Toy Effects
- **ball**: +15 happiness, -10 energy, -5 hunger
- **chew-toy**: +12 happiness, -5 energy, -3 hunger
- **frisbee**: +20 happiness, -15 energy, -8 hunger
- **plush-toy**: +10 happiness, -3 energy

#### Cleaning Steps
- **bath**: +30 cleanliness, +5 happiness, -5 energy
- **groom**: +20 cleanliness, +10 happiness
- **quick-clean**: +15 cleanliness, +3 happiness
- **full-spa**: +50 cleanliness, +15 happiness, -10 energy

#### Rest Cycles
- **nap**: +25 energy, -5 hunger (30 min)
- **sleep**: +50 energy, -15 hunger (8 hours)
- **power-nap**: +15 energy, -2 hunger (15 min)

### 3. Passive Stat Decay

Implemented via `useEffect` + `setInterval` in the hook:
- **Configurable rates**: Each stat can have different decay rates
- **Automatic pause**: Decay stops when pet is sleeping
- **Cleanup**: Proper interval cleanup on unmount
- **Default rates**:
  - Hunger: -1 per interval
  - Happiness: -0.5 per interval
  - Cleanliness: -0.3 per interval
  - Energy: -0.2 per interval
- **Default interval**: 5000ms (5 seconds)

### 4. Derived Threshold Atoms

Threshold atoms for UI indicators:
- `isHungryAtom`: hunger < 30
- `isDirtyAtom`: cleanliness < 30
- `isSleepyAtom`: energy < 30
- `isUnhappyAtom`: happiness < 30
- `isCriticallyHungryAtom`: hunger < 10
- `isCriticallyDirtyAtom`: cleanliness < 10
- `isCriticallySleepyAtom`: energy < 10
- `isCriticallyUnhappyAtom`: happiness < 10

### 5. Enhanced StatusPanel

- **Color-coded stat bars**: Green (healthy), yellow (warning), red (critical)
- **Animated bars**: Smooth 500ms transitions
- **Pulse animation**: Critical stats pulse to draw attention
- **Mood display**: Dynamic emoji and text based on current mood

### 6. TypeScript Guards

State transition validation:
- **Play**: Requires energy > 10
- **Clean**: Requires energy > 5
- **Feed**: Always allowed
- **Rest**: Always allowed

User-friendly error messages via `getTransitionError()`.

### 7. Comprehensive Testing

36 passing tests covering:
- All interaction effects (feed, play, clean, rest)
- Stat clamping (0-100)
- State transition validation
- Decay mechanics
- Configurable rates
- Edge cases

## Usage Examples

### Basic Usage

```typescript
import { useSamoyedGame } from '@/lib/hooks/use-samoyed-game'

function PetGame() {
  const { stats, mood, thresholds, actions } = useSamoyedGame()

  return (
    <div>
      <p>Mood: {mood}</p>
      <p>Hunger: {stats.hunger}</p>
      {thresholds.isHungry && <button onClick={() => actions.feed('kibble')}>Feed</button>}
    </div>
  )
}
```

### Custom Decay Configuration

```typescript
const customConfig = {
  enabled: true,
  intervalMs: 10000, // Decay every 10 seconds
  rates: {
    hunger: -2,      // Faster hunger decay
    happiness: -1,
    cleanliness: -0.5,
    energy: -0.3,
  },
}

const game = useSamoyedGame(customConfig)
```

### Direct Atom Usage

```typescript
import { useAtomValue } from 'jotai'
import { isHungryAtom, isDirtyAtom } from '@/state/samoyed-game'

function StatusIndicators() {
  const isHungry = useAtomValue(isHungryAtom)
  const isDirty = useAtomValue(isDirtyAtom)

  return (
    <div>
      {isHungry && <span>🍖 Hungry</span>}
      {isDirty && <span>🛁 Needs Cleaning</span>}
    </div>
  )
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Future Enhancements

Potential improvements:
1. Add more food items with unique effects
2. Implement toy durability (toys break after use)
3. Add weather effects on stat decay
4. Implement achievements/milestones
5. Add mini-games for interaction
6. Persistent stat history/analytics
7. Multiple pets support
8. Social features (pet playdates)

## Technical Notes

- **State persistence**: All state is persisted to localStorage via Jotai's `atomWithStorage`
- **Performance**: Decay runs every 5 seconds by default, can be adjusted
- **Type safety**: Full TypeScript coverage with strict types
- **Testing**: Vitest for fast unit tests
- **Architecture**: Atomic design with Jotai, functional approach
