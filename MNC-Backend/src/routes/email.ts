import { Router } from "express"
import { sendEmailFromRequestBodyController } from "../controllers/email"
import { sendEmailFromTemplateNameController } from "../controllers/template"

const router = Router()
router.post("/", sendEmailFromRequestBodyController)
router.post("/:templateName", sendEmailFromTemplateNameController)

export { router as emailRouter }
