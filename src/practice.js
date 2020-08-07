require('dotenv').config()
const knex = require('knex')

const knexInstance = knex ({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

knexInstance.from('amazong_products').select('*')
    .then(result => {
        //console.log(result)
    })

const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({ name: 'Point of view gun'})
    .first()
    .toQuery()
    // .then(result => {
    //     console.log(result)
    // })


function searchByProduceName(searchTerm){
    knexInstance
        .select('product_id', 'name', 'price','category')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

//searchByProduceName('holo')

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

//aginateProducts(2)

function getProductswithImages() {
    knexInstance
        .select('product_id', 'name', 'price', 'category', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then( result => {
            console.log(result)
        })
}

//getProductswithImages()

function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_dieo_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC'},
            { column: 'views', order: 'DESC'}
        ])
        .then(result => {
            console.log(result)
        })
}

mostPopularVideosForDays(30)