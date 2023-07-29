import { google } from 'googleapis';

export async function GetGoogleSheet(spreadSheetId: string, sheetName: string) {
  const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_API_KEY });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadSheetId,
      range: sheetName, // Specify the range you want to retrieve data from
    });

    const data = response.data.values;
    return data;
  } catch (error) {
    console.error('Error retrieving data from Google Sheet:', error);
    return null;
  }
}