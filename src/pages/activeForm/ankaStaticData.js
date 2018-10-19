export default {
  controlType: "container",
  children: [
    {
      child: {
        id: null,
        controlType: "tabs",
        title: "第一个",
        containers: [
          {
            text: "案件审查情况",
            container: {
              controlType: "container",
              children: [
                {
                  children: [
                    {
                      id: "TYYW_GG_AJJBXX__BMSAH",
                      controlType: "el-input",
                      label: "部门受案号",
                      value: null,
                      span: 24,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__BMSAH",
                      controlType: "el-input",
                      label: "部门受案号",
                      value: null,
                      span: 24,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__DJRQ",
                      controlType: "el-date-picker",
                      label: "调（收）卷日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__HJRQ",
                      controlType: "el-date-picker",
                      label: "还卷日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__SFTQBHRYJ",
                      controlType: "el-select",
                      label: "是否听取被害人意见",
                      value: null,
                      span: 24,
                      datasource: 151,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__SCYJ",
                      controlType: "el-select",
                      label: "审查意见",
                      value: null,
                      span: 24,
                      datasource: 312,
                      multiple: false,
                      options: null
                    }
                  ]
                }
              ]
            },
            more: true
          },
          {
            text: "出席法庭情况",
            container: {
              controlType: "container",
              children: [
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__BMSAH",
                      controlType: "el-input",
                      label: "部门受案号",
                      value: null,
                      span: 24,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__CTTZSSDRQ",
                      controlType: "el-date-picker",
                      label: "出庭通知书收到日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__CXTQHYRQ",
                      controlType: "el-date-picker",
                      label: "出席庭前会议日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__CTRQ",
                      controlType: "el-date-picker",
                      label: "出庭日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__CTZZRYLX",
                      controlType: "el-select",
                      label: "出庭作证人员类型",
                      value: null,
                      span: 12,
                      datasource: 311,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__YQSLJYRQ",
                      controlType: "el-date-picker",
                      label: "一次建议法院延期审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__HFSLJYRQ",
                      controlType: "el-date-picker",
                      label: "一次建议法院恢复审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__ECYQSLJYRQ",
                      controlType: "el-date-picker",
                      label: "二次建议法院延期审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__ECHFSJYJRQ",
                      controlType: "el-date-picker",
                      label: "二次建议法院恢复审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__FYZZISLRQ",
                      controlType: "el-date-picker",
                      label: "法院裁定全案中止审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__FYHFSL",
                      controlType: "el-date-picker",
                      label: "中止审理后恢复审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__FYZZSLRQ",
                      controlType: "el-date-picker",
                      label: "法院裁定全案终止审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_ESSS__LXSWHRQ",
                      controlType: "el-date-picker",
                      label: "列席审委会日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                }
              ]
            },
            more: false
          },
          {
            text: "裁判审查情况",
            container: {
              controlType: "container",
              children: [
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__BMSAH",
                      controlType: "el-input",
                      label: "部门受案号",
                      value: null,
                      span: 24,
                      datasource: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__ESCPSWHSDRQ",
                      controlType: "el-date-picker",
                      label: "收到二审裁判文书日期",
                      value: null,
                      span: 12,
                      datasource: null
                    },
                    {
                      id: "TYYW_GS_ESSS__ESCPRQ",
                      controlType: "el-date-picker",
                      label: "二审裁判日期",
                      value: null,
                      span: 12,
                      datasource: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__ESCPSWH",
                      controlType: "el-input",
                      label: "二审裁判文书文号",
                      value: null,
                      span: 12,
                      datasource: null
                    },
                    {
                      id: "TYYW_GS_ESSS__ESCPJG",
                      controlType: "el-select",
                      label: "二审裁判结果",
                      value: null,
                      span: 12,
                      datasource: 113,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__TQKSRQ",
                      controlType: "el-date-picker",
                      label: "提请抗诉日期",
                      value: null,
                      span: 12,
                      datasource: null
                    },
                    {
                      id: "TYYW_GS_ESSS__TQKSBGSWH",
                      controlType: "el-input",
                      label: "提请抗诉报告书文号",
                      value: null,
                      span: 12,
                      datasource: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__TQKSLYF",
                      controlType: "el-select",
                      label: "提请抗诉来源",
                      value: null,
                      span: 24,
                      datasource: 313,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_ESSS__TQKSLY",
                      controlType: "el-select",
                      label: "提请抗诉理由",
                      value: null,
                      span: 12,
                      datasource: 64,
                      multiple: false,
                      options: null
                    },
                    {
                      id: "TYYW_GS_ESSS__TQSXFHJDRQ",
                      controlType: "el-date-picker",
                      label: "提请死刑复核监督日期",
                      value: null,
                      span: 12,
                      datasource: null
                    }
                  ]
                }
              ]
            },
            more: false
          }
        ],
        more: true
      }
    },
    {
      child: {
        id: null,
        controlType: "tabs",
        title: "第二个",
        containers: [
          {
            text: "原审被告人/被申请人二审裁判情况",
            container: {
              controlType: "container",
              children: [
                {
                  children: [
                    {
                      id: "TYYW_GG_XYRJBXX__BMSAH",
                      controlType: "el-input",
                      label: "部门受案号",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GG_XYRJBXX__XYRBH",
                      controlType: "el-input",
                      label: "原审被告人编号",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GG_XYRJBXX__XM",
                      controlType: "el-input",
                      label: "姓名",
                      value: null,
                      span: 24,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__TQBHRYJRQ",
                      controlType: "el-date-picker",
                      label: "听取辩护人意见日期",
                      value: null,
                      span: 24,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__FYJDZZSLRQ",
                      controlType: "el-date-picker",
                      label: "法院裁定中止审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_XYRQK__ZZSLHHFRQ",
                      controlType: "el-date-picker",
                      label: "中止审理后恢复审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__FYCDZZSLRQ",
                      controlType: "el-date-picker",
                      label: "法院裁定终止审理日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_XYRQK__ESCPWSSDRQ",
                      controlType: "el-date-picker",
                      label: "二审裁判文书收到日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESPJRQ",
                      controlType: "el-date-picker",
                      label: "二审裁判日期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_XYRQK__ESPJSWH",
                      controlType: "el-input",
                      label: "二审裁判文书文号",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESCPJG",
                      controlType: "el-select",
                      label: "二审裁判结果",
                      value: null,
                      span: 12,
                      datasource: 0,
                      multiple: false,
                      options: null
                    },
                    {
                      id: "TYYW_GS_XYRQK__ESMSJE",
                      controlType: "el-input",
                      label: "二审没收金额",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESPJZM",
                      controlType: "el-select",
                      label: "二审判决罪名",
                      value: null,
                      span: 24,
                      datasource: 0,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESPJQTZM",
                      controlType: "el-select",
                      label: "二审判决其他罪名",
                      value: null,
                      span: 24,
                      datasource: 0,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESXGX",
                      controlType: "el-select",
                      label: "二审宣告刑（主刑)",
                      value: null,
                      span: 12,
                      datasource: 0,
                      multiple: false,
                      options: null
                    },
                    {
                      id: "TYYW_GS_XYRQK__ESXGXXQ",
                      controlType: "el-input",
                      label: "二审判决刑期",
                      value: null,
                      span: 12,
                      datasource: 0
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESHXKYQ",
                      controlType: "el-input",
                      label: "二审缓刑考验期",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_XYRQK__ESFJXQK",
                      controlType: "el-select",
                      label: "二审附加刑类型",
                      value: null,
                      span: 12,
                      datasource: 0,
                      multiple: false,
                      options: null
                    }
                  ]
                },
                {
                  children: [
                    {
                      id: "TYYW_GS_XYRQK__ESFJXJTQK",
                      controlType: "el-input",
                      label: "二审附加刑具体情况",
                      value: null,
                      span: 12,
                      datasource: 0
                    },
                    {
                      id: "TYYW_GS_XYRQK__XFZXZDJZXCS",
                      controlType: "el-select",
                      label: "刑罚执行中的禁止性措施",
                      value: null,
                      span: 12,
                      datasource: 0,
                      multiple: false,
                      options: null
                    }
                  ]
                }
              ]
            },
            more: false
          }
        ],
        more: false
      }
    }
  ],
  header: { id: "100000181", name: "二审上述审查、出庭及裁判情况" }
};
