import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';
  loginSubject = new BehaviorSubject<any>(this.getUser());

  constructor(private http: HttpClient) { }

  getUser() {
    let admin = localStorage.getItem('LOGGED_IN_USER');
    if (admin) {
      return JSON.parse(admin);
    }
    return null;
  }

  findAll() {
    const httpRequest = this.http.get(environment.baseURL+"/all-docs");
    return this.promiseMethod(httpRequest);
  }

  findOne(id: string) {
    const httpRequest = this.http.get(environment.baseURL + "/findone" + "/" + id);
    return this.promiseMethod(httpRequest);
  }

  login(credentials: any) {
    const httpRequest = this.http.post(environment.baseURL+"/login", credentials);
    return this.promiseMethod(httpRequest);
  }

  register(credentials: any) {
    const httpRequest = this.http.post(environment.baseURL+"/register", credentials);
    return this.promiseMethod(httpRequest);
  }

  findByCriteria(criteria: any) {
    const httpRequest = this.http.post("http://localhost:3000/find", criteria);
    return this.promiseMethod(httpRequest);
  }

  save(data: any) {
    const httpRequest = this.http.post(environment.baseURL+"/insert-single", data);
    return this.promiseMethod(httpRequest);
  }

  bulkSave(data: any) {
    const httpRequest = this.http.post(environment.baseURL+"/insert-bulk", data);
    return this.promiseMethod(httpRequest);
  }

  deleteOne(id: string, rev: string) {
    const httpRequest = this.http.delete(environment.baseURL + "/delete/" + id + "?rev=" + rev);
    return this.promiseMethod(httpRequest);
  }

  updateOne(id: string, data: any) {
    const httpRequest = this.http.put(environment.baseURL + "/update/" + id, data);
    return this.promiseMethod(httpRequest);
  }


  updateImg(data: any) {
    const imgURL = `${this.baseUrl}/insert-single-attachment/${data._id}`;
    const httpRequest = this.http.put(imgURL, data, { headers: { 'Content-Type': 'application/json' } });
    return this.promiseMethod(httpRequest);
  }

  response(status: string, message: string, records: []) {
    let responseData = {
      status: status,
      message: message,
      records: records
    }
    return responseData;
  }

  promiseMethod(httpRequest: any) {
    const promise = new Promise(resolve => {
      httpRequest.toPromise().then((res: any) => {
        // console.log(res);
        resolve(this.response("success", '', res));
      }).catch((err: { message: string; }) => {
        resolve(this.response("failed", err.message, []));
      });
    })
    return promise;
  }

}
