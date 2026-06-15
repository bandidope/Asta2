const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;

  let who;

  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;
  } else {
    who = m.chat;
  }

  if (!who) {
    const warntext = `*[❗] Debes mencionar o responder a un usuario*\n\nEjemplo:\n${usedPrefix + command} @usuario`;
    return m.reply(warntext);
  }

  // 🔹 Asegurar usuario en DB
  if (!global.db.data.users[who]) {
    global.db.data.users[who] = { warn: 0 };
  }

  const user = global.db.data.users[who];
  if (typeof user.warn !== 'number') user.warn = 0;

  const reason = text ? text.replace(/@\d+/g, '').trim() : 'No especificado';

  user.warn += 1;

  await m.reply(
    `⚠️ *@${who.split('@')[0]}* recibió una advertencia\n\n📝 Motivo: ${reason}\n🚨 Advertencias: *${user.warn}/3*`,
    null,
    { mentions: [who] }
  );

  // 🔥 Límite de advertencias
  if (user.warn >= 3) {
    const botSettings = global.db.data.settings?.[conn.user.jid] || {};

    if (!botSettings.restrict) {
      return m.reply(
        `🚫 El bot no tiene activado "restrict", no se puede expulsar al usuario.`
      );
    }

    user.warn = 0;

    await m.reply(
      `☠️ *@${who.split('@')[0]}* superó el límite de advertencias (3/3)\n\n🚪 Será expulsado del grupo.`,
      null,
      { mentions: [who] }
    );

    try {
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    } catch (e) {
      m.reply('❌ No pude expulsar al usuario (falta de permisos).');
    }
  }
};

handler.command = /^(advertir|advertencia|warn|warning)$/i;
handler.admin = true;
handler.register = false;
handler.group = true;
handler.botAdmin = true;

export default handler;