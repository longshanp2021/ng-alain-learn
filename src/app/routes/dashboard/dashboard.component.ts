import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STColumn, STData } from '@delon/abc/st';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  searchValue?: string;
  users: STData[] = Array(10)
    .fill({})
    .map((_, idx) => {
      return {
        id: idx + 1,
        name: `name ${idx + 1}`,
        age: Math.ceil(Math.random() * 10) + 20
      };
    });
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '姓名', index: 'name', iif: () => this.isChoose('name') },
    { title: '年龄', index: 'age', iif: () => this.isChoose('age') }
    // {
    //   title: '自定义',
    //   renderTitle: 'customTitle',
    //   render: 'custom',
    //   iif: () => this.isChoose('custom'),
    // },
  ];
  customColumns = [
    { label: '姓名', value: 'name', checked: true },
    { label: '年龄', value: 'age', checked: true }
    // { label: '自定义', value: 'custom', checked: true },
  ];

  isChoose(key: string): boolean {
    console.log(this.customColumns);

    return !!this.customColumns.find(w => w.value === key && w.checked);
  }
}
