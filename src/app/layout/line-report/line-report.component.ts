import { getColorCode, getDateTimeString } from './../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { LineReportMachineNames } from './../../constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginOutsideDataLabels from 'chartjs-plugin-piechart-outlabels';
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
    selectedMachine = new FormControl('all', Validators.required);
    startDate = new FormControl(null, Validators.required);
    endDate = new FormControl(null, Validators.required);

    displayedColumns = [];
    dataSource: any;

    // Pie
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            display: false,
            position: 'top',
        },
        layout: {
            padding: {
                top: 45,
                left: 0,
                right: 0,
                bottom: 50
            }
        },

        plugins: {
            outlabels: {
                color: 'white',
                font: {
                    minSize: 11
                }
            },
            datalabels: {
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                },
                color: 'black',
                font: {
                    size: 45,
                    weight: 'bold',
                    lineHeight: 2,

                }
            }
        }
    };
    public pieChartPlugins = [pluginOutsideDataLabels];
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
            "date_start": getDateTimeString(this.startDate.value),
            "date_end": getDateTimeString(this.endDate.value),            
            "lineid": "z3"

        }
        this.getMachineInfo(payload);

        // this.loading = false;

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
        //             },
        //             "Variable 5": {
        //                 "NOK": 3,
        //                 "OK": 22
        //             },
        //             "Variable 6": {
        //                 "NOK": 4,
        //                 "OK": 25
        //             }
        //             ,
        //             "Variable 7": {
        //                 "NOK": 3,
        //                 "OK": 22
        //             },
        //             "Variable 8": {
        //                 "NOK": 4,
        //                 "OK": 25
        //             }
        //             ,
        //             "Variable 9": {
        //                 "NOK": 3,
        //                 "OK": 22
        //             },
        //             "Variable 10": {
        //                 "NOK": 4,
        //                 "OK": 25
        //             }
        //         }
        //     ]
        // }
        // if (res["Line report"] && res["Line report"].length) {
        //     const rawdata = res["Line report"][0];
        //     const keys = Object.keys(rawdata);
        //     this.pieChartLabels = this.barChartLabels = keys;
        //     this.displayedColumns.push("report", ...keys);

        //     const ok_histogram = [];
        //     const nok_histogram = [];
        //     const colors = [];
        //     const report_ok_data = {};
        //     report_ok_data["report"] = "OK";
        //     const report_nok_data = {};
        //     report_nok_data["report"] = "NOK";

        //     this.pieChartLabels.forEach((row: any, index) => {
        //         colors.push(getColorCode(index));
        //         ok_histogram.push(rawdata[row]["OK"]);
        //         nok_histogram.push(rawdata[row]["NOK"]);
        //         report_ok_data[row] = rawdata[row]["OK"];
        //         report_nok_data[row] = rawdata[row]["NOK"];
        //     });

        //     this.pieChartColors.push({ backgroundColor: colors });

        //     this.pieChartData = nok_histogram;

        //     const histo_ok = {};
        //     histo_ok["label"] = "OK";
        //     histo_ok["backgroundColor"] = histo_ok["borderColor"] = histo_ok["hoverBackgroundColor"] = histo_ok["hoverBorderColor"] = getColorCode(0);
        //     histo_ok["data"] = ok_histogram;
        //     this.barChartData.push(histo_ok);

        //     const histo_nok = {};
        //     histo_nok["label"] = "NOK";
        //     histo_nok["backgroundColor"] = histo_nok["borderColor"] = histo_nok["hoverBackgroundColor"] = histo_nok["hoverBorderColor"] = getColorCode(1);
        //     histo_nok["data"] = nok_histogram;
        //     this.barChartData.push(histo_nok);

        //     this.dataSource = new MatTableDataSource([report_ok_data, report_nok_data]);

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
                histo_ok["backgroundColor"] = histo_ok["borderColor"] = histo_ok["hoverBackgroundColor"] = histo_ok["hoverBorderColor"] = getColorCode(0);
                histo_ok["data"] = ok_histogram;
                this.barChartData.push(histo_ok);

                const histo_nok = {};
                histo_nok["label"] = "NOK";
                histo_nok["backgroundColor"] = histo_nok["borderColor"] = histo_nok["hoverBackgroundColor"] = histo_nok["hoverBorderColor"] = getColorCode(1);
                histo_nok["data"] = nok_histogram;
                this.barChartData.push(histo_nok);

                this.dataSource = new MatTableDataSource([report_ok_data, report_nok_data]);

            }
            this.loading = false;

        });
    }

}
