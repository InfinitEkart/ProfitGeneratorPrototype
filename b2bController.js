
import {getCategories} from "./tempDb.js";
import { indDB } from "./tempDb.js";

console.log(getCategories());

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

function getInputs(){
    b2bMinMax = document.getElementById('b2bMinMax');
    category = document.getElementById('category');
    asin= document.getElementById('asin');
    sku= document.getElementById('sku');
    productWeight= document.getElementById('productWeight');
    indPP= document.getElementById('indPP');
    pwMargin= document.getElementById('pwMargin');
    swLandingPrice= document.getElementById('swLandingPrice');
    pwShippingCharges= document.getElementById('pwShippingCharges');
    freightChargesPerKg= document.getElementById('freightChargesPerKg');
    totalFreightCharges= document.getElementById('totalFreightCharges');
    invoiceFreightCharges= document.getElementById('invoiceFreightCharges');
    aramexInsuranceCharges= document.getElementById('aramexInsuranceCharges');
    aramexInsurance= document.getElementById('aramexInsurance');
    cifValue= document.getElementById('cifValue');
    pwDuty= document.getElementById('pwDuty');
    dutyOnDuty= document.getElementById('dutyOnDuty');
    vatPwShipment= document.getElementById('vatPwShipment');
    frdm= document.getElementById('frdm');
    deliveryDutyPaid= document.getElementById('deliveryDutyPaid');
    swLocalCourier= document.getElementById('swLocalCourier');
    swMargin= document.getElementById('swMargin');
    panelCommission= document.getElementById('panelCommission');
    countryVatOnPanel= document.getElementById('countryVatOnPanel');
    returnOnProduct= document.getElementById('returnOnProduct');
    calculation= document.getElementById('calculation');
    roundUpSw= document.getElementById('roundUpSw');
    swExtraProfitINR= document.getElementById('swExtraProfitINR');
    spINR= document.getElementById('spINR');
    spCurrency= document.getElementById('spCurrency');
    isProfit= document.getElementById('isProfit');
    pwInvoiceINR= document.getElementById('pwInvoiceINR');
    salesInvoiceCurrency= document.getElementById('salesInvoiceCurrency');
}

function setDefaultValues(){
    pwMarginPerVal = 10;
    pwDutyPercentVal = 5;
    dutyOnDutyPercentVal = 5;
    vatPwShipmentPercentVal = 5;
    frdmDefaultVal = 464.75;
    deliveryDutyPaidVal = 168.75;
    swMarginPercentVal = 15;
    panelCommissionPercentVal=15;
    countryVatOnPanelPercentVal = 5;
    if(b2bMinMax.value == "min")
        returnOnProductPercentVal = 0;
    else
        returnOnProductPercentVal = 5;
    roundUpVal = 5;
    spCurrencyVal = 22;
    salesInvoiceCurrencyVal = 22;

    freightChargesPerKg.value = 3;
    aramexInsuranceCharges.value = 1;
    swLocalCourier.value = 236.25;
}

export function enableSpINR(){  
    getInputs();  
    setDefaultValues();
    if(productWeight.value!="" && indPP.value!="" && asin.value != ""){
            pwShippingCharges.value = formulas.pwShippingCharges(Number(productWeight.value), indDB);
            generateProfit(true, true);
    }else{
        alert("Mandatory fields are missing.");
    }
}

document.querySelector("button").addEventListener('click',enableSpINR);

function checkForProfit(isProfitVal,isIncre){
    if(isProfitVal){
        isProfit.innerHTML = "Profit";
        isProfit.style.backgroundColor = "green";
        roundUpSw.style.backgroundColor = "green";
        roundUpSw.style.borderWidth = "10";
        roundUpSw.style.color = "yellow";
        if(isIncre){
            spINR.value = Number(spINR.value) - Number(swExtraProfitINR.value);
            console.log(spINR.value, swExtraProfitINR.value);
            if(Number(swExtraProfitINR.value) > 3) 
                generateProfit(true, false);
            else
                generateProfit(false, false);
        }else{
            swExtraProfitINR.value = Number(roundUpSw.value)-Number(calculation.value);
        }
    }else if(isIncre){
        isProfit.innerHTML = "Loss";
        isProfit.style.backgroundColor = "red";
        if(Number(spINR.value) < 1000)
            spINR.value = Number(spINR.value) +100;
        else if(Number(spINR.value) < 10000)
            spINR.value = Number(spINR.value) +1000;
        else if(Number(spINR.value) < 100000)
            spINR.value = Number(spINR.value) +10000;
        else
            spINR.value = Number(spINR.value) +100000;
            
        generateProfit(isIncre, false);
    }
}

