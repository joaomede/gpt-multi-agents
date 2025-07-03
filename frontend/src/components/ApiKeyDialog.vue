<template>
  <v-card>
    <v-card-title>OpenAI API Key</v-card-title>
    <v-card-text>
      <v-text-field v-model="key" label="API Key" class="w-100" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineModel, defineEmits } from 'vue'
const emit = defineEmits(['close'])
const modelValue = defineModel()
const key = ref(modelValue.value || '')
function save() {
  modelValue.value = key.value
  emit('close')
}
</script>
