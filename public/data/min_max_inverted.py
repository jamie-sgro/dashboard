from pathlib import Path

from sklearn.preprocessing import MinMaxScaler
import pandas as pd

file_path = Path("./public/data/mix_max_inverted.csv")
assert file_path.is_file()

df = pd.read_csv(file_path)
print(df)

scaler = MinMaxScaler()
rows_to_normalize = [
    "11.1.1",
    "11.2.1",
    "11.3.1",
    # "11.3.2",
    # "11.4.1",
    # "11.5.1",
    # "11.5.2",
    # "11.6.1",
    "11.6.2",
    # "11.7.1",
    "11.7.2",
]
normalized_data = scaler.fit_transform(df[rows_to_normalize])
result = pd.DataFrame(normalized_data)
result.columns = [x + "_python" for x in rows_to_normalize]

df = df.join(result)
result = 1- result
result.columns = [x + "_python_inverted" for x in rows_to_normalize]
df.to_csv(Path("./public/data/mix_max_js_results_inverted.csv"))
1