require('dotenv').config()
const crypto = require('crypto')
const TelegramBot = require('node-telegram-bot-api');
const { dowloader, title } = require('../helpers/')
const Files = require('../models/file_path')

const token = process.env.YOUR_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const denBot = new TelegramBot(token, { polling: true });
const randomID = () => crypto.randomBytes(5).toString('hex').toLocaleUpperCase()

denBot.on('message', async (request) => {

    const { chat, text, video, caption, document } = request
    const _sent = video || document

    if (_sent?.file_id) {
        const _file = _sent?.file_id
        const file = await denBot.getFileLink(_file)
        const file_mine = file?.slice(-5).split?.('.')[1]
        const file_caption = title(caption || text)
        const file_id = randomID()
        // const { temp_path, temp_size } = await dowloader(file, `tmp/zipped${file_id}.${file_mine}`)
        // const { saved_to_relative_path: file_relative_path, file_size } = await zip(temp_path, file_id)
        //Handling thumbnails
        const file_thumbnails_link = await denBot.getFileLink(_sent?.thumb?.file_id || _sent?.thumbnail?.file_id)
        const thumb_mime = file_thumbnails_link?.slice(-5).split?.('.')[1]
        const { temp_path: file_thumbnails } = await dowloader(file_thumbnails_link, `tmp/thumbnails/${file_id}.${thumb_mime}`)
        const file_download_link = `https://statugram.com/watch?v=${file_id}`

        const nFilez = new Files({
            file_id,
            file_content: [file_mine],
            file_size: 0,
            file_original_size: 0,
            file_uploader: 'DEV',
            file_caption,
            file_place_holder: '',
            file_parent_path: file,
            file_description: caption || text,
            file_thumbnails,
            file_download_link,
            // file_relative_path,
            // file_uploaded_from,
            // file_download_count,
            // file_typex,
        })

        const [saved] = await Promise.allSettled([nFilez.save()])
        console.log(saved)

        if (saved.status === 'fulfilled') {
            denBot.sendMessage(chat.id, `File Saved Here: ${file_download_link}`, {})
            return
        }
        denBot.sendMessage(chat.id, 'Something went wrong')
    }
})


denBot.on('inline_query', async (request) => {
    try {
        const { query, chat, id } = request


        const finds = Files.find({})

        const [filesCollection] = await Promise.allSettled([finds.sort([['createdAt', 'descending']]).exec()])

        if (filesCollection?.status === 'rejected') {
            console.log("SOMETHING WENT WRON")
            return
        }

        const returnQuery = []
        const wordsInquery = query?.split(' ')
        const collection = filesCollection.value
        const filteredResult = collection?.filter((aFile) => {
            const description = (aFile?.file_description)?.toLocaleLowerCase()
            const tags = []
            const isIn = wordsInquery?.some(qs => {
                if ((description?.indexOf(qs.toLocaleLowerCase()) > 0) || description?.search(qs.toLocaleLowerCase()) > 0) {
                    tags.push(qs)
                    return true
                }
            })
            const message_text = `${aFile.file_description}\n\nTags: ${String(tags.map(tag => `#${tag}`))} \n\n  https://statugram.com`
            const id = randomID()
            if (isIn) {
                returnQuery.push({
                    id,
                    type: 'article',
                    title: `${aFile.file_caption}`,
                    input_message_content: { message_text },
                    url: 'statugram.com',
                    // hide_url: true,
                    description: aFile.file_description,
                    thumb_url: `https://statugram.com/thumbnails/${aFile?.file_thumbnails?.split('src\\uploads\\zip\\')?.[1]}`,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[{
                            text: 'View | Download',
                            url: 'https://t.me/denofmovies_bot/movies?startapp=command'
                        },
                        {
                            text: '',
                            switch_inline_query_current_chat: "vidoe: more"
                        }
                        ]]
                    }
                })
            }
            console.log(aFile.file_thumbnails)
            return isIn
        }).sort(s => s?.file_description)

        console.log(returnQuery, "MATCHED")
        if (filesCollection.status === 'rejected') {
            console.log("REJECTED")
            return
        }
        await denBot.answerInlineQuery(id, returnQuery, {})
        console.log(query)
    } catch (error) {
        console.log(error)
    }
})

console.log("TELEGRAM APP STARTED")

module.exports = this   