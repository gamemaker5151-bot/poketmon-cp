// ============================================
// calculator.js
// Pokemon GO Calculator Engine
// Version 1.0
// Part 1
// ============================================


// --------------------------------------------
// CP 계산
// --------------------------------------------

function calculateCP(
    attack,
    defense,
    stamina,
    attackIV,
    defenseIV,
    staminaIV,
    cpmValue
) {

    const atk = attack + attackIV;
    const def = defense + defenseIV;
    const sta = stamina + staminaIV;

    const cp = Math.floor(
        (
            atk *
            Math.sqrt(def) *
            Math.sqrt(sta) *
            Math.pow(cpmValue, 2)
        ) / 10
    );

    return Math.max(cp, 10);

}


// --------------------------------------------
// HP 계산
// --------------------------------------------

function calculateHP(
    stamina,
    staminaIV,
    cpmValue
) {

    const hp = Math.floor(
        (stamina + staminaIV) * cpmValue
    );

    return Math.max(hp, 10);

}


// --------------------------------------------
// IV 총합
// --------------------------------------------

function getIVTotal(
    attackIV,
    defenseIV,
    staminaIV
) {

    return attackIV + defenseIV + staminaIV;

}


// --------------------------------------------
// IV 퍼센트
// --------------------------------------------

function getIVPercent(
    attackIV,
    defenseIV,
    staminaIV
) {

    return (
        getIVTotal(
            attackIV,
            defenseIV,
            staminaIV
        ) / 45
    ) * 100;

}


// --------------------------------------------
// 값 차이 계산
// --------------------------------------------

function getDifference(
    value1,
    value2
) {

    return Math.abs(value1 - value2);

}


// --------------------------------------------
// 레벨의 CPM 가져오기
// --------------------------------------------

function getCPM(level) {

    if (cpm[level] === undefined) {
        return null;
    }

    return cpm[level];

}


// --------------------------------------------
// 포켓몬 데이터 가져오기
// --------------------------------------------

function getPokemonData(id) {

    if (pokemonData[id] === undefined) {
        return null;
    }

    return pokemonData[id];

}


// --------------------------------------------
// 숫자인지 확인
// --------------------------------------------

function isValidNumber(value) {

    return (
        typeof value === "number" &&
        !isNaN(value)
    );

}


// --------------------------------------------
// IV 유효성 검사
// --------------------------------------------

function isValidIV(iv) {

    return (
        iv >= 0 &&
        iv <= 15
    );

}


// --------------------------------------------
// 입력 데이터 검사
// --------------------------------------------

function validateInput(
    cp,
    hp,
    attackIV,
    defenseIV,
    staminaIV
) {

    if (!isValidNumber(cp) || cp < 10) {
        return false;
    }

    if (!isValidNumber(hp) || hp < 10) {
        return false;
    }

    if (!isValidIV(attackIV)) {
        return false;
    }

    if (!isValidIV(defenseIV)) {
        return false;
    }

    if (!isValidIV(staminaIV)) {
        return false;
    }

    return true;

}
// ============================================
// calculator.js
// Part 2
// 레벨 역산 엔진
// ============================================


// --------------------------------------------
// 현재 레벨 추정
// --------------------------------------------

function estimateLevel(
    pokemon,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    let bestResult = null;

    for (let level = 1; level <= 50; level += 0.5) {

        const cpmValue = getCPM(level);

        if (cpmValue === null) {
            continue;
        }

        const estimatedCP = calculateCP(
            pokemon.baseAttack,
            pokemon.baseDefense,
            pokemon.baseStamina,
            attackIV,
            defenseIV,
            staminaIV,
            cpmValue
        );

        const estimatedHP = calculateHP(
            pokemon.baseStamina,
            staminaIV,
            cpmValue
        );

        const cpDifference = getDifference(
            currentCP,
            estimatedCP
        );

        const hpDifference = getDifference(
            currentHP,
            estimatedHP
        );

        const score = cpDifference + (hpDifference * 2);

        if (
            bestResult === null ||
            score < bestResult.score
        ) {

            bestResult = {

                level: level,

                cpm: cpmValue,

                estimatedCP: estimatedCP,

                estimatedHP: estimatedHP,

                cpDifference: cpDifference,

                hpDifference: hpDifference,

                score: score

            };

        }

    }

    return bestResult;

}


// --------------------------------------------
// 레벨 후보 여러 개 찾기
// --------------------------------------------

