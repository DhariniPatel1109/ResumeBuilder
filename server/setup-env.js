#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
const templatePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

// Copy template to .env
if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, envPath);
  console.log('✅ Created .env file from template');
  console.log('📝 Edit .env file to customize your configuration');
} else {
  console.log('❌ Template file not found');
  process.exit(1);
}
