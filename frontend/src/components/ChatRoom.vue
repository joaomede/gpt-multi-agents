<template>
  <v-container fluid class="fill-height pa-2 chat-bg">
    <v-row class="h-100" align="start">
      <v-col cols="3" class="d-flex flex-column pa-2">
        <AgentSelector
          :agents="agents"
          v-model="selectedAgent"
          class="mb-2"
          rounded="lg"
        />
        <v-btn
          block
          class="mb-2"
          prepend-icon="mdi-key"
          rounded="lg"
          @click="apiKeyDialog = true"
        >API Key</v-btn>
        <v-btn
          block
          class="mb-2"
          prepend-icon="mdi-cog"
          rounded="lg"
          @click="settingsDialog = true"
        >Settings</v-btn>
        <v-btn
          block
          class="mb-2"
          prepend-icon="mdi-account-cog"
          rounded="lg"
          @click="agentDialog = true"
        >Agents</v-btn>
      </v-col>
      <v-col cols="9" class="d-flex flex-column pa-2 h-100">
        <div class="flex-grow-1 overflow-auto mb-2" ref="msgContainer">
          <MessageList :messages="messages" />
        </div>
        <div class="d-flex mt-2">
          <v-textarea
            v-model="newMessage"
            label="Your question"
            class="flex-grow-1 w-100 mr-2"
            auto-grow
            rows="1"
            rounded="lg"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <v-btn color="primary" class="send-btn" rounded="lg" @click="sendMessage">Send</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="settingsDialog" width="400">
      <SettingsPanel v-model:history-size="historySize" />
    </v-dialog>
    <v-dialog v-model="agentDialog" width="600">
      <AgentEditor :agents="agents" @update="saveAgents" />
    </v-dialog>
    <v-dialog v-model="apiKeyDialog" width="400">
      <ApiKeyDialog v-model="apiKey" @close="apiKeyDialog = false" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
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
const msgContainer = ref(null)

onMounted(() => {
  const storedAgents = localStorage.getItem('agents')
  const storedMessages = localStorage.getItem('conversation')
  const key = localStorage.getItem('openai_api_key')
  if (storedAgents) agents.value = JSON.parse(storedAgents)
  if (agents.value.length > 0) selectedAgent.value = agents.value[0]
  if (storedMessages) messages.value = JSON.parse(storedMessages)
  if (key) apiKey.value = key
})

watch([agents, apiKey], () => {
  localStorage.setItem('agents', JSON.stringify(agents.value))
  if (apiKey.value) {
    localStorage.setItem('openai_api_key', apiKey.value)
  } else {
    localStorage.removeItem('openai_api_key')
  }
}, { deep: true })

watch(messages, () => {
  localStorage.setItem('conversation', JSON.stringify(messages.value))
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
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

<style scoped>
.chat-bg {
  background: linear-gradient(180deg, #fafafa, #e0e0ff);
}

.send-btn {
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: #1976d2 !important;
}
</style>
