
import {getCategories} from "./tempDb.js";
import { indDB } from "./tempDb.js";

//console.log(getCategories());

function loadCategories(){
    let categoryOptions = "";
    getCategories().forEach(category=> categoryOptions+= "<option value="+ category.prId +">"+ category.categoryDesc +"</option>");
    document.getElementById('category').innerHTML = categoryOptions;
}
loadCategories();

const formulas = {
    sku: (categoryId,prodWghtInKgs,asin)=> {return  "BI"+categoryId+((prodWghtInKgs*2)<10? '0'+(prodWghtInKgs*2) : (prodWghtInKgs*2))+asin},
    pwMargin : (indPPVal,pwMarginPerVal) => {return indPPVal*(pwMarginPerVal/100)},
    swLandingPrice: (indPPVal,pwMargin) => {return indPPVal + pwMargin},
    pwShippingCharges: (productWeight, indDB) => {return indDB[productWeight]},
    totalFreightCharges : (swLandingPrice,productWght,freightChargesPerKg) => { return swLandingPrice<18501 ? 0 : productWght > 25 ? productWght*freightChargesPerKg*82.5 : 25*freightChargesPerKg*82.5;  },
    invoiceFreightCharges : (swLandingPrice,totalFreightCharges) => { return swLandingPrice+totalFreightCharges },
    aramexInsurance: (invoiceFreightCharges,aramexInsuranceCharge) => {return invoiceFreightCharges<18500 ? 0 :invoiceFreightCharges*(aramexInsuranceCharge/100)},
    cifValue : (swLandingPrice,pwShippingCharges,totalFreightCharges,aramexInsurance) => {return swLandingPrice+pwShippingCharges+totalFreightCharges+aramexInsurance},
    pwDuty : (swLandingPrice,cifValue,pwDutyPercentVal) => {return swLandingPrice < 18501 ? 0 : cifValue *(pwDutyPercentVal/100)},
    dutyOnDuty : (pwDuty,dutyOnDutyPercentVal) => {return pwDuty *(dutyOnDutyPercentVal/100)},
    vatPwShipment : (pwInvoiceINR, vatPwShipmentPercentVal) => {return pwInvoiceINR * (vatPwShipmentPercentVal/100)},
    frdm : (swLandingPrice,frdmDefaultVal) => {return swLandingPrice < 18500 ? 0 : frdmDefaultVal},
    deliveryDutyPaid: (swLandingPrice, deliveryDutyPaidVal) => {return swLandingPrice < 18500 ? 0 : deliveryDutyPaidVal},
    swLocalCourier: (currencyVal,defaultVal)=> {return currencyVal*defaultVal},
    swMargin : (spINR,swMarginPercentVal) => {return spINR * (swMarginPercentVal/100)},
    panelCommission: (spINR,panelCommissionPercentVal) => {return spINR * (panelCommissionPercentVal/100) },
    countryVatOnPanel: (spINR,countryVatOnPanelPercentVal) => { return spINR * (countryVatOnPanelPercentVal/100)},
    returnOnProduct : (spINR,returnOnProductPercentVal) => { return spINR * (returnOnProductPercentVal/100)},
    calculation: (swLandingPrice,pwShipingCharges,pwDuty,vatPwShipment,frdm,deliveryDutyPaid,swLocalCourierCharges,swMargin,panelCommission,countryVatOnPanel,returnOnProduct) => { return swLandingPrice+pwShipingCharges+pwDuty+vatPwShipment+frdm+deliveryDutyPaid+swLocalCourierCharges+swMargin+panelCommission+countryVatOnPanel+returnOnProduct},
    roundUpSw: (calculation, roundUpVal) => { return Math.ceil(calculation/roundUpVal) * roundUpVal},
    swExtraProfitINR : (spINR,calculation) => { return spINR-calculation},
    spCurrency : (spINR,spCurrenyVal) => {return spINR/spCurrenyVal},
    isProfit: (calculation, spINR) => calculation <= spINR,
    pwInvoiceINR : (swLandingPrice) => { return swLandingPrice},
    pwInvoiceInCurrency : (pwInvoiceINR, pwInvoiceInCurrencyVal) => { return pwInvoiceINR/pwInvoiceInCurrencyVal}
};

