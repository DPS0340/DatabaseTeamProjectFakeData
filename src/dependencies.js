const createCsvWriter = require('csv-writer').createObjectCsvWriter
const faker = require('faker/locale/ko')
const en = require('faker/locale/en')
const { date } = require('faker/lib/locales/en')
const romanize = require('transliteration').slugify