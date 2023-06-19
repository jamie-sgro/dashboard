library("ggplot2")

df <- read.table(text = 
"indicator	kitchener_cambridge_waterloo	min	max
11.1.1	0.403141361	0	0.623036649
11.2.1	0.655860349	0	0.825436409
11.3.1	0.920192018	0.003333298	1
11.6.2	0.303030303	0	1
11.7.2	0.480832823	0	0.679853031"
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

  
