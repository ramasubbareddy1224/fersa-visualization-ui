import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { ChartsModule } from 'ng2-charts';
@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        StatModule,
        MaterialModule,
        ChartsModule,
        FlexLayoutModule.withConfig({ addFlexToParent: false })
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
