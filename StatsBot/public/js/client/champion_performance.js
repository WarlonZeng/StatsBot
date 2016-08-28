function drawChart(ranked_data_processed, version) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Pick Rate');
    data.addColumn('number', 'Win Rate');
    data.addColumn({ type: 'string', role: 'tooltip' });
    data.addRows(ranked_data_processed);

    var options = {
        title: 'Pick Rate vs. Win Rate Comparison',
        hAxis: {
            gridlines: { color: '#000000' },
            format: '#\'%\'',
            colors: ['#000000'],
            title: 'Pick Rate',
            titleTextStyle: {
                color: '#000000',
                bold: true
            },
            textStyle: {
                color: '#000000',
                bold: true
            },
            minValue: 0,
        },
        vAxis: {
            gridlines: { color: '#000000' },
            format: '#\'%\'',
            title: 'Win Rate',
            titleTextStyle: {
                color: '#000000',
                bold: true
            },
            textStyle: {
                color: '#000000',
                bold: true
            },
            minValue: 0,
            maxValue: 100
        },
        chartArea: {
            height: "80%",
            width: "85%"
        },
        legend: 'none',
        backgroundColor: 'transparent',
        crosshair: { trigger: 'both' },
        dataOpacity: 0
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    google.visualization.events.addListener(chart, 'ready', placeMarkers.bind(chart, data));
    chart.draw(data, options);

    function placeMarkers(dataTable) { // google charts create SVG elements with object properity 'circle'. 
        var i = 0;
        var cli = this.getChartLayoutInterface();
        var chartArea = cli.getChartAreaBoundingBox();
        console.log(dataTable);
        console.log(ranked_data_processed);

        for (var i = 0; i < ranked_data_processed.length; i++) {
            var link = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + ranked_data_processed[i][2] + ".png";
            var img = document.createElement('img');
            $('#chart_div').append(img);
            img.src = link;
            img.height = 16;
            img.width = 16;
            img.style = (
                'border-radius: 50%; ' +
                'position: absolute; ' +
                'left: ' + (Math.floor(cli.getXLocation(dataTable.getValue(i, 0))) - 7.5) + 'px; ' +
                'top: ' + (Math.floor(cli.getYLocation(dataTable.getValue(i, 1))) - 7.5) + 'px; ' +
                'pointer-events: none'
            );
        }
    }
}

