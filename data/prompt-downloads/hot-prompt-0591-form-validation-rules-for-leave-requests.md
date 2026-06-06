# 热门英文 Prompt 0591：Form Validation Rules for Leave Requests

## 分类
热门英文 / STRUCTURED / awesome-chatgpt-prompts / muhtesemozgur9

## Prompt
```text
{
  "rules": [
    {
      "leaveType": "Evlilik İzni",
      "validity": "Personelin evlenmesi halinde 3 iş günü şeklinde kullandırılır.",
      "maxDays": 3
    },
    {
      "leaveType": "Doğum İzni (Eş)",
      "validity": "Personelin eşinin doğum yapması halinde 5 iş günü",
      "maxDays": 5
    },
    {
      "leaveType": "I.Derece Yakın Ölümü İçin İzin",
      "validity": "Personelin ana, baba, kardeş, eş ve çocuklarının ölümü halinde 3 iş günü",
      "maxDays": 3
    },
    {
      "leaveType": "Doğal Afet",
      "validity": "Doğal afet olması halinde 10 iş gününe kadar kullanılan izindir.",
      "maxDays": 10
    },
    {
      "leaveType": "Ücretli Doğum İzni",
      "validity": "Gebelik ve analık halinde Kanunu’na göre islem yapılır. Kadın personelin dogumdan önce 8 hafta ve dogumdan sonra 8 hafta olmak üzere çalıstırılmamaları esastır. Çogul gebelik halinde dogumdan önce çalıstırılmayacak 8 haftalık süreye iki hafta süre eklenir.",
      "preBirthWeeks": 8,
      "postBirthWeeks": 8,
      "extraWeeksForMultiplePregnancy": 2,
      "workUntilPreWeeks": 3
    },
    {
      "leaveType": "Ücretsiz Doğum İzni",
      "validity": "Ücretli doğum izninin bitmesi durumunda çalışanın talebi üzerine 6 aya kadar verilen izindir. Parçalar halinde kullanılamaz.",
      "maxMonths": 6
    },
    {
      "leaveType": "Hamile Çalışan Sağlık Kontrol İzni",
      "validity": "Hamile çalışanın hamileliğini belgelemesi durumunda aylık kontrollerinde kullanılabilen ve gün kısıtı bulunmayan izin türüdür.",
      "documentationRequired": true
    },
    {
      "leaveType": "Sosyal Mazeret İzni",
      "validity": "Çalışanın bir yılda kullanabilecegi mazeret izni toplam 3 iş günüdür. 3 günü aşan izinler yıllık izinden düşürülür.",
      "maxDaysPerYear": 3
    },
    {
      "leaveType": "Ücretsiz İzin",
      "validity": "Çalışanın yazılı talebi üzerine işverenin uygun görmesi durumunda kısıtı bulunmayan izin türüdür.",
      "documentationRequired": true
    }
  ],
  "generalRules": {
    "duplicateCheck": "Daha önce aynı tarihler içinde bir izin talebi varsa kullanıcının tekrar izin talep etmemeli.",
    "applicableFormId": 1
  }
}
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-0591-form-validation-rules-for-leave-requests
