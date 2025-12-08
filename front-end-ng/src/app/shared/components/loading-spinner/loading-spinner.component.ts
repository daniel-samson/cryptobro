import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-4">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted loading-spinner"></div>
        <p class="text-lg text-muted-foreground">{{ message() }}</p>
      </div>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  readonly message = input<string>('Loading...');
}
