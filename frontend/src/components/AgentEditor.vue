<template>
  <div>
    <h3>Agents</h3>
    <v-list>
      <v-list-item v-for="(agent, i) in list" :key="i">
        {{ agent.name }} - {{ agent.specialization }}
        <v-btn icon="mdi-delete" size="x-small" @click="remove(i)"></v-btn>
      </v-list-item>
    </v-list>
    <v-text-field v-model="name" label="Name" />
    <v-text-field v-model="specialization" label="Specialization" />
    <v-textarea v-model="prompt" label="Base Prompt" />
    <v-select v-model="model" :items="models" label="Model" />
    <v-btn color="primary" @click="add">Add Agent</v-btn>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const models = [
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4.5-preview',
  'gpt-4o',
  'gpt-4o-audio-preview',
  'gpt-4o-realtime-preview',
  'gpt-4o-mini',
  'gpt-4o-mini-audio-preview',
  'gpt-4o-mini-realtime-preview',
  'o1',
  'o1-pro',
  'o3-pro',
  'o3',
  'o3-deep-research',
  'o4-mini',
  'o4-mini-deep-research',
  'o3-mini',
  'o1-mini',
  'codex-mini-latest',
  'gpt-4o-mini-search-preview',
  'gpt-4o-search-preview',
  'computer-use-preview',
  'gpt-image-1'
]

const props = defineProps({ agents: Array })
const emit = defineEmits(['update'])
const list = ref([...props.agents])

const name = ref('')
const specialization = ref('')
const prompt = ref('')
const model = ref('gpt-4o')

function add() {
  if (!name.value) return
  list.value.push({ name: name.value, specialization: specialization.value, base_prompt: prompt.value, model: model.value })
  emit('update', list.value)
  name.value = specialization.value = prompt.value = ''
}

function remove(i) {
  list.value.splice(i, 1)
  emit('update', list.value)
}
</script>
