export interface Message {
  id: string
  chatId: string
  createdDatetime: string
  type: string
  content: {
    text?: string
    flex?: string
    image?: string
    template?: string
  }
  source: {
    roomId: string
    channel: string
    owner: string
  }
}

export enum UsageType {
  Auto = 'Auto',
  Manual = 'Manual',
}
