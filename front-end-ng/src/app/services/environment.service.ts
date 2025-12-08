import { Injectable } from '@angular/core';

/**
 * Service for accessing environment variables
 * Provides API configuration for the application
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  constructor() {}

  /**
   * Get the API base URL
   * Defaults to localhost:8000 for development
   */
  getApiBaseUrl(): string {
    // Default to localhost:8000 for development
    // Can be overridden via environment.ts for production builds
    const apiUrl = typeof window !== 'undefined' && (window as any).__ENV__?.apiBaseUrl;
    return apiUrl || 'http://localhost:8000';
  }
}
