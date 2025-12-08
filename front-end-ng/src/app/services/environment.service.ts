import { Injectable } from '@angular/core';

/**
 * Service for accessing environment variables
 * Reads from process.env in Node.js / Angular CLI
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  constructor() {}

  /**
   * Get the API base URL from environment or default to localhost
   */
  getApiBaseUrl(): string {
    // In Angular CLI with Vite, environment variables are available via process.env
    // The VITE_API_BASE_URL will be replaced during build if defined in .env
    return (process.env['VITE_API_BASE_URL'] as string) || 'http://localhost:8000';
  }
}
