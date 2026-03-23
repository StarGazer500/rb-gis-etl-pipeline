import time

import pandas as pd
import geopandas as gpd
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session




class DataManagement():

    @staticmethod
    def execute_spatial_query(conn: Session, query, geom_col='geom'):
        try:
            return gpd.read_postgis(query, conn.connection(), geom_col=geom_col)
        except Exception as e:
            print(e)
            raise


    @staticmethod
    def execute_query_non_spatial(conn: Session, query):
        try:
            return pd.read_sql(query, conn.connection())
        except Exception as e:
            print(e)
            raise


    @staticmethod
    def create_target_schema_if_not_exists(conn: Session, schema):
        if schema:
            conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema}"))


    @staticmethod
    def save_spatial_data_to_postgres(conn: Session, data, table_name, schema=None, target_crs=4326, max_retries=2):
        if target_crs is not None:
            data = data.to_crs(target_crs)

        DataManagement.create_target_schema_if_not_exists(conn, schema)

        full_table = f'"{schema}"."{table_name}"' if schema else f'"{table_name}"'

        for attempt in range(1, max_retries + 2):
            try:
                data.to_postgis(
                    name=table_name,
                    con=conn.get_bind(),
                    schema=schema,
                    if_exists='replace',
                    index=False
                )

                conn.execute(text(f"""
                    ALTER TABLE {full_table}
                    ADD COLUMN id SERIAL PRIMARY KEY;
                """))

                print(f'Successfully saved {len(data)} records to {schema}.{table_name}')
                return

            except OperationalError as e:
                if 'lock timeout' in str(e).lower() and attempt <= max_retries:
                    print(f'Lock timeout on {full_table}, retrying in 5s (attempt {attempt}/{max_retries})...')
                    time.sleep(5)
                else:
                    print(f'Error occurred with error message: {e}')
                    raise


    @staticmethod
    def save_non_spatial_data_to_postgres(conn: Session, data, table_name):
        try:
            data.to_sql(
                name=table_name,
                con=conn.get_bind(),
                if_exists='replace',
                index=False
            )
        except Exception as e:
            print(f'Error occurred with error message: {e}')
            raise
