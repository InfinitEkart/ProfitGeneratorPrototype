
const formulas = {

    pwMargin : (indPPVal,pwMarginPerVal) => {return indPPVal*(pwMarginPerVal/100)},
    swLandingPrice: (indPPVal,pwMargin) => {return indPPVal + pwMargin},
    pwShippingCharges: (productWeight, indDB) => {return indDB[productWeight]},
    totalFreightCharges : (swLandingPrice,productWght,freightChargesPerKg) => { return swLandingPrice<18501 ? 0 : productWght > 25 ? productWght*freightChargesPerKg*82.5 : 25*freightChargesPerKg*82.5;  },
    invoiceFreightCharges : (swLandingPrice,totalFreightCharges) => { return swLandingPrice+totalFreightCharges },
    aramexInsurance: (invoiceFreightCharges,aramexInsuranceCharge) => {return invoiceFreightCharges<18500 ? 0 :invoiceFreightCharges*(aramexInsuranceCharge/100)},
    cifValue : (swLandingPrice,totalFreightCharges,aramexInsurance) => {return swLandingPrice + totalFreightCharges + aramexInsurance},
    swDuty : (swLandingPrice,cifValue,swDutyPercentVal) => {return swLandingPrice < 18501 ? 0 : cifValue *(swDutyPercentVal/100)},
    dutyOnDuty : (swDuty,dutyOnDutyPercentVal) => {return swDuty *(dutyOnDutyPercentVal/100)},
    vatPwShipment : (spINR, vatPwShipmentPercentVal) => {return spINR * (vatPwShipmentPercentVal/100)},
    frdm : (swLandingPrice,frdmDefaultVal) => {return swLandingPrice < 18500 ? 0 : frdmDefaultVal},
    deliveryDutyPaid: (swLandingPrice, deliveryDutyPaidVal) => {return swLandingPrice < 18500 ? 0 : deliveryDutyPaidVal},
    swMargin : (spINR,swMarginPercentVal) => {return spINR * swMarginPercentVal},
    amazonCommission: (spINR,categoryPercentVal) => {return spINR * (categoryPercentVal/100) },
    uaeVatOnAmazon: (spINR,uaeVatOnAmazonPercentVal) => { return spINR * (uaeVatOnAmazonPercentVal/100)},
    returnOnProduct : (spINR,returnOnProductPercentVal) => { return spINR * (returnOnProductPercentVal/100)},
    calculation: (swLandingPrice,pwShipingChargesVal,vatPwShipment,frdm,deliveryDutyPaid,swDuty,swLocalCourierChargesVal,swMargin,amazonCommission,uaeVatOnAmazon,returnOnProduct) => { return swLandingPrice+pwShipingChargesVal+vatPwShipment+frdm+deliveryDutyPaid+swDuty+swLocalCourierChargesVal+swMargin+amazonCommission+uaeVatOnAmazon+returnOnProduct},
    roundUpSw: (calculation, roundUpVal) => { return Math.ceil(calculation/roundUpVal) * roundUpVal},
    swExtraProfitINR : (spINR,calculation) => { return spINR-calculation},
    spAED : (spINR,spAEDVal) => {return spINR/spAEDVal},
    isProfit: (calculation, spINR) => calculation <= spINR,
    salesInvoiceINR : (spINR,amazonCommission) => { return spINR-amazonCommission},
    salesInvoiceAED : (salesInvoiceINR, salesInvoiceAEDVal) => { return salesInvoiceINR/salesInvoiceAEDVal}
};

/* Declaration */
var category , asin, sku, productWeight, indPP, pwMargin, swLandingPrice, pwShippingCharges, freightChargesPerKg, totalFreightCharges, invoiceFreightCharges, aramexInsuranceCharges, aramexInsurance, cifValue, swDuty, dutyOnDuty, vatPwShipment, frdm, deliveryDutyPaid, swLocalCourier, swMargin, amazonCommission, uaeVatOnAmazon, returnOnProduct, calculation, roundUpSw, swExtraProfitINR, spINR, spAED, isProfit, salesInvoiceINR, salesInvoiceAED;
var pwMarginPerVal, swDutyPercentVal, dutyOnDutyPercentVal, vatPwShipmentPercentVal, frdmDefaultVal, deliveryDutyPaidVal, swMarginPercentVal, uaeVatOnAmazonPercentVal, returnOnProductPercentVal, roundUpVal, spAEDVal, salesInvoiceAEDVal;

function getInputs(){
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
    swDuty= document.getElementById('swDuty');
    dutyOnDuty= document.getElementById('dutyOnDuty');
    vatPwShipment= document.getElementById('vatPwShipment');
    frdm= document.getElementById('frdm');
    deliveryDutyPaid= document.getElementById('deliveryDutyPaid');
    swLocalCourier= document.getElementById('swLocalCourier');
    swMargin= document.getElementById('swMargin');
    amazonCommission= document.getElementById('amazonCommission');
    uaeVatOnAmazon= document.getElementById('uaeVatOnAmazon');
    returnOnProduct= document.getElementById('returnOnProduct');
    calculation= document.getElementById('calculation');
    roundUpSw= document.getElementById('roundUpSw');
    swExtraProfitINR= document.getElementById('swExtraProfitINR');
    spINR= document.getElementById('spINR');
    spAED= document.getElementById('spAED');
    isProfit= document.getElementById('isProfit');
    salesInvoiceINR= document.getElementById('salesInvoiceINR');
    salesInvoiceAED= document.getElementById('salesInvoiceAED');
}

