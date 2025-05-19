import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { AuthInterceptor } from './auth.interceptor';

import { provideRouter } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([AuthInterceptor])
), provideAnimationsAsync(), provideAnimationsAsync()]
};
