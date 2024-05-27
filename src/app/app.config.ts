import { APP_INITIALIZER, ApplicationConfig, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';



function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'saray',
        clientId: 'saray-ui'
      },
      initOptions: {
        redirectUri: 'http://localhost:4200/dashboard'
      }
    });
}
const KeycloakInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  multi: true,
  deps: [KeycloakService]
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), KeycloakInitializerProvider, KeycloakService]
};
