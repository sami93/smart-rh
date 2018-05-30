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
import * as JSPdf from 'jspdf';
import swal from "sweetalert2";

declare var jsPDF: any; // Important


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
    private chartPrediction: AmChart;
    private chartPole: any;
    private chartManager: any;
    private chartAge: AmChart;
    private chart: any;
    private legend: any;
    private selected: any;
    private datePrediction: any;
    private dateNow: any;
    private tableObjectResult: any = [];
    private objResult = {}
    private types: any = [{
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

    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }

    count_result(tableList) {
        this.tableObjectResult = [];

        var count_0508 = 0;
        var count_1 = 0;
        tableList.forEach((entry, i) => {
            if (entry.DEM > 0.5) {
                if (entry.DEM < 0.8) {
                    count_0508++;
                }

            }
            if (entry.DEM > 0.8) {
                count_1++;
            }
        })

        var objResult = {};
        var objResult2 = {};
        if (count_0508 > 0) {

            objResult['_id'] = "Démission entre 0.5 & 0.8";
            objResult['count'] = count_0508;
            this.tableObjectResult.push(objResult);
        }
        if (count_1 > 0) {

            objResult2['_id'] = "Démission entre 0.8 & 1";
            objResult2['count'] = count_1;
            this.tableObjectResult.push(objResult2);
        }

    }

    EmployeeAllPrediction() {
        const todayTime = new Date();

        const year = (todayTime.getFullYear());
        const month = ('0' + (todayTime.getMonth() + 1)).slice(-2);
        const day = ('0' + todayTime.getDate()).slice(-2);
        // this.dateNow = year + '-' + month + '-' + day
        this.datePrediction = "1993-01-01";
        // console.log(this.dateNow)
        var today = new Date();
        // $('#datePrediction').val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        swal({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous effectuer la prédiction ?',
            type: 'warning',
            html:
            '<b>Date de prédiction: </b>' +

            '<input id="datePrediction" type="date" name="datePrediction" [ngModel]="datePrediction" (ngModelChange)="datePrediction = $event"\n' +
            'value="2020-01-01" #datePrediction="ngModel" > ',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then((res) => {
            var obj = {}
            if ($('#datePrediction').val() == "") {
                obj['dateNow'] = month + '/' + day + '/' + year;
            }
            else obj['dateNow'] = this.getConvertedDate($('#datePrediction').val());

            var newdateNow = month + '/' + day + '/' + year;
            var date1 = new Date(newdateNow);
            var date2 = new Date(obj['dateNow']);
            var timeDiff = date2.getTime() - date1.getTime();

            if (timeDiff >= 0) {
                swal({
                    title: 'Chargement Prédiction ...',
                    text: 'Il va se fermer en quelques secondes.',
                    timer: 70000,
                    onOpen: () => {
                        this.predictionservice.getPredictionAllEmployee(obj).subscribe(data => {

                            swal.hideLoading();
                            this.count_result(data);
                            console.log(this.tableObjectResult);
                            const datefull = data[0].datefull
                            var columns = ["Matricule", "Prénom", "Nom", "Prédiction de démission", "Temps", "Date"];
                            var result = [];
                            data.forEach((entry, i) => {
                                var elementTable = []
                                elementTable[0] = entry.Matricule;
                                elementTable[1] = entry.PRENOM;
                                elementTable[2] = entry.NOM;
                                elementTable[3] = entry.DEM;
                                elementTable[4] = entry.Temps;
                                elementTable[5] = entry.datefull;
                                result.push(elementTable);
                            });

                            //   console.log(result);
// Only pt supported (not mm or in)
                            var doc2 = new jsPDF('p', 'pt');

                            doc2.autoTable(columns, result);
                            doc2.save(datefull + ' Nombre : ' + result.length + ' employés.pdf');


                            this.chartPrediction = this.AmCharts.makeChart('chartPrediction', {
                                'type': 'pie',
                                'theme': 'light',
                                'titles': [{
                                    'text': 'Prédiction pour la date : ' + datefull + ' | Totale =' + result.length,
                                    'size': 16
                                }],
                                'dataProvider': this.tableObjectResult,
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


                        }, err => {
                        })
                        swal.showLoading();
                    }
                }).then((result) => {

                    //result.dismiss === 0

                });

            }
            else if (timeDiff < 0) {
                this.erreur("Vérifier la date choisie", "Erreur");
            }


            //console.log(timeDiff)


        }, (dismiss) => {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
                swal({
                    title: 'Annulé',
                    text: '',
                    type: 'error',
                    confirmButtonClass: 'btn btn-info',
                    buttonsStyling: false
                });
            }
        }).catch(swal.noop);
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

    generateChartData2(res: any) {
        var chartData = [];
        // console.log(res);
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

    getConvertedDate(convertDate) {

        var returnDate = "";
        var today = new Date(convertDate);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //because January is 0!
        var yyyy = today.getFullYear();
        //Interpolation date


        if (mm < 10) {
            returnDate += `0${mm}/`;
        } else {
            returnDate += `${mm}/`;
        }
        if (dd < 10) {
            returnDate += `0${dd}/`;
        } else {
            returnDate += `${dd}/`;
        }
        returnDate += yyyy;
        return returnDate;
    }

    ngAfterViewInit() {

        this.datasetService.count_Manager().subscribe(res => {
                this.chartManager = this.AmCharts.makeChart("chartdivManager", {
                    "theme": "light",
                    "type": "serial",
                    "dataProvider": res,
                    "valueAxes": [{
                        "title": "Nombre des employés classés par manager"
                    }],
                    "graphs": [{
                        "balloonText": "[[category]]:[[value]] employés",
                        "fillAlphas": 1,
                        "lineAlpha": 0.2,
                        "title": "Income",
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

                //  this.chartPole.legend.addListener("rollOverItem", this.handleRollOver);


            },
            err => {

            })
        this.datasetService.count_Pole().subscribe(res => {
                this.chartPole = this.AmCharts.makeChart("chartdivPole", {
                    "type": "pie",
                    "startDuration": 1,
                    "theme": "light",
                    'titles': [{
                        'text': 'Pôle',
                        'size': 16
                    }],
                    "addClassNames": false,
                    "legend": {
                        "position": "right",
                        "marginRight": 100,
                        "autoMargins": false
                    },
                    "innerRadius": "30%",
                    "defs": {
                        "filter": [{
                            "id": "shadow",
                            "width": "200%",
                            "height": "200%",
                            "feOffset": {
                                "result": "offOut",
                                "in": "SourceAlpha",
                                "dx": 0,
                                "dy": 0
                            },
                            "feGaussianBlur": {
                                "result": "blurOut",
                                "in": "offOut",
                                "stdDeviation": 5
                            },
                            "feBlend": {
                                "in": "SourceGraphic",
                                "in2": "blurOut",
                                "mode": "normal"
                            }
                        }]
                    },
                    "dataProvider": res,
                    "valueField": "count",
                    "titleField": "_id",
                    "export": {
                        "enabled": true
                    }
                });

                //  this.chartPole.legend.addListener("rollOverItem", this.handleRollOver);


            },
            err => {

            })


        this.datasetService.count_Civilite().subscribe(res => {
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
                    "marginTop": 0,
                    "pulledField": "pulled",
                    "titles": [{
                        "text": "Civilité",
                        'size': 16
                    }],
                    "valueAxes": [{
                        "title": "Partition par Âge"
                    }],
                    "listeners": [{
                        "event": "clickSlice",
                        "method": (event) => {
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
                "balloonText": "[[_id]]: [[count]] employés[[description]]",
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
