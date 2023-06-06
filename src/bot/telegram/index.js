const { model } = require('mongoose')
require('dotenv').config()
const crypto = require('crypto')
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose')
const { zip } = require('../../helpers/zipper')
const { saveAs } = require('../../helpers/savefile')
const { dowloader } = require('../../helpers/downloader')
const Monies = require('../../models/movie')
const Files = require('../../models/file_path')

const token = process.env.YOUR_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const denBot = new TelegramBot(token, { polling: true });
const randomID = () => crypto.randomBytes(10).toString('hex').toUpperCase()

denBot.on('message', async (request) => {
    const { chat, text, video, audio, photo, voice, file } = request
    console.log(file)
    if (video?.file_id) {
        const _file = video?.file_id
        const file = await denBot.getFileLink(_file)
        const file_type = file?.slice(-5).split?.('.')[1]
        const file_id = `F-${(crypto.randomBytes(6).toString('hex')).toUpperCase()}${text ?? ''}`
        const { temp_path, temp_size } = await dowloader(file, file_type, file_id)
        const { saved_to_relative_path: file_relative_path, file_size } = await zip(temp_path, file_id)

        const nFilez = new Files({
            file_id,
            file_content: [file_type],
            file_size: file_size,
            file_original_size: temp_size,
            file_uploader: 'DEV',
            file_relative_path,
            file_place_holder: '',
            file_parent_path: file,
            // file_uploaded_from: '',
            // file_download_count: 1,
            // file_type,
        })

        const [saved] = await Promise.allSettled([
            nFilez.save()
        ])

        console.log(saved)
        if (saved.status === 'fulfilled') {
            const url = `http://localhost:5173/download?file_id=${file_id}`
            denBot.sendMessage(chat.id, `File Saved Here: ${url}`)
            console.log(file_relative_path, file_id, file_size, temp_size)
            return
        }

        denBot.sendMessage(chat.id, 'Something went wrong')

    }
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