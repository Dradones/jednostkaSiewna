const visitedElements = document.querySelectorAll('input, select');
visitedElements.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            this.classList.add('visited');
        } else {
            this.classList.remove('visited');
        }
    });
});

function adjustInputWidths() {
    const containers = document.querySelectorAll('.input');
    containers.forEach(container => {
        const input = container.querySelector('input');
        const unit = container.querySelector('.unit');

        const fontSize = parseFloat(window.getComputedStyle(input, null).getPropertyValue('font-size'));
        const containerWidth = container.offsetWidth;
        const unitWidth = unit.offsetWidth;
        const inputWidth = containerWidth - unitWidth - (2 * fontSize);

        input.style.width = `${inputWidth}px`;
    });
}
window.addEventListener('load', adjustInputWidths);
window.addEventListener('resize', adjustInputWidths);

let timeoutID;
function waiting() {
    timeoutID = setTimeout(function() {
        const sowingSeedRateHectareElement = document.getElementById("sowingSeedRateHectare");
        if (sowingSeedRateHectareElement.innerHTML === "") {
            sowingSeedRateHectareElement.classList.add("tooBig");
            sowingSeedRateHectareElement.innerHTML = "uzupełnij wartości";
        }
    }, 5000);
}
function resetTimeout() {
    clearTimeout(timeoutID);
    waiting();
}
window.addEventListener('input', resetTimeout);
window.addEventListener('click', resetTimeout);

function textToNumber(variable) {
    variable = variable.replace(/[^0-9.,]/g, '');
    if (variable.includes(",")) {
        variable = variable.replace(",", ".");
    }

    variable = oneDot(variable);

    variable = separator(variable);
    return variable;
}
function isPercent(variable) {
    return variable > 100 ? "" : variable;
}

function onlyInteger(variable) {
    if(variable.indexOf('0') === 0){
        return variable.slice(1);
    }

    return variable.includes(".") ? variable.replace(".", "") : variable;
}

function oneDot(variable) {
    const firstDotIndex = variable.indexOf('.');

    if (firstDotIndex === -1){
        return variable;
    }
    if(firstDotIndex === 0){
        variable = "0.";
        return variable;
    }
    const beforeDot = variable.slice(0, firstDotIndex + 1);
    let afterDot = variable.slice(firstDotIndex + 1);
    afterDot = afterDot.replace(".", "");
    afterDot = afterDot.slice(0, 2);

    return beforeDot + afterDot;
}

function separator(variable) {
    const separatorIndex = variable.indexOf('.');
    let beforeDot, afterDot, result = "";

    if (separatorIndex === -1) {
        beforeDot = variable;
        afterDot = '';
    } else {
        beforeDot = variable.slice(0, separatorIndex);
        afterDot = variable.slice(separatorIndex);
    }

    const firstGroupSize = beforeDot.length % 3 || 3;
    result = beforeDot.slice(0, firstGroupSize);
    beforeDot = beforeDot.slice(firstGroupSize);

    while (beforeDot.length > 0) {
        result += " " + beforeDot.slice(0, 3);
        beforeDot = beforeDot.slice(3);
    }
    return result + afterDot;
}
window.addEventListener('load', function(){
    document.getElementById("finalPlantSpaceText").classList.add("none");
    document.getElementById("sowingSeedRateText").classList.add("none");
    document.getElementById("seedingUnitText").classList.add("none");
    document.getElementById("seedsMassText").classList.add("none");

    document.getElementById("finalPlantSpaceDisplay").classList.add("none");
    document.getElementById("sowingSeedRateDisplay").classList.add("none");
    document.getElementById("seedingUnitDisplay").classList.add("none");
    document.getElementById("seedsMassDisplay").classList.add("none");
})

