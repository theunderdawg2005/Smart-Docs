const mongoose = require('mongoose')
const {db: {host, password, dbname}} = require('../configs/config.mongodb')
const connectString = `mongodb+srv://${host}:${password}@smart-docs.1pheuzj.mongodb.net/${dbname}?retryWrites=true&w=majority`


class Database {
    constructor()
    {
        this.connect()
    }

    connect(type = 'mongodb') {
        if(1 == 1)
        {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 100
        }).then(_ => console.log('Connect successfully!')
        ).catch((err) => console.log('Error connect: ', err)
        )
    }

    static getInstance() {
        if(!Database.instance)
        {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

module.exports = Database.getInstance()
