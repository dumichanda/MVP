#!/usr/bin/env node

// scripts/dev-with-db-check.js - Start development with database check
const { spawn } = require('child_process');
const { checkDatabaseConnection, runMigrations } = require('./check-database');

async function startDevelopment() {
  console.log('🚀 Starting Mavuso Development Server');
  console.log('=====================================');
  console.log('');
  
  try {
    // Step 1: Check database
    console.log('Step 1: Database Health Check');
    const status = await checkDatabaseConnection();
    
    if (!status.connected) {
      console.error('💥 Cannot start development server without database');
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('   1. Check your .env.local file exists');
      console.log('   2. Verify DATABASE_URL is set correctly');
      console.log('   3. Ensure your Neon database is running');
      process.exit(1);
    }
    
    // Step 2: Setup database if needed
    if (!status.tablesExist || !status.hasData) {
      console.log('');
      console.log('Step 2: Database Setup');
      await runMigrations();
    }
    
    console.log('');
    console.log('Step 3: Starting Next.js Development Server');
    console.log('===========================================');
    
    // Step 3: Start Next.js dev server
    const nextDev = spawn('npm', ['run', 'next-dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    nextDev.on('close', (code) => {
      console.log(`Development server exited with code ${code}`);
    });
    
    nextDev.on('error', (error) => {
      console.error('Failed to start development server:', error);
      process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development server...');
      nextDev.kill('SIGINT');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('💥 Failed to start development:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startDevelopment();
}