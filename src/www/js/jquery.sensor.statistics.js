/*
 * CITI-SENSE sensor reading visualization widget, jQuery plugin
 *
 * Copyright(c) 2014, CITI-SENSE, U-Hopper, Andrei Tamilin
 *
 */
// avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// sensor readings visualization widget
(function ($) {
    $.fn.extend({
        sensorstatistics: function (settings) {
            var $this = $(this);
            var serviceUrl = 'http://citisense.u-hopper.com';
//            var serviceUrl = 'http://citisense.local';

            function CitisenseSensorWidget(settings) {
                // unique id
                var uuid = new Date().getTime();
                var uri = serviceUrl + '/sensors_lookup.php';
                var chart = null;

                // default settings    
                var options = {
                    uuid: uuid,
                    uri: uri,
                    id: "",
                    type: "realtime",
                    storage_version: null,
                    observed_property: null,
                    title: "",
                    subtitle: "",
                    from: null,
                    to: null,
                    env: "prod",
                    filters: {
                        sensorId: null
                    },
                    measurement: {
                        type: null,
                        observedProperty: null
                    },
                    min: 0,
                    max: 0,
                    bands: [],
                    lines: [],
                    async: true,
                    refresh: 0,
                    cache: false,
                    before: function (el, options) {
                        if (!$('.ssw-loading', el).length)
                            el.append('<div class="ssw-loading"><span></span></div>');
                        else
                            $('.ssw-loading', el).show();
                    },
                    after: function (el, options) {
                        // if ($(".next-days", el).length) {
                        // $(".next-days", el).delay(500).toggle("fast");
                        // }
                    },
                    success: function (el, jsonData, options) {
                        $('.cf-loading', el).hide();
                        displayChart(el, jsonData);
                    },
                    fail: function (el, options) {
                        el.html('<div class="error"><span>' + options.msgError + '</span></div>');
                    }
                };

                // The function getSensorData excutes an Ajax request to get sensor data
                var getSensorData = function (el) {
                    var urlParams = "1=1";

                    if (options.env != null)
                        urlParams += "&env=" + options.env;
                    if (options.filters.sensorId != null)
                        urlParams += "&sensorId=" + options.filters.sensorId;
                    if (options.measurement.type != null)
                        urlParams += "&measurement=" + options.measurement.type;
                    if (options.measurement.observedProperty != null)
                        urlParams += "&observedProperty=" + options.measurement.observedProperty;

                    if (options.from && options.from != null) {
                        urlParams += ("&from=" + options.from);
                    }
                    if (options.to && options.to != null) {
                        urlParams += ("&to=" + options.to);
                    }
                    switch (options.type) {
                        case 'realtime':
                            urlParams += "&latestMeasurement=true";
                            break;
                        case 'historic':
                            urlParams += "&latestMeasurement=false";
                            break;
                    }

                    if (options.storage_version) {
                        urlParams += ("&storage_version=" + options.storage_version);
                    }

                    var url = options.uri + '?' + urlParams;

                    // call before method
                    options.before(el);

                    console.log("REQUEST: " + url);
                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        async: options.async,
                        // beforeSend : options.before(el, options)
                    }).done(function (response) {
                        options.success(el, response, options);
                    }).fail(function (options) {
                        options.fail(el, options);
                    });
                };
                /** 
                 * This function display the chart
                 * @param el a jQuery object
                 * @param chartData a JSON object contains the chart data
                 */
                var displayChart = function (el, measurements) {
                    if (chart == null) {
                        var chartOptions = $.extend(true, {chart: {renderTo: el[0]}}, getChartByType(options.type, measurements));
                        chart = new Highcharts.Chart(chartOptions);
                    } else {
                        console.log('Reusing existing chart ' + options.type);
                        if (measurements.length > 0 && measurements[0].measurement)
                            chart.series[0].setData([Number(measurements[0].measurement.value)]);
                    }
                };

                var getChartByType = function (type, measurements) {

                    var chartOptions = {
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        title: {
                            text: options.title ? options.title : false
                        },
                        subtitle: {
                            text: options.subtitle ? options.subtitle : false
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            borderWidth: 0,
                            enabled: false
                        },
                        // plotOptions: {
                        // series: {
                        // animation: false
                        // }
                        // },
                        series: []
                    };
                    switch (type) {
                        case 'realtime' :
                        {
                            var measurement = measurements.length > 0 ? measurements[0].measurement : {};
                            var data = [];
                            if (measurement.value) {
                                data.push(Number(measurement.value));
                            }
                            chartOptions = $.extend(true, chartOptions, {
                                chart: {
                                    type: 'gauge',
                                    plotBackgroundColor: null,
                                    plotBackgroundImage: null,
                                    plotBorderWidth: 0,
                                    plotShadow: false
                                },
                                pane: {
                                    startAngle: -150,
                                    endAngle: 150
                                },
                                // the value axis
                                yAxis: {
                                    min: options.min,
                                    max: options.max,
                                    minorTickInterval: 'auto',
                                    minorTickWidth: 1,
                                    minorTickLength: 10,
                                    minorTickPosition: 'inside',
                                    minorTickColor: '#666',
                                    tickPixelInterval: 30,
                                    tickWidth: 2,
                                    tickPosition: 'inside',
                                    tickLength: 10,
                                    tickColor: '#666',
                                    labels: {
                                        step: 2,
                                        rotation: 'auto'
                                    },
                                    title: {
                                        text: measurement.uom ? measurement.uom : ""
                                    },
                                    plotBands: options.bands,
                                    plotLines: options.lines
                                },
                                series: [{
                                        name: options.title,
                                        data: data,
                                        tooltip: {
                                            valueSuffix: ' ' + (measurement.uom ? measurement.uom : "")
                                        }
                                    }]
                            });

                            break;
                        }
                        case 'historic' :
                        {
                            var series = [];
                            $.each(measurements, function(index, sensorData){
                                var sensorMeasurements = sensorData.measurements;
                                
                                var data = [];
                                // collect and sort by time the data
                                var dataObj = [];

                                for (var i = 0, len = sensorMeasurements.length; i < len; i++) {
                                    var date = new Date(sensorMeasurements[i].measuretime);
                                    var value = Number(sensorMeasurements[i].value);
                                    if (options.measurement.type == 'value') {
                                        value = Number(sensorMeasurements[i].value);
                                    }
                                    else if (options.measurement.type == 'caqi' || options.measurement.type == 'globalcaqi') {
                                        value = Number(sensorMeasurements[i].aqivalue);
                                    }
                                    dataObj.push({'t': date.getTime(), 'v': value});
                                }

                                dataObj.sort(function (a, b) {
                                    return a.t - b.t;
                                });

                                // create data object for highcharts
                                for (var i = 0, len = dataObj.length; i < len; i++) {
                                    data.push([dataObj[i].t, dataObj[i].v]);
                                }
                                
                                series.push({
//					type: 'column',
                                    name: sensorData.identifier,
                                    data: data,
                                    sensorData: sensorData
                                });
                            });
                            
                            var yAxisTitle = 'Measurements';
                            if (options.measurement.type == 'value') {
                                yAxisTitle = options.measurement.observedProperty;
                            }
                            else if (options.measurement.type == 'caqi') {
                                yAxisTitle = options.measurement.observedProperty + " CAQI";
                            }
                            else if (options.measurement.type == 'globalcaqi') {
                                yAxisTitle = "Global CAQI";
                            }
                            
                            chartOptions = $.extend(true, chartOptions, {
                                chart : {
                                    zoomType: 'x'
                                },
                                legend: {
                                    enabled: series.length <= 1 ? false : true
                                },
                                xAxis: {
                                    type: 'datetime'
                                },
                                yAxis: {
                                    title: {
                                        text: yAxisTitle
                                    },
                                    min: options.min,
//                                  allowDecimals: false
                                    plotBands: options.bands,
                                    plotLines: options.lines
                                },
                                tooltip: {
                                    formatter: function () {
                                        var tooltip = 
                                            'Identifier: ' + this.series.userOptions.sensorData.identifier + '<br>' +
//                                            'Description: ' + this.series.userOptions.sensorData.description + '<br>' +
                                            'Type: ' + this.series.userOptions.sensorData.type + '<br>' +
                                            'Location: ' + this.series.userOptions.sensorData.location + '<br>' +
                                            'Provider: ' + this.series.userOptions.sensorData.sensorProviderID + '<br>' +
                                            yAxisTitle + ': ' + this.y  + '<br>' +
                                            'Measuretime' + ': ' + Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.x));
                                        return tooltip;
                                    }
                                },
                                series: series
                            });

                            break;
                        }
                    }
                    return chartOptions;
                };
                /**
                 * setDefaults function set the default settings
                 * @param settings JSON object
                 */
                var setDefaults = function (settings) {
                    $.extend(options, settings);
                    return this;
                };
                // set dafault settings
                setDefaults(settings || {});

                $this.addClass('citisense-widget');
                getSensorData($this);
                if (options.refresh > 0)
                    setInterval(function () {
                        getSensorData($this);
                    }, options.refresh);
            }
            ;
            // initialisation 
            return this.each(function () {
//				if (!$("link[href='" + serviceUrl + "/widgets/sensors/jquery.sensor.statistics.css']").length)
//					$("<link href='" + serviceUrl + "/widgets/sensors/jquery.sensor.statistics.css' rel='stylesheet'>").appendTo("head");
//           		
//				if (!$("script[src='" + serviceUrl + "/js/vendor/highcharts/highcharts.js']").length)           		
//					$("<script src='" + serviceUrl + "/js/vendor/highcharts/highcharts.js'>").appendTo("head");
//
//				if (!$("script[src='" + serviceUrl + "/js/vendor/highcharts/highcharts-more.js']").length)           		
//					$("<script src='" + serviceUrl + "/js/vendor/highcharts/highcharts-more.js'>").appendTo("head");

                new CitisenseSensorWidget(settings);
                return this;
            });
        }
    });
})(jQuery);