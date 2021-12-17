window.dive1 = '';
window.dive2 = '';
var height = 300;
var width = 800;
var margin = 75;
var divTooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


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
    d3.selectAll("option").remove();
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

function nav(){
    var list = document.getElementsByClassName("nav")
    list[0].innerText = list[1].innerText= '';
    if (window.dive1){
        list[0].innerText = window.dive1;
    }
    if (window.dive2){
        list[1].innerText = window.dive2;
    }
}

function back1(e){
    console.log(e);
    window.dive1 = ''
    graph1()
}
function back2(e){
    console.log(e);
    window.dive2 = ''
    graph2()
}

graph1()


function graph3(){ 
    nav()   
    d3.selectAll('svg').remove();
    var svg3 = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
        .append("g")
            .attr("transform",
                "translate(" + margin + "," + margin + ")");  
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
            updateGraph(svg3, data, fd);
        });
        // middle used as global
        fd = filterJSON(data, window.dive1, window.dive2, 'All');
        updateGraph(svg3, data, fd);
    
    })
}

function updateGraph(svg3, data, sumstat){  
   var group = d3.nest()
        .key(function(d){return d["Vehicle Size"]})
        .sortKeys(d3.ascending)
        .entries(data);
    var res = group[0].values.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['orange','purple','blue','brown'])

    var x= d3.scaleLinear().domain([15,50]).range([0,width]);
    var y= d3.scaleLinear().domain([10,40]).range([height,0]);
    // Add Y axis 
    console.log(sumstat[0].values)

    svg3.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg3.append("g")
        .call(d3.axisLeft(y));
    // create a Voronoi diagram based on the data and the scales
    const voronoiDiagram = d3.voronoi()
        .x(function(d) {return x(d["highway MPG"]);})
        .y(function(d) {return y(d["city mpg"]);})
        .size([width, height])(sumstat[0].values);
    const voronoiRadius = width / 10;
    const pointRadius = 1;
    svg3.append("g").selectAll('circle').data(sumstat[0].values).enter().append('circle')
        .attr('cx',function(d) { 
            return x(d["highway MPG"]);
        })
        .attr('cy',function(d) {  
            return y(d["city mpg"]);
        })
        .style("fill", "white")
        .style("stroke", function(d){ return color(d["Vehicle Size"]) })
        .attr('r', 4)

    svg3.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text(window.dive1 + " City MPG and Highway MPG in " + window.dive2)
    svg3.append('text')
        .attr('x', -(height / 2) )
        .attr('y', -(margin/2))
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('City MPG')
    svg3.append('text')
        .attr('x', width / 2 )
        .attr('y', height + 40 )
        .attr('text-anchor', 'middle')
        .text('Highway MPG')
    // add a circle for indicating the highlighted point
    svg3.append('circle')
        .attr('class', 'highlight-circle')
        .attr('r', pointRadius + 2) 
        .style('fill', 'none')
        .style('display', 'none');
        // add the overlay on top of everything to take the mouse events
    svg3.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#f00')
        .style('opacity', 0)
        .on('mousemove', mouseMoveHandler)
        .on('mouseleave', () => {
            // hide the highlight circle when the mouse leaves the chart
            highlight(null);
        });    

    // // callback to highlight a point
    function highlight(d) {
        // no point to highlight - hide the circle
        if (!d) {
            d3.select('.highlight-circle').style('display', 'none');
            divTooltip.transition()		
                .duration(500)		
                .style("opacity", 0);
        // otherwise, show the highlight circle at the correct position
        } else {
            divTooltip.transition()		
                .duration(200)		
                .style("opacity", .9);
            divTooltip.style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
                .html("<strong> Make: </strong>"+ d["Make"] + 
                    "<br>" +
                    "<strong> MSRP: $</strong>" + d["MSRP"] + 
                    "<br>" +
                    "<strong> Popularity: </strong>" + d["Popularity"]);                            
            d3.select('.highlight-circle')
                .style('display', '')
                .style('stroke', color(d["Vehicle Size"]))
                .attr('cx', x(d["highway MPG"]))
                .attr('cy', y(d["city mpg"]));
        }
    }

    // callback for when the mouse moves across the overlay
    function mouseMoveHandler() {
        // get the current mouse position
        const [mx, my] = d3.mouse(this);

        // use the new diagram.find() function to find the Voronoi site
        // closest to the mouse, limited by max distance voronoiRadius
        const site = voronoiDiagram.find(mx, my, voronoiRadius);

        // highlight the point if we found one
        highlight(site && site.data);
        
    }
}

