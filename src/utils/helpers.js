import { base64regex } from "./constants.js";

// checks if string is base64 encoded
export const isImageValid = str => base64regex.test(str);   