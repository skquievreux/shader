const { execSync } = require('child_process');

const skills = [
  // User requested to keep only github, antigravity, and claude.
  // These are likely managed systematically or pre-installed.
  // Preventing automated installation of other external skills.
];

console.log('🚀 Starting automated skills installation...');

skills.forEach(skill => {
  try {
    console.log(`\nInstalling: ${skill}...`);
    // -y to skip confirmation, -g often required for skills CLI but local is standard for project-specific
    // Assuming npx skills add works in current context.
    execSync(`npx skills add ${skill} -y`, { stdio: 'inherit' });
    console.log(`✅ Successfully installed ${skill}`);
  } catch (error) {
    console.error(`❌ Failed to install ${skill}:`, error.message);
  }
});

console.log('\n✨ All requested skills processed.');
