/* eslint-disable */
import {notes} from '@/lib/sys-note'
export default function (Cache) {
  let dataCache = new Cache('/api/direct?url=' + window.encodeURIComponent('/api/b2b/querySysNote'))
  dataCache.fnPretty = function () {
    let datas = this.preDatas.sys_notes || []
    let notesMap = notes._object('note_code')
    this.datas = datas.map(m => {
      let {note_code, note_id, note_name, note_name_en, remark} = m
      let v = notesMap[note_code] || {}
      let filter = [v.source, note_name, note_name_en, remark, note_code, v.path].join('~')
      note_name = [v.source, note_name].join('-')
      note_name_en = [v.source, note_name_en].join('-')
      return {
        ...v,
        note_code, note_id, note_name, note_name_en, remark,
        filter
      }
    })
    this.datas.sort((a, b) => b.source > a.source ? -1 : 1)

  }

  function getSysNotes (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }


  return {
    getSysNotes
    // init: dataCache.getValue.bind(dataCache)
  }
}