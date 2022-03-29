import { LightningElement, track, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'
import COLORS from '@salesforce/resourceUrl/colors'

const PARENTCOLUMNS = [
    {label: '配属プロジェクト', fieldName: 'projectName', type: 'text'},
    {_children: [], type: COLUMNS},
];
const COLUMNS = [
    {label: '配属プロジェクト', fieldName: 'projectName', type: 'text'},
    {label: '技術者名', fieldName: 'memberName'},
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

export default class TreeGridCmp extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track data = [];
    @track columns = COLUMNS;
    @track tableLoadingState = true;
    @track tableDisp = false;
    rowOffset = 0;
    isCssLoaded = false

    connectedCallback() {
        // subscribe to searchKeyChange event
        registerListener('searchResult2', this.handleResult, this);
    }

    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        unregisterAllListeners(this);
    }

    handleResult(memberList) {

        const data = memberList;
        if(data){
            console.log('data:' + data);
            this.data = data.map(item =>{
                console.log('pj name:' + item.Name);
                let children = [];
                if(item.ProjectName__r){
                    item.ProjectName__r.forEach(mems =>{
                        let member = {};
                        console.log('mems:' + mems.Name);
                        member.memberName = mems.Name;
                        member.projectName = item.Name;
                        member.month01 = String(mems.January__c);
                        member.month02 = String(mems.February__c);
                        member.month03 = String(mems.March__c);
                        member.month04 = String(mems.April__c);
                        member.month05 = String(mems.May__c);
                        member.month06 = String(mems.June__c);
                        member.month07 = String(mems.July__c);
                        member.month08 = String(mems.August__c);
                        member.month09 = String(mems.September__c);
                        member.month10 = String(mems.October__c);
                        member.month11 = String(mems.November__c);
                        member.month12 = String(mems.December__c);

                        member.format01 = this.getCssStyle(member.month01);
                        member.format02 = this.getCssStyle(member.month02);
                        member.format03 = this.getCssStyle(member.month03);
                        member.format04 = this.getCssStyle(member.month04);
                        member.format05 = this.getCssStyle(member.month05);
                        member.format06 = this.getCssStyle(member.month06);
                        member.format07 = this.getCssStyle(member.month07);
                        member.format08 = this.getCssStyle(member.month08);
                        member.format09 = this.getCssStyle(member.month09);
                        member.format10 = this.getCssStyle(member.month10);
                        member.format11 = this.getCssStyle(member.month11);
                        member.format12 = this.getCssStyle(member.month12);
                        children.push(member);

                    });
                }
                return {...item,
                    'projectName' : item.Name,
                    'memberName' : children.length + '名',
                    _children : children
                }
            })
        }

        this.tableLoadingState = false;
        this.tableDisp = true;
    }

    getCssStyle(input){
        //  slds-icon-custom-custom12
        if(input == 100){
            return 'slds-text-color_success slds-text-heading_medium';
        } else if(input > 0) {
            // return 'slds-text-color_weak';
            return 'member-table-cmp-blue slds-text-heading_medium';
        } else {
            return "slds-text-color_error slds-text-heading_medium slds-icon";
        }
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

}