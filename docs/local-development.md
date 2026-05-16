# LinguaDrill Local Development Guide

This guide will help you set up and run LinguaDrill locally for development and testing.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Node.js (optional, for npm serve)
- Python (optional, for python http.server)

## Quick Start

### Option 1: Python HTTP Server (Recommended)

```bash
# Navigate to project directory
cd linguadrill

# Start Python HTTP server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Option 2: Node.js serve

```bash
# Install serve globally
npm install -g serve

# Navigate to project directory
cd linguadrill

# Start server
serve -l 8000

# Open browser to http://localhost:8000
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Open the linguadrill folder in VS Code
3. Right-click on `index.html`
4. Select "Open with Live Server"

## VS Code Setup

### Recommended Extensions

Install these extensions for best development experience:

1. **Live Server** - Local development server with hot reload
2. **Prettier** - Code formatter
3. **ESLint** - JavaScript linting
4. **HTML CSS Support** - CSS IntelliSense

### Project Structure

```
linguadrill/
├── index.html           # Main entry point
├── src/
│   ├── utils/          # Utility modules
│   │   ├── i18n.js
│   │   ├── speech.js
│   │   ├── storage.js
│   │   ├── dayLoader.js
│   │   └── patternEngine.js
│   ├── components/    # UI components
│   │   └── navigation.js
│   ├── pages/          # Page modules
│   │   ├── home.js
│   │   ├── words.js
│   │   ├── patterns.js
│   │   ├── shadowing.js
│   │   └── progress.js
│   ├── styles/         # CSS stylesheets
│   └── data/           # JSON data files
│       └── day1.json
└── docs/               # Documentation
```

## Mobile Testing

### Using Physical Device

1. Ensure your computer and phone are on the same WiFi network
2. Find your computer's IP address:
   - Windows: `ipconfig` in Command Prompt
   - Mac/Linux: `ifconfig` in Terminal
3. Start the development server
4. On your phone, open: `http://<your-ip>:8000`

### Using Browser DevTools

1. Open Chrome DevTools (F12)
2. Click the "Toggle device toolbar" icon (or Ctrl+Shift+M)
3. Select a mobile device from the dropdown
4. Refresh the page

## Troubleshooting

### JSON Loading Fails

**Problem**: "Failed to load day data" error

**Solutions**:

1. **Use HTTP Server**
   - JSON files cannot be loaded via `file://` protocol
   - Always use HTTP server (python or npm serve)
   - Browser security blocks fetch() from file://

2. **Check CORS**
   - Ensure server is running on localhost
   - Verify no CORS errors in console

3. **Verify File Path**
   - Check that `src/data/day1.json` exists
   - File path is case-sensitive

### Speech API Not Working

**Problem**: No audio playback

**Solutions**:

1. **Browser Support**
   - SpeechSynthesis is supported in:
     - Chrome (desktop & mobile)
     - Edge
     - Safari
     - Firefox (modern versions)
   - Not supported in IE

2. **User Interaction Required**
   - Speech API only works after user interaction
   - Click a button before speech playback
   - This is browser security policy

3. **Voice Availability**
   - Different browsers have different voices
   - English voices may not be installed
   - Check `chrome://settings/search#speech` in Chrome

4. **HTTPS Requirement**
   - Some browsers require HTTPS for advanced speech features
   - Use localhost for development
   - Cloudflare Pages provides HTTPS for deployment

### LocalStorage Issues

**Problem**: Progress not saving

**Solutions**:

1. **Check Browser Settings**
   - Ensure cookies/local storage is enabled
   - Check browser privacy settings

2. **Storage Quota**
   - LocalStorage has 5MB limit
   - Clear old data if needed

3. **Private Browsing**
   - LocalStorage may not work in private/incognito mode

## Development Workflow

### 1. Start Development Server

```bash
# Terminal 1
cd linguadrill
python -m http.server 8000
```

### 2. Make Changes

Edit files in your text editor

### 3. View Changes

Refresh the browser (Ctrl+R or F5)

### 4. Debug Issues

Open browser DevTools (F12) → Console tab

## Testing Checklist

- [ ] Home page loads correctly
- [ ] Navigation works (all 5 pages)
- [ ] Words page displays vocabulary
- [ ] Click word plays pronunciation
- [ ] Speed slider adjusts speech rate
- [ ] Patterns page generates sentences
- [ ] Shadowing page plays audio
- [ ] "Your Turn" indicator appears
- [ ] Progress page shows statistics
- [ ] Language toggle works (zh/en)
- [ ] Mobile layout is responsive

## Production Build

For Cloudflare Pages deployment:

1. Ensure all files are in place
2. No build step required (pure frontend)
3. Push to GitHub
4. Connect to Cloudflare Pages
5. Deploy

## Useful Links

- [MDN: SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Support

For issues:
1. Check browser console for errors
2. Verify all files are loaded correctly
3. Try clearing browser cache
4. Use incognito mode to test