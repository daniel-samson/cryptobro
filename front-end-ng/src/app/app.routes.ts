import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { CoinDetailComponent } from './pages/coin-detail.component';
import { SearchComponent } from './pages/search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coins/:symbol', component: CoinDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' }
];
