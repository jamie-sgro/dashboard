library("votesys")

raw <- list2ballot(
  x = list(
    c("Quebec City","Sherbrooke","Montr�al","Calgary","Kitchener--Cambridge--Waterloo","St. John's","Windsor","Saskatoon","Winnipeg","Edmonton","Hamilton","Regina","Halifax","St. Catharines--Niagara","London","Victoria","Vancouver","Toronto"),
    c("Toronto","Vancouver","Montr�al","Regina","Victoria","Calgary","Winnipeg","Kitchener--Cambridge--Waterloo","Quebec City","Edmonton","Saskatoon","Hamilton","St. Catharines--Niagara","London","Sherbrooke","Halifax","Windsor","St. John's"),
    c("Calgary","Vancouver","Toronto","Victoria","Kitchener--Cambridge--Waterloo","Edmonton","Saskatoon","Winnipeg","London","Regina","Hamilton","Quebec City","Montr�al","St. John's","Halifax","Sherbrooke","Windsor","St. Catharines--Niagara"),
    c("Hamilton","Toronto","Calgary","Vancouver","Victoria","Kitchener--Cambridge--Waterloo","Winnipeg","London","Saskatoon","St. John's","Halifax","St. Catharines--Niagara","Edmonton","Quebec City","Montr�al","Windsor","Regina","Sherbrooke"),
    c("Edmonton","Calgary","Victoria","Vancouver","Sherbrooke","Regina","Windsor","Saskatoon","Winnipeg","Halifax","London","Hamilton","Toronto","Quebec City","Montr�al","Kitchener--Cambridge--Waterloo","St. Catharines--Niagara","St. John's"),
    c("Edmonton","Saskatoon","Winnipeg","Calgary","Regina","Victoria","St. Catharines--Niagara","London","Hamilton","Kitchener--Cambridge--Waterloo","Windsor","St. John's","Toronto","Quebec City","Montr�al","Vancouver","Sherbrooke","Halifax"),
    c("Sherbrooke","Windsor","St. Catharines--Niagara","Edmonton","London","Kitchener--Cambridge--Waterloo","Hamilton","Quebec City","Halifax","Victoria","St. John's","Regina","Saskatoon","Montr�al","Vancouver","Winnipeg","Toronto","Calgary"),
    c("Victoria","Vancouver","Sherbrooke","Halifax","St. John's","Calgary","Winnipeg","Edmonton","London","Saskatoon","St. Catharines--Niagara","Toronto","Montr�al","Kitchener--Cambridge--Waterloo","Hamilton","Regina","Quebec City","Windsor"),
    c("Halifax","Regina","St. Catharines--Niagara","Calgary","Toronto","Hamilton","Montr�al","London","Vancouver","Edmonton","Kitchener--Cambridge--Waterloo","Sherbrooke","St. John's","Winnipeg","Victoria","Saskatoon","Quebec City","Windsor"),
    c("Vancouver","Quebec City","Toronto","Montr�al","St. John's","Windsor","Calgary","Victoria","Sherbrooke","St. Catharines--Niagara","London","Regina","Hamilton","Kitchener--Cambridge--Waterloo","Edmonton","Winnipeg","Saskatoon","Halifax")
  )
)
vote <- create_vote(raw, xtype = 3, candidate = c("Quebec City","Sherbrooke","Montr�al","Calgary","Kitchener--Cambridge--Waterloo","St. John's","Windsor","Saskatoon","Winnipeg","Edmonton","Hamilton","Regina","Halifax","St. Catharines--Niagara","London","Victoria","Vancouver","Toronto"))
win1 <- cdc_simple(vote)
win1
win1$summary_m
