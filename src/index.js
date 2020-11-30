const en = require('faker/locale/en')
const fs = require('fs');
const auxiliary = require('./auxiliary');
const romanize = require('transliteration').slugify
const generateFunction = require('./generateFunction')


// Main Function.
;
(async() => {
    const fields = auxiliary.fields
    const funcs = generateFunction.funcs
    const result = new Map()
    const queries = []
    const creates = []
    const table = new Map()
    for (const field of fields) {
        result[field] = []
        const head = `CREATE TABLE ${field} (`
        const tail = ");"
        const selectedFun = funcs[fields.indexOf(field)]
        const res = await selectedFun()
        let hasPk = false
        const tables = Object.keys(res).map(tableName => {
            let annotation = ""
            if (!hasPk && auxiliary.PK.includes(tableName)) {
                annotation = " NOT NULL PRIMARY KEY"
                hasPk = true
            } else if (auxiliary.FK.includes(tableName)) {
                annotation = ` FOREIGN KEY REFERENCES ${tableName.match(/[A-Z][a-z]+/g)[0].toLowerCase()}(${field})`
            }
            let type = auxiliary.typeCheck(res[tableName])
            return `${tableName} ${type}${annotation}`
        }).join(',\n')
        creates.push(head + tables + tail)
        for (let i = 0; i < 10; i++) {
            const selectedFun = funcs[fields.indexOf(field)]
            const res = await selectedFun()
            const placeholders = []
            const values = []
            table[field] = []
            for (const [k, v] of Object.entries(res)) {
                if (k.includes('DateTime')) {
                    continue;
                }
                placeholders.push(k)
                if ((typeof v === 'string' || v instanceof String) && !v.includes("TO_UTC_TIMESTAMP")) {
                    values.push(`'${v}'`)
                } else {
                    values.push(v)
                }
                table[field].push(k)
            }
            result[field].push(res)
            const query = `INSERT INTO ${field.toUpperCase()} (${placeholders.join(', ')}) VALUES (${values.join(', ')});`
            queries.push(query)
        }
    }
    const queriesString = `${creates.join('\n\n')}\n\n${queries.join('\n')}`
    fs.writeFileSync('./sampleData/table.json', JSON.stringify(table), encoding = "utf-8")
    fs.writeFileSync('./sampleData/query.txt', queriesString, encoding = "utf-8")
    fs.writeFileSync('./sampleData/sampleDatadata.json', JSON.stringify(result), encoding = "utf-8")
})()