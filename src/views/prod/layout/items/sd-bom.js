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
          {part: 'item-no'},
          {part: 'product-name'},
          {part: 'material'}
        ]},
        {span: '12', parts: [
          {part: 'cust-item-no'},
          {part: 'easy-code'},
          {part: 'hs-code'},
          {part: 'packing'},
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
          {part: 'shipping-date'}
        ]},
        {span: '12', parts: [
          {part: 'loading-port'},
          {part: 'cust-barcode'},
          {part: 'product-weight'},
          {part: 'qty-unit'}
        ]}
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
