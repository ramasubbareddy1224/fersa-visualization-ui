import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { MachineNames } from './../../constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-cont-measure-report',
    templateUrl: './cont-measure-report.component.html',
    styleUrls: ['./cont-measure-report.component.scss']
})
export class ContMeasureReportComponent implements OnInit {

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

    // Pie
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        }
    };
    public pieChartLabels: Label[] = [];
    public pieChartData: number[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartColors = [{
        backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
    },
    ];

    // scatter
    public scatterChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: true
    };

    public scatterChartData: ChartDataSets[] = null;
    public scatterChartType: ChartType = 'scatter';

    displayedColumns = [];
    dataSource: any;

    private machineInfoURL = `${environment.REPORT_API_URL}rejectanalysis`;

    constructor(private _httpClient: HttpClient) { }

    ngOnInit(): void {
    }

    search() {
        this.loading = true;
        const payload = {
            "machine": this.selectedMachine.value,
            "startDate": new Date(this.startDate.value).toISOString(),
            "endDate": new Date(this.endDate.value).toISOString(),

        }

        const res = {
            "TimeSeries": [
                {
                    "CONICIDAD_P1P2": {
                        "0": 0.0021249084,
                        "1": 0.0015485245,
                        "2": 0.0024454785,
                        "3": 0.0024918141,
                        "4": 0.0028869088,
                        "5": 0.0017999695,
                        "6": 0.0020547528,
                        "7": 0.0026046061,
                        "8": 0.0011946838,
                        "9": 0.0017796904
                    },
                    "P21_DIAMETRO": {
                        "0": -0.0069316882,
                        "1": -0.0062386887,
                        "2": -0.0066123563,
                        "3": -0.0063592624,
                        "4": -0.0077794511,
                        "5": -0.0106560346,
                        "6": -0.0115994588,
                        "7": -0.0123436004,
                        "8": -0.0149155129,
                        "9": -0.0130309975
                    },
                    "P11_DIAMETRO": {
                        "0": -0.009056597,
                        "1": -0.0077872132,
                        "2": -0.0090578347,
                        "3": -0.0088510765,
                        "4": -0.0106663592,
                        "5": -0.0124560045,
                        "6": -0.0136542115,
                        "7": -0.014948207,
                        "8": -0.0161101967,
                        "9": -0.0148106879
                    }
                }
            ],
            "Report": [
                {
                    "0": {
                        "Cantidad": "10",
                        "Piezas OK": 10,
                        "Piezas NOK": 0,
                        "D": 0,
                        "D11": 0,
                        "D21": 0,
                        "Conicidad": 0,
                        "Retalon": 0,
                        "DM duplicados": 1
                    },
                    "1": {
                        "Cantidad": "PPM",
                        "Piezas OK": 1000000.0,
                        "Piezas NOK": 0.0,
                        "D": 0.0,
                        "D11": 0.0,
                        "D21": 0.0,
                        "Conicidad": 0.0,
                        "Retalon": 0.0,
                        "DM duplicados": 100000.0
                    },
                    "2": {
                        "Cantidad": "%",
                        "Piezas OK": 100.0,
                        "Piezas NOK": 0.0,
                        "D": 0.0,
                        "D11": 0.0,
                        "D21": 0.0,
                        "Conicidad": 0.0,
                        "Retalon": 0.0,
                        "DM duplicados": 10.0
                    }
                }
            ]
        }
        const scatter_dataset = [];
        if (res.TimeSeries.length) {
            const rawdata = res.TimeSeries[0];
            const keys = Object.keys(rawdata);
            keys.forEach(key => {
                const item = {};
                item["backgroundColor"] = "rgba(255,0,0,0.3)";
                item["label"] = key;
                item["pointRadius"] = 10;
                item["data"] = [];

                const seriesData = rawdata[key];
                const seriesDatakeys = Object.keys(seriesData);
                seriesDatakeys.forEach(serieskey => {
                    item["data"].push({ x: serieskey, y: seriesData[serieskey] })
                });
                scatter_dataset.push(item);
            })
        }
        this.scatterChartData = scatter_dataset;

        if (res.Report.length) {
            const rawdata = res.Report[0];
            this.pieChartData = [rawdata["0"]['Piezas OK'], rawdata["0"]['Piezas NOK']];
            this.displayedColumns.push(...Object.keys(rawdata["0"]));
            this.dataSource = new MatTableDataSource([rawdata["0"], rawdata["1"], rawdata["2"]]);
        }


        this.loading = false;
        //this.getMachineInfo(payload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });
            const scatter_dataset = [];
            if (res.TimeSeries.length) {
                const rawdata = res.TimeSeries[0];
                const keys = Object.keys(rawdata);
                keys.forEach(key => {
                    const item = {};
                    item["label"] = key;
                    item["pointRadius"] = 10;
                    item["data"] = [];
                    const seriesData = rawdata[key];
                    const seriesDatakeys = Object.keys(seriesData);
                    seriesDatakeys.forEach(serieskey => {
                        item["data"].push({ x: serieskey, y: seriesData[serieskey] })
                    });
                    scatter_dataset.push(item);
                })
            }

            this.loading = false;


        });
    }

}
