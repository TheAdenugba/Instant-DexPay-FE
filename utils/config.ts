import { http, createConfig } from '@wagmi/core'
import { bsc, bscTestnet } from '@wagmi/core/chains'

export const config = createConfig({
    chains: [bsc, bscTestnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [bsc.id]: http(),
        [bscTestnet.id]: http(),
    },
});