import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getMemberList from '@salesforce/apex/MemberController.getMemberList';
import getMemberList2 from '@salesforce/apex/MemberController.getMemberList2';
import { fireEvent } from 'c/pubsub';

export default class MemberSerchForm extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track memberName = "";
    @track projectName = "";
    @track type = "";
    @track dunsNumber =""

    get options() {
        return [
            { label: '社員', value: '社員' },
            { label: '協力会社', value: '協力会社' },
            { label: '全て', value: '' },
            // { label: 'Customer - Direct', value: 'Customer - Direct' },
            // { label: 'Customer - Channel', value: 'Customer - Channel' },
            // { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller' },
            // { label: 'Installation Partner', value: 'Installation Partner' },
            // { label: 'Technology Partner', value: 'Technology Partner' },
            // { label: 'Other', value: 'Other' }
        ];
    }

    handleAccountNameChange(event) {
        this.memberName = event.detail.value;
    }

    handlePhoneChange(event) {
        this.projectName = event.detail.value;
    }

    handleTypeChange(event) {
        this.type = event.detail.value;
    }
    
    handleDunsNumberChange(event) {
        this.dunsNumber = event.detail.value;
    }

    handleSearch() {
        let params = {};
        params.memberName = this.memberName;
        params.projectName = this.projectName;
        params.kind = this.type;
        // params.dunsNumber = this.dunsNumber;

        let pageRef = this.pageRef;
        getMemberList2(params)
            .then(result => {
                fireEvent(pageRef, 'searchResult', result);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
    }
}