import express from 'express';
import { addPostToUser } from '../controller/postController.js';
import { Postupload } from '../CloudinaryStorage/PostMulter.js';


const router = express.Router();

router.post('/create', Postupload.single("PostImage"), addPostToUser);

export default router;
