#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 JWT Secret Generator\n');

// Generate different length secrets
console.log('32-byte (256-bit) secret:');
console.log(crypto.randomBytes(32).toString('hex'));

console.log('\n64-byte (512-bit) secret:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\nBase64 encoded secret:');
console.log(crypto.randomBytes(32).toString('base64'));

console.log('\n📋 Copy one of the above secrets to your .env file');
console.log('Example: JWT_SECRET=your_generated_secret_here');