function estimateLevelCandidates(
    pokemon,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const candidates = [];

    for (let level = 1; level <= 50; level += 0.5) {

        const cpmValue = getCPM(level);

        if (cpmValue === null) {
            continue;
        }

        const estimatedCP = calculateCP(
            pokemon.baseAttack,
            pokemon.baseDefense,
            pokemon.baseStamina,
            attackIV,
            defenseIV,
            staminaIV,
            cpmValue
        );

        const estimatedHP = calculateHP(
            pokemon.baseStamina,
            staminaIV,
            cpmValue
        );

        const cpDifference = getDifference(
            currentCP,
            estimatedCP
        );

        const hpDifference = getDifference(
            currentHP,
            estimatedHP
        );

        const score = cpDifference + (hpDifference * 2);

        candidates.push({

            level: level,

            cpm: cpmValue,

            estimatedCP: estimatedCP,

            estimatedHP: estimatedHP,

            cpDifference: cpDifference,

            hpDifference: hpDifference,

            score: score

        });

    }

    candidates.sort(function (a, b) {

        return a.score - b.score;

    });

    return candidates;

}


// --------------------------------------------
// 가장 유력한 후보 반환
// --------------------------------------------

function getBestLevel(
    pokemon,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const result = estimateLevel(
        pokemon,
        currentCP,
        currentHP,
        attackIV,
        defenseIV,
        staminaIV
    );

    return result.level;

}
// ============================================
// calculator.js
// Part 3
// 최종 진화 CP 계산
// ============================================


// --------------------------------------------
// 최종 진화 CP 계산
// --------------------------------------------

function calculateEvolutionCP(
    pokemon,
    level,
    attackIV,
    defenseIV,
    staminaIV
) {

    const cpmValue = getCPM(level);

    if (cpmValue === null) {
        return null;
    }

    const finalCP = calculateCP(
        pokemon.finalAttack,
        pokemon.finalDefense,
        pokemon.finalStamina,
        attackIV,
        defenseIV,
        staminaIV,
        cpmValue
    );

    const finalHP = calculateHP(
        pokemon.finalStamina,
        staminaIV,
        cpmValue
    );

    return {

        name: pokemon.finalName,

        level: level,

        cp: finalCP,

        hp: finalHP,

        cpm: cpmValue

    };

}


// --------------------------------------------
// 1500컵 가능 여부
// --------------------------------------------

function isGreatLeague(finalCP) {

    return finalCP <= 1500;

}


// --------------------------------------------
// 2500컵 가능 여부
// --------------------------------------------

function isUltraLeague(finalCP) {

    return finalCP <= 2500;

}


// --------------------------------------------
// 리그 판정
// --------------------------------------------

function getLeague(finalCP) {

    if (finalCP <= 1500) {

        return "Great League";

    }

    if (finalCP <= 2500) {

        return "Ultra League";

    }

    return "Master League";

}


// --------------------------------------------
// 계산 전체 실행
// --------------------------------------------

function calculatePokemonResult(
    pokemon,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const levelResult = estimateLevel(
        pokemon,
        currentCP,
        currentHP,
        attackIV,
        defenseIV,
        staminaIV
    );

    const evolution = calculateEvolutionCP(
        pokemon,
        levelResult.level,
        attackIV,
        defenseIV,
        staminaIV
    );

    return {

        currentCP: currentCP,

        currentHP: currentHP,

        estimatedLevel: levelResult.level,

        estimatedCP: levelResult.estimatedCP,

        estimatedHP: levelResult.estimatedHP,

        cpDifference: levelResult.cpDifference,

        hpDifference: levelResult.hpDifference,

        finalName: evolution.name,

        finalCP: evolution.cp,

        finalHP: evolution.hp,

        league: getLeague(evolution.cp),

        greatLeague: isGreatLeague(evolution.cp),

        ultraLeague: isUltraLeague(evolution.cp),

        ivTotal: getIVTotal(
            attackIV,
            defenseIV,
            staminaIV
        ),

        ivPercent: getIVPercent(
            attackIV,
            defenseIV,
            staminaIV
        )

    };

}
// ============================================
// calculator.js
// Part 4
// 결과 생성 및 출력 데이터
// ============================================


// --------------------------------------------
// 결과 객체 생성
// --------------------------------------------

