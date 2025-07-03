<template>
  <v-card>
    <v-card-title class="text-h6">Settings</v-card-title>
    <v-card-text>
      <v-text-field type="number" v-model.number="history" label="History Size" class="w-100" rounded="lg" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
const props = defineProps({ historySize: Number })
const emit = defineEmits(['update:history-size'])
const history = ref(props.historySize || 5)
watch(history, value => emit('update:history-size', value))
</script>