function graph2(){
    window.dive2 = '';
    nav()
    d3.selectAll('svg').remove();
    var svg2 = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
        .append("g")
            .attr("transform",
                "translate(" + margin + "," + margin + ")");   
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
            updateGraph2(svg2, data, fd);
        });
        // middle used as global
        fd = filterJSON2(data, window.dive1, 'All');
        updateGraph2(svg2, data, fd);
    })
    
}

function updateGraph2(svg2, data, sumstat){ 
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
    svg2.append("g")
    .call(d3.axisLeft(y));

    var u = svg2.selectAll("rect")
        .data(sumstat[0].values)
    u
        .enter()
        .append("rect")
        .on('click', function(d) { 
            divTooltip.transition()		
                .duration(100)		
                .style("opacity", 0);         
            window.dive2=d.key;
            graph3();
        })
        .on('mouseenter', function (d) {
            d3.select(this).attr('opacity', 0.5)
        })	
        .on("mouseover", function(d) {
            divTooltip.transition()		
                .duration(200)		
                .style("opacity", .9);
            divTooltip.style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
                .html("<strong> Count: </strong>" + d.value.count);                            
            })				
        .on("mouseout", function(d) {            		
            divTooltip.transition()		
            .duration(500)		
            .style("opacity", 0);	
            d3.select(this).attr('opacity', 1);
        })
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d.key); })
            .attr("y", function(d) { return y(d.value.count); })
            .attr("width", 25)
            // .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.value.count); })
            .attr("fill", "#69b3a2")
    svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text(window.dive1)
    svg2.append('text')
        .attr('x', -(height / 2) )
        .attr('y', -margin/3-(margin/3))
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Vehicle Count')
    svg2.append('text')
        .attr('x', width / 2 )
        .attr('y', height + 40 )
        .attr('text-anchor', 'middle')
        .text('Year')
}

function graph1(){
    window.dive1 = '';
    window.dive2 = '';
    nav()
    d3.selectAll('svg').remove();
    var svg1 = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
        .append("g")
            .attr("transform",
                "translate(" + margin + "," + margin + ")");  
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
            fd = filterJSON1(data, 'Make', section);
                        
            d3.selectAll("g>*").remove();
            updateGraph1(svg1, data, fd);
            
            console.log(window.dive1)  
        });
        // middle not used?
        fd = filterJSON1(data, 'Make', 'All');
        updateGraph1(svg1, data, fd);
    })
}

function updateGraph1(svg1, data, sumstat){  
    var tx = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d["Transmission Type"];})
        .sortKeys(d3.ascending)
        .entries(data);
    var types = tx.map(function(d){ return d.key }) // list of make names
    // Add X axis --> it is a date format
    var x = d3.scaleBand()
        .range([ 0, width ])  
        .domain(types)
        .padding(0.2);
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis .tickValues(ry).tickFormat(d3.format(","))
    console.log(sumstat[0].data)
    var y = d3.scaleLinear()
        .domain([0, 1.1*d3.max(sumstat[0].data, function(d) { return d.Count; })])
        .range([ height, 0 ]);

    svg1.append("g")
    .call(d3.axisLeft(y));

    var u = svg1.selectAll("rect")
        .data(sumstat[0].data)
    u
        .enter()
        .append("rect")
        .on('click', function (d) {	           
            window.dive1=d.TransType;
            graph2()
        })
        .on('mouseenter', function(d) {
            d3.select(this).attr('opacity', 0.5)
        })					
        .on("mouseout", function(d) {		
            d3.select(this).attr('opacity', 1);
        })
        .merge(u)
        .transition()
        .duration(1000)
            .attr("x", function(d) { return x(d["TransType"]); })
            .attr("y", function(d) { return y(d["Count"]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d["Count"]); })
            .attr("fill", "#69b3a2")
    svg1.selectAll(".text")
        .data(sumstat[0].data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", (function(d) { return x(d.TransType)+ 60; }  ))
        .attr("y", function(d) { return y(d.Count) - 10; })
        .text(function(d) { return d.Count; })
    svg1.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Transmissions")
    svg1.append('text')
        .attr('x', -(height / 2) )
        .attr('y',-margin/3 -margin/3)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Vehicle Count')
    svg1.append('text')
        .attr('x', width / 2 )
        .attr('y', height + 40 )
        .attr('text-anchor', 'middle')
        .text('Transmission Type')
}