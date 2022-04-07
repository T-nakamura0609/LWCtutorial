import { LightningElement, wire, api, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getFileVersions from "@salesforce/apex/FileController.getVersionFiles";

export default class PreviewFileThumbnails extends LightningElement {
    loaded = false;
    @track fileList;
    @api recordId;
    @track files = [];
    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
    }

    @wire(getFileVersions, { recordId: "$recordId" })
    fileResponse(value) {
        this.wiredActivities = value;
        const { data, error } = value;
        this.fileList = "";
        this.files = [];
        if (data) {
            this.fileList = data;
            for (let i = 0; i < this.fileList.length; i++) {
                let file = {
                    Id: this.fileList[i].Id,
                    Title: this.fileList[i].Title,
                    Extension: this.fileList[i].FileExtension,
                    ContentDocumentId: this.fileList[i].ContentDocumentId,
                    ContentDocument: this.fileList[i].ContentDocument,
                    CreatedDate: this.fileList[i].CreatedDate,
                    thumbnailFileCard:
                        "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                        this.fileList[i].Id +
                        "&operationContext=CHATTER&contentId=" +
                        this.fileList[i].ContentDocumentId
                };
                this.files.push(file);
            }
            this.loaded = true;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading Files",
                    message: error.body.message,
                    variant: "error"
                })
            );
        }
    }
    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: uploadedFiles.length + " Files Uploaded Successfully.",
                variant: "success"
            })
        );
    }
}