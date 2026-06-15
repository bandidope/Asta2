import { igdl } from "ruhend-scraper"

let handler = async (m, { args, conn }) => {
  const rwait = '🕒'
  const done = '✅'
  const error = '⚠️'

  if (!args[0]) {
    return conn.reply(m.chat, '🚩 Ingresa un link de Instagram.', m)
  }

  try {
    await m.react(rwait)
    conn.reply(m.chat, `🕒 *Descargando video de Instagram...*`, m, {
      contextInfo: { 
        externalAdReply: { 
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: 'Instagram Downloader',
          body: 'Bot',
          previewType: 0,
          thumbnail: null,
          sourceUrl: null
        }
      }
    })

    const res = await igdl(args[0])
    const data = res.data

    if (!data || data.length === 0) throw new Error('No se encontraron medios.')

    // Opcional: ordenar por mejor resolución si existe
    const media = data.sort((a, b) => {
      const resA = parseInt(a.resolution) || 0
      const resB = parseInt(b.resolution) || 0
      return resB - resA
    })[0]

    if (!media) throw new Error('No se encontró un video adecuado.')

    // ✅ Reemplazo de sendFile por sendMessage
    await conn.sendMessage(
      m.chat,
      {
        video: { url: media.url },
        caption: '🚩 *Video de Instagram*'
      },
      { quoted: m }
    )

    await m.react(done)

  } catch (err) {
    console.error(err)
    await m.react(error)
    return conn.reply(m.chat, `🚩 Ocurrió un error: ${err.message}`, m)
  }
}

handler.command = ['instagram', 'ig']
handler.tags = ['descargas']
handler.help = ['instagram', 'ig']
handler.register = false

export default handler