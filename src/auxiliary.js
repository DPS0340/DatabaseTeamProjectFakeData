require('./dependencies')
require('./generateFunction')

Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Date.prototype.yymmdd = function() {
    var yy = this.getFullYear().toString().slice(2)
    var mm = (this.getMonth()+1).toString()
    var dd  = this.getDate().toString()
    return yy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])
};

const fields = ['member', 'businessMember', 'memberCard', 'order', 'product', 'category', 'review', 'include', 'delivery', 'send', 'refresh', 'remains', 'check', 'employee', 'request']
const funcs = [generateMember, generateBusinessMember, generateMemberCard, generateOrder, generateProduct, generateCategory, generateReview, generateInclude, generateDelivery
, generateSend, generateRefresh, generateRemains, generateCheck, generateEmployee, generateRequest]
const ratings = ['GoldStar', 'Executive GoldStar']
const ratingPrices = { 'GoldStar': 50000, 'Executive GoldStar': 100000 }
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

const typeCheck = (e) => {
    switch(typeof e) {
        case "string":
            
    }
}