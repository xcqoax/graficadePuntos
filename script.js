function cargarDatos(){
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
         .then(response => response.json())
         .then((response) => 
         
        aGraficar(response)
   )
}

let datosDeLaGrafica =[]
let padding = 50;
const widthSVG = 800;
const heightSVG = 500;

let yScale;
let xScale;
let xAxisScale;
let yAxisScale;
let svg =  d3.select('svg')

let info = d3.select('#masInfo')
            .style('opacity',0)


function aGraficar(data){
     datosDeLaGrafica = data
   
    dibujarArea()
    generarEscalas()
    dibujarEscalas()
    dibujarGrafica()
}

function dibujarArea(){

    svg.attr('width', widthSVG )
       .attr('height', heightSVG)
       console.log(datosDeLaGrafica.length)
}

function generarEscalas(){

    let arrayTiempo =datosDeLaGrafica.map( (dato) => dato.Time)
    let arrayAnos = datosDeLaGrafica.map((item) => new Date(item.Year))
    let minimo = d3.min(arrayTiempo)
    let maximo = d3.max(arrayTiempo)

    yScale =  d3.scaleTime()
                     .domain([d3.min(datosDeLaGrafica, (d) => new Date(d['Seconds']*1000)), d3.max(datosDeLaGrafica, (d) => new Date(d['Seconds']*1000))])
                     .range([padding, heightSVG-padding])

    xScale = d3.scaleLinear()
               .domain([d3.min(datosDeLaGrafica, (d)=> d.Year)-1, d3.max(datosDeLaGrafica, (d)=> d.Year)+1])
               .range([padding, widthSVG - padding])

   /* xAxisScale = d3.scaleLinear()
                   .range([padding, widthSVG - padding])
    
    yAxisScale = d3.scaleTime()
                   .range([padding, heightSVG - padding])    */    

}

function dibujarEscalas(){

let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))

svg.append('g')
   .call(xAxis)
   .attr('id', 'x-axis')
   .attr('transform','translate(0, ' +(heightSVG-padding)+')' )


svg.append('g')
   .call(yAxis)
   .attr('id', 'y-axis')
   .attr('transform','translate(' +padding+',0)' )

}

function dibujarGrafica(){
   svg.selectAll('circle')
      .data(datosDeLaGrafica)
      .enter()
      .append('circle')
      .attr('class','dot')
      .attr('r', '5')
      .attr('data-xvalue',(d) => d['Year'])
      .attr('data-yvalue',(d) => new Date(d['Seconds']*1000))
      .attr('cx', (d) =>  xScale(d.Year))
      .attr('cy',(d) => yScale(new Date(d.Seconds*1000)))
      .on('mouseover', (d,i) => {
         info.transition()
             .duration(200)
             .style('opacity', .9)
         info.html('Year: '+d.Year +'<br>'+ d.Name +' - '+d.Nationality+'<br> Time: '+d.Time)                                      
         .style("left", (d3.event.pageX)+10 + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout',(d)=>{
         info.transition()
         .duration(200)
         .style('opacity',0 )
      })


 
}