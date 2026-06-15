import axios from 'axios'
import Jimp from 'jimp'
import baileys from '@whiskeysockets/baileys'

const { proto, generateWAMessageFromContent, generateWAMessageContent } = baileys

const name = "Descargas - black clover"

async function resizeImage(buffer, size = 300) {
  const img = await Jimp.read(buffer)
  return img.resize(size, size).getBufferAsync(Jimp.MIME_JPEG)
}

let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        '🥷🏻 Ingresa un texto para buscar en TikTok.',
        m
      )
    }

    await conn.reply(
      m.chat,
      '⌛ *Buscando resultados en TikTok...*',
      m
    )

    const createVideoMessage = async (url, caption) => {
      try {
        const content = { video: { url }, caption }

        const { videoMessage } = await generateWAMessageContent(
          content,
          { upload: conn.waUploadToServer }
        )

        return videoMessage
      } catch (e) {
        console.error('error video msg:', e)
        return null
      }
    }

    const { data } = await axios.get(
      `https://spenzy-api.vercel.app/api/search/tiktok?q=${encodeURIComponent(text)}`,
      { timeout: 30000 }
    )

    const results = data?.results || []

    if (!Array.isArray(results) || results.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron resultados.', m)
    }

    const videos = results.filter(v => v?.play).slice(0, 8)

    if (!videos.length) {
      return conn.reply(m.chat, '❌ No hay videos válidos.', m)
    }

    const cards = []

    for (const v of videos) {
      const caption =
        `🎵 ${v.title || 'Sin título'}\n` +
        `👤 ${v.author?.nickname || 'Desconocido'}\n` +
        `▶️ ${v.duration || '?'}s`

      const videoMessage = await createVideoMessage(v.play, caption)
      if (!videoMessage) continue

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: caption
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '🍀 TikTok Search'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: true,
          videoMessage
        }),
        nativeFlowMessage:
          proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: []
          })
      })
    }

    if (!cards.length) {
      return conn.reply(m.chat, '❌ No se pudieron generar tarjetas.', m)
    }

    const carouselMessage =
      proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage:
              proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: '🍀 Resultados de TikTok'
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: name
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: '',
                  hasMediaAttachment: false
                }),
                carouselMessage
              })
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id
    })

  } catch (e) {
    console.error('TikTok Search error:', e)
    return conn.reply(
      m.chat,
      '❌ Error al consultar la API de TikTok.',
      m
    )
  }
}

handler.help = ['tiktoksearch <texto>']
handler.tags = ['downloader']
handler.command = ['tiktoksearch', 'tts', 'ttsearch']
handler.register = false
handler.group = false

export default handler