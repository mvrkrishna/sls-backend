import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'
import { TodoAccess } from '../dataLayer/ToDoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

//multiple references

const bucketName = process.env.S3_BUCKET_NAME
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todoAccess = new TodoAccess()
const logger = createLogger('todos.ts')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getAllTodos(user: string): Promise<TodoItem[]> {
  logger.info('In function: getAllTodos()')

  return await todoAccess.getAllTodos(user)
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  user: string
): Promise<TodoItem> {
  logger.info('In function: createTodoItem()')

  const todoUUID = uuid.v4()
  const item = await todoAccess.createTodoItem({
    userId: user,
    todoId: todoUUID,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoUUID}`
  })
  return item
}

export async function updateTodoItem(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  user: string
): Promise<TodoUpdate> {
  logger.info('In function: updateTodoItem()')

  return await todoAccess.updateTodoItem({
    todoId: todoId,
    userId: user,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodoItem(
  todoId: string,
  user: string
): Promise<TodoDelete> {
  logger.info('In function: deleteTodoItem()', todoId)

  return await todoAccess.deleteTodoItem({
    userId: user,
    todoId: todoId
  })
}

export async function getUploadUrl(todoId: string) {
  logger.info('Function getUploadUrl', todoId)

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}