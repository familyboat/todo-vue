<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import { ref } from 'vue'

const todoStore = useTodoStore()
const task = ref('')

function createTodo() {
  todoStore.createTodoFrom(task.value)
  task.value = ''
}
</script>

<template>
  <div class="form">
    <input type="text" placeholder="请输入任务内容" v-model="task" />
    <button type="button" v-on:click="createTodo">创建</button>
  </div>
</template>

<style lang="css" scoped>
.form {
  display: flex;
  gap: var(--gutter-xs);
}
</style>
