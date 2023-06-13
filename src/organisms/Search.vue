<template>
  <div>
    <input
      class="search"
      placeholder="Search for anything..."
      type="search"
      name="search"
      v-model="value"
      autoComplete="off"
      autoFocus
    />
    <ul>
      <blog-card v-for="result in results" :tags="result.tags" :date="result.date" :description="result.description" :slug="result.slug" :title="result.title"/>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import BlogCard from "@/molecules/BlogCard.vue"

const {searchList} = defineProps(['searchList'])
const value = ref("")
const results = computed(() => searchList.filter(si => [si.title, si.description, ...si.tags].find(e => value.value && e.toLowerCase().includes(value.value.toLocaleLowerCase()))))
</script>
<style lang="sass" scoped>
  .search
    @apply block w-full rounded border border-skin-fill border-opacity-40 bg-skin-fill py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-skin-accent focus:outline-none
</style>
