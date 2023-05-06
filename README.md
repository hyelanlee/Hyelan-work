===================
 # 화면 네이밍 규칙
===================

 ※ 해당 약어 + 이름 (카멜케이스) 

 예) ref      : refRdoTest
     useState : rdoTest

 > 날짜
  - date

 > 체크박스
  - chk

 > 콤보박스
  - cbo

 > 라디오
  - rdo

 > 에디트(마스크)
  - edt

 > 텍스트
  - txt  

 > 버튼
  - btn    

 > 팝업(다이얼로그)
  - pop

 > 폼
  - frm

 > 레아아웃
  - lay

 > 페이징
  - pag

 > DIV, BOX, PANEL
  - box

 > 프로그레스바
  - prb

 > 탭
  - tab

===================
 # 메뉴 권한 테이블
===================
 > TPgmMenu [메뉴목록]
     INSERT INTO TPgmMenu
           (Factory
           ,PgmId
           ,PgmNm
           ,PgmGb
           ,Dept
           ,SortNo
           ,CrePno
           ,CreDate
           ,ModPno
           ,ModDate)
     VALUES
           ('A00'
           ,[프로그램아이디]
           ,[프로그램명]
           ,[프로그램업무구분]
           ,''
           ,1
           ,[등록자]
           ,GETDATE()
           ,''
           ,GETDATE())

 > TPgmMenuAuth [사용자별메뉴권한]
    INSERT INTO TPgmMenuAuth
           (Factory
           ,Pno
           ,PgmId
           ,CrePno
           ,CreDate)
     VALUES
           ('A00'
           ,[사용자아이디]
           ,[프로그램아이디]
           ,[등록자]
           ,GETDATE()) 

 > TPgmRole [상세권한목록]
    INSERT INTO TPgmRole
           (Factory
           ,PgmId
           ,RoleId
           ,RoleNm
           ,SortNo
           ,CrePno
           ,CreDate
           ,ModPno
           ,ModDate)
     VALUES
           ('A00'
           ,[프로그램아이디]
           ,[상세권한아이디]
           ,[상세권한명]
           ,1
           ,[등록자]
           ,GETDATE()
           ,''
           ,GETDATE())

 > TPgmRoleAuth [사용자별상세권한]
    INSERT INTO TPgmRoleAuth
           (Factory
           ,Pno
           ,PgmId
           ,RoleId
           ,CrePno
           ,CreDate)
     VALUES
           ('A00'
           ,[사용자아이디]
           ,[프로그램아이디]
           ,[상세권한아이디]
           ,[등록자]
           ,GETDATE())  


===================
 # 전체 권한 대상자
===================
 SELECT a.*
   FROM (
         SELECT Pno, Name, DeptName
           FROM TMAN
          WHERE ISNULL(RetiYmd, '') = ''
            AND DeptName IN ('생산관리팀', '영업팀', '연구개발팀', '경영지원팀', '품질경영팀')
            AND Pno NOT IN ('K0047') 
 
          UNION ALL

         SELECT Pno, UserName, ''
           FROM TPassword
          WHERE Pno IN ('10007', '10035')
        ) a
  ORDER BY a.DeptName 


===================
 # 프로그램 목록
