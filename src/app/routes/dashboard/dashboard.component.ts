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
  value: any = [];
  nodes: Array<any> = [];
  visibleColumns: { [key: string]: boolean } = {};
  columnsMap = new Map<string, STColumn>();
  relationshipMapOfChildToParent = new Map<string, string>();// key:child index,value:parent index
  relationshipMapOfParentToChild = new Map<string, Array<string>>();// key:child index,value:parent index
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '姓名', index: 'name' },
    {
      title: '年龄',
      index: 'age',
      children: [
        { title: '列 1', className: 'text-center text-truncate', width: '120px', index: 'c1' },
        { title: '列 2', className: 'text-center text-truncate', width: '120px', index: 'c2' }
      ]
    }
  // @ViewChild('st', { static: true }) private readonly st!: STComponent;
  @ViewChild('toggler', { static: true }) private readonly toggler!: StTableColumnTogglerComponent;
  // columns: STColumn[] = [
  //   // { title: '编号', index: 'id' },
  //   // { title: '姓名', index: 'name' },
  //   // {
  //   //   title: '年龄',
  //   //   index: 'age',
  //   //   children: [
  //   //     { title: '列 1', className: 'text-center text-truncate', width: '120px', index: 'c1' },
  //   //     { title: '列 2', className: 'text-center text-truncate', width: '120px', index: 'c2' }
  //   //   ]
  //   // }

  //   { title: '行政区', index: 'area', className: 'text-center text-truncate', width: '120px' },
  //   { title: '乡镇', index: 'street', className: 'text-center text-truncate', width: '120px' },
  //   { title: '行政村名称', index: 'village', className: 'text-center text-truncate', width: '120px' },
  //   {
  //     title: '就地处理设施总数',
  //     index: 'zzz',
  //     children: [
  //       { title: '就地处理设施数量', className: 'text-center text-truncate', width: '120px', index: 'total' },
  //       { title: '农户数', className: 'text-center text-truncate', width: '120px', index: 'dealHousehold' },
  //       {
  //         title: '按处理能力',
  //         index: 'aa',
  //         children: [
  //           { title: '≥50t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility50' },
  //           { title: '50t>N≥20t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility20To50' },
  //           { title: '5t≤N<20t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility5To20' },
  //           { title: '<5t', className: 'text-center text-truncate', width: '120px', index: 'dealAbility5' },
  //         ],
  //       },

  //       {
  //         title: '按处理工艺',
  //         index: 'ff',
  //         children: [
  //           { title: 'MBR', className: 'text-center text-truncate', width: '120px', index: 'MBR' },
  //           { title: 'A2O', className: 'text-center text-truncate', width: '120px', index: 'A2O' },
  //           { title: '生化滤池', className: 'text-center text-truncate', width: '120px', index: 'swlv' },
  //           { title: '接触氧化', className: 'text-center text-truncate', width: '120px', index: 'jcyh' },
  //           { title: '土壤渗透', className: 'text-center text-truncate', width: '120px', index: 'trsl' },
  //           { title: '人工湿地', className: 'text-center text-truncate', width: '120px', index: 'rgsd' },
  //         ],
  //       },
  //       {
  //         title: '按出水标准',
  //         index: 'mm',
  //         children: [
  //           { title: '1.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard1' },
  //           { title: '2.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard2' },
  //           { title: '3.0版', className: 'text-center text-truncate', width: '120px', index: 'drainStandard3' },
  //         ],
  //       },
  //       {
  //         title: '纳管设施情况',
  //         index: 'hhh',

  //         children: [
  //           { title: '农户数', className: 'text-center text-truncate', width: '120px', index: 'dealCount' },
  //           { title: '终端提升泵站数量', className: 'text-center text-truncate', width: '120px', index: 'pumpCount' },
  //           { title: '官网长度', className: 'text-center text-truncate', width: '120px', index: 'pipeLength' },
  //           {
  //             title: '按处理能力',
  //             index: '4',
  //             children: [
  //               { title: '>=100t', className: 'text-center text-truncate', width: '120px', index: 'volume100' },
  //               { title: '100t>N>=50t', className: 'text-center text-truncate', width: '120px', index: 'volume50To100' },
  //               { title: '50t<=N<50t', className: 'text-center text-truncate', width: '120px', index: 'volume5To50' },
  //               { title: '<5t', className: 'text-center text-truncate', width: '120px', index: 'volume5' },
  //             ],
  //           },
  //           { title: '污水去向', className: 'text-center text-truncate', width: '120px', index: 'direction' },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.standardColumns(this.columns);
    this.nodes = this.generateSelectNodes(this.columns);
  }

  _generateSelectNodes(col: STColumn): any {
    const children: Array<any> = [];
    if (col.children?.length) {
      col.children.forEach(c => children.push(this._generateSelectNodes(c)));
    }
    const nc: any = { title: col.title, key: col.index, value: col.index };
    if (children.length < 1) {
      nc.isLeaf = true;
    } else {
      nc.children = children;
    }

    return nc;
  }

  generateSelectNodes(cols: STColumn[]): Array<any> {
    const nodes: Array<any> = [];
    cols.forEach(c => {
      // const nc = { title: c.title, key: c.index };
      const nc = this._generateSelectNodes(c);

      nodes.push(nc);
    });
    return nodes;
  }

  checkSelect(key: string): boolean {
    return this.visibleColumns[key] ? true : false;
  }

  traceColumn(col: STColumn): void {
    this.columnsMap.set(col.index as string, col);
    col.key = col.index as any;
    this.visibleColumns[col.index as any] = true;
    col.iif = () => this.checkSelect(col.index as string);
    if (col.children?.length) {
      col.children.forEach(c => {
        this.relationshipMapOfChildToParent.set(c.index as string, col.index as string);
        this.traceColumn(c);
      });
      this.relationshipMapOfParentToChild.set(col.index as string, col.children.map(c => c.index as string));
    }
  }

  standardColumns(cols: STColumn[]): void {
    cols.forEach(c => {
      this.traceColumn(c);
    });
  }

  traceColumnVisible(key: string, containers: { [key: string]: boolean }): void {
    containers[key] = true;
    if (this.relationshipMapOfChildToParent.has(key)) {
      this.traceColumnVisible(this.relationshipMapOfChildToParent.get(key) as any, containers);
    }
  }


  test(ks: Array<string>): void {
    console.log('ks:', ks);
    let selected: Array<string> = [];
    // 如果父列被选上,选上全部子列
    ks.forEach(k => {
      selected.push(k);
      if (this.relationshipMapOfParentToChild.has(k)) {
        const children = this.relationshipMapOfParentToChild.get(k);
        if (children?.length) {
          selected = selected.concat(children)
        }
      }
    });

    const map: { [key: string]: boolean } = {};
    selected.forEach(k => this.traceColumnVisible(k, map));

    console.log('map:', map);
    const keys = Object.keys(this.visibleColumns);
    keys.forEach(k => {
      this.visibleColumns[k] = map[k] ? true : false;
    });

    this.st.resetColumns({ emitReload: true });
    this.cd.markForCheck();
  }

  //     this.toggler.startup({ table: this.st, columns: this.columns });
  //   }

  // toggleAreaColumnVisible() {
  //   this.toggler.toggleColumnVisible('area');
  // }

  // ShowAreaColumn() {
  //   this.toggler.toggleColumnVisible('area', true);
  // }

  // HideAreaColumn() {
  //   this.toggler.toggleColumnVisible('area', false);
  // }
}
