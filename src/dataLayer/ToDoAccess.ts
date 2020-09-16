import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.TodosTable,
        KeyConditionExpression: '#userId = :i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()
    return result.Items as TodoItem[]
  }

  async createTodoItem(todos: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.TodosTable,
        Item: todos
      })
      .promise()
    return todos
  }

  async deleteTodoItem(todos: TodoDelete): Promise<TodoDelete> {
    await this.docClient
      .delete({
        TableName: this.TodosTable,
        Key: todos
      })
      .promise()
    return todos
  }

  async updateTodoItem(todos: TodoUpdate): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.TodosTable,
        Key: {
          userId: todos.userId,
          todoId: todos.todoId
        },
        UpdateExpression: 'set #nameId= :n, dueDate= :d, done= :dn',
        ExpressionAttributeNames: {
          '#nameId': 'name'
        },
        ExpressionAttributeValues: {
          ':n': todos.name,
          ':d': todos.dueDate,
          ':dn': todos.done
        }
      })
      .promise()
    return todos
  }
}

/** Create Dynamo Db */
function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
