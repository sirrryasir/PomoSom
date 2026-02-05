import { REST, Routes, Collection, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
export class CommandRegistry {
    commands = new Collection();
    client;
    dbService;
    welcomeService;
    leaderboardReporter;
    timerService;
    constructor(client, dbService, welcomeService, leaderboardReporter, timerService) {
        this.client = client;
        this.dbService = dbService;
        this.welcomeService = welcomeService;
        this.leaderboardReporter = leaderboardReporter;
        this.timerService = timerService;
        this.registerCommandsInternal();
    }
    registerCommandsInternal() {
        // --- /help ---
        const helpCommand = {
            data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('Discover Pomora features and commands'),
            execute: async (interaction) => {
                const embed = new EmbedBuilder()
                    .setColor('#FF6B35')
                    .setTitle('Pomora Bot Help')
                    .setDescription('Master your focus with these commands:')
                    .addFields({ name: '📊 Statistics', value: '`/stats` - View your personal study data\n`/leaderboard` - Server rankings', inline: true }, { name: '⏱️ Session', value: '`/status` - Check active session\nJoin a VC to start studying!', inline: true }, { name: '⚙️ Configuration', value: '`/config` - Server settings (Admin only)', inline: false })
                    .setFooter({ text: 'Pomora Premium - Focus. Flow. Pomora.' });
                await interaction.reply({ embeds: [embed] });
            }
        };
        // --- /stats ---
        const statsCommand = {
            data: new SlashCommandBuilder()
                .setName('stats')
                .setDescription('View your personal study statistics'),
            execute: async (interaction) => {
                await interaction.deferReply({ ephemeral: true });
                const profile = await this.dbService.getUserProfile(interaction.user.id);
                if (!profile) {
                    await interaction.editReply({ content: "You haven't started studying yet! Join a voice channel to log your first session." });
                    return;
                }
                const totalHours = (profile.total_time / 60).toFixed(1);
                const weekHours = (profile.weekly_time / 60).toFixed(1);
                const dailyHours = (profile.daily_time / 60).toFixed(1);
                const embed = new EmbedBuilder()
                    .setColor('#FF6B35')
                    .setTitle(`${interaction.user.username}'s Study Stats`)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .addFields({ name: 'Today', value: `${dailyHours} hours`, inline: true }, { name: 'This Week', value: `${weekHours} hours`, inline: true }, { name: 'Total', value: `${totalHours} hours`, inline: true });
                await interaction.editReply({ embeds: [embed] });
            }
        };
        // --- /leaderboard ---
        const lbCommand = {
            data: new SlashCommandBuilder()
                .setName('leaderboard')
                .setDescription('View server rankings')
                .addStringOption(option => option.setName('timeframe')
                .setDescription('Time period')
                .setRequired(false)
                .addChoices({ name: 'Daily', value: 'daily' }, { name: 'Weekly', value: 'weekly' }, { name: 'Monthly', value: 'monthly' }, { name: 'All Time', value: 'total' })),
            execute: async (interaction) => {
                await interaction.deferReply({ ephemeral: false }); // Public leaderboard
                const timeframe = interaction.options.getString('timeframe') || 'weekly';
                await interaction.editReply({ content: `Fetching ${timeframe} leaderboard...` });
                await this.leaderboardReporter.sendGuildReport(interaction.guildId, timeframe, interaction.channel, interaction.user.id);
            }
        };
        // --- /status ---
        const statusCommand = {
            data: new SlashCommandBuilder()
                .setName('status')
                .setDescription('Check current session status'),
            execute: async (interaction) => {
                await interaction.deferReply({ ephemeral: true });
                const session = this.timerService.getUserSession(interaction.user.id);
                if (!session) {
                    await interaction.editReply({ content: "You are not in an active study session." });
                    return;
                }
                const mins = Math.floor(session.remaining / 60);
                const secs = session.remaining % 60;
                const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                const embed = new EmbedBuilder()
                    .setColor(session.type === 'focus' ? '#FF6B35' : '#43B581')
                    .setTitle(`Current Session: ${session.type.toUpperCase()}`)
                    .setDescription(`**Time Remaining:** ${timeStr}\n**Participants:** ${session.participants.size}`);
                await interaction.editReply({ embeds: [embed] });
            }
        };
        // --- /config (Admin) ---
        const configCommand = {
            data: new SlashCommandBuilder()
                .setName('config')
                .setDescription('Configure Pomora settings')
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addSubcommandGroup(group => group.setName('welcome')
                .setDescription('Configure welcome messages')
                .addSubcommand(sub => sub.setName('channel')
                .setDescription('Set the welcome channel')
                .addChannelOption(opt => opt.setName('target').setDescription('The channel').setRequired(true)))
                .addSubcommand(sub => sub.setName('test')
                .setDescription('Test the welcome message'))
                .addSubcommand(sub => sub.setName('reset')
                .setDescription('Reset to default welcome settings')))
                .addSubcommandGroup(group => group.setName('channels')
                .setDescription('Configure functional channels')
                .addSubcommand(sub => sub.setName('study')
                .setDescription('Set the voice channel for tracking')
                .addChannelOption(opt => opt.setName('target').setDescription('Voice Channel').setRequired(true)))
                .addSubcommand(sub => sub.setName('reports')
                .setDescription('Set the text channel for reports')
                .addChannelOption(opt => opt.setName('target').setDescription('Text Channel').setRequired(true)))),
            execute: async (interaction) => {
                await interaction.deferReply({ ephemeral: true });
                // Determine Subcommand
                const group = interaction.options.getSubcommandGroup();
                const subcommand = interaction.options.getSubcommand();
                if (group === 'channels') {
                    const channel = interaction.options.getChannel('target');
                    if (subcommand === 'study') {
                        if (channel?.type !== 2) { // GuildVoice
                            await interaction.editReply({ content: '❌ Please select a Voice Channel.' });
                            return;
                        }
                        await this.dbService.updateGuildConfig(interaction.guildId, { study_channel_id: channel.id });
                        await interaction.editReply({ content: `✅ Study channel updated to <#${channel.id}>` });
                        return;
                    }
                    if (subcommand === 'reports') {
                        if (channel?.type !== 0) { // GuildText
                            await interaction.editReply({ content: '❌ Please select a Text Channel.' });
                            return;
                        }
                        await this.dbService.updateGuildConfig(interaction.guildId, { report_channel_id: channel.id });
                        await interaction.editReply({ content: `✅ Reports channel updated to <#${channel.id}>` });
                        return;
                    }
                }
                if (group === 'welcome') {
                    if (subcommand === 'channel') {
                        const channel = interaction.options.getChannel('target');
                        if (channel?.type !== 0) { // GuildText
                            await interaction.editReply({ content: '❌ Please select a Text Channel.' });
                            return;
                        }
                        await this.dbService.updateGuildConfig(interaction.guildId, {
                            welcome_channel_id: channel.id,
                            welcome_enabled: true
                        });
                        await interaction.editReply({ content: `✅ Welcome messages configured for <#${channel.id}>` });
                        return;
                    }
                    if (subcommand === 'test') {
                        if (!interaction.guild) {
                            await interaction.editReply({ content: 'Guild not found.' });
                            return;
                        }
                        const member = await interaction.guild.members.fetch(interaction.user.id);
                        await this.welcomeService.handleMemberJoin(member, true); // True for test
                        await interaction.editReply({ content: 'Sent a test welcome message!' });
                        return;
                    }
                    if (subcommand === 'reset') {
                        await this.dbService.updateGuildConfig(interaction.guildId, {
                            welcome_enabled: false,
                            welcome_message: null
                        });
                        await interaction.editReply({ content: 'Welcome settings reset.' });
                        return;
                    }
                }
            }
        };
        this.commands.set(helpCommand.data.name, helpCommand);
        this.commands.set(statsCommand.data.name, statsCommand);
        this.commands.set(lbCommand.data.name, lbCommand);
        this.commands.set(statusCommand.data.name, statusCommand);
        this.commands.set(configCommand.data.name, configCommand);
    }
    async deployCommands() {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        try {
            console.log('Started refreshing Slash Commands.');
            const body = this.commands.map(c => c.data.toJSON());
            // Global deploy for now to ensure instant updates (development)
            // For prod, guild-specific is faster for testing, but clientId is needed.
            if (this.client.user?.id) {
                await rest.put(Routes.applicationCommands(this.client.user.id), { body });
                console.log('Successfully reloaded Slash Commands.');
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async handleInteraction(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        const command = this.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            // Permission Check: Allow public access to specific commands
            const publicCommands = ['stats', 'status'];
            if (!publicCommands.includes(interaction.commandName)) {
                const member = interaction.member;
                if (member && typeof member.permissions !== 'string' && member.permissions) {
                    const hasPerms = member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild);
                    if (!hasPerms) {
                        await interaction.reply({ content: '⛔ You do not have permission to use this command. Only Admins and Moderators can use this.', ephemeral: true });
                        return;
                    }
                }
            }
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            // If deferred, editReply. If not, reply.
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: 'There was an error executing this command!' }).catch(() => { });
            }
            else {
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true }).catch(() => { });
            }
        }
    }
}
