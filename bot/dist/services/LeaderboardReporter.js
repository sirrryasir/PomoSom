import { AttachmentBuilder } from 'discord.js';
import { ImageService } from './ImageService.js';
// Initialize services
export class LeaderboardReporter {
    client;
    dbService;
    imageService;
    constructor(client, dbService) {
        this.client = client;
        this.dbService = dbService;
        this.imageService = new ImageService();
        setInterval(() => this.checkAndSendReports(), 60 * 60 * 1000);
    }
    async checkAndSendReports() {
        const now = new Date();
        const hour = now.getHours();
        if (hour === 20) {
            await this.broadcastReports('daily');
        }
        if (now.getDay() === 5 && hour === 20) {
            await this.broadcastReports('weekly');
        }
        if (now.getDate() === 1 && hour === 20) {
            await this.broadcastReports('monthly');
        }
    }
    async broadcastReports(timeframe) {
        const guilds = this.client.guilds.cache;
        for (const [guildId] of guilds) {
            await this.sendGuildReport(guildId, timeframe);
        }
    }
    async sendGuildReport(guildId, timeframe, targetChannel, authorId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild)
            return;
        try {
            let leaderboard = await this.dbService.getGuildLeaderboard(guildId, timeframe);
            const isManual = !!targetChannel;
            if (leaderboard.length === 0 && !isManual)
                return;
            const channel = targetChannel || (guild.systemChannel ||
                guild.channels.cache.find(c => c.type === 0 && (c.name.includes('pomo') || c.name.includes('bot'))) ||
                guild.channels.cache.find(c => c.type === 0));
            if (!channel)
                return;
            if (leaderboard.length === 0 && isManual) {
                const timeframeKey = `${timeframe.toLowerCase()}_time`;
                leaderboard = [
                    { user_id: authorId || guild.ownerId, [timeframeKey]: 750 },
                    { user_id: guild.ownerId, [timeframeKey]: 492 },
                    { user_id: this.client.user?.id, [timeframeKey]: 240 }
                ];
            }
            if (leaderboard.length === 0)
                return;
            const imageBuffer = await this.imageService.generateLeaderboardCard(guild.name, timeframe === 'daily' ? 'Daily' : timeframe === 'weekly' ? 'Weekly' : 'Monthly', leaderboard, this.client);
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'leaderboard.png' });
            await channel.send({
                content: `**${timeframe.toUpperCase()} REPORT** for **${guild.name}**`,
                files: [attachment]
            });
        }
        catch (err) {
            console.error(`Failed to send report to guild ${guildId}:`, err);
            if (targetChannel) {
                await targetChannel.send("Error generating visual report.");
            }
        }
    }
}
