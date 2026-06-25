const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))

app.ws('/ws', (ws, req) => {
  connects.push(ws)

  ws.on('message', (message) => {
    console.log('Received:', message)

    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        // Check if the connection is open
        socket.send(message)
      }
    })
  })

  ws.on('close', () => {
    connects = connects.filter((conn) => conn !== ws)
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

function rollDice() {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ]
}

function judgeDice(dice) {
  const d = [...dice].sort((a, b) => a - b)

  if (d[0] === 1 && d[1] === 1 && d[2] === 1) {
    return 'ピンゾロ'
  }

  if (d[0] === 4 && d[1] === 5 && d[2] === 6) {
    return 'シゴロ'
  }

  if (d[0] === 1 && d[1] === 2 && d[2] === 3) {
    return 'ヒフミ'
  }

  if (d[0] === d[1] && d[1] === d[2]) {
    return `${d[0]}のゾロ目`
  }

  if (d[0] === d[1]) {
    return `${d[2]}の目`
  }

  if (d[1] === d[2]) {
    return `${d[0]}の目`
  }

  return '目なし'
}