/* Declaration */
var b2bMinMax, category , asin, sku, productWeight, indPP, pwMargin, swLandingPrice, pwShippingCharges, freightChargesPerKg, totalFreightCharges, invoiceFreightCharges, aramexInsuranceCharges, aramexInsurance, cifValue, pwDuty, dutyOnDuty, vatPwShipment, frdm, deliveryDutyPaid, swLocalCourier, swMargin, panelCommission, countryVatOnPanel, returnOnProduct, calculation, roundUpSw, swExtraProfitINR, spINR, spCurrency, isProfit, pwInvoiceINR, salesInvoiceCurrency;
var pwMarginPerVal, pwDutyPercentVal, dutyOnDutyPercentVal, vatPwShipmentPercentVal, frdmDefaultVal, deliveryDutyPaidVal, swMarginPercentVal,panelCommissionPercentVal, countryVatOnPanelPercentVal, returnOnProductPercentVal, roundUpVal, spCurrencyVal, salesInvoiceCurrencyVal;
var formData = {};
var isProfit = "";
const elementIds = [
    'b2bMinMax', 'category', 'asin', 'sku', 'productWeight', 'indPP', 'pwMargin', 
    'swLandingPrice', 'pwShippingCharges', 'freightChargesPerKg', 'totalFreightCharges', 
    'invoiceFreightCharges', 'aramexInsuranceCharges', 'aramexInsurance', 'cifValue', 
    'pwDuty', 'dutyOnDuty', 'vatPwShipment', 'frdm', 'deliveryDutyPaid', 'swLocalCourier', 
    'swMargin', 'panelCommission', 'countryVatOnPanel', 'returnOnProduct', 'calculation', 
    'roundUpSw', 'swExtraProfitINR', 'spINR', 'spCurrency', 'pwInvoiceINR', 
    'salesInvoiceCurrency'
];

function getInputs() {

    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            formData[id] = element.value;
        }
    });

}

function setOutput(){
    limitDecimalsTo3();
    elementIds.forEach(id => {
           document.getElementById(id).value = formData[id];
        });
}


function limitDecimalsTo3() {
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            // Check if the value is a number and has decimals
            if (!isNaN(formData[key]) && typeof formData[key] === 'number') {
                // Limit the value to 3 decimal places                
                if (formData[key] === Math.floor(formData[key])) {
                    formData[key] = Math.floor(formData[key]); // Convert to integer
                }else{
                    formData[key] = parseFloat(formData[key]).toFixed(3); 
                }
            }
        }
    }   
}


function setDefaultValues() {
    
    isProfit = document.getElementById('isProfit');
    roundUpSw = document.getElementById('roundUpSw');

    // Set default values for all form fields inside formData
    formData.pwMarginPerVal = 10;
    formData.pwDutyPercentVal = 5;
    formData.dutyOnDutyPercentVal = 5;
    formData.vatPwShipmentPercentVal = 5;
    formData.frdmDefaultVal = 464.75;
    formData.deliveryDutyPaidVal = 168.75;
    formData.swMarginPercentVal = 15;
    formData.panelCommissionPercentVal = 15;
    formData.countryVatOnPanelPercentVal = 5;

    // Set the returnOnProductPercentVal based on the b2bMinMax value
    formData.returnOnProductPercentVal = (formData.b2bMinMax === "min") ? 0 : 5;

    formData.roundUpVal = 5;
    formData.spCurrencyVal = 22;
    formData.salesInvoiceCurrencyVal = 22;

    // Apply default values for formData fields
    formData.freightChargesPerKg = 3;
    formData.aramexInsuranceCharges = 1;
    formData.swLocalCourier = 236.25;
}


