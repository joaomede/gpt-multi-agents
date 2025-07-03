<template>
  <v-select
    :items="agents"
    item-title="name"
    return-object
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    label="Select Agent"
  ></v-select>
</template>

<script setup>
const props = defineProps({
  agents: Array,
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])
</script>
