import { v2 as cloudinary } from 'cloudinary';
import utils from './Utils'
cloudinary.config({
  cloud_name: utils.CLOUDNAME,
  api_key: utils.API_KEY,
  api_secret: utils.API_SECRET,
});

module.exports = cloudinary;