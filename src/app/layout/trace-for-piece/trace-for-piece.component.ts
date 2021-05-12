import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExcelService } from './../../shared/excel/excel.service';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
    selector: 'app-trace-for-piece',
    templateUrl: './trace-for-piece.component.html',
    styleUrls: ['./trace-for-piece.component.scss']
})
export class TraceForPieceComponent implements OnInit {

    private machineInfoURL = `${environment.API_URL}trace-for-piece/getmachinedetails`;
    DMConoIn = new FormControl(null);
    DMConoOut = new FormControl(null);
    DMConoRing = new FormControl(null);

    loading = false;
    displayedColumns = ['name', 'date'];
    INdataSource: any;
    OUTdataSource: any;
    RINGdataSource: any;
    CanShowGrid = false;
    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit(): void {
    }
    search() {
        this.CanShowGrid = true;
        this.loading = true;
        this.INdataSource = this.OUTdataSource = this.RINGdataSource = null;
        const payload = {};
        if (this.DMConoIn.value) {
            payload["field"] = "DATAMATRIX_IR_IN_CONJUNTO";
            payload["fieldValue"] = this.DMConoIn.value;
        } else if (this.DMConoOut.value) {
            payload["field"] = "DATAMATRIX_IR_OUT_CONJUNTO";
            payload["fieldValue"] = this.DMConoOut.value;
        } else if (this.DMConoRing.value) {
            payload["field"] = "DATAMATRIX_OR_CONJUNTO";
            payload["fieldValue"] = this.DMConoRing.value;
        }
        this.getMachineInfo(payload);

    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload)
            .pipe(catchError((error: any) => {
                this.loading = false;
                console.log({ error });
                return of([]);
            }))
            .subscribe((res: any) => {
                console.log({ res });
                this.DMConoIn.setValue(res.cono_in);
                this.DMConoOut.setValue(res.cono_out);
                this.DMConoRing.setValue(res.cono_ring);
                if (res.cono_in_details && res.cono_in_details.length) {
                    this.INdataSource = new MatTableDataSource(res.cono_in_details.map(row => ({ name: row.machine, date: row.created_at })));
                }
                if (res.cono_out_details && res.cono_out_details.length) {
                    this.OUTdataSource = new MatTableDataSource(res.cono_out_details.map(row => ({ name: row.machine, date: row.created_at })));
                }
                if (res.cono_ring_details && res.cono_ring_details.length) {
                    this.RINGdataSource = new MatTableDataSource(res.cono_ring_details.map(row => ({ name: row.machine, date: row.created_at })));
                }
                this.loading = false;
            })
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
    downloadAllData() {
        const allData = [];
        if (this.INdataSource && this.INdataSource.data) {
            const data = this.INdataSource.data.map(d => ({ name: d.name, date: new Date(d.date).toLocaleString(), type: 'CONO IN' }));
            allData.push(...data);
        }
        if (this.OUTdataSource && this.OUTdataSource.data) {
            const data = this.OUTdataSource.data.map(d => ({ name: d.name, date: new Date(d.date).toLocaleString(), type: 'CONO OUT' }));
            allData.push(...data);
        }
        if (this.RINGdataSource && this.RINGdataSource.data) {
            const data = this.RINGdataSource.data.map(d => ({ name: d.name, date: new Date(d.date).toLocaleString(), type: 'RING' }));
            allData.push(...data);
        }
        if (allData.length) {
            this.excelService.exportToEXcel({
                data: allData,
                sheetName: "tracemachine",
                excelExtension: '.xlsx',
                excelFileName: `tracemachine_cono_all_${new Date().getTime()}`
            })
        }

    }
}
