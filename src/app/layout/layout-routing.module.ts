import { LineReportComponent } from './line-report/line-report.component';
import { ContMeasureReportComponent } from './cont-measure-report/cont-measure-report.component';
import { TraceForZ3m21Component } from './trace-for-z3m21/trace-for-z3m21.component';
import { TraceForPieceComponent } from './trace-for-piece/trace-for-piece.component';
import { TraceForMachineComponent } from './trace-for-machine/trace-for-machine.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { Screen1Component } from './screen1/screen1.component';
import { Screen2Component } from './screen2/screen2.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'trace-for-machine'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'screen1',
                loadChildren: () => import('./screen1/screen1.module').then(m => m.Screen1Module)
            },
            {
                path: 'screen2',
                component: Screen2Component
            },
            {
                path: 'trace-for-machine',
                component: TraceForMachineComponent
            },
            {
                path: 'trace-for-piece',
                component: TraceForPieceComponent
            },
            {
                path: 'trace-for-z3m21',
                component: TraceForZ3m21Component
            },
            {
                path: 'cont-measure-report',
                component: ContMeasureReportComponent
            },
            {
                path: 'line-report',
                component: LineReportComponent
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
