//First, we import app that we have previously created and exported in server.js.
import app from './server.js'
//We import mongodb to access our database
import mongodb from 'mongodb'
//and dotenv to access our environment variables.
import dotenv from 'dotenv'
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'

async function main() {
  dotenv.config()

  const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)
  const port = process.env.PORT || 8000
  try {//connect to the MongoDB cluster
    await client.connect()
    await MoviesDAO.injectDB(client)
    await ReviewsDAO.injectDB(client)

    app.listen(port, () => {
      console.log('server is running on port:' + port)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
main().catch(console.error)