function buildResult(
    pokemon,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const result = calculatePokemonResult(
        pokemon,
        currentCP,
        currentHP,
        attackIV,
        defenseIV,
        staminaIV
    );

    result.cpRange = getCPRange(result.finalCP);

    result.ivGrade = getIVGrade(result.ivPercent);

    result.recommendation = getRecommendation(result);

    return result;

}


// --------------------------------------------
// 예상 오차 범위
// --------------------------------------------

function getCPRange(cp) {

    return {

        min: Math.max(10, cp - 30),

        max: cp + 30

    };

}


// --------------------------------------------
// IV 등급
// --------------------------------------------

function getIVGrade(ivPercent) {

    if (ivPercent >= 98) {

        return "SS";

    }

    if (ivPercent >= 93) {

        return "S";

    }

    if (ivPercent >= 89) {

        return "A";

    }

    if (ivPercent >= 82) {

        return "B";

    }

    if (ivPercent >= 70) {

        return "C";

    }

    return "D";

}


// --------------------------------------------
// 추천 여부
// --------------------------------------------

function getRecommendation(result) {

    if (result.finalCP >= 3000 &&
        result.ivPercent >= 90) {

        return "★★★★★";

    }

    if (result.finalCP >= 2500 &&
        result.ivPercent >= 82) {

        return "★★★★☆";

    }

    if (result.finalCP >= 2000) {

        return "★★★☆☆";

    }

    if (result.finalCP >= 1500) {

        return "★★☆☆☆";

    }

    return "★☆☆☆☆";

}


// --------------------------------------------
// 결과 문자열 생성
// --------------------------------------------

function createResultHTML(result) {

    return `

<h2>${result.finalName}</h2>

<table>

<tr>
<td>예상 레벨</td>
<td>${result.estimatedLevel}</td>
</tr>

<tr>
<td>최종 CP</td>
<td>${result.finalCP}</td>
</tr>

<tr>
<td>예상 범위</td>
<td>${result.cpRange.min} ~ ${result.cpRange.max}</td>
</tr>

<tr>
<td>최종 HP</td>
<td>${result.finalHP}</td>
</tr>

<tr>
<td>IV</td>
<td>${result.ivPercent.toFixed(1)}%</td>
</tr>

<tr>
<td>IV 등급</td>
<td>${result.ivGrade}</td>
</tr>

<tr>
<td>리그</td>
<td>${result.league}</td>
</tr>

<tr>
<td>추천도</td>
<td>${result.recommendation}</td>
</tr>

</table>

`;

}


// --------------------------------------------
// 콘솔 출력
// --------------------------------------------

function printResult(result) {

    console.log(result);

}
// ============================================
// calculator.js
// Part 5
// 그림자 / 정화 / 강화 계산
// ============================================


// --------------------------------------------
// 그림자 공격 보정
// --------------------------------------------

function getShadowAttack(attack) {

    return attack * 1.2;

}


// --------------------------------------------
// 그림자 방어 보정
// --------------------------------------------

function getShadowDefense(defense) {

    return defense * 0.833333;

}


// --------------------------------------------
// 정화 IV
// --------------------------------------------

function purifyIV(iv) {

    return Math.min(iv + 2, 15);

}


// --------------------------------------------
// 정화된 IV 반환
// --------------------------------------------

function getPurifiedIVs(
    attackIV,
    defenseIV,
    staminaIV
) {

    return {

        attackIV: purifyIV(attackIV),

        defenseIV: purifyIV(defenseIV),

        staminaIV: purifyIV(staminaIV)

    };

}


// --------------------------------------------
// 그림자 최종 CP
// --------------------------------------------

function calculateShadowEvolution(
    pokemon,
    level,
    attackIV,
    defenseIV,
    staminaIV
) {

    const cpmValue = getCPM(level);

    const cp = calculateCP(

        getShadowAttack(
            pokemon.finalAttack
        ),

        getShadowDefense(
            pokemon.finalDefense
        ),

        pokemon.finalStamina,

        attackIV,

        defenseIV,

        staminaIV,

        cpmValue

    );

    return cp;

}


// --------------------------------------------
// 정화 최종 CP
// --------------------------------------------

function calculatePurifiedEvolution(
    pokemon,
    level,
    attackIV,
    defenseIV,
    staminaIV
) {

    const iv = getPurifiedIVs(

        attackIV,

        defenseIV,

        staminaIV

    );

    const cp = calculateEvolutionCP(

        pokemon,

        level,

        iv.attackIV,

        iv.defenseIV,

        iv.staminaIV

    );

    return cp;

}


