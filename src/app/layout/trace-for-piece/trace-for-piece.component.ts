import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-trace-for-piece',
    templateUrl: './trace-for-piece.component.html',
    styleUrls: ['./trace-for-piece.component.scss']
})
export class TraceForPieceComponent implements OnInit {

    DMConoIn = new FormControl(null);
    DMConoOut = new FormControl(null);
    DMConoRing = new FormControl(null);
    constructor() { }

    ngOnInit(): void {
    }
    search() {

    }

}
