install Mongo 

mongod --replSet rs0 --dbpath /opt/homebrew/var/mongodb
or your path

mongosh
rs.status()


npm install
npm run init:permissions  
npm run init:all

Enter Admin Email: admin@email.com
Enter Admin Password: admin



{
  "_id": {
    "$oid": "695d4da0acbc68b0a1c509d8"
  },
  "ISBN": "9780446670203",
  "title": "Thick Face, Black Heart",
  "edition": "a",
  "category": {
    "$oid": "695cb7a8cf744c6d3373ef45"
  },
  "description": "Hi",
  "publisher": "a",
  "img": "https://placehold.co/400",
  "author": [
    {
      "$oid": "695cb7a8cf744c6d3373ef4a"
    }
  ],
  "__v": 0
}