// --------------------------------------------
// 강화 후 CP
// --------------------------------------------

function powerUpCP(
    pokemon,
    level,
    attackIV,
    defenseIV,
    staminaIV,
    targetLevel
) {

    if (targetLevel > 50) {

        targetLevel = 50;

    }

    const cpmValue = getCPM(targetLevel);

    return calculateCP(

        pokemon.finalAttack,

        pokemon.finalDefense,

        pokemon.finalStamina,

        attackIV,

        defenseIV,

        staminaIV,

        cpmValue

    );

}


// --------------------------------------------
// 강화 후 HP
// --------------------------------------------

function powerUpHP(
    pokemon,
    level,
    staminaIV,
    targetLevel
) {

    if (targetLevel > 50) {

        targetLevel = 50;

    }

    const cpmValue = getCPM(targetLevel);

    return calculateHP(

        pokemon.finalStamina,

        staminaIV,

        cpmValue

    );

}


// --------------------------------------------
// 최대 강화
// --------------------------------------------

function getMaxPokemon(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV
) {

    return {

        cp: powerUpCP(

            pokemon,

            50,

            attackIV,

            defenseIV,

            staminaIV,

            50

        ),

        hp: powerUpHP(

            pokemon,

            50,

            staminaIV,

            50

        )

    };

}


// --------------------------------------------
// 그림자 여부
// --------------------------------------------

function isShadow(value) {

    return value === true;

}


// --------------------------------------------
// 정화 여부
// --------------------------------------------

function isPurified(value) {

    return value === true;

}
// ============================================
// calculator.js
// Part 6
// PvP 계산 및 리그 최적화
// ============================================


// --------------------------------------------
// 지정한 CP 이하인지 확인
// --------------------------------------------

function isUnderCP(capCP, currentCP) {

    return currentCP <= capCP;

}


// --------------------------------------------
// 지정 리그까지 강화
// --------------------------------------------

function calculateLeagueCP(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV,
    limitCP
) {

    let best = null;

    for (let level = 1; level <= 50; level += 0.5) {

        const cpmValue = getCPM(level);

        if (cpmValue === null) {
            continue;
        }

        const cp = calculateCP(

            pokemon.finalAttack,

            pokemon.finalDefense,

            pokemon.finalStamina,

            attackIV,

            defenseIV,

            staminaIV,

            cpmValue

        );

        const hp = calculateHP(

            pokemon.finalStamina,

            staminaIV,

            cpmValue

        );

        if (cp <= limitCP) {

            best = {

                level: level,

                cp: cp,

                hp: hp

            };

        }

    }

    return best;

}


// --------------------------------------------
// Great League 계산
// --------------------------------------------

function calculateGreatLeague(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV
) {

    return calculateLeagueCP(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV,

        1500

    );

}


// --------------------------------------------
// Ultra League 계산
// --------------------------------------------

function calculateUltraLeague(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV
) {

    return calculateLeagueCP(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV,

        2500

    );

}


// --------------------------------------------
// PvP 스탯 계산
// --------------------------------------------

function calculateStatProduct(
    pokemon,
    level,
    attackIV,
    defenseIV,
    staminaIV
) {

    const cpmValue = getCPM(level);

    const attack =

        (pokemon.finalAttack + attackIV)

        * cpmValue;

    const defense =

        (pokemon.finalDefense + defenseIV)

        * cpmValue;

    const hp =

        Math.floor(

            (pokemon.finalStamina + staminaIV)

            * cpmValue

        );

    return attack * defense * hp;

}


// --------------------------------------------
// PvP 최고 레벨 찾기
// --------------------------------------------

function getBestPvPLevel(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV,
    cap
) {

    let best = null;

    for (let level = 1; level <= 50; level += 0.5) {

        const cpmValue = getCPM(level);

        const cp = calculateCP(

            pokemon.finalAttack,

            pokemon.finalDefense,

            pokemon.finalStamina,

            attackIV,

            defenseIV,

            staminaIV,

            cpmValue

        );

        if (cp > cap) {

            continue;

        }

        const statProduct = calculateStatProduct(

            pokemon,

            level,

            attackIV,

            defenseIV,

            staminaIV

        );

        if (

            best === null ||

            statProduct > best.statProduct

        ) {

            best = {

                level: level,

                cp: cp,

                statProduct: statProduct

            };

        }

    }

    return best;

}


