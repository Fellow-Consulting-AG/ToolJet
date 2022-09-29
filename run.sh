execute_command () {
    cmd="tell app \"Terminal\" to do script \"$1\""
    # "set W to the id of window 1 where its tab 1 = T"
    osascript -e "$cmd"
}

prefix="tab 1 of window id "

data=$(execute_command "cd $(pwd)/plugins && npm start")
plugins_id=${data#"$prefix"}
data=$(execute_command "cd $(pwd)/server && npm run start:dev")
server_id=${data#"$prefix"}
data=$(execute_command "cd $(pwd)/frontend && npm start")



frontend_id=${data#"$prefix"}

# exec

# doesnt work sadly
# echo "hit controll-c to close all windows"
# ( trap exit SIGINT ; read -r -d '' _ </dev/tty )
# echo "closing terminal windows"
# kill -9 $plugins_id
# kill -9 $server_id
# kill -9 $frontend_id
# echo "done"
