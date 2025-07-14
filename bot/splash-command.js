import { REST, Routes, SlashCommandBuilder } from "discord.js";

import dotenv from 'dotenv'
dotenv.config();

const BotToken = process.env.TOKEN
const IdBot = process.env.BOT
const IdServer = process.env.SERVER

const rest = new REST().setToken(BotToken)

const slashRegister = async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(IdBot, IdServer), {
            body: [
                new SlashCommandBuilder()
                    .setName("list")
                    .setDescription("przypomnij natychmiastowo")
                    .addStringOption( option => {
                        return option
                        .setName("category")
                        .setDescription("przypomnij natychmiastowo")
                        .setRequired(true)
                        .addChoices(
                            {name: "natychmiastowe przypomnienie", value: "@everyone" + " przypominam o wplacie na zbiorke!!!"}
                        )
                    })
            ]
        })
    } catch(error){
        console.log(error)
    }
}
slashRegister();