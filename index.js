const createCsvWriter = require('csv-writer').createObjectCsvWriter
const faker = require('faker/locale/ko')
const en = require('faker/locale/en')
const romanize = require('transliteration').slugify
require('./auxiliary')

const result = []
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
    const birthDate = birthDateTime.toLocaleDateString('ko-KR', dateOptions)
    const memberRating = memberCard.rating
    const callNumber = faker.phone.phoneNumber("031-####-####")
    const phoneNumber = faker.phone.phoneNumber("010-####-####")
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
    const businessNumber = faker.random.number(10 ** 10)
    const koreanCorpName = faker.company.companyName()
    const englishCorpName = romanize(koreanCorpName)
    const corpCallNumber = faker.phone.phoneNumber("031-####-####")
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
    const code = faker.random.number(10 ** 20)
    const number = member.memberNumber
    const cardRating = ratings.choice()
    const ratingPrice = ratingPrices[cardRating]
    const boughtDateTime = faker.date.between(member.birthDateTime, new Date(Date.now()))
    const boughtDate = boughtDateTime.toLocaleDateString('ko-KR', dateOptions)
        // 1년
    console.log(boughtDate)
    const expiredDateTime = new Date(boughtDateTime)
    expiredDateTime.setFullYear(expiredDateTime.getFullYear() + 1)
    const expiredDate = expiredDateTime.toLocaleDateString('ko-KR', dateOptions)
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
    const orderNumber = faker.random.number(10 ** 20)
    const memberNumber = member.memberNumber
    const productNumber = faker.random.number(10 ** 20)
    const deliveryCorpNumber = faker.random.number(10 ** 20)
    const totalPrice = faker.random.number(10 ** 6)
    const totalQuantity = faker.random.number(100)
    const boughtDateTime = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const boughtTime = boughtDateTime.toLocaleDateString('ko-KR', dateOptions)

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

// Main Function.
    (async() => {
    console.log('generateMember:', await generateMember())
    console.log('generateBusinessMember:', await generateBusinessMember())
    console.log('generateMemberCard:', await generateMemberCard())
    console.log('generateOrder', await generateOrder())
})()