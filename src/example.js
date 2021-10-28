const { Client } = require('./client'),
     { Permissions } = require('./constants');
    
const client = new Client({
    token: 'bot_token'
});

client.createInvite('guild_id', {
    codeUses: 1,
    maxAge: 20,
    maxUses: 10,
    tempInvite: true
}).then(console.log)
.catch(console.log);
