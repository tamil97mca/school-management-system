import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/modals/student';

@Component({
  selector: 'app-student-entry-modal',
  templateUrl: './student-entry-modal.component.html',
  styleUrls: ['./student-entry-modal.component.css']
})
export class StudentEntryModalComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  params: any;
  selectedData: any;
  files: any;
  imgURL: any;
  studentDetail: any;

  formGroup: FormGroup;

  selectedFileName: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Student,
    public dialogRef: MatDialogRef<StudentEntryModalComponent>,
    public fb: FormBuilder, public http: HttpClient,
    public activatRoute: ActivatedRoute, private apiService: ApiService,
    private router: Router) {
    this.activatRoute.paramMap.subscribe((params: ParamMap) => {
      const studentId = params.get('id');

      if (studentId) {
        this.apiService.findOne(studentId).then((studentData: any) => {
          console.log("student", studentData);

          if (studentData['status'] = "success") {
            this.formGroup.patchValue({
              studentName: studentData.records.studentName,
              year: studentData.records.year,
              type: studentData.records.type,
              class: studentData.records.class,
              gender: studentData.records.gender,
              age: studentData.records.age,
              email: studentData.records.email,
              phone: studentData.records.phone,
              address: studentData.records.address,
              grades: {
                english: studentData.records.grades.english,
                math: studentData.records.grades.math,
                science: studentData.records.grades.science,
              },
              profileImage: studentData.records.profileImage,
            });
          }
        });
        // this.formGroup.get('additionalField').setValue(studentData.records.additionalField);
      }

      const stuId = data['id'];
      if (stuId) {
        this.apiService.findOne(stuId).then((studentData: any) => {
          console.log("student", studentData);

          if (studentData['status'] = "success") {

            this.formGroup.patchValue({
              studentName: studentData.records.studentName,
              year: studentData.records.year,
              type: studentData.records.type,
              class: studentData.records.class,
              gender: studentData.records.gender,
              age: studentData.records.age,
              email: studentData.records.email,
              phone: studentData.records.phone,
              address: studentData.records.address,
              grades: {
                english: studentData.records.grades.english,
                math: studentData.records.grades.math,
                science: studentData.records.grades.science,
              },
              profileImage: studentData.records.profileImage,
            });
            // this.formGroup.get('additionalField').setValue(studentData.records.additionalField);
          }
        });
      }
    });


    const namePattern = /^[a-zA-Z ]+$/;
    const yearPattern = /^\d{4}$/;
    const typePattern = /^[a-zA-Z ]+$/;
    const classPattern = /^[a-zA-Z0-9 ]+$/;
    const genderPattern = /^(male|female|other)$/i;
    const agePattern = /^\d+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d{10}$/;
    const addressPattern = /^[a-zA-Z0-9,.\- ]+$/;
    const gradesPattern = /^(english|math|science)$/i;
    const imagePattern = /\.(jpg|jpeg|png|gif)$/i;

    this.formGroup = this.fb.group({
      studentName: new FormControl('', [Validators.required, Validators.pattern(namePattern)]),
      year: new FormControl('', [Validators.required, Validators.pattern(yearPattern)]),
      type: new FormControl('', [Validators.required, Validators.pattern(typePattern)]),
      class: new FormControl('', [Validators.required, Validators.pattern(classPattern)]),
      gender: new FormControl('', [Validators.required, Validators.pattern(genderPattern)]),
      age: new FormControl('', [Validators.required, Validators.pattern(agePattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(phonePattern)]),
      address: new FormControl('', [Validators.required, Validators.pattern(addressPattern)]),
      grades: this.fb.group({
        english: new FormControl('', [Validators.required, Validators.pattern(gradesPattern)]),
        math: new FormControl('', [Validators.required, Validators.pattern(gradesPattern)]),
        science: new FormControl('', [Validators.required, Validators.pattern(gradesPattern)]),
      }),
      profileImage: new FormControl('', [Validators.required, Validators.pattern(imagePattern)]),
    });

  }

  ngOnInit() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const selectedFile: any = document.getElementById('selectedFile');

    if (fileInput) {
      fileInput?.addEventListener('change', (event: any) => {
        const fileName = event.target.files[0].name;
        selectedFile.textContent = `Selected File: ${fileName}`;

        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();

          reader.readAsDataURL(fileInput.files[0]);

          reader.onload = (event: any) => {
            const image = event.target.result as string;
            this.formGroup.patchValue({ profileImage: image });
          };
        } else {
          this.formGroup.patchValue({ profileImage: null });
        }
      });
    }
  }

  submit() {

    if (this.data && Object.keys(this.data).length > 0) {
      let profile = this.formGroup.value?.profileImage;
      this.formGroup.patchValue({ profileImage: null });
      this.apiService.updateOne(this.data.id, this.formGroup.value).then((editResult: any) => {
        console.log('Update result', editResult);

        if (editResult['status'] === 'success') {
          let imgData = { _id: editResult.records.result.id, _rev: editResult.records.result.rev, image: profile }
          this.apiService.updateImg(imgData).then((res: any) => {
            console.log('Update image result', res);
            this.dialogRef.close(editResult);
          });
        }


        this.dialogRef.close(editResult);
        this.formGroup.reset();
      });


    } else {
      delete this.formGroup.value._id;
      delete this.formGroup.value._rev;

      let profile = this.formGroup.value?.profileImage;
      this.formGroup.patchValue({ profileImage: null });

      this.apiService.save(this.formGroup.value).then((saveResult: any) => {
        console.log('Save result', saveResult);

        if (saveResult['status'] === 'success') {
          let imgData = { _id: saveResult.records.id, _rev: saveResult.records.rev, image: profile }
          this.apiService.updateImg(imgData).then((res: any) => {
            console.log('Update image result', res);
          });
        }

        this.dialogRef.close(saveResult);
        this.formGroup.reset();
      });
    }
  }

  getErrorMessage(controlName: string) {
    const control = this.formGroup.get(controlName);

    if (control?.hasError('required')) {
      return 'You must enter a value';
    }

    if (control?.hasError('email')) {
      return 'Not a valid email';
    }

    return '';
  }

  backButton() {
    history.back();
  }

  onFileSelected(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      this.selectedFileName = file?.name ?? '';
      reader.onload = (event: any) => {
        const base64Image = event.target.result as string;
        console.log('data:image/png;base64,' + base64Image.split(',')[1]);
        this.formGroup.patchValue({ profileImage: base64Image });
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        this.formGroup.patchValue({ profileImage: null });
      };

      reader.readAsDataURL(file);
    } else {
      this.formGroup.patchValue({ profileImage: null });
      this.selectedFileName = null;
    }
  }


}
