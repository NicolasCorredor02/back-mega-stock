import serverUp from 'root/config/server.js'
import 'dotenv/config'

const server = await serverUp()
const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}/`)
})
