const { Client, GatewayIntentBits, EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

let servers = {};

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'track') {
        const spotifyUserId = options.getString('userid');

        if (!servers[interaction.guild.id]) {
            servers[interaction.guild.id] = {};
        }

        const spotifyUsername = await getSpotifyUsername(spotifyUserId);

        servers[interaction.guild.id][spotifyUserId] = {
            channelId: interaction.channel.id,
            playlists: await getPlaylists(spotifyUserId)
        };

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Tracking Started')
            .setDescription(`Started tracking Spotify user **${spotifyUsername}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'tracked') {
        const trackedUsers = Object.keys(servers[interaction.guild.id] || {});

        if (trackedUsers.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('No Tracking')
                .setDescription('No users are currently being tracked in this server.');

            return interaction.reply({ embeds: [embed] });
        }

        const usernames = await Promise.all(trackedUsers.map(userId => getSpotifyUsername(userId)));

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Currently Tracked Users')
            .setDescription(usernames.map(username => `- ${username}`).join('\n'))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'help') {
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('How to Use the Spotify Tracker Bot')
            .setDescription('Here\'s how to use me:\n\n' +
                            '**1. Track a Spotify User:**\n' +
                            'Use `/track <spotify_user_id>` to start tracking a Spotify user.\n' +
                            'You can find a Spotify user\'s ID by going to their profile in the Spotify app, clicking the three dots, selecting "Share", and then "Copy Spotify URI". The ID is the part after `spotify:user:`.\n\n' +
                            '**2. List Tracked Users:**\n' +
                            'Use `/tracked` to see which users are being tracked.\n\n' +
                            '**3. Help Command:**\n' +
                            'Use `/help` to see this message again.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});

async function getPlaylists(userId) {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.items;
}

async function getSpotifyUsername(userId) {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.display_name || userId;
}

async function getSpotifyToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        grant_type: 'client_credentials'
    }), {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
}

// Check for new playlists every minute
cron.schedule('* * * * *', async () => {
    for (const serverId in servers) {
        for (const userId in servers[serverId]) {
            const trackedPlaylists = servers[serverId][userId].playlists;
            const currentPlaylists = await getPlaylists(userId);

            for (const currentPlaylist of currentPlaylists) {
                const trackedPlaylist = trackedPlaylists.find(pl => pl.id === currentPlaylist.id);

                // Send notification only for new playlists
                if (!trackedPlaylist) {
                    const channel = await client.channels.fetch(servers[serverId][userId].channelId);
                    const embed = new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle(`${currentPlaylist.owner.display_name} made a new playlist!`)
                        .setDescription(`**${currentPlaylist.name}**\n[Listen Here](https://open.spotify.com/playlist/${currentPlaylist.id})`)
                        .setTimestamp();

                    channel.send({ embeds: [embed] });
                }
            }

            // Update tracked playlists for future checks
            servers[serverId][userId].playlists = currentPlaylists;
        }
    }
});
