const express = require('express')
const {MongoClient} = require('mongodb').MongoClient
const mongoose = require("mongoose")
const multer = require('multer')
const path = require("path")
const fs = require("fs")
const File= require("./models/files")

const app = express()
const mongoUrl= 'mongodb+srv://jmurenguko:Accolade123@cluster0.3iilu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

app.use(express.json());

const upload = multer({ dest: "uploads" })

//setting up the ejs as view engine
app.set('view engine', 'ejs')

//to render the homepage
app.get('/', (req, res) =>{
    res.render('index')
})

//to render the uploading page
app.get('/share', (req,res) =>{
    res.render('share')
})

//to render the contact page
app.get('/contact', (req,res) =>{
    res.render('contact')
})


//connection to the database
mongoose.connect(mongoUrl)


//uploading the file via multer
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    
    // Handle other form fields
    const { name, email, about, level, typeEnseignement, section, cours } = req.body;
    
    const newFile = new File ({
        path: req.file.path,
        fileName: req.file.originalname,
        description: req.body.about,
        level: req.body.level,
        course: req.body.cours,
        edition: req.body.edition,
        typeEnseignement: req.body.typeEnseignement,
        section: req.body.section,
        uploaderName: req.body.name[0],
        email: req.body.name[1],
    })
    console.log(req.body, req.file)
    await newFile.save();
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during upload");
  }
})

//retrieving data from the database and passing it to the resources page

app.get('/resources', async (req,res) =>{
  var files= await File.find({})
  res.render('resources', {files})
})

//downloading a specific file using the id
app.get('/resources/:id', async(req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send('File not found');
    }

    // Set the appropriate content type header
    const mimeType = getMimeType(file.fileName);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);

    // Create a read stream from the file path
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Error downloading file');
  }
});

// Helper function to determine MIME type
function getMimeType(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    // Add more mime types as needed
  };
  return mimeTypes[extension] || 'application/octet-stream';
}




app.listen(5000)