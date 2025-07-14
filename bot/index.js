import dotenv from 'dotenv'
dotenv.config()
import{ Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const targetHour = 16;
const targetMinute = 10;
const channelId = process.env.CHANNEL;
const messageContent = "@everyone przypominam o zbiórce";


const sendMessageAtTargetTime = () => {
    const now = new Date();
    const targetTime = new Date(now);

    targetTime.setHours(targetHour, targetMinute, 0, 0);

    if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const delay = targetTime.getTime() - now.getTime();
    
    console.log(`Powiadomienie zostanie wysłane o godzinie ${targetHour}:${targetMinute}, za ${Math.round(delay / 1000)} sekund.`);

    setTimeout(() => {
        const channel = client.channels.cache.get(channelId);
        console.log('channel', channel);
        
        if (channel) {
            channel.send(messageContent)
                .then(() => console.log("Wiadomość została wysłana!"))
                .catch(err => console.error("Błąd przy wysyłaniu wiadomości:", err));
        } else {
            console.error("Nie znaleziono kanału Discord.");
        }

    
        setInterval(() => {
            channel.send(messageContent)
                .then(() => console.log("Codzienna wiadomość została wysłana!"))
                .catch(err => console.error("Błąd przy wysyłaniu codziennej wiadomości:", err));
        }, 24 * 60 * 60 * 1000);
    }, delay);
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "list") {
            const textReceived = interaction.options.getString("category") || "brak kategorii";
            interaction.reply({ content: `${textReceived}` });
        }
    }
});



client.on("ready", () => {
    console.log(`Zalogowano jako ${client.user.tag}!`);
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        console.log("Kanał Discord znaleziony:", channel.name);
    } else {
        console.error("Nie znaleziono kanału. Sprawdź ID kanału.");
    }

    sendMessageAtTargetTime();
});

client.login(process.env.TOKEN)