var height = 300;
var width = 1000;
var margin = 50;
var svg = d3.select("#my_dataviz")
.append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
.append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");

function filterJSON(json, key, key2, selected) {
    var result = [];            
        
    if (selected == "All"){
        var Makes = d3.nest()
        .key(function(d) {
            return d["Transmission Type"];
        })
        .key(function(d) {
            return d.Year;
        })
        .sortKeys(d3.ascending)
        .entries(json)
        json = JSON.stringify(Makes)
        json = JSON.parse(json);
        console.log(json)
        result = json.filter(function(d){
            return d.key == key;
        });
        result = result[0].values.filter(function(d){
            return d.key == key2;
        });
    }else{
        var Makes = d3.nest()
        .key(function(d) {
            return d["Transmission Type"];
        })
        .key(function(d) {
            return d.Year;
        })
        .key(function(d) {
            return d.Make;
        })
                
        .entries(json)
        ;
        var json = JSON.stringify(Makes)
        var json = JSON.parse(json);
        console.log("orig");
        console.log(json)
        result = json.filter(function(d){
            return d.key == key;
        })
        result = result[0].values.filter(function(d){
            return d.key == key2;
        });
        console.log(result[0].values)
        result = result[0].values.filter(function(d){
            return d.key == selected;
        });
    }
    console.log("2x filtered");
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
        .key(function(d) {
            return d["Transmission Type"];
        })
        .key(function(d) { return d.Year;})
        .key(function(d) { return d.Make;})
        .sortKeys(d3.ascending)
        .entries(data);
    sumstat = sumstat.filter(function(d){
        return d.key == 'MANUAL';
    })
    sumstat = sumstat[0].values.filter(function(d){
        return d.key == '2015';
    })
    var res = sumstat[0].values.map(function(d){ return d.key }) // list of make names
    console.log(res);
    AddDropDownList(res)

    d3.select('#inds')
    .on("change", function () {
        var sect = document.getElementById("inds");
        var section = sect.options[sect.selectedIndex].value;
        console.log(section)
        fd = filterJSON(data, 'MANUAL', '2015', section);
                    
        d3.selectAll("g>*").remove();
        updateGraph(data, fd);
    });
    // middle used as global
    fd = filterJSON(data, 'MANUAL', '2015', 'All');
    updateGraph(data, fd);

})

function updateGraph(data, sumstat){    
    var group = d3.nest()
        .key(function(d){return d["Vehicle Size"]})
        .sortKeys(d3.ascending)
        .entries(data);
    // console.log("group")
    // console.log(group)
    var res = group[0].values.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['orange','purple','blue','brown'])

    var x= d3.scaleLinear().domain([15,50]).range([0,width]);
    var y= d3.scaleLinear().domain([10,40]).range([height,0]);
    // Add Y axis 
    console.log(sumstat[0].values)

    d3.select('svg').append('g').attr("transform","translate(" + margin + "," + margin + ")")
        .call(d3.axisLeft(y));
    d3.select('svg').append('g').attr("transform","translate(" + margin + ","+(height+margin)+")")
        .call(d3.axisBottom(x));

    svg.append("g").selectAll('circle').data(sumstat[0].values).enter().append('circle')
        .attr('cx',function(d) {
            // if(d["name"]=="Singapore"){
            //     tx=xscale(d["Popularity"]);
            // } 
            return x(d["highway MPG"]);
        })
        .attr('cy',function(d) {
            // if(d["name"]=="Singapore"){
            //     ty=yscale(d["Economy.GDP.per.Capita."])
            // }      
            return y(d["city mpg"]);
        })
        .style("fill", "white")
        .style("stroke", function(d){ return color(d["Vehicle Size"]) })
        .attr('r', 4)

}