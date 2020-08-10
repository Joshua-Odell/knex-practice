const ShoppingService = require('../src/shopping-list-service')
const knex = require('knex')
const { expect } = require('chai')

describe(`service object`, function() {
    let db
    let testList = [
        {
            id: 1,
            name: 'testone',
            price: 1.23,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main',
        },
        {
            id: 2,
            name: 'testone',
            price: 1.23,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main',
        },
        {
            id: 3,
            name: 'testone',
            price: 1.23,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main',
        },
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testList)
        })
        it(`getAllItems() all items from 'shopping_list' table`, () => {
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testList)
                })
        })
        it(`getById()`, () => {
            const thirdId = 3
            const thirdTestItem = testList[thirdId - 1]
            return ShoppingService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                       id: thirdId,
                       name: thirdTestItem.name,
                       price: thirdTestItem.price,
                       date_added: thirdTestItem.date_added,
                       checked: thirdTestItem.checked,
                       category: thirdTestItem.category
                     })
                   })    
        })
        it(`deleteItem() with id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingService.deleteItem(db, itemId)
                .then(() => ShoppingService.getAllItems(db))
                .then(allItems => {
                const expected = testList.filter(item => item.id !== itemId)
                expect(allItems).to.eql(expected)
                })
            })
    it(`updateItem() with id 'shopping_list' table`, () => {
        const idToUpdate = 3
        const newItem = {
            name: 'updated name',
            price: 'updated price',
            date_published: new Date(),
            checked: false,
            category: 'updated category'
        }
        return ShoppingService.updateItem(db, idToUpdate, newItem)
            .then(() => ShoppingService.getById(db, idToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idToUpdate,
                    ...newItem,
                })
            })
    })
})

context(`Given 'Shopping_List' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
        return ShoppingService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
    })

    it(`insertItem() with an 'id'`, () => {
        const newItem = {
            name: 'Test name',
            price: 1.00,
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: false,
            category: 'Main'
        }
        return ShoppingService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: newItem.date_added,
                    checked: newItem.checked,
                    category: newItem.category,
                })
            })
    })
})
})