import { LightningElement, api, wire, track } from 'lwc';
import getRelatedFilesByRecordId from "@salesforce/apex/FilePreviewController.getRelatedFilesByRecordId";
import { NavigationMixin } from "lightning/navigation";
export default class FilePreview extends NavigationMixin(LightningElement) {
    @api recordId;
    url;
    PageRef;
    fileList = [];
    @wire(getRelatedFilesByRecordId, {recordId: '$recordId'})
    wireResult({data, error}){
        if(data){
            console.log(data);
            this.fileList = Object.keys(data).map(item=>{
                this.getUrl(item);
                console.log("this.url:" + this.url);
                return{
                    "label":data[item], 
                    "value": item,
                    "url":`/sfc/servlet.shepherd/document/download/${item}`,
                    "url2": this.url
                }
            });
            console.log(this.fileList);
        }
        if (error) {
            console.log(error);
            
        }
    }

    // connectedCallback(){
    //     this.PageRef = {
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'ContentDocument', 
    //             pageName: 'home'
    //         }
    //     };
    //     this[NavigationMixin.GenerateUrl](this.PageRef)
    //         .then(url => { this.url = url });
    //         console.log("URL:" + this.url);
    // }

    getUrl(item){
        // let resultUrl;
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'ContentDocument', 
                recordId: item,
                actionName: 'view'
            }
        })
            .then(url => { 
                console.log("GenerateUrl :" + url);
                // this.resultUrl = url;
                this.url = url;
        });
        // console.log("resultUrl:" + resultUrl);
        // return resultUrl;
    }


    previewHandler(event){
        console.log( event.target.dataset.id);
        this[NavigationMixin.Navigate]({
            type:'standard__namedPage',
            attributes:{
                pageName:'filePreview'
            },
            state:{
                recordIds: 'aa',
                selectedRecordId: event.target.dataset.id
            }
        });
    }

    recordviewHandler(event){
        console.log( event.target.dataset.id);
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                // objectApiName: 'ContentDocument', 
                recordId: event.target.dataset.id,
                actionName: 'view'
            }
        });
    }

}