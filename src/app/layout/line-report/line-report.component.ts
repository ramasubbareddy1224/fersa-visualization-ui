import { getColorCode } from './../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { LineReportMachineNames } from './../../constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-line-report',
    templateUrl: './line-report.component.html',
    styleUrls: ['./line-report.component.scss']
})
export class LineReportComponent implements OnInit {

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
    machineList = LineReportMachineNames;
    selectedMachine = new FormControl(null, Validators.required);
    startDate = new FormControl(null, Validators.required);
    endDate = new FormControl(null, Validators.required);

    displayedColumns = [];
    dataSource: any;

    // Pie
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        }
    };
    public pieChartLabels: Label[] = ['OK', 'NOK'];
    public pieChartData: number[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartColors = [];

    // Bar Chart
    public barChartOptions: ChartOptions = {
        responsive: true,
        scales: {
            xAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Grupos'
                }
            }], yAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Cantidad'
                }
            }]
        }
    };
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;

    public barChartData: ChartDataSets[] = [];

    private machineInfoURL = `${environment.REPORT_API_URL}rejectionanalysis`;

    constructor(private _httpClient: HttpClient) { }

    ngOnInit(): void {
    }

    search() {
        this.loading = true;
        this.barChartData = [];
        this.displayedColumns = [];
        const payload = {
            "machine": this.selectedMachine.value,
            "date_start": new Date(this.startDate.value).toISOString(),
            "date_end": new Date(this.endDate.value).toISOString(),
            "lineid": "z3"

        }
        this.getMachineInfo(payload);
        //this.loading = false;

        // const res = {
        //     "Line report": [
        //         {
        //             "Variable 1": {
        //                 "NOK": 2,
        //                 "OK": 248
        //             },
        //             "Variable 2": {
        //                 "NOK": 2,
        //                 "OK": 10
        //             },
        //             "Variable 3": {
        //                 "NOK": 3,
        //                 "OK": 22
        //             },
        //             "Variable 4": {
        //                 "NOK": 4,
        //                 "OK": 25
        //             }
        //         }
        //     ]
        // }


    }

    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });

            if (res["Line report"] && res["Line report"].length) {
                const rawdata = res["Line report"][0];
                const keys = Object.keys(rawdata);
                this.pieChartLabels = this.barChartLabels = keys;
                this.displayedColumns.push("report", ...keys);

                const ok_histogram = [];
                const nok_histogram = [];
                const colors = [];
                const report_ok_data = {};
                report_ok_data["report"] = "OK";
                const report_nok_data = {};
                report_nok_data["report"] = "NOK";

                this.pieChartLabels.forEach((row: any, index) => {
                    colors.push(getColorCode(index));
                    ok_histogram.push(rawdata[row]["OK"]);
                    nok_histogram.push(rawdata[row]["NOK"]);
                    report_ok_data[row] = rawdata[row]["OK"];
                    report_nok_data[row] = rawdata[row]["NOK"];
                });

                this.pieChartColors.push({ backgroundColor: colors });

                this.pieChartData = nok_histogram;

                const histo_ok = {};
                histo_ok["label"] = "OK";
                histo_ok["backgroundColor"] = getColorCode(0);
                histo_ok["borderColor"] = getColorCode(0);;
                histo_ok["data"] = ok_histogram;
                this.barChartData.push(histo_ok);

                const histo_nok = {};
                histo_nok["label"] = "NOK";
                histo_nok["backgroundColor"] = getColorCode(1);
                histo_nok["borderColor"] = getColorCode(1);;
                histo_nok["data"] = nok_histogram;
                this.barChartData.push(histo_nok);

                this.dataSource = new MatTableDataSource([report_ok_data, report_nok_data]);

            }
            this.loading = false;

        });
    }

}
