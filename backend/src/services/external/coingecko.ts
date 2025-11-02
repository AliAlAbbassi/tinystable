import { CoinGeckoPriceResponse } from '../vault/types';

const COINGECKO_ETH_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

export const getEthPrice = async (): Promise<number> => {
    const ethPriceResponse = await fetch(COINGECKO_ETH_PRICE_URL);
    if (!ethPriceResponse.ok) {
        console.error('Failed to fetch ETH price from CoinGecko');
        return 0;
    }
    const ethPriceData: CoinGeckoPriceResponse = await ethPriceResponse.json();
    return ethPriceData?.ethereum?.usd || 0;
}
