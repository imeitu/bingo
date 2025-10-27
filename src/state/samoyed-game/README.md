# Samoyed Game State Management

This directory contains the state management logic for the Samoyed virtual pet game using Jotai atoms.

## Core Files

- **types.ts**: TypeScript types and interfaces for game state
- **atoms.ts**: Core Jotai atoms for state management
- **derived-atoms.ts**: Derived atoms for computed values and thresholds
- **interactions.ts**: Game logic for pet interactions (feed, play, clean, rest)

## Usage

### Using the `useSamoyedGame` Hook

The `useSamoyedGame` hook provides a convenient interface to all game state and actions:

```typescript
import { useSamoyedGame } from '@/lib/hooks/use-samoyed-game'

function MyComponent() {
  const {
    stats,
    mood,
    thresholds,
    actions,
  } = useSamoyedGame()

  // Access pet stats
  console.log(stats.hunger, stats.happiness)

  // Check thresholds
  if (thresholds.isHungry) {
    console.log('Pet is hungry!')
  }

  // Perform actions
  const handleFeed = () => {
    actions.feed('kibble')
  }

  return <div>Pet mood: {mood}</div>
}
```

### Configuring Decay

The hook supports customizable decay rates:

```typescript
const config = {
  enabled: true,
  intervalMs: 5000, // Decay every 5 seconds
  rates: {
    hunger: -1,
    happiness: -0.5,
    cleanliness: -0.3,
    energy: -0.2,
  },
}

const game = useSamoyedGame(config)
```

### Direct Atom Access

You can also use atoms directly:

```typescript
import { useAtomValue, useSetAtom } from 'jotai'
import { petStatsAtom, feedPetAtom, isHungryAtom } from '@/state/samoyed-game'

function DirectAtomUsage() {
  const stats = useAtomValue(petStatsAtom)
  const isHungry = useAtomValue(isHungryAtom)
  const feedPet = useSetAtom(feedPetAtom)

  return (
    <button onClick={() => feedPet('kibble')} disabled={!isHungry}>
      Feed Pet
    </button>
  )
}
```

## Interaction Effects

### Food Effects

Different foods have different effects on stats:

- **kibble**: +20 hunger, +5 happiness
- **treat**: +10 hunger, +15 happiness
- **premium-food**: +30 hunger, +10 happiness, +5 energy
- **healthy-meal**: +25 hunger, +8 happiness, +10 energy

### Toy Effects

Different toys affect stats differently:

- **ball**: +15 happiness, -10 energy, -5 hunger
- **chew-toy**: +12 happiness, -5 energy, -3 hunger
- **frisbee**: +20 happiness, -15 energy, -8 hunger
- **plush-toy**: +10 happiness, -3 energy

### Cleaning Steps

- **bath**: +30 cleanliness, +5 happiness, -5 energy
- **groom**: +20 cleanliness, +10 happiness
- **quick-clean**: +15 cleanliness, +3 happiness
- **full-spa**: +50 cleanliness, +15 happiness, -10 energy

### Rest Cycles

- **nap**: +25 energy, -5 hunger (30 min duration)
- **sleep**: +50 energy, -15 hunger (8 hour duration)
- **power-nap**: +15 energy, -2 hunger (15 min duration)

## State Transitions

The system includes guards to prevent invalid state transitions:

- **Play**: Requires energy > 10
- **Clean**: Requires energy > 5
- **Feed**: Always allowed
- **Rest**: Always allowed

Use `isValidStateTransition` and `getTransitionError` to check before performing actions.

## Thresholds

Derived atoms provide threshold checks:

- `isHungryAtom`: hunger < 30
- `isDirtyAtom`: cleanliness < 30
- `isSleepyAtom`: energy < 30
- `isUnhappyAtom`: happiness < 30
- `isCriticallyHungryAtom`: hunger < 10
- `isCriticallyDirtyAtom`: cleanliness < 10
- `isCriticallySleepyAtom`: energy < 10
- `isCriticallyUnhappyAtom`: happiness < 10

## Testing

Run tests with:

```bash
npm test
```

Tests cover:
- Interaction effects (feed, play, clean, rest)
- Stat decay over time
- State transition guards
- Stat clamping (0-100 range)
