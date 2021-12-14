window.dive1 = '';
window.dive2 = '';
var height = 300;
var width = 800;
var margin = 50;
var svg1 = d3.select("#my_dataviz1")
.append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
.append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");

var svg2 = d3.select("#my_dataviz2")
.append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
.append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");
var svg = d3.select("#my_dataviz")
.append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
.append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");
// get type for each year and filter by make
function filterJSON1(json, key, selected) {
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
function filterJSON2(json, key, selected) {
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
        .rollup(function(v) {return {  
            count: v.length
        };})
        .entries(json)

        json = JSON.stringify(Makes)
        json = JSON.parse(json);
        console.log(json)
        result = json.filter(function(d){
            return d.key == key;
        });
    }else{
        var Makes = d3.nest()
        .key(function(d) {
            return d["Transmission Type"];
        })
        .key(function(d) {
            return d.Make;
        })
        .key(function(d) {
            return d.Year;
        })
        .sortKeys(d3.ascending)
        .rollup(function(v) {return {  
            count: v.length
        };})
        .entries(json)
        ;
        var json = JSON.stringify(Makes)
        var json = JSON.parse(json);
        console.log(json)
        result = json.filter(function(d){
            return d.key == key;
        })
        console.log(result[0].values)
        result = result[0].values.filter(function(d){
            return d.key == selected;
        });
    }
        
    console.log(result);
    return result;
}
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
    // var attr = document.getElementById("inds").getAttributeNode("OPTION"); 
    // console.log(attr)
    var ddlMakes = document.getElementById("inds");
    // ddlMakes.removeAttributeNode(attr)
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
    graph1(data)
})

function graph3(){    
    d3.selectAll("#my_dataviz2").remove();
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
            return d.key == window.dive1;
        })
        sumstat = sumstat[0].values.filter(function(d){
            return d.key == window.dive2;
        })
        var res = sumstat[0].values.map(function(d){ return d.key }) // list of make names
        console.log("drop down");
        console.log(res);
        AddDropDownList(res)
    
        d3.select('#inds')
        .on("change", function () {
            var sect = document.getElementById("inds");
            var section = sect.options[sect.selectedIndex].value;
            console.log(section)
            fd = filterJSON(data, window.dive1, window.dive2, section);
                        
            d3.selectAll("g>*").remove();
            updateGraph(data, fd);
        });
        // middle used as global
        fd = filterJSON(data, window.dive1, window.dive2, 'All');
        updateGraph(data, fd);
    
    })
}

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

function graph2(){
    d3.selectAll("#my_dataviz1").remove();
    d3.csv("./data.csv", function(data) {   
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) {
                return d["Transmission Type"];
            })
            .key(function(d) { return d.Make;})
            .sortKeys(d3.ascending)
            .entries(data);
        sumstat = sumstat.filter(function(d){
            return d.key == window.dive1;
        })
        var res = sumstat[0].values.map(function(d){ return d.key }) // list of make names
        console.log(res);
        AddDropDownList(res)

        d3.select('#inds')
        .on("change", function () {
            var sect = document.getElementById("inds");
            var section = sect.options[sect.selectedIndex].value;
            console.log(section)
            fd = filterJSON2(data, window.dive1, section);
                        
            d3.selectAll("g>*").remove();
            updateGraph2(data, fd);
        });
        // middle used as global
        fd = filterJSON2(data, window.dive1, 'All');
        updateGraph2(data, fd);
    })
    
};
function updateGraph2(data, sumstat){    
    var yy = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Year;})
        .sortKeys(d3.ascending)
        .entries(data);    
    var ry = yy.map(function(d){ return d.key }) // list of make names
    console.log(sumstat)// Add X axis --> it is a date format
    var x = d3.scaleTime()
    .domain(d3.extent(sumstat[0].values, function(d) {return d.key; }))
    // .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ])  
        // .domain(sumstat[0].data.map(function(d) { return d.TransType; }))
        // .padding(0.2);
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(ry).tickFormat(d3.format("")));
    // Add Y axis 
    console.log(sumstat[0].values)
    var y = d3.scaleLinear()
        .domain([0, 1.1*d3.max(sumstat[0].values, function(d) { return d.value.count; })])
        .range([ height, 0 ]);
    // if (sumstat.length ==48){
    //     y= d3.scaleLinear()
    //     .domain([0, 2])
    //     .range([ height, 0 ]);
    // } get largest y from automated
    svg2.append("g")
    .call(d3.axisLeft(y));
    var u = svg2.selectAll("rect")
        .data(sumstat[0].values)
    u
        .enter()
        .append("rect")
        .on('click', function (d) {
            console.log(d)            
            window.dive2=d.key;
            graph3();
            // window.location.href = "third.html";
        })
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d.key); })
            .attr("y", function(d) { return y(d.value.count); })
            .attr("width", 5)
            // .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.value.count); })
            .attr("fill", "#69b3a2")

}

function graph1(data){
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
        fd = filterJSON1(data, 'Make', section);
                    
        d3.selectAll("g>*").remove();
        updateGraph1(data, fd);
        
        console.log(window.dive1)  
    });
    // middle not used?
    fd = filterJSON1(data, 'Make', 'All');
    updateGraph1(data, fd);

}
function updateGraph1(data, sumstat){    
    var yy = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Year;})
        .sortKeys(d3.ascending)
        .entries(data);
    var ry = yy.map(function(d){ return d.key }) // list of make names
    // Add X axis --> it is a date format
    var x = d3.scaleBand()
        // .domain(d3.extent(data, function(d) { return d.Year; }))
        .range([ 0, width ])  
        .domain(sumstat[0].data.map(function(d) { return d.TransType; }))
        .padding(0.2);
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis .tickValues(ry).tickFormat(d3.format(","))
    // console.log(sumstat[0].data)
    var y = d3.scaleLinear()
        .domain([0, 1.1*d3.max(sumstat[0].data, function(d) { return d.Count; })])
        .range([ height, 0 ]);
    // if (sumstat.length ==48){
    //     y= d3.scaleLinear()
    //     .domain([0, 2])
    //     .range([ height, 0 ]);
    // } get largest y from automated
    svg1.append("g")
    .call(d3.axisLeft(y));
    var u = svg1.selectAll("rect")
        .data(sumstat[0].data)
    u
        .enter()
        .append("rect")
        .on('click', function (d) {
            console.log(d.TransType)
            window.dive1=d.TransType;
            graph2()
            // window.location.href = "second.html";
        })
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d["TransType"]); })
            .attr("y", function(d) { return y(d["Count"]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d["Count"]); })
            .attr("fill", "#69b3a2")

}