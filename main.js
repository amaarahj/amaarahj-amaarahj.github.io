var height = 300;
var width = 800;
var margin = 50;
var svg = d3.select("#my_dataviz")
.append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
.append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");
// get type for each year and filter by make
function filterJSON(json, key, selected) {
    var result = [];            
        
    if (selected == "All"){
        var Makes = d3.nest()
        .key(function(d) {
            return d["Transmission Type"];
        })
        .sortKeys(d3.ascending)
        .rollup(function(v) {return {  
            count: v.length
        };})
        .entries(json)
        .map(function(v){
                return{
                    "TransType": v.key,
                    "Count": v.value.count
                }
            })
        json = JSON.stringify(Makes)
        json = JSON.parse(json);
        result =[{
            "Make": "All",
            "data": json
        }]
    }else{
        var Makes = d3.nest()
        .key(function(d) {
            return d.Make;
        })
        .key(function(d) {
            return d["Transmission Type"];
        })
        .sortKeys(d3.ascending)
        .rollup(function(v) {return {  
            count: v.length
        };})
        .entries(json)
        .map(function(group){
            return{
                "Make": group.key,
                "data": group.values.map(function(v){
                    // console.log(v);
                    return{
                        "TransType": v.key,
                        "Count": v.value.count
                    }
                })
            };
        });
        var json = JSON.stringify(Makes)
        var json = JSON.parse(json);
        // console.log(json)
        result = json.filter(function(d){
            return d.Make == selected;
        });
    }
        
    console.log(result);
    return result;
}

function AddDropDownList(makes) {    
    var ddlMakes = document.getElementById("inds");
    var option = document.createElement("OPTION");

    option.innerHTML = "All";
    option.value = "All";
    ddlMakes.options.add(option);
    //Add the Options to the DropDownList.
    for (var i = 0; i < makes.length; i++) {
        var option = document.createElement("OPTION");

        option.innerHTML = makes[i];
        option.value = makes[i];
        ddlMakes.options.add(option);
    }
    var dvContainer = document.getElementById("dvContainer")

    dvContainer.appendChild(ddlMakes);
};

d3.csv("./data.csv", function(data) {   
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Make;})
        .sortKeys(d3.ascending)
        .entries(data);
    var res = sumstat.map(function(d){ return d.key }) // list of make names
    console.log(res);
    AddDropDownList(res)

    d3.select('#inds')
    .on("change", function () {
        var sect = document.getElementById("inds");
        var section = sect.options[sect.selectedIndex].value;
        console.log(section)
        fd = filterJSON(data, 'Make', section);
                    
        d3.selectAll("g>*").remove();
        updateGraph(data, fd);
    });
    // middle not used?
    fd = filterJSON(data, 'Make', 'All');
    updateGraph(data, fd);

})

function updateGraph(data, sumstat){    
    var yy = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Year;})
        .sortKeys(d3.ascending)
        .entries(data);
    var ry = yy.map(function(d){ return d.key }) // list of make names
    console.log(sumstat)
    // Add X axis --> it is a date format
    var x = d3.scaleBand()
        // .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ])  
        .domain(sumstat[0].data.map(function(d) { return d.TransType; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis .tickValues(ry).tickFormat(d3.format(","))
    console.log(sumstat[0].data)
    var y = d3.scaleLinear()
        .domain([0, 1.1*d3.max(sumstat[0].data, function(d) { return d.Count; })])
        .range([ height, 0 ]);
    // if (sumstat.length ==48){
    //     y= d3.scaleLinear()
    //     .domain([0, 2])
    //     .range([ height, 0 ]);
    // } get largest y from automated
    svg.append("g")
    .call(d3.axisLeft(y));
    var u = svg.selectAll("rect")
        .data(sumstat[0].data)
    u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d["TransType"]); })
            .attr("y", function(d) { return y(d["Count"]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d["Count"]); })
            .attr("fill", "#69b3a2")
}