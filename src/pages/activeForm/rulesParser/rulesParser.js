export default class RuleParser {
    /**
     * @param {规则集合} ruleData 
     * @param {表单元素集合} form 
     */
    constructor(ruleData, formData) {
        this.ruleData = ruleData
        this.formData = formData
    }

    /**
     * 规则解析
     */
    rules() {
        let rules = []
        this.ruleData.forEach(rule => {
            let arranges = rule.expression.trim().split(' ')
            let pattren = /(.+)=@(.+){(.*)}/
            arranges.forEach(arrange => {
                let condition = {}
                if (pattren.test(arrange))  condition = { key: RegExp.$1, expression: RegExp.$2, other: RegExp.$3 }
                let actions = this.actionProcess(rule.actions)
                let itemRule = { condition, actions, msg:rule.errormsg }
                rules.push(itemRule)
            })
        })
        return rules
    }


    /**
     * 副作用处理
     * @param {副作用表达式} actionExpressions 
     */
    actionProcess(actionExpressions) {
        let pattrens = [
            [/(.+)=@MustBe{@(.+){}}/, 2],
            [/(.+)=@MustBe{@([a-zA-Z]+){&(.+)}}/, 3]
        ]
        let actions = []
        pattrens.forEach(p => {
            let expressions = actionExpressions.split(' ')
            expressions.forEach(actionExpression => {
                let match = p[0].test(actionExpression)
                if (match) {
                    if (p[1] === 2) { // 二元表达式
                        let subAction = { key: RegExp.$1, expression: RegExp.$2 }
                        actions.push(subAction)
                    }
                    if (p[1] === 3) { // 三元表达式 有返回值
                        let subAction = { key: RegExp.$1, other: RegExp.$3, expression: RegExp.$2 }
                        actions.push(subAction)
                    }
                }
            })
        })
        return actions
    }

    /**
     * 获取容器中时时KV值
     * @param {容器} containers 
     */
    getEntitys(containers) {
        let objs = []
        containers.forEach(c => objs.push(c.formModel))
        let res = Object.assign({}, ...objs)
        return res
    }
}

