import { LightningElement, track, wire, api } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'

import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import COLORS from '@salesforce/resourceUrl/colors'

// 検索結果に表示するカラム名の定義
const COLUMNS = [
    {label: '技術者名', fieldName: 'memberName'},
    {label: '配属プロジェクト', fieldName: 'projectName', type: 'text'},
    {label: '1月', fieldName: 'month01', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format01'} }},
    {label: '2月', fieldName: 'month02', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format02'} }},
    {label: '3月', fieldName: 'month03', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format03'} }},
    {label: '4月', fieldName: 'month04', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format04'} }},
    {label: '5月', fieldName: 'month05', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format05'} }},
    {label: '6月', fieldName: 'month06', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format06'} }},
    {label: '7月', fieldName: 'month07', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format07'} }},
    {label: '8月', fieldName: 'month08', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format08'} }},
    {label: '9月', fieldName: 'month09', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format09'} }},
    {label: '10月', fieldName: 'month10', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format10'} }},
    {label: '11月', fieldName: 'month11', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format11'} }},
    {label: '12月', fieldName: 'month12', type: 'text', editable: true , cellAttributes:{class:{fieldName: 'format12'} }},
];

export default class MemberTableCmp extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track data = [];
    @track columns = COLUMNS;
    @track tableLoadingState = true;
    @track tableDisp = false;
    rowOffset = 0;
    isCssLoaded = false
    saveDraftValues = [];

    // コンポーネント作成時イベントメソッド
    // 標準的な初期化処理はここで定義
    connectedCallback() {
        // subscribe to searchKeyChange event
        // memberSerchForm で設定したキーを指定して結果を取得出来るようにpubusubへ登録
        registerListener('searchResult', this.handleResult, this);
    }

    // 後始末はここで定義
    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        // pubsubへの登録を削除
        unregisterAllListeners(this);
    }

    // 描画が終わったタイミングで呼び出される
    renderedCallback(){ 
        if(this.isCssLoaded) return
        this.isCssLoaded = true
        loadStyle(this, COLORS).then(()=>{
            console.log("Loaded Successfully")
        }).catch(error=>{ 
            console.error("Error in loading the colors")
        })
    }

    // ここから使用者側の定義
    // Apexからの検索結果の読み取り箇所
    handleResult(memberList) {
        const data = memberList;
        if(data){
            this.data = data.map(item=>{
                // 稼働率に応じたCSSを設定
                var format01 = this.getCssStyle(item.month01);
                var format02 = this.getCssStyle(item.month02);
                var format03 = this.getCssStyle(item.month03);
                var format04 = this.getCssStyle(item.month04);
                var format05 = this.getCssStyle(item.month05);
                var format06 = this.getCssStyle(item.month06);
                var format07 = this.getCssStyle(item.month07);
                var format08 = this.getCssStyle(item.month08);
                var format09 = this.getCssStyle(item.month09);
                var format10 = this.getCssStyle(item.month10);
                var format11 = this.getCssStyle(item.month11);
                var format12 = this.getCssStyle(item.month12);
                return {...item,
                    'format01' : format01,
                    'format02' : format02,
                    'format03' : format03,
                    'format04' : format04,
                    'format05' : format05,
                    'format06' : format06,
                    'format07' : format07,
                    'format08' : format08,
                    'format09' : format09,
                    'format10' : format10,
                    'format11' : format11,
                    'format12' : format12,
                }
            });
            console.log(this.data)
        }
        // this.data = data;
        this.tableLoadingState = false;
        this.tableDisp = true;

        // ここに絞り込みたい月の情報を抽出したい

        // 
    }

    // 稼働率別の設定するCSSの判定
    getCssStyle(input){
        if(input == 100){
            //  slds-icon-custom-custom12
            return 'slds-text-color_success slds-text-heading_small';
        } else if(input > 0) {
            // return 'slds-text-color_weak';
            return 'member-table-cmp-blue slds-text-heading_medium';
        } else {
            return "slds-text-color_error slds-text-heading_large slds-icon";
        }
    }

    // 保存ボタン押下時のイベント処理
    handleSave(event){
        this.saveDraftValues = event.detail.draftValues;
        console.log(this.saveDraftValues);

        // draftValuesの内容をrecordInputsに展開
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log(recordInputs);

        // 変数名を技術者OBJのものに直す
        const recordInputs2 = recordInputs.map( recordInput =>{
            let field = {};

            const objKeys = Object.keys(recordInput.fields);
            console.log(objKeys);
            // レコードID
            field.Id = recordInput.fields.Id;

            // 1月～12月の変換箇所
            const fieldsObj = recordInput.fields;
            if( fieldsObj.hasOwnProperty('month01') ){
                field.January__c = fieldsObj.month01;
            }
            
            if( fieldsObj.hasOwnProperty('month02') ){																									
                field.February__c = fieldsObj.month02;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month03') ){																									
                field.March__c = fieldsObj.month03;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month04') ){																									
                field.April__c = fieldsObj.month04;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month05') ){																									
                field.May__c = fieldsObj.month05;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month06') ){																									
                field.June__c = fieldsObj.month06;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month07') ){																									
                field.July__c = fieldsObj.month07;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month08') ){																									
                field.August__c = fieldsObj.month08;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month09') ){																									
                field.September__c = fieldsObj.month09;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month10') ){																									
                field.October__c = fieldsObj.month10;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month11') ){																									
                field.November__c = fieldsObj.month11;																									
            }																									
                                                                                                                    
            if( fieldsObj.hasOwnProperty('month12') ){																									
                field.December__c = fieldsObj.month12;																									
            }
            
            // fields プロパティ名を付けて返す
            return { fields : field };
        });
        console.log(recordInputs2);
        

        // Updateing the records using the UiRecordAPi
        const promises = recordInputs2.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.saveDraftValues = [];
            return this.refresh();
        }).catch(error => {
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }

    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
    }

    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.contacts);
    }
}