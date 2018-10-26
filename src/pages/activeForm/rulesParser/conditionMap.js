import * as Const from './parseConst'
const conditionMap = new Map()
conditionMap.set(Const.IsNotNull, v => v !== null && v !== '')
conditionMap.set(Const.IsNull, v => v === null || v === '')
conditionMap.set(Const.GreaterThan, (a, b) => {
    debugger
    if(typeof a === 'undefined' || typeof b === 'undefined' || a === '' || b==='') return true
    if (/^[0-9]+\.?[0-9]*$/.test(a)) return a > b
    return a.toISOString() > b.toISOString()
})
conditionMap.set(Const.GreaterAndEqual, (a, b) => {
    if(typeof a === 'undefined' || typeof b === 'undefined' || a === '' || b==='') return true
    if (typeof a === 'number') return a >= b
    return a.toISOString() >= b.toISOString()
})
conditionMap.set(Const.Disabled, (fromData, key, disabled) => {
   let item = fromData.find(x=>x.key === key)
   item.settings.disabled = !disabled
})
conditionMap.set(Const.UnDisabled, (fromData, key, disabled) => {
    let item = fromData.find(x=>x.key === key)
    item.settings.disabled = disabled
})
conditionMap.set(Const.Clear, (containers, key) => {
    containers.forEach(c => {
        if(Object.keys(c.formModel).includes(key)){
            c.formModel[key] = ''
            return
        }
    })
})
conditionMap.set(Const.NotIn, (v, collections) => collections.indexOf(v) === -1)
export default conditionMap
