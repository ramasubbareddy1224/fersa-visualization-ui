import { ExcelService } from './../../shared/excel/excel.service';
import { MachineNames } from './../../constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-trace-for-machine',
    templateUrl: './trace-for-machine.component.html',
    styleUrls: ['./trace-for-machine.component.scss']
})
export class TraceForMachineComponent implements OnInit {

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
    machineList = MachineNames;
    selectedMachine = new FormControl(null, Validators.required);
    startDate = new FormControl(null, Validators.required);
    endDate = new FormControl(null, Validators.required);

    private machineInfoURL = `${environment.API_URL}trace-for-machine/getmachinedetails`;

    displayedColumns = [];
    dataSource: any;
    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit() {
    }
    search() {
        this.loading = true;
        console.log(new Date(this.startDate.value).getTime());
        console.log(this.endDate.value);
        // console.log(this.selectedMachine);
        console.log(this.selectedMachine.value);

        const payload = {
            "machine": "game-of-thrones",
            "startDate": "2021-05-02T05:51:11.920Z",
            "endDate": "2021-05-02T05:57:11.920Z"
        }
        this.getMachineInfo(payload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            if (res.items.length) {
                const row = res.items[0];
                this.displayedColumns = [].concat('date', ...Object.keys(row).filter(d => d != 'date'));
                this.dataSource = new MatTableDataSource(res.items);

                // this.excelService.exportToEXcel({
                //     data: res.items,
                //     sheetName: "tracemachine",
                //     excelExtension: '.xlsx',
                //     excelFileName: `tracemachine_${this.selectedMachine}${new Date().getTime()}`
                // })
            }
            this.loading = false;


        });
    }
    downloadData() {
        const payload = {
            "machine": "game-of-thrones",
            "startDate": "2021-05-02T05:51:11.920Z",
            "endDate": "2021-05-02T05:57:11.920Z"
        }
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            if (res.items.length) {
                const row = res.items[0];
                this.excelService.exportToEXcel({
                    data: res.items,
                    sheetName: "tracemachine",
                    excelExtension: '.xlsx',
                    excelFileName: `tracemachine_${this.selectedMachine}${new Date().getTime()}`
                })
            }
        });
    }

}
