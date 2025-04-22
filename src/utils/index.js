const _ = require('lodash')
const Types = require('mongoose')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

module.exports = {
    getInfoData
}