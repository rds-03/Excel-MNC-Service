import { Router } from "express"
import {
  createTemplateController,
  getAllEmailTemplatesController,
  getEmailTemplateController,
} from "../controllers/template"

const router = Router()
router.get("/", getAllEmailTemplatesController)
router.get("/:templateName", getEmailTemplateController)
router.post("/", createTemplateController)

export { router as templateRouter }
