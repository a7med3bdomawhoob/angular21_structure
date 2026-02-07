import { Component, inject } from '@angular/core';
import { BaseListComponent } from '../../Shared/base-list/base-list.component';
import { Home } from '../../FiltersModels/home/home';
import { AboutUsComponent } from '../about-us-component/about-us-component';
import { HomeFilter } from '../../FiltersModels/home/home.filter';
import { HomeService } from '../../MainServices/homeService.servics';
import { ViewModeEnum } from '../../Shared/enums/view-mode-enum';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-component',
  imports: [TranslateModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent extends BaseListComponent<Home,AboutUsComponent,HomeService,HomeFilter>{
  override dialogSize: any;
homeService = inject(HomeService);
  filterModel: HomeFilter = new HomeFilter();
  override get service() {
    return this.homeService;
  }
  override openDialog(model: Home): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    // const lookups = { regions:null };
    this.openBaseDialog(AboutUsComponent as any, model, viewMode);
  }
  override initListComponent(): void {
   console.log("Bse Init ");
  }
  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'CITIES_PAGE.CITIES_LIST' }];
  }
  protected override mapModelToExcelRow(model: Home, index: number): { [key: string]: any; } {
    return {
      [this.translateService.instant('CITIES_PAGE.CITY_IN_ARABIC')]: model.address
    };
  }
  isLoggedIn = true;
}
