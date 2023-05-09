#!/bin/bash

# CSVファイルのパスを指定する
sourceFile="../csv/test.csv"
tmpFile="../csv/tmp.csv"

# MySQLデータベースの接続情報を指定する
mysql_user="root"
mysql_password="password"
#mysql_host="localhost"
mysql_database="dbtest"

# mysql自動接続用に一時的に環境変数に追加する
export MYSQL_PWD=$mysql_password

# 一時ファイルを作成し、ヘッダー行を削除する
sed '1d' $sourceFile > $tmpFile

# ファイルを1行ずつ読み込む
while read -r line; do

  # 最初の行はヘッダーなので、スキップする
  if [[ "$line" == *"header"* ]]; then
    continue
  fi

  # 各行をカンマで分割し、配列に格納する
  IFS=',' read -ra fields <<< "$line"

  # フィールドを適切なデータ型に変換する
  let postId=${fields[0]}
  postUser=${fields[1]}
  address=${fields[2]}
  content=${fields[3]}
  let likeCount=${fields[4]}
  postDate=${fields[5]}

  # データベースに登録する
  #mysql -u"$mysql_user" -p"$mysql_password" -h"$mysql_host" -D"$mysql_database" \
  mysql -u $mysql_user -D $mysql_database \
  -e "INSERT INTO PostMessage (postId, postUser, address, content, likeCount, postDate) VALUES ($postId, '$postUser', '$address' , '$content', $likeCount, '$postDate')"

done < $tmpFile

rm $tmpFile

