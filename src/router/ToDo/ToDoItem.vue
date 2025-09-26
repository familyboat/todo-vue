<script setup lang="ts">
import type { Todo } from '@/stores/todo'
import { isCreated, isDeleted, isDone, serializeUTC, useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

function done(uuid: string) {
  todoStore.markTodoAsDone(uuid)
}

function deleted(uuid: string) {
  todoStore.markTodoAsDeleted(uuid)
}

function undo(uuid: string) {
  todoStore.markTodoAsCreated(uuid)
}

defineProps<{
  index: number
  todo: Todo
}>()
</script>

<template>
  <li class="item" :key="todo.uuid">
    <span> {{ index }}. </span>
    <span :class="{ done: isDone(todo), deleted: isDeleted(todo) }">
      {{ todo.task }}
    </span>
    <span> 创建于 {{ serializeUTC(todo.createdAt) }} </span>
    <button type="button" v-on:click="done(todo.uuid)" v-if="isCreated(todo)">完成</button>
    <button type="button" v-on:click="deleted(todo.uuid)" v-if="isCreated(todo)">删除</button>
    <button type="button" v-on:click="undo(todo.uuid)" v-if="!isCreated(todo)">回退</button>
  </li>
</template>

<style lang="css" scoped>
.item {
  display: flex;
  gap: var(--gutter-xs);
  align-items: baseline;
  flex-wrap: wrap;
}

.done {
  text-decoration-line: line-through;
  text-decoration-color: coral;
}

.deleted {
  text-decoration-line: line-through;
  text-decoration-style: wavy;
  text-decoration-color: coral;
}
</style>
