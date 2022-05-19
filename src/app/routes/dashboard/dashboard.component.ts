import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { StTableColumnTogglerComponent } from '../st-table-column-toggler/st-table-column-toggler.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .buttons{
      display:flex;
    }

    .btn{
        margin-right:10px;
      }
    `
  ]
})
export class DashboardComponent implements OnInit {

  searchValue?: string;
  @ViewChild('st', { static: true }) private readonly st!: STComponent;
  @ViewChild('toggler', { static: true }) private readonly toggler!: StTableColumnTogglerComponent;
  columns: STColumn[] = [
    // { title: '编号', index: 'id' },
    // { title: '姓名', index: 'name' },
    // {
    //   title: '年龄',
    //   index: 'age',
    //   children: [
    //     { title: '列 1', className: 'text-center text-truncate', width: '120px', index: 'c1' },
    //     { title: '列 2', className: 'text-center text-truncate', width: '120px', index: 'c2' }
    //   ]
    // }

    { title: '行政区', index: 'area', className: 'text-center text-truncate', width: '120px' },
    { title: '乡镇', index: 'street', className: 'text-center text-truncate', width: '120px' },
    { title: '行政村名称', index: 'village', className: 'text-center text-truncate', width: '120px' },
    {
      title: '就地处理设施总数',
      index: 'zzz',
      children: [
        { title: '就地处理设施数量', className: 'text-center text-truncate', width: '120px', index: 'total' },
        { title: '农户数', className: 'text-center text-truncate', width: '120px', index: 'dealHousehold' },
        {
          title: '按处理能力',
          index: 'aa',
          children: [
            { title: '≥50t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility50' },
            { title: '50t>N≥20t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility20To50' },
            { title: '5t≤N<20t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility5To20' },
            { title: '<5t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility5' },
          ],
        },

        {
          title: '按处理工艺',
          index: 'ff',
          children: [
            { title: 'MBR', className: 'text-center text-truncate', width: '120px', index: 'MBR' },
            { title: 'A2O', className: 'text-center text-truncate', width: '120px', index: 'A2O' },
            { title: '生化滤池', className: 'text-center text-truncate', width: '120px', index: 'swlv' },
            { title: '接触氧化', className: 'text-center text-truncate', width: '120px', index: 'jcyh' },
            { title: '土壤渗透', className: 'text-center text-truncate', width: '120px', index: 'trsl' },
            { title: '人工湿地', className: 'text-center text-truncate', width: '120px', index: 'rgsd' },
          ],
        },
        {
          title: '按出水标准',
          index: 'mm',
          children: [
            { title: '1.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard1' },
            { title: '2.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard2' },
            { title: '3.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard3' },
          ],
        },
        {
          title: '纳管设施情况',
          index: 'hhh',

          children: [
            { title: '农户数', className: 'text-center text-truncate', width: '120px', index: 'dealCount' },
            { title: '终端提升泵站数量', className: 'text-center text-truncate', width: '120px', index: 'pumpCount' },
            { title: '官网长度', className: 'text-center text-truncate', width: '120px', index: 'pipeLength' },
            {
              title: '按处理能力',
              index: '4',
              children: [
                { title: '>=100t', className: 'text-center text-truncate', width: '120px', index: 'volume100' },
                { title: '100t>N>=50t', className: 'text-center text-truncate', width: '120px', index: 'volume50To100' },
                { title: '50t<=N<50t', className: 'text-center text-truncate', width: '120px', index: 'volume5To50' },
                { title: '<5t', className: 'text-center text-truncate', width: '120px', index: 'volume5' },
              ],
            },
            { title: '污水去向', className: 'text-center text-truncate', width: '120px', index: 'direction' },
          ],
        },
      ],
    },
  ];
  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.toggler.startup({ table: this.st, columns: this.columns });
  }

  toggleAreaColumnVisible() {
    this.toggler.toggleColumnVisible('area');
  }

  showAreaColumn() {
    this.toggler.toggleColumnVisible('area', true);
  }

  hideAreaColumn() {
    this.toggler.toggleColumnVisible('area', false);
  }
}
