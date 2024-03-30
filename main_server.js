const QRCode = require('qrcode');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const readline = require('readline');
const { Client, LocalAuth } = require('whatsapp-web.js');
const upload = multer({ dest: 'uploads/' });
var whatsapp = require('whatsapp-web.js');
let clientReady = false;
// Components 
const handleEcho = require('./components/echo');
const handleHelp = require('./components/help');
const handleMakeGroup = require('./components/makeGroup');
const handleAddingPeople = require('./components/addUser');

const allowedUsers = JSON.parse(fs.readFileSync('components/allowed_users.json', 'utf8'));

let currentQR = ''; // Variable to store the current QR code data
// const client = new Client();
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'auth'
    })
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    clientReady = true;
    console.log('Client is ready!');
});

client.on('message_create', async (message) => {
    if (allowedUsers.includes(message.from)) {

	if (message.body.startsWith('echo')) {
        await handleEcho(message, client);
    }

    else if (message.body.startsWith('!help')) {
        await handleHelp(message);
    }

    else if (message.body.startsWith('!make_group')) {
        await handleMakeGroup(message,client);    }

    else if (message.body.startsWith('!add')) {
        await handleAddingPeople(message,client);
    }

    else if (message.body.startsWith('sudo!data')) {
        const info = message.body.slice(9).trim();
        const lines = info.split('\n');
        client.getChats().then((chats) => {
            const myGroup = chats.find((chat) => chat.name === lines[0]);
            console.log("hi");
            console.log(lines[0])
            const participantsArray = myGroup.participants;
            const userNumbersArray = participantsArray.map(participant => participant.id.user);
            console.log(userNumbersArray);
            const data = userNumbersArray.join('\n');
            client.sendMessage(message.from, data);
            });
    }

    else if (message.body.startsWith('code-red')) {
        client.getChats().then((chats) => {
            client.sendMessage(message.from, "We trust you have received the usual lecture from remo sir the local System Administrator. It usually boils down to these three things:\n#1) Respect the privacy of others.\n#2) Think before you type.\n#3) With great power comes great responsibility.");
            setTimeout(() => {
                process.exit(); // Exit the Node.js process
            }, 1000);
        });
    }

    else if (message.body.startsWith('sudo!inverso_supra_remove')) {
        const info = message.body.slice(25).trim();
        const lines = info.split('\n');
        const white_numbers = lines.slice(1)
        client.getChats().then((chats) => {
            const myGroup = chats.find((chat) => chat.name === lines[0]);
            console.log(lines[0])
            const participantsArray = myGroup.participants;
            const userNumbersArray = participantsArray.map(participant => participant.id.user);
            console.log(userNumbersArray);
            const remove_people = userNumbersArray.filter(element => !white_numbers.includes(element));
            console.log(remove_people)
            const data = remove_people.join('\n');
            const modifiedResults = remove_people.map(number => `${number}@c.us`);
            myGroup.removeParticipants(modifiedResults);
            client.sendMessage(message.from, "Removed these people from group:\n");
            client.sendMessage(message.from, data);
            });  
    }
    else if (message.body.startsWith('s101!brodcast')) {
        const info = message.body.slice(13).trim();
        const lines = info.split('\n');
        brodcast_list = {
            HIDDEN FOR PRIVACY REASONS
        };
        const name_event = lines[0];
        const invite_link = lines[1];
        for (const name in brodcast_list) {
            if (brodcast_list.hasOwnProperty(name)) {
                const contact = brodcast_list[name];
                await client.sendMessage(contact, `HIDDEN FOR PIVECY REASONS`);
            }
        } 
    }
    else if (message.body.startsWith('!task')) {
        const info = message.body.slice(5).trim();
        const lines = info.split('\n');
        lines.forEach(function(item) {
            const work = info.split('-');
            sub_domain = work[0];
            task = work[1];
            addData(sub_domain, task);
        });
        await client.sendMessage(message.from, `Your Task has been recored`);
        console.log(task_list)
    }
    else if (message.body.startsWith('!showtask')) {
        tasks = printDictionaryWithNumbers(dictionary, keyMap);
        await client.sendMessage(message.from, tasks);
    }
    else if (message.body.startsWith('!removetask')) {
        const info = message.body.slice(11).trim();
        const lines = info.split('\n');
        removeKey(int(lines[0]));
        // task_list.splice(lines[0], 1); 
    }
    else if (message.body.startsWith('!removesubtask')) {
        const info = message.body.slice(11).trim();
        const lines = info.split('\n');
        values = lines[0].split(".");
        removeValue(values[0],values[1]);
        // task_list.splice(lines[0], 1); 
    }
}});

client.initialize();
