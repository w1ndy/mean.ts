import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home.client.component';

const coreRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(coreRoutes);
