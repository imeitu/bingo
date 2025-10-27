# Samoyed Care Game

A delightful pet simulation game built with Next.js, Jotai state management, and Tailwind CSS.

## Features

### Core Gameplay
- **Pet Care System**: Monitor and maintain your Samoyed's hunger, happiness, cleanliness, and energy levels
- **Multiple Scenes**: Navigate between Home, Park, Kitchen, Bedroom, and Bathroom
- **Dynamic Moods**: Your pet's mood changes based on their stats (Happy, Sad, Hungry, Sleepy, Dirty, Excited)
- **Inventory System**: Use food items and toys to interact with your pet

### Save System
- **Auto-Save**: Game state automatically saves every 2 minutes
- **Manual Save**: Click the Save button in the HUD to save immediately with visual feedback
- **Persistent Storage**: All game data stored in browser localStorage with SSR hydration guards

### Day/Night Cycle
- **Dynamic Time System**: Game clock advances in real-time (1 minute real = 1 hour game time)
- **Four Day Phases**: Dawn (5am-8am), Day (8am-5pm), Dusk (5pm-8pm), Night (8pm-5am)
- **Visual Feedback**: Background gradients and scene lighting change with time of day
- **Sleep Bonus**: Rest action is highlighted during nighttime for better energy recovery

### Notifications System
- **Smart Alerts**: Automatic notifications when stats drop below warning (30%) or critical (10%) thresholds
- **Rate Limiting**: Prevents notification spam (1 notification per stat per minute)
- **Dismissible**: Click × to dismiss individual notifications
- **Auto-Cleanup**: Old dismissed notifications are cleared after 5 minutes
- **Visual Priority**: Critical (red), Warning (yellow), Info (blue), Success (green)

### Sound Effects
- **Action Sounds**: Audio feedback for feed, play, clean, and rest actions
- **Notification Sounds**: Audio cues for stat warnings
- **User-Controlled**: Toggle sound effects on/off via HUD button
- **Gesture-Aware**: Respects browser autoplay policies and user interaction requirements
- **Files Located**: `/public/samoyed-game/sfx/` (currently minimal placeholders)

### Accessibility & Responsive Design
- **ARIA Labels**: All interactive elements have proper aria-labels
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Progress Bars**: Stats displayed with proper ARIA progressbar roles
- **Responsive Layout**: Adapts from mobile (stacked) to desktop (grid)
- **Mobile Optimized**: Smaller touch targets and simplified mobile HUD

## Game Assets

### Visual Assets
- `samoyed-placeholder.svg` - Main Samoyed character sprite (placeholder)
- `icon-food.svg` - Food/feeding action icon
- `icon-toy.svg` - Play/toy action icon
- `icon-bath.svg` - Cleaning/bath action icon
- `icon-sleep.svg` - Rest/sleep action icon

### Audio Assets (`sfx/`)
- `feed.mp3` - Feeding sound effect
- `play.mp3` - Playing sound effect
- `clean.mp3` - Cleaning sound effect
- `rest.mp3` - Resting sound effect
- `notification.mp3` - Alert sound effect
- `success.mp3` - Success feedback sound

## Technical Implementation

### State Management (Jotai Atoms)
- `petStatsAtom` - Pet's hunger, happiness, cleanliness, energy
- `gameFlagsAtom` - Game state including lastSavedAt, gameClock, soundEnabled
- `notificationsAtom` - Queue of game notifications
- `dayPhaseAtom` - Computed day/night phase based on game clock
- `currentMoodAtom` - Computed mood based on stats

### Components
- `SamoyedGameShell` - Main game container with auto-save and clock logic
- `GameLayout` - Responsive layout with day/night background transitions
- `GameHUD` - Top-left HUD with save button, sound toggle, and time display
- `NotificationPanel` - Top-right notification system
- `StatusPanel` - Pet stats display with progress bars
- `ActionPanel` - Action buttons (feed, play, clean, rest)
- `SceneViewport` - Scene selection and visualization

### Key Files
- `/src/state/samoyed-game/atoms.ts` - Jotai atom definitions
- `/src/state/samoyed-game/types.ts` - TypeScript interfaces and enums
- `/src/lib/sound-effects.ts` - Sound system utilities
- `/src/components/samoyed-game/` - Game UI components

## Usage

Navigate to `/samoyed-game` to play the game. The page uses dynamic imports with SSR disabled to ensure proper localStorage hydration.

## Future Enhancements

- Animated Samoyed sprites for different moods
- Enhanced sound effects (bark, eating sounds, etc.)
- Achievement system
- Multiple pets/save slots
- Mini-games for each scene
- Particle effects for interactions
- Progressive stat decay over time

## Asset Guidelines

- Use SVG format for scalability
- Maintain pastel, soft color palette
- Keep file sizes optimized
- Follow accessibility guidelines (proper alt text)
- MP3 format for audio (browser compatibility)
