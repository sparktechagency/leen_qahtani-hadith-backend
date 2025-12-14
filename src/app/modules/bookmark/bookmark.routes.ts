import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.route("/:hadith")
    .post(
        BookmarkController.toggleBookmark
    );
  
router.get("/",
    BookmarkController.getBookmark
)
export const BookmarkRoutes = router;
