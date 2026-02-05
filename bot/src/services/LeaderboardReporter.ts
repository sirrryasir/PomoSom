import { Client, EmbedBuilder, TextChannel, AttachmentBuilder } from 'discord.js';
import { DatabaseService } from './DatabaseService.js';
import { ImageService } from './ImageService.js';

// Initialize services
export class LeaderboardReporter {
    private client: Client;
    private dbService: DatabaseService;
    private imageService: ImageService;

    constructor(client: Client, dbService: DatabaseService) {
        this.client = client;
        this.dbService = dbService;
        this.imageService = new ImageService();

        // Check every minute to be precise
        setInterval(() => this.checkAndSendReports(), 60 * 1000);
    }

    private async checkAndSendReports() {
        const now = new Date();
        const utcHour = now.getUTCHours();
        const utcMin = now.getUTCMinutes();
        const dayOfWeek = now.getUTCDay(); // 0=Sun, 5=Fri
        const date = now.getUTCDate();

        // 12:00 AM EAT is 21:00 UTC
        const TARGET_HOUR_UTC = 21;

        // Daily Report
        if (utcHour === TARGET_HOUR_UTC && utcMin === 0) {
            console.log('[LeaderboardReporter] 🕒 Triggering Daily Reports...');
            await this.broadcastReports('daily');
            await this.dbService.resetStats('daily');
        }

        // Weekly Report (Friday Night)
        if (dayOfWeek === 5 && utcHour === TARGET_HOUR_UTC && utcMin === 0) {
            console.log('[LeaderboardReporter] 🕒 Triggering Weekly Reports...');
            await this.broadcastReports('weekly');
            await this.dbService.resetStats('weekly');
        }

        // Monthly Report (1st of Month)
        if (date === 1 && utcHour === TARGET_HOUR_UTC && utcMin === 0) {
            console.log('[LeaderboardReporter] 🕒 Triggering Monthly Reports...');
            await this.broadcastReports('monthly');
            await this.dbService.resetStats('monthly');
        }
    }

    public async broadcastReports(timeframe: 'daily' | 'weekly' | 'monthly') {
        const guilds = this.client.guilds.cache;
        for (const [guildId] of guilds) {
            await this.sendGuildReport(guildId, timeframe);
        }
    }

    public async sendGuildReport(guildId: string, timeframe: 'daily' | 'weekly' | 'monthly', targetChannel?: TextChannel, authorId?: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return;

        try {
            let leaderboard = await this.dbService.getGuildLeaderboard(guildId, timeframe);
            const isManual = !!targetChannel;
            if (leaderboard.length === 0 && !isManual) return;

            // Fetch guild config to find the report channel
            const config = await this.dbService.getGuildConfig(guildId);
            const configChannelId = config?.report_channel_id;

            let channel: TextChannel | null = targetChannel || null;

            if (!channel && configChannelId) {
                channel = (guild.channels.cache.get(configChannelId) || await guild.channels.fetch(configChannelId)) as TextChannel;
            }

            if (!channel) {
                channel = (guild.systemChannel ||
                    guild.channels.cache.find(c => c.type === 0 && (c.name.includes('pomo') || c.name.includes('bot'))) ||
                    guild.channels.cache.find(c => c.type === 0)) as TextChannel;
            }

            if (!channel) return;

            if (leaderboard.length === 0) {
                console.log(`[LeaderboardReporter] ℹ️ No data found for guild ${guildId} (${timeframe})`);
                if (isManual) {
                    await targetChannel.send("No study data available for this timeframe yet.");
                }
                return;
            }

            const imageBuffer = await this.imageService.generateLeaderboardCard(
                guild.name,
                timeframe === 'daily' ? 'Daily' : timeframe === 'weekly' ? 'Weekly' : timeframe === 'monthly' ? 'Monthly' : 'All Time',
                leaderboard,
                this.client
            );

            const attachment = new AttachmentBuilder(imageBuffer, { name: 'leaderboard.png' });

            await channel.send({
                content: `**${timeframe.toUpperCase()} REPORT** for **${guild.name}**`,
                files: [attachment]
            });
            console.log(`[LeaderboardReporter] 📤 Sent ${timeframe} report to ${guild.name}`);
        } catch (err) {
            console.error(`[LeaderboardReporter] ❌ Failed to send report to guild ${guildId}:`, err);
            if (targetChannel) {
                await targetChannel.send("Error generating visual report.");
            }
        }
    }
}
