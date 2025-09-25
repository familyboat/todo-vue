<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import ToDoItem from './ToDoItem.vue'
import { onMounted } from 'vue'

const todoStore = useTodoStore()

onMounted(() => {
  todoStore.loadFromDb()
})
</script>

<template>
  <TransitionGroup name="fade-todo" class="list" tag="ul">
    <header key="created">已创建：</header>
    <template v-for="(todo, index) in todoStore.createdTodoList" :key="todo.uuid">
      <to-do-item :index="index" :todo="todo" />
    </template>
    <hr key="created-hr" />

    <header key="done">已完成：</header>
    <template v-for="(todo, index) in todoStore.doneTodoList" :key="todo.uuid">
      <to-do-item :index="index" :todo="todo" />
    </template>
    <hr key="done-hr" />

    <header key="deleted">已删除：</header>
    <template v-for="(todo, index) in todoStore.deletedTodoList" :key="todo.uuid">
      <to-do-item :index="index" :todo="todo" />
    </template>
  </TransitionGroup>
</template>

<style lang="css" scoped>
.list {
  position: relative;

  padding: 0;
  list-style-type: none;

  display: flex;
  flex-direction: column;
  gap: var(--gutter-s);
}
</style>

<style>
/* 1. declare transition */
.fade-todo-move,
.fade-todo-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-todo-enter-from {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
</style>