function setDefaultValues(){
    //category.value = 15;
    asin.value = 'B00E966WI0';
    sku.value = 'BI0401B00E966WI0';
    pwMarginPerVal = 15;
    swDutyPercentVal = 5;
    dutyOnDutyPercentVal = 5;
    vatPwShipmentPercentVal = 5;
    frdmDefaultVal = 451;
    deliveryDutyPaidVal = 157.5;
    swMarginPercentVal = 0;
    uaeVatOnAmazonPercentVal = 5;
    returnOnProductPercentVal = 5;
    roundUpVal = 5;
    spAEDVal = 22;
    salesInvoiceAEDVal = 22;
    freightChargesPerKg.value = 3;
    aramexInsuranceCharges.value = 1;
    swLocalCourier.value = 210;
}

function enableSpINR(){  
    getInputs();  
    setDefaultValues();
    if(productWeight.value!="" && indPP.value!="" && category.value!= ""){
            pwShippingCharges.value = formulas.pwShippingCharges(Number(productWeight.value), indDB);
            console.log(pwShippingCharges.value);
            spINR.value = (Number(indPP.value) + Number(pwShippingCharges.value) + Number(swLocalCourier.value));
            generateProfit(true);
        }
}

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
            if(Number(swExtraProfitINR.value) > 2) 
                generateProfit(true);
            else
                generateProfit(false);
        }
    }else if(isIncre){
        isProfit.innerHTML = "Loss";
        isProfit.style.backgroundColor = "red";
        spINR.value = Number(spINR.value) + 1000;
        generateProfit(isIncre);
        spINR.readOnly = false;
    }
}

function generateProfit(isIncre){
    getInputs();
    pwMargin.value = formulas.pwMargin(Number(indPP.value),Number(pwMarginPerVal));
    swLandingPrice.value = formulas.swLandingPrice(Number(indPP.value),Number(pwMargin.value));
    
    totalFreightCharges.value = formulas.totalFreightCharges(Number(swLandingPrice.value),Number(productWeight.value),Number(freightChargesPerKg.value));
    invoiceFreightCharges.value = formulas.invoiceFreightCharges(Number(swLandingPrice.value),Number(totalFreightCharges.value));
    aramexInsurance.value = formulas.aramexInsurance(Number(invoiceFreightCharges.value),Number( aramexInsuranceCharges.value));
    cifValue.value = formulas.cifValue(Number(swLandingPrice.value),Number(totalFreightCharges.value),Number(aramexInsurance.value));
    swDuty.value = formulas.swDuty(Number(swLandingPrice.value),Number(cifValue.value),Number(swDutyPercentVal));
    dutyOnDuty.value = formulas.dutyOnDuty(Number(swDuty.value),Number(dutyOnDutyPercentVal));
    vatPwShipment.value = formulas.vatPwShipment(Number(spINR.value),Number(vatPwShipmentPercentVal));
    frdm.value = formulas.frdm(Number(swLandingPrice.value),Number(frdmDefaultVal));
    deliveryDutyPaid.value = formulas.deliveryDutyPaid(Number(swLandingPrice.value),Number(deliveryDutyPaidVal));
    swMargin.value = formulas.swMargin(Number(spINR.value),Number(swMarginPercentVal));
    amazonCommission.value = formulas.amazonCommission(Number(spINR.value),Number(category.value));
    uaeVatOnAmazon.value = formulas.uaeVatOnAmazon(Number(spINR.value),Number(uaeVatOnAmazonPercentVal));
    returnOnProduct.value = formulas.returnOnProduct(Number(spINR.value),Number(returnOnProductPercentVal));
    calculation.value = formulas.calculation(Number(swLandingPrice.value),Number(pwShippingCharges.value),Number(vatPwShipment.value),Number(frdm.value),Number(deliveryDutyPaid.value),Number(swDuty.value),Number(swLocalCourier.value),Number(swMargin.value),Number(amazonCommission.value),Number(uaeVatOnAmazon.value),Number(returnOnProduct.value));
    roundUpSw.value = formulas.roundUpSw(Number(calculation.value),Number(roundUpVal));
    swExtraProfitINR.value = formulas.swExtraProfitINR(Number(spINR.value),Number(calculation.value));
    spAED.value = formulas.spAED(Number(spINR.value),Number(spAEDVal));
    salesInvoiceINR.value = formulas.salesInvoiceINR(Number(spINR.value),Number(amazonCommission.value));
    salesInvoiceAED.value = formulas.salesInvoiceAED(Number(salesInvoiceINR.value),Number(salesInvoiceAEDVal));
    checkForProfit(formulas.isProfit(Number(calculation.value),Number(spINR.value)), isIncre);
    spINR.readOnly = true;
    
}

const indDB = {0.5:150.00,1:200.00,1.5:350.00,2:500.00,
    2.5:650.00,3:800.00,3.5:950.00,4:1100.00,4.5:1290.00,
    5:1360.00,5.5:1420.00,6:1480.00,6.5:1550.00,7:1610.00,
    7.5:1670.00,8:1740.00,8.5:1800.00,9:1860.00,9.5:1930.00,
    10:3250.00,10.5:3350.00,11:3440.00,11.5:3540.00,12:3630.00,
    12.5:3720.00,13:3820.00,13.5:3910.00,14:4000.00,14.5:4100.00,
    15:4190.00,15.5:4280.00,16:4380.00,16.5:4470.00,17:4560.00,
    17.5:4660.00,18:4750.00,18.5:4840.00,19:4940.00,19.5:5030.00,20:5130.00};