export function enableSpINR(){ 
        getInputs(); 

    setDefaultValues();
    if (formData.productWeight !== "" && formData.indPP !== "" && formData.asin !== "") {
        formData.pwShippingCharges = formulas.pwShippingCharges(Number(formData.productWeight), indDB);
        generateProfit(true, true);
    } else {
        alert("Mandatory fields are missing.");
    }
}

document.querySelector("button").addEventListener('click',enableSpINR);

function checkForProfit(isProfitVal, isIncre) {
    if (isProfitVal) {
        isProfit.innerHTML = "Profit";
        isProfit.style.backgroundColor = "green";
        roundUpSw.style.backgroundColor = "green";
        roundUpSw.style.borderWidth = "10";
        roundUpSw.style.color = "yellow";

        if (isIncre) {
            formData.spINR = Number(formData.spINR) - Number(formData.swExtraProfitINR);
            console.log(formData.spINR, formData.swExtraProfitINR);
            if (Number(formData.swExtraProfitINR) > 3) 
                generateProfit(true, false);
            else
                generateProfit(false, false);
        } else {
            formData.swExtraProfitINR = Number(formData.roundUpSw) - Number(formData.calculation);
        }
        
    } else if (isIncre) {
        isProfit.innerHTML = "Loss";
        isProfit.style.backgroundColor = "red";

        if (Number(formData.spINR) < 1000)
            formData.spINR = Number(formData.spINR) + 100;
        else if (Number(formData.spINR) < 10000)
            formData.spINR = Number(formData.spINR) + 1000;
        else if (Number(formData.spINR) < 100000)
            formData.spINR = Number(formData.spINR) + 10000;
        else
            formData.spINR = Number(formData.spINR) + 100000;

           //console.log(formData.spINR);
        generateProfit(isIncre, false);
    }
    //console.log("OUTPUT ",formData);
    setOutput();
}
function generateProfit(isIncre, isFirstCall){
    //console.log(formData);
    formData.sku = formulas.sku(formData.category, formData.productWeight, formData.asin);
    formData.pwMargin = formulas.pwMargin(Number(formData.indPP), Number(formData.pwMarginPerVal));
    formData.swLandingPrice = formulas.swLandingPrice(Number(formData.indPP), Number(formData.pwMargin));
    
    formData.totalFreightCharges = formulas.totalFreightCharges(Number(formData.swLandingPrice), Number(formData.productWeight), Number(formData.freightChargesPerKg));
    formData.invoiceFreightCharges = formulas.invoiceFreightCharges(Number(formData.swLandingPrice), Number(formData.totalFreightCharges));
    formData.aramexInsurance = formulas.aramexInsurance(Number(formData.invoiceFreightCharges), Number(formData.aramexInsuranceCharges));
    formData.cifValue = formulas.cifValue(Number(formData.swLandingPrice), Number(formData.pwShippingCharges), Number(formData.totalFreightCharges), Number(formData.aramexInsurance));
    formData.pwDuty = formulas.pwDuty(Number(formData.swLandingPrice), Number(formData.cifValue), Number(formData.pwDutyPercentVal));
    formData.dutyOnDuty = formulas.dutyOnDuty(Number(formData.pwDuty), Number(formData.dutyOnDutyPercentVal));
    formData.frdm = formulas.frdm(Number(formData.swLandingPrice), Number(formData.frdmDefaultVal));
    formData.deliveryDutyPaid = formulas.deliveryDutyPaid(Number(formData.swLandingPrice), Number(formData.deliveryDutyPaidVal));
    
    if(isFirstCall){
        formData.spINR = (Number(formData.swLandingPrice) + Number(formData.pwShippingCharges) + Number(formData.dutyOnDuty) + Number(formData.frdm) + Number(formData.deliveryDutyPaid) + Number(formData.swLocalCourier));
        formData.spINR = Number(formData.spINR) + Math.round(Number(formData.spINR) / 2);
       
    }   
    formData.pwInvoiceINR = formulas.pwInvoiceINR(Number(formData.swLandingPrice));
    formData.vatPwShipment = formulas.vatPwShipment(Number(formData.pwInvoiceINR), Number(formData.vatPwShipmentPercentVal));
    formData.swMargin = formulas.swMargin(Number(formData.spINR), Number(formData.swMarginPercentVal));
    formData.panelCommission = formulas.panelCommission(Number(formData.spINR), Number(formData.panelCommissionPercentVal));
    formData.countryVatOnPanel = formulas.countryVatOnPanel(Number(formData.spINR), Number(formData.countryVatOnPanelPercentVal));
    formData.returnOnProduct = formulas.returnOnProduct(Number(formData.spINR), Number(formData.returnOnProductPercentVal));
    formData.calculation = formulas.calculation(Number(formData.swLandingPrice), Number(formData.pwShippingCharges), Number(formData.pwDuty), Number(formData.vatPwShipment), Number(formData.frdm), Number(formData.deliveryDutyPaid), Number(formData.swLocalCourier), Number(formData.swMargin), Number(formData.panelCommission), Number(formData.countryVatOnPanel), Number(formData.returnOnProduct));
    formData.roundUpSw = formulas.roundUpSw(Number(formData.calculation), Number(formData.roundUpVal));
    formData.swExtraProfitINR = formulas.swExtraProfitINR(Number(formData.spINR), Number(formData.calculation));
    formData.spCurrency = formulas.spCurrency(Number(formData.roundUpSw), Number(formData.spCurrencyVal));
    formData.pwInvoiceINR = formulas.pwInvoiceINR(Number(formData.swLandingPrice));
    formData.salesInvoiceCurrency = formulas.pwInvoiceInCurrency(Number(formData.pwInvoiceINR), Number(formData.salesInvoiceCurrencyVal));
    checkForProfit(formulas.isProfit(Number(formData.calculation), Number(formData.spINR)), isIncre);
}


