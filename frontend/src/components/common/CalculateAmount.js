import axios from 'axios';

export const CalDomestic = (vatCd, priceUnit, price, su, qty, weight) => {
  //qty : 수량 weight : 중량에 맞춰서 넣어야합니다.(db상에서 반대로 된 경우가 있음)

  let okAmt;
  let tax;
  let amount;

  if (!vatCd) return 'fail';
  //1. 세금계산서(일반과세)
  else if (vatCd === '103001' || vatCd === '103004' || vatCd === '103006' || vatCd === '103011' || vatCd === '103013' || vatCd === '103015') {
    if (priceUnit === '220001') {
      amount = Math.round(qty * weight * price);
    } else if (priceUnit === '220002') {
      amount = Math.round(su * weight * price);
    } else {
      amount = Math.round(qty * price);
    }
    okAmt = (amount * 110) / 100;
    tax = amount * 0.1;
    //2. 세금계산서(영세율) - 계산서 - 부가세없음
  } else if (
    vatCd === '103003' ||
    vatCd === '103005' ||
    vatCd === '103007' ||
    vatCd === '103009' ||
    vatCd === '103010' ||
    vatCd === '103012' ||
    vatCd === '103014' ||
    vatCd === '103016' ||
    vatCd === '103017'
  ) {
    if (priceUnit === '220001') {
      amount = Math.round(qty * weight * price);
    } else if (priceUnit === '220002') {
      amount = Math.round(su * weight * price);
    } else {
      amount = Math.round(qty * price);
    }
    okAmt = qty * price;
    tax = 0;
    //3. 부가세 포함
  } else if (vatCd === '103002') {
    if (priceUnit === '220001') {
      amount = Math.round(qty * weight * price);
    } else if (priceUnit === '220002') {
      amount = Math.round((su * weight * price) / 1.1);
    } else {
      amount = Math.round((qty * price) / 1.1);
    }
    okAmt = Math.round(qty * price);
    tax = okAmt - amount;
  }
  return { okAmt: okAmt, tax: tax, amount: amount };
};

export const fCalRate = async (accunit, RateDate, BeCurrCd, Chcurrcd) => {
  try {
    let result = await axios.get('/@api/common/calculate/selectByRate', {
      params: {
        accunit: accunit,
        RateDate: RateDate,
        BeCurrCd: BeCurrCd,
        Chcurrcd: Chcurrcd,
      },
    });
    return result.data;
    //실패시 fail 리턴.
  } catch (error) {
    return 'fail';
  }
};

export default CalDomestic;
