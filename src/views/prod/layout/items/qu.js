/* eslint-disable */
export default [
  {
    title: '主卡',
    title_en: 'Main Info',
    parts: [
      [
        {span: '12', parts: [
          {part: 'photo'},
          {part: 'category'},
          {part: 'sell-item-no'},
          {part: 'product-name'},
          {part: 'material'},
          {part: 'packing'}
        ]},
        {span: '12', parts: [
          {part: 'qu-price'},
          {part: 'qu-quantity'},
          {part: 'cust-item-no'},
          {part: 'easy-code'},
          {part: 'hs-code'},
          {part: 'details'}
        ]}
      ]
    ]
  },
  {
    title: '副卡',
    title_en: 'Side Info',
    parts: [
      [
        {span: '12', parts: [
          {part: 'supplier'},
          {part: 'product-size'},
          {part: 'cust-po'},
          {part: 'qty-unit'}
        ]},
        {span: '12', parts: [
          {part: 'loading-port'},
          {part: 'cust-barcode'},
          {part: 'product-weight'}
        ]}
      ]
    ]
  },
  {
    title: '物流信息',
    title_en: 'Logistics Info',
    parts: [
      [
        {part: 'logistics-info', span: '24'}
      ]
    ]
  },
  {
    title: '海关信息',
    title_en: 'Custom Info',
    parts: [
      [
        {part: 'custom-info', span: '24'}
      ]
    ]
  }
]
