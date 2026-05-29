/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.92921189240208, "KoPercent": 0.07078810759792355};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5476639924492686, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6586345381526104, 500, 1500, "P4 - Actualizar Producto"], "isController": false}, {"data": [0.6465863453815262, 500, 1500, "L4 - Actualizar lista"], "isController": false}, {"data": [0.5682730923694779, 500, 1500, "R4 - Marcar Leido"], "isController": false}, {"data": [0.0, 500, 1500, "[SETUP] A1 - Registrar usuario"], "isController": false}, {"data": [0.5080321285140562, 500, 1500, "R3 - No leidos"], "isController": false}, {"data": [0.6204819277108434, 500, 1500, "P5 - Eliminar Producto"], "isController": false}, {"data": [0.37751004016064255, 500, 1500, "S1 - Estadisticas"], "isController": false}, {"data": [0.606425702811245, 500, 1500, "L3 - Obtener lista por ID"], "isController": false}, {"data": [0.5756972111553785, 500, 1500, "L1 - Crear lista"], "isController": false}, {"data": [0.6325301204819277, 500, 1500, "U1 - Actualizar Perfil"], "isController": false}, {"data": [0.7449799196787149, 500, 1500, "P2 - Agregar Producto"], "isController": false}, {"data": [0.72, 500, 1500, "A2 - Login (extraer token)"], "isController": false}, {"data": [0.6104417670682731, 500, 1500, "R5 - Eliminar Recordatorio"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "R2 - Obtener Recordatorios"], "isController": false}, {"data": [0.2429718875502008, 500, 1500, "R1 - Crear Recordatorio"], "isController": false}, {"data": [0.26, 500, 1500, "L2 - Obtener listas"], "isController": false}, {"data": [0.7309236947791165, 500, 1500, "P3 - Obtener Productos"], "isController": false}, {"data": [0.642570281124498, 500, 1500, "L5 - Eliminar Lista (cleanup)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4238, 3, 0.07078810759792355, 1060.3043888626692, 3, 9329, 748.0, 1968.5999999999995, 3096.149999999999, 6448.439999999999, 44.767920900851415, 18797.284602081265, 16.25204006718357], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["P4 - Actualizar Producto", 249, 0, 0.0, 828.3012048192774, 106, 6544, 614.0, 1495.0, 3129.5, 5205.5, 3.021441312446154, 1.5461281716033053, 1.2510655434347355], "isController": false}, {"data": ["L4 - Actualizar lista", 249, 0, 0.0, 726.8152610441767, 91, 5798, 595.0, 1222.0, 1873.5, 5276.0, 2.896965748324646, 1.6318610241762845, 1.1740632671432893], "isController": false}, {"data": ["R4 - Marcar Leido", 249, 0, 0.0, 841.3212851405624, 6, 4451, 719.0, 1360.0, 1812.0, 3793.0, 3.476633948143701, 1.2120686713743176, 1.269786227154047], "isController": false}, {"data": ["[SETUP] A1 - Registrar usuario", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 219.7265625, 0.0], "isController": false}, {"data": ["R3 - No leidos", 249, 0, 0.0, 1148.5381526104425, 3, 7744, 834.0, 1857.0, 4256.5, 6084.0, 3.2478966934063784, 1.33214512815496, 1.1291515848170612], "isController": false}, {"data": ["P5 - Eliminar Producto", 249, 0, 0.0, 947.293172690763, 14, 7603, 657.0, 2059.0, 3233.5, 6268.5, 3.0191699101524136, 1.0525816971918083, 1.1203950838456223], "isController": false}, {"data": ["S1 - Estadisticas", 249, 0, 0.0, 1273.1767068273093, 99, 2523, 1287.0, 1773.0, 2015.0, 2388.5, 3.84395696003211, 140.21647705782917, 1.2725599701668802], "isController": false}, {"data": ["L3 - Obtener lista por ID", 249, 0, 0.0, 857.9156626506023, 86, 6544, 620.0, 1685.0, 2600.0, 5434.5, 2.8163279155780256, 1.5251906358510627, 0.9461101591394931], "isController": false}, {"data": ["L1 - Crear lista", 251, 2, 0.796812749003984, 872.0278884462153, 8, 4667, 699.0, 1552.400000000001, 2356.7999999999997, 3659.1199999999953, 2.836831338509703, 1.5515687338238453, 1.1076405665468643], "isController": false}, {"data": ["U1 - Actualizar Perfil", 249, 0, 0.0, 701.0803212851413, 5, 1903, 668.0, 1160.0, 1399.5, 1685.5, 3.7516385168221063, 1.7762369860330567, 1.4465031320154889], "isController": false}, {"data": ["P2 - Agregar Producto", 249, 0, 0.0, 573.8232931726906, 54, 3942, 471.0, 914.0, 1435.5, 3300.5, 2.92700129305278, 1.466359046226637, 1.249120669007876], "isController": false}, {"data": ["A2 - Login (extraer token)", 250, 0, 0.0, 653.1079999999995, 86, 3504, 485.5, 1222.1000000000001, 2268.0999999999985, 3325.2200000000025, 2.8157909556794505, 1.8202878618291378, 0.7094473306301741], "isController": false}, {"data": ["R5 - Eliminar Recordatorio", 249, 0, 0.0, 716.0160642570285, 6, 1922, 680.0, 1189.0, 1330.0, 1626.0, 3.706736136955713, 1.2922898446222553, 1.339348018235951], "isController": false}, {"data": ["R2 - Obtener Recordatorios", 249, 0, 0.0, 2391.566265060242, 568, 9329, 1731.0, 5689.0, 6626.0, 8370.5, 3.0964372318597277, 21055.73931907915, 1.0371855180936391], "isController": false}, {"data": ["R1 - Crear Recordatorio", 249, 0, 0.0, 2326.1686746987953, 670, 8771, 1529.0, 6392.0, 7510.5, 8654.0, 2.9984826955034802, 459.1680170124756, 1.2556710760819827], "isController": false}, {"data": ["L2 - Obtener listas", 250, 0, 0.0, 1845.0279999999984, 739, 5060, 1455.5, 3402.5, 4397.349999999999, 5033.33, 2.8163302090843545, 422.82897685187794, 0.9323593172652307], "isController": false}, {"data": ["P3 - Obtener Productos", 249, 0, 0.0, 624.7389558232928, 63, 6267, 467.0, 1091.0, 1683.5, 4833.5, 3.009063444108761, 1.513347337613293, 1.0373040974320242], "isController": false}, {"data": ["L5 - Eliminar Lista (cleanup)", 249, 0, 0.0, 702.4899598393575, 6, 1877, 704.0, 1231.0, 1448.5, 1687.0, 3.9337114330400165, 1.3714208804641463, 1.4059945161060996], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/api/auth/register", 1, 33.333333333333336, 0.023596035865974516], "isController": false}, {"data": ["500", 2, 66.66666666666667, 0.04719207173194903], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4238, 3, "500", 2, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/api/auth/register", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["[SETUP] A1 - Registrar usuario", 1, 1, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/api/auth/register", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["L1 - Crear lista", 251, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
