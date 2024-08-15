import { createServer } from 'node:http'

import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

app.get('/', (_, res) => {
  res.send('Ok')
})

io.on('connection', (_) => {
  console.log('a new user connected')
})
server.listen(3000, () => {
  console.log('[INFO] Running. port: 3000')
})
