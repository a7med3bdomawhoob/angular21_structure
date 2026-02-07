import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { BaseCrudService } from '../shared-services';
import { filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { PaginationInfo } from '../pagination-info';
import { PaginationParams } from '../pagination-params';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { AlertService } from '../services/alert.service';
import { ConfirmationService } from '../services/confirmation.service';
import { TranslateService } from '@ngx-translate/core';
import { DIALOG_ENUM } from '../dialog-enum';
import { LANGUAGE_ENUM } from '../enums/language-enum';
import { ViewModeEnum } from '../enums/view-mode-enum';
import { PaginatorState } from '../interfaces/paginator.interface';
import { CustomValidators } from '../Validators/custom-validators';
import { PaginatedList } from '../paginated-list';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';//npm i primeng primeicons

import * as XLSX from 'xlsx';
import { isActiveOptionsAr, isActiveOptionsEn } from '../enums/options-status';



@Directive()
export abstract class BaseListComponent<
    Model,
    PopupComponent,
    TService extends BaseCrudService<Model, string | number>,
    FilterModel,
  >
  implements OnInit, OnDestroy
{
  abstract dialogSize: any;
  first: number = 0;
  rows: number = 10;
  destroy$: Subject<void> = new Subject<void>();

  paginationInfo: PaginationInfo = new PaginationInfo();
  // breadcrumbs: MenuItem[] = [];
   breadcrumbs: any[] = [];
  list: Model[] = [];
  paginationParams: PaginationParams = new PaginationParams();
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  langService = inject(LanguageService);
  confirmService = inject(ConfirmationService);
  alertsService = inject(AlertService);
  translateService = inject(TranslateService);
  declare selectedModel?: Model;
  declare statusOptionAr: { label: string; value: boolean }[];
  declare statusOptionEn: { label: string; value: boolean }[];
  declare isActiveOptions: { label: string; value: boolean }[];

  private old?: FilterModel;
  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home-page-review',
  };


  abstract get filterModel(): FilterModel;

  abstract set filterModel(val: FilterModel);

  abstract get service(): TService;

  abstract openDialog(nationality: Model): void;

  abstract initListComponent(): void;
  isSeachClick: boolean = false;
  openBaseDialog(
    popupComponent: PopupComponent,
    model: Model,
    viewMode: ViewModeEnum,

    lookups?: {
      [key: string]: any[];
    },
    IsStored: boolean = true
  ) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, lookups: lookups, viewMode: viewMode };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    dialogConfig.disableClose = true;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DIALOG_ENUM) => {
        if (result && result == DIALOG_ENUM.OK) {
          if (IsStored) {
            this.loadListSP().subscribe({
              next: (response) => this.handleLoadListSuccess(response),
              error: this.handleLoadListError,
            });
          } else {
            this.loadList().subscribe({
              next: (response) => this.handleLoadListSuccess(response),
              error: this.handleLoadListError,
            });
          }
        }
      });
  }

  openBaseDialogSP(
    popupComponent: PopupComponent,
    model: Model,
    viewMode: ViewModeEnum,
    lookups?: {
      [key: string]: any[];
    }
  ) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, lookups: lookups, viewMode: viewMode };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DIALOG_ENUM) => {
        if (result && result == DIALOG_ENUM.OK) {
          this.loadListSP().subscribe({
            next: (response) => this.handleLoadListSuccess(response),
            error: this.handleLoadListError,
          });
        }
      });
  }

  setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.setHomeItem();
    this.initBreadcrumbs();
    this.fillIsActiveOptions();
    this.list = this.activatedRoute.snapshot.data['list']?.list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list']?.paginationInfo;

    this.initListComponent();
    // Listen to language changes
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
      this.fillIsActiveOptions();
      this.listenToLanguageChanges();
    });
    this.loadStatusValues();
  }

  loadList(fromPageBtn: boolean = false, propToSearch?: string) {
    let model: any;

    if (fromPageBtn) {
      // Case 1: Paging clicked
      if (this.isSeachClick) {
        // Paging after search → use the "frozen" old filters
        model = this.old!;
      } else {
        // Paging without search → return empty filters
        model = {} as FilterModel;
        if (propToSearch) {
          const src: FilterModel = this.filterModel as FilterModel;
          const key = propToSearch as keyof FilterModel; // constrain to valid keys
          model[key] = src[key];
        }
        // if(propToSearch) model[propToSearch] = this.filterModel[propToSearch];
      }
    } else {
      // Case 2: Search clicked
      //Always use current filter model
      model = this.filterModel;

      // Keep a frozen copy for later paging
      this.old = Object.freeze({ ...this.filterModel });
    }
    // if(!this.old) this.filterModel = {} as FilterModel;
    return this.service.loadPaginated(this.paginationParams, { ...this.filterModel! });
  }

  loadListSP(fromPageBtn: boolean = false, propToSearch?: string) {
    let model: any;

    if (fromPageBtn) {
      // Case 1: Paging clicked
      if (this.isSeachClick) {
        // Paging after search → use the "frozen" old filters
        model = this.old!;
      } else {
        // Paging without search → return empty filters
        model = {} as FilterModel;
        if (propToSearch) {
          const src: FilterModel = this.filterModel as FilterModel;
          const key = propToSearch as keyof FilterModel; // constrain to valid keys
          model[key] = src[key];
        }
        // if(propToSearch) model[propToSearch] = this.filterModel[propToSearch];
      }
    } else {
      // Case 2: Search clicked
      //Always use current filter model
      model = this.filterModel;

      // Keep a frozen copy for later paging
      this.old = Object.freeze({ ...this.filterModel });
    }

    return this.service.loadPaginatedSP(this.paginationParams, { ...model });
  }

  loadListSPforExportExcel(
    allDataParams: any,
    filterKey?: keyof FilterModel,
    filterValue?: any,
    isStoredProcedure?: boolean
  ) {
    let model: any;

    // Case 1: Paging clicked
    if (this.isSeachClick) {
      // Paging after search → use the "frozen" old filters
      model = this.old!;
    } else {
      // Paging without search → return empty filters
      model = {} as FilterModel;
    }

    if (filterKey !== undefined && filterValue !== undefined && model[filterKey] == undefined) {
      model[filterKey] = filterValue as any;
    }

    if (isStoredProcedure) return this.service.loadPaginatedSP(allDataParams, { ...model });
    else return this.service.loadPaginated(allDataParams, { ...model });
  }

  search(isStoredProcedure: boolean = false) {
    this.isSeachClick = true;
    // if (isStoredProcedure) {
    //   this.old = { ...this.filterModel };
    // }
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    }
  }

  resetSearch(isStoredProcedure: boolean = false, filterModel?: FilterModel) {
    this.filterModel = filterModel ? filterModel : ({} as FilterModel);
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    }
  }

  onPageChange(event: PaginatorState, isStoredProcedure: boolean = false, propToSearch?: string) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    if (isStoredProcedure) {
      // if (this.isSeachClick) {

      //   this.old = { ...this.filterModel };
      // }
      // if (this.shallowEqual(this.old, this.filterModel)) this.isSeachClick = false;
      this.loadListSP(true, propToSearch).subscribe({
        next: (response) => {
          this.handleLoadListSuccess(response), this.scrollToTopPage();
        },

        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => {
          this.handleLoadListSuccess(response), this.scrollToTopPage();
        },
        error: this.handleLoadListError,
      });
    }
  }

  exportExcel(
    fileName: string = 'data.xlsx',
    isStoredProcedure: boolean = false,
    isSearchClicked: boolean = false,
    isFilterSend: boolean = false,
    filterKey?: keyof FilterModel,
    filterValue?: any
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
      sortDir: 'desc',
    };

    // if (this.isSeachClick == true) {
    //   this.old = { ...this.filterModel };
    //   this.filterModel = { ...this.old };
    // } else if (this.isSeachClick == false) {
    //   this.filterModel = { ...this.old! };
    // }

    // const fetchAll = isStoredProcedure
    //   ? this.service.loadPaginatedSP(allDataParams, { ...this.filterModel! })
    //   : this.service.loadPaginated(allDataParams, { ...this.filterModel! });
    this.isSeachClick = this.isSeachClick ?? true;
    this.loadListSPforExportExcel(
      allDataParams,
      filterKey,
      filterValue,
      isStoredProcedure
    ).subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length > 0) {
          const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
          const transformedData = fullList.map((item, index) =>
            this.mapModelToExcelRow(item, index)
          );
          const ws = XLSX.utils.json_to_sheet(transformedData); //npm install xlsx
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
      error: (_) => {
        this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
      },
    });
  }

  deleteModel(id: string | number, isStoredProcedure: boolean = false) {
    const dialogRef = this.confirmService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter((result) => {
          return result == DIALOG_ENUM.OK;
        })
      )
      .pipe(
        switchMap((_) => {
          return this.service.delete(id);
        })
      )
      .pipe(
        switchMap((_) => {
          return isStoredProcedure ? this.loadListSP() : this.loadList();
        })
      )
      .pipe(
        switchMap((response) => {
          if (response.list.length === 0) {
            this.paginationParams.pageNumber = 1;
            return isStoredProcedure ? this.loadListSP() : this.loadList();
          }
          return of(response);
        })
      )
      .subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
  }

  handleLoadListSuccess(response: PaginatedList<Model>) {
    this.list = response.list || [];

    if (response.paginationInfo) {
      this.paginationInfoMap(response);
    } else {
      this.paginationInfo.totalItems = this.list.length;
    }
  }

  handleLoadListError() {
    this.list = [];
    this.paginationInfo.totalItems = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  paginationInfoMap(response: PaginatedList<Model>) {
    const paginationInfo = response.paginationInfo;
    this.paginationInfo.totalItems = paginationInfo.totalItems || 0;
    this.paginationParams.pageSize = paginationInfo.pageSize || 10;
    this.paginationParams.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.paginationParams.pageSize;
    this.first = (this.paginationParams.pageNumber - 1) * this.paginationParams.pageSize;
  }

  protected abstract getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[];

  protected abstract mapModelToExcelRow(model: Model, index: number): { [key: string]: any };

  private initBreadcrumbs(): void {
    this.breadcrumbs = this.getBreadcrumbKeys().map((item) => ({
      label: item.labelKey,
      icon: item.icon,
      routerLink: item.routerLink,
    }));
  }
  // this for get option label everywhere in the app just pass statusvalue
  loadStatusValues() {
    this.statusOptionAr = isActiveOptionsAr;
    this.statusOptionEn = isActiveOptionsEn;
  }

  parentInit() {
    this.ngOnInit(); // This will call the parent's ngOnInit
  }

  fillIsActiveOptions() {
    this.isActiveOptions = [
      { label: this.langService.translateService.instant('COMMON.ACTIVE'), value: true },
      { label: this.langService.translateService.instant('COMMON.INACTIVE'), value: false },
    ];
  }
  // scrollToTopPage() {
  //   const table = document.querySelector('table');
  //   if (table) {
  //     const elementPosition = table.getBoundingClientRect().top + window.scrollY;
  //     const offset = window.innerHeight / 2 - table.offsetHeight / 2;
  //     window.scrollTo({
  //       top: elementPosition - offset,
  //       behavior: 'smooth',
  //     });
  //   }
  // }

  scrollToTopPage() {
    const table = document.querySelector('table');
    if (table) {
      const elementPosition = table.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  }

  // Shallow value check:
  shallowEqual(o1: any, o2: any): boolean {
    if (o1 && o2) {
      const keys1 = Object.keys(o1);
      const keys2 = Object.keys(o2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => o1[key] === o2[key]);
    } else return false;
  }

  protected listenToLanguageChanges(): void {
    // default no-op
  }
}
