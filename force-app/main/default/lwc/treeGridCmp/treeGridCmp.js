import { LightningElement, track, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import {loadStyle} from 'lightning/platformResourceLoader'
import COLORS from '@salesforce/resourceUrl/colors'

// const PARENTCOLUMNS = [
//     {label: '配属プロジェクト', fieldName: 'projectName', type: 'text'},
//     {_children: [], type: COLUMNS},
// ];
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
        // registerListener('searchResult2', this.handleResult, this);
        registerListener('searchResult3', this.handleResult2, this);
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
                let members = [];
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
                        members.push(member);

                    });
                }

                return {...item,
                    'projectName' : item.Name,
                    'memberName' : members.length + '名',
                    _children : members
                }
            })
            
        }

        // デバグ用にコンソールログへ出力
        this.data.forEach(record =>{
            console.log('projectName:' + record.projectName);
            console.log('memberName:' + record.memberName);
            console.log('memberNum:' + record._children.length);
            if(record._children){
                record._children.forEach(chld =>{
                    console.log('name:' + chld.memberName);
                    console.log('m01:' + chld.month01);
                    console.log('m12:' + chld.month12);
                })
            }
        })

        this.tableLoadingState = false;
        this.tableDisp = true;
    }

    handleResult2(memberList) {

        let data = memberList;
        if(data){
            console.log('data:' + data);
            this.data = data.map(item =>{
                console.log('pj name:' + item.projectName);
                let members = [];
                if(item.members){
                    item.members.forEach(mems =>{
                        let member = {};
                        console.log('mems name:' + mems.memberName);
                        // console.log('mems pjnm:' + mems.projectName);
                        member.memberName = mems.memberName;
                        member.projectName = mems.projectName;

                        member.month01 = mems.month01
                        member.month02 = mems.month02
                        member.month03 = mems.month03
                        member.month04 = mems.month04
                        member.month05 = mems.month05
                        member.month06 = mems.month06
                        member.month07 = mems.month07
                        member.month08 = mems.month08
                        member.month09 = mems.month09
                        member.month10 = mems.month10
                        member.month11 = mems.month11
                        member.month12 = mems.month12
                        
                        member.format01 = this.getCssStyle(mems.month01);
                        member.format02 = this.getCssStyle(mems.month02);
                        member.format03 = this.getCssStyle(mems.month03);
                        member.format04 = this.getCssStyle(mems.month04);
                        member.format05 = this.getCssStyle(mems.month05);
                        member.format06 = this.getCssStyle(mems.month06);
                        member.format07 = this.getCssStyle(mems.month07);
                        member.format08 = this.getCssStyle(mems.month08);
                        member.format09 = this.getCssStyle(mems.month09);
                        member.format10 = this.getCssStyle(mems.month10);
                        member.format11 = this.getCssStyle(mems.month11);
                        member.format12 = this.getCssStyle(mems.month12);
                        members.push(member);

                    });
                }
                // Apex側でアレコレ構造を変えても結局js側で
                // _children の属性を付けないとツリーとして表示されない
                return {...item,
                    'projectName' : item.projectName,
                    'memberName' : members.length + '名',
                    _children : members
                }
            })
        }

        // デバグ用にコンソールログへ出力
        this.data.forEach(record =>{
            console.log('projectName:' + record.projectName);
            console.log('memberName:' + record.memberName);
            console.log('memberNum:' + record._children.length);
            if(record._children){
                record._children.forEach(chld =>{
                    console.log('name:' + chld.memberName);
                    console.log('m01:' + chld.month01);
                    console.log('m12:' + chld.month12);
                })
            }
        })

        this.tableLoadingState = false;
        this.tableDisp = true;
    }

    getCssStyle(input){
        //  slds-icon-custom-custom12
        if(input == 100){
            return 'slds-text-color_success slds-text-heading_small';
        } else if(input > 0) {
            // return 'slds-text-color_weak';
            return 'member-table-cmp-blue slds-text-heading_small';
        } else {
            return "slds-text-color_error slds-text-heading_small";
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