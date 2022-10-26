import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

// 呼び出したしApexクラスのメソッド
import getMemberList from '@salesforce/apex/MemberController.getMemberList';
import getMemberList2 from '@salesforce/apex/MemberController.getMemberList2';
import getMemberList3 from '@salesforce/apex/MemberController.getMemberList3';

// コンポーネント間連携用コンポーネント
import { fireEvent } from 'c/pubsub';

export default class MemberSerchForm extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track projectName = "";
    @track memberName = "";
    @track type = "";
    @track dunsNumber ="";
    @track Periodbegin = "";
    @track Periodend = "";

    connectedCallback() {
        registerListener('refresh', this.refresh, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    // Typeプルダウンのリスト内容
    // labelが表示用の名称
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

    // Periodbeginプルダウンのリスト内容(石川)
    // labelが表示用の名称(石川)
    get optionbegin() {
            return [
                { label: '1月', value: '1' },
                { label: '2月', value: '2' },
                { label: '3月', value: '3' },
                { label: '4月', value: '4' },
                { label: '5月', value: '5' },
                { label: '6月', value: '6' },
                { label: '7月', value: '7' },
                { label: '8月', value: '8' },
                { label: '9月', value: '9' },
                { label: '10月', value: '10' },
                { label: '11月', value: '11' },
                { label: '12月', value: '12' },
            ];
        }
        // Periodendプルダウンのリスト内容(石川)
        // labelが表示用の名称(石川)
    get optionend() {
        return [
            { label: '1月', value: '1' },
            { label: '2月', value: '2' },
            { label: '3月', value: '3' },
            { label: '4月', value: '4' },
            { label: '5月', value: '5' },
            { label: '6月', value: '6' },
            { label: '7月', value: '7' },
            { label: '8月', value: '8' },
            { label: '9月', value: '9' },
            { label: '10月', value: '10' },
            { label: '11月', value: '11' },
            { label: '12月', value: '12' },
        ];
    }


    // 各検索項目に設定した内容を捕捉する
    // HTML側の onchange で定義したメソッドが呼ばれる
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

    handlePeriodbeginChange(event) {
        this.Periodbegin = event.detail.value;
    }

    handlePeriodendChange(event) {
        this.Periodend = event.detail.value;
    }

    //

    // @track response;

    @wire(getMemberList, {memberName: '$memberName', projectName: '$projectName', kind: '$type', ContractPrice: '$ContractPrice', OutsourcingPrice: 'OutsourcingPrice'})
    readTable(result){
        if(result.data){
            // this.response = result.data;
            fireEvent(this.pageRef, 'searchResult', result.data);
        }
        if(result.error){
            this.error = undefined;
        }
    }

    async refresh(hoge) {
        await refreshApex(this.readTable);
        // await refreshApex(this.handleSearch);
    }

    // Search ボタンのクリックイベント
    handleSearch(hoge) {
        // 画面の各入力欄に登録した内容をparamsに格納
        let params = {};
        params.memberName = this.memberName;
        params.projectName = this.projectName;
        params.ContractPrice = this.ContractPrice;
        params.OutsourcingPrice = this.OutsourcingPrice;
        params.kind = this.type;
        // params.dunsNumber = this.dunsNumber;

        params.Periodbegin = this.Periodbegin;
        params.Periodend = this.Periodend;
        // pubsubクラスを介して他コンポーネントと連携
        let pageRef = this.pageRef;

        // tabelCmpに受け渡すためのメソッド 
        fireEvent(pageRef, 'searchMonth', params);

        // Apex MemberController#getMemberList呼出
        getMemberList(params)
            .then(result => {
                // Apexの結果を コンポーネントmemberTableCmpへ渡す
                // コンポーネント間はsearchResultのキーで連携する
                // fireEventはpubsubが提供しているメソッド
                // this.response = result;
                fireEvent(pageRef, 'searchResult', result);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
            
        getMemberList2(params)
            .then(result => {
                fireEvent(pageRef, 'searchResult2', result);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
        
        getMemberList3(params)
            .then(result => {
                fireEvent(pageRef, 'searchResult3', result);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
    }

    landleUpdate() {

    }
}