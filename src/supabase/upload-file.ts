import dotenv from "dotenv";
import CustomError from "../errors/customError";
import codes from "../errors/codes";
import { supabase } from ".";
dotenv.config({ path: "./.env" });

export async function uploadFile(file: any, fileName: string) {
  console.log(fileName, file);
  const { data, error } = await supabase.storage.from("in-ao").upload("img.png", file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    throw new CustomError(codes.BAD_REQUEST, error.message);
  }
  console.log("data", data);
}
