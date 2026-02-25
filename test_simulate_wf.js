const sample = [
  {
    "id": "hAKYe1IjD8TrpQe3ENIq",
    "text": "",
    "pros": "",
    "cons": "",
    "productValuation": 5,
    "createdDate": "2026-02-25T15:05:33Z",
    "answer": null,
    "state": "none",
    "productDetails": {
      "imtId": 126551291,
      "nmId": 149420888,
      "productName": "топ вечерний с камнями",
      "supplierArticle": "светло-бледно-зеленый",
      "supplierName": "Гасратов Рамин Расул оглы ИП",
      "brandName": "My Shape",
      "size": "единый"
    },
    "video": null,
    "wasViewed": false,
    "photoLinks": null,
    "userName": "Валентина",
    "orderStatus": "buyout",
    "matchingSize": "",
    "isAbleSupplierFeedbackValuation": true,
    "supplierFeedbackValuation": 0,
    "isAbleSupplierProductValuation": true,
    "supplierProductValuation": 0,
    "isAbleReturnProductOrders": true,
    "returnProductOrdersDate": null,
    "bables": [
      "хорошо сидит",
      "внешний вид",
      "качество",
      "приятно на ощупь",
      "удобно носить"
    ],
    "lastOrderShkId": 37618027136,
    "lastOrderCreatedAt": "2026-02-22T16:57:24.63363Z",
    "color": "Светло серо-зеленый",
    "subjectId": 185,
    "subjectName": "Топы",
    "parentFeedbackId": null,
    "childFeedbackId": null,
    "customerName": "Валентина",
    "dateMoscow": "25.02.2026, 18:05",
    "reviewId": "hAKYe1IjD8TrpQe3ENIq"
  }
];

function unpackOriginal(items) {
  return items.map(item => {
    let moscowDate = null;
    let moscowDateFormatted = null;
    if (item.createdDate) {
      const utcDate = new Date(item.createdDate);
      const moscowTime = new Date(utcDate.getTime() + 10800000);
      moscowDate = moscowTime;
      moscowDateFormatted = moscowTime.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    const customerName = item.authorName &&
                         item.authorName !== 'Покупатель Wildberries' &&
                         item.authorName.trim() !== ''
      ? item.authorName.trim()
      : null;

    return {
      ...item,
      customerName: customerName,
      dateMoscow: moscowDateFormatted
    };
  });
}

function unpackFixed(items) {
  return items.map(item => {
    let moscowDate = null;
    let moscowDateFormatted = null;
    if (item.createdDate) {
      const utcDate = new Date(item.createdDate);
      const moscowTime = new Date(utcDate.getTime() + 10800000);
      moscowDate = moscowTime;
      moscowDateFormatted = moscowTime.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    // prefer explicit authorName, fallback to existing customerName
    const customerName = (item.authorName && item.authorName !== 'Покупатель Wildberries' && item.authorName.trim() !== '')
      ? item.authorName.trim()
      : (item.customerName && item.customerName.trim() !== '' ? item.customerName.trim() : null);

    const productName = item.productName || (item.productDetails && item.productDetails.productName) || null;

    return {
      ...item,
      customerName: customerName,
      productName: productName,
      dateMoscow: moscowDateFormatted
    };
  });
}

function buildUserPrompt(item) {
  const namePart = item.customerName ? 'Покупатель: ' + item.customerName + '\\n\\n' : '';
  const productPart = 'Товар: ' + (item.productName || 'товар') + '\\n\\n';
  const ratingPart = 'Оценка: ' + item.productValuation + ' звёзд\\n\\n';
  const textPart = 'Отзыв: ' + (item.text || '') + '\\n\\n';
  return namePart + productPart + ratingPart + textPart + 'Напиши благодарственный ответ на русском языке.';
}

function simulateSendPayload(item, aiOutput) {
  const resolvedText = aiOutput || item.text || item.answer || (Array.isArray(item.choices) && item.choices[0] && (item.choices[0].message && item.choices[0].message.content ? item.choices[0].message.content : item.choices[0].text)) || '';
  return {
    id: item.id,
    text: resolvedText
  };
}

console.log('--- Simulation with ORIGINAL Unpack logic ---');
const orig = unpackOriginal(sample)[0];
console.log('Unpacked object (original):', JSON.stringify(orig, null, 2));
const promptOrig = buildUserPrompt(orig);
console.log('\nUser Prompt (original):', promptOrig);
const mockAiOrig = (orig.customerName ? `Спасибо, ${orig.customerName}! Благодарим за высокую оценку.` : 'Здравствуйте! Благодарим за высокую оценку.');
const payloadOrig = simulateSendPayload(orig, mockAiOrig);
console.log('\nPayload to Send (original):', JSON.stringify(payloadOrig, null, 2));

console.log('\n--- Simulation with FIXED Unpack logic ---');
const fixed = unpackFixed(sample)[0];
console.log('Unpacked object (fixed):', JSON.stringify(fixed, null, 2));
const promptFixed = buildUserPrompt(fixed);
console.log('\nUser Prompt (fixed):', promptFixed);
const mockAiFixed = (fixed.customerName ? `Спасибо, ${fixed.customerName}! Благодарим за высокую оценку товара ${fixed.productName || 'товар'}.` : `Здравствуйте! Благодарим за высокую оценку товара ${fixed.productName || 'товар'}.`);
const payloadFixed = simulateSendPayload(fixed, mockAiFixed);
console.log('\nPayload to Send (fixed):', JSON.stringify(payloadFixed, null, 2));

process.exit(0);
