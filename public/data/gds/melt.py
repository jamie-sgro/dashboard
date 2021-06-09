import pandas as pd

NAME = "cma_unemployment"

df = pd.read_csv(NAME + ".csv")
df = df.rename(columns={"Geography": "msa"})
df = df.melt("msa", var_name="year").sort_values(by=["msa", "year"])
df.to_csv(NAME + "_melt.csv", index=False)
