import { getUserDataFromGitHub, singInByGitHub, singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.get("/github/:code", singInByGitHub);
authenticationRouter.get("/github/signIn/:token", getUserDataFromGitHub);

export { authenticationRouter };
