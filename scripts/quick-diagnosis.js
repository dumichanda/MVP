// scripts/quick-diagnosis.js
const fs = require('fs')
const path = require('path')

function quickDiagnosis() {
  console.log('🔍 QUICK DIAGNOSIS - MVP Dating App Issues')
  console.log('==========================================')
  console.log('')

  // Check critical files
  const criticalFiles = [
    'app/create/page.tsx',
    'app/profile/page.tsx', 
    'app/chats/page.tsx',
    'app/auth/signin/page.tsx',
    'app/api/auth/signin/route.ts',
    'app/api/auth/me/route.ts',
    'app/api/experiences/route.ts',
    'app/api/profile/route.ts',
    '.env.local',
    'package.json'
  ]

  let missingFiles = []
  let existingFiles = []

  criticalFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      existingFiles.push(file)
    } else {
      missingFiles.push(file)
    }
  })

  console.log('📄 FILE STATUS:')
  existingFiles.forEach(file => {
    console.log(`   ✅ ${file}`)
  })
  
  if (missingFiles.length > 0) {
    console.log('')
    console.log('❌ MISSING FILES:')
    missingFiles.forEach(file => {
      console.log(`   ❌ ${file}`)
    })
  }

  console.log('')
  console.log(`📊 SUMMARY: ${existingFiles.length}/${criticalFiles.length} critical files present`)

  // Check environment
  console.log('')
  console.log('🔧 ENVIRONMENT CHECK:')
  
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8')
      const hasDatabaseUrl = envContent.includes('DATABASE_URL')
      const hasNextAuthSecret = envContent.includes('NEXTAUTH_SECRET')
      
      console.log(`   ${hasDatabaseUrl ? '✅' : '❌'} DATABASE_URL`)
      console.log(`   ${hasNextAuthSecret ? '✅' : '❌'} NEXTAUTH_SECRET`)
    } catch (error) {
      console.log('   ❌ Could not read .env.local')
    }
  } else {
    console.log('   ❌ .env.local file missing')
  }

  // Check package.json dependencies
  console.log('')
  console.log('📦 DEPENDENCIES CHECK:')
  
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      const requiredDeps = ['next', 'react', 'pg', 'bcryptjs', 'jsonwebtoken']
      requiredDeps.forEach(dep => {
        console.log(`   ${deps[dep] ? '✅' : '❌'} ${dep}`)
      })
    } catch (error) {
      console.log('   ❌ Could not read package.json')
    }
  } else {
    console.log('   ❌ package.json missing')
  }

  // Provide recommendations
  console.log('')
  console.log('💡 RECOMMENDATIONS:')
  
  if (missingFiles.length > 0) {
    console.log('   🚨 CRITICAL: Missing page/API files causing 404/405 errors')
    console.log('   ➡️  RUN: node scripts/emergency-fix.js')
  }
  
  if (!fs.existsSync(envPath)) {
    console.log('   ⚠️  Missing environment configuration')
    console.log('   ➡️  Create .env.local with DATABASE_URL and NEXTAUTH_SECRET')
  }

  const needsEmergencyFix = missingFiles.some(file => 
    file.includes('page.tsx') || file.includes('route.ts')
  )

  if (needsEmergencyFix) {
    console.log('')
    console.log('🚨 IMMEDIATE ACTION NEEDED:')
    console.log('   Your app has missing pages/APIs causing the errors you see.')
    console.log('')
    console.log('   RUN THIS NOW:')
    console.log('   node scripts/emergency-fix.js')
    console.log('')
    console.log('   This will:')
    console.log('   • Create all missing pages (/create, /profile, /chats)')
    console.log('   • Create all missing API routes (/api/auth/me, etc)')
    console.log('   • Set up basic database schema')
    console.log('   • Fix all 404 and 405 errors')
  } else {
    console.log('')
    console.log('✅ All critical files present - your app should work!')
  }
}

if (require.main === module) {
  quickDiagnosis()
}

module.exports = { quickDiagnosis }
