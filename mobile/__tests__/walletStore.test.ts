import { useWalletStore } from '../src/store/walletStore';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(void 0),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(void 0),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios'
  }
}));

describe('WalletStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWalletStore());
    act(() => {
      result.current.clearWallet();
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useWalletStore());

    expect(result.current.address).toBeNull();
    expect(result.current.privateKey).toBeNull();
    expect(result.current.balance).toBe('0.00');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.showPrivateKey).toBe(false);
  });

  it('should set wallet address and private key', () => {
    const { result } = renderHook(() => useWalletStore());
    const address = '0x1234567890123456789012345678901234567890';
    const privateKey = '0xprivatekey123456789012345678901234567890123456789012345678901234';

    act(() => {
      result.current.setWallet(address, privateKey);
    });

    expect(result.current.address).toBe(address);
    expect(result.current.privateKey).toBe(privateKey);
  });

  it('should update balance', () => {
    const { result } = renderHook(() => useWalletStore());

    act(() => {
      result.current.setBalance('1.5');
    });

    expect(result.current.balance).toBe('1.5');
  });

  it('should toggle private key visibility', () => {
    const { result } = renderHook(() => useWalletStore());

    expect(result.current.showPrivateKey).toBe(false);

    act(() => {
      result.current.togglePrivateKey();
    });

    expect(result.current.showPrivateKey).toBe(true);

    act(() => {
      result.current.togglePrivateKey();
    });

    expect(result.current.showPrivateKey).toBe(false);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useWalletStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should clear wallet data', () => {
    const { result } = renderHook(() => useWalletStore());

    act(() => {
      result.current.setWallet('0x123', '0xprivate');
      result.current.setBalance('1.0');
      result.current.togglePrivateKey();
    });

    act(() => {
      result.current.clearWallet();
    });

    expect(result.current.address).toBeNull();
    expect(result.current.privateKey).toBeNull();
    expect(result.current.balance).toBe('0.00');
    expect(result.current.showPrivateKey).toBe(false);
  });
});