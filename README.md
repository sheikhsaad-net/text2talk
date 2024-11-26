# Text-2-Talk and AI 3D Lip Sync Application

This application converts text into audio using Google's Cloud Text-to-Speech API and synchronizes a 3D model's lips to the generated speech. The application uses Three.js for 3D rendering, Blender for 3D model creation, and Node.js for backend functionality.

## Features

- Convert text to audio via Google Cloud's Text-to-Speech API.
- AI-driven 3D model lip synchronization based on generated audio.
- Real-time interaction with the model through a simple web interface.

## Prerequisites

- Node.js installed (version >= 14.0.0).
- Google Cloud account with access to the Text-to-Speech API.
- A Blender-created 3D model for lip synchronization.

## Installation

### 1. Clone the repository

First, clone the repository to your local machine:

git clone [https://github.com/sheikhsaad-net/text2talk.git](https://github.com/sheikhsaad-net/text2talk.git) `cd text2talk`

### 2. Install dependencies

Run the following command to install the required dependencies: `npm install`


### 3. Set up Google Cloud API credentials

To authenticate with Google Cloud's Text-to-Speech API, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or use an existing one.
3. Enable the **Text-to-Speech API**.
4. Generate an API key and service account credentials:
   - Navigate to **IAM & Admin** > **Service Accounts**.
   - Create a service account and download the JSON credentials file.
5. Place the downloaded JSON credentials file in the `auth` folder in the `public` directory of the project.
6. In the `auth` folder, open the `credentials.json` file and update the following fields with the data from your Google Cloud service account: { "private_key_id": "", "private_key": "", "client_email": "", "client_id": "" }

### 4. Start the application

To run the application locally, use the following command: `npm run dev`

This will start both the backend server and the frontend application.

### 5. Send text for speech synthesis

Once the server is running, you can send text to the backend to generate audio. Use the following URL to send a POST request with the text you want to convert to speech:

POST http://localhost:3000/speak

Send a JSON object with the text you want to convert:

{ "text": "here you can type" }







