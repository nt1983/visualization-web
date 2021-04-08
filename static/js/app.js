

function Device_Pie_Chart(Option,file) {  
    //read data from json
    d3.csv(file).then(function (data){
        console.log(data);
        dataset=data;
    //});
    
    var width = 300;
    var height = 300;
    var margin = 5;
    var radius = Math.min(width, height) / 2-margin;
    var donutWidth = 75; //This is the size of the hole in the middle
    
    var donutTip = d3.select("body").append("div")
    .attr("class", "donut-tip")
    .style("background", "lightgray")
    .style("opacity", 0);
    var color = d3.scaleOrdinal().range(["#5A39AC", "#DD98D6", "#08B2B2"]);

    var svg = d3.select('#donut')
     .append('svg')
     .attr('width', width)
     .attr('height', height)
     .append('g')
     .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.arc().innerRadius(radius - donutWidth).outerRadius(radius);
    
    var pie = d3.pie().value(function (d) {
        return d.Device_Percentage;
    }).sort(null);
    //var data_ready = pie(d3.entries(info))

    var path = svg.selectAll('path')
     .data(pie(dataset))
     .enter()
     .append('path')
     .attr('d', arc)
     .attr('fill', function (d, i) {
          return color(d.data.Device_Name);
     })
          .attr('transform', 'translate(0, 0)')
          .on('mouseover', function (d, i) {
              d3.select(this).transition()
                  .duration('50')
                  .attr('opacity', '.85');
              donutTip.transition()
                  .duration(50)
                  .style("opacity", 1);
              let num = (d.data.Device_Percentage) + '%';
              donutTip.html(num)
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 15) + "px");                  
      
          })
          .on('mouseout', function (d, i) {
              d3.select(this).transition()
                  .duration('50')
                  .attr('opacity', '1');
              donutTip.transition()
                  .duration('50')
                  .style("opacity", 0);
          });

    var legendRectSize = 13;
    var legendSpacing = 7;

    var legend = svg.selectAll('.legend') //the legend and placement
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'circle-legend')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz = -2 * legendRectSize - 13;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('circle') //keys
    .style('fill', color)
    .style('stroke', color)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', '.5rem');

    legend.append('text') //labels
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) {
     return d;
});
});
}

function init() {
    var dropdown=d3.select("#selDataset");
    var SampleName=["Whole November", "Black Friday"];
        SampleName.forEach((item) => {
          dropdown.append("option").text(item).property("value", item);
        });
    const FirstOption=SampleName[0];
    const donut_ref_file1="static/data/Nov_devices.csv"
    d3.csv(donut_ref_file1, function(error, data){
        console.log(data);
    });
    Device_Pie_Chart(FirstOption, donut_ref_file1);

}

function optionChanged(Opt){
    d3.select("#donut").selectAll("*").remove();
    if (Opt=="Whole November") {
        const donut_ref_file2="data\\Nov_devices.csv"
        Device_Pie_Chart(Opt, donut_ref_file2);
    }
    else {
        const donut_ref_file2="data\\BlackFriday_devices.csv";
        Device_Pie_Chart(Opt, donut_ref_file2);
    }
    //Device_Pie_Chart(Opt, donut_ref_file2);
    //Demographic(Opt);
  }

//init();