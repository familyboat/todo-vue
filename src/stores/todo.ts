import {
  addTodoToDb,
  editTaskInTodoInDb,
  getAllTodosFromDb,
  markTodoAsCreatedInDb,
  markTodoAsDeletedInDb,
  markTodoAsDoneInDb,
} from '@/db/todo'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 日期的字符串形式，时区用 UTC。
 */
type DateString = string

export const TodoStatus = {
  /**
   * 已创建
   */
  created: 0,
  /**
   * 已完成
   */
  done: 1,
  /**
   * 已删除
   */
  deleted: 2,
} as const

export type TodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus]

/**
 * 对 todo 的状态值序列化
 */
export function serializeTodoStatus(status: TodoStatus) {
  switch (status) {
    case TodoStatus.created: {
      return '已创建'
    }
    case TodoStatus.done: {
      return '已完成'
    }
    case TodoStatus.deleted: {
      return '已删除'
    }
  }
}

/**
 * 对 UTC 值序列化
 */
export function serializeUTC(utc: string) {
  return new Date(utc).toLocaleString()
}

/**
 * 标明 todo 的状态是否为：已完成
 */
export function isDone(todo: Todo) {
  return todo.status === TodoStatus.done
}

/**
 * 标明 todo 的状态是否为：已删除
 */
export function isDeleted(todo: Todo) {
  return todo.status === TodoStatus.deleted
}

/**
 * 标明 todo 的状态是否为：已创建
 */
export function isCreated(todo: Todo) {
  return todo.status === TodoStatus.created
}

/**
 * 描述 todo 的属性结构
 */
export interface Todo {
  /**
   * 待处理的任务
   */
  task: string
  /**
   * 标明该任务的状态：已创建、已完成、已删除
   *
   * 以下状态变化是合理的：
   * 1. 已创建 -> 已完成
   * 2. 已创建 -> 已删除
   * 3. 已完成 -> 已删除
   */
  status: TodoStatus
  /**
   * 任务创建的时间
   */
  createdAt: DateString
  /**
   * 任务修改的时间
   *
   * 已完成或已删除的任务不可修改
   */
  modifiedAt: DateString
  /**
   * 任务的唯一编号
   */
  uuid: string
}

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Array<Todo>>([])

  /**
   * 从指派的 task 创建一个新的 todo
   */
  function createTodoFrom(task: string) {
    if (task === '') return

    const now = new Date()

    const todo: Todo = {
      task,
      status: TodoStatus.created,
      createdAt: now.toUTCString(),
      modifiedAt: now.toUTCString(),
      uuid: crypto.randomUUID(),
    }

    todoList.value.push(todo)

    addTodoToDb(todo)
  }

  /**
   * 对 todo 的 task 进行编辑
   */
  function editTaskInTodo(uuid: string, task: string) {
    const target = todoList.value.find((todo) => todo.uuid === uuid)
    if (target && target.task !== task) {
      const now = new Date()
      target.task = task
      target.modifiedAt = now.toUTCString()
      editTaskInTodoInDb(target)
    }
  }

  /**
   * 将已完成的 todo 的状态修改为 done
   */
  function markTodoAsDone(uuid: string) {
    const target = todoList.value.find((todo) => todo.uuid === uuid)
    if (target) {
      target.status = TodoStatus.done
      markTodoAsDoneInDb(uuid)
    }
  }

  /**
   * 将已删除的 todo 的状态修改为 deleted
   */
  function markTodoAsDeleted(uuid: string) {
    const target = todoList.value.find((todo) => todo.uuid === uuid)
    if (target) {
      target.status = TodoStatus.deleted
      markTodoAsDeletedInDb(uuid)
    }
  }

  /**
   * 将回退为已创建的 todo 的状态修改为 created
   */
  function markTodoAsCreated(uuid: string) {
    const target = todoList.value.find((todo) => todo.uuid === uuid)
    if (target) {
      target.status = TodoStatus.created
      markTodoAsCreatedInDb(uuid)
    }
  }

  /**
   * 返回状态为已创建的 todo 列表
   */
  const createdTodoList = computed(() => {
    return todoList.value.filter((todo) => todo.status === TodoStatus.created)
  })

  /**
   * 返回状态为已完成的 todo 列表
   */
  const doneTodoList = computed(() => {
    return todoList.value.filter((todo) => todo.status === TodoStatus.done)
  })

  /**
   * 返回状态为已删除的 todo 列表
   */
  const deletedTodoList = computed(() => {
    return todoList.value.filter((todo) => todo.status === TodoStatus.deleted)
  })

  /**
   * 从数据库中加载 todo 列表
   */
  async function loadFromDb() {
    const _todoList = await getAllTodosFromDb()
    todoList.value = _todoList
  }

  return {
    todoList,
    createdTodoList,
    doneTodoList,
    deletedTodoList,

    createTodoFrom,
    editTaskInTodo,
    markTodoAsDone,
    markTodoAsDeleted,
    markTodoAsCreated,
    loadFromDb,
  }
})
