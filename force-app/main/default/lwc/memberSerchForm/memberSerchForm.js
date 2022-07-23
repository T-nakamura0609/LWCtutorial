import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

// 呼び出したしApexクラスのメソッド
import getMemberList from '@salesforce/apex/MemberController.getMemberList';
import getMemberList2 from '@salesforce/apex/MemberController.getMemberList2';
import getMemberList3 from '@salesforce/apex/MemberController.getMemberList3';

// コンポーネント間連携用コンポーネント
import { fireEvent } from 'c/pubsub';

export default class MemberSerchForm extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track memberName = "";
    @track projectName = "";
    @track type = "";
    @track dunsNumber =""

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

    // Search ボタンのクリックイベント
    handleSearch() {
        // 画面の各入力欄に登録した内容をparamsに格納
        let params = {};
        params.memberName = this.memberName;
        params.projectName = this.projectName;
        params.kind = this.type;
        // params.dunsNumber = this.dunsNumber;

        // pubsubクラスを介して他コンポーネントと連携
        let pageRef = this.pageRef;

        // Apex MemberController#getMemberList呼出
        getMemberList(params)
            .then(result => {
                // Apexの結果を コンポーネントmemberTableCmpへ渡す
                // コンポーネント間はsearchResultのキーで連携する
                // fireEventはpubsubが提供しているメソッド
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