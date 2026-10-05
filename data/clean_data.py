import pandas as pd


# --------------------------------
# FILE PATHS
# --------------------------------

input_file = "Dustbins_new.csv"
output_file = "dustbins_clean.csv"


# --------------------------------
# READ RAW DATA
# --------------------------------

df = pd.read_csv(input_file)


print("Raw records:", len(df))


# --------------------------------
# CLEAN COLUMN NAMES
# --------------------------------

df.columns = df.columns.str.strip()


# --------------------------------
# KEEP RECORDS WITH VALID LOCATION
# --------------------------------

df_clean = df[
    df["_Location_latitude"].notna()
    & df["_Location_longitude"].notna()
].copy()


# --------------------------------
# CREATE CLEAN DATASET
# --------------------------------

clean_df = pd.DataFrame({

    "id": range(1, len(df_clean) + 1),

    "latitude": df_clean["_Location_latitude"],

    "longitude": df_clean["_Location_longitude"],

    "type": df_clean["Type of dustbin"].astype(str).str.strip(),

    "overflow": df_clean["Overflow"].astype(str).str.strip(),

    "photo": df_clean["Point and shoot"].astype(str).str.strip(),

    "photo_url": df_clean["Point and shoot_URL"].astype(str).str.strip()

})


# --------------------------------
# REMOVE INVALID PHOTO URL VALUES
# --------------------------------

clean_df["photo_url"] = clean_df["photo_url"].replace(
    ["nan", "NaN", ""],
    ""
)

clean_df["photo"] = clean_df["photo"].replace(
    ["nan", "NaN", ""],
    ""
)


# --------------------------------
# SAVE CLEAN DATASET
# --------------------------------

clean_df.to_csv(
    output_file,
    index=False
)


# --------------------------------
# SUMMARY
# --------------------------------

print("Valid mapped records:", len(clean_df))

print(
    "Records with photo URLs:",
    (clean_df["photo_url"] != "").sum()
)

print("Clean file created:", output_file)