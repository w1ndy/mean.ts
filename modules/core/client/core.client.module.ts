import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from './routes/core.client.route';
import { CoreComponent } from './components/core.client.component';
import { HomeComponent } from './components/home.client.component';

@NgModule({
    imports: [
        BrowserModule,
        routing
    ],
    declarations: [
        CoreComponent,
        HomeComponent
    ],
    bootstrap: [ CoreComponent ]
})
export class CoreModule {}
