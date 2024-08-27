export class ATTENDANCE {
  static readonly PRESENT = 'P';
  static readonly ABSENT = 'A';
  static readonly OFF = 'OFF';
}

export const EMPLOYEES: Employee[] = [
  {
    employeeId: '58',
    employeeName: 'Syed Shehryar'
  },
  {
    employeeId: '69',
    employeeName: 'Amer Hamza Aamir Butt'
  },
  {
    employeeId: '74',
    employeeName: 'Shayyan Syed'
  },
  {
    employeeId: '77',
    employeeName: 'Muhammad Aqil Shehzad'
  },
  {
    employeeId: '88',
    employeeName: 'Irtaza Raza'
  },
  {
    employeeId: '93',
    employeeName: 'Zain ul abedin'
  },
  {
    employeeId: '92',
    employeeName: 'Waleed ahmad'
  },
  {
    employeeId: '81',
    employeeName: 'Ahmed bilal yousaf'
  },
  {
    employeeId: '57',
    employeeName: 'Muhammad Raza Khan'
  },
  {
    employeeId: '94',
    employeeName: 'Sharjeel Ayubi'
  },
  {
    employeeId: '98',
    employeeName: 'Shehzad Islam'
  },
  {
    employeeId: '99',
    employeeName: 'Umair Mateen'
  },
  {
    employeeId: '100',
    employeeName: 'Muhammad Islam Danish'
  },
  {
    employeeId: '101',
    employeeName: 'Asad khan'
  },
  {
    employeeId: '104',
    employeeName: 'Abdul moiz'
  },
  {
    employeeId: '127',
    employeeName: 'Muhammad faisal'
  },
  {
    employeeId: '130',
    employeeName: 'Ali hamza khan'
  },
  {
    employeeId: '18',
    employeeName: 'Fatima tuz zahra'
  },
  {
    employeeId: '95',
    employeeName: 'Rizwan majid'
  },

];


export interface Employee {
  employeeId: string;
  employeeName: string;
}
