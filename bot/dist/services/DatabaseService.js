import postgres from 'postgres';
import { config } from 'dotenv';
config();
export class DatabaseService {
    sql;
    dbUrl;
    constructor() {
        this.dbUrl = process.env.DATABASE_URL || '';
        if (!this.dbUrl) {
            console.warn('[DatabaseService] ⚠️ DATABASE_URL missing. Operations will count towards memory only.');
            this.sql = null;
        }
        else {
            // StudyLion-like connection pool settings
            this.sql = postgres(this.dbUrl, {
                ssl: 'require',
                max: 10, // Connection pool size
                idle_timeout: 20, // Close idle connections after 20s
                connect_timeout: 10, // Fail fast if DB is down
            });
            console.log(`[DatabaseService] Connected to Neon Postgres.`);
        }
    }
    isConnected() {
        return !!this.sql;
    }
    /**
     * Logs a completed session.
     * Upserts into guild_stats to keep leaderboards real-time.
     */
    async logSession(userId, guildId, durationMinutes, sessionType = 'focus') {
        if (!this.sql)
            return;
        try {
            // 1. Immutable Log
            await this.sql `
                INSERT INTO session_logs (user_id, guild_id, duration, session_type, is_web)
                VALUES (${userId}, ${guildId}, ${durationMinutes}, ${sessionType}, false)
            `;
            // 2. Aggregated Stats (Upsert)
            if (guildId) {
                await this.sql `
                    INSERT INTO guild_stats (guild_id, user_id, daily_time, weekly_time, monthly_time, total_time, updated_at)
                    VALUES (${guildId}, ${userId}, ${durationMinutes}, ${durationMinutes}, ${durationMinutes}, ${durationMinutes}, NOW())
                    ON CONFLICT (guild_id, user_id)
                    DO UPDATE SET
                        daily_time = guild_stats.daily_time + ${durationMinutes},
                        weekly_time = guild_stats.weekly_time + ${durationMinutes},
                        monthly_time = guild_stats.monthly_time + ${durationMinutes},
                        total_time = guild_stats.total_time + ${durationMinutes},
                        updated_at = NOW()
                `;
            }
        }
        catch (err) {
            console.error('[DatabaseService] ❌ Failed to log session:', err);
        }
    }
    /**
     * Fetches top 10 users for the leaderboard.
     */
    async getGuildLeaderboard(guildId, timeframe = 'total') {
        if (!this.sql)
            return [];
        try {
            const column = timeframe === 'daily' ? this.sql `daily_time` :
                timeframe === 'weekly' ? this.sql `weekly_time` :
                    timeframe === 'monthly' ? this.sql `monthly_time` :
                        this.sql `total_time`;
            const data = await this.sql `
                SELECT * FROM guild_stats
                WHERE guild_id = ${guildId}
                ORDER BY ${column} DESC
                LIMIT 10
            `;
            return data;
        }
        catch (error) {
            console.error('[DatabaseService] ❌ Error fetching leaderboard:', error);
            return [];
        }
    }
    /**
     * Retrieves guild configuration.
     */
    async getGuildConfig(guildId) {
        if (!this.sql)
            return null;
        try {
            const [data] = await this.sql `
                SELECT * FROM guild_configs
                WHERE guild_id = ${guildId}
                LIMIT 1
            `;
            return data || null;
        }
        catch (error) {
            console.error(`[DatabaseService] ❌ Error fetching config for ${guildId}:`, error);
            return null;
        }
    }
    /**
     * Updates guild configuration (Channels, etc).
     */
    async updateGuildConfig(guildId, updates) {
        if (!this.sql)
            return;
        try {
            const studyChannelId = updates.study_channel_id;
            const reportChannelId = updates.report_channel_id;
            // Use UPSERT (Insert ... On Conflict Do Update) for atomicity and checking existence
            await this.sql `
                INSERT INTO guild_configs (
                    guild_id, study_channel_id, report_channel_id,
                    welcome_channel_id, welcome_message, welcome_enabled, updated_at
                )
                VALUES (
                    ${guildId},
                    ${updates.study_channel_id ?? null},
                    ${updates.report_channel_id ?? null},
                    ${updates.welcome_channel_id ?? null},
                    ${updates.welcome_message ?? null},
                    ${updates.welcome_enabled ?? false},
                    NOW()
                )
                ON CONFLICT (guild_id)
                DO UPDATE SET ${this.sql(updates)}, updated_at = NOW()
            `;
        }
        catch (error) {
            console.error(`[DatabaseService] ❌ Error updating config for ${guildId}:`, error);
            throw error;
        }
    }
    /**
     * Aggregates a user's total study time across all servers.
     */
    async getUserProfile(userId) {
        if (!this.sql)
            return null;
        try {
            const data = await this.sql `
                SELECT daily_time, weekly_time, monthly_time, total_time
                FROM guild_stats
                WHERE user_id = ${userId}
            `;
            if (!data || data.length === 0)
                return null;
            return data.reduce((acc, curr) => ({
                daily_time: acc.daily_time + curr.daily_time,
                weekly_time: acc.weekly_time + curr.weekly_time,
                monthly_time: acc.monthly_time + curr.monthly_time,
                total_time: acc.total_time + curr.total_time
            }), { daily_time: 0, weekly_time: 0, monthly_time: 0, total_time: 0 });
        }
        catch (error) {
            console.error(`[DatabaseService] ❌ Error fetching profile for ${userId}:`, error);
            return null;
        }
    }
    /**
     * Resets stats for a specific timeframe.
     * This is used after generation reports to start the new period fresh.
     */
    async resetStats(timeframe) {
        if (!this.sql)
            return;
        try {
            if (timeframe === 'daily') {
                await this.sql `UPDATE guild_stats SET daily_time = 0`;
            }
            else if (timeframe === 'weekly') {
                await this.sql `UPDATE guild_stats SET weekly_time = 0`;
            }
            else if (timeframe === 'monthly') {
                await this.sql `UPDATE guild_stats SET monthly_time = 0`;
            }
            console.log(`[DatabaseService] 🔄 Reset ${timeframe} stats.`);
        }
        catch (error) {
            console.error(`[DatabaseService] ❌ Error resetting ${timeframe} stats:`, error);
        }
    }
    // --- Active Message Management (for persistent status cards) ---
    async setActiveMessage(channelId, guildId, messageId) {
        if (!this.sql)
            return;
        try {
            await this.sql `
                INSERT INTO active_channel_messages (channel_id, guild_id, message_id, updated_at)
                VALUES (${channelId}, ${guildId}, ${messageId}, NOW())
                ON CONFLICT (channel_id)
                DO UPDATE SET message_id = ${messageId}, updated_at = NOW()
            `;
        }
        catch (error) {
            console.error(`[DatabaseService] Error setting active message:`, error);
        }
    }
    async getActiveMessage(channelId) {
        if (!this.sql)
            return null;
        try {
            const [data] = await this.sql `
                SELECT message_id FROM active_channel_messages
                WHERE channel_id = ${channelId}
            `;
            return data?.message_id || null;
        }
        catch (error) {
            return null;
        }
    }
    async deleteActiveMessage(channelId) {
        if (!this.sql)
            return;
        try {
            await this.sql `DELETE FROM active_channel_messages WHERE channel_id = ${channelId}`;
        }
        catch (error) { /* Ignore */ }
    }
}
