### Mini Project

## DEVELOPMENT RUNNING
   ### Database
   Install [pg admin 4](https://www.pgadmin.org/download/pgadmin-4-windows/) for database
   
   ### Backend
    cd .\back-end\
    npm install
    npx prisma migrate dev --name init
    npm run start:dev

   ### Frontend
    cd .\front-end\
    npm install
    npm run dev
