# LinguaDrill

> A lightweight, mobile-friendly, internationalized English learning web application focused on high-frequency vocabulary, pattern drill training, and listening-first acquisition.

## Core Philosophy

LinguaDrill is built on the principle that effective language acquisition happens through:

1. **Listening First** - Understanding spoken language before speaking
2. **Pattern Recognition** - Mastering sentence structures through repetition
3. **Output-Driven Practice** - Speaking and producing language actively
4. **Spaced Repetition** - Reinforcing learning at optimal intervals

## Features

### Phase 1 MVP
- 📚 **High-Frequency Vocabulary** - Learn the most commonly used English words
- 🔄 **Pattern Drill** - Practice sentence patterns through template replacement
- 🔊 **Shadowing** - Listen and repeat for pronunciation practice
- 📊 **Progress Tracking** - Monitor your learning journey
- 🌐 **Internationalization** - Chinese/English interface support

### Future Roadmap
- AI-powered conversation engine
- Speech recognition scoring
- Personalized learning paths
- Social learning features

## Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No backend required - runs entirely in the browser

### Running Locally

```bash
# Clone the repository
git clone https://github.com/linguadrill/linguadrill.git

# Navigate to project directory
cd linguadrill

# Open in browser
# Option 1: Use a local server
python -m http.server 8000
# Then visit http://localhost:8000

# Option 2: Direct file access
open index.html
```

## Deployment

### Cloudflare Pages

1. **Sign up for Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Sign in with your Cloudflare account

2. **Connect GitHub Repository**
   - Click "Create a project"
   - Select your GitHub repository containing LinguaDrill

3. **Configure Build Settings**
   - Framework preset: `None`
   - Build command: `npm run build` (or leave empty for static sites)
   - Build output directory: `public`

4. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at `https://<your-project-name>.pages.dev`

### Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain (e.g., `linguadrill.yourdomain.com`)
4. Follow the DNS configuration instructions

## Project Structure

```
linguadrill/
├── docs/                 # Documentation
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page modules
│   ├── styles/           # CSS stylesheets
│   ├── data/             # Learning data (JSON)
│   └── utils/            # Utility functions
├── index.html            # Main entry point
├── README.md             # This file
└── LICENSE               # MIT License
```

## Internationalization

LinguaDrill supports multiple languages through i18n:

- English (default)
- Chinese (Simplified)

### Adding New Languages

1. Create a locale JSON file in `src/data/locales/`
2. Add translations for all UI strings
3. Update the language selector component

## Contributing

We welcome contributions from the community!

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Guidelines

- Follow the existing code style
- Write clear, concise commit messages
- Add comments where necessary
- Update documentation when adding features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Uses Web Speech API for pronunciation
- Inspired by language acquisition research and methodology

## Contact

For questions, feedback, or support:
- Open an issue on GitHub
- Join our community discussion

---

Happy learning! 🎯