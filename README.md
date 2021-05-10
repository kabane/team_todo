# 準備
```
bin/db/reset
```

# TEST準備

```
bin/db/test_reset
```


# 参考情報
## dotenv

## Sequelize
### migration
https://sequelize.org/master/manual/migrations.html

migrationファイルの雛形を作る
```
npx sequelize-cli model:generate --name User --attributes provider:string,uid:string,username:string,email:string,displayName:string
```

```
npx sequelize-cli db:migrate
```

seedの雛形を作る
```
npx sequelize-cli seed:generate --name demo-user
```

## Routes
resourceの解説必要

# VSCode
- eslint
- puglint
