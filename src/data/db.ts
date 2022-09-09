import { constants } from 'node:fs'
import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { AuthorObject, BookObject } from '../model'

export class DB {
    // eslint-disable-next-line no-use-before-define
    static instance: DB
    #authors: Map<string, AuthorObject> = new Map()
    #books: Map<string, BookObject> = new Map()
    #dbPath: string = path.resolve(__dirname, '.db.json')

    constructor(){
        if(!DB.instance) DB.instance = this
        return DB.instance
    }

    async save(): Promise<void> {
        return writeFile(this.#dbPath, JSON.stringify({
            authors: [...this.#authors.entries()],
            books: [...this.#books.entries()]
        }))
    }

    async #load(): Promise<void> {
        const readData = await readFile(this.#dbPath, 'utf8')
        this.#authors = new Map(Array.isArray(JSON.parse(readData).authors) ? JSON.parse(readData).authors : new Map())
        this.#books = new Map(Array.isArray(JSON.parse(readData).books) ? JSON.parse(readData).books : new Map())
    }

    async init(): Promise<void> {
        try {
            await access(this.#dbPath, constants.F_OK)
            await this.#load()
        } catch (error) {
            await this.save()
        }
    }
}