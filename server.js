/* 
    ~ We first import the express and cors middleware.
    ~ We also import movie.route.js which is a separate file we will create later to store our routes.

 */
import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'

//We then create the server with:
const app = express()

/* 
        * express.json is the JSON parsing middleware to enable the server to read and accept JSON in a request’s body.
        * We attach the cors and express.json middleware that express will use with:
        * The use function registers a middleware with our Express app
    */
app.use(cors())
app.use(express.json())/* the express.json() middleware let’s us retrieve data from a request via the body attribute
Without this middleware, data retrieval would be much more difficult */

//We then specify the initial routes:
/* 
- general convention for API urls is to begin it with: /api/<version number>
- since our API is about movies, the main URL for our app will be i.e. localhost:5000/api/v1/movies
- The subsequent specific routes are specified in the 2nd argument movies
*/
app.use("/api/v1/movies", movies)

 //If someone tries to go to a route that doesn't exist, the wild card route app.use(‘*’) returns a
app.use('*', (req,res)=>{
 res.status(404).json({error: "not found"})
})

//We then export app as a module so that other files can import it
export default app
