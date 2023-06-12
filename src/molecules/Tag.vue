<template>
  <a :href="`/tags/${name.toLowerCase()}`" class="anchor group">
    <span v-html="Tag" />
    <span>{{name}}</span>
  </a>
</template>
<script setup>
import Tag from "~/tag.svg?raw"
const {name} = defineProps(["name"]);
</script>
<style lang="sass" scoped>
.anchor
  @apply relative  hover:text-skin-accent focus-visible:p-2 -ml-1 opacity-80
  font-style: italic
  margin-right: 8px
  font-size: 14px
  :deep(svg)
    margin-right: -10px
    transform: scale(0.7)
</style>
