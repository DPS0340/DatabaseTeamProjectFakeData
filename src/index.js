
const fs = require('fs')
require('./dependencies')
require('./auxiliary')
require('./generateFunction')


// Main Function.
    (async() => {
    const result = new Map()
    const queries = []
    for(const field of fields) {
        result[field] = []
    }
    const table = new Map()
    for(let i = 0; i < 10; i++) {
        for(const field of fields) {
            const selectedFun = funcs[fields.indexOf(field)]
            const res = await selectedFun()
            const placeholders = []
            const values = []
            table[field] = []
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
                table[field].push(k)
            }
            result[field].push(res)
            const query = `INSERT INTO ${field.toUpperCase()} (${placeholders.join(', ')}) VALUES (${values.join(', ')})`
            queries.push(query)
        }
    }
    console.log(queries)
    const queriesString = queries.join('\n')
    fs.writeFileSync('sampleData/table.json', JSON.stringify(table), encoding="utf-8")
    fs.writeFileSync('sampleData/query.txt', queriesString, encoding="utf-8")
    fs.writeFileSync('sampleData/sampleDatadata.json', JSON.stringify(result), encoding="utf-8")
})()