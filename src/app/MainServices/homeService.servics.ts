
import { Injectable } from '@angular/core';
import { BaseCrudService } from '../Shared/BaseCrudService.services';
import { Home } from '../FiltersModels/home/home';


@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseCrudService<Home> {
  override serviceName: string = 'HomeService';

  override getUrlSegment(): string {
    return  this.urlService.URLS.NEWS;
  }


}
