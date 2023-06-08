const { Hono } = require('hono')
const { cors } = require('hono/cors')
const { serve } = require('@hono/node-server')
const Files = require('./models/file_path')
const { fileResource } = require('./reponses/file-resource')
const { serveStatic } = require('@hono/node-server/serve-static')

const fs = require('fs')
const mongoose = require('mongoose')
require('dotenv').config()

const app = new Hono()
app.use("*", cors?.())
app.use('/uploads/*', serveStatic({ root: './src' }))
app.options("*", (c) => c.text('', 204))

app.get('/', (c) => c.text('Hono!'))



app.post('/view', async (req, next) => {
    const { file_id, } = await req.req.json()
    // const fileexists = fs.
    const [file] = await Promise.allSettled([
        Files.findOne({ file_id })
    ])
    if (file.status === 'rejected') {
        req.status(500)
        return req.text("Something went wrong, Try again soon!!")
    }
    if (!file.value) {
        req.status(404)
        return req.text(`File with id '${file_id}' not found on this server!!`)
    }
    const requested = fileResource(file?.value)
    return req.json(requested)
})

app.post('/download', async (req, next) => {
    const { file_id, download_format } = await req.req.json()
    // const fileexists = fs.
    const [file] = await Promise.allSettled([
        Files.findOne({ file_id })
    ])
    if (file.status === 'rejected') {
        req.status(500)
        return req.text("Something went wrong, Try again soon!!")
    }
    if (!file.value) {
        req.status(404)
        return req.text(`File with id '${file_id}' not found on this server!!`)
    }
    const requested = fileResource(file?.value)
    return req.json(requested)
}) 

require('./bot/telegram')



// DB CONNECTION 
mongoose.connect(process.env.DB_URL)
const DB = mongoose.connection
DB.once('open', () => console.log('DB |:| Connected!'))
DB.on('error', () => console.log('DB |:| Connection Error'))


serve({
    fetch: app.fetch,
    port: process.env.PORT || 1212,
})