const { model } = require('mongoose')
require('dotenv').config()
const crypto = require('crypto')
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.YOUR_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const denBot = new TelegramBot(token, { polling: true });
const randomID = () => crypto.randomBytes(10).toString('hex').toUpperCase()
console.log(randomID())

denBot.on('message', async (request) => {
    const { chat, text, video, audio, photo, voice, } = request
    console.log(text, video, audio, photo, voice,)
    denBot.sendMessage(chat.id, "HEY FRED")
})

const formartMessageContent = () => (
    ``
)

denBot.on('inline_query', async (request) => {
    try {
        const { query, chat, id } = request

        await denBot.answerInlineQuery(id, [{
            id: `${randomID()}`,
            type: 'article',
            title: "title of this article",
            input_message_content: {
                message_text: "welcoome ot download this moview from here https://youtube.com",
                
            },
            url: "https://youtube.com",
            hide_url: true,
            description: "description of this article",
            // thumb_url: "https://i.ibb.co/W3WZWGk/cbd-broadview.jpg",
            // thumb_width: number | undefined,
            // thumb_height: number | undefined,
        },])

        console.log(query)
    } catch (error) {
        console.log(error)
    }
})


module.exports = this   