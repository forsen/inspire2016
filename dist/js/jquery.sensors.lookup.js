/*
 * Physical activitiy visualization widget, jQuery plugin
 *
 * Copyright(c) 2013, CITI-SENSE, U-Hopper, Andrei Tamilin
 *
 */
// avoid `console` errors in browsers that lack a console.
(function() {
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

// questionnaire results widget
(function($){
  $.fn.extend({
    state : {
      map: null,
      data: null,
      layers: [],
      markers: []
    },
    getData: function() {
      return this.state.data;
    },
    getLayers: function() {
      return this.state.layers;
    },
    getMarkers: function() {
      return this.state.markers;
    },
    getMap: function() {
      return this.state.map;
    },
    sensorslookup: function (settings) {
      var $this = $(this);
      var serviceUrl = 'http://citisense.u-hopper.com';
//             var serviceUrl = 'http://citisense.local';

      function SensorsLookup(settings){
        // unique id
        var uuid     = new Date().getTime();
        var uri      = serviceUrl + '/sensors_lookup.php';
        var chart = null;
        var map = null;

        // default settings
        var options = {
          uuid: uuid,
          uri: uri,
          title: null,
          subtitle: null,
          layers: [],
          type: "list",
          env: "prod",
          from: null,
          to: null,
          callbacks: {
            dataLoadCompleted: null,
            dataLoadFailed: null,
            visualizationReady: null
          },
          filters: {
            sensorId: null,
            location: null,
            status: null,
            provider: null,
            description: null,
            type: null,
            bbox: null,
            limit: null
          },
          measurement: {
            average: false,
            latest: false,
            type: null,
            observedProperty: null
          },
          async: true,
          refresh: 0,
          cache: false,
          icons: {
            'Mobile': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            'Static': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          },
          colors: {
            'red': 'red',
            'green': '#00E400',
            'orange': '#F57702',
            'yellow': '#FEFE00',
          },
          before: function(el, options){
            if (!$('.cf-loading', el).length)
              el.append('<div class="ssw-loading"><span></span></div>');
            else
              $('.ssw-loading', el).show();
          },
          after: function(el, options){
            // if ($(".next-days", el).length) {
            // $(".next-days", el).delay(500).toggle("fast");
            // }
          },
          success: function(el, jsonData, options){
            $('.cf-loading', el).hide();
            $this.state.data = jsonData;
            options.callbacks.dataLoadCompleted && options.callbacks.dataLoadCompleted();
            visualize(el, jsonData);
            options.callbacks.visualizationReady && options.callbacks.visualizationReady();
          },
          fail: function(el, options){
            options.callbacks.dataLoadFailed && options.callbacks.dataLoadFailed();
            el.html('<div class="error"><span>'+options.msgError+'</span></div>');
          }
        };

        // The function execute an Ajax request to get physical activity data
        var getData = function(el){
//                    var url = options.uri + "?url=" + encodeURIComponent(options.url) + "&participant_id=LEOTEST209";
          var url = options.uri + "?1=1";
          if (options.env != null)
            url += "&env=" + options.env;
          if (options.filters.sensorId != null)
            url += "&sensorId=" + options.filters.sensorId;
          if (options.filters.location != null)
            url += "&location=" + options.filters.location;
          if (options.filters.status != null)
            url += "&status=" + options.filters.status;
          if (options.filters.provider != null)
            url += "&provider=" + options.filters.provider;
          if (options.filters.type != null)
            url += "&type=" + options.filters.type;
          if (options.filters.description != null)
            url += "&description=" + options.filters.description;
          if (options.filters.limit != null)
            url += "&limit=" + options.filters.limit;
          if (options.measurement.type != null)
            url += "&measurement=" + options.measurement.type;
          if (options.measurement.observedProperty != null)
            url += "&observedProperty=" + options.measurement.observedProperty;
          if (options.measurement.latest != null)
            url += "&latestMeasurement=" + options.measurement.latest;
          if (options.measurement.average != null)
            url += "&average=" + options.measurement.average;

          if (options.from && options.from != null)
            url += ("&from=" + options.from);
          if (options.to && options.to != null)
            url += ("&to=" + options.to);

          if (options.filters.bbox != null) {
            url += "&bbox=1";
            url += "&upperCorner:lat=" + options.filters.bbox.upperCorner.lat;
            url += "&upperCorner:lon=" + options.filters.bbox.upperCorner.lon;
            url += "&lowerCorner:lat=" + options.filters.bbox.lowerCorner.lat;
            url += "&lowerCorner:lon=" + options.filters.bbox.lowerCorner.lon;
          }

          // call before method
          options.before(el);

          console.log('REQUEST: '+url);
          $.ajax({
            url : url,
            type: 'GET',
            dataType: 'json',
            async: options.async,

            // beforeSend : options.before(el, options)
          }).done(function(response){
            options.success(el, response, options);
          }).fail(function(options) {
            options.fail(el, options);
          });
        };

        /**
         * This function displays the chart
         * @param el a jQuery object
         * @param jsonData a JSON object contains the chart data
         */
        var visualize =  function(el, jsonData) {
          var values = jsonData;

          if (options.type === "list") {
            var content = "";

            if (options.title && options.title.length > 0)
              content += ("<div class=\"title\">" + options.title + "</div>");
            if (options.subtitle && options.subtitle.length > 0)
              content += ("<div class=\"subtitle\">" + options.subtitle + "</div>");

            var table = "<table>";
            table += "<theader>";
//                        table += "<th>&nbsp</th>";
            table += "<th>Identifier</th>";
            table += "<th>Provider</th>";
            table += "<th>Description</th>";
            table += "<th>Type</th>";
            table += "<th>Status</th>";
            table += "<th>Location</th>";
            table += ("<th>" + (options.measurement.average ? "Average " : "") + "Position</th>");
            if (options.measurement.type=== 'value') {
              table +=( "<th>" + (options.measurement.average ? "Average " : "") + "Value</th>");
            }
            else if (options.measurement.type=== 'aqi') {
              table += ("<th>" + (options.measurement.average ? "Median " : "") + "AQI</th>");
            }
            else if (options.measurement.type=== 'caqi') {
              table += ("<th>" + (options.measurement.average ? "Median " : "") + "CAQI</th>");
            }
            else if (options.measurement.type=== 'globalcaqi') {
              table += ("<th>" + (options.measurement.average ? "Median " : "") + "Global CAQI</th>");
            }

            table += "</theader>";
            table += "<tbody>";
            $.each(values, function(index, item){
              table += "<tr>";
//                            var icon = options.icons[item.type];
//                            if (icon) {
//                                table += ("<td><image src=\"" + icon + "\"></td>");
//                            }
//                            else {
//                                table += ("<td>&nbsp;</td>");
//                            }
              table += ("<td>" + item.identifier + "</td>");
              table += ("<td>" + item.sensorProviderID + "</td>");
              table += ("<td>" + item.description + "</td>");
              table += ("<td>" + item.type + "</td>");
              table += ("<td>" + item.status + "</td>");
              table += ("<td>" + item.location + "</td>");
              if (item.measurement.latitude && item.measurement.longitude) {
                table += ("<td>" + item.measurement.latitude + ", " + item.measurement.longitude + "</td>");
              }
              else {
                table += ("<td>&nbsp;</td>");
              }
              if (options.measurement.type=== 'value' && item.measurement && item.measurement.value) {
                table += ("<td>" + item.measurement.value + " " + item.measurement.uom + "</td>");
              }
              else if ((options.measurement.type=== 'aqi' || options.measurement.type=== 'caqi' || options.measurement.type=== 'globalcaqi') && item.measurement.aqivalue){
                table += ("<td>" + item.measurement.aqivalue + " (" + item.measurement.aqicolour + ")</td>");
              }
              else {
                table += ("<td>&nbsp;</td>");
              }
              table += "</tr>";
            });
            table += "<tbody>";

            table += "</table>";

            content += table;
            el.html(content);
          }
          else if (options.type === "map") {
//                        var content = "";
//
//                        if (options.title && options.title.length > 0)
//                            content += ("<div class=\"title\">" + options.title + "</div>");
//                        if (options.subtitle && options.subtitle.length > 0)
//                            content += ("<div class=\"subtitle\">" + options.subtitle + "</div>");
//                        content += ("<div class=\"map\"></div>");
//                        el.html(content);

            var center = (values.length > 0 && values[0].measurement.latitude && values[0].measurement.longitude)
              ? new google.maps.LatLng(values[0].measurement.latitude, values[0].measurement.longitude)
              : new google.maps.LatLng(59.93,10.72);
            var myOptions = {
//                                zoom: ,
              center: center,
              mapTypeControl: true,
              mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
              navigationControl: false,
              mapTypeId: google.maps.MapTypeId.HYBRID
            }
            var map = new google.maps.Map(el[0], myOptions);
            for (var i=0, len=options.layers.length; i<len; i++) {
              var layer = options.layers[i];
              if (!("show" in layer)) layer['show'] = true;

              var kmlLayer = new google.maps.KmlLayer({
                url: layer.url
              });

              if (layer.show) {
                kmlLayer.setMap(map);
              }

              $this.state.layers.push(kmlLayer);
            }

            // fit bounds
            var bounds = new google.maps.LatLngBounds();
            $.each(values, function(index, item){
              if (item.measurement.latitude && item.measurement.longitude) {
                var position = new google.maps.LatLng(item.measurement.latitude, item.measurement.longitude);
                var icon = null;

                if (options.measurement.type=== 'value' && item.measurement && item.measurement.value) {
//                                    icon = options.icons[item.type];
                  icon ={
                    path: getIconSymbol(item),
                    fillColor: getIconColor(),
                    fillOpacity: .8,
                    scale: 4.5,
                    strokeColor: 'black',
                    strokeWeight: 1
                  };
                }
                else if ((options.measurement.type=== 'aqi' || options.measurement.type=== 'caqi' || options.measurement.type=== 'globalcaqi')&& item.measurement.aqivalue){
                  icon ={
                    path: getIconSymbol(item),
                    fillColor: getIconColor(item.measurement.aqicolour),
                    fillOpacity: .8,
                    scale: 4.5,
                    strokeColor: 'black',
                    strokeWeight: 1
                  };
                }
                else {
                  icon ={
                    path: getIconSymbol(item),
                    fillColor: getIconColor(),
                    fillOpacity: .8,
                    scale: 4.5,
                    strokeColor: 'black',
                    strokeWeight: 1
                  };
                }

                var marker = new google.maps.Marker({
                  position: position,
                  map: map,
                  title: item.description,
                  icon: icon,
                  data: item
                });
                var infowindow = new google.maps.InfoWindow;
                var infoContent = '<b>Identifier:</b> ' + item.identifier + '<br>';
                infoContent += '<b>Provider:</b> ' + item.sensorProviderID + '<br>';
                infoContent += '<b>Description:</b> ' + item.description + '<br>';
                infoContent += '<b>Type:</b> ' + item.type + '<br>';
                infoContent += '<b>Status:</b> ' + item.status + '<br>';
                infoContent += '<b>Location:</b> ' + item.location + '<br>';
                infoContent += '<b>' + (options.measurement.average ? "Average " : "") + 'Position:</b> ' + item.measurement.latitude + ', ' + item.measurement.longitude + '<br>';

                if (options.measurement.type=== 'value' && item.measurement && item.measurement.value) {
                  infoContent += '<b>' + (options.measurement.average ? "Average " : "") + 'Value:</b> ' + item.measurement.value + ' ' + item.measurement.uom + '<br>';
                }
                else if (options.measurement.type=== 'aqi' && item.measurement.aqivalue){
                  infoContent += '<b>' + (options.measurement.average ? "Median " : "") + 'AQI:</b> ' + item.measurement.aqivalue + " (" + item.measurement.aqicolour + ')' + '<br>';
                }
                else if (options.measurement.type=== 'caqi' && item.measurement.aqivalue){
                  infoContent += '<b>' + (options.measurement.average ? "Median " : "") + 'CAQI:</b> ' + item.measurement.aqivalue + " (" + item.measurement.aqicolour + ')' + '<br>';
                }
                else if (options.measurement.type=== 'globalcaqi' && item.measurement.aqivalue){
                  infoContent += '<b>' + (options.measurement.average ? "Median " : "") + 'Global CAQI:</b> ' + item.measurement.aqivalue + " (" + item.measurement.aqicolour + ')' + '<br>';
                }
                infoContent += '<b>Measurement time:</b> ' + item.measurement.measuretime + '<br>';

                infowindow.setContent(infoContent);
                marker.addListener('click', function() {
                  infowindow.open(map, marker);
                });

                bounds.extend(position);

                $this.state.markers.push(marker);
              }

            });
            map.fitBounds(bounds);
            $this.state.map = map;
          }
          else {}
        };

        var getIconSymbol = function(sensorItem) {
          var symbol = null;
          if (sensorItem.type == 'Mobile') {
            symbol = google.maps.SymbolPath.CIRCLE;
          }
          else if (sensorItem.type == 'Static') {
            symbol = google.maps.SymbolPath.BACKWARD_CLOSED_ARROW;
          }
          else {
            symbol = google.maps.SymbolPath.CIRCLE;
          }
          return symbol;
        };

        var getIconColor = function(color) {
          if (options.colors[color]) {
            return options.colors[color];
          }
          else {
            return '#8DD34E';
          }
        };

        /**
         * setDefaults function set the default settings
         * @param settings JSON object
         */
        var setDefaults = function(settings) {
          $.extend(options, settings);
          return this;
        };
        // set dafault settings
        setDefaults(settings || {});

        $this.addClass('citisense-widget');
        getData($this);
        if (options.refresh > 0)
          setInterval(function(){getData($this);}, options.refresh);
      };
      // initialisation
      return this.each(function() {
        //         console.log(window.Highcharts);
        //         if (!window.Highcharts) {
        // $.getScript(serviceUrl + "/js/vendor/highcharts/highcharts.js", function(){
        //              new PhysicalActivity(settings);
        //         console.log(window.Highcharts);
        //              return this;
        // });
        //         }
        //         else {
        new SensorsLookup(settings);
        return this;
        // }
      });
    }
  });
})(jQuery);

