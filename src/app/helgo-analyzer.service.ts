import { Injectable } from '@angular/core';
import { ExpenseRecord } from './tally-parser.service';

const budgetMappings = new Map([
  ['Honorarium', 'Honorarium'],
  ['Staff Health Insurance', 'Staff Medical Insurance'],
  ['Staff Training Exp.', 'Staff Training'],
  ['Rent Etc', 'Building (Rent & Electricity)'],
  ['Electric Charges', 'Building (Rent & Electricity)'],
  ['Postage & Internet', 'Office Expenses'],
  ['Office Stationery Exp.', 'Office Expenses'],
  ['Computer Maintenance', 'Maintenance & Repairs'],
  ['Repair & Maintenance Exp', 'Maintenance & Repairs'],
  ['Conveyance Exp.', 'Conveyance'],
  ['Educational Materials', 'Educational Material'],
  ['Books for the Students', 'School Books for students'],
  ['School Uniforms', 'School Uniforms'],
  ['School Fees Etc', 'School Fees'],
  ['Fees for the Professional Courses Etc.', 'VT Fees'],
  [
    'Educational Trip for the Project Children',
    'Excursions & Special Activities',
  ],
  ['Fooding Exp. for the Project Children', 'Food'],
  ['Social & Cultural Exp.', 'Social & Cultural Programs'],
  ['Medical Test & Medicines Etc', 'Medical Support'],
  ['Social Welfare Exp', 'Social Welfare Support'],
  ['Miscellaneous Exp.', 'Miscellaneous Expenses'],

  ['Loans & Advance', 'IGNORE'],
  ['Annual Tour', 'Annual Tour'],
  ['Administrative Expenses', 'Administrative Expenses'],
]);

@Injectable({
  providedIn: 'root',
})
export class HelgoAnalyzerService {
  students: { name: string; projectNumber: string }[] = [];

  constructor() {
    //this.loadStudents();
  }

  private loadStudents() {
    /*
    this.httpClient
      .get('assets/ChildrenList.csv', { responseType: 'text' })
      .subscribe((data) =>
        Papa.parse(data, { header: true }).data.map((r: any) => ({
          name: r['Name'],
          projectNumber: r['Project Number'],
        })),
      );
    */
  }

  analyze(r: ExpenseRecord): AnalyzedRecord {
    return {
      ...r,
      budget: this.detectBudget(r),
      student: this.detectStudent(r),
    };
  }

  private detectBudget(r: ExpenseRecord) {
    let budget = budgetMappings.get(r.account);
    if (!budget) {
      console.warn("Unknown Account: '" + r.account + "'", r);
      budget = 'N/A';
    }
    return budget;
  }

  private detectStudent(r: ExpenseRecord) {
    const scores = new Map();
    for (const s of this.students) {
      const nameParts = s.name.split(' ');
      for (const p of nameParts) {
        if (r.narration.includes(p)) {
          scores.set(s.projectNumber, (scores.get(s.projectNumber) ?? 0) + 1);
        }
      }
    }

    return undefined;
  }
}

export interface AnalyzedRecord extends ExpenseRecord {
  budget?: string;
  student?: string;
}
