import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentEntryModalComponent } from '../student-entry-modal/student-entry-modal.component';
import { Column, Editors, FieldType, Filters, Formatters, GridOption, OnEventArgs } from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { customDataFormatter } from 'src/app/formatter/customdataformatter';
import Swal from 'sweetalert2';
import { RoutingService } from 'src/app/services/routing.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {

  filteredStudents!: any[];
  selectedType!: string;
  selectedYear!: number;
  selectedClass!: string;

  selectedFilter1: string = 'primary';

  students: any[] = [];

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: any;
  isLoading: boolean = true;
  isFilterEnabled: boolean = false;
  gridObj: any;
  filterService: any;
  dataviewObj: any;

  selected = 'option2';
  isLazyLoading: boolean = true;


  constructor(public dialog: MatDialog, public http: HttpClient, private apiService: ApiService,
    private router: Router, public activatRoute: ActivatedRoute, private routeService: RoutingService,
    private _snackBar: MatSnackBar) {


    this.initializeGrid();
    if (this.angularGrid?.paginationService) {
      this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
    }

    this.prepareGrid();

    this.apiService.findAll().then((result: any) => {
      console.log("findAll", result);
      if (result.status === 'success') {
        for (let data of result['records']) {
          let newData: any = {};
          newData = data;
          newData['id'] = data['_id'];
          delete newData['_id'];
          this.students.push(newData)
        }
        this.applyFilters();
        this.dataset = this.students;
        this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
        this.isLoading = false;
        this.isLazyLoading = false;
      }
      else {
        Swal.fire("Fetching failed");
        this.isLoading = false;
        this.isLazyLoading = false;
        this.dataset = [];
      }
    });



  }

  openDialog() {
    const dialogRef = this.dialog.open(StudentEntryModalComponent, {
      data: {},
      width: '80%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '80vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.records?.ok === true && result?.status === "success") {
        let updatedId = result?.records?.id;
        this.apiService.findOne(updatedId).then((updatedRecord: any) => {

          if (this.angularGrid && updatedRecord && updatedRecord?.records && Object.keys(updatedRecord?.records)) {
            let newData: any = {};
            newData = updatedRecord?.records;
            newData['id'] = updatedRecord?.records['_id'];
            delete newData['_id'];
            this.angularGrid.dataView.beginUpdate();
            var value = this.angularGrid.dataView.getItemById(newData['id'])
            if (value) {
              this.angularGrid.dataView.updateItem(newData['id'], newData);
            } else {
              this.angularGrid.dataView.addItem(newData);
            }
            this.angularGrid.dataView.endUpdate();
            this.angularGrid.dataView.reSort();
            this.angularGrid.resizerService.resizeGrid();
            this.angularGrid.slickGrid.render();
            this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
          }

        })
      }
    });
  }

  prepareGrid() {
    this.gridOptions = {

      autoEdit: false,
      enableEmptyDataWarningMessage: true,
      emptyDataWarning: {
        message: 'There is no data to display.',
      },
      enableCheckboxSelector: false,
      enableRowSelection: false,
      enableAutoResize: false,
      enableSorting: true,
      enableFiltering: true,
      enableGridMenu: true,
      gridMenu: {
        commandTitle: 'Custom Commands',
        columnTitle: 'Columns',
        iconCssClass: 'fa fa-ellipsis-v',
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        commandItems: [
          {
            iconCssClass: 'fa fa-filter text-danger',
            title: 'Clear All Filters',
            disabled: false,
            command: 'clear-filter'
          },
          {
            iconCssClass: 'fa fa-random',
            title: 'Toggle Filter Row',
            disabled: false,
            command: 'toggle-filter'
          }
        ],
        onCommand: (e, args) => {
          if (args.command === 'toggle-filter') {
            this.gridObj = args.grid;
            this.onToggleFilter;
          }
          else if (args.command === 'clear-filter') {
            this.filterService.clearFilters();
            this.dataviewObj.refresh();
          }
        }
      },
      enableExcelCopyBuffer: false,
      editable: true,
      enableTranslate: false,
      autoCommitEdit: true,
      gridHeight: 380,
      gridWidth: 1285,
      rowHeight: 40,
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
        pageSize: 100
      },
      asyncEditorLoading: true,
      enableCellNavigation: true,
      enableAutoTooltip: true,
      autoTooltipOptions: {
        enableForCells: true,
        enableForHeaderCells: true,
        maxToolTipLength: 1000
      },
    };
  }

  angularGridReady(angularGrid: any) {
    this.angularGrid = angularGrid.detail;
    this.gridObj = angularGrid.detail.slickGrid;
    this.filterService = angularGrid.detail.filterService;
    let localFilters = angularGrid.detail.filterService.getCurrentLocalFilters();
    this.dataviewObj = angularGrid.detail.dataView;
    if (this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(false);
    }
    // this.angularGrid.resizerService.resizeGrid();
    // this.angularGrid.slickGrid.render();
    // angularGrid.paginationService.changeItemPerPage(angularGrid.paginationService.itemsPerPage);
  }

  onToggleFilter() {

    if (this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(false);
    } else if (!this.gridObj.getOptions().showHeaderRow) {
      this.gridObj.setHeaderRowVisibility(true);
    }
  }

  async onCellChanged(event: any) {
    console.log(event);

    let id = event.detail.args.item.id;
    let item = event.detail.args.item;
    // this.apiService.updateOne(id, item).then((result: any) => {});

    const result: any = await this.apiService.updateOne(id, item);
    console.log("Update successfully...", result);
    this._snackBar.open('Update successfully...', 'Ok', {
      duration: 2000
    });

    if (item['_rev']) {
      item['_rev'] = result['rev'];
    }
    const dataView = event.detail.args.grid.getData();
    if (dataView) {
      dataView.beginUpdate();
      const value = dataView.getItemById(item['id'])
      if (value) {
        dataView.updateItem(item['id'], item);
      } else {
        dataView.addItem(item);
      }
      dataView.endUpdate();
      dataView.reSort();
    }
  }

  onRecordEdit() {

    if (this.isLoading) {
      Swal.fire('Another process is going on...');
      return;
    } else {
      const selectedRows = this.angularGrid.slickGrid.getSelectedRows();
      if (selectedRows.length > 0 && selectedRows.length === 1) {
        const selectedData = selectedRows.map((rowIndex: any) => {
          return this.angularGrid.slickGrid.getDataItem(rowIndex);
        });
        console.log('onRecordEdit: ', selectedData);
        let editData = { selectedData: JSON.stringify(selectedData[0]), action: 'edit' };
        this.router.navigate(['/entry'], { queryParams: editData });
      } else if (selectedRows.length > 1) {
        Swal.fire('Kindly select one record...');
      } else {
        Swal.fire("Kindly select records...");
      }
    }
  }

  bulkDelete() {

    this.isLoading = true;
    const selectedRows = this.angularGrid.slickGrid.getSelectedRows();
    if (selectedRows.length > 0) {
      const selectedData = selectedRows.map((rowIndex: any) => {
        return this.angularGrid.slickGrid.getDataItem(rowIndex);
      });
      console.log(selectedData);
      selectedData.map((res: { id: any; _rev: any; _id: any; }) => {
        this.angularGrid.gridService.deleteItemById(res._id);
        this.apiService.deleteOne(res._id, res._rev).then((delResponse: any) => {
          if (delResponse['status'] === "success") {
            this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
            this.isLoading = false;
          }
          else {
            this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
            this.isLoading = false;
          }
        })
      });
    } else {
      Swal.fire("Select at least one record to delete");
      this.isLoading = false;
    }
  }

  initializeGrid() {
    this.columnDefinitions = [
      {
        id: 'edit',
        name: 'Edit',
        field: '_id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        cssClass: "custom-color-column",
        minWidth: 60,
        maxWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {

          const dialogRef = this.dialog.open(StudentEntryModalComponent, {
            data: args.dataContext,
            width: '80%',
            maxWidth: '800px',
            height: 'auto',
            maxHeight: '80vh',
          });

          dialogRef.afterClosed().subscribe(async result => {
            console.log(`Dialog result: ${result}`);
            if (result?.status === "success" && result?.records?.result?.ok === true) {
              let updatedId = result?.records?.result?.id;
                // this.apiService.findOne(updatedId).then((updatedRecord: any) => {})
                const updatedRecord: any = await this.apiService.findOne(updatedId);
                if (this.angularGrid && updatedRecord && updatedRecord?.records && Object.keys(updatedRecord?.records)) {
                  let newData: any = {};
                  newData = updatedRecord?.records;
                  newData['id'] = updatedRecord?.records['_id'];
                  delete newData['_id'];
                  this.angularGrid.dataView.beginUpdate();
                  var value = this.angularGrid.dataView.getItemById(newData['id'])
                  if (value) {
                    this.angularGrid.dataView.updateItem(newData['id'], newData);
                  } else {
                    this.angularGrid.dataView.addItem(newData);
                  }
                  this.angularGrid.dataView.endUpdate();
                  setTimeout(() => {
                    this.angularGrid.dataView.reSort();
                    this.angularGrid.resizerService.resizeGrid();
                    this.angularGrid.slickGrid.render();
                    this.angularGrid.paginationService.changeItemPerPage(this.angularGrid.paginationService.itemsPerPage);
                    this._snackBar.open('Update successfully...', 'Ok', {
                      duration: 1000
                    });
                  }, 1000);
                }
            }
          });
        },
      },
      {
        id: 'delete', name: 'Delete', field: '_id', excludeFromHeaderMenu: true, formatter: Formatters.deleteIcon, cssClass: "custom-color-column",
        minWidth: 60, maxWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          if (confirm('Are you sure want to delete ?')) {
            this.isLoading = true;
            this.angularGrid.gridService.deleteItemById(args.dataContext.id);
            this.apiService.deleteOne(args.dataContext.id, args.dataContext._rev).then((res: any) => {
              console.log('Record Deleted succuessfully...', res);
              this._snackBar.open('Record Deleted succuessfully...', 'Ok', {
                duration: 1000
              });
              this.angularGrid.paginationService.changeItemPerPage(
                this.angularGrid.paginationService.itemsPerPage
              );
              this.isLoading = false;
            });
          }
        },
      },
      {
        id: 'view', name: 'View', field: 'view', excludeFromHeaderMenu: true, formatter: customDataFormatter, cssClass: "custom-color-column",
        minWidth: 60, maxWidth: 60,
        onCellClick: (e: Event, args: OnEventArgs) => {
          let viewData = { _id: args.dataContext.id, _rev: args.dataContext._rev }
          console.log("view-icon", viewData);
          this.routeService.layoutNavigation("student-detail", viewData);
        },
      },

      {
        id: '_attachments.image.data',
        name: 'Profile',
        field: "profile",
        formatter: customDataFormatter,
        sortable: true,
        minWidth: 100
      },

      { id: 'studentName', name: 'Student Name', field: 'studentName', filterable: true, sortable: true, minWidth: 150 },

      {
        id: 'type', name: 'Type', field: 'type', filterable: true, sortable: true, minWidth: 100,
        editor: {
          model: Editors.singleSelect,
          collection: [{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }],
          params: { allowEmpty: false }
        }
      },
      {
        id: 'year', name: 'Year', field: 'year', filterable: true, sortable: true, minWidth: 100,
        editor: {
          model: Editors.singleSelect,
          collection: [
            { value: 0, label: 'KG' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' }
          ],
          params: { allowEmpty: false }
        }
      },
      {
        id: 'class', name: 'Class', field: 'class', filterable: true, sortable: true, minWidth: 100,
        editor: {
          model: Editors.singleSelect,
          collection: ['KG-A', 'KG-B', 'KG-C', 'Primary-A', 'Primary-B', 'Primary-C', 'Primary-D', 'Primary-E', 'Secondary-A', 'Secondary-B', 'Secondary-C', 'Secondary-D'].map(value => ({ value, label: value })),
          params: { allowEmpty: false }
        }
      },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true, minWidth: 100,
        editor: {
          model: Editors.singleSelect,
          collection: ['male', 'female'].map(value => ({ value, label: value })),
          params: { allowEmpty: false }
        }
      },
      { id: 'age', name: 'Age', field: 'age', filterable: true, sortable: true, minWidth: 100 },
      { id: 'email', name: 'Email', field: 'email', filterable: true, sortable: true, minWidth: 200 },
      { id: 'phone', name: 'Phone', field: 'phone', filterable: true, sortable: true, minWidth: 150 },
      { id: 'address', name: 'Address', field: 'address', filterable: true, sortable: true, minWidth: 200 },
      { id: 'grades.english', name: 'English', field: 'grades.english', formatter: customDataFormatter, filterable: true, sortable: true, minWidth: 100 },
      { id: 'grades.math', name: 'Math', field: 'grades.math', formatter: customDataFormatter, filterable: true, sortable: true, minWidth: 100 },
      { id: 'grades.science', name: 'Science', field: 'grades.science', formatter: customDataFormatter, filterable: true, sortable: true, minWidth: 100 },
    ];

    this.columnDefinitions.forEach((column) => {
      switch (column.field) {
        case 'age':
          column.editor = { model: Editors.integer };
          break;
        case 'grades.english':
        case 'grades.math':
        case 'grades.science':
        case 'phone':
          column.editor = { model: Editors.integer, params: { forceEdit: true } };
          break;
        case 'studentName':
        case 'email':
        case 'address':
          column.editor = { model: Editors.text };
          break;
      }
    });

  }

  applyFilters() {
    this.filteredStudents = this.students.filter((student) => {
      return (
        (!this.selectedType || student.type == this.selectedType) &&
        (!this.selectedYear || student.year == this.selectedYear) &&
        (!this.selectedClass || student.class == this.selectedClass)
      );
    });
    this.dataset = this.filteredStudents;
    console.log("this.filteredStudents", this.filteredStudents);
  }

}
