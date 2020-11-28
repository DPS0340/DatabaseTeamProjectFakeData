
class Annotation {
    constructor() {}

    get() {return () => ""}
}

class PK extends Annotation {
    constructor() {}

    get() {return () => `NOT NULL PRIMARY KEY`}
}

class FK extends Annotation {
    constructor(refTableName, ref) {
        this.refTableName = refTableName
        this.ref = ref
    }

    get() {return () => `FOREIGN KEY REFERENCES ${ref}(${tableName})`}
}

class TYPE {
    constructor(typeName, checkfn) {
        this.typeName = typeName
        this.checkfn = checkfn
    }
    check(e) {
        try {
            return this.checkfn(e)
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

class Column {
    constructor(name, type, annotation) {
        this.name = name
        this.type = type
        this.annotation = annotation
    }
}

class Table {
    constructor(name, columns) {
        this.name = name
        this.columns = columns
        this.rows = []
    }
    
    append(...args) {
        if(args.length != this.columns.length) {
            console.log("Columns size Mismatch")
            return false
        }
        const row = []
        for(let i=0;i<args.length;i++) {
            const constructed = this.columns(args[i])
            row.push()
        }
        this.rows.push(rows)
        return true
    }

    __get_create_query() {
        const head = `CREATE TABLE ${name} (`
        const tail = ");"
        const mid = columns.map(column => `${column.name} ${column.type} ${column.annotation.get()}`).join(', ')
        return head + mid + tail
    }

    get_query() {
        return __get_create_query()
    }
}