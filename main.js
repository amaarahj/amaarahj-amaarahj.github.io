var height = 300;
var width = 800;
var margin = 50;
 
// get type for each year and filter by make
function filterJSON(json, key, selected) {
    var result = [];               
    var Makes = d3.nest()
        .key(function(d) {
            return d["Transmission Type"];
        })
        .sortKeys(d3.ascending)
        .key(function(d) {
            return d.Year;
        })
        .rollup(function(v) {return {  
            count: v.length
        };})
        .entries(json)
        .map(function(group){
            return{
                "TransType": group.key,
                "data": group.values.map(function(v){
                    // console.log(v);
                    return{
                        "Year": v.key,
                        "Count": v.value.count
                    }
                })
            };
        });
    var json = JSON.stringify(Makes)
    var json = JSON.parse(json);
    console.log(json)
    
    if (selected == "All"){
        result= json;
    }else{
        result = json.filter(function(d){
            return d.Make == selected;
        });
    }
        
    console.log(result);
    return result;
}        
d3.csv("./data.csv", function(data) {
    var svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
        .append("g")
            .attr("transform",
                "translate(" + margin + "," + margin + ")");
       
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Make;})
        .sortKeys(d3.ascending)
        .entries(data);
    var res = sumstat.map(function(d){ return d.key }) // list of make names
    // console.log(res);

    sumstat = filterJSON(data, 'Make', 'All');
    
    var yy = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Year;})
        .sortKeys(d3.ascending)
        .entries(data);
    var ry = yy.map(function(d){ return d.key }) // list of make names
    
    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(ry));
    // Add Y axis .tickFormat(d3.format(","))
    console.log(sumstat[0].data)
    var y = d3.scaleLinear()
        .domain([0, 1.1*d3.max(sumstat[1].data, function(d) { return d.Count; })])
        .range([ height, 0 ]);
    // if (sumstat.length ==7){
    //     y= d3.scaleLinear()
    //     .domain([0, 2])
    //     .range([ height, 0 ]);
    // } get largest y from automated
    svg.append("g")
    .call(d3.axisLeft(y));
})