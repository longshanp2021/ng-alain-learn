import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// single pages
import { CallbackComponent } from './passport/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { RouteRoutingModule } from './routes-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { StTableColumnTogglerComponent } from './st-table-column-toggler/st-table-column-toggler.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

const COMPONENTS: Array<Type<void>> = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  StTableColumnTogglerComponent
];

@NgModule({
  imports: [SharedModule, NzTreeSelectModule, RouteRoutingModule],
  // imports: [SharedModule, NzTreeSelectModule, NzModalModule, RouteRoutingModule],
  declarations: COMPONENTS,
})
export class RoutesModule { }
