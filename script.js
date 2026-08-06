// ======================================
// Pokemon GO CP 계산기
// script.js
// 계산 기능
// ======================================

// 계산 버튼을 가져온다.
const calculateButton = document.getElementById("calculate");

// 결과창을 가져온다.
const result = document.getElementById("result");

// 버튼을 누르면 실행
calculateButton.addEventListener("click", function () {

    // -----------------------
    // 입력값 가져오기
    // -----------------------

    const pokemon = document.getElementById("pokemon").value;

    const cp = Number(document.getElementById("cp").value);

    const hp = Number(document.getElementById("hp").value);

    const atk = Number(document.getElementById("atk").value);

    const def = Number(document.getElementById("def").value);

    const sta = Number(document.getElementById("sta").value);

    // -----------------------
    // 입력 검사
    // -----------------------

    if (
        pokemon === "" ||
        cp <= 0 ||
        hp <= 0
    ) {

        alert("모든 정보를 입력해주세요.");

        return;

    }

    // -----------------------
    // 포켓몬 데이터 가져오기
    // -----------------------

    const data = pokemonData[pokemon];

    // -----------------------
    // IV 점수 계산
    // -----------------------

    const ivTotal = atk + def + sta;

    // -----------------------
    // 간단한 보정치 계산
    // -----------------------

    const ivBonus = ivTotal * 3;

    const hpBonus = hp * 2;

    // -----------------------
    // 진화 배율
    // -----------------------

    let multiplier = 5.4;

    if (pokemon === "swinub") {

        multiplier = 5.8;

    }

    if (pokemon === "vulpix") {

        multiplier = 4.0;

    }

    // -----------------------
    // 예상 CP 계산
    // -----------------------

    const finalCP = Math.round(

        cp * multiplier +

        ivBonus +

        hpBonus

    );

    // -----------------------
    // 결과 출력
    // -----------------------

    result.innerHTML = `

    <h2>계산 결과</h2>

    <p>

    최종 진화 :
    <b>${data.finalName}</b>

    <br><br>

    예상 CP :

    <b>${finalCP}</b>

    <br><br>

    예상 오차 ±50

    </p>

    `;

});
