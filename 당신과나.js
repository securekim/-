const 블록체인 = require("./블록체인");
const 웹소켓 = require("ws");
const 소켓들 = [];

const {
      최신블록가져오기,
      블록구조가올바른지,
      체인교체,
      블록체인가져오기,
      블록을체인에더하라,
      //들어오는거래관리 // TODO: With 거래
} = 블록체인;

const 소켓들가져오기 = () => 소켓들;

const 당신과나서버시작 = 서버 => {
      const 웹소켓서버 = new 웹소켓.Server({ 서버 });
        웹소켓서버.on("connection", 웹소켓 => {
        소켓연결초기화(웹소켓);
      });
        웹소켓서버.on("error", () => {
        console.log("에러");
      });
      console.log("한국코인 당신과나 서버 구동");
    };

const 최신_가져오기 = "최신_가져오기";
const 모두_가져오기 = "모두_가져오기";
const 블록체인_응답 = "블록체인_응답";

// Message Creators
const 최신가져오기 = () => {
    return {
      타입: 최신_가져오기,
      데이터: null
    };
  };
const 모두가져오기 = () => {
    return {
      타입: 모두_가져오기,
      데이터: null
    };
  };
const 블록체인응답 =데이터=> {
  return {
    타입: 블록체인_응답,
    데이터
  };
};

const 최신응답 = () => 블록체인응답([최신블록가져오기()]);
const 모두응답 = () => 블록체인응답(블록체인가져오기());
const 메시지보내기 = (웹소켓, 메시지) => 웹소켓.send(JSON.stringify(메시지));
const 모두에게메시지보내기 = 메시지 =>
  sockets.forEach(웹소켓 => 메시지보내기(웹소켓, 메시지));
const 새로운블록방송 = () => 모두에게메시지보내기(최신응답());

const 소켓메시지들관리 = 웹소켓 => {
      웹소켓.on("message", 데이터 => {
        //try / catch 필요
        const 메시지 = JSON.parse(데이터);
        if (메시지 === null) {
          return;
        }
        switch (메시지.타입) {
          case 최신_가져오기:
            메시지보내기(웹소켓, 최신응답());
            break;
          case 모두_가져오기:
            메시지보내기(웹소켓, 모두응답());
            break;
          case 블록체인_응답:
            const 받은블록들 = 메시지.데이터;
            if (받은블록들 === null) {
              break;
            }
            블록체인응답관리(받은블록들);
            break;
        }
      });
    };

const 소켓에러관리 = 웹소켓 => {
  const 소켓연결닫힘 = 웹소켓 => {
    웹소켓.close();
    소켓들.splice(소켓들.indexOf(웹소켓), 1);
  };
  웹소켓.on("close", () => 소켓연결닫힘(웹소켓));
  웹소켓.on("error", () => 소켓연결닫힘(웹소켓));
};

const 소켓연결초기화 = 웹소켓 => {
      소켓들.push(웹소켓);
      소켓메시지들관리(웹소켓);
      소켓에러관리(웹소켓);
      메시지보내기(웹소켓, 최신가져오기());
      // TODO : 거래
      setInterval(() => {
        if (소켓들.includes(웹소켓)) {
          메시지보내기(웹소켓, "");
        }
      }, 1000);
    };

const 당신들과연결 = 새로운당신 => {
  const 웹소켓 = new 웹소켓(새로운당신);
  웹소켓.on("open", () => {
    소켓연결초기화(웹소켓);
  });
  웹소켓.on("error", () => console.log("연결 끊김"));
  웹소켓.on("close", () => console.log("연결 끊김"));
};

module.exports = {
      당신과나서버시작,
      당신들과연결,
      새로운블록방송
};
    