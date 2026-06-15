let cooldowns = {}

function checkDeuda(users, m, conn) {
  if (!users) return false

  if (users.bloqueado) {
    const isBanco = m.text && m.text.toLowerCase().startsWith('banco')

    if (!isBanco) {
      conn.reply(
        m.chat,
        `🚫 No puedes jugar mientras tengas deuda.\nUsa *banco pagar <cantidad>*`,
        m
      )
      return true
    }
  }
  return false
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let users = global.db.data.users[m.sender] ||= { monedas: 0 }

  if (checkDeuda(users, m, conn)) return

  const cooldown = 10000
  const now = Date.now()

  if (cooldowns[m.sender] && now - cooldowns[m.sender] < cooldown) {
    const restante = Math.ceil((cooldown - (now - cooldowns[m.sender])) / 1000)
    return conn.reply(
      m.chat,
      `🚩 Espera *${restante}s* antes de volver a apostar.`,
      m
    )
  }

  if (!text) {
    return conn.reply(
      m.chat,
      `🎰 *Ruleta*

Uso:
• ${usedPrefix + command} 20 black
• ${usedPrefix + command} 50 red`,
      m
    )
  }

  const args = text.trim().split(' ')
  if (args.length !== 2) {
    return conn.reply(m.chat, '🚩 Formato: <cantidad> <black/red>', m)
  }

  let bet = parseInt(args[0])
  let color = args[1].toLowerCase()

  if (isNaN(bet) || bet <= 0) return conn.reply(m.chat, '🚩 Apuesta inválida.', m)
  if (!['black', 'red'].includes(color)) return conn.reply(m.chat, '🚩 Solo black o red.', m)
  if (bet > users.monedas) return conn.reply(m.chat, '🚩 No tienes suficientes monedas.', m)

  cooldowns[m.sender] = now

  conn.reply(
    m.chat,
    `🎰 Apostaste *${bet} monedas* al color *${color}*\n⏳ Girando la ruleta...`,
    m
  )

  setTimeout(() => {
    // 🚨 apuesta grande pierde (nerf anti abuso)
    if (bet >= 2000) {
      users.monedas -= bet
      if (users.monedas < 0) users.monedas = 0

      return conn.reply(
        m.chat,
        `💥 Apuesta demasiado grande = pérdida automática\n❌ -${bet} monedas`,
        m
      )
    }

    const roll = Math.random()
    const result = roll < 0.5 ? 'black' : 'red'

    // 🎁 jackpot
    if (roll < 0.01) {
      users.monedas += 1000000
      users.premium = Date.now() + 2 * 24 * 60 * 60 * 1000

      return conn.reply(
        m.chat,
        `🎉 ¡JACKPOT!\n+1,000,000 monedas 💰\n👑 Premium 2 días`,
        m
      )
    }

    const win = color === result

    if (win) {
      const winAmount = bet * 2
      users.monedas += winAmount

      conn.reply(
        m.chat,
        `🎉 Ganaste!\nColor: ${result}\n💰 +${winAmount} monedas`,
        m
      )
    } else {
      users.monedas -= bet
      if (users.monedas < 0) users.monedas = 0

      conn.reply(
        m.chat,
        `💀 Perdiste!\nColor: ${result}\n❌ -${bet} monedas`,
        m
      )
    }
  }, 10000)
}

handler.tags = ['fun']
handler.help = ['ruleta <cantidad> <color>']
handler.command = ['ruleta', 'roulette', 'rt']
handler.register = false
handler.group = true

export default handler