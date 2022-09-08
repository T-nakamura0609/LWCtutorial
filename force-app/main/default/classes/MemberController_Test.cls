@isTest
private class MemberController_Test {
    
    @TestSetup
    static void makeData(){
        List<Member__c> members = new List<member__c>();

        member__c member = new member__c();
        member.Name = '山田太郎';
        member.January__c = 10;
        member.February__c = 20;
        member.March__c = 30;
        member.April__c = 40;
        member.May__c = 50;
        member.June__c = 60;
        member.July__c = 70;
        member.August__c = 80;
        member.September__c = 90;
        member.October__c = 100;
        member.November__c = 11;
        member.December__c = 0;
        member.Kind__c = '社員';

        insert member;
    }

    @isTest
    static void testgetMemberList(){
        Test.startTest();
        String memberName = '山田太郎';
        String projectName = '';
        String kind = '';
        List<MemberController.BodyWrapper> result;
        result = MemberController.getMemberList(memberName, projectName, kind);

        Test.stopTest();
    }   

    @isTest
    static void testgetMemberList4(){
        Test.startTest();
        String memberName = '';
        String projectName = '';
        String kind = '社員';
        List<MemberController.BodyWrapper> result4;
        result4 = MemberController.getMemberList(memberName, projectName, kind);

        Test.stopTest();
    } 

    @isTest
    static void testgetMemberList2(){
        Test.startTest();
        String memberName = '';
        String projectName = '';
        String kind = '';
        List<project__c> result2;
        result2 = MemberController.getMemberList2(memberName, projectName, kind);

        Test.stopTest();
    } 


    @isTest
    static void testgetMemberList3(){
        Test.startTest();
        String memberName = '';
        String projectName = '';
        String kind = '';
        List<MemberController.ParentProject> result3;
        result3 = MemberController.getMemberList3(memberName, projectName, kind);

        Test.stopTest();
    }   
}
