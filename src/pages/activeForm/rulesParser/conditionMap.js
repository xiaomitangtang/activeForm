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

conditionMap.set(Const.Disabled, (fromData, key, perValid) => {
  let item = fromData.find(x => x.key === key);
  if (perValid) item.settings.disabled = true;
  return true;
});

conditionMap.set(Const.UnDisabled, (fromData, key, perValid) => {
  let item = fromData.find(x => x.key === key);
  if (perValid) item.settings.disabled = false;
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

conditionMap.set(Const.In, (v, collections) =>
  collections.split(",").includes(v)
);

conditionMap.set(
  Const.NotIn,
  (v, collections) => !collections.split(",").includes(v)
);

conditionMap.set(Const.Between, (v, collections) => {
  let value = Number(v);
  let range = collections.split(",");
  let mix = Number(range[0]);
  let max = Number(range[1]);
  return value > mix && value < max;
});

conditionMap.set(Const.BetweenEqual, (v, collections) => {
  debugger;
  let value = Number(v);
  let range = collections.split(",");
  let min = Number(range[0]);
  let max = Number(range[1]);
  return value >= min && value <= max;
});

conditionMap.set(Const.LessThan, (v, collections) => {
  let value = Number(v);
  let range = collections.split(",");
  let min = Number(range[0]);
  let max = Number(range[1]);
  return value >= min && value <= max;
});

conditionMap.set(Const.LessThanEqual, (a, b) => {
  if (
    typeof a === "undefined" ||
    typeof b === "undefined" ||
    a === "" ||
    b === ""
  )
    return false;

  if (NUMBER_EXPRESSION.test(a)) return a <= b;
  if (a instanceof Date) return Number(a) <= Number(b);
});

conditionMap.set(Const.LessThan, (a, b) => {
  if (
    typeof a === "undefined" ||
    typeof b === "undefined" ||
    a === "" ||
    b === ""
  )
    return false;

  if (NUMBER_EXPRESSION.test(a)) return a < b;
  if (a instanceof Date) return Number(a) < Number(b);
});

conditionMap.set();

export default conditionMap;
