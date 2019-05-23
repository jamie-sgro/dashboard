checkPackage = function(pack) {
  if (!is.element(pack, installed.packages()[,1])) {
    install.packages(pack, dependencies = TRUE,
                     repos = "http://cran.us.r-project.org")
  }
}



#### Import Libraries ####
checkPackage("shiny")
library(shiny)
checkPackage("leaflet")
library(leaflet)



#### Import Data ####
data = read.csv("sdsn_cleaned.csv",
                header = TRUE,
                fileEncoding="UTF-8-BOM")



#### Declare .ini variables ####
name = as.character(unlist(data[1]))
lat = as.numeric(unlist(data[2]))
lng = as.numeric(unlist(data[3]))
score = as.numeric(unlist(data[4]))
data[5:ncol(data)] = as.numeric(unlist(data[5:ncol(data)]))

maxInt = 0
for (i in 5:ncol(data)) {
  newMax = max(na.omit(data[i]))
  if (newMax > maxInt) {
    maxInt = newMax
  }
}



#### Functions ####

# @getLeaf(null)
# -Returns leaflet object with all customized perameters specified
getLeaf = function(db) {
  l = leaflet(db)
  
  #set up map style
  l = l %>% addTiles()
  #l = l %>% addProviderTiles(providers$Esri.WorldShadedRelief)
  
  #set up marker colour scheme
  colScheme = colorRamp(c(rgb(1,.1,1), rgb(.9,.1,.9), rgb(.2,.2,.5), rgb(.1,.9,.1), rgb(.1,1,.1)))
  pal = colorNumeric(palette = colScheme, domain = c(min(score):max(score)), na.color = "#000000")
  
  #set up marker characteristics
  l = l %>% addCircleMarkers(lat = lat,
                             lng = lng,
                             popup = as.character(score), #on-click box string
                             label = ~name, #on-hover box string
                             
                             #Fill perameters
                             fill = TRUE,
                             fillColor = pal(score),
                             fillOpacity = 0.8,
                             
                             #Stroke perameters
                             stroke = TRUE,
                             color = pal(score),
                             opacity = 1,
                             
                             #id-string
                             layerId= as.character(name))
  return(l)
}


# @handleMarkerClick(list, character)
# -fires when mouse clicks a leaflet marker
# -updates renderPlot titled "barplot"
handleMarkerClick = function(output, nodeId) {
  #rowNum corresponds with target row in .csv file
  rowNum = which(name == nodeId)

  #Dependent on: plotOutput("barplot")
  output$barplot = renderPlot({
    barValues = c(as.numeric(unlist(data[rowNum, 5:ncol(data)])))
    barLabels = c(colnames(data[5:ncol(data)]))
    barplot(barValues, names.arg = barLabels, ylim = c(0, maxInt))
  })
  
  #Dependent on: plotOutput("totalplot")
  output$totalplot = renderPlot({
    barValues = c(sort(score), decreasing = TRUE)
    
    barCol = c()
    ticker = TRUE
    for (i in 1:length(barValues)) {
      if (barValues[i] == score[rowNum] && ticker == TRUE) {
        barCol = c(barCol, rgb(0,0,0))
        ticker = FALSE
      } else {
        barCol = c(barCol, rgb(1,1,1))
      }
    }
    
    barplot(barValues, col = barCol)
  })
}



#### SERVER ####
server <- function(input, output) {
  #Dependent on: leafletOutput("map")
  leaf = getLeaf(data)
  output$map <- renderLeaflet({leaf})
  
  #Dependent on: plotOutput("barplot")
  #Display total values
  output$barplot = renderPlot({
    hist(c(1,2,2,2,3,3))
  })
  
  #fires when map marker is clicked
  observeEvent(input$map_marker_click, {
    handleMarkerClick(output, input$map_marker_click$id)
  })
}



#### UI ####
ui <- fluidPage(
  sidebarLayout(
    position = "right",
    sidebarPanel(
      plotOutput("barplot"),
      plotOutput("totalplot")
    ),
    
    mainPanel(
      leafletOutput("map", height="600px")
    )
  )
)

shinyApp(ui=ui, server=server)