'use strict'

let usersPath
let PORT = 8000;

let isElasticSearch;

if(process.argv.length > 2) {
    isElasticSearch = process.argv[2]
}else{
    isElasticSearch = false;
}

require('./lib/trinkas-server').initServer(PORT, isElasticSearch)