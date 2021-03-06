import axios from 'axios';
//cloudinary-service
// AXIOS
export const uploadImg = async (file) => {
  // Defining our variables
  const UPLOAD_PRESET = 'gxmzvuyc' // Insert yours
  const CLOUD_NAME = 'wordchained' // Insert yours
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const FORM_DATA = new FormData();
  // Building the request body
  FORM_DATA.append('file', file)
  FORM_DATA.append('folder', 'free-chat-img-msgs');
  FORM_DATA.append('upload_preset', UPLOAD_PRESET)
  // Sending a post method request to Cloudniarys' API
  try {
    const res = await axios.post(UPLOAD_URL, FORM_DATA)
    return res.data;
  } catch (err) {
    console.log('Error on img upload service =>', err)
  }
}