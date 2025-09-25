import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import 'fake-indexeddb/auto'
import { Todo, TodoStatus, useTodoStore } from '../../stores/todo'
import { addTodoToDb } from '../../db/todo'

describe('todo store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loadFromDb should work', async () => {
    const now = new Date()
    const todo: Todo = {
      task: 'task 1',
      status: TodoStatus.created,
      createdAt: now.toUTCString(),
      modifiedAt: now.toUTCString(),
      uuid: crypto.randomUUID(),
    }
    await addTodoToDb(todo)

    const todoStore = useTodoStore()
    await todoStore.loadFromDb()
    expect(todoStore.todoList.length).toBe(1)
  })

  it('createTodoFrom should work', () => {
    const todoStore = useTodoStore()
    expect(todoStore.todoList.length).toBe(0)
    const task = 'task 1'
    todoStore.createTodoFrom(task)
    expect(todoStore.todoList.length).toBe(1)
  })
})
