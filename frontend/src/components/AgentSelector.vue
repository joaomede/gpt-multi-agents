<template>
  <v-select
    :items="agents"
    item-title="name"
    return-object
    v-model="modelValue"
    label="Select Agent"
  ></v-select>
</template>

<script setup>
import { watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  agents: Array,
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, v => emit('update:modelValue', v))
</script>
