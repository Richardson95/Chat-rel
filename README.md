# ChatApp - Modern Vue.js Chat Application

A beautiful, feature-rich chat application built with Vue 3, TypeScript, and Pinia. Features dark/light themes, premium subscriptions, group chats, and extensive customization options.

## Features

### Core Features
- **Real-time Messaging** - Send and receive messages with instant responses
- **Group Chats** - Create and manage group conversations (Premium feature)
- **Contact Management** - Add, organize, and favorite your contacts
- **Media Gallery** - View and manage all shared photos and files
- **Search & Filter** - Quickly find conversations and contacts
- **Message Actions** - Edit, delete, reply, and react to messages
- **Typing Indicators** - See when someone is typing
- **Online Status** - Real-time presence indicators

### Premium Features
- Access to exclusive premium groups
- Custom themes and wallpapers
- Unlimited file storage (up to 2GB per file)
- Create up to 50 group chats
- Custom emoji reactions
- Pin unlimited conversations
- Enhanced privacy features
- Priority support

### Themes & Customization
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Custom Color Palette** - Pink (#FF6B9D), Black (#000000), and Light Green (#98FFB3)
- **Font Size Options** - Small, Medium, Large
- **Chat Wallpapers** - Multiple wallpaper options
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

## Demo Data

The application comes with extensive dummy data including:
- 50+ pre-populated contacts
- 35+ private conversations with message history
- 5 premium group chats
- 1000+ messages across all conversations
- Media files and shared images
- Notification history

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe code
- **Pinia** - State management
- **Vue Router** - Navigation
- **Vite** - Build tool
- **CSS Custom Properties** - Theme system

## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```sh
npm install
```

2. Run development server:
```sh
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

### Build for Production

```sh
npm run build
```

### Type Checking

```sh
npm run type-check
```

### Lint Code

```sh
npm run lint
```

## Color Scheme

### Light Theme
- Primary Background: #FFFFFF
- Secondary Background: #F5F5F5
- Pink Accent: #FF6B9D
- Green Accent: #98FFB3
- Text: #000000

### Dark Theme
- Primary Background: #0A0A0A
- Secondary Background: #1A1A1A
- Pink Accent: #FF6B9D
- Green Accent: #98FFB3
- Text: #FFFFFF

## Project Structure

```
chat-app/
├── src/
│   ├── assets/          # Styles and static assets
│   ├── components/      # Reusable components
│   ├── data/           # Dummy data
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript types
│   ├── views/          # Page components
│   └── router/         # Vue Router config
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

---

**Enjoy ChatApp!** Built with Vue 3 + TypeScript