===================
 > 영업 (BUSINESS)
  - 수주현황조회 [KSACCEPTLEDGER]
  - 영업매출현황조회 [KSACCEPTSALELEDGER]
  - 영업매출상세현황조회 [KSACCEPTSALELEDGERDETAIL]
  - 수주대장 [ACCEPTLEDGER]
  - 수주생산결의서대장 [ACTNOLEDGER]
  - 미납현황조회 [NOCOMACCEPTLEDGERLIST]
  - 출고예정일변경내역 [KSACCEPTEXPECTDATEMODIFYLIST]
  - 수금관리 [COLLECTIONMANAGE]
  - 견적내역조회 [ESTIMATELIST]  
  - 연도별업체수주현황 [ORDERSTATUSBY]    
  - 연도별업체매출현황 [SALESSTATUSBY]    
  - 월매출마감자료조회 [MONTHLYSALESCLOSINGDATA]      
  - 견적서 [ESTIMATESHEET]  
  - 출하요청서입력 [DELIVERYREQUESTFORM] 
  - PackingPrint [PACKINGPRINT]
  - OFFERSHEET [KSEXOFFER] 
  - 수출송장[KSEXINVOICE]
  - 세금계산서발행[PUBLISHTAXINVOICE]  
  - 반품대장[RETURNSALES]  

 > 생산 (PRODUCT)
  - 반제품월별필요수량기준가부족수량조회 [INSUFFICIENTQUANTITYLIST]
  - 반제품월별필요수량기준원재료BOM미등록자료조회 [INSUFFICIENTQUANTITYPUBLISHING]
  - 작업지시서 [TFWORKREPORT]
  - 공정재고수불현황 [PROCESSMANAGEMENT_MATERIAL]
  - 공정재고처리 [PROCESSMANAGEMENT_ETC]
  - 작업일보(가공반) [WORKREPORTPROCESSRECORDLEDGER]
  - 제조설비관리카드 [MANUFACTURINGMANAGECARD] 
  - 치공구관리카드 [JIGTOOLMANAGEMENTCARD]
  - 부품카드등록/조회 [KSGOODPARTSCARD]
  - 미납수주자료조회(생산) [KSINCOMPLETELIST]
  - 생산일정표 [PRODUCTSCHEDULE]
  - 생산출하진행현황 [PRODUCTSHIPMENTPRO]
  - 작업지시서실적 [PRODUCTWORKREPORTRESULT]
  - 조립지시서실적 [PRODUCTASSEMREPORTRESULT]      
  - 수압입회검사실적 [PRODUCTHYDRAULICTESTRESULT]        
  - 포장입회검사실적 [PRODUCTPACKINGTESTRESULT]          
  - 포장지시서실적 [PRODUCTPACKINGREPORTRESULT]      

 > 구매 (PURCHASE)
  - 발주자료경비처리 [ORDERTODELV] 
  - 구매발주내역조회 [KSORDERLEDGER]
  - 구매발주상세내역조회 [KSORDERLEDGERDETAIL]
  - 거래처별매입현황조회 [PURCHASESTATUSLIST]
  - 외주임가공발주상세내역조회 [OUTSOURCINGPROCESSINGORDERDETAIL]
  - Nego [NEGO]
  - 발주자료입력 [ORDERMATERIAL]
  - 구매입고 [PURCHASESTORAGE]

 > 경비 (EXPENSE)
  - 수출부대비용입력 [EXPORTEXPENSES]
  - 수입부대비용입력 [IMPORTEXPENSES]
  
 > 재고 (STOCK)
  - 대체처리 [ALTER]

 > 기술 (TECHNOLOGY)
  - 기술문서관리등록/조회 [TCBLEDGER]
  - 도면관리 [GOODSDRAWINGREVISION]
  - 승인도면작성 [DRAWINGAPPROVAL]
  - BOM등록 [BOMREGISTER]
  - 품번관리 [GOODNOMANAGEMENT] - 미사용
  - 반제품 파트/타입 등록 [MINORHALFGOODSPARTTYPE]  
 
  
 > 품질 (QUALITY)
  - 검사및시험장비등록/조회 [INSPECTANDTESTEQIPMANAGECARD]  
  - 폐기/분실장비조회 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 부정기시험장비조회 [INSPECTANDTESTEQIPMANAGEIRREGULAR]
  - 유효기간만료장비조회 [INSPECTANDTESTEQIPMANAGEVALIDITY]
  - 1분기 [INSPECTANDTESTEQIPMANAGEQUARTER1]
  - 2분기 [INSPECTANDTESTEQIPMANAGEQUARTER2]
  - 3분기 [INSPECTANDTESTEQIPMANAGEQUARTER3]
  - 4분기 [INSPECTANDTESTEQIPMANAGEQUARTER4]
  - 매뉴얼,절차서및표준서등록/조회 [DOCUMENTMPSLEDGER]  
  - 매뉴얼 [DOCUMENTMPSLEDGERLIST1]  
  - 절차서 [DOCUMENTMPSLEDGERLIST2]  
  - 작업표준서 [DOCUMENTMPSLEDGERLIST3]  
  - 검사표준서 [DOCUMENTMPSLEDGERLIST4]  
  - 제작표준서 [DOCUMENTMPSLEDGERLIST5]  
  - 환경/안전/보건표준서 [DOCUMENTMPSLEDGERLIST6]  
  - 품질/환경/환경/보건양식리스트 [DOCUMENTMPSLEDGERLIST7]  
  - 입회검사실적등록 [INSPECTRESULTREGIST]  

 > 외주 (ORDER)
  - 주문발주내역조회 [ORDERTRADINGORDERLIST]  
  - 주문발주내역조회(주물) [ORDERTRADINGORDERLISTCASTING]    
  - 주문발주처리 [ORDERTRADINGORDERPROCESS]    
  - 주문발주처리(주물) [ORDERTRADINGORDERPROCESSCASTING]    
  - 거래명세서조회 [ORDERTRADINGSTATEMENT]
  - 거래명세서조회(관리자) [ORDERMANTRADINGSTATEMENT]

 > 관리 (ADMIN)




