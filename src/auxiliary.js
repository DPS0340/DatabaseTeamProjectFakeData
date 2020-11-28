require('./generateFunction')
require('./classes')
const CSV = require('comma-separated-values')
const fs = require('fs')

Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Date.prototype.yymmdd = function() {
    var yy = this.getFullYear().toString().slice(2)
    var mm = (this.getMonth()+1).toString()
    var dd  = this.getDate().toString()
    return yy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])
};

exports.fields = ['member', 'businessMember', 'memberCard', 'order', 'product', 'category', 'review', 'include', 'delivery', 'send', 'refresh', 'remains', 'check', 'employee', 'request']
exports.ratings = ['GoldStar', 'Executive GoldStar']
exports.ratingPrices = { 'GoldStar': 50000, 'Executive GoldStar': 100000 }
exports.dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
exports.PK = ['memberNumber', 'businessNumber', 'cardCode', 'orderNumber', 'postNumber', 'deliveryNumber', 'productCode', 'categoryCode', 'remainsNumber', 'employeeNumber']
exports.companies = []
// exports.companyData = fs.readFileSync('./sampleData/companies.csv')
// exports.csv = CSV(exports.companyData, {header: true}).parse()
// console.log(exports.generateCompany())

exports.typeCheck = (e) => {
    const types = {
        "Date": "DATE",
        "string": cnt => `char(${cnt})`,
        "number": "int"
    }
    const mapLength = (cnt) => {
        if(cnt <= 10) {
            return cnt
        } else if(cnt <= 36) {
            return 36
        } else {
            return 120
        }
    }
    const checkStr = cnt => e => {
        const max = mapLength(cnt)
        if(e.length > max) {
            return false
        }
        return true
    }
    const mappedType = types[e]
    const curry = fn => a => b => fn(a, b)
    const curriedType = curry(TYPE)(mappedType)
    switch(typeof e) {
        case "string":
            return curriedType(checkStr(e.length))
    }
    return curriedType(() => true)
}

exports.generateCompany = () => {
    const arr = csv[Math.floor(Math.random() * csv.length)]
    return arr[0]
}