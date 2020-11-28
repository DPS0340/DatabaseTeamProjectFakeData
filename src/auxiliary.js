Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Date.prototype.yymmdd = function() {
    var yy = this.getFullYear().toString().slice(2)
    var mm = (this.getMonth()+1).toString()
    var dd  = this.getDate().toString()
    return yy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])
};