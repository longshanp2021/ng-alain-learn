import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { StTableColumnTogglerComponent } from '../st-table-column-toggler/st-table-column-toggler.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: [
  ]
})
export class TestComponent implements OnInit {


  @ViewChild('st', { static: true }) private readonly st!: STComponent;
  @ViewChild('toggler', { static: true }) private readonly toggler!: StTableColumnTogglerComponent;
  columns: STColumn[] = [
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
          ],
        },
      ],
    },
  ];
  constructor() { }

  ngOnInit(): void {
    this.toggler.startup({ table: this.st, columns: this.columns });
  }

}
