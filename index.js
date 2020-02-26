const webhook = require('webhook-discord')
const env = require('dotenv-safe').config().parsed
const Hook = new webhook.Webhook(env.WEBHOOK_URL)
const express = require('express')
const app = express()
const { xml2js } = require('xml-js')

app.all('/youtube_callback', (req, res) => {
  const { feed: { entry } } = xml2js(req.body, { compact: true })
  const video_id = entry['yt:videoId']
  const msg = new webhook.MessageBuilder()
    .setName('新しい動画/生放送がアップロードされました！')
    .addField('URL', `https://youtu.be/${video_id._text}`)
    .addField('チャンネルURL', entry.author.uri._text)
    .setTime()
  Hook.send(msg)
  res.status(200).send(JSON.stringify({status: 'ok'}))
})

app.listen(8080)
