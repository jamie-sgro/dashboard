library("votesys")

raw <- list2ballot(
  x = list(
    c("Quebec City","Sherbrooke","Montréal","Calgary","Kitchener--Cambridge--Waterloo","St. John's","Windsor","Saskatoon","Winnipeg","Edmonton","Hamilton","Regina","Halifax","St. Catharines--Niagara","London","Victoria","Vancouver","Toronto"),
    c("Toronto","Vancouver","Montréal","Regina","Victoria","Calgary","Winnipeg","Kitchener--Cambridge--Waterloo","Quebec City","Edmonton","Saskatoon","Hamilton","St. Catharines--Niagara","London","Sherbrooke","Halifax","Windsor","St. John's"),
    c("Hamilton","Toronto","Vancouver","Victoria","Calgary","Winnipeg","Kitchener--Cambridge--Waterloo","London","Saskatoon","Halifax","St. John's","St. Catharines--Niagara","Montréal","Quebec City","Edmonton","Windsor","Regina","Sherbrooke"),
    c("Victoria","Vancouver","Halifax","Sherbrooke","St. John's","Calgary","Winnipeg","Edmonton","London","Saskatoon","St. Catharines--Niagara","Toronto","Montréal","Kitchener--Cambridge--Waterloo","Hamilton","Regina","Quebec City","Windsor"),
    c("Vancouver","Quebec City","Toronto","Montréal","St. John's","Windsor","Calgary","Victoria","Sherbrooke","St. Catharines--Niagara","London","Regina","Hamilton","Kitchener--Cambridge--Waterloo","Edmonton","Winnipeg","Saskatoon","Halifax"),
    
  )
)
vote <- create_vote(raw, xtype = 3, candidate = c("Quebec City","Sherbrooke","Montréal","Calgary","Kitchener--Cambridge--Waterloo","St. John's","Windsor","Saskatoon","Winnipeg","Edmonton","Hamilton","Regina","Halifax","St. Catharines--Niagara","London","Victoria","Vancouver","Toronto"))
win1 <- cdc_simple(vote)
win1
win1$summary_m
