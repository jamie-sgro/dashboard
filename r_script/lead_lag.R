library("ggplot2")

df <- read.table(text = 
"indicator	kitchener_cambridge_waterloo	min	max
11.1.1	0.596858639	0.376963351	1
11.2.1	0.655860349	0	0.825436409
11.3.1	0.079807982	0	0.996666702
11.6.2	0.696969697	0	1
11.7.2	0.519167177	0.320146969	1"
, header=TRUE)

ggplot(df) +
  geom_crossbar(
    aes(ymin = min, ymax = max, x = indicator, y = kitchener_cambridge_waterloo),
    fill = "grey", fatten = 0)+
  geom_crossbar(
    data=df,
    aes(
      x=indicator,
      y=kitchener_cambridge_waterloo,
      ymin=kitchener_cambridge_waterloo,
      ymax=kitchener_cambridge_waterloo)
    ,color="black")+
  labs(title="Leader-Laggard Bar Chart",
     x ="Indicator", y = "Kitchener-Cambridge-Waterloo")+
  theme(plot.title = element_text(hjust = 0.5))

  
