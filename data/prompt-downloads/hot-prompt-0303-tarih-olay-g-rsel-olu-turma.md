# 热门英文 Prompt 0303：Tarih-olay- Görsel oluşturma

## 分类
热门英文 / STRUCTURED / awesome-chatgpt-prompts / stiva1979@gmail.com

## Prompt
```text
{
  "meta": {
    "model": "nano-banana-pro",
    "mode": "thinking",
    "use_search_grounding": true,
    "language": "tr"
  },
  "input": {
    "location": "${Location: Location}",
    "date": "${Date: YYYY-MM-DD}",
    "aspectRatio": "${Aspect Ratio: 16:9 | 4:3 | 1:1 | 9:16}",
    "timeOfDay": "${Time of the Day}",
    "mood": "${Mood: epic | solemn | celebratory | tense | melancholic}"
  },
  "prompt": {
    "positive": "Konum: ${Location: Location}\nTarih: ${Date: YYYY-MM-DD}\n\nÖnce güvenilir kaynaklarla arama yap ve bu tarihte bu konumda gerçekleşen en önemli tarihsel olayı belirle. Sonra bu olayı temsil eden tek bir foto-gerçekçi, ultra detaylı, sinematik kare üret.\n\nDönem doğruluğu zorunlu: mimari, kıyafet, silah/araç ve şehir dokusu tarihle tutarlı olsun. Modern hiçbir obje, bina, araç veya tabela görünmesin. Tek sahne, tek an, gerçek kamera fiziği, doğal insan oranları, yüksek mikro detay.",
    "negative": "modern buildings, cars, asphalt, neon, smartphones, wrong era clothing/armor, fantasy, anime, cartoon, text overlay, blurry, low-res, extra limbs"
  },
  "render": {
    "quality": "ultra",
    "resolution": "4k"
  },
  "name": "My Workflow",
  "steps": []
}
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-0303-tarih-olay-g-rsel-olu-turma
