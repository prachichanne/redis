/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */



//import { Redis } from "ioredis";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '856024856826-qa8v01ou79qo1f5c65kvnjs255benr1l.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCkBkpfyAR6p0Bk7HEmoiR-5qSWsraXwCE';

// TODO(developer): Replace with your own project number from console.developers.google.com.
const APP_ID = 'long-facet-379309';

let tokenClient;
let accessToken = null;
let pickerInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client:picker', initializePicker);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializePicker() {
    await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
    pickerInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (pickerInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
            throw (response);
        }
        accessToken = response.access_token;
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        createPicker();
    };

    if (accessToken === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    if (accessToken) {
        accessToken = null;
        google.accounts.oauth2.revoke(accessToken);
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 *  Create and render a Picker object for searching images.
 */
function createPicker() {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(API_KEY)
        .setAppId(APP_ID)
        .setOAuthToken(accessToken)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
}

/**
 * Displays the file details of the user's selection.
 * @param {object} data - Containers the user selection from the picker
 */

async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // set the content type to JSON
            },
            body: JSON.stringify(data) // convert the data to JSON format
        });
        return await response.json();
    } catch (error) {
        return console.error(error);
    } // handle any errors that occur
  }

async function pickerCallback(data) {

    if (data.action === google.picker.Action.PICKED) {

        let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
        const document = data[google.picker.Response.DOCUMENTS][0];
        const fileId = document[google.picker.Document.ID];
        console.log(fileId);
        const res = await gapi.client.drive.files.get({
            'fileId': fileId,
            'fields': '*',
        });

        text = JSON.stringify(res.result.webContentLink, null, 2);

        data_urll = JSON.parse(text)
        window.document.getElementById('content').innerText = text;

        console.log(res.result.webContentLink)



        // let text = JSON.stringify(data.docs[0].name, null, 2);
        // let data_urll = JSON.stringify(res.result.webViewLink, null, 2);

        //let data_urll = "https://docs.google.com/spreadsheets/d/1YgBMmLWoB6U3SR0IfABWAmr7TdjFGQ24/edit?usp=drivesdk&ouid=105507558930104005472&rtpof=true&sd=true"
     
     // student  https://docs.google.com/spreadsheets/d/1ZDHG-xhIo_dEyywiOfn6REz-0ZTD93cc/edit?usp=drivesdk&ouid=105507558930104005472&rtpof=true&sd=true


     // error in test   https://docs.google.com/spreadsheets/d/1jYjwjk_6o-e9uz17T76fuO7f1QcSZRuW/edit?usp=drivesdk&ouid=105507558930104005472&rtpof=true&sd=true

        let obj_data = {
            data_url:data_urll
        }

        let url ="http://localhost:5600/postApi";
            

        postData(url, obj_data)
        .then(response => {
            window.document.getElementById('content').innerText = JSON.stringify(response);

          console.log(response);
        })
        .catch(error => {
          console.error(error);
        });
        
        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', 'https://docs.google.com/spreadsheets/d/1ZDHG-xhIo_dEyywiOfn6REz-0ZTD93cc/edit?usp=drivesdk&ouid=105507558930104005472&rtpof=true&sd=true', true);
        // xhr.responseType = 'arraybuffer';

        // xhr.onload = function () {

        //     var data = new Uint8Array(xhr.response);
        //     var workbook = XLSX.read(data, { type: 'array' });
        //     var firstsheetName = workbook.SheetNames[0];
        //     const worksheet = workbook.Sheets[firstsheetName];
        //     var sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, sheetRows: undefined });

        //     var col_obj = sheetData[0];
        //     // var keys = []
        //     // for(var k in col) keys.push(k)
        //    // window.document.getElementById('content').innerText = JSON.stringify(Object.values(col_obj));
        //     // Object.keys.sheetData[0] -- to get keys of row 1

        //     // counts first 100 rows only 
        //     // var rowCount = sheetData.length;
        //     // console.log(rowCount);
        //     console.log(Object.values(col_obj));

        // };
        // xhr.send();





       




    }
}





