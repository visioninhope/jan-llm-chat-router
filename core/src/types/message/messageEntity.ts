import {
  MessageContent as OpenAiMessageContent,
  Message as OpenAiMessage,
} from 'openai/resources/beta/threads/messages'
import { ChatCompletionMessage } from '../inference'
import { ModelInfo } from '../model'
import { Thread } from '../thread'

export interface ThreadMessage extends OpenAiMessage {}

/**
 * The `MessageRequest` type defines the shape of a new message request object.
 * @data_transfer_object
 */
export type MessageRequest = {
  id?: string

  /**
   * @deprecated Use thread object instead
   * The thread id of the message request.
   */
  threadId: string

  /**
   * The assistant id of the message request.
   */
  assistantId?: string

  /** Messages for constructing a chat completion request **/
  messages?: ChatCompletionMessage[]

  /** Settings for constructing a chat completion request **/
  model?: ModelInfo

  /** The thread of this message is belong to. **/
  // TODO: deprecate threadId field
  thread?: Thread

  type?: string
}

export enum ErrorCode {
  InvalidApiKey = 'invalid_api_key',

  InsufficientQuota = 'insufficient_quota',

  InvalidRequestError = 'invalid_request_error',

  Unknown = 'unknown',
}

/**
 * The content type of the message.
 */
export enum ContentType {
  Text = 'text',
  Image = 'image',
  Pdf = 'pdf',
}

/**
 * The `MessageContent` type defines the shape of a message's content object
 * @data_transfer_object
 */
export type MessageContent = OpenAiMessageContent
