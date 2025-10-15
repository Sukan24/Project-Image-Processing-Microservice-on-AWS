import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

const app = express();
const port = process.env.PORT || 8082;

app.use(bodyParser.json());

app.get('/filteredimage', (req, res) => {
  const { image_url } = req.query;

  if (!image_url) {
    return res.status(400).send({ message: "The 'image_url' query parameter is required." });
  }

  filterImageFromURL(image_url)
    .then(filteredPath => {
      res.status(200).sendFile(filteredPath, () => {
        deleteLocalFiles([filteredPath]);
      });
    })
    .catch(error => {
      console.error("Image processing failed:", error);
      res.status(422).send({ message: "Unable to process the image. Please ensure the URL points to a valid image file." });
    });
});

app.get('/', (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});