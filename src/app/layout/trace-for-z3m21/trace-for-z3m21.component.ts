import { ExcelService } from './../../shared/excel/excel.service';
import { MachineNames } from './../../constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
@Component({
    selector: 'app-trace-for-z3m21',
    templateUrl: './trace-for-z3m21.component.html',
    styleUrls: ['./trace-for-z3m21.component.scss']
})
export class TraceForZ3m21Component implements OnInit {

    public disabled = false;
    public showSpinners = true;
    public showSeconds = true;
    public enableMeridian = true;
    public minDate: Date;
    public maxDate: Date;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public disableMinute = false;
    public hideTime = false;
    @ViewChild('picker') picker: any;

    loading = false;
    startDate = new FormControl(null, Validators.required);
    endDate = new FormControl(null, Validators.required);

    private machineInfoURL = `${environment.API_URL}trace-for-z3m21-3/getmachinedetails`;

    displayedColumns = ['date', 'datamatrix'];
    INdataSource: any;
    OUTdataSource: any;
    RINGdataSource: any;
    CanShowGrid = false;
    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit() {
    }
    search() {
        this.CanShowGrid = true;
        this.loading = true;
        console.log(new Date(this.startDate.value).getTime());
        console.log(this.endDate.value);

        const payload = {
            "startDate": "2021-05-02T05:58:11.920Z",
            "endDate": "2021-05-02T06:58:11.920Z"
        }
        this.getMachineInfo(payload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            if (res && res.length) {
                this.INdataSource = new MatTableDataSource(res.map(d => ({ date: d.date, datamatrix: d.cono_in })));
                this.OUTdataSource = new MatTableDataSource(res.map(d => ({ date: d.date, datamatrix: d.cono_out })));
                this.RINGdataSource = new MatTableDataSource(res.map(d => ({ date: d.date, datamatrix: d.cono_ring })));
            }
            this.loading = false;


        });
    }
    downloadInData() {
        if (this.INdataSource && this.INdataSource.data) {
            this.excelService.exportToEXcel({
                data: this.INdataSource.data,
                sheetName: "tracemachine",
                excelExtension: '.xlsx',
                excelFileName: `tracemachine_cono_in_${new Date().getTime()}`
            })
        }
    }
    downloadOutData() {
        if (this.OUTdataSource && this.OUTdataSource.data) {
            this.excelService.exportToEXcel({
                data: this.OUTdataSource.data,
                sheetName: "tracemachine",
                excelExtension: '.xlsx',
                excelFileName: `tracemachine_cono_out_${new Date().getTime()}`
            })
        }
    }
    downloadRingData() {
        if (this.RINGdataSource && this.RINGdataSource.data) {
            this.excelService.exportToEXcel({
                data: this.RINGdataSource.data,
                sheetName: "tracemachine",
                excelExtension: '.xlsx',
                excelFileName: `tracemachine_ring_${new Date().getTime()}`
            })
        }
    }

}
