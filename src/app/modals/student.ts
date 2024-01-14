export interface Student {
    id: string;
    studentName: string;
    year: number;
    type: string;
    class: string;
    gender: string;
    age: number;
    email: string;
    phone: string;
    address: string;
    grades: {
      english: number;
      math: number;
      science: number;
    };
    profileImage: string;
}
