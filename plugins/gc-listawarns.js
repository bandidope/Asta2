let handler = async (m, { conn, isOwner }) => {
  let users = global.db.data.users

  let adv = Object.entries(users).filter(([_, user]) => user.warn && user.warn > 0)

  let caption = `⚠️ 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎 𝘼𝘿𝙑𝙀𝙍𝙏𝙄𝘿𝙊𝙎
*╭•·–––––––––––––––––––·•*
│ 📊 Total: *${adv.length} usuarios*
│
${
  adv.length > 0
    ? adv
        .map(([jid, user], i) => {
          let name = conn.getName(jid) || 'Sin nombre'
          return `│ *${i + 1}.* ${name} (${user.warn}/3)\n│ ${isOwner ? '@' + jid.split('@')[0] : jid}\n│ - - - - - - - - -`
        })
        .join('\n')
    : '│ ❌ No hay usuarios advertidos'
}
*╰•·–––––––––––––––––––·•*`

  await conn.reply(m.chat, caption, m, {
    mentions: await conn.parseMention(caption),
  })
}

handler.command = ['listaadv', 'listadv', 'adv', 'advlist', 'advlista']
handler.group = true
handler.register = false

export default handler