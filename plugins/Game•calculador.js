const handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, `🚩 *Menciona a un usuario o escribe un nombre.*`, m)

  const percentages = Math.floor(Math.random() * 101)

  let emoji = ''
  let description = ''

  const upper = text.toUpperCase()

  switch (command) {
    case 'gay':
      emoji = '🏳️‍🌈'
      if (percentages < 30) {
        description = `💙 Los cálculos han arrojado que ${upper} es *${percentages}%* Gay ${emoji}\n> ✰ Nivel bajo, casi normal.`
      } else if (percentages < 70) {
        description = `🖤 Los cálculos han arrojado que ${upper} es *${percentages}%* Gay ${emoji}\n> ✰ Sospechoso... bastante sospechoso.`
      } else {
        description = `💜 Los cálculos han arrojado que ${upper} es *${percentages}%* Gay ${emoji}\n> ✰ Confirmado por la NASA.`
      }
      break

    case 'lesbiana':
      emoji = '🏳️‍🌈'
      if (percentages < 30) {
        description = `👻 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Curiosidad leve.`
      } else if (percentages < 70) {
        description = `💗 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Hay sentimientos ocultos.`
      } else {
        description = `❣️ ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Amor extremo detectado.`
      }
      break

    case 'pajero':
    case 'pajera':
      emoji = '😏💦'
      if (percentages < 30) {
        description = `🧡 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Bastante tranquilo.`
      } else if (percentages < 70) {
        description = `💞 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Nivel promedio de actividad.`
      } else {
        description = `💖 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Necesita descanso urgente.`
      }
      break

    case 'puto':
    case 'puta':
      emoji = '🔥🥵'
      if (percentages < 30) {
        description = `😼 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Aún tiene salvación.`
      } else if (percentages < 70) {
        description = `😻 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Ya está en el camino.`
      } else {
        description = `💋 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Profesional certificado.`
      }
      break

    case 'manco':
    case 'manca':
      emoji = '💩'
      if (percentages < 30) {
        description = `🌟 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Aún puede mejorar.`
      } else if (percentages < 70) {
        description = `🥷 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Problemas de habilidad.`
      } else {
        description = `💀 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Caso perdido.`
      }
      break

    case 'rata':
      emoji = '🐁'
      if (percentages < 30) {
        description = `💥 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ No es tan rata.`
      } else if (percentages < 70) {
        description = `💰 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Le gusta ahorrar demasiado.`
      } else {
        description = `👑 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Rey de la rata economía.`
      }
      break

    case 'prostituto':
    case 'prostituta':
      emoji = '🫦👅'
      if (percentages < 30) {
        description = `❀ ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Bajo nivel de actividad.`
      } else if (percentages < 70) {
        description = `✨ ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Negocio activo.`
      } else {
        description = `💖 ${upper} es *${percentages}%* ${command} ${emoji}\n> ✰ Empresa registrada oficialmente.`
      }
      break

    default:
      return conn.reply(m.chat, `☁️ Comando inválido.`, m)
  }

  const responses = [
    "El universo ha hablado.",
    "Los científicos lo confirman.",
    "Resultado procesado por IA.",
    "Análisis completado con éxito.",
    "Sistema emocional activado."
  ]

  const response = responses[Math.floor(Math.random() * responses.length)]

  const cal = `💫 *CALCULADORA SOCIAL*

${description}

➤ ${response}`.trim()

  const loadingSteps = [
    "《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
    "《 ████▒▒▒▒▒▒▒▒》30%",
    "《 ███████▒▒▒▒▒》50%",
    "《 ██████████▒▒》80%",
    "《 ████████████》100%"
  ]

  const { key } = await conn.sendMessage(
    m.chat,
    { text: `🤍 Analizando sujeto...` },
    { quoted: m }
  )

  for (let i = 0; i < loadingSteps.length; i++) {
    await new Promise(r => setTimeout(r, 700))
    await conn.sendMessage(m.chat, {
      text: loadingSteps[i],
      edit: key
    })
  }

  await conn.sendMessage(m.chat, {
    text: cal,
    edit: key
  })
}

handler.help = [
  'gay', 'lesbiana', 'pajero', 'pajera',
  'puto', 'puta', 'manco', 'manca',
  'rata', 'prostituta', 'prostituto'
]

handler.tags = ['fun']
handler.register = false
handler.group = true
handler.command = [
  'gay', 'lesbiana', 'pajero', 'pajera',
  'puto', 'puta', 'manco', 'manca',
  'rata', 'prostituta', 'prostituto'
]

export default handler