// --------------------------------------------
// Great League PvP
// --------------------------------------------

function getBestGreatLeague(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV
) {

    return getBestPvPLevel(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV,

        1500

    );

}


// --------------------------------------------
// Ultra League PvP
// --------------------------------------------

function getBestUltraLeague(
    pokemon,
    attackIV,
    defenseIV,
    staminaIV
) {

    return getBestPvPLevel(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV,

        2500

    );

}
// ============================================
// calculator.js
// Part 7
// 전체 계산 엔진 및 최종 API
// ============================================


// --------------------------------------------
// 메인 계산 함수
// --------------------------------------------

function calculatePokemon(
    pokemonId,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    if (
        !validateInput(
            currentCP,
            currentHP,
            attackIV,
            defenseIV,
            staminaIV
        )
    ) {

        return {
            success: false,
            message: "입력값이 올바르지 않습니다."
        };

    }

    const pokemon = getPokemonData(pokemonId);

    if (pokemon === null) {

        return {
            success: false,
            message: "포켓몬 데이터를 찾을 수 없습니다."
        };

    }

    const result = buildResult(

        pokemon,

        currentCP,

        currentHP,

        attackIV,

        defenseIV,

        staminaIV

    );

    return {

        success: true,

        pokemon: pokemon.name,

        result: result

    };

}


// --------------------------------------------
// 그림자 계산
// --------------------------------------------

function calculateShadowPokemon(
    pokemonId,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const data = calculatePokemon(

        pokemonId,

        currentCP,

        currentHP,

        attackIV,

        defenseIV,

        staminaIV

    );

    if (!data.success) {

        return data;

    }

    data.result.shadowCP =

        calculateShadowEvolution(

            getPokemonData(pokemonId),

            data.result.estimatedLevel,

            attackIV,

            defenseIV,

            staminaIV

        );

    return data;

}


// --------------------------------------------
// 정화 계산
// --------------------------------------------

function calculatePurifiedPokemon(
    pokemonId,
    currentCP,
    currentHP,
    attackIV,
    defenseIV,
    staminaIV
) {

    const data = calculatePokemon(

        pokemonId,

        currentCP,

        currentHP,

        attackIV,

        defenseIV,

        staminaIV

    );

    if (!data.success) {

        return data;

    }

    data.result.purified =

        calculatePurifiedEvolution(

            getPokemonData(pokemonId),

            data.result.estimatedLevel,

            attackIV,

            defenseIV,

            staminaIV

        );

    return data;

}


// --------------------------------------------
// 최대 강화 계산
// --------------------------------------------

function calculateMaxPokemon(
    pokemonId,
    attackIV,
    defenseIV,
    staminaIV
) {

    const pokemon = getPokemonData(pokemonId);

    if (pokemon === null) {

        return null;

    }

    return getMaxPokemon(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV

    );

}


// --------------------------------------------
// Great League 추천
// --------------------------------------------

function calculateGreatLeaguePokemon(
    pokemonId,
    attackIV,
    defenseIV,
    staminaIV
) {

    const pokemon = getPokemonData(pokemonId);

    if (pokemon === null) {

        return null;

    }

    return getBestGreatLeague(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV

    );

}


// --------------------------------------------
// Ultra League 추천
// --------------------------------------------

function calculateUltraLeaguePokemon(
    pokemonId,
    attackIV,
    defenseIV,
    staminaIV
) {

    const pokemon = getPokemonData(pokemonId);

    if (pokemon === null) {

        return null;

    }

    return getBestUltraLeague(

        pokemon,

        attackIV,

        defenseIV,

        staminaIV

    );

}


// --------------------------------------------
// JSON 출력
// --------------------------------------------

function exportResult(result) {

    return JSON.stringify(

        result,

        null,

        4

    );

}


// --------------------------------------------
// 콘솔 테스트
// --------------------------------------------

function debugCalculator(
    pokemonId,
    cp,
    hp,
    atk,
    def,
    sta
) {

    console.log(

        calculatePokemon(

            pokemonId,

            cp,

            hp,

            atk,

            def,

            sta

        )

    );

}
// ============================================
// calculator.js
// Part 8
// 유틸리티 및 검색 기능
// ============================================


// --------------------------------------------
// 포켓몬 이름으로 검색
// --------------------------------------------

