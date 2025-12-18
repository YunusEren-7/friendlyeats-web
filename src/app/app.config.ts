import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideFunctions, getFunctions, connectFunctionsEmulator} from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
}

import { getApp } from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // --- App Check hier hinzufügen ---
    provideAppCheck(() => {
      const appCheck = initializeAppCheck(getApp(), {
        provider: new ReCaptchaEnterpriseProvider(
          environment.reCAPTCHAEnterpriseKey.key
        ),
        isTokenAutoRefreshEnabled: true,
      });

      // Aktiviert das Debug-Token für lokale Tests auf localhost
      if (typeof self !== 'undefined' && location.hostname === 'localhost') {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      return appCheck;
    }),
    // ----------------------------------
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),
    provideRouter(routes)
  ],
};
