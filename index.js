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
    const birthDate = birthDateTime.yymmdd()
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

    const productCode = faker.random.number(10 ** 20)
    const categorynumber = faker.random.number(10 ** 20)
    const productName = faker.commerce.productName()
    const productCorp = en.company.companyName()
    const productImage = faker.random.uuid()
    const spec = faker.lorem.words()
    const productPrice = faker.random.number(10 ** 6)

    return {
        productCode,
        categorynumber,
        productName,
        productCorp,
        productImage,
        spec,
        productPrice,
        category
    }
}

const generateCategory = async() => {
    const categoryCode = faker.random.number(10 ** 20)
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

    const postNumber = faker.random.number(10 ** 20)
    const productNumber = product.productCode
    const memberNumber = product.member
    const categoryCode = category.categoryCode
    const writeDate = await faker.date.between(new Date("Jan 1, 00 00:00:00 GMT+09:00"), new Date(Date.now()))
    const content = en.lorem.paragraph()
    const likes = faker.random.number(1000)

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
    const categoryCode = product.category.categoryCode
    
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
})()