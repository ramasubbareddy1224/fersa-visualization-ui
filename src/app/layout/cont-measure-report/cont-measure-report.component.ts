import { getColorCode, getDateTimeString } from './../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label,BaseChartDirective } from 'ng2-charts';
import { DailyReportMachineNames } from './../../constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import zoomPlugin from 'chartjs-plugin-zoom';
@Component({
    selector: 'app-cont-measure-report',
    templateUrl: './cont-measure-report.component.html',
    styleUrls: ['./cont-measure-report.component.scss']
})
export class ContMeasureReportComponent implements OnInit {

    @ViewChild('scatterChartID') scatterChartID: BaseChartDirective;
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
    machineList = DailyReportMachineNames;
    selectedMachine = new FormControl(null, Validators.required);
    startDate = new FormControl(null, Validators.required);
    endDate = new FormControl(null, Validators.required);

    // Pie
    pieChartList = [];
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: "Rejection Rate (%)",
            position: 'bottom'
        }
    };
    public pieChartLabels: Label[] = ['OK', 'NOK'];
    public pieChartData: number[] = [];
    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartColors = [{
        backgroundColor: ["rgba(0,255,0,0.3)", "rgba(255,0,0,0.3)"],
    },
    ];

    // scatter
    public scatterChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            zoom: {
                pan: {
                    enabled: false,
                    mode: 'x',
                    speed: 20,
                    threshold: 10
                },
                zoom: {
                    enabled: true,
                    // drag: true,
                    mode: 'xy',
                    speed: 0.1,
                    threshold: 2,
                    sensitivity: 3,
                    drag: {
                        borderColor: 'rgba(225,225,225,0.3)',
                        borderWidth: 5,
                        backgroundColor: 'rgb(225,225,225)',
                        animationDuration: 0
                    },
                }
            }
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Índice'
                }
            }], yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Medida'
                }
            }]
        }
    };

    public scatterChartData: ChartDataSets[] = null;
    public scatterChartType: ChartType = 'scatter';
    public scatterChartPlugins = [zoomPlugin];

    public barChartOptions: ChartOptions = {
        responsive: true,
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Grupos'
                }
            }], yAxes: [{
                display: true,
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

    displayedColumns = [];
    dataSource: any;

    private machineInfoURL = `${environment.REPORT_API_URL}rejectionanalysis`;

    constructor(private _httpClient: HttpClient) { }

    ngOnInit(): void {
    }

    search() {
        this.loading = true;
        this.barChartData = [];
        this.displayedColumns = [];
        this.pieChartList = [];
        const payload = {
            "machine": this.selectedMachine.value,
            "date_start": getDateTimeString(this.startDate.value),
            "date_end": getDateTimeString(this.endDate.value),
            "lineid": "z3"

        }

        // const res = {
        //     "TimeSeries": [
        //         {
        //             "CONICIDAD_P1P2": {
        //                 "0": 0.0021249084,
        //                 "1": 0.0015485245,
        //                 "2": 0.0024454785,
        //                 "3": 0.0024918141,
        //                 "4": 0.0028869088,
        //                 "5": 0.0017999695,
        //                 "6": 0.0020547528,
        //                 "7": 0.0026046061,
        //                 "8": 0.0011946838,
        //                 "9": 0.0017796904
        //             },
        //             "P21_DIAMETRO": {
        //                 "0": -0.0069316882,
        //                 "1": -0.0062386887,
        //                 "2": -0.0066123563,
        //                 "3": -0.0063592624,
        //                 "4": -0.0077794511,
        //                 "5": -0.0106560346,
        //                 "6": -0.0115994588,
        //                 "7": -0.0123436004,
        //                 "8": -0.0149155129,
        //                 "9": -0.0130309975
        //             },
        //             "P11_DIAMETRO": {
        //                 "0": -0.009056597,
        //                 "1": -0.0077872132,
        //                 "2": -0.0090578347,
        //                 "3": -0.0088510765,
        //                 "4": -0.0106663592,
        //                 "5": -0.0124560045,
        //                 "6": -0.0136542115,
        //                 "7": -0.014948207,
        //                 "8": -0.0161101967,
        //                 "9": -0.0148106879
        //             }
        //         }
        //     ],
        //     "Report": [
        //         {
        //             "0": {
        //                 "Cantidad": "10",
        //                 "Piezas OK": 10,
        //                 "Piezas NOK": 0,
        //                 "D": 0,
        //                 "D11": 0,
        //                 "D21": 0,
        //                 "Conicidad": 0,
        //                 "Retalon": 0,
        //                 "DM duplicados": 1
        //             },
        //             "1": {
        //                 "Cantidad": "PPM",
        //                 "Piezas OK": 1000000.0,
        //                 "Piezas NOK": 0.0,
        //                 "D": 0.0,
        //                 "D11": 0.0,
        //                 "D21": 0.0,
        //                 "Conicidad": 0.0,
        //                 "Retalon": 0.0,
        //                 "DM duplicados": 100000.0
        //             },
        //             "2": {
        //                 "Cantidad": "%",
        //                 "Piezas OK": 100.0,
        //                 "Piezas NOK": 0.0,
        //                 "D": 0.0,
        //                 "D11": 0.0,
        //                 "D21": 0.0,
        //                 "Conicidad": 0.0,
        //                 "Retalon": 0.0,
        //                 "DM duplicados": 10.0
        //             }
        //         }
        //     ],
        //     "Histogram": [
        //         {
        //             "Group": {
        //                 "0": 6,
        //                 "1": 0,
        //                 "2": 2,
        //                 "3": 7,
        //                 "4": 12,
        //                 "5": 18,
        //                 "6": 3,
        //                 "7": 2,
        //                 "8": 1,
        //                 "9": 4
        //             }
        //         }
        //     ],
        //     "PieChart": [
        //         {
        //             "Pie 1": {
        //                 "title": "Rejection Ratio (%)",
        //                 "ok": "86.6",
        //                 "nok": "13.4"
        //             },
        //             "Pie 2": {
        //                 "title": "Coni",
        //                 "ok": "86.6",
        //                 "nok": "13.4"
        //             },
        //             "Pie 3": {
        //                 "title": "Test1",
        //                 "ok": "76.6",
        //                 "nok": "23.4"
        //             },
        //             "Pie 4": {
        //                 "title": "Test",
        //                 "ok": 76.601,
        //                 "nok": 33.401
        //             }
        //         }
        //     ]
        // }

        // if (res.TimeSeries.length) {
        //     const scatter_dataset = [];
        //     const rawdata = res.TimeSeries[0];
        //     const keys = Object.keys(rawdata);
        //     keys.forEach((key, inx) => {
        //         const colorCode = getColorCode(inx);
        //         const item = {};
        //         item["backgroundColor"] = colorCode;
        //         item["borderColor"] = colorCode;
        //         item["label"] = key;
        //         item["pointRadius"] = 4;
        //         item["pointBackgroundColor"] = [colorCode]
        //         item["data"] = [];

        //         const seriesData = rawdata[key];
        //         const seriesDatakeys = Object.keys(seriesData);
        //         seriesDatakeys.forEach(serieskey => {
        //             item["data"].push({ x: serieskey, y: seriesData[serieskey] })
        //         });
        //         scatter_dataset.push(item);
        //     })
        //     this.scatterChartData = scatter_dataset;
        // }


        // if (res.Histogram && res.Histogram.length) {
        //     const rawdata = res.Histogram[0]["Group"];
        //     this.barChartLabels = Object.keys(rawdata);
        //     const histo_data = {};
        //     histo_data["label"] = "report";
        //     histo_data["data"] = Object.values(rawdata);
        //     this.barChartData.push(histo_data);

        // }

        // if (res.Report.length) {
        //     const rawdata = res.Report[0];
        //     this.pieChartData = [rawdata["2"]['Piezas OK'], rawdata["2"]['Piezas NOK']];
        //     this.displayedColumns.push(...Object.keys(rawdata["0"]));
        //     this.dataSource = new MatTableDataSource([rawdata["0"], rawdata["1"], rawdata["2"]]);
        // }
        // if (res.PieChart.length) {
        //     const rawdata = res.PieChart[0];
        //     Object.keys(rawdata).forEach(piechart => {
        //         const chart = {
        //             pieChartType: "pie",
        //             pieChartLegend: false,
        //             pieChartColors: [{
        //                 backgroundColor: ["rgba(0,255,0,0.3)", "rgba(255,0,0,0.3)"]
        //             }],
        //             pieChartOptions: this.createPieChartOptions(rawdata[piechart]["title"]),
        //             pieChartLabels: ['OK', 'NOK'],
        //             pieChartData: [rawdata[piechart]["ok"], rawdata[piechart]["nok"]]
        //         };
        //         this.pieChartList.push(chart);

        //     })

        // }


        // this.loading = false;

        this.getMachineInfo(payload);
    }
    getMachineInfo(payload) {
        this._httpClient.post(this.machineInfoURL, payload).subscribe((res: any) => {
            console.log({ res });

            if (res.TimeSeries.length) {
                const scatter_dataset = [];
                const rawdata = res.TimeSeries[0];
                const keys = Object.keys(rawdata);
                keys.forEach((key, inx) => {
                    const colorCode = getColorCode(inx);
                    const item = {};
                    item["backgroundColor"] = colorCode;
                    item["borderColor"] = colorCode;
                    item["label"] = key;
                    item["pointRadius"] = 4;
                    item["pointBackgroundColor"] = [colorCode]
                    item["data"] = [];

                    const seriesData = rawdata[key];
                    const seriesDatakeys = Object.keys(seriesData);
                    seriesDatakeys.forEach(serieskey => {
                        item["data"].push({ x: serieskey, y: seriesData[serieskey] })
                    });
                    scatter_dataset.push(item);
                })
                this.scatterChartData = scatter_dataset;
            }


            if (res.Histogram && res.Histogram.length) {
                const rawdata = res.Histogram[0]["Group"];
                this.barChartLabels = Object.keys(rawdata);
                const histo_data = {};
                histo_data["label"] = "report";
                histo_data["data"] = Object.values(rawdata);
                this.barChartData.push(histo_data);

            }

            if (res.Report.length) {
                const rawdata = res.Report[0];
                this.pieChartData = [rawdata["2"]['Piezas OK'], rawdata["2"]['Piezas NOK']];
                this.displayedColumns.push(...Object.keys(rawdata["0"]));
                this.dataSource = new MatTableDataSource([rawdata["0"], rawdata["1"], rawdata["2"]]);
            }
            if (res.PieChart.length) {
                const rawdata = res.PieChart[0];
                Object.keys(rawdata).forEach(piechart => {
                    const chart = {
                        pieChartType: "pie",
                        pieChartLegend: true,
                        pieChartColors: [{
                            backgroundColor: ["rgba(0,255,0,0.3)", "rgba(255,0,0,0.3)"]
                        }],
                        pieChartOptions: this.createPieChartOptions(rawdata[piechart]["title"]),
                        pieChartLabels: ['OK', 'NOK'],
                        pieChartData: [rawdata[piechart]["ok"], rawdata[piechart]["nok"]]
                    };
                    this.pieChartList.push(chart);

                })

            }
            this.loading = false;


        });
    }

    createPieChartOptions(title) {
        const options: ChartOptions = {
            responsive: true,
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                position: 'bottom'
            },
            layout: {
                padding: {
                    top: 45,
                    left: 0,
                    right: 0,
                    bottom: 40
                }
            },
            plugins: {
                legend: false,
                outlabels: {
                    display: true,
                    text: '%l',
                    color: 'black',
                    font: {
                        minSize: 11
                    }
                }
            }
        };

        return options;
    }
    resetscatterchart(){
        this.scatterChartID.chart["resetZoom"]();
    }


}
