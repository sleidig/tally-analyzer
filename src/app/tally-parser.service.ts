import { Injectable } from '@angular/core';
import { Worksheet } from './xlsx-parser.service';
import * as tf from '@tensorflow/tfjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TallyParserService {
  constructor() {}

  async tensorflow() {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Generate some synthetic data for training.
    const xs = tf.tensor1d([1, 2, 2, 4, 10, 20]);
    const ys = tf.tensor1d([0, 0, 0, 0, 1, 1]);

    // Train the model using the data.
    await model.fit(xs, ys, { epochs: 20, stepsPerEpoch: 2 });

    // Use the model to do inference on a data point the model hasn't seen before:
    console.log(model.predict(tf.tensor1d([20])).toString());
  }

  parseDayBook(xlsData: Worksheet[]): ExpenseRecord[] {
    const sheet = xlsData[0];
    if (sheet.name !== 'Day Book') {
      console.warn("Unexpected Sheet Name: '" + sheet.name + "'");
    }

    const headerIndex = sheet.data.findIndex((row) => row[0] === 'Date');
    if (headerIndex === -1 || sheet.data[headerIndex].length !== 10) {
      console.warn("Unexpected Header: '" + sheet.data[headerIndex] + "'");
    }
    const headers = this.parseHeaderMap(sheet.data[headerIndex]);
    const data = sheet.data.slice(headerIndex + 2); // header has two rows

    return this.splitIntoRecords(data)
      .map((r) => this.parseRawRecord(r, headers))
      .flat();
  }

  private splitIntoRecords(data: any[][]): RawRecord[] {
    const records: any[][] = [];

    let currentRecord: any[][] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][0]) {
        // add a new record
        currentRecord = [];
        records.push(currentRecord);
      }

      currentRecord.push(data[i]);
    }

    return records;
  }

  private parseHeaderMap(headerRow: string[]): HeaderColumnsMap {
    const colMap = {
      debit: headerRow.indexOf("Debit"),
      credit: headerRow.indexOf("Credit"),
      voucherNo: headerRow.indexOf("Vch No."),
      particulars: headerRow.indexOf("Particulars"),
      date: headerRow.indexOf("Date"),
    }
    console.log("column header map:", colMap);
    return colMap;
  }

  /**
   * Create one or more full expense records from a group of tally booking rows.
   * @param r
   * @private
   */
  private parseRawRecord(r: RawRecord, headers: HeaderColumnsMap): ExpenseRecord[] {
    if (!r[0][headers.debit]) {
      // skip if the primary (first) entry is not debit
      return [];
    }

    const date = moment(r[0][headers.date]).format('YYYY-MM-DD');
    const voucherNo = r[0][headers.voucherNo];
    const narration = r[r.length - 1][headers.particulars];

    const expenses = [];
    for (let i = 0; i < r.length - 1; i++) {
      const amount = r[i][headers.debit];
      if (!amount) {
        continue;
      }

      const account = r[i][headers.particulars];
      expenses.push({ date, account, narration, voucherNo, amount });
    }

    return expenses;
  }
}

export interface ExpenseRecord {
  date: string;
  account: string;
  narration: string;
  voucherNo: string;
  amount: number;
}

type RawRecord = any[];

interface HeaderColumnsMap {
  debit: number;
  credit: number;
  voucherNo: number;
  particulars: number;
  date: number;
}
