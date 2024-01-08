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
    const headers = sheet.data[headerIndex];
    const data = sheet.data.slice(headerIndex + 2); // header has two rows

    return this.splitIntoRecords(data)
      .map((r) => this.parseRawRecord(r))
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

  /**
   * Create one or more full expense records from a group of tally booking rows.
   * @param r
   * @private
   */
  private parseRawRecord(r: RawRecord): ExpenseRecord[] {
    if (!r[0][8]) {
      // skip if the primary (first) entry is credit not debit
      return [];
    }

    const date = moment(r[0][0]).format('YYYY-MM-DD');
    const voucherNo = r[0][7];
    const narration = r[r.length - 1][1];

    const expenses = [];
    for (let i = 0; i < r.length - 1; i++) {
      const amount = r[i][8];
      if (!amount) {
        continue;
      }

      const account = r[i][1];
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
