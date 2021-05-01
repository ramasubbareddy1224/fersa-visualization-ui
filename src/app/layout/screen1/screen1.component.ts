import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-screen1',
    templateUrl: './screen1.component.html',
    styleUrls: ['./screen1.component.scss']
})
export class Screen1Component implements OnInit {

    public disabled = false;
    public showSpinners = true;
    public showSeconds = true;
    public touchUi = false;
    public enableMeridian = true;
    public minDate: Date;
    public maxDate: Date;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public disableMinute = false;
    public hideTime = false;
    @ViewChild('picker') picker: any;

    public dateControl = new FormControl(null);

    public options = [
        { value: true, label: 'True' },
        { value: false, label: 'False' }
    ];

    public listColors = ['primary', 'accent', 'warn'];

    public stepHours = [1, 2, 3, 4, 5];
    public stepMinutes = [1, 5, 10, 15, 20, 25];
    public stepSeconds = [1, 5, 10, 15, 20, 25];

    toppings = new FormControl();

    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    constructor() { }

    ngOnInit() {
    }

}
