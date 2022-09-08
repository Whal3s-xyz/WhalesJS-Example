<script>

import HomePage from "@/components/HomePage";
import EventCondition from "@/components/EventCondition";
const routes = {
  '/': HomePage,
  '/event-condition': EventCondition
}

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || null
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      this.currentPath = window.location.hash
    })
  }
}
</script>

<template>

  <component :is="currentView" />

</template>

<style scoped>

</style>
