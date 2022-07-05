execute_command () {
    cmd="tell app \"Terminal\" to do script \"$1\""
    # "set W to the id of window 1 where its tab 1 = T"
    osascript -e "$cmd"
}

execute_command "cd $(pwd)/plugins && npm start"
execute_command "cd $(pwd)/server && npm run start:dev"

cd ./frontend && npm start 
open http://127.0.0.1:8082

