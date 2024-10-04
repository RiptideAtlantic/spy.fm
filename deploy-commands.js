require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'track',
        description: 'Track a Spotify user by their ID',
        options: [
            {
                name: 'userid',
                type: 3, // STRING
                description: 'The Spotify user ID to track',
                required: true,
            },
        ],
    },
    {
        name: 'tracked',
        description: 'List tracked Spotify users',
    },
    {
        name: 'help',
        description: 'Show help information',
    },
];

async function deployCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

deployCommands();