function findPokemonByName(name) {

    const keyword = name.trim().toLowerCase();

    for (const id in pokemonData) {

        if (
            pokemonData[id].name.toLowerCase() === keyword
        ) {
            return pokemonData[id];
        }

    }

    return null;

}


// --------------------------------------------
// 이름 일부로 검색
// --------------------------------------------

function searchPokemon(keyword) {

    keyword = keyword.trim().toLowerCase();

    const results = [];

    for (const id in pokemonData) {

        if (
            pokemonData[id].name
            .toLowerCase()
            .includes(keyword)
        ) {

            results.push({

                id: id,

                name: pokemonData[id].name,

                finalName: pokemonData[id].finalName

            });

        }

    }

    return results;

}


// --------------------------------------------
// 존재 여부 확인
// --------------------------------------------

function hasPokemon(id) {

    return pokemonData[id] !== undefined;

}


// --------------------------------------------
// IV 문자열
// --------------------------------------------

function getIVString(
    attackIV,
    defenseIV,
    staminaIV
) {

    return `${attackIV}/${defenseIV}/${staminaIV}`;

}


// --------------------------------------------
// IV 등급 텍스트
// --------------------------------------------

function getIVRankText(ivPercent) {

    if (ivPercent === 100) {

        return "100%";

    }

    if (ivPercent >= 98) {

        return "98%+";

    }

    if (ivPercent >= 93) {

        return "93%+";

    }

    if (ivPercent >= 89) {

        return "89%+";

    }

    if (ivPercent >= 82) {

        return "82%+";

    }

    return "82% 미만";

}


// --------------------------------------------
// 레벨 문자열
// --------------------------------------------

function levelToString(level) {

    return "Lv." + level;

}


// --------------------------------------------
// CP 문자열
// --------------------------------------------

function cpToString(cp) {

    return cp.toLocaleString();

}


// --------------------------------------------
// HP 문자열
// --------------------------------------------

function hpToString(hp) {

    return hp.toLocaleString();

}


// --------------------------------------------
// 추천 색상
// --------------------------------------------

function getRecommendationColor(stars) {

    switch (stars) {

        case "★★★★★":
            return "#00C853";

        case "★★★★☆":
            return "#4CAF50";

        case "★★★☆☆":
            return "#FFC107";

        case "★★☆☆☆":
            return "#FF9800";

        default:
            return "#F44336";

    }

}


// --------------------------------------------
// 계산 결과 요약
// --------------------------------------------

function createSummary(result) {

    return {

        pokemon: result.finalName,

        cp: result.finalCP,

        hp: result.finalHP,

        iv: result.ivPercent.toFixed(1),

        league: result.league,

        recommendation: result.recommendation

    };

}


// --------------------------------------------
// 결과 복사용 문자열
// --------------------------------------------

