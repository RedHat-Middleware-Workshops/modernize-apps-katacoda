ssh root@host01 "bash <(curl -sL https://raw.githubusercontent.com/RedHat-Middleware-Workshops/modernize-apps-katacoda/master/assets/.init.sh)"

ssh root@host01 "pkill -f vertx:run"
ssh root@host01 "pkill -f spring-boot:run"
ssh root@host01 "pkill -f wildfly-swarm:run"
