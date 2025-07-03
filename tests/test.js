const assert = require('assert');
const fs = require('fs');
const path = require('path');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', p), 'utf-8'));
}

function testExampleAgentConfig() {
  const data = loadJson('agents/example_agent.json');
  assert.strictEqual(data.name, 'HelperBot');
  assert.ok('specialization' in data);
  assert.ok('base_prompt' in data);
  assert.ok('model' in data);
  assert.strictEqual(typeof data.model, 'string');
}

function testExampleConversationStructure() {
  const history = loadJson('examples/example_conversation.json');
  assert.ok(Array.isArray(history));
  const first = history[0];
  ['author', 'specialization', 'content', 'timestamp'].forEach(key => {
    assert.ok(key in first);
  });
}

function testFrontendPackageJson() {
  const pkg = loadJson('frontend/package.json');
  assert.ok(pkg.dependencies.vue);
  assert.ok(pkg.dependencies.vuetify);
  assert.ok(pkg.dependencies.openai);
  assert.ok(pkg.dependencies['@mdi/font']);
  assert.ok(pkg.devDependencies.vite.startsWith('^4'));
  assert.ok(pkg.devDependencies['@vitejs/plugin-vue'].startsWith('^4'));
}

function testDeployWorkflow() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
  assert.ok(fs.existsSync(workflow), 'deploy.yml should exist');
  const content = fs.readFileSync(workflow, 'utf-8');
  assert.ok(/actions-gh-pages/.test(content), 'workflow should deploy to gh-pages');
}

try {
  testExampleAgentConfig();
  testExampleConversationStructure();
  testFrontendPackageJson();
  testDeployWorkflow();
  console.log('All tests passed.');
} catch (err) {
  console.error(err);
  process.exit(1);
}
