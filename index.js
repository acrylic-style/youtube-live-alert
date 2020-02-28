const webhook = require('webhook-discord')
const { xml2js } = require('xml-js')
const fetch = require('node-fetch')
const mapping = require('./mapping')
const start = Date.now()

const cache = {}

const send = (body, url) => {
  let { feed: { entry } } = xml2js(body, { compact: true })
  if (entry.constructor.name === 'Array') entry = entry[0]
  const video_id = entry['yt:videoId']
  const msg = new webhook.MessageBuilder()
    .setName('YouTube')
    .setAvatar('https://img.acrylicstyle.xyz/upload/348431217/410151897/youtubelogo.png')
    .setText('新しい動画/生放送が公開されました！')
    .addField('URL', `https://youtu.be/${video_id._text}`)
    .addField('チャンネルURL', entry.author.uri._text)
    .setTime()
  const Hook = new webhook.Webhook(url)
  Hook.send(msg)
}

const check = async () => {
  Object.keys(mapping).forEach(async k => {
    const text = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${k}`).then(res => res.text())
    if (cache[k] === text) return
    cache[k] = text
    if ((Date.now()-start) >= 1000*31) send(text, mapping[k])
  })
}

setInterval(check, 1000*30) // check every 30 seconds

check()
