// banco.js

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users[m.sender]

  if (!users.monedas) users.monedas = 0
  if (!users.deuda) users.deuda = { monto: 0, interes: 0.05, vencimiento: null }
  if (typeof users.bloqueado === 'undefined') users.bloqueado = false

  const args = text ? text.trim().split(' ') : []

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `🚩 Comandos del banco:\n\n*${usedPrefix}banco pedir <cantidad>* - Solicitar préstamo\n*${usedPrefix}banco pagar <cantidad>* - Pagar deuda`,
      m
    )
  }

  const accion = args[0].toLowerCase()

  if (accion === 'pedir') {
    let monto = parseInt(args[1])

    if (isNaN(monto) || monto <= 0) {
      return conn.reply(m.chat, "🚩 Ingresa un monto válido para pedir prestado.", m)
    }

    if (monto > 1000000) {
      return conn.reply(m.chat, "🚩 El máximo que puedes pedir prestado es 1.000.000 monedas.", m)
    }

    if (users.deuda.monto > 0) {
      return conn.reply(m.chat, `🚩 Ya tienes un préstamo pendiente de ${users.deuda.monto} monedas.`, m)
    }

    users.deuda.monto = monto
    users.deuda.vencimiento = Date.now() + 24 * 60 * 60 * 1000
    users.monedas += monto
    users.bloqueado = true

    return conn.reply(
      m.chat,
      `💰 Has pedido ${monto} monedas prestadas.\nTienes que pagar antes de ${new Date(users.deuda.vencimiento).toLocaleString()} con un interés de 5%.`,
      m
    )
  }

  else if (accion === 'pagar') {
    if (users.deuda.monto <= 0) {
      return conn.reply(m.chat, "🚩 No tienes deuda pendiente.", m)
    }

    let pago = parseInt(args[1])

    if (isNaN(pago) || pago <= 0) {
      return conn.reply(m.chat, "🚩 Ingresa un monto válido para pagar.", m)
    }

    if (pago > users.monedas) {
      return conn.reply(m.chat, "🚩 No tienes suficientes monedas para pagar esa cantidad.", m)
    }

    let deudaTotal = Math.ceil(users.deuda.monto * (1 + users.deuda.interes))

    if (pago >= deudaTotal) {
      users.monedas -= deudaTotal
      users.deuda.monto = 0
      users.deuda.vencimiento = null
      users.bloqueado = false

      return conn.reply(
        m.chat,
        `✅ Has pagado tu deuda completa. Todos los comandos están desbloqueados.`,
        m
      )
    } else {
      users.monedas -= pago
      users.deuda.monto = deudaTotal - pago

      return conn.reply(
        m.chat,
        `💸 Pagaste ${pago} monedas. Te queda una deuda de ${users.deuda.monto} monedas.`,
        m
      )
    }
  }

  else {
    return conn.reply(
      m.chat,
      "🚩 Comando desconocido. Usa *pedir* o *pagar*.",
      m
    )
  }
}

handler.command = ['banco2', 'bank2']
handler.tags = ['economy']
handler.register = false
handler.group = true

export default handler