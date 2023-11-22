import {Router} from 'express'
 import { generateCertificates } from '../controllers/certificate'; 
const route = Router();
import multer from 'multer';
const upload = multer({ dest: "certificates/" });
// route.post("/", handleFile);
route.post("/", upload.single("template"), generateCertificates);

export { route as certificateRouter}