import { Component, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ATTENDANCE, Employee, EMPLOYEES } from '../constants/employees';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dat-file-uploader',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgbDatepicker,
    JsonPipe,
    NgbInputDatepicker,
    NgClass
  ],
  templateUrl: './dat-file-uploader.component.html',
  styleUrls: ['./dat-file-uploader.component.scss'] // Corrected typo from 'styleUrl' to 'styleUrls'
})

export class DatFileUploaderComponent {
  tableData: any[] = [];
  headers: string[] = [];
  employees: Employee[] = EMPLOYEES;
  attendanceConstant = ATTENDANCE;

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  file: any;

  get daysInMonth(): number {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      const to = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }

  get dateRange(): Date[] {
    const dates: Date[] = [];
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      const to = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      for (let d = from; d <= to; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    }
    return dates;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.generateHeaders();
  }

  generateHeaders() {
    this.headers = ['Employee ID', 'Employee Name', 'Present', 'Absent', 'Leave'];
    this.dateRange.forEach(date => {
      this.headers.push(date.toDateString());
    });
  }


  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  removeFile() {
    this.file = null;
    this.tableData = [];
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        this.processData(fileContent);
      };

      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }
  }

  processData(data: string) {
    const lines = data.split('\n');
    const attendanceMap = new Map<string, Set<number>>();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);

      if (parts.length > 2) {
        const empId = parts[0].trim();
        const attendanceDate = new Date(parts[1].trim());
        const day = attendanceDate.getDate();

        if (isNaN(attendanceDate.getTime())) {
          console.warn(`Invalid date format for line: "${ line }"`);
          return;
        }

        if (!attendanceMap.has(empId)) {
          attendanceMap.set(empId, new Set());
        }

        attendanceMap.get(empId)?.add(day);
      }
    });

    this.generateTableData(attendanceMap);
  }

  generateTableData(attendanceMap: Map<string, Set<number>>) {
    this.tableData = [];
    this.employees.forEach((employee: Employee) => {
      const empId = employee.employeeId;
      const row = new Array(this.headers.length).fill(ATTENDANCE.ABSENT);
      row[0] = empId;
      row[1] = employee.employeeName;

      const daysPresent = attendanceMap.get(empId.toString()) || new Set<number>();

      let presentCount = 0;
      let absentCount = 0;

      this.dateRange.forEach((date: Date, index: number) => {
        const day: number = date.getDate();
        const dayOfWeek: number = date.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          row[index + 5] = ATTENDANCE.OFF;
        } else if (daysPresent.has(day)) {
          row[index + 5] = ATTENDANCE.PRESENT;
          presentCount++;
        } else {
          row[index + 5] = ATTENDANCE.ABSENT;
          absentCount++;
        }
      });

      row[2] = presentCount;
      row[3] = absentCount;
      row[4] = 0;

      this.tableData.push(row);
    });

    attendanceMap.forEach((daysPresent, empId) => {
      const employee = this.employees.find((emp: Employee) => emp.employeeId.toString() === empId);
      if (!employee) {
        const row = new Array(this.headers.length).fill('A');
        row[0] = empId;
        row[1] = 'No name available';

        let presentCount = 0;
        let absentCount = 0;

        this.dateRange.forEach((date, index) => {
          const day = date.getDate();
          const dayOfWeek = date.getDay();

          if (dayOfWeek === 0 || dayOfWeek === 6) {
            row[index + 5] = ATTENDANCE.OFF;
          } else if (daysPresent.has(day)) {
            row[index + 5] = ATTENDANCE.PRESENT;
            presentCount++;
          } else {
            row[index + 5] = ATTENDANCE.ABSENT;
            absentCount++;
          }
        });

        row[2] = presentCount;
        row[3] = absentCount;
        row[4] = 0;

        this.tableData.push(row);
      }
    });
  }

  downloadExcel() {
    const data: any[] = [this.headers, ...this.tableData];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    XLSX.writeFile(workbook, 'Attendance.xlsx');
  }
}
