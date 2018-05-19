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
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    public tableData: TableData;
    private chart: AmChart;


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

    startAnimationForLineChart(chart: any) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;
        chart.on('draw', function (data: any) {

            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    }

    startAnimationForBarChart(chart: any) {
        let seq2: any, delays2: any, durations2: any;
        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data: any) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    }

    // constructor(private navbarTitleService: NavbarTitleService) { }
    public ngOnInit() {
        this.tableData = {
            headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
            dataRows: [
                ['US', 'USA', '2.920	', '53.23%'],
                ['DE', 'Germany', '1.300', '20.43%'],
                ['AU', 'Australia', '760', '10.35%'],
                ['GB', 'United Kingdom	', '690', '7.87%'],
                ['RO', 'Romania', '600', '5.94%'],
                ['BR', 'Brasil', '550', '4.34%']
            ]
        };
        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        const dataDailySalesChart = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 17, 7, 17, 23, 18, 38]
            ]
        };

        const optionsDailySalesChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        };

        const dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);
        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                [230, 750, 450, 300, 280, 240, 200, 190]
            ]
        };

        const optionsCompletedTasksChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better
            // look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        };

        const completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart,
            optionsCompletedTasksChart);

        this.startAnimationForLineChart(completedTasksChart);

        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        const dataWebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

            ]
        };
        const optionsWebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
        };
        const responsiveOptions: any = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];
        const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);

        this.startAnimationForBarChart(websiteViewsChart);

        const mapData = {
            'AU': 760,
            'BR': 550,
            'CA': 120,
            'DE': 1300,
            'FR': 540,
            'GB': 690,
            'GE': 200,
            'IN': 200,
            'RO': 600,
            'RU': 300,
            'US': 2920,
        };
        $('#worldMap').vectorMap({
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    fill: '#e4e4e4',
                    'fill-opacity': 0.9,
                    stroke: 'none',
                    'stroke-width': 0,
                    'stroke-opacity': 0
                }
            },

            series: {
                regions: [{
                    values: mapData,
                    scale: ['#AAAAAA', '#444444'],
                    normalizeFunction: 'polynomial'
                }]
            },
        });
    }

    ngAfterViewInit() {

        this.datasetService.count_SITUATION_FAMILIALE().subscribe(res => {
            this.chart = this.AmCharts.makeChart('chartSituationFamiliale', {
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
                'startDuration': 2,
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
            this.chart = this.AmCharts.makeChart('chartSeniorite', {
                'type': 'pie',
                'theme': 'light',
                'titles': [{
                    'text': 'Séniorité',
                    'size': 16
                }],
                'dataProvider': res,
                'valueField': 'count',
                'titleField': '_id',
                'startEffect': 'elastic',
                'startDuration': 2,
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
