Create .env file with
```
# NEXT
NEXTAUTH_SECRET="" # https://generate.plus/en/base64
NEXTAUTH_URL="http://localhost:3000"

# DB
DB_HOST=""  # With Port eg. localhost:3306
DB_USER=""
DB_PASSWORD="" 
DB_DATABASE="" # eg main or dev
DB_TYPE="mysql" # Mysql recommended
DATABASE_URL="${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}"

```