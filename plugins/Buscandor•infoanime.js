import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) 
    return conn.sendMessage(m.chat, { text: `🍟 *Ingrese el nombre de algún anime*\n\nEjemplo: ${usedPrefix + command} black clover` }, { quoted: m })

  let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
  if (!res.ok) 
    return conn.sendMessage(m.chat, { text: `🚩 *Ocurrió un fallo*` }, { quoted: m })

  let json = await res.json()
  if (!json.data || !json.data[0]) 
    return conn.sendMessage(m.chat, { text: `🚩 *No se encontró información para:* ${text}` }, { quoted: m })

  let manga = json.data[0]
  let author = manga.authors?.[0]?.name || 'Desconocido'

  let animeInfo = `
🍟 Título: ${manga.title_japanese || manga.title}
🚩 Capítulo: ${manga.chapters || 'N/A'}
💫 Transmisión: ${manga.type || 'N/A'}
🗂 Estado: ${manga.status || 'N/A'}
🗃 Volúmenes: ${manga.volumes || 'N/A'}
🌟 Favorito: ${manga.favorites || 'N/A'}
🧮 Puntaje: ${manga.score || 'N/A'}
👥 Miembros: ${manga.members || 'N/A'}
🔗 URL: ${manga.url || 'N/A'}
👨‍🔬 Autor: ${author}
📝 Fondo: ${manga.background || 'N/A'}
💬 Sinopsis: ${manga.synopsis || 'N/A'}
  `.trim()

  await conn.sendMessage(m.chat, {
    image: { url: manga.images?.jpg?.image_url || manga.images?.jpg?.large_image_url },
    caption: '🚩 *I N F O - A N I M E* 🚩\n\n' + animeInfo
  }, { quoted: m })
}

handler.help = ['infoanime']
handler.tags = ['anime']
handler.command = ['infoanime', 'animeinfo']
handler.register = false
export default handler