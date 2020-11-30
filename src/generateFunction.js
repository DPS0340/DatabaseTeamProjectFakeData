const faker = require('faker/locale/ko')
const en = require('faker/locale/en')
const romanize = require('transliteration').slugify
const auxiliary = require('./auxiliary')


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
    const birthDate = birthDateTime.yymmdd()
    const memberRating = memberCard.cardName
    const callNumber = faker.phone.phoneNumber("031########")
    const phoneNumber = faker.phone.phoneNumber("010########")
    const address = `${en.address.streetAddress()}, ${en.address.secondaryAddress()}`
    const zipCode = en.address.zipCode("#####")
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

let companyCount = 0;

const generateBusinessMember = async(member) => {
    if (member === undefined) {
        member = await generateMember()
    }
    const businessNumber = faker.random.number(10 ** 5)
    const memberNumber = member.memberNumber
    const koreanCorpName = auxiliary.companies[companyCount++]
    const englishCorpName = romanize(koreanCorpName)
    const corpCallNumber = faker.phone.phoneNumber("031########")
    const corpAddress = `${en.address.streetAddress()}, ${en.address.secondaryAddress()}`
    const corpZipCode = en.address.zipCode("#####")
    const corpEmail = faker.internet.email(englishCorpName)

    return {
        businessNumber,
        memberNumber,
        koreanCorpName,
        englishCorpName,
        corpCallNumber,
        corpCallNumber,
        corpAddress,
        corpZipCode,
        corpEmail
    }
}

const generateMemberCard = async(member) => {
    if (member === undefined) {
        member = await generateMember(this)
    }
    const cardCode = faker.random.number(10 ** 5)
    const memberNumber = member.memberNumber
    const cardName = auxiliary.ratings.choice()
    const cardBenefit = cardName
    const ratingPrice = auxiliary.ratingPrices[cardName]
    const boughtDateTime = faker.date.between(member.birthDateTime, new Date(Date.now()))
    const boughtDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${boughtDateTime.toISOString(auxiliary.dateOptions)}'))`
        // 1년
    const expiredDateTime = new Date(boughtDateTime)
    expiredDateTime.setFullYear(expiredDateTime.getFullYear() + 1)
    const expiredDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${expiredDateTime.toISOString(auxiliary.dateOptions)}'))`
    return {
        cardCode,
        memberNumber,
        cardName,
        cardBenefit,
        ratingPrice,
        boughtDate,
        expiredDate
    }
}

const generateOrder = async(member) => {
    if (member === undefined) {
        member = await generateMember()
    }
    const orderNumber = faker.random.number(10 ** 5)
    const memberNumber = member.memberNumber
    const productNumber = faker.random.number(10 ** 5)
    const deliveryCorpNumber = faker.random.number(10 ** 5)
    const totalPrice = faker.random.number(10 ** 6)
    const totalQuantity = faker.random.number(100)
    const boughtDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const boughtTime = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${boughtDateTime.toISOString(auxiliary.dateOptions)}'))`

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
    if (member === undefined) {
        member = await generateMember()
    }
    if (category === undefined) {
        category = await generateCategory()
    }
    if (review === undefined) {
        review = await generateReview(this, category, member)
    }

    const productCode = faker.random.number(10 ** 5)
    const reviewContent = review.content
    const productName = faker.commerce.productName()
    const productCorp = en.company.companyName()
    const productImage = faker.random.uuid()
    const deliveryAndRefund = ''
    const productSpec = en.lorem.words()
    const productPrice = faker.random.number(10 ** 6)
    const categoryCode = category.categoryCode

    return {
        productCode,
        productName,
        productCorp,
        productImage,
        deliveryAndRefund,
        reviewContent,
        productSpec,
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
    if (product === undefined) {
        product = await generateProduct()
    }
    if (category === undefined) {
        category = await generateCategory()
    }
    if (member === undefined) {
        member = await generateMember()
    }

    const postNumber = faker.random.number(10 ** 5)
    const productNumber = product.productCode
    const memberNumber = member.memberNumber
    const categoryCode = category.categoryCode
    const writeDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const writeDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${writeDateTime.toISOString(auxiliary.dateOptions)}'))`
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
    if (order === undefined) {
        order = await generateOrder()
    }
    if (product === undefined) {
        product = await generateProduct()
    }

    const orderNumber = order.orderNumber
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
    const deliveryDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${deliveryDateTime.toISOString(auxiliary.dateOptions)}'))`

    return {
        deliveryNumber,
        deliveryStart,
        deliveryDestination,
        deliveryDate
    }
}

const generateSend = async(delivery, product) => {
    if (delivery === undefined) {
        delivery = await generateDelivery()
    }
    if (product === undefined) {
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
    if (product === undefined) {
        product = await generateProduct()
    }
    if (remains === undefined) {
        remains = await generateRemains()
    }

    const productCode = product.productCode
    const categoryCode = product.categoryCode
    const remainsNumber = remains.remainsNumber
    const refreshDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const refreshDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${refreshDateTime.toISOString(auxiliary.dateOptions)}'))`

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
    const remainsDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${remainsDateTime.toISOString(auxiliary.dateOptions)}'))`

    return {
        remainsNumber,
        remainsQuantity,
        remainsDate
    }
}
const generateCheck = async(remains, employee) => {
    if (remains === undefined) {
        remains = await generateRemains()
    }
    if (employee === undefined) {
        employee = await generateEmployee()
    }
    const employeeNumber = employee.employeeNumber
    const remainsNumber = remains.remainsNumber
    const checkedDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const checkedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${checkedDateTime.toISOString(auxiliary.dateOptions)}'))`
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
    const employeeWorkedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${employeeWorkedDateTime.toISOString(auxiliary.dateOptions)}'))`
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
    if (order === undefined) {
        order = await generateOrder()
    }
    if (delivery === undefined) {
        delivery = await generateDelivery()
    }

    const orderNumber = order.orderNumber
    const memberNumber = order.memberNumber
    const deliveryNumber = delivery.deliveryNumber
    const requestedDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const requestedDate = `SYS_EXTRACT_UTC(TO_UTC_TIMESTAMP_TZ('${requestedDateTime.toISOString(auxiliary.dateOptions)}'))`
    return {
        orderNumber,
        memberNumber,
        deliveryNumber,
        requestedDate
    }
}

exports.funcs = [generateMember, generateBusinessMember, generateMemberCard, generateOrder, generateProduct, generateCategory, generateReview, generateInclude, generateDelivery, generateSend, generateRefresh, generateRemains, generateCheck, generateEmployee, generateRequest]