import { ExcelService } from './../../shared/excel/excel.service';
import { MachineNames } from './../../constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { getDateTimeString } from './../../shared/utility';

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
    private machineInfoByMatchURL = `${environment.API_URL}trace-for-z3m21-3/getmachinedetailsByMatch`;

    displayedColumns = ['date', 'datamatrix'];
    INdataSource: any;
    OUTdataSource: any;
    RINGdataSource: any;
    CanShowGrid = false;
    ConoInpageNumber = 0;
    ConoInfromSize = 0;
    ConoInpageSize = 100;
    ConoIntotalCount = 0;

    ConoOutpageNumber = 0;
    ConoOutfromSize = 0;
    ConoOutpageSize = 100;
    ConoOuttotalCount = 0;

    RingpageNumber = 0;
    RingfromSize = 0;
    RingpageSize = 100;
    RingtotalCount = 0;
    excel_Download_Size = 1000;


    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit() {
    }
    search() {
        this.CanShowGrid = true;
        this.loading = true;

        const ConoInpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "from": this.ConoInfromSize,
            "size": this.ConoInpageSize,
            "field": "DATAMATRIX_IR_IN_CONJUNTO"
        }
        const ConoOutpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "from": this.ConoOutfromSize,
            "size": this.ConoOutpageSize,
            "field": "DATAMATRIX_IR_OUT_CONJUNTO"
        }
        const Ringpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "from": this.RingfromSize,
            "size": this.RingpageSize,
            "field": "DATAMATRIX_OR_CONJUNTO"
        }
        this.getMachineInfoByMatch(ConoInpayload);
        this.getMachineInfoByMatch(ConoOutpayload);
        this.getMachineInfoByMatch(Ringpayload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            if (res && res.length) {
                this.INdataSource = new MatTableDataSource(
                    res
                        .map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_IR_IN_CONJUNTO }))
                        .filter(f => f.datamatrix != "")
                );
                this.OUTdataSource = new MatTableDataSource(
                    res
                        .map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_IR_OUT_CONJUNTO }))
                        .filter(f => f.datamatrix != "")
                );
                this.RINGdataSource = new MatTableDataSource(
                    res.map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_OR_CONJUNTO }))
                        .filter(f => f.datamatrix != "")
                );
            }
            this.loading = false;


        });
    }

    getMachineInfoByMatch(payload) {
        this._httpClient.post(this.machineInfoByMatchURL, payload).subscribe((res: any) => {
            console.log({ res });
            if (payload.field == "DATAMATRIX_IR_IN_CONJUNTO") {
                this.ConoIntotalCount = res.total;
                this.INdataSource = new MatTableDataSource(
                    res.items.map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_IR_IN_CONJUNTO }))
                );
            }
            else if (payload.field == "DATAMATRIX_IR_OUT_CONJUNTO") {
                this.ConoOuttotalCount = res.total;
                this.OUTdataSource = new MatTableDataSource(
                    res.items.map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_IR_OUT_CONJUNTO }))
                );
            }
            else if (payload.field == "DATAMATRIX_OR_CONJUNTO") {
                this.RingtotalCount = res.total;
                this.RINGdataSource = new MatTableDataSource(
                    res.items.map(d => ({ date: d.created_at, datamatrix: d.DATAMATRIX_OR_CONJUNTO }))
                );
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
    pagedConoIn(e) {
        this.ConoInpageNumber = e.pageIndex;
        this.ConoInpageSize = e.pageSize;
        const start = Math.round(((this.ConoInpageNumber + 1) - 1) * e.pageSize);
        this.ConoInfromSize = start;
        this.search();
    }
    pagedConoOut(e) {
        this.ConoOutpageNumber = e.pageIndex;
        this.ConoOutpageSize = e.pageSize;
        const start = Math.round(((this.ConoOutpageNumber + 1) - 1) * e.pageSize);
        this.ConoOutfromSize = start;
        this.search();
    }
    pagedRing(e) {
        this.RingpageNumber = e.pageIndex;
        this.RingpageSize = e.pageSize;
        const start = Math.round(((this.RingpageNumber + 1) - 1) * e.pageSize);
        this.RingfromSize = start;
        this.search();
    }
    downloadAllData() {
        const allData = [];
        const ConoInpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "size": this.excel_Download_Size,
            "field": "DATAMATRIX_IR_IN_CONJUNTO"
        }
        const ConoOutpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "size": this.excel_Download_Size,
            "field": "DATAMATRIX_IR_OUT_CONJUNTO"
        }
        const Ringpayload = {
            "startDate": getDateTimeString(this.startDate.value),
            "endDate": getDateTimeString(this.endDate.value),
            "size": this.excel_Download_Size,
            "field": "DATAMATRIX_OR_CONJUNTO"
        }
        const conoInApi = this._httpClient.post(this.machineInfoByMatchURL, ConoInpayload);
        const conoOutApi = this._httpClient.post(this.machineInfoByMatchURL, ConoOutpayload);
        const conoRingApi = this._httpClient.post(this.machineInfoByMatchURL, Ringpayload);
        forkJoin([conoInApi, conoOutApi, conoRingApi]).subscribe(res => {
            allData.push(...res[0]["items"].map(d => ({ date: new Date(d.created_at).toLocaleString(), datamatrix: d.DATAMATRIX_IR_IN_CONJUNTO, type: 'CONO IN' })));
            allData.push(...res[1]["items"].map(d => ({ date: new Date(d.created_at).toLocaleString(), datamatrix: d.DATAMATRIX_IR_OUT_CONJUNTO, type: 'CONO OUT' })));
            allData.push(...res[2]["items"].map(d => ({ date: new Date(d.created_at).toLocaleString(), datamatrix: d.DATAMATRIX_OR_CONJUNTO, type: 'RING' })));

            if (allData.length) {
                this.excelService.exportToEXcel({
                    data: allData,
                    sheetName: "tracemachine",
                    excelExtension: '.xlsx',
                    excelFileName: `tracemachine_cono_all_${new Date().getTime()}`
                })
            }

        })
    }

}
