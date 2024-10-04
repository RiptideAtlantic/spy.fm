# spy.fm, the Spotify playlist tracker bot

## Prerequisites

- Node.js
- npm
- Git

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/RiptideAtlantic/spy.fm
    cd spy.fm
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Create a Discord bot and Spotify app**
- **Creating a Spotify app**
     - Go to https://developer.spotify.com/dashboard
     - Hit "Create app"
     - Add a name and description (this doesn't matter)
     - Click "save"
     - Copy your client ID and client secret.
- **Creating a Discord bot**
   - Go to https://discord.com/developers/applications
   - Click the "New Application" button in the top right corner.
   - Give your application a name and click "Create".
   - In the left sidebar, select the "Bot" tab.
   - Click the "Add Bot" button and confirm by clicking "Yes, do it!".
   - Under the "Bot" section, you will find the "Token" section. Click "Copy" to copy your bot token. Follow the instructions in the next section to add it to your `.env` file so the bot can run your code.
   - Under "Privileged Gateway Intents" turn on "MESSAGE CONTENT INTENT"
   - Navigate to the "OAuth2" tab in the left sidebar.
   - Under "Scopes," select "bot."
   - Under "Bot Permissions," select "Send Messages", "Embed Links", and "Use Slash Commands"
   - Select "Integration Type" as "Guild Install"
   - Copy the generated URL from the "Scopes" section
   - Paste it into your browser.
   - Select the server you want to add the bot to.

5. **Configure .env variables**:
   - Create a `.env` file in the root directory of the project. This is where you store your tokens when self-hosting.
   - Add the following .env variables (the ones you copied earlier):
     ```
     DISCORD_TOKEN=<your-discord-bot-token>
     SPOTIFY_CLIENT_ID=<your-spotify-client-id>
     SPOTIFY_CLIENT_SECRET=<your-spotify-client-secret>
     ```

6. **Deploy commands** (only needed once, so we can register / commands with Discord):
    ```bash
    node deploy-commands.js
    ```

7. **Run the bot!**:
    ```bash
    node bot.js
    ```

## Commands

- `/track <spotify_user_id>`: Track a Spotify user.
- `/tracked`: List tracked Spotify users.
- `/help`: Show help information.

## Contributing

Pull requests are not welcome at this time. However, feel free to fork and make your own changes there! I'd love to see them :D
Issues are also welcome.

## License

This project is licensed under the MIT License.

## Official Host

I have an official host of the bot here: https://discord.com/oauth2/authorize?client_id=1288989749092159520&permissions=2147502080&integration_type=0&scope=bot

# This project is unfinished and still requires polishing. 
