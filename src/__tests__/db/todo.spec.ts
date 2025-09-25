import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import {
  addTodoToDb,
  clearTodoInDb,
  getAllTodosFromDb,
  getTodoInDb,
  markTodoAsDeletedInDb,
  markTodoAsDoneInDb,
} from '../../db/todo'
import { type Todo, TodoStatus } from '../../stores/todo'
import { openDB } from 'idb'

const now = new Date()

const todo: Todo = {
  task: 'test',
  status: TodoStatus.created,
  createdAt: now.toUTCString(),
  modifiedAt: now.toUTCString(),
  uuid: crypto.randomUUID(),
}

describe('testing for indexed db', () => {
  it('globalThis.indexedDB should exist', () => {
    expect(globalThis.indexedDB).toBeInstanceOf(globalThis.IDBFactory)
  })

  it('indexedDB should work', async () => {
    const { promise, resolve } = Promise.withResolvers<IDBDatabase>()
    const dbRequest = indexedDB.open('indexedDB', 1)
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result
      db.createObjectStore('test', {
        keyPath: 'id',
        /**
         * 这个参数是必须的，否则 fake indexed db 无法插入数据，但 window.indexedDB 不受其影响
         */
        autoIncrement: true,
      })
    }
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      resolve(db)
    }

    const db = await promise
    const transaction = db.transaction('test', 'readwrite')
    const objectStore = transaction.objectStore('test')
    objectStore.add({
      title: 'Article 1',
      date: new Date('2019-01-01'),
      body: '…',
    })
  })
})

describe('testing for idb', () => {
  it('idb should word', async () => {
    const dbPromsie = openDB('idb', 1, {
      upgrade(db) {
        // Create a store of objects
        const store = db.createObjectStore('articles', {
          // The 'id' property of the object will be the key.
          keyPath: 'id',
          // If it isn't explicitly set, create a value by auto incrementing.
          // 理由同上
          autoIncrement: true,
        })
        // Create an index on the 'date' property of the objects.
        store.createIndex('date', 'date')
      },
    })

    const db = await dbPromsie
    await db.add('articles', {
      title: 'Article 1',
      date: new Date('2019-01-01'),
      body: '…',
    })
  })
})

describe('testing for todo app db', () => {
  beforeEach(async () => {
    await clearTodoInDb()
  })

  it('getAllTodosFromDb should be empty', async () => {
    const todos = await getAllTodosFromDb()
    expect(todos.length).toBe(0)
  })

  it('addTodoToDb should work', async () => {
    await addTodoToDb(todo)
    const todos = await getAllTodosFromDb()
    expect(todos.length).toBe(1)
  })

  it('markTodoAsDoneInDb and markTodoAsDeletedInDb should work', async () => {
    let innerTodo
    await addTodoToDb(todo)
    await markTodoAsDoneInDb(todo.uuid)
    innerTodo = await getTodoInDb(todo.uuid)
    if (innerTodo) expect(innerTodo.status).toBe(TodoStatus.done)

    await markTodoAsDeletedInDb(todo.uuid)
    innerTodo = await getTodoInDb(todo.uuid)
    if (innerTodo) expect(innerTodo.status).toBe(TodoStatus.deleted)
  })
})