===================
 # 프로그램별 권한
===================

● 영업 (BUSINESS) ==================================================================================================================

 > 수주현황조회 [KSACCEPTLEDGER]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 영업매출현황조회 [KSACCEPTSALELEDGER]
  - 신규 [NEW]
  - 열기 [SEARCH]  
  
 > 영업매출상세현황조회 [KSACCEPTSALELEDGERDETAIL]
  - 신규 [NEW]
  - 열기 [SEARCH]  

 > 수주대장 [ACCEPTLEDGER]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]    

 > 수주생산결의서대장 [ACTNOLEDGER]
  - 신규 [NEW]
  - 열기 [SEARCH]  

 > 미납현황조회 [NOCOMACCEPTLEDGERLIST]
  - 열기 [SEARCH]

 > 출고예정일변경내역 [KSACCEPTEXPECTDATEMODIFYLIST]
  - 신규 [NEW]
  - 열기 [SEARCH]  

 > 수금관리 [COLLECTIONMANAGE]  
  - 열기 [SEARCH]
  - 파일저장 [FILESAVE]
  - 수금계획저장/삭제 [DELAYSAVE]
  - 매출구분변경저장 [SALETYPESAVE]
  - 프로젝트예상완료일저장 [CLSDATSAVE]  

 > 견적내역조회 [ESTIMATELIST]    
  - 열기 [SEARCH]

 > 연도별업체수주현황 [ORDERSTATUSBY]      
  - 열기 [SEARCH]

 > 연도별업체매출현황 [SALESSTATUSBY]      
  - 열기 [SEARCH]

 > 월매출마감자료조회 [MONTHLYSALESCLOSINGDATA]        
  - 열기 [SEARCH]

 > 견적서 [ESTIMATESHEET]          
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 저장 [SAVE]    
  - 삭제 [DELETE]
  - 확정처리 [CLOSE]

 > 출하요청서입력 [DELIVERYREQUESTFORM]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 인쇄 [PRINT]
  - 수주미납검색(거래처) [FORREQPOPUP]
  - 상신취소 사유, 반려 사유 저장 [CANCELSAVE]
  - 수주미납검색 저장 [FORREQSAVE]
  - 수주미납검색(거래처) [UPDATEDELVDATE]

 > PackingPrint [PACKINGPRINT]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 인쇄 [PRINT]

 > OFFERSHEET [KSEXOFFER] 
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 삭제 [DELETE] 
  - 인쇄 [PRINT]
  - 수주생산결의서배포 [ACTPUB]
  - 리비전 요청 [REVREQ]  

 > 수출송장[KSEXINVOICE]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 삭제 [DELETE] 
  - 인쇄 [PRINT]  

 > 세금계산서발행 [PUBLISHTAXINVOICE]    
  - 열기 [SEARCH]
  - 저장 [SAVE] 

  반품대장[RETURNSALES]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 삭제 [DELETE] 




