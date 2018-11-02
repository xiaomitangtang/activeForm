import En from "@/languages/en";
import Zh from "@/languages/zh";
// import $ from "jquery";
const languages = {
  en: En,
  zh: Zh
};
/*async function aaa() {
  let en;
  try {
    en = await $.get("demol.json");
    console.log("en---------------------");
    console.log(en);
    languages.en = en;
  } catch (e) {
    console.log("en---------------------");
    console.log(en);
    languages.en = en;
  }
}
aaa();*/

export default languages;
