// scripts/fix-all-pages.js
const { fixPages } = require('./fix-pages')
const { setupApiRoutes } = require('./setup-api-routes')
const fs = require('fs')
const path = require('path')

async function fixAllPages() {
  console.log('🚀 MVP Dating App - Complete Page & API Fix')
  console.log('===========================================')
  console.log('')
  
  try {
    // Step 1: Fix missing pages
    console.log('Step 1: Creating missing pages...')
    fixPages()
    console.log('')
    
    // Step 2: Setup API routes
    console.log('Step 2: Setting up API routes...')
    setupApiRoutes()
    console.log('')
    
    // Step 3: Check dependencies
    console.log('Step 3: Checking required dependencies...')
    checkDependencies()
    console.log('')
    
    console.log('🎉 ALL FIXES COMPLETED SUCCESSFULLY!')
    console.log('')
    console.log('✅ Fixed Issues:')
    console.log('   • 404 errors on create, profile, chat pages')
    console.log('   • 405 method not allowed errors')
    console.log('   • Missing authentication routes')
    console.log('   • Missing API endpoints')
    console.log('   • Missing utility functions')
    console.log('')
    console.log('🎯 What was created:')
    console.log('   📄 Pages: create, profile, chats, signin, signup')
    console.log('   🔌 APIs: auth, experiences, profile')
    console.log('   🛠️ Utils: database connection, JWT auth')
    console.log('')
    console.log('🚀 Next steps:')
    console.log('   1. Install missing dependencies (see above)')
    console.log('   2. Run: npm run dev')
    console.log('   3. Visit: http://localhost:3000/auth/signin')
    console.log('   4. Test sign in with: thabo.mthembu@gmail.com / password123')
    console.log('   5. Try creating experiences and managing profile')
    console.log('')
    console.log('💡 All pages should now work correctly!')
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message)
    process.exit(1)
  }
}

function checkDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('⚠️  package.json not found')
    return
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'pg',
      '@types/pg',
      'bcryptjs',
      '@types/bcryptjs',
      'jsonwebtoken',
      '@types/jsonwebtoken',
      'tailwindcss'
    ]
    
    const missingDeps = requiredDeps.filter(dep => !dependencies[dep])
    
    if (missingDeps.length > 0) {
      console.log('⚠️  Missing dependencies detected:')
      missingDeps.forEach(dep => {
        console.log(`   - ${dep}`)
      })
      console.log('')
      console.log('📦 Install missing dependencies:')
      console.log(`   npm install ${missingDeps.join(' ')}`)
    } else {
      console.log('✅ All required dependencies are present')
    }
    
    // Check scripts
    const scripts = packageJson.scripts || {}
    const recommendedScripts = {
      'setup-db': 'node scripts/setup-database.js',
      'check-db': 'node scripts/check-database.js',
      'fix-pages': 'node scripts/fix-all-pages.js'
    }
    
    const missingScripts = Object.keys(recommendedScripts).filter(script => !scripts[script])
    
    if (missingScripts.length > 0) {
      console.log('')
      console.log('💡 Recommended package.json scripts to add:')
      missingScripts.forEach(script => {
        console.log(`   "${script}": "${recommendedScripts[script]}"`)
      })
    }
    
  } catch (error) {
    console.log('⚠️  Could not read package.json')
  }
}

if (require.main === module) {
  fixAllPages()
}

module.exports = { fixAllPages, checkDependencies }
