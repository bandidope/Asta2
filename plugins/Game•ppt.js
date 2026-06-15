const handler = async (m, { conn, text, usedPrefix }) => {
  const user = global.db.data.users[m.sender] ||= {
    monedas: 0,
    wait: 0
  };

  const cooldown = 10000;
  const now = Date.now();

  if (now - user.wait < cooldown) {
    const remaining = Math.ceil((cooldown - (now - user.wait)) / 1000);
    throw `🕓 Espera *${remaining} segundos* para volver a jugar.`;
  }

  if (!text) {
    return conn.reply(
      m.chat,
      `🪨📄✂️ *Piedra, Papel o Tijera*

Uso:
• ${usedPrefix}ppt piedra
• ${usedPrefix}ppt papel
• ${usedPrefix}ppt tijera`,
      m
    );
  }

  const opciones = ['piedra', 'papel', 'tijera'];
  const bot = opciones[Math.floor(Math.random() * 3)];
  const player = text.toLowerCase().trim();

  if (!opciones.includes(player)) {
    return conn.reply(m.chat, '❌ Usa: piedra, papel o tijera.', m);
  }

  let msg = '';

  const win =
    (player === 'piedra' && bot === 'tijera') ||
    (player === 'papel' && bot === 'piedra') ||
    (player === 'tijera' && bot === 'papel');

  if (player === bot) {
    user.monedas += 1000;
    msg = `🤝 *Empate!*\n🎮 Tú: ${player}\n🤖 Bot: ${bot}\n💰 +1000 monedas`;
  } 
  else if (win) {
    user.monedas += 5000;
    msg = `🎉 *Ganaste!*\n🎮 Tú: ${player}\n🤖 Bot: ${bot}\n💰 +5000 monedas`;
  } 
  else {
    user.monedas -= 3000;
    if (user.monedas < 0) user.monedas = 0;
    msg = `💀 *Perdiste!*\n🎮 Tú: ${player}\n🤖 Bot: ${bot}\n❌ -3000 monedas`;
  }

  user.wait = now;

  return conn.reply(m.chat, msg, m);
};

handler.help = ['ppt <piedra|papel|tijera>'];
handler.tags = ['fun'];
handler.command = ['ppt'];
handler.register = false;

export default handler;