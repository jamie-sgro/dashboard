data <- readr::read_csv("C:/Users/Cameron/Documents/SDG Cities Index/SDSN.2018.US.csv")
library(leaflet)
library(shinyWidgets)
library(ggplot2)
library(shiny)
library(visNetwork)

server <- function(input, output) {
  #create a map of the SDG Overall Scores by City
  output$map <- renderLeaflet({leaflet(data) %>% addTiles() %>% addMarkers(lng = ~longitude, lat = ~latitude, popup = ~as.character(OVERALL.INDEX), label = ~as.character(MSA.Name), layerId= ~as.character(MSA.Name))
  })
  
  #create a datatable
  output$table <- renderDataTable(data)
  
  output$plot <- renderPlotly({
    plot_ly(data, 
            x = ~OVERALL.RANK, y = ~OVERALL.INDEX,
            text = ~paste("City: ", MSA.Name, '<br>MSA Fips:', MSA.FIPS.Code),
            color = ~latitude, size = ~longitude)
  })
  
  #create a visnetwork
  output$visNetwork <- renderVisNetwork({
    # minimal example
    nodes <- data.frame(id = 1:3)
    edges <- data.frame(from = c(1,2), to = c(1,3))
    
    visNetwork(nodes, edges)
  })
  
  # create a reactive value that will store the click position
  data_of_click <- reactiveValues(clickedMarker=NULL)
  
  # store the click
  observeEvent(input$map_marker_click,{data_of_click$clickedMarker <- input$map_marker_click
  sub = data[data$MSA.Name==input$map_marker_click$id, c("latitude", "longitude", "MSA.Name", "GOAL.1.AVERAGE", "GOAL.2.AVERAGE", "GOAL.3.AVERAGE", "GOAL.4.AVERAGE", "GOAL.5.AVERAGE", "GOAL.6.AVERAGE", "GOAL.7.AVERAGE", "GOAL.8.AVERAGE", "GOAL.9.AVERAGE", "GOAL.10.AVERAGE", "GOAL.11.AVERAGE", "GOAL.12.AVERAGE", "GOAL.13.AVERAGE")]
  Sdg1 = sub$GOAL.1.AVERAGE
  Sdg2 = sub$GOAL.2.AVERAGE
  Sdg3 = sub$GOAL.3.AVERAGE
  Sdg4 = sub$GOAL.4.AVERAGE
  Sdg5 = sub$GOAL.5.AVERAGE
  Sdg6 = sub$GOAL.6.AVERAGE
  Sdg7 = sub$GOAL.7.AVERAGE
  Sdg8 = sub$GOAL.8.AVERAGE
  Sdg9 = sub$GOAL.9.AVERAGE
  Sdg10 = sub$GOAL.10.AVERAGE
  Sdg11 = sub$GOAL.11.AVERAGE
  Sdg12 = sub$GOAL.12.AVERAGE
  Sdg13 = sub$GOAL.13.AVERAGE
  nm = sub$MSA.Name
  # Make a text panel, barplot or scatterplot depending of the selected point
  if(is.null(input$map_marker_click))
    return()
  else
    output$text <- renderText({paste("City=", nm,
                                     "SDG1= ", Sdg1, 
                                     "SDG2= ", Sdg2,
                                     "SDG3= ", Sdg3,
                                     "SDG4= ", Sdg4, 
                                     "SDG5= ", Sdg5, 
                                     "SDG6= ", Sdg6, 
                                     "SDG7= ", Sdg7,
                                     "SDG8= ", Sdg8,
                                     "SDG9= ", Sdg9,
                                     "SDG10= ", Sdg10, 
                                     "SDG11= ", Sdg11, 
                                     "SDG12= ", Sdg12, 
                                     "SDG13= ", Sdg13
    )})
  output$myTable <- renderTable({
    return(
      subset(data, data$MSA.Name==input$map_marker_click$id))})
  })
}
ui <- fluidPage(
  navbarPage("Canadian SDG Cities Index",  
             tabPanel("Map",
                      sidebarLayout(
                        sidebarPanel(
                          textOutput("text") # to display the SDG Scores and name
                        ),
                        mainPanel(
                          leafletOutput("map", height="500px")
                        )
                      )
             ),
             tabPanel("Data Table",
                      dataTableOutput("table")),
             tabPanel("Visualizations",
                      plotlyOutput("plot")),
             tabPanel("Theory of Change",
                      visNetworkOutput("visNetwork"))
  )
)
shinyApp(ui=ui, server=server)