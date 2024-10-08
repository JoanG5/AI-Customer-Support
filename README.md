# 🛍️ AI Support Chat Bot

Welcome to the AI Support Chat Bot project! This is a Next.js application designed to provide customer support using AI. The bot assists customers with their inquiries about items, deliveries, and other common issues on an e-commerce platform.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 📖 About the Project

The AI Support Chat Bot project aims to enhance customer service experiences by automating responses to frequently asked questions. It leverages OpenAI's GPT model to provide natural, human-like interactions, making customer support more efficient and scalable. We decided to deploy on aws ec2 for maximum efficiency and scalability. 

## 🛠️ Built With

- **[Next.js](https://nextjs.org/)** - A React framework for building fast web applications.
- **[OpenAI GPT](https://openai.com/)** - The AI model used for generating responses.
- **[Material-UI](https://mui.com/)** - A popular React UI framework for building intuitive interfaces.
- **[Firebase](https://firebase.google.com/)** - Used for real-time database and hosting.
- **[Framer Motion](https://www.framer.com/motion/)** - A library to add animations to the chat interface.

## 🚀 Getting Started

### Prerequisites

To run this project locally, you'll need:

- Node.js and npm installed
- A Firebase project set up
- OpenAI API key

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ai-support-chat-bot.git
    cd ai-support-chat-bot
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env.local` file:**

   Add your OpenAI API key and Firebase configuration:

    ```env
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📚 Usage

To use the AI Support Chat Bot, simply type a message into the chat input and press enter or click the send button. The bot will respond using AI-generated responses tailored to common customer service inquiries.

## 🔌 API Endpoints

- **POST `/api/uploadreview`**: Endpoint for uploading customer reviews to the database.
- **GET `/api/reviews`**: Fetches all reviews from the database.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements, features, or bug fixes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#   A I - C u s t o m e r - S u p p o r t 
 
 
