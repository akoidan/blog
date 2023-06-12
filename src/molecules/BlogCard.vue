<template>
  <li class="blog-card">
    <a :href="`/posts/${slug}/`" class="title"><h2 class="title-h2">{{title}}</h2></a>
    <div class="cal-icon">
      <div v-html="Calendar"></div>
      <span>{{strDate}}</span>
    </div>
    <p>{{description}}</p>
    <div>
      <Tag v-for="tag in tags" :name="tag"/>
    </div>
  </li>
</template>
<script setup>
import Calendar from "~/calendar.svg?raw"
import Tag from "@/molecules/Tag.vue"
import {formatDate} from "@/utils/date-utils";
const {description, title, slug, date} = defineProps(['slug', "date", "title", "description", "tags"])
const strDate = formatDate(date);
</script>

<style lang="sass" scoped>
.blog-card
  @apply my-6
.title
  @apply inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0
.title-h2
  @apply text-lg font-medium decoration-dashed hover:underline
.cal-icon
  opacity: 0.8
  display: flex
  margin-left: -3px
  align-items: center
  @apply italic text-sm
  :deep(svg)
    transform: scale(0.7)
</style>
