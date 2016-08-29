function draw_chart_champion_wins_avg_kda(ranked_data, version) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Pick Rate'); // h first
    data.addColumn('number', 'Avg KDA'); // v second
    data.addColumn({ type: 'string', role: 'tooltip' });
    data.addRows(ranked_data);

    var options = {
        title: 'Win Rate vs. Average KDA per Game',
        hAxis: {
            gridlines: { color: '#000000' },
            //format: '#\'%\'',
            colors: ['#000000'],
            title: 'Average KDA per Game',
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

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_champion_wins_avg_kda'));

    google.visualization.events.addListener(chart, 'ready', place_markers.bind(chart, data));
    chart.draw(data, options);

    function place_markers(dataTable) { // google charts create SVG elements with object properity 'circle'. 
        var i = 0;
        var cli = this.getChartLayoutInterface();
        var chartArea = cli.getChartAreaBoundingBox();

        for (var i = 0; i < ranked_data.length; i++) {
            var link = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + ranked_data[i][2] + ".png";
            var img = document.createElement('img');
            $('#chart_champion_wins_avg_kda').append(img);
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