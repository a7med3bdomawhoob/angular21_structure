
import { Injectable } from '@angular/core';
import { BaseCrudService } from '../Shared/shared-services';
import { Home } from '../FiltersModels/home/home';


@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseCrudService<Home> {
  override serviceName: string = 'HomeService';

  override getUrlSegment(): string {
    return "this.urlService.URLS.Add_USER";
  }
     getUrlSegmentFeedbackPages(): string {
    return "this.urlService.URLS.GET_ALL_GLOPAL_LOOKUP";
  }


}
