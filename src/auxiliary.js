require('./generateFunction')
require('./classes')
const fs = require('fs')

Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Date.prototype.yymmdd = function() {
    var yy = this.getFullYear().toString().slice(2)
    var mm = (this.getMonth() + 1).toString()
    var dd = this.getDate().toString()
    return yy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0])
};

exports.fields = ['member', 'businessMember', 'memberCard', 'anorder', 'product', 'category', 'review', 'include', 'delivery', 'send', 'refresh', 'remains', 'checked', 'employee', 'request']
exports.lengths = { 'callNumber': 11, 'phoneNumber': 11, 'address': 128, 'corpCallNumber': 11, 'koreanCorpName': 64, 'englishCorpName': 64, 'password': 16, 'englishName': 64, 'birthDate': 6, 'corpAddress': 64, 'cardBenefit': 128, 'content': 128, 'reviewContent': 128, 'productSpec': 128, 'deliveryAndRefund': 20, 'others': 20, 'zipCode': 10, 'corpZipCode': 10 }
exports.ratings = ['GoldStar', 'Executive GoldStar']
exports.ratingPrices = { 'GoldStar': 50000, 'Executive GoldStar': 100000 }
exports.dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
exports.PK = ['memberNumber', 'businessNumber', 'cardCode', 'orderNumber', 'postNumber', 'deliveryNumber', 'productCode', 'categoryCode', 'remainsNumber', 'employeeNumber']
exports.FK = ['memberNumber', 'orderNumber', 'productCode', 'categoryCode', 'deliveryNumber', 'remainsNumber', 'orderNumber']
exports.companies = ['삼성전자', '셀트리온', '카카오', 'NAVER', '삼성전자우', '신풍제약', '대한전선', '필룩스', '두산중공업', 'SK']
exports.reviews = ['디스크판 구입햇는데 생각보다 cd구동소리 큽니다', '아이패드 프로 10.5 2017년 모델도 호환가능한가요?', '잘쓸게요~', '역시 애플답네요.', '애플 펜슬 2세대, 탭이 편리합니다.', '최고예요', 'SSG에서 판매하는 애플 펜슬 Pencil 2세대가 제일 저렴하지 않을까합니다. 배송비 포함해서 비교해보세요~~~ 빠른 배송, 안전한 포장 만족도 최고입니다. 아이패드 프로가 있으신 분들은 고민할 필요없이 SSG.COM에서 바로 구매 클릭하세요~!!! 만족도 업~ 기분 업~', '빠른배송 은 칭찬해', '아이패드에 사용하려고 구매했어요 . 추석 연휴 기간에 할인 쿠폰 있어 저렴하게 득템했어요. 그동안 애플...', '좋아요~ 아주 좋아요! 이렇게나']
console.log(exports.companies.length)
console.log(exports.reviews.length)

exports.typeCheck = (k, e) => {
    const types = {
        "Date": "DATE",
        "string": cnt => `char(${cnt})`,
        "number": "integer"
    }
    const mapLength = (cnt) => {
        if (cnt <= 32) {
            return 32
        } else {
            return 120
        }
    }
    const checkStr = cnt => e => {
        const max = mapLength(cnt)
        if (e.length > max) {
            return false
        }
        return true
    }
    const mappedType = types[typeof e]
    let result
    switch (typeof e) {
        case "string":
            const val = exports.lengths[k]
            if (val !== undefined) {
                result = `char(${val})`
            } else {
                result = mappedType(mapLength(e.length))
            }
            break
        default:
            result = mappedType
            break
    }
    return result
}