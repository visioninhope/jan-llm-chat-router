import { ContentType, MessageContent, ThreadMessage } from '@janhq/core'

import { FileInfo } from '@/containers/Providers/Jotai'

import { MessageRequestBuilder } from './messageRequestBuilder'

export class ThreadMessageBuilder {
  messageRequest: MessageRequestBuilder

  content: MessageContent[] = []

  constructor(messageRequest: MessageRequestBuilder) {
    this.messageRequest = messageRequest
  }

  build(): ThreadMessage {
    const timestamp = Date.now()
    return {
      id: this.messageRequest.msgId,
      thread_id: this.messageRequest.thread.id,
      role: 'user',
      status: 'completed',
      created_at: timestamp,
      object: 'thread.message',
      content: this.content,
      assistant_id: null,
      attachments: null,
      completed_at: null,
      incomplete_at: null,
      incomplete_details: null,
      metadata: undefined,
      run_id: null,
    }
  }

  pushMessage(
    prompt: string,
    base64: string | undefined,
    fileUpload: FileInfo[]
  ) {
    if (base64 && fileUpload[0]?.type === 'image') {
      this.content.push({
        type: ContentType.Image,
        text: {
          value: prompt,
          annotations: [base64],
        },
      })
    }

    if (base64 && fileUpload[0]?.type === 'pdf') {
      this.content.push({
        type: ContentType.Pdf,
        text: {
          value: prompt,
          annotations: [base64],
          name: fileUpload[0].file.name,
          size: fileUpload[0].file.size,
        },
      })
    }

    if (prompt && !base64) {
      this.content.push({
        type: ContentType.Text,
        text: {
          value: prompt,
          annotations: [],
        },
      })
    }
    return this
  }
}
