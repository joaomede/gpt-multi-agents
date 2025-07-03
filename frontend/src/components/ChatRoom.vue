<template>
  <v-container>
    <AgentSelector :agents="agents" v-model="selectedAgent" />
    <MessageList :messages="messages" />
    <v-text-field v-model="newMessage" label="Your question" />
    <v-btn color="primary" @click="sendMessage">Send</v-btn>
    <SettingsPanel v-model:history-size="historySize" />
    <AgentEditor :agents="agents" @update="saveAgents" />
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { callOpenAI } from '../openai.js'
import AgentSelector from './AgentSelector.vue'
import MessageList from './MessageList.vue'
import AgentEditor from './AgentEditor.vue'
import SettingsPanel from './SettingsPanel.vue'

const props = {}

const agents = ref([])
const messages = ref([])
const selectedAgent = ref(null)
const historySize = ref(5)
const newMessage = ref('')
const apiKey = ref(localStorage.getItem('openai_api_key') || '')

onMounted(() => {
  const storedAgents = localStorage.getItem('agents')
  const storedMessages = localStorage.getItem('conversation')
  const key = localStorage.getItem('openai_api_key')
  if (storedAgents) agents.value = JSON.parse(storedAgents)
  if (agents.value.length > 0) selectedAgent.value = agents.value[0]
  if (storedMessages) messages.value = JSON.parse(storedMessages)
  if (key) apiKey.value = key
})

watch([agents, messages], () => {
  localStorage.setItem('agents', JSON.stringify(agents.value))
  localStorage.setItem('conversation', JSON.stringify(messages.value))
  if (apiKey.value) localStorage.setItem('openai_api_key', apiKey.value)
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
