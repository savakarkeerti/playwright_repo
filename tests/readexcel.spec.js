import {test} from "@playwright/test"
import { Workbook } from "exceljs"
import path from "node:path"

test("readExcel", async ({page}) => {
    let book = new Workbook()
    // It's an object which represents the excel sheet
    await book.xlsx.readFile(path.join(__dirname,'../testdata/TestData.xlsx'))
    // above line joins the current file with the excel sheet 
    let sheet = book.getWorksheet("Sheet1")
    console.log(sheet," sheet data")
    // gettin the complete access for sheet1 
    let data = await sheet.getRow(1).getCell(1).toString()
    // index will start from 1
    // .getRow will get the data from the row  and .getCell get the complte data from cell
    // can except data from any formate based on cell so need to cvonvert in to string so using .toString
    await page.goto(data)
    let user_name = sheet.getRow(1).getCell(2).toString()
    await page.locator("//input[@name='user_name']").fill(user_name)
    let password = sheet.getRow(1).getCell(3).toString()
    await page.locator("//input[@name='user_password']").fill(password)
    await page.waitForTimeout(3000)
    
    
    
})