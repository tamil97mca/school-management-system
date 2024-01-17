import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent {

  studentDetail: any;
  attachment: any;
  profile: any;

  imageUrl: any;

  constructor(public activatRoute: ActivatedRoute, private apiService: ApiService, private sanitizer: DomSanitizer) {

    this.activatRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      this.apiService.findOne(params?._id).then((studentData: any) => {
        console.log("student", studentData);
        this.studentDetail = studentData['records'];
        if (this.studentDetail['_attachments'] && this.studentDetail['_attachments']['image']) {
          this.attachment = this.studentDetail['_attachments'];
          const incorrectBase64 = this.studentDetail['_attachments']['image']['data']
          const base64Data = incorrectBase64.replace('dataimage/pngbase64', '');
          this.imageUrl = 'data:image/png;base64,' + base64Data;
        }
      })
    })
  }

}
