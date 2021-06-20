import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Excel } from './excel';


@Injectable()
export class ExcelService {

    EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    EXCEL_EXTENSION = '.xlsx';

    exportToEXcel(xl: Excel, skipHeader = false) {
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xl.data, { skipHeader: skipHeader });

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const fileName = xl.excelFileName + xl.excelExtension;

        /* save to file */
        XLSX.writeFile(wb, fileName);
    }

    exportToExcel2(xl: Excel) {
        try {
            const wscols = [];
            /* generate worksheet */
            Object.keys(xl.data[0]).forEach((key, index) => {
                if (!wscols.includes(key)) {
                    wscols.push({
                        wch: 20
                    });
                }
            });

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xl.data);

            /* setting column widths */
            ws['!cols'] = wscols;

            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, xl.sheetName);

            const fileName = xl.excelFileName + xl.excelExtension;

            /* save to file */
            const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            this.saveAsExcelFile(excelBuffer, fileName);
            return true;
        } catch (ex) {
            console.log('error occured while exporting data to excel ', ex);
            return false;
        }
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: this.EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName);
    }
}
