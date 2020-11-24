Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}