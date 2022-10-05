import { LightningElement, track, wire, api } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'

import { refreshApex } from '@salesforce/apex';
import { updateRecord, getRecordNotifyChange  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import COLORS from '@salesforce/resourceUrl/colors'

import getMemberList from '@salesforce/apex/MemberController.getMemberList';
import { fireEvent } from 'c/pubsub';

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

    // @wire(getMemberList) memberWire;

    @track data = [];
    @track columns = COLUMNS;
    @track tableLoadingState = true;
    @track tableDisp = false;
    rowOffset = 0;
    isCssLoaded = false
    saveDraftValues = [];

    // 2220729_期間指定開発
    // 一時期間指定数の定義
    startM;
    endM;
    // コンポーネント作成時イベントメソッド
    // 標準的な初期化処理はここで定義
    connectedCallback() {
        // subscribe to searchKeyChange event
        // memberSerchForm で設定したキーを指定して結果を取得出来るようにpubusubへ登録
        registerListener('searchMonth', this.handleResult2, this);
        registerListener('searchResult', this.handleResult, this);
    }

    handleResult2(params) {
        this.startM = params.Periodbegin;
        this.endM = params.Periodend;
        console.log('startM' + startM);
        console.log('endM' + endM);
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

        // 2220729_期間指定開発
        // 期間指定数キーの定義
        var m01 = 1;
        var m02 = 2;
        var m03 = 3;
        var m04 = 4;
        var m05 = 5;
        var m06 = 6;
        var m07 = 7;
        var m08 = 8;
        var m09 = 9;
        var m10 = 10;
        var m11 = 11;
        var m12 = 12;

        let field1 = {};

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

                // 2220729_期間指定開発
                if (this.startM <= m01 && this.endM >= m01) {
                    field1.format01 = format01
                };
                if (this.startM <= m02 && this.endM >= m02) {
                    field1.format02 = format02
                };
                if (this.startM <= m03 && this.endM >= m03) {
                    field1.format03 = format03
                };
                if (this.startM <= m04 && this.endM >= m04) {
                    field1.format04 = format04
                };
                if (this.startM <= m05 && this.endM >= m05) {
                    field1.format05 = format05
                };
                if (this.startM <= m06 && this.endM >= m06) {
                    field1.format06 = format06
                };
                if (this.startM <= m07 && this.endM >= m07) {
                    field1.format07 = format07
                };
                if (this.startM <= m08 && this.endM >= m08) {
                    field1.format08 = format08
                };
                if (this.startM <= m09 && this.endM >= m09) {
                    field1.format09 = format09
                };
                if (this.startM <= m10 && this.endM >= m10) {
                    field1.format10 = format10
                };
                if (this.startM <= m11 && this.endM >= m11) {
                    field1.format11 = format11
                };
                if (this.startM <= m12 && this.endM >= m12) {
                    field1.format12 = format12
                };

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
        // 2220729_期間指定開発
        // colums絞り込み

        let COLUMNS1 = [{ label: '技術者名', fieldName: 'memberName' },
            { label: '配属プロジェクト', fieldName: 'projectName', type: 'text' },
        ];

        // 20220915 期間選択年またぎ
        // if=trueは開始4月-12、終了4-12月の間のパターン
        // elseifは開始4月-12、終了1-3月の間のパターン
        // elseは開始1月-3、終了1-3月の間のパターン
        if (4 <= this.startM && this.startM <= 12 && 4 <= this.endM && this.endM <= 12) {

        if (this.startM <= m04 && this.endM >= m04) {
            COLUMNS1.push({ label: '4月', fieldName: 'month04', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format04' } } });
        };
        if (this.startM <= m05 && this.endM >= m05) {
            COLUMNS1.push({ label: '5月', fieldName: 'month05', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format05' } } });
        };
        if (this.startM <= m06 && this.endM >= m06) {
            COLUMNS1.push({ label: '6月', fieldName: 'month06', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format06' } } });
        };
        if (this.startM <= m07 && this.endM >= m07) {
            COLUMNS1.push({ label: '7月', fieldName: 'month07', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format07' } } });
        };
        if (this.startM <= m08 && this.endM >= m08) {
            COLUMNS1.push({ label: '8月', fieldName: 'month08', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format08' } } });
        };
        if (this.startM <= m09 && this.endM >= m09) {
            COLUMNS1.push({ label: '9月', fieldName: 'month09', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format09' } } });
        };
        if (this.startM <= m10 && this.endM >= m10) {
            COLUMNS1.push({ label: '10月', fieldName: 'month10', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format10' } } });
        };
        if (this.startM <= m11 && this.endM >= m11) {
            COLUMNS1.push({ label: '11月', fieldName: 'month11', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format11' } } });
        };
        if (this.startM <= m12 && this.endM >= m12) {
            COLUMNS1.push({ label: '12月', fieldName: 'month12', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format12' } } });
        };

        } else if (4 <= this.startM && this.startM <= 12 && 1 <= this.endM && this.endM <= 3) {

            if (this.startM <= m04) {
                COLUMNS1.push({ label: '4月', fieldName: 'month04', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format04' } } });
            };
            if (this.startM <= m05) {
                COLUMNS1.push({ label: '5月', fieldName: 'month05', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format05' } } });
            };
            if (this.startM <= m06) {
                COLUMNS1.push({ label: '6月', fieldName: 'month06', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format06' } } });
            };
            if (this.startM <= m07) {
                COLUMNS1.push({ label: '7月', fieldName: 'month07', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format07' } } });
            };
            if (this.startM <= m08) {
                COLUMNS1.push({ label: '8月', fieldName: 'month08', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format08' } } });
            };
            if (this.startM <= m09) {
                COLUMNS1.push({ label: '9月', fieldName: 'month09', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format09' } } });
            };
            if (this.startM <= m10) {
                COLUMNS1.push({ label: '10月', fieldName: 'month10', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format10' } } });
            };
            if (this.startM <= m11) {
                COLUMNS1.push({ label: '11月', fieldName: 'month11', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format11' } } });
            };
            if (this.startM <= m12) {
                COLUMNS1.push({ label: '12月', fieldName: 'month12', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format12' } } });
            };

            if (this.endM >= m01) {
                COLUMNS1.push({ label: '1月', fieldName: 'month01', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format01' } } });
            };
            if (this.endM >= m02) {
                COLUMNS1.push({ label: '2月', fieldName: 'month02', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format02' } } });
            };
            if (this.endM >= m03) {
                COLUMNS1.push({ label: '3月', fieldName: 'month03', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format03' } } });
            };

        } else {

            if (this.startM <= m01 && this.endM >= m01) {
                COLUMNS1.push({ label: '1月', fieldName: 'month01', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format01' } } });
            };
            if (this.startM <= m02 && this.endM >= m02) {
                COLUMNS1.push({ label: '2月', fieldName: 'month02', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format02' } } });
            };
            if (this.startM <= m03 && this.endM >= m03) {
                COLUMNS1.push({ label: '3月', fieldName: 'month03', type: 'text', editable: true, cellAttributes: { class: { fieldName: 'format03' } } });
            };

        }

        // this.COLUMNS2 = COLUMNS1;
        this.columns = COLUMNS1;
        // 
    }

    // 稼働率別の設定するCSSの判定
    getCssStyle(input){
        if(input == 100){
            //  slds-icon-custom-custom12
            return 'slds-text-color_success slds-text-heading_small';
        } else if(input > 0) {
            // return 'slds-text-color_weak';
            return 'member-table-cmp-blue slds-text-heading_small';
        } else {
            return "slds-text-color_error slds-text-heading_small slds-icon";
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
            return this.refresh(recordInputs2);
        }).catch(error => {
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });

        // const updateRecords = recordInputs2.map(data => {
        //     return { recordId: data.fields.Id};
        // });
        // getRecordNotifyChange(updateRecords);
        

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
    async refresh(records) {
        // await refreshApex(this.memberWire);
        
        
        const updateRecords = records.map(data => {
            return { recordId: data.fields.Id};
        });
        
        // fireEvent( this.pageRef, 'refresh', this.data);
        getRecordNotifyChange(updateRecords);
    }
}