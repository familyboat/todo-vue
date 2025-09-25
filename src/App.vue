<script setup lang="ts">
import { routerConfig } from './configs'
</script>

<template>
  <main class="app">
    <nav class="nav">
      <router-link :to="routerConfig.HomePath"> home </router-link>
      <router-link :to="routerConfig.ToDoPath"> to-do </router-link>
    </nav>

    <article class="article">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </article>
  </main>
</template>

<style scoped>
.app {
  display: flex;
  gap: 20px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--gutter-xs);

  position: relative;
  padding-right: var(--gutter-xs);
}

.nav::after {
  width: 1px;
  height: 100%;
  content: '';
  background-color: gray;
  position: absolute;
  top: 0;
  left: 100%;
}

.nav > * {
  display: flex;
  align-items: center;
}

.nav > *::after {
  content: '👈';
  visibility: hidden;
}
</style>

<style>
.router-link-exact-active {
  color: coral;
  text-decoration: none;
}

.router-link-exact-active::after {
  visibility: visible !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:root {
  --gutter-xs: 4px;
  --gutter-s: 6px;
  --gutter-m: 8px;
  --gutter-l: 12px;
  --gutter-xl: 16px;
}
</style>
