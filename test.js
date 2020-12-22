const request = require('request');

// 기관 고유 번호
const iscd = '000504';
const accessToken = '206782edebcb74e51aeb09292b444aa5926e87bcdc2220008e53209d84be0fab';
// 농협 모계좌
const nhAccount1 = '3020000002090';
// 농협 자계좌
const nhAccount2 = '3020000002092';
// 상호 금융 계
const shAccount1 = '3510000002091'; const shRgno1 = '20201130000000520';
const shAccount2 = '3510000002093';
const baseURL = 'https://developers.nonghyup.com/';
const today = '20201130'; // 이건 무조건 오늘 날짜로 해야됨
const birthday = '19960605';
// 은행코드 011 농협, 012 농협상호금융
const bncd = '012';
// 등록 번호(이것이 있어야 핀어카운트 확인 가능)
const rgno = '20201128000000508';
const rgno2 = '20201130000000519';
// 기관 거래 고유 번호, 할 때마다 1씩 증가 시켜줘야함.
const isTuno = '0000023'; // timestamp + user_id
const finAcno = '00820100005040000000000000929'; const shFinAcno = '00820100005040000000000000992';
const finAcno2 = '00820100005040000000000000983';

// request module 기본 요청 방식
const options = {
    url: baseURL,
    qs: null, // for GET
    body: null, // for POST
    json: true, // json으로 보낼경우 true로 해주어야 header값이 json으로 설정된다.
};

// post api 공통부분
const postBody = {
    'ApiNm': '',
    'Tsymd': today, // 오늘 날짜
    'Trtm': '164011', // 요청 시간
    'Iscd': iscd,
    'FintechApsno': '001', // 테스트용은 다 001
    'ApiSvcCd': 'DrawingTransferA',
    'IsTuno': isTuno,
    'AccessToken': accessToken,
};

function makeOptions(apiNm, input) {
    const ret = options;
    ret.url = baseURL + apiNm + '.nh';
    ret.body = input;
    ret.body.Header = postBody;
    ret.body.Header.ApiNm = apiNm;
    ret.url = baseURL + apiNm + '.nh';

    return ret;
}

// post request
function pr(opt) {
    request.post(opt, function (err, httpResponse, body) {
        if (err) {
            console.log('ERROR\n', err);
            return;
        }
        console.log(body);
    });
}

// 핀어카운트 직접발급(핀어카운트 발급만 시키기, 보여주진 않음)
function openFinAccountDirect() {
    const apiNm = 'OpenFinAccountDirect';
    const body = {
        'DrtrRgyn': 'Y',
        'BrdtBrno': birthday,
        'Bncd': bncd,
        'Acno': shAccount1,
    };
    const ofadOpts = makeOptions(apiNm, body);

    // console.log(ofadOpts);

    pr(ofadOpts);

    // response
    // Rgno : 등록번호, 이것을 이용해 핀어카운트를 확인할 수 있다.
}

// 핀어카운트 직접발급 확인(핀어카운트 확인하기)
function checkOpenFinAccountDirect() {
    const apiNm = 'CheckOpenFinAccountDirect';
    const body = {
        'Rgno': shRgno1,
        'BrdtBrno': birthday,
    };
    const cofadOpts = makeOptions(apiNm, body);

    // console.log(cofadOpts);

    pr(cofadOpts);

    // response
    // FinAcno : 핀어카운트 번호
    // RgsnYmd : 등록 일자 YYYYMMDD
}

// 예금주 조회
function inquireDepositorAccountNumber() {
    const apiNm = 'InquireDepositorAccountNumber';
    const body = {
        'Bncd': bncd,
        'Acno': nhAccount1,
    };
    const idanOpts = makeOptions(apiNm, body);

    console.log(idanOpts);

    pr(idanOpts);

    // response
    // Bncd : 은행 코드
    // Acno : 계좌번호
    // Dpnm : 예금주명의
}

// 잔액 조회
function inquireBalance() {
    const apiNm = 'InquireBalance';
    const body = {
        'FinAcno': finAcno,
    };
    const balanceOpts = makeOptions(apiNm, body);

    pr(balanceOpts);

    // 원장 잔액과 실지급가능액의 차이점
    // https://ko.bccrwp.org/compare/difference-between-ledger-balance-and-available-balance/
    // response
    // FinAcno
    // Ldbl : 원장 잔액
    // RlpmAbmant : 실 지급 가능액
    // 이하 AI001, AI002 오류 발생시 출력
    // AthrCnfrTckt : 권한 확인 티켓
    // Webrl : 웹 url
    // AndInitUrl, AndAppUrl, AndWebUrl : 안드로이드 설치, 앱, 웹 url
    // IosInitUrl, IosAppUrl, IosWebUrl : 아이오에스 설치, 앱, 웹 url
}

// 출금이체
function drawingTransfer() {
    const apiNm = 'DrawingTransfer';
    const body = {
        'FinAcno': shFinAcno,
        'Tram': '100000000',
        'DractOtlt': '출금계좌에 적는 내용',
    };
    const transferOpts = makeOptions(apiNm, body);

    pr(transferOpts);

    // response
    // FinAcno : 핀어카운트 -> 문서에는 있는데 리턴은 안됨
    // RgsnYmd : 등록일자
}

// 입금이체
function receivedTransferAccountNumber() {
    const apiNm = 'ReceivedTransferAccountNumber';
    const body = {
        'Bncd': bncd,
        'Acno': nhAccount2,
        'Tram': '100000000',
        'DractOtlt': '출금계좌에 적는 내용',
        'MractOtlt': '입금계좌에 적는 내용',
    };
    const receivedOpts = makeOptions(apiNm, body);

    pr(receivedOpts);

    // response
    // 인자 없음
}

// test function
// openFinAccountDirect();
// checkOpenFinAccountDirect();
// inquireDepositorAccountNumber();
// inquireBalance();
// drawingTransfer();
// receivedTransferAccountNumber();

// process : 하객 - 출금이체 - 정컴텍 - 예금주확인 - 입금 - 신랑신부