● 생산 (PRODUCT) ===================================================================================================================

 > 반제품월별필요수량기준가부족수량조회 [INSUFFICIENTQUANTITYLIST]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]    
  - 출력 [PRINT]  
  - 확인 [CONFIRM]   

 > 반제품월별필요수량기준원재료BOM미등록자료조회 [INSUFFICIENTQUANTITYPUBLISHING]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 확인 [CONFIRM]

 > 작업지시서 [TFWORKREPORT]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]

 > 공정재고수불현황 [PROCESSMANAGEMENT_MATERIAL]
  - 신규 [NEW]  
  - 열기 [SEARCH]  

 > 공정재고처리 [PROCESSMANAGEMENT_ETC]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 저장 [SAVE]

 > 작업일보(가공반) [WORKREPORTPROCESSRECORDLEDGER]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 인쇄 [PRINT]

 > 제조설비관리카드 [MANUFACTURINGMANAGECARD]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 수정 [UPDATE]    
  - 수리(보증)/폐기기록등록 [REPAIR]    
  - 점검표입력 [CHECKNEW]      
  - 점검표삭제 [CHECKDEL]

 > 치공구관리카드 [JIGTOOLMANAGEMENTCARD]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 수정 [UPDATE]    
  - 수리/폐기기록등록 [REPAIR]

 > 부품카드등록/조회 [KSGOODPARTSCARD]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 저장 [SAVE]
  - 삭제 [DELETE]

 > 미납수주자료조회(생산) [KSINCOMPLETELIST]
  - 신규 [NEW]  
  - 열기 [SEARCH]  

 > 생산일정표 [PRODUCTSCHEDULE]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 작업일정저장 [TASKSAVE]  

 > 작업지시서실적 [PRODUCTWORKREPORTRESULT]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 생산출하진행현황 [PRODUCTSHIPMENTPRO]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 조립지시서실적 [PRODUCTASSEMREPORTRESULT]        
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 수압입회검사실적 [PRODUCTHYDRAULICTESTRESULT]          
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 포장입회검사실적 [PRODUCTPACKINGTESTRESULT]            
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 포장지시서실적 [PRODUCTPACKINGREPORTRESULT]        
  - 신규 [NEW]
  - 열기 [SEARCH]





● 구매 (PURCHASE) ==================================================================================================================

 > 발주자료경비처리 [ORDERTODELV]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]

 > 구매발주내역조회 [KSORDERLEDGER]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 구매발주상세내역조회 [KSORDERLEDGERDETAIL]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 거래처별매입현황조회 [PURCHASESTATUSLIST]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 외주임가공발주상세내역조회 [OUTSOURCINGPROCESSINGORDERDETAIL]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > Nego [NEGO]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]
  - 인쇄 [PRINT]

 > 발주자료입력 [ORDERMATERIAL]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]
  - 인쇄 [PRINT]

 > 구매입고 [PURCHASESTORAGE]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]
  - 인쇄 [PRINT]




● 경비 (EXPENSE) ===================================================================================================================

 > 수출부대비용입력 [EXPORTEXPENSES]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]

 > 수입부대비용입력 [IMPORTEXPENSES]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE]
  - 삭제 [DELETE]
  - 인쇄 [PRINT]





● 재고 (STOCK) =====================================================================================================================

 > 대체처리 [ALTER]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 삭제 [DELETE] 





