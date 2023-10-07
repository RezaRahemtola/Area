# Creates all the required .env files

# Environment argument parsing
if [ -z "$1" ]
  then
    echo "Please provide an environment (dev or prod)"
    exit 1
fi
INFISICAL_ENVIRONMENT=$1

# Define paths to dump
paths=( \
  "frontend/web/" \
  "frontend/mobile/" \
  "backend/back/" \
  "backend/supervisor/" \
)
file=".env"

# Colors
green='\033[0;32m'
clear='\033[0m'

INDEX=1
for path in "${paths[@]}"
  do
    infisical export --env="$INFISICAL_ENVIRONMENT" --path="$path" > "$path"$file
    echo -e "${green}Dumped ${path}${file} ($INDEX/${#paths[@]}) ${clear}"
    ((INDEX++))
done
