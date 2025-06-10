const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=')
        if (key && values.length) {
          process.env[key.trim()] = values.join('=').trim()
        }
      })
    }
  } catch (error) {
    console.log('No .env.local file found, using system environment variables')
  }
}
