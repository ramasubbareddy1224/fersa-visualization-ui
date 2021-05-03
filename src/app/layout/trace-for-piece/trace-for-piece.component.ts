import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExcelService } from './../../shared/excel/excel.service';
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
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
    displayedColumns = [];
    dataSource: any;
    constructor(private _httpClient: HttpClient, private readonly excelService: ExcelService) { }

    ngOnInit(): void {
    }
    search() {
        this.loading = true;
        const payload = {};
        if (this.DMConoIn.value) {
            payload["field"] = "cono_in";
            payload["fieldValue"] = this.DMConoIn.value;
        } else if (this.DMConoOut.value) {
            payload["field"] = "cono_out";
            payload["fieldValue"] = this.DMConoOut.value;
        } else if (this.DMConoRing.value) {
            payload["field"] = "cono_out";
            payload["fieldValue"] = this.DMConoRing.value;
        }
        this.getMachineInfo(payload);

    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            this.DMConoIn.setValue(res.cono_in);
            this.DMConoOut.setValue(res.cono_out);
            this.DMConoRing.setValue(res.cono_ring);
            if (res.cono_in_details.length) {
                const row = res.cono_in_details[0];
                this.displayedColumns = [].concat('date', ...Object.keys(row).filter(d => d != 'date'));
                this.dataSource = new MatTableDataSource(res.cono_in_details);
            }
            this.loading = false;
        });
    }
    downloadData() { }

}
