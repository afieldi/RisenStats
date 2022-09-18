import psycopg2

connection = psycopg2.connect(dbname="test", user="postgres", password="password", host="risen-stats.chwqb24onmqi.ca-central-1.rds.amazonaws.com")
print(connection)

def get_all_player_games(player_uuid: str):
  pass

def get_player_by_name(player_name: str):
  pass