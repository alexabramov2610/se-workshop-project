/Users/rono/School/SE_Workshop/presentation/mongodb-macos-x86_64-4.2.6/bin/mongod --fork --logpath /Users/rono/School/SE_Workshop/presentation/mongodb-macos-x86_64-4.2.6/bin/mongod.log
/Users/rono/School/SE_Workshop/presentation/mongodb-macos-x86_64-4.2.6/bin/mongo trading-system-db <<EOF
db.users.drop()
db.stores.drop()
db.storeowners.drop()
db.storemanagers.drop()
db.products.drop()
db.events.drop()
db.receipts.drop()
EOF
