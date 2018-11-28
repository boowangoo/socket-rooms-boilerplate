import { Html } from "../types";

declare module '*html' {
    const content: Html;
    export default content;
}