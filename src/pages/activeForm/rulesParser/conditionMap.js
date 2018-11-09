import * as Const from "./parseConst";

const NUMBER_EXPRESSION = /^[0-9]+\.?[0-9]*$/;
const conditionMap = new Map();
conditionMap.set(Const.IsNotNull, v => v !== null && v !== "");
conditionMap.set(Const.IsNull, v => v === null || v === "");
conditionMap.set(Const.GreaterThan, (a, b) => {
  if (
    typeof a === "undefined" ||
    typeof b === "undefined" ||
    a === "" ||
    b === ""
  )
    return false;
  if (NUMBER_EXPRESSION.test(a)) return a > b;
  if (a instanceof Date) return Number(a) > Number(b);
});
conditionMap.set(Const.GreaterAndEqual, (a, b) => {
  if (
    typeof a === "undefined" ||
    typeof b === "undefined" ||
    a === "" ||
    b === ""
  )
    return false;

  if (NUMBER_EXPRESSION.test(a)) return a >= b;
  if (a instanceof Date) return Number(a) >= Number(b);
});
conditionMap.set(Const.Disabled, (fromData, key) => {
  let item = fromData.find(x => x.key === key);
  item.settings.disabled = true;
  return true;
});
conditionMap.set(Const.UnDisabled, (fromData, key) => {
  let item = fromData.find(x => x.key === key);
  item.settings.disabled = false;
  return true;
});
conditionMap.set(Const.Clear, (containers, key) => {
  containers.forEach(c => {
    if (Object.keys(c.formModel).includes(key)) {
      c.formModel[key] = "";
      return;
    }
  });
  return true;
});
conditionMap.set(Const.NotIn, (v, collections) => !collections.includes(v));

export default conditionMap;