function generateProfit(isIncre, isFirstCall){
    getInputs();
    sku.value = formulas.sku(category.value,productWeight.value,asin.value);
    pwMargin.value = formulas.pwMargin(Number(indPP.value),Number(pwMarginPerVal));
    swLandingPrice.value = formulas.swLandingPrice(Number(indPP.value),Number(pwMargin.value));
    
    totalFreightCharges.value = formulas.totalFreightCharges(Number(swLandingPrice.value),Number(productWeight.value),Number(freightChargesPerKg.value));
    invoiceFreightCharges.value = formulas.invoiceFreightCharges(Number(swLandingPrice.value),Number(totalFreightCharges.value));
    aramexInsurance.value = formulas.aramexInsurance(Number(invoiceFreightCharges.value),Number( aramexInsuranceCharges.value));
    cifValue.value = formulas.cifValue(Number(swLandingPrice.value),Number(pwShippingCharges.value),Number(totalFreightCharges.value),Number(aramexInsurance.value));
    pwDuty.value = formulas.pwDuty(Number(swLandingPrice.value),Number(cifValue.value),Number(pwDutyPercentVal));
    dutyOnDuty.value = formulas.dutyOnDuty(Number(pwDuty.value),Number(dutyOnDutyPercentVal));
    frdm.value = formulas.frdm(Number(swLandingPrice.value),Number(frdmDefaultVal));
    deliveryDutyPaid.value = formulas.deliveryDutyPaid(Number(swLandingPrice.value),Number(deliveryDutyPaidVal));
    
    if(isFirstCall){
        spINR.value = (Number(swLandingPrice.value)+Number(pwShippingCharges.value)+Number(dutyOnDuty.value)+Number(frdm.value)+Number(deliveryDutyPaid.value)+Number(swLocalCourier.value));
        spINR.value = Number(spINR.value)+Math.round(Number(spINR.value)/2);
    }   
    pwInvoiceINR.value = formulas.pwInvoiceINR(Number(swLandingPrice.value));
    vatPwShipment.value = formulas.vatPwShipment(Number(pwInvoiceINR.value),Number(vatPwShipmentPercentVal));
    swMargin.value = formulas.swMargin(Number(spINR.value),Number(swMarginPercentVal));
    panelCommission.value = formulas.panelCommission(Number(spINR.value),Number(panelCommissionPercentVal));
    countryVatOnPanel.value = formulas.countryVatOnPanel(Number(spINR.value),Number(countryVatOnPanelPercentVal));
    returnOnProduct.value = formulas.returnOnProduct(Number(spINR.value),Number(returnOnProductPercentVal));
    calculation.value = formulas.calculation(Number(swLandingPrice.value),Number(pwShippingCharges.value),Number(pwDuty.value),Number(vatPwShipment.value),Number(frdm.value),Number(deliveryDutyPaid.value),Number(swLocalCourier.value),Number(swMargin.value),Number(panelCommission.value),Number(countryVatOnPanel.value),Number(returnOnProduct.value));
    roundUpSw.value = formulas.roundUpSw(Number(calculation.value),Number(roundUpVal));
    swExtraProfitINR.value = formulas.swExtraProfitINR(Number(spINR.value),Number(calculation.value));
    spCurrency.value = formulas.spCurrency(Number(roundUpSw.value),Number(spCurrencyVal));
    pwInvoiceINR.value = formulas.pwInvoiceINR(Number(swLandingPrice.value));
    salesInvoiceCurrency.value = formulas.pwInvoiceInCurrency(Number(pwInvoiceINR.value),Number(salesInvoiceCurrencyVal));
    checkForProfit(formulas.isProfit(Number(calculation.value),Number(spINR.value)), isIncre);
   
}

document.querySelector("#checkDiff").addEventListener('click',calcRevDiff);

function calcRevDiff(){
    let revSpCurrencyIp = document.getElementById('revSpCurrency');
    let revSpDiff = document.getElementById('revSpDiff');
    let revINRDiff = document.getElementById('revINRDiff');
    let revResult = document.getElementById('revResult');

    if(Number(revSpCurrencyIp.value) >= Number(spCurrency.value))
    {
        revResult.innerHTML = "Profit";
        revResult.className = "bg-success";
    }else{
        revResult.innerHTML = "Loss";
        revResult.className = "bg-danger";
    }

    revSpDiff.value = Number(revSpCurrencyIp.value)-Number(spCurrency.value);
    revINRDiff.value = Number(revSpDiff.value)*spCurrencyVal;

}

