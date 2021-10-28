const fetch = require('node-fetch');

const MAIN_API = 'https://discord.com/api/';
const API_VER = 'v9';
const DISCORD_API = MAIN_API + API_VER;
const UNKNOWN_INVITE = 10006;
const UNKNOWN_GUILD = 10004;
const UNKNOWN_USER = 10013;
const UNKNOWN_BAN = 10026;
const UNKNOWN_ROLE = 10011;
const MISSING_GUILD_ACCESS = 50001;
const MISSING_PERMISSIONS = 50013;

class Client {
    constructor(options = {}) {
        this.token = options.token;
    }

    getAllEmojis(guildID) {
        if (typeof guildID !== 'string') throw new TypeError(`Guild ID must be a string.`);
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/emojis`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => res(j))
            .catch(() => { });
        })
    }

    getEmojiFromID(guildID, emojiID) {
        if (typeof guildID !== 'string') throw new TypeError(`Guild ID must be a string.`);
        if (typeof emojiID !== 'string') throw new TypeError(`Emoji ID must be a number.`);
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/emojis/${emojiID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => res(j))
            .catch(() => { });
        })
    }

    createInvite(channelID, options = {}) {
        if (typeof channelID !== 'string') throw new TypeError(`Channel ID must be a string.`);
        if (options.codeUses && typeof options.codeUses !== 'number') throw new TypeError(`Code uses must be an integer.`);
        if (options.maxAge && typeof options.maxAge !== 'number') throw new TypeError(`Maximum age must be an integer.`);
        if (options.maxUses && typeof options.maxUses !== 'number') throw new TypeError(`Maximum uses must be an integer.`);
        if (options.tempInvite && typeof options.tempInvite !== 'boolean') throw new TypeError(`Temp invite must be a boolean.`);        
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/channels/${channelID}/invites`, {
                method: 'POST',
                body: JSON.stringify({
                    uses: options.codeUses || 0,
                    max_age: options.maxAge || 86400,
                    max_uses: options.maxUses || 0,
                    temporary: options.tempInvite || false
                }),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => res(j))
            .catch(() => { });
        })
    }

    deleteInvite(inviteCode) {
        if (!inviteCode) throw new Error(`Invite code is missing.`);
        if (typeof inviteCode !== 'string') throw new TypeError(`Invite code must be a string.`);
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/invites/${inviteCode}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_INVITE) rej(new Error('[Discord API error] Unknown invite code.'));
                res(j)
            })
            .catch(() => { });
        })
    }
	
	guildMemberBan(guildID, memberID, messageDays, reason) {
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/bans/${memberID}`, {
                method: 'PUT',
				body: JSON.stringify({
					delete_message_days: messageDays || 0,
					reason: reason || '',
				}),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
				if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				if (j.code === UNKNOWN_USER) rej(new Error('[Discord API error] Unknown user ID.')); 
                res(j)
            })
            .catch(() => { });
        })
    }
	
	guildMemberUnban(guildID, memberID, reason) {
		if (!guildID) throw new Error(`Guild ID is missing.`);
		if (!memberID) throw new Error(`Member ID is missing.`);
		if (reason) getReason = reason;
		if (typeof guildID !== 'string') throw new TypeError(`Guild ID must be a string.`);
		if (typeof memberID !== 'string') throw new TypeError(`Member ID must be a string.`);
		
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/bans/${memberID}`, {
                method: 'DELETE',
				body: JSON.stringify({
					reason: getReason
				}),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				if (j.code === UNKNOWN_BAN) rej(new Error('[Discord API error] Unknown ban ID.'));
                res(j)
            })
            .catch(() => { });
        })
    }
	
	getGuildMemberBan(guildID, memberID) {
		if (!guildID) throw new Error(`Guild ID is missing.`);
		if (!memberID) throw new Error(`Member ID is missing.`);
		if (typeof guildID !== 'string') throw new TypeError(`Guild ID must be a string.`);
		if (typeof memberID !== 'string') throw new TypeError(`Member ID must be a string.`);
		
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/bans/${memberID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				if (j.code === UNKNOWN_BAN) rej(new Error('[Discord API error] Unknown ban ID.'));
                res(j)
            })
            .catch(() => { });
        })
    }
	
	getGuildBans(guildID) {
		if (!guildID) throw new Error(`Guild ID is missing.`);
		if (typeof guildID !== 'string') throw new TypeError(`Guild ID must be a string.`);
		
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/bans`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
                res(j)
            })
            .catch(() => { });
        })
	}
	
	createGuildRole(guildID, roleName, permissions, roleColor, roleHoist, roleIcon, roleUnicodeEmoji, roleMentionable) {
		if (!guildID) throw new Error(`Guild ID is missing.`);
		if (!roleName) throw new Error(`Role name is missing.`);
		if (!permissions) throw new Error(`Permission(s) are missing.`);
		if (!roleColor) throw new Error(`Role color is missing.`);
		if (!roleHoist) throw new Error(`Hosing boolean is missing.`);
		if (!roleMentionable) throw new Error(`Mention role is missing.`);
		/* No typeof returns */
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/roles`, {
                method: 'POST',
				body: JSON.stringify({
					name: roleName,
					permissions: permissions,
					color: roleColor,
					hoist: roleHoist,
					icon: roleIcon,
					unicode_emoji: roleUnicodeEmoji,
					mentionable: roleMentionable
				}),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }
	
	editRolePosition(guildID, roleID, rolePosition) {
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/roles`, {
                method: 'PATCH',
				body: JSON.stringify({
					id: '903000936799170580',
					position: 14
				}),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
				console.log(j.errors._errors);
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				if (j.code === UNKNOWN_BAN) rej(new Error('[Discord API error] Unknown ban ID.'));
                res(j)
            })
            .catch(() => { });
        })
    }
	
	editGuildRole(guildID, roleName, permissions, roleColor, roleHoist, roleIcon, roleUnicodeEmoji, roleMentionable) {
		if (!guildID) throw new Error(`Guild ID is missing.`);
		if (!roleName) throw new Error(`Role name is missing.`);
		if (!permissions) throw new Error(`Permission(s) are missing.`);
		if (!roleColor) throw new Error(`Role color is missing.`);
		if (!roleHoist) throw new Error(`Hosing boolean is missing.`);
		if (!roleMentionable) throw new Error(`Mention role is missing.`);
		/* No typeof returns */
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/roles`, {
                method: 'PATCH',
				body: JSON.stringify({
					name: roleName,
					permissions: permissions,
					color: roleColor,
					hoist: roleHoist,
					icon: roleIcon,
					unicode_emoji: roleUnicodeEmoji,
					mentionable: roleMentionable
				}),
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }
	
	deleteGuildRole(guildID, roleID) {
		return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/roles/${roleID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				if (j.code === UNKNOWN_ROLE) rej(new Error('[Discord API error] Unknown role ID.'));
				res(j)
            })
            .catch(() => { });
        })
	}

    getGuildVoiceRegions(guildID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/regions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    getGuildInvites(guildID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/invites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    getGuildIntegrations(guildID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/integrations`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    getGuildIntegration(guildID, integrationID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/integrations/${integrationID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    deleteGuildIntegration(guildID, integrationID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/integrations/${integrationID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    getGuildWidget(guildID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/widget`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === UNKNOWN_GUILD) rej(new Error('[Discord API error] Unknown guild ID.'));
				res(j)
            })
            .catch(() => { });
        })
    }

    getGuildVanityCode(guildID) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}/vanity-url`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => r.json())
            .then(j => {
                if (j.code === MISSING_GUILD_ACCESS) rej(new Error('[Discord API error] Missing guild access.'));
				if (j.code === MISSING_PERMISSIONS) rej(new Error('[Discord API error] Missing guild permission(s).'));
                res(j)
            })
            .catch(() => { });
        })
    }

    getWidgetImage(guildID, style) {
        return new Promise(async (res, rej) => {
            await fetch(`${DISCORD_API}/guilds/${guildID}}/widget.png?style=${style}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(r => {
                res(r?.url);
            })
        })
        .catch(() => { });
    }
}

module.exports.Client = Client;