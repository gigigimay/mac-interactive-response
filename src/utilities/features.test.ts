import {
  mappingTranslations,
  filterAOCClients,
  mappingFeatureFields,
} from './features'
import mockResponse from '../__test__/tenant-config-response-example'

describe('mappingTranslations', () => {
  const clientFeatures = {
    'mac-portal': {
      translations: { title: 'A' },
    },
    aycal: {
      translations: { title: 'B' },
    },
    goldshop: {
      translations: { title: 'C' },
    },
  }
  const expectedResult = {
    'mac-portal': {
      title: 'A',
    },
    aycal: {
      title: 'B',
    },
    goldshop: {
      title: 'C',
    },
  }
  it('should map client features to the shape of resource bundle', () => {
    expect(mappingTranslations(clientFeatures)).toEqual(expectedResult)
  })
})

describe('filterAOCClient', () => {
  it('should filter only client that has aoc configuration and features (C and E)', () => {
    const clientsConfig = [
      { id: 'A', name: 'A', aoc_config: {} },
      { id: 'B', name: 'B', aoc_features: {} },
      { id: 'C', name: 'C', aoc_config: {}, aoc_features: {} },
      { id: 'D', name: 'D' },
      { id: 'E', name: 'E', aoc_config: {}, aoc_features: {} },
    ]

    const result = filterAOCClients(clientsConfig)
    expect(result).toEqual([
      { id: 'C', name: 'C', aoc_config: {}, aoc_features: {} },
      { id: 'E', name: 'E', aoc_config: {}, aoc_features: {} },
    ])
  })
})

describe('mappingFeatureFields', () => {
  const responseConfig = mockResponse[0]
  it('should return correct features shape', () => {
    const features = mappingFeatureFields(responseConfig)
    expect(features).toEqual({
      name: 'aycal',
      tenantId: 'f4c6ac01-e7d1-4642-9152-177982b0829a',
      application: 'aycal:application',
      teams: {
        renew: 'team-[0-5]',
        interested: 'team-6',
        other: 'team-7',
        ask_information: 'team-8',
      },
      workingHour: {
        start: 9,
        end: 18,
      },
      setting: {
        format: {
          currency: {
            decimals: 2,
            showZeroWithDecimals: false,
          },
          integer: {
            decimals: 0,
            showZeroWithDecimals: false,
          },
        },
      },
      translations: {
        button: {
          bought_previously_yes: 'เคยซื้อ123',
        },
      },
      defaultClientUrl: 'https://ccs-dev.appmanteam.com/agent-tools',
      lineLiffUrl: 'https://liff.line.me/1654185430-AYDo0YM9',
      publicAssetVersion: undefined,
    })
  })
})
