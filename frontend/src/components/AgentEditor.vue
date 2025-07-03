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
    <v-text-field v-model="model" label="Model" />
    <v-btn color="primary" @click="add">Add Agent</v-btn>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({ agents: Array })
const emit = defineEmits(['update'])
const list = ref([...props.agents])

const name = ref('')
const specialization = ref('')
const prompt = ref('')
const model = ref('gpt-3.5-turbo')

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
