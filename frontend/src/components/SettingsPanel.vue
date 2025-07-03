<template>
  <div>
    <v-text-field type="number" v-model.number="history" label="History Size" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
const props = defineProps({ historySize: Number })
const emit = defineEmits(['update:history-size'])
const history = ref(props.historySize || 5)
watch(history, value => emit('update:history-size', value))
</script>
