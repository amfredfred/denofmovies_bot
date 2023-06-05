const { Hono } = require('hono')
const { serve } = require('@hono/node-server')

const app = new Hono()


require('./bot/telegram')

console.log("STARTED")







serve({
    fetch: app.fetch,
    port: process.env.PORT || 1212,
})