import { EmbedBuilder } from 'discord.js';
export class WelcomeService {
    client;
    dbService;
    // Standard Pomora Theme Colors
    COLOR_PRIMARY = '#FF6B35'; // Pomora Orange
    COLOR_SECONDARY = '#001F54'; // Dark Blue
    constructor(client, dbService) {
        this.client = client;
        this.dbService = dbService;
    }
    /**
     * Handles the Onboarding flow (Bot joining a guild).
     */
    async handleGuildCreate(channel) {
        if (!channel)
            return;
        const embed = new EmbedBuilder()
            .setColor(this.COLOR_PRIMARY)
            .setTitle('Hello! I’m Pomora.')
            .setDescription('Thank you for inviting me! I’m here to turn your server into a productivity powerhouse.')
            .setThumbnail(this.client.user?.displayAvatarURL() || '')
            .addFields({ name: '🚀 Quick Start', value: 'Use `/config` to set up your study and report channels.' }, { name: '👋 Welcomes', value: 'I can also greet new members! Set it up with `/config welcome`.' }, { name: '📈 Analytics', value: 'I track study time automatically when members join the study voice channel.' })
            .setImage('https://media.discordapp.net/attachments/1335968560371466330/1336043126838001714/pomora_banner.png?ex=67a8fc58&is=67a7aad8&hm=514309e37766b96101f313175c580665780a4305886476569724107106ac1800&=&format=webp&quality=lossless&width=960&height=320') // Placeholder banner, should use local asset if possible
            .setFooter({ text: 'Pomora Premium - Focus. Flow. Pomora.' });
        await channel.send({ embeds: [embed] }).catch(console.error);
    }
    /**
     * Handles a user joining the guild (Welcome Message).
     */
    async handleMemberJoin(member, isTest = false) {
        const guildId = member.guild.id;
        const config = await this.dbService.getGuildConfig(guildId);
        if (!config || !config.welcome_enabled || !config.welcome_channel_id) {
            if (isTest)
                return; // Silent fail for real events if not configured
            // If test, we might fallback or error, but handled in command
            return;
        }
        const channel = member.guild.channels.cache.get(config.welcome_channel_id);
        if (!channel)
            return;
        // Default Rich Embed
        const embed = new EmbedBuilder()
            .setColor(this.COLOR_PRIMARY)
            .setTitle(`Welcome, ${member.displayName}!`)
            .setDescription(`Welcome to **${member.guild.name}**! We are glad to have you here.`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields({ name: 'Member Count', value: `#${member.guild.memberCount}`, inline: true }, { name: 'Get Started', value: 'Join a Voice Channel to start your first study session!', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Pomora Premium' });
        // TODO: IF config.welcome_message exists, parse JSON and overlay data
        // For MVP, we use the hardcoded "StudyLion-esque" rich embed.
        await channel.send({ content: `Hey ${member.toString()}!`, embeds: [embed] });
    }
}
