<template>
  <div>
    <h3>Agents</h3>
    <v-list>
      <v-list-item v-for="(agent, i) in list" :key="i">
        {{ agent.name }} - {{ agent.specialization }}
        <v-btn icon="mdi-pencil" size="x-small" class="mr-1" rounded="lg" @click="edit(i)"></v-btn>
        <v-btn icon="mdi-delete" size="x-small" rounded="lg" @click="remove(i)"></v-btn>
      </v-list-item>
    </v-list>
    <v-text-field v-model="name" label="Name" class="w-100 mb-2" rounded="lg" />
    <v-text-field v-model="specialization" label="Specialization" class="w-100 mb-2" rounded="lg" />
    <v-textarea v-model="prompt" label="Base Prompt" class="w-100 mb-2" rounded="lg" />
    <v-select v-model="model" :items="models" label="Model" class="w-100 mb-2" rounded="lg" />
    <div class="d-flex gap-2">
      <v-btn color="primary" rounded="lg" @click="save">{{ editingIndex >= 0 ? 'Save Agent' : 'Add Agent' }}</v-btn>
      <v-btn v-if="editingIndex >= 0" rounded="lg" @click="cancelEdit">Cancel</v-btn>
    </div>
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
const editingIndex = ref(-1)

function edit(i) {
  const agent = list.value[i]
  name.value = agent.name
  specialization.value = agent.specialization
  prompt.value = agent.base_prompt
  model.value = agent.model
  editingIndex.value = i
}

function save() {
  if (!name.value) return
  const data = { name: name.value, specialization: specialization.value, base_prompt: prompt.value, model: model.value }
  if (editingIndex.value >= 0) {
    list.value.splice(editingIndex.value, 1, data)
  } else {
    list.value.push(data)
  }
  emit('update', list.value)
  cancelEdit()
}

function cancelEdit() {
  editingIndex.value = -1
  name.value = specialization.value = prompt.value = ''
  model.value = 'gpt-4o'
}

function remove(i) {
  list.value.splice(i, 1)
  emit('update', list.value)
}
</script>

<style scoped>
.gap-2 > * {
  margin-right: 0.5rem;
}
</style>
