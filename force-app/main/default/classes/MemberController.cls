public with sharing class MemberController {

    private static final Integer INTEGER_MAX_VALUE = 2147483647;

    // 検索用SQL
    private static String queryStr = 'select Id, Name, January__c, February__c, March__c, April__c, May__c, June__c, ' + 
        ' July__c, August__c, September__c, October__c, November__c, December__c,' +
        ' ProjectName__c, ProjectName__r.name, ProjectName__r.Id ' + 
        ' from member__c';
    
    public MemberController() {

    }

    // 検索結果をApexとjsで連携する様に用意したDTOクラス
    public class ParentProject {
        @AuraEnabled
        // プロジェクトオブジェクトのレコードID
        public String Id;   
        @AuraEnabled
        // プロジェクト名
        public String projectName;
        @AuraEnabled
        public List<BodyWrapper> members;
    }
    public class BodyWrapper {
        @AuraEnabled
        // 要員オブジェクトのレコードIDの
        public String Id;
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
    }

    // 確認用に3種メソッド作っている
    // テーブル表示用
    @AuraEnabled(cacheable=true)
    public static List<BodyWrapper> getMemberList(String memberName, String projectName, String kind) {
        String queryCond = '';
        queryCond = createConditionSingle(queryCond, memberName, true, true, null, 'Name');
        queryCond = createConditionSingle(queryCond, projectName, true, true, null, 'ProjectName__r.name');
        queryCond = createConditionSingle(queryCond, kind, false, false, null, 'Kind__c');

        if(!String.isBlank(queryCond)){
            queryStr = queryStr + ' WHERE ' + queryCond + ' Order by ProjectName__r.name';
            // queryStr = queryStr + ' WHERE ' + queryCond;
        }

        List<BodyWrapper> result = new List<BodyWrapper>();
        
        // List<member__c> members = Database.query(queryStr);
        
        // Database#query でSQLを実行
        for (member__c member : Database.query(queryStr)) {
            BodyWrapper bw = new BodyWrapper();
            bw.Id = member.Id;
            bw.memberName = member.Name;
            bw.projectName = (member.ProjectName__r.Name == null) ? 'PJ未設定': member.ProjectName__r.Name;
            // 稼働率が空欄を許容しているのでnull時はゼロとしてjs側では何らかの値が設定されている前提で実装
            // 読み方がわからない人は三項演算子でググれ
            bw.month01 = (member.January__c == null) ? '0': member.January__c.format();
            bw.month02 = (member.February__c == null) ? '0': member.February__c.format();
            bw.month03 = (member.March__c == null) ? '0': member.March__c.format();
            bw.month04 = (member.April__c == null) ? '0': member.April__c.format();
            bw.month05 = (member.May__c == null) ? '0': member.May__c.format();
            bw.month06 = (member.June__c == null) ? '0': member.June__c.format();
            bw.month07 = (member.July__c == null) ? '0': member.July__c.format();
            bw.month08 = (member.August__c == null) ? '0': member.August__c.format();
            bw.month09 = (member.September__c == null) ? '0': member.September__c.format();
            bw.month10 = (member.October__c == null) ? '0': member.October__c.format();
            bw.month11 = (member.November__c == null) ? '0': member.November__c.format();
            bw.month12 = (member.December__c == null) ? '0': member.December__c.format();

            result.add(bw);
        }

        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<project__c> getMemberList2(String memberName, String projectName, String kind) {
        String queryStr = 'select Id, name, ( select Id, Name, January__c, February__c, March__c, April__c, May__c, June__c, ' + 
        ' July__c, August__c, September__c, October__c, November__c, December__c,' +
        ' ProjectName__c, ProjectName__r.name ' + 
        ' from ProjectName__r ) from project__c';
        
        String queryCond = '';
        queryCond = createConditionSingle(queryCond, memberName, true, true, null, 'Name');
        queryCond = createConditionSingle(queryCond, projectName, true, true, null, 'name');
        queryCond = createConditionSingle(queryCond, kind, false, false, null, 'Kind__c');

        if(!String.isBlank(queryCond)){
            queryStr = queryStr + ' WHERE ' + queryCond + ' Order by name';
        }
        System.debug('Query:' + queryStr);

        Map<String, List<BodyWrapper>> workmap = new Map<String, List<BodyWrapper>>();
        List<ParentProject> worklist = new List<ParentProject>();
        
        List<project__c> pjlist = Database.query(queryStr);
        System.debug('pjlist size:' + pjlist.size());
        for (project__c pj : pjlist) {
            System.debug('pj name:' + pj.name);
            System.debug('member size:' + pj.ProjectName__r.size());
            for(member__c member : pj.ProjectName__r){
                member.January__c = (member.January__c == null) ? 0: member.January__c;
                member.February__c = (member.February__c == null) ? 0: member.February__c;
                member.March__c = (member.March__c == null) ? 0: member.March__c;
                member.April__c = (member.April__c == null) ? 0: member.April__c;
                member.May__c = (member.May__c == null) ? 0: member.May__c;
                member.June__c = (member.June__c == null) ? 0: member.June__c;
                member.July__c = (member.July__c == null) ? 0: member.July__c;
                member.August__c = (member.August__c == null) ? 0: member.August__c;
                member.September__c = (member.September__c == null) ? 0: member.September__c;
                member.October__c = (member.October__c == null) ? 0: member.October__c;
                member.November__c = (member.November__c == null) ? 0: member.November__c;
                member.December__c = (member.December__c == null) ? 0: member.December__c;
            }
        }
        return pjlist;

    }

    // ツリー表示用
    @AuraEnabled(cacheable=true)
    public static List<ParentProject> getMemberList3(String memberName, String projectName, String kind) {
        // String queryStr = 'select Id, name, ( select Id, Name, January__c, February__c, March__c, April__c, May__c, June__c, ' + 
        // ' July__c, August__c, September__c, October__c, November__c, December__c,' +
        // ' ProjectName__c, ProjectName__r.name ' + 
        // ' from ProjectName__r ) from project__c';
        
        String queryCond = '';
        queryCond = createConditionSingle(queryCond, memberName, true, true, null, 'Name');
        queryCond = createConditionSingle(queryCond, projectName, true, true, null, 'ProjectName__r.name');
        queryCond = createConditionSingle(queryCond, kind, false, false, null, 'Kind__c');

        if(!String.isBlank(queryCond)){
            queryStr = queryStr + ' WHERE ' + queryCond + ' Order by ProjectName__r.name';
        }
        System.debug('Query:' + queryStr);

        Map<String, List<BodyWrapper>> workmap = new Map<String, List<BodyWrapper>>();
        List<ParentProject> worklist = new List<ParentProject>();
        
        for (member__c member : Database.query(queryStr)) {
            // ここでサブクラスに再格納とCSSの設定
            // ツリーの場合はIdが必要
            BodyWrapper bw = new BodyWrapper();
            bw.Id = member.Id;
            bw.memberName = member.Name;
            bw.projectName = (member.ProjectName__r.Name == null) ? 'PJ未設定': member.ProjectName__r.Name;
            bw.month01 = (member.January__c == null) ? '0': member.January__c.format();
            bw.month02 = (member.February__c == null) ? '0': member.February__c.format();
            bw.month03 = (member.March__c == null) ? '0': member.March__c.format();
            bw.month04 = (member.April__c == null) ? '0': member.April__c.format();
            bw.month05 = (member.May__c == null) ? '0': member.May__c.format();
            bw.month06 = (member.June__c == null) ? '0': member.June__c.format();
            bw.month07 = (member.July__c == null) ? '0': member.July__c.format();
            bw.month08 = (member.August__c == null) ? '0': member.August__c.format();
            bw.month09 = (member.September__c == null) ? '0': member.September__c.format();
            bw.month10 = (member.October__c == null) ? '0': member.October__c.format();
            bw.month11 = (member.November__c == null) ? '0': member.November__c.format();
            bw.month12 = (member.December__c == null) ? '0': member.December__c.format();

            // 一旦Mapにプロジェクト毎にまとめる
            if(workmap.containsKey(bw.projectName)){
                workmap.get(bw.projectName).add(bw);
            }else {
                List<BodyWrapper> wklist = new List<BodyWrapper>();
                workmap.put(bw.projectName, wklist);
                workmap.get(bw.projectName).add(bw);

                ParentProject ppwork = new ParentProject();
                // ppwork.Id = member.ProjectName__c;
                ppwork.Id = bw.projectName;
                ppwork.projectName = bw.projectName;
                ppwork.members = wklist;
                
                // 最後にリストに変換して返す
                worklist.add(ppwork);
            }
        }
        return worklist;
    }

    // 検索欄の内容をSQL用に変換している どこかのサイトからコピーしてきたもの
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
