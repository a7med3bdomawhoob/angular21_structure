import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { ServiceContract } from "./service-contract";
import { RegisterServiceMixin } from "./register-service-mixin";
import { BaseCrudServiceContract } from "./base-crud-service-contract";
import { OptionsContract } from "./options-contract";
import { catchError, map, Observable } from "rxjs";
import { ListResponseData } from "./list-response-data";
import { PaginationParams } from "./pagination-params";
import { PaginatedList } from "./paginated-list";
import { genericDateOnlyConvertor } from "./general-helper";
import { PaginatedListResponseData } from "./paginated-list-response-data";
import { UrlService } from "./services/url.service";


export abstract class BaseCrudService<Model, PrimaryKey = number>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<Model, PrimaryKey>, ServiceContract
{
  abstract serviceName: string;
  protected http = inject(HttpClient);

  abstract getUrlSegment(): string;
  protected urlService = inject(UrlService);


  load(options?: OptionsContract | undefined): Observable<Model[]> {
    return this.http
      .get<ListResponseData<Model>>(this.getUrlSegment(), {
        params: new HttpParams({
          fromObject: options as never,
        }),
        withCredentials: true,
      })
      .pipe(map((response) => response.data as Model[]))
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }


  loadPaginatedSP(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Model>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Model>>(
        this.getUrlSegment() + '/GetWithPagingSP',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      )
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }


  loadPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Model>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Model>>(
        this.getUrlSegment() + '/GetWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      )
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }



  create( model: Model): Observable<Model> {
    return this.http.post<Model>(this.getUrlSegment(), model, { withCredentials: true });
  }


  update( model: Model): Observable<Model> {
    return this.http.put<Model>(this.getUrlSegment(), model, { withCredentials: true });
  }


  delete(id: PrimaryKey): Observable<Model> {
    return this.http.delete<Model>(this.getUrlSegment() + '/' + id, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }


  getById(id: PrimaryKey): Observable<Model> {
    return this.http.get<Model>(this.getUrlSegment() + '/' + id, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }


}
