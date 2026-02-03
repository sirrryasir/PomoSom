export interface GuildConfig {
    guild_id: string;
    study_channel_id: string | null;
    report_channel_id: string | null;
    welcome_channel_id: string | null;
    welcome_message: any | null; // JSONB
    welcome_enabled: boolean;
    updated_at: Date;
}

export interface GuildStats {
    id: number;
    guild_id: string;
    user_id: string;
    daily_time: number;
    weekly_time: number;
    monthly_time: number;
    total_time: number;
    updated_at: Date;
}

export interface SessionLog {
    id: number;
    user_id: string;
    guild_id: string | null;
    duration: number;
    session_type: 'focus' | 'break';
    is_web: boolean;
    created_at: Date;
}

export interface ActiveChannelMessage {
    channel_id: string;
    guild_id: string;
    message_id: string;
    updated_at: Date;
}
