<template>
  <v-container class="fill-height d-flex flex-column">
    <div class="d-flex align-center mb-2">
      <AgentSelector :agents="agents" v-model="selectedAgent" class="flex-grow-1" />
      <v-btn icon="mdi-key" @click="apiKeyDialog = true"></v-btn>
      <v-btn icon="mdi-cog" @click="settingsDialog = true"></v-btn>
      <v-btn icon="mdi-account-cog" @click="agentDialog = true"></v-btn>
    </div>
    <div class="flex-grow-1 overflow-auto">
      <MessageList :messages="messages" />
    </div>
    <div class="d-flex mt-2">
      <v-text-field v-model="newMessage" label="Your question" class="flex-grow-1" @keyup.enter="sendMessage" />
      <v-btn color="primary" @click="sendMessage">Send</v-btn>
    </div>

    <v-dialog v-model="settingsDialog" width="400">
      <SettingsPanel v-model:history-size="historySize" />
    </v-dialog>
    <v-dialog v-model="agentDialog" width="600">
      <AgentEditor :agents="agents" @update="saveAgents" />
    </v-dialog>
    <v-dialog v-model="apiKeyDialog" width="400">
      <ApiKeyDialog v-model="apiKey" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { callOpenAI } from '../openai.js'
import AgentSelector from './AgentSelector.vue'
import MessageList from './MessageList.vue'
import AgentEditor from './AgentEditor.vue'
import SettingsPanel from './SettingsPanel.vue'
import ApiKeyDialog from './ApiKeyDialog.vue'

const props = {}

const agents = ref([])
const messages = ref([])
const selectedAgent = ref(null)
const historySize = ref(5)
const newMessage = ref('')
const apiKey = ref(localStorage.getItem('openai_api_key') || '')
const settingsDialog = ref(false)
const agentDialog = ref(false)
const apiKeyDialog = ref(false)

onMounted(() => {
  const storedAgents = localStorage.getItem('agents')
  const storedMessages = localStorage.getItem('conversation')
  const key = localStorage.getItem('openai_api_key')
  if (storedAgents) agents.value = JSON.parse(storedAgents)
  if (agents.value.length > 0) selectedAgent.value = agents.value[0]
  if (storedMessages) messages.value = JSON.parse(storedMessages)
  if (key) apiKey.value = key
})

watch([agents, messages, apiKey], () => {
  localStorage.setItem('agents', JSON.stringify(agents.value))
  localStorage.setItem('conversation', JSON.stringify(messages.value))
  if (apiKey.value) {
    localStorage.setItem('openai_api_key', apiKey.value)
  } else {
    localStorage.removeItem('openai_api_key')
  }
}, { deep: true })

function saveAgents(list) {
  agents.value = list
}

async function sendMessage() {
  if (!newMessage.value || !selectedAgent.value) return
  messages.value.push({
    author: 'user',
    specialization: '',
    content: newMessage.value,
    timestamp: new Date().toISOString()
  })
  const context = messages.value.slice(-historySize.value).map(m => ({
    role: m.author === 'user' ? 'user' : 'assistant',
    content: `${m.author}${m.specialization ? ' (' + m.specialization + ')' : ''}: ${m.content}`
  }))
  const system = { role: 'system', content: selectedAgent.value.base_prompt }
  try {
    const reply = await callOpenAI([system, ...context], apiKey.value, selectedAgent.value.model)
    messages.value.push({
      author: selectedAgent.value.name,
      specialization: selectedAgent.value.specialization,
      content: reply,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    messages.value.push({
      author: selectedAgent.value.name,
      specialization: selectedAgent.value.specialization,
      content: 'Error contacting OpenAI API',
      timestamp: new Date().toISOString()
    })
  }
  newMessage.value = ''
}
</script>
