import { Component } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import * as _ from 'lodash';

@Component({
  selector: 'app-st-table-column-toggler',
  templateUrl: './st-table-column-toggler.component.html',
  styles: [
    `
    :host{
      display:block;
    }
    `
  ]
})
export class StTableColumnTogglerComponent {

  selected: Array<string> = [];
  operatingSelected: Array<string> = [];
  nodes: Array<any> = [];
  isVisible = false;
  private st?: STComponent;
  private visibleColumns: { [key: string]: boolean } = {};
  private columnsMap = new Map<string, STColumn>();
  private columnBackup?: STColumn[];
  private readonly relationshipMapOfChildToParent = new Map<string, string>();// key:child index,value:parent index
  private readonly relationshipMapOfParentToChild = new Map<string, Array<string>>();// key:parent index,value:child index []
  constructor() { }

  ngOnInit(): void {
  }

  startup(option: {
    table: STComponent,
    columns: STColumn[]
  }): void {
    this.st = option.table;
    this.columnBackup = _.cloneDeep(option.columns);
    this.nodes = this.generateSelectNodes(option.columns);
    this.analyzeColumnsInfo(option.columns);
  }

  settingColumn() {
    this.isVisible = true;
  }

  onCancel() {
    this.isVisible = false;
  }

  onConfirm() {
    this.isVisible = false;
    let cols: Array<string> = [];
    this.selected = this.operatingSelected;
    // 如果父列被选上,选上全部子列
    this.selected.forEach((k) => {
      this.getSubColumns(k, cols);
    });

    const map: { [key: string]: boolean } = {};
    cols.forEach((k) => this.traceColumnVisible(k, map));
    const keys = Object.keys(this.visibleColumns);
    keys.forEach(k => {
      this.visibleColumns[k] = map[k] ? true : false;
    });
    this.refreshColumns();
  }

  onSelectedChange(selected: Array<string>) {
    this.operatingSelected = selected;
  }

  toggleColumnVisible(key: string, visible?: boolean): void {
    const originVisible = this.visibleColumns[key];
    visible = typeof visible === 'undefined' ? (!originVisible) : visible;
    this.visibleColumns[key] = visible;
    this.refreshColumns();
  }

  private traceColumnVisible(key: string, containers: { [key: string]: boolean }): void {
    containers[key] = true;
    if (this.relationshipMapOfChildToParent.has(key)) {
      this.traceColumnVisible(this.relationshipMapOfChildToParent.get(key) as any, containers);
    }
  }

  private getSubColumns(k: string, container: Array<string>): void {
    container.push(k);
    if (this.relationshipMapOfParentToChild.has(k)) {
      const children = this.relationshipMapOfParentToChild.get(k);
      children?.forEach((ck) => this.getSubColumns(ck, container));
    }
  }

  private generateSelectNodes(cols: STColumn[]): Array<any> {
    const traceNode = (col: STColumn) => {
      let visible = true;
      const key = col.index as string;
      if (typeof col.iif === 'function') {
        visible = col.iif(col);
      }
      const children: Array<any> = [];
      if (col.children?.length) {
        col.children.forEach(c => children.push(traceNode(c)));
      }
      const nc: any = { title: col.title, key: key, value: key };
      if (children.length < 1) {
        nc.isLeaf = true;
      } else {
        nc.children = children;
      }
      if (visible) {
        this.selected.push(key);
      }

      return nc;
    }
    const nodes: Array<any> = [];
    cols.forEach(c => {
      const nc = traceNode(c);
      if (nc) {
        nodes.push(nc);
      }
    });
    return nodes;
  }

  private analyzeColumnsInfo(cols: STColumn[]): void {
    const traceColumn = (col: STColumn) => {
      this.columnsMap.set(col.index as string, col);
      col.key = col.index as any;
      this.visibleColumns[col.index as any] = true;
      if (col.children?.length) {
        col.children.forEach(c => {
          this.relationshipMapOfChildToParent.set(c.index as string, col.index as string);
          traceColumn(c);
        });
        this.relationshipMapOfParentToChild.set(col.index as string, col.children.map(c => c.index as string));
      }
    }
    cols.forEach(c => {
      traceColumn(c);
    });
  }

  private generateColumns(col: STColumn): STColumn | null {
    const key = col.index as string;
    if (!this.visibleColumns[key]) { return null; }
    const children: STColumn[] = [];
    col.children?.forEach(c => {
      const nc = this.generateColumns(c);
      if (nc) {
        children.push(nc);
      }
    });
    if (children.length) {
      col.children = children;
    } else {
      delete col.children;
    }
    return col;
  }

  private refreshColumns(): void {
    const columns: STColumn[] = [];
    this.columnBackup?.forEach(c => {
      const nc = this.generateColumns(_.cloneDeep(c));
      if (nc) {
        columns.push(nc);
      }
    });
    this.st!.columns = columns;
    this.st!.resetColumns({ emitReload: false });
  }

}
