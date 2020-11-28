const createCsvWriter = require('csv-writer').createObjectCsvWriter
const faker = require('faker/locale/ko')
const en = require('faker/locale/en')
const { date } = require('faker/lib/locales/en')
const romanize = require('transliteration').slugify
const fs = require('fs')
require('./auxiliary')

const ratings = ['GoldStar', 'Executive GoldStar']
const ratingPrices = { 'GoldStar': 50000, 'Executive GoldStar': 100000 }
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }


const generateMember = async(memberCard) => {
    if (memberCard == undefined) {
        memberCard = await generateMemberCard()
    }
    const memberNumber = faker.random.number(10 ** 10)
    const password = faker.random.alphaNumeric(16)
    const firstname = faker.name.firstName()
    const lastname = faker.name.lastName()
    const name = `${lastname}${firstname}`
    const englishName = `${en.name.firstName()}`
    const birthDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date("Jan 1, 90 00:00:00 GMT+09:00"))
    const birthDate = +birthDateTime.yymmdd()
    const memberRating = memberCard.cardRating
    const callNumber = faker.phone.phoneNumber("031########")
    const phoneNumber = faker.phone.phoneNumber("010########")
    const address = `${en.address.streetAddress()}, ${en.address.secondaryAddress()}`
    const zipCode = en.address.zipCode()
    const email = faker.internet.email(romanize(firstname), romanize(lastname))

    return {
        memberNumber,
        password,
        name,
        englishName,
        birthDateTime,
        birthDate,
        memberRating,
        callNumber,
        phoneNumber,
        address,
        zipCode,
        email,
    }
}

const generateBusinessMember = async(member) => {
    if (member === undefined) {
        member = await generateMember()
    }
    const businessNumber = faker.random.number(10 ** 5)
    const koreanCorpName = faker.company.companyName()
    const englishCorpName = romanize(koreanCorpName)
    const corpCallNumber = faker.phone.phoneNumber("031########")
    const corpAddress = `${en.address.streetAddress()}, ${en.address.secondaryAddress()}`
    const corpZipCode = en.address.zipCode()

    return {
        businessNumber,
        koreanCorpName,
        englishCorpName,
        corpCallNumber,
        corpCallNumber,
        corpAddress,
        corpZipCode,
        ...member
    }
}

const generateMemberCard = async(member) => {
    if (member === undefined) {
        member = await generateMember(this)
    }
    const code = faker.random.number(10 ** 5)
    const number = member.memberNumber
    const cardRating = ratings.choice()
    const ratingPrice = ratingPrices[cardRating]
    const boughtDateTime = faker.date.between(member.birthDateTime, new Date(Date.now()))
    const boughtDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${boughtDateTime.toISOString(dateOptions)}'))`
        // 1년
    const expiredDateTime = new Date(boughtDateTime)
    expiredDateTime.setFullYear(expiredDateTime.getFullYear() + 1)
    const expiredDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${expiredDateTime.toISOString(dateOptions)}'))`
    return {
        code,
        number,
        cardRating,
        ratingPrice,
        boughtDate,
        expiredDate
    }
}

const generateOrder = async(member) => {
    if(member === undefined) {
        member = await generateMember()
    }
    const orderNumber = faker.random.number(10 ** 5)
    const memberNumber = member.memberNumber
    const productNumber = faker.random.number(10 ** 5)
    const deliveryCorpNumber = faker.random.number(10 ** 5)
    const totalPrice = faker.random.number(10 ** 6)
    const totalQuantity = faker.random.number(100)
    const boughtDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const boughtTime = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${boughtDateTime.toISOString(dateOptions)}'))`

    return {
        orderNumber,
        memberNumber,
        productNumber,
        deliveryCorpNumber,
        totalPrice,
        totalQuantity,
        boughtTime
    }
}

