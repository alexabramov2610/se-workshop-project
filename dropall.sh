mongo trading-system-db <<EOF
db.users.drop()
db.stores.drop()
db.storeowners.drop()
db.storemanagers.drop()
db.products.drop()
db.events.drop()
db.receipts.drop()
db.admins.drop()
EOF
