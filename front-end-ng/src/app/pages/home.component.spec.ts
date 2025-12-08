import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { of, throwError } from 'rxjs';
import { Coin } from '../models/coin.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let coinGeckoService: CoinGeckoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: CoinGeckoService,
          useValue: {
            getCoins: vi.fn()
          }
        }
      ]
    });

    component = TestBed.createComponent(HomeComponent).componentInstance;
    coinGeckoService = TestBed.inject(CoinGeckoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load coins on init', () => {
    const mockCoins: Coin[] = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 45000,
        market_cap_rank: 1
      }
    ];

    vi.spyOn(coinGeckoService, 'getCoins').mockReturnValue(of(mockCoins));

    component.ngOnInit();

    expect(component.coins).toEqual(mockCoins);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading coins', () => {
    const error = new Error('Failed to fetch');
    vi.spyOn(coinGeckoService, 'getCoins').mockReturnValue(
      throwError(() => error)
    );

    component.ngOnInit();

    expect(component.coins).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Failed to fetch');
  });
});
