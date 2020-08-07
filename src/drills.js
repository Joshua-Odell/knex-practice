require('dotenv').config()
const knex = require('knex')

const knexInstance = knex ({
    client: 'pg',
    connection: process.env.DB_URL
})

function allTextItems(searchTerm){
    knexInstance
        .select('id', 'name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function paginatedItems(pageNumber){
    const itemsPerPage = 6
    const offset = itemsPerPage * (pageNumber -1)
    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })

}

function addedAfter (daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

function totalCost(){
    knexInstance
        .select('category')
        .from('shopping_list')
        .sum('price')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}



allTextItems('host')
paginatedItems(1)
addedAfter(3)
totalCost()
