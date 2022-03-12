public with sharing class MemberController {

    private static final Integer INTEGER_MAX_VALUE = 2147483647;

    public MemberController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<member__c> getMemberList(String memberName, String projectName, String kind) {
        String queryStr = 'select Name, January__c, February__c, March__c, April__c, May__c, June__c, ' + 
        ' July__c, August__c, September__c, October__c, November__c, December__c,' +
        ' ProjectName__c, ProjectName__r.name ' + 
        ' from member__c';

        String queryCond = '';
        queryCond = createConditionSingle(queryCond, memberName, true, true, null, 'Name');
        queryCond = createConditionSingle(queryCond, projectName, true, true, null, 'ProjectName__r.name');
        queryCond = createConditionSingle(queryCond, kind, false, false, null, 'Kind__c');

        if(!String.isBlank(queryCond)){
            queryStr = queryStr + ' WHERE ' + queryCond;
        }

        return Database.query(queryStr);

        // return [
        //     select Name, January__c, February__c, March__c, April__c, May__c, June__c,
        //         July__c, August__c, September__c, October__c, November__c, December__c,
        //         ProjectName__c, ProjectName__r.name  
        //     from member__c
        //     order by Name, ProjectName__r.Name
        // ];
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