function calculate() {
    const rowWidthElement = document.getElementById("rowWidth");
    const plantSpaceElement = document.getElementById("plantSpace");
    const sowingPlantRateElement = document.getElementById("sowingPlantRate");
    const finalPlantSpace = document.getElementById("finalPlantSpace");
    const germinationStrengthElement = document.getElementById("germinationStrength");
    const germinationConditionElement = document.getElementById("germinationCondition");
    const birdsRiskElement = document.getElementById("birdsRisk");
    const flyRiskElement = document.getElementById("flyRisk");
    const sowingSeedRateHectareElement = document.getElementById("sowingSeedRateHectare");
    const seedingUnitIndexElement = document.getElementById("seedingUnitIndex");
    const seedingUnitMassElement = document.getElementById("seedingUnitMass");
    const seedingUnitElement = document.getElementById("seedingUnit");
    const sowingSeedRateMeterElement = document.getElementById("sowingSeedRateMeter");
    const seedsMassElement = document.getElementById("seedsMass");
    
    let rowWidth = rowWidthElement.value;
    rowWidth = textToNumber(rowWidth);
    rowWidthElement.value = rowWidth;
    rowWidth = parseFloat(rowWidth.replace(/\s+/g, ''));

    let plantSpace = plantSpaceElement.value;
    plantSpace = textToNumber(plantSpace);
    plantSpaceElement.value = plantSpace;
    plantSpace = parseFloat(plantSpace.replace(/\s+/g, ''));

    let sowingPlantRate = sowingPlantRateElement.value;
    sowingPlantRate = textToNumber(sowingPlantRate);
    sowingPlantRate = onlyInteger(sowingPlantRate);
    sowingPlantRateElement.value = sowingPlantRate;
    sowingPlantRate = parseFloat(sowingPlantRate.replace(/\s+/g, ''));

    if (isNaN(sowingPlantRate) || sowingPlantRate === Infinity || sowingPlantRate === 0 || sowingPlantRate === "") {
        if (rowWidth && plantSpace) {
            sowingPlantRate = (10000 / Number(rowWidth) / Number(plantSpace)) * 10000;
            sowingPlantRate = Math.round(sowingPlantRate);

            if (!isNaN(sowingPlantRate) && sowingPlantRate !== Infinity) {
                sowingPlantRateElement.classList.add("toCalculate");
                sowingPlantRate = separator(sowingPlantRate.toString());
                sowingPlantRateElement.value = sowingPlantRate;
                sowingPlantRate = parseFloat(sowingPlantRate.replace(/\s+/g, ''))
            } else {
                sowingPlantRateElement.value = "";
            }
        }
    } else if (isNaN(plantSpace) || plantSpace === "" || plantSpaceElement.classList.contains("toCalculate")) {
        plantSpaceElement.classList.add("toCalculate");

        if (sowingPlantRate) {
            plantSpace = (100000000 / Number(rowWidth) / Number(sowingPlantRate));
            plantSpace = Math.round(plantSpace * 100) / 100;

            if (!isNaN(plantSpace) && plantSpace !== Infinity) {
                plantSpaceElement.classList.add("toCalculate");
                plantSpaceElement.value = plantSpace;
            } else {
                plantSpaceElement.value = "";
            }
        }
    }
    if(sowingPlantRate === "" || document.getElementById("sowingPlantRate").classList.contains("toCalculate")){

        sowingPlantRate = (10000/Number(rowWidth)/Number(plantSpace))*10000;
        sowingPlantRate = Math.round(sowingPlantRate * 10) / 10;

        if(sowingPlantRate != Infinity && !isNaN(sowingPlantRate)){
           document.getElementById("sowingPlantRate").classList.add("toCalculate");
            document.getElementById("sowingPlantRate").value = sowingPlantRate;
        } else {
            document.getElementById("sowingPlantRate").value = "";
        }
    } else if(plantSpace === "" || document.getElementById("plantSpace").classList.contains("toCalculate")){
        document.getElementById("plantSpace").classList.add("toCalculate");

        plantSpace = (100000000/Number(rowWidth)/Number(sowingPlantRate));
        plantSpace = Math.round(plantSpace * 10) / 10;

        if(plantSpace != Infinity && !isNaN(sowingPlantRate)){
            document.getElementById("plantSpace").classList.add("toCalculate");
            document.getElementById("plantSpace").value = plantSpace;
        } else {
            document.getElementById("plantSpace").value = "";
        }
    }

    let germinationStrength = germinationStrengthElement.value;
    germinationStrength = textToNumber(germinationStrength);
    germinationStrength = isPercent(germinationStrength);
    germinationStrengthElement.value = germinationStrength;
    germinationStrength = parseFloat(germinationStrength.replace(/\s+/g, '')) / 100;

    const germinationCondition = textToNumber(germinationConditionElement.value);
    const birdsRisk = textToNumber(birdsRiskElement.value);
    const flyRisk = textToNumber(flyRiskElement.value);

    let sowingSeedRateHectare = (Number(sowingPlantRate) / Number(germinationStrength) / Number(germinationCondition) / Number(birdsRisk) / Number(flyRisk));
    sowingSeedRateHectare = Math.round(sowingSeedRateHectare);

    let sowingSeedRateMeter = (Number(sowingSeedRateHectare) / 10000);
    sowingSeedRateMeter = Math.round(sowingSeedRateMeter * 100) / 100;

    if (isNaN(sowingSeedRateHectare) || sowingSeedRateHectare === Infinity || sowingSeedRateHectare === 0) {
        sowingSeedRateHectareElement.innerHTML = "";
    } else {
        document.getElementById("finalPlantSpaceText").classList.remove("none");
        document.getElementById("finalPlantSpaceDisplay").classList.remove("none");

        document.getElementById("sowingSeedRateText").classList.remove("none");
        document.getElementById("sowingSeedRateDisplay").classList.remove("none");

        sowingSeedRateHectareElement.classList.remove("tooBig");
        sowingSeedRateHectare = separator(sowingSeedRateHectare.toString());
        sowingSeedRateHectareElement.innerHTML = sowingSeedRateHectare + " szt./ha";
        sowingSeedRateHectare = parseFloat(sowingSeedRateHectare.replace(/\s+/g, ''));
        sowingSeedRateMeterElement.innerHTML = sowingSeedRateMeter + " szt./m&sup2;";

        finalPlantSpace.innerHTML = Math.round((100000000/Number(sowingSeedRateHectare)/Number(rowWidth))* 10 ) / 10;
        }

    let seedingUnitIndex = seedingUnitIndexElement.value;
    seedingUnitIndex = textToNumber(seedingUnitIndex);
    seedingUnitIndex = onlyInteger(seedingUnitIndex);
    seedingUnitIndexElement.value = seedingUnitIndex;
    seedingUnitIndex = parseFloat(seedingUnitIndex.replace(/\s+/g, ''));

    let seedingUnit = (Number(sowingSeedRateHectare) / Number(seedingUnitIndex));
    seedingUnit = Math.round(seedingUnit * 100) / 100;

    if (isNaN(seedingUnit) || seedingUnit === Infinity) {
        seedingUnitElement.innerHTML = "";
    } else {
        document.getElementById("seedingUnitText").classList.remove("none");
        document.getElementById("seedingUnitDisplay").classList.remove("none");
        seedingUnitElement.innerHTML = seedingUnit + " js.";
    }

    let seedingUnitMass = seedingUnitMassElement.value;
    seedingUnitMass = textToNumber(seedingUnitMass);
    seedingUnitMassElement.value = seedingUnitMass;
    seedingUnitMass = parseFloat(seedingUnitMass.replace(/\s+/g, ''));

    let seedsMass = ((Number(sowingSeedRateHectare) / Number(seedingUnitIndex)) * Number(seedingUnitMass));
    seedsMass = Math.round(seedsMass * 100) / 100;

    if (seedsMass === 0 || isNaN(seedsMass)) {
        seedsMassElement.innerHTML = "";
    } else {
        document.getElementById("seedsMassText").classList.remove("none");
        document.getElementById("seedsMassDisplay").classList.remove("none");
        seedsMassElement.innerHTML = seedsMass + " kg";
    }
}
window.addEventListener('click', calculate);
window.addEventListener('input', calculate);

function reset() {
    const elements = ["rowWidth", "plantSpace", "sowingPlantRate", "germinationStrength", 
        "germinationCondition", "birdsRisk", "flyRisk", "seedingUnitIndex", 
        "seedingUnitMass"];

    elements.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = "";  
            inputElement.classList.remove('visited', 'toCalculate');
        }
    });

    const outputElements = ["sowingSeedRateHectare", "finalPlantSpace", "seedingUnit", "sowingSeedRateMeter", "seedsMass"];

    outputElements.forEach(id => {
        const outputElement = document.getElementById(id);
        if (outputElement) {
            outputElement.innerHTML = ""; 
            outputElement.classList.remove('visited', 'tooBig');
        }
    });

    const noneElements = ["finalPlantSpaceText", "sowingSeedRateText", "seedingUnitText", "seedsMassText", "finalPlantSpaceDisplay", "sowingSeedRateDisplay", "seedingUnitDisplay", "seedsMassDisplay"];

    noneElements.forEach(id => {
        const noneElement = document.getElementById(id);
        if (noneElement) {
            noneElement.classList.add('none');
        }
    });
}