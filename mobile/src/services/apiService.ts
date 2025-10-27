const API_URL = 'http://localhost:3001';

// Fetch vault stats (APY, TVL, etc)
export const getVaultStats = async () => {
  try {
    const response = await fetch(`${API_URL}/vault/stats`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch vault stats:', error);
    throw error;
  }
};

// Get user balance from blockchain
export const getUserBalance = async (address: string) => {
  try {
    const response = await fetch(`${API_URL}/vault/balance/${address}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch user balance:', error);
    throw error;
  }
};

// Get current APY from Aave
export const getCurrentApy = async () => {
  try {
    const response = await fetch(`${API_URL}/aave/apy`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch APY:', error);
    throw error;
  }
};

export const deposit = async (address: string, amount: string, privateKey: string) => {
  try {
    const response = await fetch(`${API_URL}/vault/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        amount,
        privateKey
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Deposit failed');
    }

    return data;
  } catch (error) {
    console.error('Failed to deposit:', error);
    throw error;
  }
};

export const withdraw = async (address: string, amount: string, privateKey: string) => {
  try {
    const response = await fetch(`${API_URL}/vault/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        amount,
        privateKey
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Withdrawal failed');
    }

    return data;
  } catch (error) {
    console.error('Failed to withdraw:', error);
    throw error;
  }
};