import fs from "fs";

export const contentOfFile = (file) => fs.readFileSync(file).toString();

export const contentOfBinaryFile = (file) => fs.readFileSync(file, "binary");

export const fileExists = (file) => fs.existsSync(file);
