import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('*', cors());

  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;
    console.log(imageUrl)
    const urlRegex = RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

    if(imageUrl && imageUrl.length > 0 && urlRegex.test(imageUrl)) {
      let imagePath = await filterImageFromURL(imageUrl);
      res.on('finish', () => {
        deleteLocalFiles([imagePath]);
      })
      res.sendFile(imagePath);
    } else {
      res.status(400).send({
        message: 'The informed URL is not valid'
      })
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();