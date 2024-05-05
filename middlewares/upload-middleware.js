import multer from "multer";
import path from "path";
import fs from "fs";

// storage engine
const storage = multer.diskStorage({
  //destination: './upload/images',
  destination: (req, file, cb) => {
    const username = req.body.name;
    //console.log(username,file);

    const destinationFolder = path.join(process.cwd(), `uploads/${username}`);

    // Create the folder if it doesn't exist
    fs.mkdirSync(destinationFolder, { recursive: true });

    //const destinationPath = `./uploads/${username}/`;
    return cb(null, destinationFolder); // Set the destination path dynamically
  },
  filename: (req, file, cb) => {
    let name = req.body.name;
    //console.log(file);
    return cb(null, `${name}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
