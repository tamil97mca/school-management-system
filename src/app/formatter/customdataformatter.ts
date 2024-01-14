import { Column } from "angular-slickgrid";

export function customDataFormatter(row: number, cell: number, value: any, columnDef: Column<any>, dataContext: any, grid: any) {

  let outPutTag: any = '';
  if (["studentName", "yearNumber", "type", "className", "age", "email", "phone", "address"].includes(columnDef['field'])) {
    return value;
  }
  if (["grades.math", "grades.english", "grades.science"].includes(columnDef['field'])) {
    if (columnDef['field'] === 'grades.english') {
      return dataContext.grades.english;
    }
    if (columnDef['field'] === 'grades.math') {
      return dataContext.grades.math;
    }
    if (columnDef['field'] === 'grades.science') {
      return dataContext.grades.science;
    }
  }
  if (columnDef?.field === "profile") {
    if (dataContext['_attachments'] && dataContext['_attachments']['image']['data']) {
      return outPutTag += `<img src="data:image/png;base64,${dataContext['_attachments']['image']['data']}" width="30px" height="30px" style="border-radius: 50%"/>`;
    } else {
      return outPutTag += `<img src="assets/img/user_icon.png" width="30px" height="30px" style="border-radius: 50%"/>`;
    }
  } else if (columnDef?.field === "gender") {
    return outPutTag += `<span><i class="${value === 'male' ? 'fa fa-male' : 'fa fa-female'}" style="${value === 'male' ? 'color: #2196F3;' : 'color: red;'}" aria-hidden="true"></i>&nbsp; ${value}</span>`
  } if (columnDef?.field === "view") {
    return outPutTag += `<div style="cursor: pointer;"><i class="fa fa-folder-open" aria-hidden="true"></i></div>`;
  } else {
    return outPutTag += `<div class="animated-gradient"></div>`;
  }
  // src="data:image/png;base64,{{dataContext['_attachments']['image']['data'}}"
}