document.querySelector("#checkDiff").addEventListener('click',calcRevDiff);

function calcRevDiff(){
    let revSpCurrencyIp = document.getElementById('revSpCurrency');
    let revSpDiff = document.getElementById('revSpDiff');
    let revINRDiff = document.getElementById('revINRDiff');
    let revResult = document.getElementById('revResult');

    if(Number(revSpCurrencyIp.value) >= Number(formData.spCurrency))
    {
        revResult.innerHTML = "Profit";
        revResult.className = "bg-success";
    }else{
        revResult.innerHTML = "Loss";
        revResult.className = "bg-danger";
    }

    revSpDiff.value = Number(revSpCurrencyIp.value)-Number(formData.spCurrency);
    revINRDiff.value = Number(revSpDiff.value)*formData.spCurrencyVal;

}


export function processBulkData(jsonData){

    console.log(jsonData);
    let opJsons = [];
    for(let xlData of jsonData){

        document.getElementById('asin').value = xlData.ASIN;
        
        document.getElementById('productWeight').value = xlData.ProductWght;
        document.getElementById('indPP').value = xlData.INDProductPrice;
        //formData.asin = xlData.ASIN;
        let selectedCategory = getCategories().filter((category)=> category.categoryDesc==xlData.Category);
        //console.log(selectedCategory);
        //formData.productWeight = Number(xlData.ProductWght);
        //formData.indPP = Number(xlData.INDProductPrice);

        if(selectedCategory.length > 0 )
        {  
            document.getElementById('category').value = selectedCategory[0].prId;
            //formData.category = selectedCategory[0].prId;       
            enableSpINR(true);
            console.log("Loop OP ", formData);
            xlData.RoundUp = formData.roundUpSw;
            xlData.SPINR = formData.spINR;
            xlData.ExtraProfitInINR = formData.swExtraProfitINR;
            xlData.spCurrencyValue = formData.spCurrency;
            xlData.ProfitOrLoss = "PROFIT";
            opJsons.push(xlData);
            formData = {};
        }else{
            alert("Invalid Category");
        }
       // console.log(opJsons);
    }
    return opJsons;
}
