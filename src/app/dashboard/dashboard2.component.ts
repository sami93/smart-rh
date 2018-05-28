import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {TableData} from '../md/md-table/md-table.component';
import {LegendItem, ChartType} from '../md/md-chart/md-chart.component';

import * as Chartist from 'chartist';
import {AmChart, AmChartsService} from '@amcharts/amcharts3-angular';
import {DataSetService} from '../services/dataset.service';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {PredictionService} from '../services/prediction.service';
import {FormBuilder} from '@angular/forms';

declare const $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    public tableData: TableData;
    private chartSituationFamiliale: AmChart;
    private chartSeniorite: AmChart;
    private chartCivilite: AmChart;
    private chartAge: AmChart;
    private chart : any;
    private legend : any;
    private selected : any;

    private types : any = [{
        type: "Fossil Energy",
        percent: 70,
        subs: [{
            type: "Oil",
            percent: 15
        }, {
            type: "Coal",
            percent: 35
        }, {
            type: "Nuclear",
            percent: 20
        }]
    }, {
        type: "Green Energy",
        percent: 30,
        subs: [{
            type: "Hydro",
            percent: 15
        }, {
            type: "Wind",
            percent: 10
        }, {
            type: "Other",
            percent: 5
        }]
    }];

    constructor(private AmCharts: AmChartsService,
                public httpClient: HttpClient,
                public http: Http,
                public dialog: MatDialog,
                public dataService: DataService,
                public datasetService: DataSetService,
                public predictionservice: PredictionService,
                private router: Router,
                private formBuilder: FormBuilder) {
    }
    generateChartData() {
        var chartData = [];
        for (var i = 0; i < this.types.length; i++) {
            if (i == this.selected) {
                for (var x = 0; x < this.types[i].subs.length; x++) {
                    chartData.push({
                        type: this.types[i].subs[x].type,
                        percent: this.types[i].subs[x].percent,
                        pulled: true
                    });
                }
            } else {
                chartData.push({
                    type: this.types[i].type,
                    percent: this.types[i].percent,
                    id: i
                });
            }
        }
        return chartData;
    }

    generateChartData2(res : any) {
        var chartData = [];
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (i == this.selected) {
                for (var x = 0; x < res[i].tabs.length; x++) {
                    chartData.push({
                        _id: res[i].tabs[x]._id,
                        count: res[i].tabs[x].count,
                        pulled: true
                    });
                }
            } else {
                chartData.push({
                    _id: res[i]._id,
                    count: res[i].count,
                    id: i
                });
            }
        }
        return chartData;
    }
    // constructor(private navbarTitleService: NavbarTitleService) { }
    public ngOnInit() {

    }

    ngAfterViewInit() {
        this.datasetService.count_Civilite().subscribe(res =>{
                this.chartCivilite = this.AmCharts.makeChart("chartdivCivilite", {
                    "type": "pie",
                    "theme": "light",

                    "dataProvider": this.generateChartData2(res),
                    "labelText": "[[title]]: [[value]]",
                    "balloonText": "[[title]]: [[value]]",
                    "titleField": "_id",
                    "valueField": "count",
                    "outlineColor": "#FFFFFF",
                    "outlineAlpha": 0.8,
                    "outlineThickness": 2,
                    "colorField": "color",
                    "pulledField": "pulled",
                    "titles": [{
                        "text": "Civilité"
                    }],
                    "listeners": [{
                        "event": "clickSlice",
                        "method": (event) =>{
                            var chart = event.chart;
                            if (event.dataItem.dataContext.id != undefined) {
                                this.selected = event.dataItem.dataContext.id;

                            } else {
                                this.selected = undefined;
                            }
                            chart.dataProvider = this.generateChartData2(res);
                            chart.validateData();
                        }
                    }],
                    "export": {
                        "enabled": true
                    }
                });
            },
            err => {

            })
        this.datasetService.count_partition_Age().subscribe(res => {
            this.chartAge = this.AmCharts.makeChart("chartdivAge", {
                "theme": "none",
                "type": "serial",
                'startDuration': 1,
                "dataProvider": res,
                "valueAxes": [{
                    "title": "Partition par Âge"
                }],
                "graphs": [{
                    "balloonText": "Nombre des employés :[[count]]",
                    "fillAlphas": 1,
                    "lineAlpha": 0.2,
                    "title": "count",
                    "type": "column",
                    "valueField": "count"
                }],
                "depth3D": 20,
                "angle": 30,
                "rotate": true,
                "categoryField": "_id",
                "categoryAxis": {
                    "gridPosition": "start",
                    "fillAlpha": 0.05,
                    "position": "left"
                },
                "export": {
                    "enabled": true
                }
            });
        }, erreur => {
        });

        this.datasetService.count_SITUATION_FAMILIALE().subscribe(res => {
            this.chartSituationFamiliale = this.AmCharts.makeChart('chartSituationFamiliale', {
                'type': 'pie',
                'theme': 'light',
                'titles': [{
                    'text': 'Situation Familiale',
                    'size': 16
                }],
                'dataProvider': res,
                'valueField': 'count',
                'titleField': '_id',
                'startEffect': 'elastic',
                'startDuration': 1,
                'labelRadius': 15,
                'innerRadius': '50%',
                'depth3D': 10,
                'balloonText': '[[title]]<br><span style=\'font-size:14px\'><b>[[value]]</b> ([[percents]]%)</span>',
                'angle': 15,
                'export': {
                    'enabled': true
                }
            });
        }, erreur => {
        });

        this.datasetService.count_Seniorite().subscribe(res => {
            this.chartSeniorite = this.AmCharts.makeChart('chartSeniorite', {
                "type": "funnel",
                "theme": "light",
                'titles': [{
                    'text': 'Séniorité',
                    'size': 16
                }],
                "dataProvider": res,
                "balloon": {
                    "fixedPosition": true
                },
                "valueField": "count",
                "titleField": "_id",
                "marginRight": 240,
                "marginLeft": 50,
                "startX": -500,
                "depth3D": 100,
                "angle": 40,
                'startDuration': 1,
                "outlineAlpha": 1,
                "outlineColor": "#FFFFFF",
                "outlineThickness": 2,
                "labelPosition": "right",
                "balloonText": "[[_id]]: [[count]]n[[description]]",
                "export": {
                    "enabled": true
                }
            });
        }, erreur => {
        });


        /*this.chart = this.AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "legend": {
                "horizontalGap": 10,
                "maxColumns": 1,
                "position": "right",
                "useGraphSettings": true,
                "markerSize": 10
            },
            "dataProvider": [{
                "year": 2003,
                "europe": 2.5,
                "namerica": 2.5,
                "asia": 2.1,
                "lamerica": 0.3,
                "meast": 0.2,
                "africa": 0.1
            }, {
                "year": 2004,
                "europe": 2.6,
                "namerica": 2.7,
                "asia": 2.2,
                "lamerica": 0.3,
                "meast": 0.3,
                "africa": 0.1
            }, {
                "year": 2005,
                "europe": 2.8,
                "namerica": 2.9,
                "asia": 2.4,
                "lamerica": 0.3,
                "meast": 0.3,
                "africa": 0.1
            }],
            "valueAxes": [{
                "stackType": "regular",
                "axisAlpha": 0.3,
                "gridAlpha": 0
            }],
            "graphs": [{
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Europe",
                "type": "column",
                "color": "#000000",
                "valueField": "europe"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "North America",
                "type": "column",
                "color": "#000000",
                "valueField": "namerica"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Asia-Pacific",
                "type": "column",
                "color": "#000000",
                "valueField": "asia"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Latin America",
                "type": "column",
                "color": "#000000",
                "valueField": "lamerica"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Middle-East",
                "type": "column",
                "color": "#000000",
                "valueField": "meast"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Africa",
                "type": "column",
                "color": "#000000",
                "valueField": "africa"
            }],
            "categoryField": "year",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left"
            },
            "export": {
                "enabled": true
            }

        });
        */


        /*   this.chart = this.AmCharts.makeChart("chartdiv",{
               "type": "serial",
               "categoryField": "category",
               "categoryAxis": {
                   "gridPosition": "start"
               },
               "graphs": [
                   {
                       "title": "Graph title",
                       "valueField": "column-1"
                   }
               ],
               "valueAxes": [
                   {
                       "title": "Axis title"
                   }
               ],
               "legend": {
                   "useGraphSettings": true
               },
               "titles": [
                   {
                       "size": 15,
                       "text": "Chart Title"
                   }
               ],
               "dataProvider": [
                   {
                       "category": "category 1",
                       "column-1": 8
                   },
                   {
                       "category": "category 2",
                       "column-1": 10
                   },
               ]
           });


   */

        const breakCards = true;
        if (breakCards === true) {
            // We break the cards headers if there is too much stress on them :-)
            $('[data-header-animation="true"]').each(function () {
                const $fix_button = $(this);
                const $card = $(this).parent('.card');
                $card.find('.fix-broken-card').click(function () {
                    const $header = $(this).parent().parent().siblings('.card-header, .card-image');
                    $header.removeClass('hinge').addClass('fadeInDown');

                    $card.attr('data-count', 0);

                    setTimeout(function () {
                        $header.removeClass('fadeInDown animate');
                    }, 480);
                });

                $card.mouseenter(function () {
                    const $this = $(this);
                    const hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
                    $this.attr('data-count', hover_count);
                    if (hover_count >= 20) {
                        $(this).children('.card-header, .card-image').addClass('hinge animated');
                    }
                });
            });
        }
    }

    ngOnDestroy() {
        if (this.chart) {
            this.AmCharts.destroyChart(this.chart);
        }
    }

}