const generateProduct = async(member, category, review) => {
    if(member === undefined) {
        member = await generateMember()
    }
    if(category === undefined) {
        category = await generateCategory()
    }
    if(review === undefined) {
        review = await generateReview(this, category, member)
    }

    const productCode = faker.random.number(10 ** 5)
    const categorynumber = faker.random.number(10 ** 5)
    const productName = faker.commerce.productName()
    const productCorp = en.company.companyName()
    const productImage = faker.random.uuid()
    const spec = faker.lorem.words()
    const productPrice = faker.random.number(10 ** 6)
    const categoryCode = category.categoryCode

    return {
        productCode,
        categorynumber,
        productName,
        productCorp,
        productImage,
        spec,
        productPrice,
        categoryCode
    }
}

const generateCategory = async() => {
    const categoryCode = faker.random.number(10 ** 5)
    const categoryName = faker.company.bsNoun()

    return {
        categoryCode,
        categoryName
    }
}

const generateReview = async(product, category, member) => {
    if(product === undefined) {
        product = await generateProduct()
    }
    if(category === undefined) {
        category = await generateCategory()
    }
    if(member === undefined) {
        member = await generateMember()
    }   

    const postNumber = faker.random.number(10 ** 5)
    const productNumber = product.productCode
    const memberNumber = member.memberNumber
    const categoryCode = category.categoryCode
    const writeDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const writeDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${writeDateTime.toISOString(dateOptions)}'))`
    const content = en.lorem.words()
    const likes = faker.random.number(500)

    return {
        postNumber,
        productNumber,
        memberNumber,
        categoryCode,
        writeDate,
        content,
        likes
    }
}

const generateInclude = async(order, product) => {
    if(order === undefined) {
        order = await generateOrder()
    }
    if(product === undefined) {
        product = await generateProduct()
    }

    const orderNumber = order.number
    const memberNumber = order.memberNumber
    const productCode = product.productCode
    const categoryCode = product.categoryCode
    const quantity = faker.random.number(100)
    const sumPrice = faker.random.number(10 ** 6)

    return {
        orderNumber,
        memberNumber,
        productCode,
        categoryCode,
        quantity,
        sumPrice
    }
}

const generateDelivery = async() => {
    const deliveryNumber = faker.random.number(10 ** 6)
    const deliveryStart = en.address.streetAddress()
    const deliveryDestination = en.address.streetAddress()
    const deliveryDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const deliveryDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${deliveryDateTime.toISOString(dateOptions)}'))`

    return {
        deliveryNumber,
        deliveryStart,
        deliveryDestination,
        deliveryDate
    }
}

const generateSend = async(delivery, product) => {
    if(delivery === undefined) {
        delivery = await generateDelivery()
    }
    if(product === undefined) {
        product = await generateProduct()
    }
    const deliveryNumber = delivery.deliveryNumber
    const productCode = product.productCode
    const categoryCode = product.categoryCode
    const totalTime = faker.random.number(100)

    return {
        deliveryNumber,
        productCode,
        categoryCode,
        totalTime
    }
}
const generateRefresh = async(product, remains) => {
    if(product === undefined) {
        product = await generateProduct()
    }
    if(remains === undefined) {
        remains = await generateRemains()
    }

    const productCode = product.productCode
    const categoryCode = product.categoryCode
    const remainsNumber = remains.remainsNumber
    const refreshDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const refreshDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${refreshDateTime.toISOString(dateOptions)}'))`

    return {
        productCode,
        categoryCode,
        remainsNumber,
        refreshDate
    }
}
const generateRemains = async() => {
    const remainsNumber = faker.random.number(10 ** 6)
    const remainsQuantity = faker.random.number(100)
    const remainsDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const remainsDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${remainsDateTime.toISOString(dateOptions)}'))`

    return {
        remainsNumber,
        remainsQuantity,
        remainsDate
    }
}
const generateCheck = async(remains, employee) => {
    if(remains === undefined) {
        remains = await generateRemains()
    }
    if(employee === undefined) {
        employee = await generateEmployee()
    }
    const employeeNumber = employee.employeeNumber
    const remainsNumber = remains.remainsNumber
    const checkedDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const checkedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${checkedDateTime.toISOString(dateOptions)}'))`
    const others = ""

    return {
        employeeNumber,
        remainsNumber,
        checkedDate,
        others
    }
}
const generateEmployee = async() => {
    const employeeNumber = faker.random.number(10 ** 6)
    const firstname = faker.name.firstName()
    const lastname = faker.name.lastName()
    const employeeName = `${lastname}${firstname}`
    const employeeSSN = faker.random.number(10 ** 6)
    const employeePhoneNumber = faker.phone.phoneNumber("010########")
    const employeeEmail = faker.internet.email(romanize(firstname), romanize(lastname))
    const employeeWorkedDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const employeeWorkedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${employeeWorkedDateTime.toISOString(dateOptions)}'))`
    const employeeSalary = (3 + faker.random.number(10)) * 10 ** 7

    return {
        employeeNumber,
        employeeName,
        employeeSSN,
        employeePhoneNumber,
        employeeEmail,
        employeeWorkedDate,
        employeeSalary
    }
}

