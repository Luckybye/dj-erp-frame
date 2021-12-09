import {common} from '@/lib/fields/sup';
export let filename = {
  cn: '供应商',
  en: 'Supplier',
}

let pCn = {}
let pEn = {}
let handlerProdFields = () => {
  for (let i = 0; i < common.length; i++) {
    const m = common[i];
    pCn[m.id] = m.text
    pEn[m.id] = m.text_en
  }
}
handlerProdFields()

export let cn = {
  ...pCn,
}
export let en = {
  ...pEn,
}