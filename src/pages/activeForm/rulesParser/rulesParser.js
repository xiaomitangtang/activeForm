import ConditionMap from "./conditionMap";
import * as Const from "./parseConst";
export default class RuleParser {
  /**
   * @param {规则集合} ruleData
   * @param {表单元素集合} form
   */
  constructor(ruleData, formData) {
    this.ruleData = ruleData;
    this.formData = formData;
  }

  /**
   * 规则解析
   */
  rules() {
    let rules = [];
    this.ruleData.forEach(rule => {
      let arranges = rule.expression.trim().split(" ");
      let pattren = /(.+)=@(.+){(.*)}/;
      arranges.forEach(arrange => {
        let condition = {};
        if (pattren.test(arrange))
          condition = {
            key: RegExp.$1,
            expression: RegExp.$2,
            other: RegExp.$3
          };
        let actions = this.actionProcess(rule.actions);
        let itemRule = { condition, actions, msg: rule.errormsg };
        rules.push(itemRule);
      });
    });
    return rules;
  }

  /**
   * 副作用处理
   * @param {副作用表达式} actionExpressions
   */
  actionProcess(actionExpressions) {
    let pattrens = [
      [/(.+)=@MustBe{@(.+){}}/, 2],
      [/(.+)=@MustBe{@([a-zA-Z]+){&(.+)}}/, 3],
      [/(.+)=@(.+){}/, 4]
    ];
    let actions = [];
    pattrens.forEach(p => {
      let expressions = actionExpressions.split(" ");
      for (let actionExpression of expressions) {
        let match = p[0].test(actionExpression);
        if (match) {
          if (p[1] === 2) {
            let subAction = { key: RegExp.$1, expression: RegExp.$2 };
            actions.push(subAction);
            return;
          }
          if (p[1] === 3) {
            let subAction = {
              key: RegExp.$1,
              other: RegExp.$3,
              expression: RegExp.$2
            };
            actions.push(subAction);
            return;
          }
          if (!actionExpressions.includes("MustBe") && p[1] === 4) {
            let subAction = { key: RegExp.$1, expression: RegExp.$2 };
            actions.push(subAction);
            return;
          }
        }
      }
    });
    return actions;
  }

  /**
   * 获取容器中时时KV值
   * @param {容器} containers
   */
  getEntitys(containers) {
    let objs = [];
    containers.forEach(c => objs.push(c.formModel));
    let res = Object.assign({}, ...objs);
    return res;
  }

  /**
   * 显示效果
   * @param {vue实例对象} that
   * @param {当前项} item
   * @param {验证结果} valid
   * @param {回掉函数} callback
   */
  afterEffect(expression, that, item, value, valid, errMsg, callback) {
    if (!Const.CANTIPOPTS.includes(expression)) {
      if (!valid) {
        item.errMsg = errMsg;
        that.$emit("addError", { value, item });
        callback(new Error(""));
      } else {
        that.$emit("removeError", { value, item });
        callback();
      }
    } else {
      callback();
    }
  }

  /**
   * 显示效果
   * @param {vue实例对象} that
   * @param {当前项} item
   * @param {验证结果} valid
   * @param {回掉函数} callback
   */
  beforeEffect(expression, that, item, value, valid, errMsg, callback) {
    item.errMsg = errMsg;
    if (!Const.CANTIPOPTS.includes(expression)) {
      that.$emit(valid ? "removeError" : "addError", {
        value,
        item
      });
      !valid ? callback(new Error()) : callback();
    } else {
      that.$emit(!valid ? "removeError" : "addError", {
        value,
        item
      });
      valid ? callback(new Error()) : callback();
    }
  }

  /**获取规则表达式集合
   * @param {规则标识} ruleKey
   */
  getExpressions(ruleKey) {
    let expressions = this.rules().filter(r => r.condition.key === ruleKey);
    return expressions.length > 0 ? expressions : null;
  }

  /**
   *
   * @param {值} value
   * @param {所属集} sets
   */
  notInAssert(value, sets) {
    return this.ConditionMap(Const.NotIn)(value, sets);
  }

  /**
   *  @param {值} value
   */
  isNotNullAssert(value) {
    return ConditionMap.get(Const.IsNotNull)(value);
  }

  /**
   *  @param {值} value
   */
  isNullAssert(value) {
    return ConditionMap.get(Const.IsNull)(value);
  }

  /**
   *  @param {值1} first
   *  @param {值2} second
   */
  greaterThanAssert(first, second) {
    return ConditionMap.get(Const.GreaterThan)(first, second);
  }

  /**
   *  @param {值1} first
   *  @param {值2} second
   */
  greaterThanEqualAssert(first, second) {
    return ConditionMap.get(Const.GreaterAndEqual)(first, second);
  }

  /**
   *
   * @param {数据源} formData
   * @param {作用键} key
   * @param {前置条件} perValid
   */
  disabledAssert(formData, key, perValid) {
    return ConditionMap.get(Const.Disabled)(formData, key, perValid);
  }

  /**
   *
   * @param {数据源} formData
   * @param {作用键} key
   * @param {前置条件} perValid
   */
  undisabledAssert(formData, key, perValid) {
    return ConditionMap.get(Const.UnDisabled)(formData, key, perValid);
  }

  /**
   *
   * @param {root} root
   * @param {作用键} key
   */
  clearAssert(root, key) {
    return ConditionMap.get(Const.Clear)(root, key);
  }

  /**
   *
   * @param {条件} condition
   * @param {元祖1} tuple1
   * @param {元祖2} tuple2
   * @param {元祖3} tuple3
   */
  executeValidator(condition, tuple1, tuple2, tuple3) {
    const map = new Map();
    map.set(Const.NotIn, this.notInAssert);
    map.set(Const.IsNull, this.isNullAssert);
    map.set(Const.IsNotNull, this.isNotNullAssert);
    map.set(Const.GreaterThan, this.greaterThanAssert);
    map.set(Const.GreaterAndEqual, this.greaterThanEqualAssert);
    map.set(Const.Disabled, this.disabledAssert);
    map.set(Const.UnDisabled, this.undisabledAssert);
    map.set(Const.Clear, this.clearAssert);
    try {
      return map.has(condition)
        ? map.get(condition)(tuple1, tuple2, tuple3)
        : ConditionMap.get(condition)(tuple1);
    } catch (error) {
      console.error("表达式有误哦");
    }
  }

  compulteProp1(expression, formData, entitys, key, panels) {
    if ([Const.Disabled, Const.UnDisabled].includes(expression))
      return formData;
    if ([Const.IsNotNull, Const.IsNull].includes(expression))
      return entitys[key];
    if (expression === Const.Clear) return panels;
    return entitys[key];
  }

  compulteProp2(expression, entitys, key, other) {
    if (Const.Clear === expression) return key;
    if ([Const.GreaterAndEqual, Const.GreaterThan].includes(expression))
      return Const.NUMBER_EXPRESSION.test(other) ? other : entitys[other];
    if ([Const.Disabled, Const.UnDisabled].includes) return key;
    return entitys[key];
  }

  /**
   * 处理副作用
   * @param {*} action
   * @param {*} formData
   * @param {*} entitys
   * @param {*} panels
   */
  executeAction(action, formData, entitys, panels, preValidResult) {
    let tuple1 = this.compulteProp1(
      action.expression,
      formData,
      entitys,
      action.key,
      panels
    );
    let tuple2 = this.compulteProp2(
      action.expression,
      entitys,
      action.key,
      action.other
    );
    return this.executeValidator(
      action.expression,
      tuple1,
      tuple2,
      preValidResult
    );
  }
}