const generateRequest = async(order, delivery) => {
    if(order === undefined) {
        order = await generateOrder()
    }
    if(delivery === undefined) {
        delivery = await generateDelivery()
    }

    const orderNumber = order.orderNumber
    const memberNumber = order.memberNumber
    const deliveryNumber = delivery.deliveryNumber
    const requestedDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const requestedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${requestedDateTime.toISOString(dateOptions)}'))`
    return {
        orderNumber,
        memberNumber,
        deliveryNumber,
        requestedDate
    }
}

// Main Function.
    (async() => {
    console.log('generateMember:', await generateMember())
    console.log('generateBusinessMember:', await generateBusinessMember())
    console.log('generateMemberCard:', await generateMemberCard())
    console.log('generateOrder', await generateOrder())
    console.log('generateProduct', await generateProduct())
    console.log('generateCategory', await generateCategory())
    console.log('generateReview', await generateReview())
    console.log('generateInclude', await generateInclude())
    console.log('generateDelivery', await generateDelivery())
    console.log('generateSend', await generateSend())
    console.log('generateRefresh', await generateRefresh())
    console.log('generateRemains', await generateRemains())
    console.log('generateCheck', await generateCheck())
    console.log('generateEmployee', await generateEmployee())
    console.log('generateRequest', await generateRequest())
    const fields = ['member', 'businessMember', 'memberCard', 'order', 'product', 'category', 'review', 'include', 'delivery', 'send', 'refresh', 'remains', 'check', 'employee', 'request']
    const funcs = [generateMember, generateBusinessMember, generateMemberCard, generateOrder, generateProduct, generateCategory, generateReview, generateInclude, generateDelivery
    , generateSend, generateRefresh, generateRemains, generateCheck, generateEmployee, generateRequest]
    const result = new Map()
    const queries = []
    for(const field of fields) {
        result[field] = []
    }
    for(let i = 0; i < 10; i++) {
        for(const field of fields) {
            const selectedFun = funcs[fields.indexOf(field)]
            const res = await selectedFun()
            const placeholders = []
            const values = []
            for(const [k, v] of Object.entries(res)) {
                if(k.includes('DateTime')) {
                    continue;
                }
                placeholders.push(k)
                if((typeof v === 'string' || v instanceof String) && !v.includes("TO_UTC_TIMESTAMP")) {
                    values.push(`'${v}'`)
                } else {
                    values.push(v)
                }
            }
            result[field].push(res)
            const query = `INSERT INTO ${field.toUpperCase()} (${placeholders.join(', ')}) VALUES (${values.join(', ')})`
            queries.push(query)
        }
    }
    console.log(queries)
    const queriesString = queries.join('\n')
    fs.writeFileSync('query.txt', queriesString, encoding="utf-8")
    fs.writeFileSync('data.json', JSON.stringify(result), encoding="utf-8")
})()