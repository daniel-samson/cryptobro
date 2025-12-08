import { describe, it, expect, beforeEach } from 'vitest';
import { CoinGeckoService } from './coin-gecko.service';
import { EnvironmentService } from './environment.service';

describe('CoinGeckoService', () => {
  let service: CoinGeckoService;
  let envService: EnvironmentService;

  beforeEach(() => {
    envService = new EnvironmentService();
    service = new CoinGeckoService(null as any, envService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getCoins method', () => {
    expect(service.getCoins).toBeDefined();
  });

  it('should have getCoinBySymbol method', () => {
    expect(service.getCoinBySymbol).toBeDefined();
  });

  it('should have getCoinById method', () => {
    expect(service.getCoinById).toBeDefined();
  });

  it('should have searchCoins method', () => {
    expect(service.searchCoins).toBeDefined();
  });
});
