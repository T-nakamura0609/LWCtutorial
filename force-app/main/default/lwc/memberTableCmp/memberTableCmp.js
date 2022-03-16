import { LightningElement, track, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'
import COLORS from '@salesforce/resourceUrl/colors'

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

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('searchResult', this.handleResult, this);
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    handleResult(memberList) {
        const data = memberList;
        this.data = data;
        this.tableLoadingState = false;
        this.tableDisp = true;
    }

    renderedCallback(){ 
        if(this.isCssLoaded) return
        this.isCssLoaded = true
        loadStyle(this, COLORS).then(()=>{
            console.log("Loaded Successfully")
        }).catch(error=>{ 
            console.error("Error in loading the colors")
        })
    }
    // columns = COLUMNS;
    // @wire(getMemberList)
    // members;
}