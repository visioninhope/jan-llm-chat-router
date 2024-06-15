import { Thread as OpenAiThread } from 'openai/resources/beta/threads/threads'
import { Assistant } from '../assistant'

export interface Thread extends OpenAiThread {
  title: string
  /** Assistants in this thread. **/
  assistants: Assistant[]
}
