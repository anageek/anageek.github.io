import { createHash } from 'crypto'

const password = process.argv[2]

if (!password) {
  console.error('Uso: npm run hash-password -- <sua-senha>')
  process.exit(1)
}

const hash = createHash('sha256').update(password).digest('hex')
console.log(hash)
