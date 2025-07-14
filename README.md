# Clonet Chatbot

A modern, floating chatbot interface built with React + Next.js, featuring a sleek dark theme similar to x.ai's Grok homepage.

## Features

- 🎨 **Modern Dark Theme**: Sleek, dark-themed interface with gradient accents
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎭 **Smooth Animations**: Elegant transitions and hover effects
- 💬 **Interactive Chat**: Simulated AI responses with typing indicators
- 🎯 **Floating Interface**: Fixed position chat button that expands into a full chat window
- ⚡ **Fast & Lightweight**: Built with Next.js 15 and optimized for performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **Font**: Inter (Google Fonts)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx           # Main page with demo content
│   └── globals.css        # Global styles and Tailwind imports
└── components/
    └── FloatingChatbot.tsx # Main chatbot component
```

## Chatbot Features

### Closed State
- Small, rounded floating button with chat icon
- Centered at the bottom of the screen
- Gradient background with hover effects
- Smooth scale animations

### Open State
- Full chat interface with header, messages, and input
- Responsive design that adapts to screen size
- Message history with timestamps
- Typing indicators for AI responses
- Auto-scroll to latest messages
- Focus management for input field

### Design Elements
- Dark theme with gray and blue/purple gradients
- Rounded corners and subtle borders
- Custom scrollbar styling
- Smooth transitions and animations
- Professional typography with Inter font

## Customization

The chatbot is designed to be easily customizable:

- **Colors**: Modify the gradient classes in the component
- **Responses**: Update the `responses` array in the `handleSubmit` function
- **Styling**: Adjust Tailwind classes for different visual themes
- **Behavior**: Modify the animation timing and interaction logic

## Future Enhancements

- [ ] Connect to real AI backend
- [ ] Add message persistence
- [ ] Implement user authentication
- [ ] Add file upload capabilities
- [ ] Support for rich media messages
- [ ] Voice input/output
- [ ] Multi-language support

## License

ISC License 