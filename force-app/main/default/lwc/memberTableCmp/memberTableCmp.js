import { LightningElement, track, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import NAME_FIELD from '@salesforce/schema/member__c.Name';
import M01_FIELD from '@salesforce/schema/member__c.January__c';
import M02_FIELD from '@salesforce/schema/member__c.February__c';
import M03_FIELD from '@salesforce/schema/member__c.March__c';
import M04_FIELD from '@salesforce/schema/member__c.April__c';
import M05_FIELD from '@salesforce/schema/member__c.May__c';
import M06_FIELD from '@salesforce/schema/member__c.June__c';
import M07_FIELD from '@salesforce/schema/member__c.July__c';
import M08_FIELD from '@salesforce/schema/member__c.August__c';
import M09_FIELD from '@salesforce/schema/member__c.September__c';
import M10_FIELD from '@salesforce/schema/member__c.October__c';
import M11_FIELD from '@salesforce/schema/member__c.November__c';
import M12_FIELD from '@salesforce/schema/member__c.December__c';
import PJNAME_FIELD from '@salesforce/schema/member__c.ProjectName__r.Name';

const COLUMNS = [
    {label: 'Member Name', fieldName: NAME_FIELD.fieldApiName, type: 'text'},
    {label: 'Project Name', fieldName: PJNAME_FIELD.fieldApiName, type: 'text'},
    {label: '1月', fieldName: M01_FIELD.fieldApiName, type: 'text', editable: true , cellAttributes:{class: 'slds-text-color_success slds-text-title_caps'}},
    {label: '2月', fieldName: M02_FIELD.fieldApiName, type: 'text', editable: true , cellAttributes:{class: 'member-table-cmp'}},
    {label: '3月', fieldName: M03_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '4月', fieldName: M04_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '5月', fieldName: M05_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '6月', fieldName: M06_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '7月', fieldName: M07_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '8月', fieldName: M08_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '9月', fieldName: M09_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '10月', fieldName: M10_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '11月', fieldName: M11_FIELD.fieldApiName, type: 'text', editable: true },
    {label: '12月', fieldName: M12_FIELD.fieldApiName, type: 'text', editable: true },
];

const COLUMNS2 = [
    {label: 'Member Name', fieldName: 'memberName'},
    {label: 'Project Name', fieldName: 'projectName', type: 'text'},
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
    @track columns = COLUMNS2;
    @track tableLoadingState = true;
    @track tableDisp = false;
    rowOffset = 0;

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

    // columns = COLUMNS;
    // @wire(getMemberList)
    // members;
}