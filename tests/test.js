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
  assert.ok(pkg.devDependencies.vite.startsWith('^7'));
  assert.ok(pkg.devDependencies['@vitejs/plugin-vue'].startsWith('^6'));
}

function testDeployWorkflow() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
  assert.ok(fs.existsSync(workflow), 'deploy.yml should exist');
  const content = fs.readFileSync(workflow, 'utf-8');
  assert.ok(/deploy-pages@v4/.test(content), 'workflow should deploy to gh-pages');
}

function testChatRoomHistoryPersistence() {
  const vue = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'src', 'components', 'ChatRoom.vue'), 'utf-8');
  assert.ok(vue.includes('history_size'), 'ChatRoom should persist history size');
}

function testChatRoomUsesTextarea() {
  const vue = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'src', 'components', 'ChatRoom.vue'), 'utf-8');
  assert.ok(/<v-textarea/.test(vue), 'ChatRoom should use v-textarea for message input');
  assert.ok(/auto-grow/.test(vue), 'v-textarea should auto grow');
}

function testChatRoomEnterBehavior() {
  const vue = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'src', 'components', 'ChatRoom.vue'), 'utf-8');
  const pattern = /@keydown\.enter\.exact\.prevent="sendMessage"/;
  assert.ok(pattern.test(vue), 'Enter should send message while Shift+Enter inserts a newline');
}

try {
  testExampleAgentConfig();
  testExampleConversationStructure();
  testFrontendPackageJson();
  testDeployWorkflow();
  testChatRoomHistoryPersistence();
  testChatRoomUsesTextarea();
  testChatRoomEnterBehavior();
  console.log('All tests passed.');
} catch (err) {
  console.error(err);
  process.exit(1);
}
