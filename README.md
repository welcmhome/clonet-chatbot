# Clonet Chatbot

A modern, floating chatbot interface built with React + Next.js, featuring a sleek dark theme similar to x.ai's Grok homepage. Now integrated with OpenRouter's DeepSeek v2 model for real AI conversations.

## Features

- 🎨 **Modern Dark Theme**: Sleek, dark-themed interface with gradient accents
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎭 **Smooth Animations**: Elegant transitions and hover effects
- 💬 **Real AI Chat**: Powered by OpenRouter's DeepSeek v2 model
- 🎯 **Floating Interface**: Fixed position chat button that expands into a full chat window
- ⚡ **Fast & Lightweight**: Built with Next.js 15 and optimized for performance
- 🔄 **Message History**: View and manage conversation history
- ⏱️ **Real-time Responses**: Live typing indicators and timestamps

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: DeepSeek v2 via OpenRouter API
- **Icons**: Heroicons (SVG)
- **Font**: Inter (Google Fonts)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/welcmhome/clonet-chatbot.git
   cd clonet-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your OpenRouter API key**:
   - Create a `.env.local` file in the root directory
   - Add your OpenRouter API key:
     ```
     OPENROUTER_API_KEY=your_api_key_here
     ```
   - Get your API key from [OpenRouter](https://openrouter.ai/)

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Start a conversation**: Click the chat icon or type in the input bar
2. **Send messages**: Type your message and press Enter or click the send button
3. **View chat history**: The chat window shows your conversation history
4. **Close chat**: Click the X button to minimize the chat window

## API Configuration

The chatbot uses OpenRouter's API with the DeepSeek v2 model:

- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `deepseek-chat`
- **Authentication**: Bearer token via `OPENROUTER_API_KEY`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenRouter API integration
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles and Tailwind imports
└── components/
    └── FloatingChatbot.tsx       # Main chatbot component with chat interface
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

## Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Future Enhancements

- [ ] Add message persistence (database)
- [ ] Implement user authentication
- [ ] Add file upload capabilities
- [ ] Support for rich media messages
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Conversation export
- [ ] Custom AI model selection

## License

ISC License 