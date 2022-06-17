import { StateNodeConfigType } from 'types/state'

// TODO: send message to appsync
// TODO: dynamic message type (text/flex/etc.)

const sendMessage = (text: string) =>
  new Promise((resolve) => {
    console.log(`🍀 Sending message... "${text}"`)
    setTimeout(() => {
      console.log(`🍀 Message sent! "${text}"`)
      resolve(undefined)
    }, 2000)
  })

export interface SendMessageStateParams {
  next: string
  id: string
  text: string
  errorTarget?: string
}

export const sendMessageState = (
  params: SendMessageStateParams,
): StateNodeConfigType => {
  const { next, id, text, errorTarget } = params
  return {
    id,
    invoke: {
      id: `${id}_invokation`,
      src: () => sendMessage(text),
      onDone: { target: `#${next}` },
      onError: errorTarget,
    },
  }
}
