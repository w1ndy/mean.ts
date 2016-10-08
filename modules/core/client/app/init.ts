import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from '../core.client.module';

if (PRODUCTION)
    enableProdMode();

platformBrowserDynamic().bootstrapModule(CoreModule);
