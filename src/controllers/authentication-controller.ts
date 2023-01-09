import authenticationService, { SignInParams } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function singInByGitHub(req: Request, res: Response) {
  const { code } = req.params;
  try {
    const response = await exchangeCodedForAccessToken(code);
    console.log("res.send token :", response);
    return res.send(response);
  } catch (error) {
    console.log("error :", error);
  } 
}

export async function exchangeCodedForAccessToken(code: string) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const body = {
    code,
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  };

  const { data } = await axios.post("https://github.com/login/oauth/access_token", body, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  const urlParams = new URLSearchParams(data);
  const params = Object.fromEntries(urlParams);

  return params;
}

export async function getUserDataFromGitHub(req: Request, res: Response) {
  const { token } = req.params;
  console.log("token :", token);

  try{
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("userData :", response.data);
    return res.status(httpStatus.OK).send(response.data);
  } catch(err) {
    console.log("err catch getUSerDataFromGitHub :", err);
    return res.status(httpStatus.UNAUTHORIZED);
  }
}
