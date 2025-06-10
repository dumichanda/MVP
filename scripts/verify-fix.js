// scripts/verify-fix.js
const fs = require('fs')
const path = require('path')

function verifyFix() {
  console.log('🔍 Verifying page and API fixes...')
  console.log('')
  
  const checks = [
    {
      name: 'Create Offer page',
      path: path.join(process.cwd(), 'app', 'create', 'page.tsx'),
      required: true
    },
    {
      name: 'Profile page', 
      path: path.join(process.cwd(), 'app', 'profile', 'page.tsx'),
      required: true
    },
    {
      name: 'Chat page',
      path: path.join(process.cwd(), 'app', 'chats', 'page.tsx'),
      required: true
    },
    {
      name: 'Sign In page',
      path: path.join(process.cwd(), 'app', 'auth', 'signin', 'page.tsx'),
      required: true
    },
    {
      name: 'Sign Up page',
      path: path.join(process.cwd(), 'app', 'auth', 'signup', 'page.tsx'),
      required: true
    },
    {
      name: 'Auth Sign In API',
      path: path.join(process.cwd(), 'app', 'api', 'auth', 'signin', 'route.ts'),
      required: true
    },
    {
      name: 'Auth Sign Up API',
      path: path.join(process.cwd(), 'app', 'api', 'auth', 'signup', 'route.ts'),
      required: true
    },
    {
      name: 'Experiences API',
      path: path.join(process.cwd(), 'app', 'api', 'experiences', 'route.ts'),
      required: true
    },
    {
      name: 'Profile API',
      path: path.join(process.cwd(), 'app', 'api', 'profile', 'route.ts'),
      required: true
    },
    {
      name: 'Auth utility',
      path: path.join(process.cwd(), 'lib', 'auth.ts'),
      required: true
    },
    {
      name: 'Database utility',
      path: path.join(process.cwd(), 'lib', 'db.ts'),
      required: true
    }
  ]
  
  let allGood = true
  let fixedCount = 0
  
  checks.forEach(check => {
    const exists = fs.existsSync(check.path)
    if (exists) {
      console.log(`✅ ${check.name}`)
      fixedCount++
    } else {
      console.log(`❌ ${check.name} - MISSING`)
      if (check.required) {
        allGood = false
      }
    }
  })
  
  console.log('')
  console.log(`📊 Results: ${fixedCount}/${checks.length} files present`)
  
  if (allGood) {
    console.log('🎉 All required files are present!')
    console.log('')
    console.log('🚀 Your app should now work correctly:')
    console.log('   • Create offer page: /create')
    console.log('   • Profile page: /profile') 
    console.log('   • Chat page: /chats')
    console.log('   • Sign in: /auth/signin')
    console.log('   • Sign up: /auth/signup')
    console.log('')
    console.log('🧪 Test the fixes:')
    console.log('   1. npm run dev')
    console.log('   2. Visit each page URL')
    console.log('   3. Try creating an account and experience')
    console.log('')
    console.log('💡 Test accounts (password: password123):')
    console.log('   - thabo.mthembu@gmail.com (Cape Town)')
    console.log('   - naledi.williams@outlook.com (Cape Town)')
    console.log('   - sipho.maharaj@gmail.com (Johannesburg)')
    console.log('   - nomsa.dlamini@gmail.com (Soweto)')
  } else {
    console.log('❌ Some required files are missing')
    console.log('🔧 Run: node scripts/fix-all-pages.js')
  }
}

if (require.main === module) {
  verifyFix()
}

module.exports = { verifyFix }
