const handler = async (m, { conn, participants, groupMetadata }) => {
  try {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null) || global.icons;

    const { 
      antiToxic, reaction, antiTraba, antidelete, antiviewonce, 
      welcome, detect, antiLink, antiLink2, modohorny, 
      autosticker, audios 
    } = global.db.data.chats[m.chat];

    const groupAdmins = participants.filter((p) => p.admin);
    const listAdmin = groupAdmins
      .map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`)
      .join('\n') || '*No hay administradores*';

    const owner = groupMetadata.owner || 
      groupAdmins.find((p) => p.admin === 'superadmin')?.id || 
      m.chat.split`-`[0] + '@s.whatsapp.net';

    const text = `💥 *INFO GRUPO*
💌 *ID:*
→ ${groupMetadata.id}
🥷 *Nombre:*
→ ${groupMetadata.subject}
🌟 *Descripción:*
→ ${groupMetadata.desc?.toString() || 'Sin Descripción'}
💫 *Miembros:*
→ ${participants.length} Participantes
👑 *Creador del Grupo:*
→ @${owner.split('@')[0]}
🏆 *Administradores:*
${listAdmin}

💭 *CONFIGURACIÓN*

◈ *Welcome:* ${welcome ? '✅' : '❌'}
◈ *Detect:* ${detect ? '✅' : '❌'}  
◈ *Antilink:* ${antiLink ? '✅' : '❌'} 
◈ *Antilink 𝟸:* ${antiLink2 ? '✅' : '❌'} 
◈ *nsfw:* ${modohorny ? '✅' : '❌'} 
◈ *Autosticker:* ${autosticker ? '✅' : '❌'} 
◈ *Audios:* ${audios ? '✅' : '❌'} 
◈ *Reacción:* ${reaction ? '✅' : '❌'}
◈ *Delete:* ${antidelete ? '✅' : '❌'} 
◈ *Antitoxic:* ${antiToxic ? '✅' : '❌'} 
◈ *Antitraba:* ${antiTraba ? '✅' : '❌'} 
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: text,
      mentions: [...groupAdmins.map((v) => v.id), owner]
    }, { quoted: m });

  } catch (e) {
    console.error('Error en el comando infogrupo:', e);
    await conn.reply(m.chat, '❌ Error al obtener la información del grupo.', m);
  }
};

handler.help = ['infogrupo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'gp'];
handler.register = false;
handler.group = true;

export default handler;