import { LightningElement, track, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'
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


}