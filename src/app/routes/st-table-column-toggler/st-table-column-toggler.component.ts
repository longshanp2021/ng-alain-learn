import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { deepCopy } from '@delon/util';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { ModalButtonOptions } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-st-table-column-toggler',
  templateUrl: './st-table-column-toggler.component.html',
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class StTableColumnTogglerComponent {

  selected: Array<string> = [];
  operatingSelected: Array<string> = [];
  nodes: Array<any> = [];
  isVisible = false;
  footerOptions: Array<ModalButtonOptions> = [
    {
      label: '确定',
      type: 'primary',
      onClick: () => {
        this.onConfirm();
        this.isVisible = false;
      }
    }
  ];
  @ViewChild('tree', { static: true, read: NzTreeComponent })
  private readonly tree?: NzTreeComponent;
  private st?: STComponent;
  private visibleColumns: { [key: string]: boolean } = {};
  private disableColumns: { [key: string]: boolean } = {};
  private columnsMap = new Map<string, STColumn>();
  private columnBackup?: STColumn[];
  private currentColumns?: STColumn[];
  private readonly relationshipMapOfChildToParent = new Map<string, string>(); // key:child index,value:parent index
  private readonly relationshipMapOfParentToChild = new Map<string, Array<string>>(); // key:parent index,value:child index []
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  startup(option: { table: STComponent; columns: STColumn[], visibles?: { [key: string]: boolean } }): void {
    this.st = option.table;
    this.columnBackup = deepCopy(option.columns);
    this.generateSelectNodes(option.columns);
    this.analyzeColumnsInfo(option.columns);
    if (option?.visibles) {
      this.toggleColumnsVisible(option.visibles);
    }

    this.selected = Object.keys(this.visibleColumns).filter(k => this.visibleColumns[k]);
  }

  settingColumn() {
    this.isVisible = true;
  }

  onCancel() {
    this.isVisible = false;
  }

  onConfirm() {
    const visibleColumnsStr = JSON.stringify(this.visibleColumns);
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
    keys.forEach((k) => {
      this.visibleColumns[k] = map[k] ? true : false;
    });
    if (JSON.stringify(this.visibleColumns) === visibleColumnsStr) { return; }
    this.refreshColumns();
    this.selected = this.operatingSelected;
  }

  onSelectedChange(selected: Array<string>) {
    this.operatingSelected = selected;
  }

  toggleColumnVisible(key: string, visible?: boolean): void {
    const originVisible = this.visibleColumns[key];
    visible = typeof visible === 'undefined' ? !originVisible : visible;
    this.visibleColumns[key] = visible;
    this.disableColumns[key] = !visible;
    this.refreshColumns();
  }

  toggleColumnsVisible(visibles: { [key: string]: boolean }): void {
    const keys = Object.keys(visibles);
    keys.forEach((k) => {
      this.visibleColumns[k] = visibles[k];
      this.disableColumns[k] = !visibles[k];
    });
    this.cdr.markForCheck();
    this.refreshColumns();
  }

  getColumns(): STColumn[] {
    return this.currentColumns as any;
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

  private generateSelectNodes(cols: STColumn[]): void {
    const traceNode = (col: STColumn) => {
      // let visible = true;
      const key = col.index as string;
      // if (typeof col.iif === 'function') {
      //   visible = col.iif(col);
      // }
      const children: Array<any> = [];
      if (col.children?.length) {
        col.children.forEach((c) => children.push(traceNode(c)));
      }
      const nc: any = { title: col.title, key: key, value: key, disabled: this.disableColumns[key] };
      if (children.length < 1) {
        nc.isLeaf = true;
      } else {
        nc.children = children;
      }

      return nc;
    };
    const nodes: Array<any> = [];
    cols.forEach((c) => {
      const nc = traceNode(c);
      if (nc) {
        nodes.push(nc);
      }
    });

    const dcs = Object.keys(this.disableColumns);
    if (dcs.length) {
      this.selected = this.selected.filter(x => !this.disableColumns[x]);
    }
    this.nodes = nodes;
  }

  private analyzeColumnsInfo(cols: STColumn[]): void {
    const traceColumn = (col: STColumn) => {
      this.columnsMap.set(col.index as string, col);
      col.key = col.index as any;
      this.visibleColumns[col.index as any] = true;
      if (col.children?.length) {
        col.children.forEach((c) => {
          this.relationshipMapOfChildToParent.set(c.index as string, col.index as string);
          traceColumn(c);
        });
        this.relationshipMapOfParentToChild.set(
          col.index as string,
          col.children.map((c) => c.index as string),
        );
      }
    };
    cols.forEach((c) => {
      traceColumn(c);
    });
  }

  private generateColumns(col: STColumn): STColumn | null {
    const key = col.index as string;
    if (!this.visibleColumns[key]) {
      return null;
    }
    const children: STColumn[] = [];
    col.children?.forEach((c) => {
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
    this.currentColumns = [];
    this.columnBackup?.forEach((c) => {
      const nc = this.generateColumns(deepCopy(c));
      if (nc) {
        this.currentColumns!.push(nc);
      }
    });
    this.st!.columns = this.currentColumns;

    const dcs = Object.keys(this.disableColumns);
    if (dcs.length) {
      this.generateSelectNodes(this.columnBackup as any);
    }
    this.st!.resetColumns();
  }
}
