import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  ];
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

}
