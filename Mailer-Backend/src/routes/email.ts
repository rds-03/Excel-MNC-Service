import { Router } from "express"
import { sendEmailFromRequestBodyController } from "../controllers/email"

const router = Router()
router.post("/", sendEmailFromRequestBodyController)

export { router as emailRouter }
