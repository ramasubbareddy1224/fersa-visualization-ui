import { ExcelService } from './../../shared/excel/excel.service';
import { MachineNames, Excel_Download_Size } from './../../constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { getDateTimeString, isFloatNumber, isExponentialNumber } from './../../shared/utility';
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
    dataMatrix = new FormControl(null)
    pageNumber = 0;
    fromSize = 0;
    pageSize = 100;
    totalCount = 0;

    private machineInfoURL = `${environment.API_URL}trace-for-machine/getmachinedetails`;

    displayedColumns = [];
    dataSource: any;
    IsDataFound = true;
    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit() {
    }
    search() {
        this.loading = true;
        this.displayedColumns = [];

        const payload = {
            "machine": this.selectedMachine.value,
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "dataMatrix": this.dataMatrix.value,
            "from": this.fromSize,
            "size": this.pageSize

        }
        this.getMachineInfo(payload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            this.totalCount = res.total;
            if (res.items.length) {
                this.IsDataFound = true;
                const row = res.items[0];
                this.displayedColumns = [].concat('created_at', ...Object.keys(row).filter(d => d != 'created_at'));
                res.items.forEach(currentRow => {
                    Object.keys(currentRow).forEach(rowkey => {
                        if (isFloatNumber(currentRow[rowkey]) || isExponentialNumber(currentRow[rowkey])) {
                            currentRow[rowkey] = parseFloat(currentRow[rowkey]).toFixed(5);
                        }
                    })
                });

                this.dataSource = new MatTableDataSource(res.items);
            }
            else {
                this.dataSource = null;
                this.IsDataFound = false;
            }
            this.loading = false;


        });
    }
    downloadData() {
        const payload = {
            "machine": this.selectedMachine.value,
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "dataMatrix": this.dataMatrix.value,
            "size": Excel_Download_Size

        }
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            if (res.items.length) {
                this.excelService.exportToEXcel({
                    data: res.items,
                    sheetName: "tracemachine",
                    excelExtension: '.xlsx',
                    excelFileName: `tracemachine_${this.selectedMachine.value}_${new Date().getTime()}`
                })
            }
        });


    }
    paged(e) {
        this.pageNumber = e.pageIndex;
        this.pageSize = e.pageSize;
        const start = Math.round(((this.pageNumber + 1) - 1) * e.pageSize);
        this.fromSize = start;
        //const end = Math.round((e.pageIndex + 1) * e.pageSize);
        this.search();
    }

}
