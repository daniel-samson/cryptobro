import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="bg-gray-900 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold">CryptoBro</a>
        <div class="flex gap-4">
          <a routerLink="/" routerLinkActive="border-b-2 border-blue-500" class="hover:text-gray-300">
            Home
          </a>
          <a routerLink="/search" routerLinkActive="border-b-2 border-blue-500" class="hover:text-gray-300">
            Search
          </a>
        </div>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: []
})
export class App {}
