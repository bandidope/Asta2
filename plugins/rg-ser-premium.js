//código creado x The Carlos 👑
//no olvides dejar créditos 
const CURRENCY = 'monedas'

const UNITS = {
  min: 1, minuto: 1, minutos: 1, m: 1,
  hora: 60, horas: 60, h: 60,
  dia: 1440, dias: 1440, d: 1440
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const owners = (global.owner || [])
    .map(o => Array.isArray(o) ? o[0] : o)
    .map(n => String(n).replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  const isOwner = owners.includes(m.sender)
  let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { monedas: 0 })

  if (isOwner) {
    user.premium = true
    user.premiumTime = Infinity
    return conn.reply(m.chat, `🌟 *¡Eres el Gran Hechicero Supremo (Owner)!*\n🎖️ Tu membresía premium es *permanente*.`, m)
  }

  if (!text) {
    return conn.reply(m.chat, `⚠️ *Indica la duración de la membresía.*\n\nEjemplo:\n${usedPrefix + command} 1 hora`, m)
  }

  let [amountStr, unitRaw] = text.trim().split(/\s+/)
  const amount = parseInt(amountStr, 10)
  const unit = (unitRaw || '').toLowerCase()

  if (!amount || amount <= 0) return conn.reply(m.chat, `⚠️ *La cantidad debe ser un número positivo.*`, m)
  if (!UNITS[unit]) return conn.reply(m.chat, `⚠️ *Unidad de tiempo no válida.* Usa: minutos, horas o días.`, m)

  const minutes = amount * UNITS[unit]
  if (minutes > 50 * 24 * 60) return conn.reply(m.chat, `⚠️ *Máximo 50 días por compra.*`, m)

  const costo = (unit.includes('dia') || unit === 'd')
    ? Math.ceil(minutes / 1440) * 240000
    : Math.ceil(minutes * (50000 / 60))

  if ((user.monedas || 0) < costo) {
    return conn.reply(
      m.chat,
      `⚠️ *No tienes suficientes ${CURRENCY}.*\nNecesitas *${costo.toLocaleString()}* y tienes *${(user.monedas || 0).toLocaleString()}*.`,
      m
    )
  }

  user.monedas -= costo
  user.premium = true
  const base = Math.max(Date.now(), user.premiumTime || 0)
  user.premiumTime = base + minutes * 60 * 1000

  return conn.reply(
    m.chat,
    `🌟 *¡Compra completada con éxito!*\n🎖️ Premium por *${amount} ${unit}*.\n💰 Has gastado *${costo.toLocaleString()} ${CURRENCY}*.`,
    m
  )
}

handler.help = ['comprarpremium <cantidad> <unidad>']
handler.tags = ['premium']
handler.command = ['comprarpremium', 'premium', 'vip']
handler.register = false

handler.before = async (m) => {
  const owners = (global.owner || [])
    .map(o => Array.isArray(o) ? o[0] : o)
    .map(n => String(n).replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
  if (owners.includes(m.sender)) {
    user.premium = true
    user.premiumTime = Infinity
    return
  }
  if (user.premium && user.premiumTime && Date.now() > user.premiumTime) {
    user.premium = false
    user.premiumTime = 0
    await m.reply('⚠️ Tu membresía premium ha terminado. Compra otra para seguir disfrutando de los beneficios VIP.')
  }
}

export default handler