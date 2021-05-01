import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Screen1Component } from './screen1.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Screen1RoutingModule } from './screen1-routing.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '../../shared/modules/material/material.module';

@NgModule({
    declarations: [Screen1Component],
    imports: [
        CommonModule,
        Screen1RoutingModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MaterialModule,
        FlexLayoutModule.withConfig({ addFlexToParent: false })
    ]
})
export class Screen1Module { }
