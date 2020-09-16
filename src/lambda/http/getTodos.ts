import 'source-map-support/register'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/ToDo'

const logger = createLogger('getTodos.ts')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Going to event: ', event)

  const user = getUserId(event)
  const items = await getAllTodos(user)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      'Access-Control-Allow-Headers': 'Accept'
    },
    body: JSON.stringify({
      items
    })
  }
}
