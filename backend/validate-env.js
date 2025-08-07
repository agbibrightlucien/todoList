/**
 * Environment validation script
 * Run this to check if all environment variables are properly configured
 */

const { validateEnvironment, displayConfig } = require('./config/environment');

console.log('🔍 Validating TodoFlow Backend Environment Configuration...\n');

try {
  validateEnvironment();
  displayConfig();
  console.log('\n✅ Environment validation completed successfully!');
  console.log('👍 You can safely start the server with: npm run dev');
} catch (error) {
  console.error('\n❌ Environment validation failed!');
  console.error(error.message);
  process.exit(1);
}
