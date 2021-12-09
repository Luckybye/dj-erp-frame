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
          {part: 'packing'},
          {part: 'hs-code'},
          {part: 'easy-code'},
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
          {part: 'product-size'},
          {part: 'gross-profit'},
          {part: 'qty-unit'}
        ]},
        {span: '12', parts: [
          {part: 'loading-port'},
          {part: 'product-weight'},
          {part: 'pkg-details'}
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