function createShareText(result) {

    return `
포켓몬 : ${result.finalName}
예상 CP : ${result.finalCP}
예상 HP : ${result.finalHP}
예상 레벨 : ${result.estimatedLevel}
IV : ${result.ivPercent.toFixed(1)}%
리그 : ${result.league}
추천도 : ${result.recommendation}
`;
  // ============================================
// calculator.js
// Part 9
// 배치 계산 / 통계 / 검증
// ============================================


// --------------------------------------------
// 여러 포켓몬 한 번에 계산
// --------------------------------------------

function calculateBatch(pokemonList) {

    const results = [];

    for (const item of pokemonList) {

        const result = calculatePokemon(

            item.pokemonId,

            item.cp,

            item.hp,

            item.attackIV,

            item.defenseIV,

            item.staminaIV

        );

        results.push(result);

    }

    return results;

}


// --------------------------------------------
// 평균 IV 계산
// --------------------------------------------

function getAverageIV(resultList) {

    if (resultList.length === 0) {

        return 0;

    }

    let total = 0;

    let count = 0;

    for (const item of resultList) {

        if (item.success) {

            total += item.result.ivPercent;

            count++;

        }

    }

    if (count === 0) {

        return 0;

    }

    return total / count;

}


// --------------------------------------------
// 최고 CP 찾기
// --------------------------------------------

function getHighestCP(resultList) {

    let best = null;

    for (const item of resultList) {

        if (!item.success) {

            continue;

        }

        if (

            best === null ||

            item.result.finalCP > best.result.finalCP

        ) {

            best = item;

        }

    }

    return best;

}


// --------------------------------------------
// 최저 CP 찾기
// --------------------------------------------

function getLowestCP(resultList) {

    let best = null;

    for (const item of resultList) {

        if (!item.success) {

            continue;

        }

        if (

            best === null ||

            item.result.finalCP < best.result.finalCP

        ) {

            best = item;

        }

    }

    return best;

}


// --------------------------------------------
// 리그별 분류
// --------------------------------------------

function groupByLeague(resultList) {

    const groups = {

        great: [],

        ultra: [],

        master: []

    };

    for (const item of resultList) {

        if (!item.success) {

            continue;

        }

        switch (item.result.league) {

            case "Great League":

                groups.great.push(item);

                break;

            case "Ultra League":

                groups.ultra.push(item);

                break;

            default:

                groups.master.push(item);

                break;

        }

    }

    return groups;

}


// --------------------------------------------
// 계산 결과 검증
// --------------------------------------------

function verifyCalculation(result) {

    if (!result.success) {

        return false;

    }

    if (result.result.finalCP < 10) {

        return false;

    }

    if (result.result.finalHP < 10) {

        return false;

    }

    if (

        result.result.estimatedLevel < 1 ||

        result.result.estimatedLevel > 50

    ) {

        return false;

    }

    return true;

}


// --------------------------------------------
// 로그 출력
// --------------------------------------------

function logCalculation(result) {

    if (!result.success) {

        console.error(result.message);

        return;

    }

    console.group(result.result.finalName);

    console.log("현재 CP :", result.result.currentCP);

    console.log("현재 HP :", result.result.currentHP);

    console.log("예상 레벨 :", result.result.estimatedLevel);

    console.log("최종 CP :", result.result.finalCP);

    console.log("최종 HP :", result.result.finalHP);

    console.log("IV :", result.result.ivPercent.toFixed(1) + "%");

    console.log("리그 :", result.result.league);

    console.groupEnd();

}


// --------------------------------------------
// 초기화
// --------------------------------------------

function initializeCalculator() {

    console.log("Pokemon GO Calculator Engine Loaded");

    console.log("Version :", CALCULATOR_VERSION);

}
  // ============================================
// calculator.js
// Part 10
// 최종 유틸리티 및 초기화
// ============================================


// --------------------------------------------
// 계산 엔진 정보
// --------------------------------------------

const Calculator = {

    version: CALCULATOR_VERSION,

    author: "Pokemon CP Calculator",

    maxLevel: 50,

    minLevel: 1,

    levelStep: 0.5

};


// --------------------------------------------
// 지원 여부 확인
// --------------------------------------------

function isCalculatorReady() {

    if (typeof pokemonData === "undefined") {

        return false;

    }

    if (typeof cpm === "undefined") {

        return false;

    }

    return true;

}


// --------------------------------------------
// 데이터 개수
// --------------------------------------------

function getPokemonCount() {

    return Object.keys(pokemonData).length;

}


// --------------------------------------------
// 모든 포켓몬 ID
// --------------------------------------------

function getPokemonIds() {

    return Object.keys(pokemonData);

}


// --------------------------------------------
// 모든 포켓몬 이름
// --------------------------------------------

function getPokemonNames() {

    return Object.values(pokemonData).map(function (pokemon) {

        return pokemon.name;

    });

}


// --------------------------------------------
// 버전 출력
// --------------------------------------------

function getCalculatorVersion() {

    return Calculator.version;

}


// --------------------------------------------
// 계산기 정보
// --------------------------------------------

function getCalculatorInfo() {

    return {

        version: Calculator.version,

        pokemonCount: getPokemonCount(),

        minLevel: Calculator.minLevel,

        maxLevel: Calculator.maxLevel,

        levelStep: Calculator.levelStep

    };

}


// --------------------------------------------
// 엔진 테스트
// --------------------------------------------

function selfTest() {

    console.log("===== Calculator Self Test =====");

    console.log("Ready :", isCalculatorReady());

    console.log("Version :", getCalculatorVersion());

    console.log("Pokemon :", getPokemonCount());

    console.log("CPM :", Object.keys(cpm).length);

    console.log("===============================");

}


// --------------------------------------------
// 초기 실행
// --------------------------------------------

if (isCalculatorReady()) {

    initializeCalculator();

    selfTest();

} else {

    console.warn("Pokemon Data 또는 CPM Data가 없습니다.");

}

}


// --------------------------------------------
// 버전
// --------------------------------------------

const CALCULATOR_VERSION = "1.0.0";
