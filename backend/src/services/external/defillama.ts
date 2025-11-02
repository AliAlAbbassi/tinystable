import { DefiLlamaProtocolResponse } from '../vault/types';

const DEFILLAMA_AAVE_URL = 'https://api.llama.fi/protocol/aave';

export const getAaveTvl = async (): Promise<number> => {
    const aaveDataResponse = await fetch(DEFILLAMA_AAVE_URL);
    if (!aaveDataResponse.ok) {
        console.error('Failed to fetch Aave TVL from DefiLlama');
        return 0;
    }
    const aaveData: DefiLlamaProtocolResponse = await aaveDataResponse.json();
    return aaveData?.currentChainTvls?.Ethereum || 0;
}
