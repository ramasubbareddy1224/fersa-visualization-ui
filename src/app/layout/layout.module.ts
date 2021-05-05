import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavComponent } from './nav/nav.component';
import { Screen2Component } from './screen2/screen2.component';
import { TraceForMachineComponent } from './trace-for-machine/trace-for-machine.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TraceForPieceComponent } from './trace-for-piece/trace-for-piece.component';
import { TraceForZ3m21Component } from './trace-for-z3m21/trace-for-z3m21.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MaterialModule,
        TranslateModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        FlexLayoutModule.withConfig({ addFlexToParent: false })
    ],
    declarations: [
        Screen2Component,
        LayoutComponent,
        NavComponent,
        TopnavComponent,
        SidebarComponent,
        TraceForMachineComponent,
        TraceForPieceComponent,
        TraceForZ3m21Component
    ]

})
export class LayoutModule { }
