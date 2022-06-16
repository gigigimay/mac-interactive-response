import { getLogger } from 'utilities/logger'

const logger = getLogger('handler/index.ts')

const handler = async (event: any, tenant: string): Promise<void> => {
  console.log('🚀 ~ file: index.ts ~ line 2 ~ handler ~ event', event)
  //
}

export default handler
