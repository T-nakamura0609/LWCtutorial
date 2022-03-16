public with sharing class MemberController {

    private static final Integer INTEGER_MAX_VALUE = 2147483647;

    private static String queryStr = 'select Name, January__c, February__c, March__c, April__c, May__c, June__c, ' + 
        ' July__c, August__c, September__c, October__c, November__c, December__c,' +
        ' ProjectName__c, ProjectName__r.name ' + 
        ' from member__c';
    
    public MemberController() {

    }

    public class BodyWrapper {
        @AuraEnabled
        public String memberName;
        @AuraEnabled
        public String projectName;
        @AuraEnabled
        public String month01;
        @AuraEnabled
        public String month02;
        @AuraEnabled
        public String month03;
        @AuraEnabled
        public String month04;
        @AuraEnabled
        public String month05;
        @AuraEnabled
        public String month06;
        @AuraEnabled
        public String month07;
        @AuraEnabled
        public String month08;
        @AuraEnabled
        public String month09;
        @AuraEnabled
        public String month10;
        @AuraEnabled
        public String month11;
        @AuraEnabled
        public String month12;

        // 以下css定義
        @AuraEnabled
        public String format01;
        @AuraEnabled
        public String format02;
        @AuraEnabled
        public String format03;
        @AuraEnabled
        public String format04;
        @AuraEnabled
        public String format05;
        @AuraEnabled
        public String format06;
        @AuraEnabled
        public String format07;
        @AuraEnabled
        public String format08;
        @AuraEnabled
        public String format09;
        @AuraEnabled
        public String format10;
        @AuraEnabled
        public String format11;
        @AuraEnabled
        public String format12;
    }

    @AuraEnabled(cacheable=true)
    public static List<BodyWrapper> getMemberList(String memberName, String projectName, String kind) {
        String queryCond = '';
        queryCond = createConditionSingle(queryCond, memberName, true, true, null, 'Name');
        queryCond = createConditionSingle(queryCond, projectName, true, true, null, 'ProjectName__r.name');
        queryCond = createConditionSingle(queryCond, kind, false, false, null, 'Kind__c');

        if(!String.isBlank(queryCond)){
            queryStr = queryStr + ' WHERE ' + queryCond;
        }

        List<BodyWrapper> result = new List<BodyWrapper>();
        List<member__c> members = Database.query(queryStr);
        for (member__c member : members) {
            // ここでサブクラスに再格納とCSSの設定
            BodyWrapper bw = new BodyWrapper();
            bw.memberName = member.Name;
            bw.projectName = member.ProjectName__r.Name;
            bw.month01 = (member.January__c == null) ? '0': member.January__c.format();
            bw.format01 = getCssStyle(member.January__c);
            bw.month02 = (member.February__c == null) ? '0': member.February__c.format();
            bw.format02 = getCssStyle(member.February__c);
            bw.month03 = (member.March__c == null) ? '0': member.March__c.format();
            bw.format03 = getCssStyle(member.March__c);
            bw.month04 = (member.April__c == null) ? '0': member.April__c.format();
            bw.format04 = getCssStyle(member.April__c);
            bw.month05 = (member.May__c == null) ? '0': member.May__c.format();
            bw.format05 = getCssStyle(member.May__c);
            bw.month06 = (member.June__c == null) ? '0': member.June__c.format();
            bw.format06 = getCssStyle(member.June__c);
            bw.month07 = (member.July__c == null) ? '0': member.July__c.format();
            bw.format07 = getCssStyle(member.July__c);
            bw.month08 = (member.August__c == null) ? '0': member.August__c.format();
            bw.format08 = getCssStyle(member.August__c);
            bw.month09 = (member.September__c == null) ? '0': member.September__c.format();
            bw.format09 = getCssStyle(member.September__c);
            bw.month10 = (member.October__c == null) ? '0': member.October__c.format();
            bw.format10 = getCssStyle(member.October__c);
            bw.month11 = (member.November__c == null) ? '0': member.November__c.format();
            bw.format11 = getCssStyle(member.November__c);
            bw.month12 = (member.December__c == null) ? '0': member.December__c.format();
            bw.format12 = getCssStyle(member.December__c);

            result.add(bw);
        }

        return result;
    }
        private static String getCssStyle(Decimal input) {
            if(input == 100){
                return 'slds-text-color_success slds-text-heading_small';
            } else if(input > 0) {
                // return 'slds-text-color_weak';
                return 'member-table-cmp-blue slds-text-heading_medium';
            } else {
                return 'slds-text-color_error slds-text-heading_large';
            }
        }

    private static String createConditionSingle(
        String prevCond, String searchString, Boolean preLike, Boolean postLike, Decimal searchNumeric, String fieldName ) {
        
        String queryCond = '';
        if ( !String.isBlank( prevCond ) ) {
            queryCond = prevCond;
        }
        if ( !String.isBlank( searchString ) || searchNumeric != null ) {
            if ( !String.isBlank( queryCond ) ) {
                queryCond += ' AND ';
            }
            if ( searchNumeric != null ) {
                String searchValue = String.valueOf( searchNumeric );
                // Integer 型の最大値を超えている場合は「.0」を付加して Double 型と認識させる
                if ( searchNumeric > INTEGER_MAX_VALUE ) {
                    searchValue += '.0';
                }
                queryCond +=
                    '( ' + fieldName + ' = ' + searchValue + ' )';
            } else {
                String eqOrLike = ( preLike || postLike ? ' LIKE ' : ' = ' );
                String preLikeChar = ( preLike ? '%' : '' );
                String postLikeChar = ( postLike ? '%' : '' );
                queryCond +=
                    '( ' + fieldName + eqOrLike + '\'' + preLikeChar +
                    String.escapeSingleQuotes( searchString ) + postLikeChar + '\' )';
            }
        }
        return queryCond;
    }
}
