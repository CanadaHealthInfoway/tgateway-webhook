"use strict";

//modules needed for this app..

const CONFIG = require('../../config.json');

const DEFAULT_GATEWAY_BASE_URL = "https://termapi.infoway-inforoute.ca/rest/v1";
const FILE_PATH_FORMAT = "%s/%s_%s.%s";
const DOWNLOAD_URL_FORMAT = "%s/%s/%s/download?format=%s";
const DEFAULT_DOWNLOAD_DIRECTORY = "./Downloads";


const express = require('express');
const router = express.Router();
const util = require('util');
const fs = require('fs');
const request = require("request");

//constants
const defaultGatewayBaseUrl = CONFIG.gatewayBaseUrl || DEFAULT_GATEWAY_BASE_URL;
const downloadDir = CONFIG.downloadDir || DEFAULT_DOWNLOAD_DIRECTORY;

//index page
router.get('/', (req, res) => {
    console.log("============WEBHOOK CONTEXT ROOT PINGED============");
    console.log("\n");
    let msg = `Terminology Gateway sample Webhook listening to: ${req.get('host')}`;
    postResult(200, msg, res);
});

// processing the notification body
router.post(CONFIG.contextPath, (req, res) => {
    console.log(util.format("============RECEIVED A WEBHOOK POST REQUEST============"));
    console.log("\n");
    console.log(`Processing: ${JSON.stringify(req.body)}`);
    console.log("\n");
    
    let gatewayBaseUrl = req.base_url || defaultGatewayBaseUrl;

    let msg = "";
    if (!req.body.api_id || (req.body.api_id !== CONFIG.apiId)) {
        msg = `Missing or invalid api_id: ${req.body.api_id}\n`;
        postResult(310, msg, res);
    }
    else {
        if (req.body.targets) {
            let downloadOk = true; 
            req.body.targets.forEach(target => {
                if (target.type == "package") { 
                    downloadFile(gatewayBaseUrl, target, "zip", res);
                    downloadFile(gatewayBaseUrl, target, "pack", res);
                } else {
                    downloadFile(gatewayBaseUrl, target, "json", res);
                }
            });
            msg = `{"api_id": "${req.body.api_id}", "result": "success"}`;
            postResult(200, msg, res);
        }
        else {
            msg = `No targets specified in request body: ${req.body}\n`;
            postResult(400, msg, res);
        }
    }    
});

if (CONFIG.contextPathDown) {
    router.post(CONFIG.contextPathDown, (req, res) => {
        msg = "We are under Maintenance.. Try back later...";
        postResult(400, msg, res);
    });
}

// Retrieve artifact data from the Terminology Gateway server.
function downloadFile(gatewayBaseUrl, target, format, res) {
    let filename = util.format(FILE_PATH_FORMAT, downloadDir, target.type,  target.name, format);
    let downloadUrl = util.format(DOWNLOAD_URL_FORMAT, gatewayBaseUrl, target.type, target.id, format);
    console.log(util.format("sending download request to: %s", downloadUrl));
    request(downloadUrl)
        .pipe(fs.createWriteStream(filename))
        .on('close', function(){
            let msg = `Download completed for target: ${JSON.stringify(target)} to path: ${filename}`;
            console.log(msg + "\n");
        })
        .on('error', function(err){
            let msg = `Error has occured while downloading for target: ${JSON.stringify(target)}, cause: ${err}`;
            console.log("Error: " + msg);
        });
}

function postResult(resultCode, msg, res) {
    console.log(msg + "\n");
    res.status(resultCode).send(msg);
}

module.exports = router;