● 기술 (TECHNOLOGY) ================================================================================================================

 > 도면관리 [GOODSDRAWINGREVISION]
  - 신규 [NEW]  
  - 열기 [SEARCH]
  - 리비전 관리 [BTNADMINREVISION] 
  - 품번매핑 저장 [BTNMAPPING]

 > 기술문서관리등록/조회 [TCBLEDGER]
  - 신규 [NEW]  
  - 열기 [SEARCH]
  - 수정 [UPDATE]] 

 > 승인도면작성 [DRAWINGAPPROVAL]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 생산유무 PMS 등록 [BTNREGISTERPMSORDERSECT]

 > BOM등록 [BOMREGISTER]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 반제품 파트/타입 등록 [MINORHALFGOODSPARTTYPE]
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 저장 [SAVE] 
  - 삭제 [DELETE] (사용자에게는 권한 제한 -> 코드 사용 후 삭제 불가)



● 품질 (QUALITY) ===================================================================================================================

 > 검사및시험장비관리카드등록/조회 [INSPECTANDTESTEQIPMANAGECARD]
  - 신규 [NEW]  
  - 열기 [SEARCH]  
  - 수정 [UPDATE]    
  - 이상발생보고서/수리견적서등록 [REPAIR]
  - 검교정등록 [CALIBRATION]
  - 장비/입출고이력등록및폐기/분실확인서등록 [INOUT]

 > 폐기/분실장비조회 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH]

 > 부정기시험장비조회 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 유효기간만료장비조회 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 1분기 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 2분기 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 3분기 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 4분기 [INSPECTANDTESTEQIPMANAGEDISPOSAL]
  - 열기 [SEARCH] 

 > 매뉴얼,절차서및표준서등록/조회 [DOCUMENTMPSLEDGER]    
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 수정 [UPDATE]

 > 매뉴얼 [DOCUMENTMPSLEDGERLIST1]  
  - 열기 [SEARCH]

 > 절차서 [DOCUMENTMPSLEDGERLIST2]  
  - 열기 [SEARCH]

 > 작업표준서 [DOCUMENTMPSLEDGERLIST3]  
  - 열기 [SEARCH]

 > 검사표준서 [DOCUMENTMPSLEDGERLIST4]  
  - 열기 [SEARCH]

 > 제작표준서 [DOCUMENTMPSLEDGERLIST5]  
  - 열기 [SEARCH]

 > 환경/안전/보건표준서 [DOCUMENTMPSLEDGERLIST6]  
  - 열기 [SEARCH]

 > 품질/환경/환경/보건양식리스트 [DOCUMENTMPSLEDGERLIST7]  
  - 열기 [SEARCH]  

 > 입회검사실적등록 [INSPECTRESULTREGIST]    
  - 열기 [SEARCH]
  - 저장 [SAVE] 




● 외주 (ORDER) =====================================================================================================================

 > 주문발주내역조회 [ORDERTRADINGORDERLIST]   
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 주문발주내역조회(주물) [ORDERTRADINGORDERLISTCASTING]   
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 주문발주처리 [ORDERTRADINGORDERPROCESS]   
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 납품저장 [PMSSAVE]      
  - 납품삭제 [PMSDELETE]      
  - 납품출력 [PMSPRINT]    

 > 주문발주처리(주물) [ORDERTRADINGORDERPROCESSCASTING]      
  - 신규 [NEW]
  - 열기 [SEARCH]
  - 납품저장 [PMSSAVE]      
  - 납품삭제 [PMSDELETE]      
  - 납품출력 [PMSPRINT]

 > 거래명세서조회 [ORDERTRADINGSTATEMENT]
  - 신규 [NEW]
  - 열기 [SEARCH]

 > 거래명세서조회(관리자) [ORDERMANTRADINGSTATEMENT]
  - 신규 [NEW]
  - 열기 [SEARCH]    



● 관리 (ADMIN) =====================================================================================================================






